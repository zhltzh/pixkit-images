import type { Metadata } from "next";
import { InfoPage } from "../info-page";
import { ContactEmail } from "../contact-email";
import { absoluteUrl } from "../site-config";

export const metadata: Metadata = {
  title: "联系我们｜Pixkit 图片工具反馈",
  description: "向 Pixkit 团队反馈问题、建议功能或提出合作意向，我们通常会在几天内回复。",
  alternates: { canonical: absoluteUrl("/contact") },
};

export default function ContactPage() {
  return <InfoPage eyebrow="CONTACT" title="联系我们" intro="每一条消息我们都会阅读，通常几天内回复。">
    <section><h2>邮件反馈</h2><p><ContactEmail label="bushiyayaya@qq.com" className="contact-mail" /></p></section>
    <section><h2>问题反馈</h2><p>发现缺陷或有功能建议？请说明使用的浏览器与设备，并尽可能附上示例图片（请勿发送涉及隐私的照片）。</p></section>
    <section><h2>其他站点的反馈</h2><p>AIXUNO 站群其他工具的问题，请通过对应站点页脚的联系方式反馈，这样能更快找到负责的维护者。</p></section>
  </InfoPage>;
}
