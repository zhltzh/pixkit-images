"use client";

import { useEffect, useState } from "react";

/**
 * 反馈邮箱入口。
 *
 * 静态 HTML 里不出现完整邮箱地址（防止被垃圾邮件爬虫抓取），
 * 客户端挂载后才拼出 mailto，服务端渲染 href 为 "#"，文本一致，
 * 因此不会出现 hydration 警告。
 */
const EMAIL_USER = "bushiyayaya";
const EMAIL_DOMAIN = "qq.com";

export function ContactEmail({ label, className }: { label: string; className?: string }) {
  const [href, setHref] = useState("#");

  useEffect(() => {
    const address = [EMAIL_USER, EMAIL_DOMAIN].join("@");
    setHref(`mailto:${address}?subject=${encodeURIComponent("Pixkit 反馈")}`);
  }, []);

  return (
    <a href={href} className={className} rel="nofollow">
      {label}
    </a>
  );
}
