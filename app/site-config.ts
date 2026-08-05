const configuredSiteUrl =
  (typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_SITE_URL?.trim()
    : undefined) || "https://image.aixuno.com";

export const SITE_URL = configuredSiteUrl.replace(/\/+$/, "");

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}
