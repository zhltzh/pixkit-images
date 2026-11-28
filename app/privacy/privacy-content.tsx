"use client";

import { InfoPage } from "../info-page";

export function PrivacyContent() {
  const en = useI18n().locale === "en";
  return (
    <InfoPage
      eyebrow="PRIVACY"
      title="Privacy Policy"
      intro="Pixkit processes your images entirely on your device. No uploads, no accounts, no tracking of your files."
      eyebrowEn="PRIVACY"
      titleEn="Privacy Policy"
      introEn="Pixkit processes your images entirely on your device. No uploads, no accounts, no tracking of your files."
    >
      {en ? (
        <>
          <section><h2>Your images stay on your device</h2><p>Pixkit has no server that receives your images. Conversion, compression, resizing, cropping, watermarking and renaming all run locally in your browser tab.</p></section>
          <section><h2>What we store</h2><ul><li>Your language preference, saved in your browser&apos;s localStorage. It never leaves your device.</li></ul></section>
          <section><h2>What we do not do</h2><ul><li>We do not upload, store, or view your images.</li><li>We do not require accounts, sign-ups, or personal information.</li><li>We do not track the content of your images or build profiles from them.</li></ul></section>
          <section><h2>EU users</h2><p>If you are in the European Union, you have the right to access, correct or delete any personal data we hold. Since Pixkit processes images locally and stores no personal data on our side, there is nothing for us to access or delete — your images never reach us.</p></section>
          <section><h2>Contact</h2><p>Questions about this policy? Use the feedback link in the footer.</p></section>
        </>
      ) : (
        <>
          <section><h2>你的图片留在你的设备上</h2><p>Pixkit 没有接收图片的服务器。转换、压缩、尺寸调整、裁剪、水印与重命名全部在浏览器标签页中本地完成。</p></section>
          <section><h2>我们存储什么</h2><ul><li>语言偏好，保存在浏览器的 localStorage 中，不会离开你的设备。</li></ul></section>
          <section><h2>我们不会做什么</h2><ul><li>不上传、存储或查看你的图片。</li><li>不需要账号、注册或个人信息。</li><li>不追踪图片内容，不据此建立画像。</li></ul></section>
          <section><h2>欧盟用户</h2><p>如果你位于欧盟，你拥有访问、更正或删除我们持有的个人数据的权利。由于 Pixkit 在本地处理图片、我们一方不存储任何个人数据，你的图片从未到达我们这里，因此无需也无法由我们访问或删除。</p></section>
          <section><h2>联系</h2><p>对本政策有疑问？请使用页脚的反馈链接。</p></section>
        </>
      )}
    </InfoPage>
  );
}
