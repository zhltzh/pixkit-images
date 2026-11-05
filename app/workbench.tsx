"use client";

import { ChangeEvent, DragEvent, PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { absoluteUrl } from "./site-config";
import { homeContent, toolContent, type ToolId } from "./tool-content";
import { taskPages } from "./task-content";

type SourceItem = {
  id: string;
  file: File;
  url: string;
  width: number;
  height: number;
  status: "ready" | "working" | "done" | "error";
  result?: Blob;
  resultUrl?: string;
  outputName?: string;
  outputWidth?: number;
  outputHeight?: number;
  message?: string;
};

export type Format = "original" | "image/jpeg" | "image/png" | "image/webp" | "image/avif";
type CropRatio = "none" | "custom" | "1:1" | "4:3" | "3:4" | "16:9" | "9:16";
type CropFocus = "top-left" | "top" | "top-right" | "left" | "center" | "right" | "bottom-left" | "bottom" | "bottom-right";
type Tool = ToolId;
type CropSettings = {
  ratio: CropRatio;
  focus: CropFocus;
  rotation: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
  width: number;
  height: number;
  format: Format;
};

const defaultCropSettings: CropSettings = {
  ratio: "1:1",
  focus: "center",
  rotation: 0,
  flipHorizontal: false,
  flipVertical: false,
  width: 1080,
  height: 1080,
  format: "original",
};

const formatExt: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
const outputMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const supportedMimeTypes = new Set([
  ...outputMimeTypes,
  "image/jpg",
  "image/bmp",
  "image/x-ms-bmp",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "image/svg+xml",
]);
const acceptedInputTypes = ".jpg,.jpeg,.png,.webp,.avif,.bmp,.ico,.svg";

function prettyBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
}

function sourceKey(file: File) {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

function isSupportedImage(file: File) {
  return supportedMimeTypes.has(file.type) || /\.(jpe?g|png|webp|avif|bmp|ico|svg)$/i.test(file.name);
}

function loadBitmap(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("无法读取图片"));
    };
    image.src = url;
  });
}

function canvasBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob && blob.type === type ? resolve(blob) : reject(new Error(`${type.split("/")[1].toUpperCase()} 编码暂不受此浏览器支持`))),
      type,
      quality,
    );
  });
}

function supportsCanvasFormat(type: string) {
  return new Promise<boolean>((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 2;
    canvas.height = 2;
    canvas.toBlob((blob) => resolve(blob?.type === type), type, 0.8);
  });
}

function crc32(data: Uint8Array) {
  let crc = -1;
  for (const byte of data) {
    crc ^= byte;
    for (let k = 0; k < 8; k++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ -1) >>> 0;
}

function u16(value: number) {
  return [value & 255, (value >>> 8) & 255];
}

function u32(value: number) {
  return [value & 255, (value >>> 8) & 255, (value >>> 16) & 255, (value >>> 24) & 255];
}

async function makeZip(files: { name: string; blob: Blob }[]) {
  const encoder = new TextEncoder();
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  const central: Uint8Array<ArrayBuffer>[] = [];
  let offset = 0;
  for (const file of files) {
    const name = encoder.encode(file.name);
    const data = new Uint8Array(await file.blob.arrayBuffer());
    const crc = crc32(data);
    const local = new Uint8Array([
      ...u32(0x04034b50), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0),
      ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(name.length), ...u16(0), ...name,
    ]);
    chunks.push(local, data);
    central.push(new Uint8Array([
      ...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0),
      ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(name.length), ...u16(0), ...u16(0),
      ...u16(0), ...u16(0), ...u32(0), ...u32(offset), ...name,
    ]));
    offset += local.length + data.length;
  }
  const centralSize = central.reduce((sum, part) => sum + part.length, 0);
  const end = new Uint8Array([
    ...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(files.length), ...u16(files.length),
    ...u32(centralSize), ...u32(offset), ...u16(0),
  ]);
  return new Blob([...chunks, ...central, end], { type: "application/zip" });
}

