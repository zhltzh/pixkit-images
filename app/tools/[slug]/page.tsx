import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { absoluteUrl } from "../../site-config";
import { ImageWorkbench } from "../../workbench";
import { toolContent, toolIdFromSlug, toolIds } from "../../tool-content";
import { taskPageFromSlug, taskPages } from "../../task-content";

type ToolPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return [...toolIds.map((id) => ({ slug: toolContent[id].slug })), ...taskPages.map((page) => ({ slug: page.slug }))];
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const toolId = toolIdFromSlug(slug);
  const taskPage = taskPageFromSlug(slug);
  if (!toolId && !taskPage) return {};
  const content = toolId ? toolContent[toolId] : taskPage!.content;
  const canonical = absoluteUrl(`/tools/${content.slug}`);

  return {
    title: `${content.metaTitle}｜Pixkit`,
    description: content.description,
    alternates: { canonical },
    openGraph: {
      title: `${content.metaTitle}｜Pixkit`,
      description: content.description,
      type: "website",
      siteName: "Pixkit",
      locale: "zh_CN",
      url: canonical,
      images: [{ url: absoluteUrl("/og.png"), width: 1536, height: 1024 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${content.metaTitle}｜Pixkit`,
      description: content.description,
      images: [absoluteUrl("/og.png")],
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const toolId = toolIdFromSlug(slug);
  const taskPage = taskPageFromSlug(slug);
  if (!toolId && !taskPage) notFound();
  if (taskPage) return <ImageWorkbench initialTool={taskPage.tool} initialFormat={taskPage.initialFormat} pageContent={taskPage.content} />;
  return <ImageWorkbench initialTool={toolId!} />;
}