function triggerDownload(url: string, name: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function ImageWorkbench({ initialTool = "format", initialFormat = "image/webp", homePage = false, pageContent }: { initialTool?: Tool; initialFormat?: Format; homePage?: boolean; pageContent?: typeof homeContent } = {}) {
  const [items, setItems] = useState<SourceItem[]>([]);
  const [format, setFormat] = useState<Format>(initialFormat);
  const [compressFormat, setCompressFormat] = useState<Format>("original");
  const [quality, setQuality] = useState(82);
  const [resize, setResize] = useState(false);
  const [width, setWidth] = useState(1600);
  const [crop, setCrop] = useState<CropRatio>("1:1");
  const [cropFocus, setCropFocus] = useState<CropFocus>("center");
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [cropWidth, setCropWidth] = useState(1080);
  const [cropHeight, setCropHeight] = useState(1080);
  const [cropFormat, setCropFormat] = useState<Format>("original");
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [cropSettingsById, setCropSettingsById] = useState<Record<string, CropSettings>>({});
  const [rename, setRename] = useState("image");
  const [watermark, setWatermark] = useState("");
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
  const [watermarkImageUrl, setWatermarkImageUrl] = useState("");
  const [watermarkOpacity, setWatermarkOpacity] = useState(70);
  const [watermarkScale, setWatermarkScale] = useState(22);
  const [activeTool, setActiveTool] = useState<Tool>(initialTool);
  const [customContent, setCustomContent] = useState(pageContent);
  const [showHomeContent, setShowHomeContent] = useState(homePage);
  const [busy, setBusy] = useState(false);
  const [zipBusy, setZipBusy] = useState(false);
  const [encodingSupport, setEncodingSupport] = useState<{ webp: boolean; avif: boolean } | null>(null);
  const [processedCount, setProcessedCount] = useState(0);
  const [notice, setNotice] = useState<{ text: string; tone: "info" | "warning" } | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const watermarkInputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<SourceItem[]>([]);
  const lockedRef = useRef(false);
  const addFilesRef = useRef<(list: FileList | File[]) => Promise<void>>(async () => undefined);
  const locked = busy || zipBusy;
  addFilesRef.current = addFiles;

  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => { lockedRef.current = locked; }, [locked]);
  useEffect(() => {
    let active = true;
    Promise.all([supportsCanvasFormat("image/webp"), supportsCanvasFormat("image/avif")]).then(([webp, avif]) => {
      if (!active) return;
      setEncodingSupport({ webp, avif });
      setFormat((current) => (current === "image/webp" && !webp) || (current === "image/avif" && !avif) ? "image/jpeg" : current);
      setCompressFormat((current) => (current === "image/webp" && !webp) || (current === "image/avif" && !avif) ? "original" : current);
    });
    return () => { active = false; };
  }, []);
  useEffect(() => () => itemsRef.current.forEach((item) => {
    URL.revokeObjectURL(item.url);
    if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
  }), []);
  useEffect(() => () => {
    if (watermarkImageUrl) URL.revokeObjectURL(watermarkImageUrl);
  }, [watermarkImageUrl]);
  useEffect(() => {
    setItems((current) => {
      if (!current.some((item) => item.result || item.resultUrl || item.status !== "ready")) return current;
      return current.map((item) => {
        if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
        return { ...item, status: "ready", result: undefined, resultUrl: undefined, outputName: undefined, outputWidth: undefined, outputHeight: undefined, message: undefined };
      });
    });
    setProcessedCount(0);
  }, [activeTool, compressFormat, crop, cropFocus, cropFormat, cropHeight, cropWidth, flipHorizontal, flipVertical, format, quality, rename, resize, rotation, watermark, watermarkImage, watermarkOpacity, watermarkScale, width]);
  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const images = Array.from(event.clipboardData?.files || []).filter((file) => file.type.startsWith("image/"));
      if (images.length) addFilesRef.current(images);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, []);

  const totalSize = useMemo(() => items.reduce((sum, item) => sum + item.file.size, 0), [items]);
  const done = items.filter((item) => item.status === "done");
  const resultSize = done.reduce((sum, item) => sum + (item.result?.size || 0), 0);
  const activeItem = items.find((item) => item.id === activeItemId) || items[0] || null;
  const activeIndex = activeItem ? items.findIndex((item) => item.id === activeItem.id) : -1;

  function currentCropSettings(): CropSettings {
    return {
      ratio: crop,
      focus: cropFocus,
      rotation,
      flipHorizontal,
      flipVertical,
      width: Math.max(1, cropWidth || 1),
      height: Math.max(1, cropHeight || 1),
      format: cropFormat,
    };
  }

  function loadCropSettings(itemId: string) {
    const next = cropSettingsById[itemId] || defaultCropSettings;
    setCrop(next.ratio);
    setCropFocus(next.focus);
    setRotation(next.rotation);
    setFlipHorizontal(next.flipHorizontal);
    setFlipVertical(next.flipVertical);
    setCropWidth(next.width);
    setCropHeight(next.height);
    setCropFormat(next.format);
    setActiveItemId(itemId);
  }

  function saveCurrentCropSettings() {
    if (!activeItem) return;
    const next = currentCropSettings();
    setCropSettingsById((current) => ({ ...current, [activeItem.id]: next }));
    setNotice({ tone: "info", text: `已保存“${activeItem.file.name}”的裁剪设置。` });
  }

  function applyCropSettingsToAll() {
    const next = currentCropSettings();
    setCropSettingsById(Object.fromEntries(items.map((item) => [item.id, next])));
    setNotice({ tone: "info", text: `当前裁剪设置已应用到全部 ${items.length} 张图片。` });
  }

  function selectCropItem(itemId: string) {
    if (locked || itemId === activeItem?.id) return;
    if (activeItem) {
      const snapshot = currentCropSettings();
      setCropSettingsById((current) => ({ ...current, [activeItem.id]: snapshot }));
    }
    loadCropSettings(itemId);
  }

  function moveCropItem(direction: -1 | 1) {
    const next = items[activeIndex + direction];
    if (next) selectCropItem(next.id);
  }

  function setCropFocusFromPreview(event: PointerEvent<HTMLDivElement>) {
    if (locked || crop === "none" || activeItem?.resultUrl) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const horizontal = x < 1 / 3 ? "left" : x > 2 / 3 ? "right" : "center";
    const vertical = y < 1 / 3 ? "top" : y > 2 / 3 ? "bottom" : "center";
    const nextFocus = vertical === "center"
      ? horizontal
      : horizontal === "center"
        ? vertical
        : `${vertical}-${horizontal}`;
    setCropFocus(nextFocus as CropFocus);
  }
  const estimate = useMemo(() => {
    if (!items.length) return null;
    let ratio = 1;
    let detail = "实际结果取决于图片内容";
    if (activeTool === "format") {
      ratio = format === "image/avif" ? 0.5 : format === "image/webp" ? 0.68 : format === "image/jpeg" ? 0.78 : format === "image/png" ? 1.05 : 1;
      detail = format === "original" ? "保持原格式重新生成" : format === "image/jpeg" ? "预计输出为 JPG；透明区域会填充为白色" : `预计输出为 ${formatExt[format]?.toUpperCase() || "原格式"}`;
    } else if (activeTool === "compress") {
      ratio = Math.max(0.18, Math.min(0.96, 0.12 + Math.pow(quality / 100, 1.7) * 0.84));
      if (compressFormat === "image/webp") ratio *= 0.82;
      if (compressFormat === "image/avif") ratio *= 0.65;
      if (compressFormat === "image/png") ratio *= 1.05;
      detail = `${compressFormat === "original" ? "保持原格式" : `输出 ${formatExt[compressFormat].toUpperCase()}`} · 当前质量 ${quality}%`;
    } else if (activeTool === "resize") {
      const sourcePixels = items.reduce((sum, item) => sum + item.width * item.height, 0);
      const outputPixels = items.reduce((sum, item) => {
        const scale = resize && item.width > width ? width / item.width : 1;
        return sum + item.width * item.height * scale * scale;
      }, 0);
      ratio = sourcePixels ? outputPixels / sourcePixels : 1;
      detail = resize ? `最大宽度 ${width}px，保持原比例` : "尚未启用尺寸限制";
    } else if (activeTool === "crop") {
      const focusLabel: Record<CropFocus, string> = {
        "top-left": "左上", top: "上方", "top-right": "右上",
        left: "左侧", center: "居中", right: "右侧",
        "bottom-left": "左下", bottom: "下方", "bottom-right": "右下",
      };
      const flips = [flipHorizontal && "水平翻转", flipVertical && "垂直翻转"].filter(Boolean).join(" · ");
      detail = `${crop === "none" ? "保持原比例" : `${focusLabel[cropFocus]}裁剪为 ${crop}`} · 旋转 ${rotation}°${flips ? ` · ${flips}` : ""}`;
    } else {
      const watermarkTypes = [watermarkImage && "图片", watermark.trim() && "文字"].filter(Boolean).join(" + ");
      detail = watermarkTypes ? `缩略图正在预览${watermarkTypes}水印` : "添加文字或图片后可即时预览水印";
    }
    return {
      bytes: Math.max(1, Math.round(totalSize * ratio)),
      detail,
      showSize: activeTool === "format" || activeTool === "compress" || activeTool === "resize",
    };
  }, [activeTool, compressFormat, crop, cropFocus, flipHorizontal, flipVertical, format, items, quality, resize, rotation, totalSize, watermark, watermarkImage, width]);

  function outputDimensions(item: SourceItem) {
    let outputWidth = item.width;
    let outputHeight = item.height;
    const cropSettings = item.id === activeItem?.id
      ? currentCropSettings()
      : cropSettingsById[item.id] || defaultCropSettings;
    if (activeTool === "crop" && cropSettings.ratio === "custom") {
      outputWidth = cropSettings.width;
      outputHeight = cropSettings.height;
    } else if (activeTool === "crop" && cropSettings.ratio !== "none") {
      const [ratioWidth, ratioHeight] = cropSettings.ratio.split(":").map(Number);
      const targetRatio = ratioWidth / ratioHeight;
      if (outputWidth / outputHeight > targetRatio) outputWidth = Math.round(outputHeight * targetRatio);
      else outputHeight = Math.round(outputWidth / targetRatio);
    }
    if (activeTool === "resize" && resize && width > 0 && outputWidth > width) {
      const scale = width / outputWidth;
      outputWidth = Math.round(outputWidth * scale);
      outputHeight = Math.round(outputHeight * scale);
    }
    if (activeTool === "crop" && (cropSettings.rotation === 90 || cropSettings.rotation === 270)) [outputWidth, outputHeight] = [outputHeight, outputWidth];
    return { width: Math.max(1, outputWidth), height: Math.max(1, outputHeight) };
  }

  async function addFiles(list: FileList | File[]) {
    if (lockedRef.current) return;
    const incoming = Array.from(list);
    const unsupportedCount = incoming.filter((file) => !isSupportedImage(file)).length;
    const existing = new Set(itemsRef.current.map((item) => sourceKey(item.file)));
    let duplicateCount = 0;
    const files = incoming.filter((file) => {
      if (!isSupportedImage(file)) return false;
      const key = sourceKey(file);
      if (existing.has(key)) {
        duplicateCount++;
        return false;
      }
      existing.add(key);
      return true;
    });
    const loaded = await Promise.all(files.map(async (file, index) => {
      try {
        const image = await loadBitmap(file);
        return {
          id: `${Date.now()}-${index}-${file.name}`,
          file,
          url: URL.createObjectURL(file),
          width: image.naturalWidth,
          height: image.naturalHeight,
          status: "ready" as const,
        };
      } catch {
        return null;
      }
    }));
    const valid = loaded.filter(Boolean) as SourceItem[];
    const failedCount = files.length - valid.length;
    const largeCount = valid.filter((item) => item.file.size > 30 * 1024 * 1024 || item.width * item.height > 40_000_000).length;
    setItems((current) => [...current, ...valid]);
    if (!activeItemId && valid[0]) setActiveItemId(valid[0].id);
    const skipped = duplicateCount + unsupportedCount + failedCount;
    if (largeCount) {
      setNotice({ tone: "warning", text: `已添加 ${valid.length} 张图片，其中 ${largeCount} 张为大图，处理时可能需要更长时间和更多内存。${skipped ? `另有 ${skipped} 个文件未加入。` : ""}` });
    } else if (skipped) {
      setNotice({ tone: "warning", text: `已添加 ${valid.length} 张图片；跳过 ${duplicateCount} 张重复图片、${unsupportedCount} 个不支持的文件${failedCount ? `，另有 ${failedCount} 张当前浏览器无法读取` : ""}。` });
    } else if (valid.length) {
      setNotice(null);
    } else {
      setNotice({ tone: "warning", text: "没有找到可读取的新图片，请检查文件格式后重试。" });
    }

    // 文件加入后把「开始处理」按钮滚入视野，避免操作按钮落在第二三屏
    if (valid.length) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          document.querySelector(".editor-start")?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 120);
      });
    }
  }

  function onChoose(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) addFiles(event.target.files);
    event.target.value = "";
  }

  function onWatermarkImageChoose(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!isSupportedImage(file)) {
      setNotice({ tone: "warning", text: "这张水印图片格式不受支持，请选择 PNG、WebP、JPG、SVG、BMP 或 ICO。" });
      return;
    }
    const url = URL.createObjectURL(file);
    setWatermarkImage(file);
    setWatermarkImageUrl(url);
    setNotice({ tone: "info", text: `已添加图片水印“${file.name}”，可继续调整大小和透明度。` });
  }

  function clearWatermarkImage() {
    setWatermarkImage(null);
    setWatermarkImageUrl("");
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    addFiles(event.dataTransfer.files);
  }

  function removeItem(id: string) {
    const removedIndex = items.findIndex((item) => item.id === id);
    const nextActive = items[removedIndex + 1] || items[removedIndex - 1] || null;
    setItems((current) => {
      const found = current.find((item) => item.id === id);
      if (found) {
        URL.revokeObjectURL(found.url);
        if (found.resultUrl) URL.revokeObjectURL(found.resultUrl);
      }
      return current.filter((item) => item.id !== id);
    });
    setCropSettingsById((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    if (activeItemId === id) {
      if (nextActive) loadCropSettings(nextActive.id);
      else setActiveItemId(null);
    }
  }

  function clearItems() {
    items.forEach((item) => {
      URL.revokeObjectURL(item.url);
      if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
    });
    setItems([]);
    setActiveItemId(null);
    setCropSettingsById({});
    setProcessedCount(0);
    setNotice(null);
  }

  async function transform(item: SourceItem, index: number) {
    const image = await loadBitmap(item.file);
    const itemCropSettings = item.id === activeItem?.id
      ? currentCropSettings()
      : cropSettingsById[item.id] || defaultCropSettings;
    const cropSetting = activeTool === "crop" ? itemCropSettings.ratio : "none";
    const resizeEnabled = activeTool === "resize" && resize;
    const turnSetting = activeTool === "crop" ? itemCropSettings.rotation : 0;
    const flipXSetting = activeTool === "crop" && itemCropSettings.flipHorizontal;
    const flipYSetting = activeTool === "crop" && itemCropSettings.flipVertical;
    let sx = 0;
    let sy = 0;
    let sw = image.naturalWidth;
    let sh = image.naturalHeight;
    const focusX = itemCropSettings.focus.includes("left") ? 0 : itemCropSettings.focus.includes("right") ? 1 : 0.5;
    const focusY = itemCropSettings.focus.startsWith("top") ? 0 : itemCropSettings.focus.startsWith("bottom") ? 1 : 0.5;
    if (cropSetting !== "none") {
      const [rw, rh] = cropSetting === "custom"
        ? [itemCropSettings.width, itemCropSettings.height]
        : cropSetting.split(":").map(Number);
      const target = rw / rh;
      if (sw / sh > target) {
        sw = sh * target;
        sx = (image.naturalWidth - sw) * focusX;
      } else {
        sh = sw / target;
        sy = (image.naturalHeight - sh) * focusY;
      }
    }
    const scale = resizeEnabled && width > 0 && sw > width ? width / sw : 1;
    const baseW = activeTool === "crop" && cropSetting === "custom"
      ? itemCropSettings.width
      : Math.max(1, Math.round(sw * scale));
    const baseH = activeTool === "crop" && cropSetting === "custom"
      ? itemCropSettings.height
      : Math.max(1, Math.round(sh * scale));
    const turn = ((turnSetting % 360) + 360) % 360;
    const sideways = turn === 90 || turn === 270;
    const canvas = document.createElement("canvas");
    canvas.width = sideways ? baseH : baseW;
    canvas.height = sideways ? baseW : baseH;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) throw new Error("浏览器无法创建画布");
    const selectedFormat = activeTool === "format"
      ? format
      : activeTool === "compress"
        ? compressFormat
        : activeTool === "crop"
          ? itemCropSettings.format
          : "original";
    const originalType = item.file.type === "image/jpg" ? "image/jpeg" : (item.file.type || "image/png");
    const originalCanBeExported = outputMimeTypes.has(originalType);
    const requestedType = selectedFormat === "original" ? (originalCanBeExported ? originalType : "image/png") : selectedFormat;
    const targetType = requestedType === "image/avif" && encodingSupport?.avif === false
      ? (encodingSupport.webp ? "image/webp" : "image/png")
      : requestedType === "image/webp" && encodingSupport?.webp === false
        ? "image/png"
        : requestedType;
    if (targetType === "image/jpeg") {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((turn * Math.PI) / 180);
    context.scale(flipXSetting ? -1 : 1, flipYSetting ? -1 : 1);
    context.drawImage(image, sx, sy, sw, sh, -baseW / 2, -baseH / 2, baseW, baseH);
    context.setTransform(1, 0, 0, 1, 0, 0);
    if (activeTool === "brand" && watermarkImage) {
      const logo = await loadBitmap(watermarkImage);
      const maxWidth = canvas.width * watermarkScale / 100;
      const maxHeight = canvas.height * watermarkScale / 100;
      const scale = Math.min(maxWidth / logo.naturalWidth, maxHeight / logo.naturalHeight, 1);
      const logoWidth = Math.max(1, Math.round(logo.naturalWidth * scale));
      const logoHeight = Math.max(1, Math.round(logo.naturalHeight * scale));
      const padding = Math.max(12, Math.round(Math.min(canvas.width, canvas.height) * 0.025));
      context.save();
      context.globalAlpha = watermarkOpacity / 100;
      context.drawImage(logo, canvas.width - logoWidth - padding, padding, logoWidth, logoHeight);
      context.restore();
    }
    if (activeTool === "brand" && watermark.trim()) {
      const fontSize = Math.max(16, Math.round(Math.min(canvas.width, canvas.height) * 0.045));
      context.font = `600 ${fontSize}px system-ui, sans-serif`;
      context.textAlign = "right";
      context.textBaseline = "bottom";
      const padding = Math.max(16, Math.round(fontSize * 0.7));
      const metrics = context.measureText(watermark.trim());
      context.fillStyle = "rgba(10, 18, 30, .52)";
      context.fillRect(canvas.width - metrics.width - padding * 1.5, canvas.height - fontSize - padding * 1.4, metrics.width + padding, fontSize + padding);
      context.fillStyle = "#fff";
      context.fillText(watermark.trim(), canvas.width - padding, canvas.height - padding);
    }
    const outputQuality = activeTool === "compress" ? quality / 100 : 0.92;
    const blob = await canvasBlob(canvas, targetType, outputQuality);
    const ext = formatExt[targetType] || item.file.name.split(".").pop() || "png";
    const originalBase = item.file.name.replace(/\.[^.]+$/, "").replace(/[\\/:*?"<>|]/g, "-") || "image";
    const safePrefix = rename.trim().replace(/[\\/:*?"<>|]/g, "-") || "image";
    const outputBase = activeTool === "brand" ? `${safePrefix}-${String(index + 1).padStart(2, "0")}` : `${originalBase}-pixkit-${String(index + 1).padStart(2, "0")}`;
    return {
      blob,
      outputName: `${outputBase}.${ext}`,
      outputWidth: canvas.width,
      outputHeight: canvas.height,
      usedFallback: targetType !== requestedType || (selectedFormat === "original" && !originalCanBeExported),
    };
  }

  async function processAll() {
    if (!items.length || locked) return;
    lockedRef.current = true;
    setBusy(true);
    setProcessedCount(0);
    let successCount = 0;
    let failureCount = 0;
    let fallbackCount = 0;
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: "working", message: undefined } : entry));
      try {
        const { blob, outputName, outputWidth, outputHeight, usedFallback } = await transform(item, index);
        setItems((current) => current.map((entry) => {
          if (entry.id !== item.id) return entry;
          if (entry.resultUrl) URL.revokeObjectURL(entry.resultUrl);
          return { ...entry, status: "done", result: blob, resultUrl: URL.createObjectURL(blob), outputName, outputWidth, outputHeight };
        }));
        successCount++;
        if (usedFallback) fallbackCount++;
      } catch (error) {
        setItems((current) => current.map((entry) => entry.id === item.id ? {
          ...entry,
          status: "error",
          message: error instanceof Error ? error.message : "处理失败",
        } : entry));
        failureCount++;
      }
      setProcessedCount(index + 1);
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    setBusy(false);
    lockedRef.current = false;
    setNotice({
      tone: failureCount ? "warning" : "info",
      text: failureCount
        ? `已完成 ${successCount} 张，${failureCount} 张处理失败。请查看图片卡片中的原因。`
        : fallbackCount
          ? `${successCount} 张图片已完成；其中 ${fallbackCount} 张因原格式仅支持导入或当前浏览器不能编码，已自动输出为兼容格式。`
          : `${successCount} 张图片已处理完成，可以单张下载或打包下载。`,
    });
  }

  function downloadOne(item: SourceItem) {
    if (lockedRef.current || !item.resultUrl || !item.outputName) return;
    triggerDownload(item.resultUrl, item.outputName);
  }

  async function downloadZip() {
    if (lockedRef.current || done.length < 2) return;
    lockedRef.current = true;
    setZipBusy(true);
    try {
      const zip = await makeZip(done.map((item) => ({ name: item.outputName!, blob: item.result! })));
      const url = URL.createObjectURL(zip);
      const name = `${activeTool === "brand" ? rename.trim() || "images" : "pixkit-images"}-${new Date().toISOString().slice(0, 10)}.zip`;
      triggerDownload(url, name);
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setNotice({ tone: "info", text: `已将 ${done.length} 张处理结果打包为 ZIP，下载已经开始。` });
    } catch {
      setNotice({ tone: "warning", text: "ZIP 打包没有完成，请稍后重试，或先使用单张下载。" });
    } finally {
      setZipBusy(false);
      lockedRef.current = false;
    }
  }

  function selectTool(tool: Tool) {
    if (lockedRef.current) {
      setNotice({ tone: "warning", text: zipBusy ? "正在打包 ZIP，请下载开始后再切换工具。" : "当前批量任务尚未完成，请处理结束后再切换工具。" });
      return;
    }
    setActiveTool(tool);
    setCustomContent(undefined);
    setShowHomeContent(false);
    const content = toolContent[tool];
    window.history.replaceState(null, "", `/tools/${content.slug}`);
    document.title = `${content.metaTitle}｜Pixkit`;
    document.querySelector(".tool-picker")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const tools: { id: Tool; icon: string; title: string; description: string; tag: string }[] = [
    { id: "format", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 9V6.5A2.5 2.5 0 0 1 6.5 4H17"/><path d="m14 1.5 3 2.5-3 2.5"/><path d="M20 15v2.5A2.5 2.5 0 0 1 17.5 20H7"/><path d="m10 22.5-3-2.5 3-2.5"/></svg>', title: "格式转换", description: "JPG、PNG、WebP、AVIF 互转", tag: "默认" },
    { id: "compress", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v9"/><path d="m8 9 4 4 4-4"/><path d="M5 17h14"/><path d="M5 21h14"/></svg>', title: "批量压缩", description: "更小体积，保持清晰", tag: "常用" },
    { id: "resize", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 9V5a2 2 0 0 1 2-2h4"/><path d="M15 3h4a2 2 0 0 1 2 2v4"/><path d="M21 15v4a2 2 0 0 1-2 2h-4"/><path d="M9 21H5a2 2 0 0 1-2-2v-4"/></svg>', title: "调整尺寸", description: "等比例统一图片宽度", tag: "批量" },
    { id: "crop", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 2v13a3 3 0 0 0 3 3h13"/><path d="M2 6h13a3 3 0 0 1 3 3v13"/></svg>', title: "裁剪旋转", description: "统一比例与图片方向", tag: "编辑" },
    { id: "brand", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2.5c3.6 4.2 6 7 6 9.8a6 6 0 0 1-12 0c0-2.8 2.4-5.6 6-9.8Z"/><path d="M9.5 13.5h5"/></svg>', title: "水印命名", description: "添加水印并整理文件名", tag: "更多" },
  ];
  const activeContent = customContent || (showHomeContent ? homeContent : toolContent[activeTool]);

  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Pixkit 首页">
          <span className="brand-mark">P</span>
          <span>Pixkit</span>
        </Link>
        <nav aria-label="主要导航">
          <a href="#workspace">批量处理</a>
          <a href="#features">功能</a>
          <span className="privacy-pill">● 图片不离开设备</span>
        </nav>
      </header>

      {!showHomeContent && (
        <nav className="breadcrumb" aria-label="面包屑导航">
          <Link href="/">首页</Link><span aria-hidden="true">/</span><span>{activeContent.title}</span>
        </nav>
      )}

      <section className="home-intro">
        <span>PIXKIT · {activeContent.eyebrow}</span>
        <h1>{activeContent.h1}</h1>
        <p>{activeContent.intro}</p>
      </section>

      <section className="tool-picker" aria-label="选择图片工具">
        <div className="section-intro"><span>选择工具</span><p>选择一个功能，添加图片后即可开始批量处理。</p></div>
        <div className="tool-card-grid">
          {tools.map((tool) => (
            <a
              className={`tool-card ${activeTool === tool.id ? "active" : ""}`}
              href={`/tools/${toolContent[tool.id].slug}`}
              key={tool.id}
              aria-current={activeTool === tool.id ? "page" : undefined}
              onClick={(event) => {
                event.preventDefault();
                selectTool(tool.id);
              }}
            >
              <span className="tool-card-tag">{tool.tag}</span>
              <b dangerouslySetInnerHTML={{ __html: tool.icon }} />
              <strong>{tool.title}</strong>
              <small>{tool.description}</small>
            </a>
          ))}
        </div>
      </section>

      
        <section className="workbench" id="workspace">
        <input ref={inputRef} type="file" accept={acceptedInputTypes} multiple disabled={locked} onChange={onChoose} hidden />
        <input
          ref={(node) => {
            folderInputRef.current = node;
            node?.setAttribute("webkitdirectory", "");
          }}
          type="file"
          accept={acceptedInputTypes}
          multiple
          disabled={locked}
          onChange={onChoose}
          hidden
        />

        {!items.length && (
          <>
            <div className="workbench-top upload-heading">
              <span className={`task-icon theme-${activeTool}`} aria-hidden="true">{tools.find((tool) => tool.id === activeTool)?.icon}</span>
              <div>
                <h2>{activeContent.title}</h2>
                <p>{activeContent.intro}</p>
              </div>
            </div>

            <div className="upload-gateway">
              <div
                className={`dropzone ${dragging ? "is-dragging" : ""}`}
                role="group"
                tabIndex={locked ? -1 : 0}
                aria-label="图片上传区域，按回车选择图片或将文件拖入"
                aria-disabled={locked}
                onClick={(event) => {
                  if ((event.target as HTMLElement).closest("button")) return;
                  inputRef.current?.click();
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  inputRef.current?.click();
                }}
                onDrop={(event) => {
                  setDragging(false);
                  onDrop(event);
                }}
                onDragEnter={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "copy";
                }}
              >
                <span className="drag-illustration" aria-hidden="true"><i /><i /><b>↓</b></span>
                <div className="upload-message">
                  <strong>将图片拖到这里</strong>
                  <small>支持批量选择，图片不会上传到服务器</small>
                  <button className="upload-primary" type="button" disabled={locked} onClick={() => inputRef.current?.click()}>选择图片</button>
                  <div className="upload-options">
                    <button type="button" disabled={locked} onClick={() => folderInputRef.current?.click()}><span>▤</span>选择文件夹</button>
                    <button type="button" disabled={locked} onClick={() => window.focus()}><span>⌘</span>粘贴图片（Ctrl+V）</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {notice && (
          <div className={`upload-notice ${notice.tone}`} role="status">
            <span>{notice.text}</span>
            <button type="button" onClick={() => setNotice(null)} aria-label="关闭提示">×</button>
          </div>
        )}

        {!items.length && (
          <div className="upload-assurance" aria-label="上传说明">
            <span>支持批量选择</span>
            <span>图片不上传服务器</span>
            <span>主要格式 JPG · PNG · WebP · AVIF</span>
            <span>可导入 BMP · ICO · SVG</span>
          </div>
        )}

        {items.length > 0 && (
          <>
            <div className="workspace-toolbar">
              <button type="button" className="workspace-back" disabled={locked} onClick={clearItems} aria-label="返回上传图片">←</button>
              <div>
                <strong>{activeContent.title}</strong>
                <small>{items.length} 张图片 · {prettyBytes(totalSize)}</small>
              </div>
              <div className="workspace-toolbar-actions">
                <button type="button" disabled={locked} onClick={() => folderInputRef.current?.click()}>选择文件夹</button>
                <button type="button" className="workspace-add" disabled={locked} onClick={() => inputRef.current?.click()}><span>＋</span>继续添加</button>
              </div>
            </div>
            <div className={`processing-layout tool-${activeTool}`}>
              <div className="media-column">
                <div className="queue-head">
                  <div><strong>{items.length} 张图片</strong><span>共 {prettyBytes(totalSize)}</span></div>
                  <div className="status-key" aria-live="polite"><i className={`ready-dot ${busy ? "working" : done.length ? "complete" : ""}`} />{busy ? `正在处理 ${Math.min(processedCount + 1, items.length)}/${items.length}` : done.length ? `${done.length} 张已完成` : "准备就绪"}</div>
                </div>
                {activeTool === "crop" && activeItem ? (
                  <div className="crop-workspace">
                    <div className="crop-command-bar" aria-label="当前图片操作">
                      <button type="button" disabled={locked || activeIndex <= 0} onClick={() => moveCropItem(-1)} aria-label="上一张图片">←</button>
                      <button type="button" disabled={locked || activeIndex >= items.length - 1} onClick={() => moveCropItem(1)} aria-label="下一张图片">→</button>
                      <span>{activeIndex + 1} / {items.length}</span>
                      <button type="button" className="danger" disabled={locked} onClick={() => removeItem(activeItem.id)} aria-label="删除当前图片">🗑</button>
                      <button type="button" className="add" disabled={locked} onClick={() => inputRef.current?.click()} aria-label="继续添加图片">＋</button>
                    </div>
                    <div className="crop-canvas-layout">
                      <div className="crop-thumb-rail" aria-label="图片列表">
                        {items.map((item, index) => (
                          <button
                            type="button"
                            key={item.id}
                            className={item.id === activeItem.id ? "active" : ""}
                            onClick={() => selectCropItem(item.id)}
                            aria-label={`编辑第 ${index + 1} 张：${item.file.name}`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.resultUrl || item.url} alt="" />
                            <span>{index + 1}</span>
                          </button>
                        ))}
                      </div>
                      <article className="crop-stage">
                        <div
                          className="crop-stage-image"
                          onPointerDown={setCropFocusFromPreview}
                          aria-label="裁剪预览：点击画面可选择需要保留的位置"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={activeItem.resultUrl || activeItem.url}
                            alt={activeItem.file.name}
                            style={!activeItem.resultUrl ? {
                              transform: `rotate(${rotation}deg) scale(${(rotation === 90 || rotation === 270 ? 0.82 : 1) * (flipHorizontal ? -1 : 1)}, ${(rotation === 90 || rotation === 270 ? 0.82 : 1) * (flipVertical ? -1 : 1)})`,
                            } : undefined}
                          />
                          {crop !== "none" && !activeItem.resultUrl && (
                            <span
                              className="crop-preview-frame"
                              data-ratio={crop}
                              data-focus={cropFocus}
                              style={crop === "custom" ? { aspectRatio: `${Math.max(1, cropWidth)} / ${Math.max(1, cropHeight)}` } : undefined}
                              aria-hidden="true"
                            />
                          )}
                          {crop !== "none" && !activeItem.resultUrl && <span className="crop-stage-tip">点击画面，选择需要保留的位置</span>}
                        </div>
                        <footer>
                          <div>
                            <strong>{activeItem.outputName || activeItem.file.name}</strong>
                            <span>{activeItem.width} × {activeItem.height} → {outputDimensions(activeItem).width} × {outputDimensions(activeItem).height}</span>
                          </div>
                          {activeItem.status === "done" && <button type="button" onClick={() => downloadOne(activeItem)}>下载当前图片 ↓</button>}
                        </footer>
                      </article>
                    </div>
                  </div>
                ) : (
                <div className="image-grid">
                  {items.map((item) => {
                    const predicted = outputDimensions(item);
                    const displayWidth = item.outputWidth || item.width;
                    const displayHeight = item.outputHeight || item.height;
                    const willResize = !item.outputWidth && (predicted.width !== item.width || predicted.height !== item.height);
                    return (
                      <article className="image-card" key={item.id}>
                        <div className={`thumb-wrap ${activeTool === "crop" && !item.resultUrl ? "is-live-preview" : ""}`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.resultUrl || item.url}
                            alt={item.file.name}
                            style={activeTool === "crop" && !item.resultUrl ? {
                              transform: `rotate(${rotation}deg) scale(${(rotation === 90 || rotation === 270 ? 0.78 : 1) * (flipHorizontal ? -1 : 1)}, ${(rotation === 90 || rotation === 270 ? 0.78 : 1) * (flipVertical ? -1 : 1)})`,
                            } : undefined}
                          />
                          {activeTool === "crop" && crop !== "none" && !item.resultUrl && <span className="crop-preview-frame" data-ratio={crop} data-focus={cropFocus} aria-hidden="true" />}
                          {activeTool === "brand" && watermarkImageUrl && !item.resultUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              className="watermark-image-preview"
                              src={watermarkImageUrl}
                              alt=""
                              aria-hidden="true"
                              style={{ width: `${watermarkScale}%`, opacity: watermarkOpacity / 100 }}
                            />
                          )}
                          {activeTool === "brand" && watermark.trim() && !item.resultUrl && <span className="watermark-preview">{watermark.trim()}</span>}
                          <button disabled={locked} onClick={() => removeItem(item.id)} aria-label={`删除 ${item.file.name}`}>×</button>
                          <span className={`card-status ${item.status}`}>
                            {item.status === "ready" && "待处理"}
                            {item.status === "working" && "处理中"}
                            {item.status === "done" && "已完成"}
                            {item.status === "error" && "失败"}
                          </span>
                        </div>
                        <div className="card-meta">
                          <strong title={item.outputName || item.file.name}>{item.outputName || item.file.name}</strong>
                          <span>{displayWidth} × {displayHeight}{willResize ? ` → ${predicted.width} × ${predicted.height}` : ""} · {prettyBytes(item.result?.size || item.file.size)}</span>
                          {item.message && <small className="error-message">{item.message}</small>}
                          {item.status === "done" && <button className="text-button" disabled={locked} onClick={() => downloadOne(item)}>单张下载 ↓</button>}
                        </div>
                      </article>
                    );
                  })}
                </div>
                )}
              </div>

              <div className={`editor-shell theme-${activeTool}`}>
                <div className="editor-panel" key={activeTool}>
                  <div className="editor-panel-head">
                    <div><span className="step">02</span><div><h2>{tools.find((tool) => tool.id === activeTool)?.title}</h2><p>{tools.find((tool) => tool.id === activeTool)?.description}</p></div></div>
                    <span>{activeTool === "crop" ? `正在编辑 ${Math.max(1, activeIndex + 1)}/${items.length}` : "应用到全部图片"}</span>
                  </div>

                <fieldset className="settings-fieldset" disabled={locked}>
                {activeTool === "format" && <section className="focused-setting">
            <div className="setting-title"><b>↻</b><div><strong>选择输出格式</strong><span>透明图片建议选择 PNG 或 WebP</span></div></div>
            <label>输出格式
              <select value={format} onChange={(e) => {
                const nextFormat = e.target.value as Format;
                setFormat(nextFormat);
                if (nextFormat === "image/jpeg") setNotice({ tone: "warning", text: "JPG 不支持透明背景，透明区域将在导出时填充为白色。" });
              }}>
                <option value="original">保持原格式</option>
                <option value="image/jpeg">JPG</option>
                <option value="image/png">PNG（保留透明背景）</option>
                <option value="image/webp" disabled={encodingSupport?.webp === false}>WebP{encodingSupport?.webp === false ? "（当前浏览器不能导出）" : ""}</option>
                <option value="image/avif" disabled={encodingSupport?.avif === false}>AVIF{encodingSupport?.avif === false ? "（当前浏览器不能导出）" : ""}</option>
              </select>
            </label>
            <div className="format-hints"><span>JPG<small>照片兼容性最好</small></span><span>PNG<small>保留透明背景</small></span><span>WebP<small>体积与质量平衡</small></span><span>AVIF<small>新一代高压缩</small></span></div>
            {encodingSupport && (!encodingSupport.webp || !encodingSupport.avif) && <p className="compatibility-note">当前浏览器不能编码：{[!encodingSupport.webp && "WebP", !encodingSupport.avif && "AVIF"].filter(Boolean).join("、")}。相关选项已停用，可改用 JPG 或 PNG。</p>}
          </section>}

                {activeTool === "compress" && <section className="focused-setting">
            <div className="setting-title"><b>⌁</b><div><strong>控制压缩强度</strong><span>数值越高，细节保留越多</span></div></div>
            <label className="compress-format">压缩后格式
              <select value={compressFormat} onChange={(e) => {
                const nextFormat = e.target.value as Format;
                setCompressFormat(nextFormat);
                if (nextFormat === "image/jpeg") setNotice({ tone: "warning", text: "JPG 不支持透明背景，透明区域将在压缩导出时填充为白色。" });
              }}>
                <option value="original">保持原格式</option>
                <option value="image/jpeg">JPG（照片兼容）</option>
                <option value="image/png">PNG（保留透明）</option>
                <option value="image/webp" disabled={encodingSupport?.webp === false}>WebP（推荐）{encodingSupport?.webp === false ? "（当前浏览器不能导出）" : ""}</option>
                <option value="image/avif" disabled={encodingSupport?.avif === false}>AVIF（更小体积）{encodingSupport?.avif === false ? "（当前浏览器不能导出）" : ""}</option>
              </select>
            </label>
            <label className="range-label"><span>图片质量 <output>{quality}%</output></span>
              <input type="range" min="20" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
            </label>
            <div className="quality-scale"><span>文件更小</span><span>推荐 75–85%</span><span>画质更高</span></div>
            {compressFormat === "original" && items.some((item) => item.file.type === "image/png") && <p className="compatibility-note">PNG 使用无损编码，保持原格式时质量滑杆对体积影响有限；需要明显减小文件时建议选择 WebP。</p>}
          </section>}

                {activeTool === "resize" && <section className="focused-setting">
            <div className="setting-title"><b>↔</b><div><strong>调整尺寸</strong><span>等比例缩小，不放大图片</span></div></div>
            <label className="switch-row"><span>限制最大宽度</span><input type="checkbox" checked={resize} onChange={(e) => setResize(e.target.checked)} /></label>
            <label>最大宽度（像素）
              <input type="number" min="64" max="12000" value={width} disabled={!resize} onChange={(e) => setWidth(Number(e.target.value))} />
            </label>
            <div className="preset-row">{[800, 1200, 1600, 1920].map((value) => <button key={value} onClick={() => { setResize(true); setWidth(value); }}>{value}px</button>)}</div>
          </section>}

                {activeTool === "crop" && <section className="focused-setting">
            <div className="setting-title"><b>⌗</b><div><strong>裁剪图片</strong><span>先选比例，再设置尺寸和格式</span></div></div>
            <div className="crop-ratio-presets" aria-label="常用裁剪比例">
              {([
                ["none", "自由"], ["16:9", "16:9"], ["9:16", "9:16"],
                ["4:3", "4:3"], ["3:4", "3:4"], ["1:1", "1:1"], ["custom", "自定义"],
              ] as [CropRatio, string][]).map(([ratio, label]) => (
                <button type="button" key={ratio} className={crop === ratio ? "active" : ""} onClick={() => setCrop(ratio)}>{label}</button>
              ))}
            </div>
            <div className="crop-size-panel">
              <div className="crop-size-heading"><strong>输出尺寸</strong><span>像素</span></div>
              <div className="crop-size-inputs">
                <label>宽度<input type="number" min="1" max="20000" value={cropWidth} onFocus={() => setCrop("custom")} onChange={(e) => { setCrop("custom"); setCropWidth(Number(e.target.value)); }} /></label>
                <span>×</span>
                <label>高度<input type="number" min="1" max="20000" value={cropHeight} onFocus={() => setCrop("custom")} onChange={(e) => { setCrop("custom"); setCropHeight(Number(e.target.value)); }} /></label>
              </div>
            </div>
            <div className="crop-focus-setting">
              <span>裁剪区域位置</span>
              <small>直接点击左侧画面，或使用九宫格精确选择</small>
              <div className="crop-focus-grid" aria-label="裁剪区域位置">
                {([
                  ["top-left", "↖", "左上"], ["top", "↑", "上方"], ["top-right", "↗", "右上"],
                  ["left", "←", "左侧"], ["center", "●", "居中"], ["right", "→", "右侧"],
                  ["bottom-left", "↙", "左下"], ["bottom", "↓", "下方"], ["bottom-right", "↘", "右下"],
                ] as [CropFocus, string, string][]).map(([focus, icon, label]) => (
                  <button
                    type="button"
                    key={focus}
                    className={cropFocus === focus ? "active" : ""}
                    disabled={crop === "none"}
                    onClick={() => setCropFocus(focus)}
                    aria-label={`裁剪位置：${label}`}
                    title={label}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div className="crop-control-block">
              <span>旋转图片</span>
              <div className="rotation-group" aria-label="旋转角度">
                {[0, 90, 180, 270].map((angle) => <button key={angle} className={rotation === angle ? "active" : ""} onClick={() => setRotation(angle)}>{angle}°</button>)}
              </div>
            </div>
            <div className="crop-control-block">
              <span>翻转图片</span>
              <div className="flip-group" aria-label="翻转图片">
                <button type="button" className={flipHorizontal ? "active" : ""} onClick={() => setFlipHorizontal((value) => !value)}>↔ 水平翻转</button>
                <button type="button" className={flipVertical ? "active" : ""} onClick={() => setFlipVertical((value) => !value)}>↕ 垂直翻转</button>
              </div>
            </div>
            <label>保存格式
              <select value={cropFormat} onChange={(e) => setCropFormat(e.target.value as Format)}>
                <option value="original">保持原格式</option>
                <option value="image/jpeg">JPG</option>
                <option value="image/png">PNG（保留透明）</option>
                <option value="image/webp" disabled={encodingSupport?.webp === false}>WebP</option>
                <option value="image/avif" disabled={encodingSupport?.avif === false}>AVIF</option>
              </select>
            </label>
            <div className="crop-apply-actions">
              <button type="button" className="apply-current" onClick={saveCurrentCropSettings}>✓ 应用到当前图片</button>
              <button type="button" className="apply-all" onClick={applyCropSettingsToAll}>✓✓ 应用到所有图片</button>
            </div>
          </section>}

                {activeTool === "brand" && <section className="focused-setting">
            <div className="setting-title"><b>A</b><div><strong>命名与水印</strong><span>整理输出文件</span></div></div>
            <label>文件名前缀<input type="text" value={rename} maxLength={40} onChange={(e) => setRename(e.target.value)} placeholder="例如：product" /></label>
            <label>右下角文字水印<input type="text" value={watermark} maxLength={60} onChange={(e) => setWatermark(e.target.value)} placeholder="可选，例如：© 品牌名" /></label>
            <div className="watermark-upload">
              <span>右上角图片水印</span>
              <input ref={watermarkInputRef} type="file" accept={acceptedInputTypes} onChange={onWatermarkImageChoose} hidden />
              <button type="button" className="button ghost" onClick={() => watermarkInputRef.current?.click()}>
                {watermarkImage ? "更换水印图片" : "选择水印图片"}
              </button>
              {watermarkImage && (
                <div className="watermark-file">
                  <span title={watermarkImage.name}>{watermarkImage.name}</span>
                  <button type="button" onClick={clearWatermarkImage} aria-label="移除图片水印">移除</button>
                </div>
              )}
            </div>
            <label className="range-label"><span>图片水印大小 <output>{watermarkScale}%</output></span>
              <input type="range" min="8" max="45" value={watermarkScale} disabled={!watermarkImage} onChange={(e) => setWatermarkScale(Number(e.target.value))} />
            </label>
            <label className="range-label"><span>图片水印透明度 <output>{watermarkOpacity}%</output></span>
              <input type="range" min="15" max="100" value={watermarkOpacity} disabled={!watermarkImage} onChange={(e) => setWatermarkOpacity(Number(e.target.value))} />
            </label>
          </section>}
                  {estimate && (
                    <aside className="result-estimate" aria-live="polite">
                      <span>{estimate.showSize ? "预计输出" : "即时预览"}</span>
                      <strong>{estimate.showSize ? `${prettyBytes(totalSize)} → 约 ${prettyBytes(estimate.bytes)}` : estimate.detail}</strong>
                      <small>{estimate.showSize ? `${estimate.detail} · 仅供处理前参考，实际体积以导出结果为准` : "当前效果仅显示在缩略图中，处理后生成最终文件"}</small>
                    </aside>
                  )}
                </fieldset>
                </div>
                <div className="editor-action-panel" aria-live="polite">
                  <div className="editor-action-status">
                    <strong>{busy ? `正在处理 ${processedCount}/${items.length} 张` : zipBusy ? `正在打包 ${done.length} 张图片` : done.length ? `${done.length} 张已处理完成` : `准备处理 ${items.length} 张图片`}</strong>
                    <small>{done.length && !busy ? `${prettyBytes(totalSize)} → ${prettyBytes(resultSize)}` : "设置完成后开始处理"}</small>
                  </div>
                  {busy && <div className="action-progress" role="progressbar" aria-valuemin={0} aria-valuemax={items.length} aria-valuenow={processedCount}><i style={{ width: `${items.length ? processedCount / items.length * 100 : 0}%` }} /></div>}
                  <button className="button primary editor-start" disabled={locked} onClick={processAll}>{busy ? "正在处理…" : "开始处理 →"}</button>
                  <button
                    className="button secondary editor-download"
                    disabled={locked || !done.length}
                    onClick={() => done.length > 1 ? downloadZip() : done[0] && downloadOne(done[0])}
                  >
                    {zipBusy ? "正在生成 ZIP…" : done.length > 1 ? "下载全部 ZIP ↓" : "下载结果 ↓"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      <section className="tool-shot" aria-label="批量处理界面预览"><div className="tool-shot-inner"><img src="/batch-interface.webp" alt="批量处理界面：五张图片同时导入，显示各自的尺寸与体积，以及压缩后的总体积" width="2368" height="1568" loading="lazy" decoding="async" /><p>一次导入多张图片，每张的尺寸和体积都能看到，压缩前后对比一目了然。</p></div></section>

      <section className="brand-story" aria-label="Pixkit 本地图片处理">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/og.png" alt="Pixkit 批量图片本地处理流程" />
        </div>
        <article>
          <span>LOCAL-FIRST IMAGE WORKSPACE</span>
          <h2>图片留在设备里，<br />处理速度留给你。</h2>
          <p>转换、压缩、调整尺寸与裁剪都在当前浏览器中完成。无需等待上传，也不会改变原始图片。</p>
          <ul><li>批量处理</li><li>原图不修改</li><li>结果打包下载</li></ul>
        </article>
      </section>

      <section className="features" id="features">
        <div><span>100%</span><strong>本地处理</strong><p>图片只存在于你的设备，不经过服务器。</p></div>
        <div><span>5项</span><strong>核心工具</strong><p>每次专注一个处理任务，参数和结果不会互相混用。</p></div>
        <div><span>∞</span><strong>不限次数</strong><p>无需注册，打开网页就能使用。</p></div>
      </section>
      <section className="home-guide" aria-labelledby="how-pixkit-works">
        <div className="guide-heading">
          <span>HOW IT WORKS</span>
          <h2 id="how-pixkit-works">三步完成批量图片处理</h2>
          <p>所有步骤都在当前浏览器完成，原图不会被修改。</p>
        </div>
        <div className="guide-grid">
          {activeContent.steps.map((item, index) => (
            <article key={item.title}><b>{String(index + 1).padStart(2, "0")}</b><h3>{item.title}</h3><p>{item.text}</p></article>
          ))}
        </div>
        <div className="format-strip">
          <strong>主要输出格式</strong><span>JPG</span><span>PNG</span><span>WebP</span><span>AVIF</span>
          <small>另可导入 BMP、ICO、SVG 并转换</small>
        </div>
      </section>
      <section className="seo-content" aria-labelledby="about-pixkit">
        <div className="seo-lead">
          <span>{activeContent.title}指南</span>
          <h2 id="about-pixkit">{activeContent.aboutTitle}</h2>
          <p>{activeContent.aboutText}</p>
        </div>
        <div className="seo-grid">
          {activeContent.facts.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}
        </div>
        <div className="faq">
          <h2>常见问题</h2>
          {activeContent.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
        </div>
        <nav className="related-tools" aria-label="相关图片工具">
          <div><span>相关工具</span><h2>继续处理这些图片</h2></div>
          <div>
            {activeContent.related.map((id) => (
              <a href={`/tools/${toolContent[id].slug}`} key={id}>
                <strong>{toolContent[id].title}</strong><small>{toolContent[id].intro}</small><span aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        </nav>
        <nav className="task-pages" aria-label="常用图片处理任务">
          <div><span>常用任务</span><h2>直接完成具体图片任务</h2></div>
          <div>
            {taskPages.filter((page) => page.tool === activeTool).slice(0, 8).map((page) => (
              <a href={`/tools/${page.slug}`} key={page.slug}>{page.content.title}<span aria-hidden="true">→</span></a>
            ))}
          </div>
        </nav>
      </section>
      <footer>
        <span>Pixkit · <a href="https://aixuno.com">AIXUNO 旗下图片工具</a></span>
        <nav aria-label="站点信息"><a href="/about">关于</a><a href="/privacy">隐私</a><a href="/changelog">更新记录</a></nav>
        <span>隐私优先 · 浏览器本地处理</span>
      </footer>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              name: "Pixkit",
              applicationCategory: "MultimediaApplication",
              operatingSystem: "Any",
              browserRequirements: "Requires a modern browser with Canvas support",
              offers: { "@type": "Offer", price: "0", priceCurrency: "CNY" },
              publisher: { "@id": "https://aixuno.com/#organization" },
              url: absoluteUrl(showHomeContent ? "/" : `/tools/${activeContent.slug}`),
              description: activeContent.description,
              featureList: ["JPG PNG WebP AVIF 格式转换", "导入 BMP ICO SVG", "批量压缩", "批量调整尺寸", "裁剪、旋转与翻转", "添加文字与图片水印", "批量重命名", "ZIP 下载"],
            },
            {
              "@type": "FAQPage",
              mainEntity: activeContent.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            },
            {
              "@type": "HowTo",
              name: activeContent.aboutTitle,
              description: activeContent.aboutText,
              step: activeContent.steps.map((item, index) => ({
                "@type": "HowToStep",
                position: index + 1,
                name: item.title,
                text: item.text,
              })),
            },
            ...(!showHomeContent ? [{
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "首页", item: absoluteUrl("/") },
                { "@type": "ListItem", position: 2, name: activeContent.title, item: absoluteUrl(`/tools/${activeContent.slug}`) },
              ],
            }] : []),
          ],
        }) }}
      />
    </main>
  );
}
