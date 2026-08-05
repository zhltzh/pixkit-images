import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { absoluteUrl } from "../../site-config";
import { ImageWorkbench } from "../../workbench";
import { toolContent, toolIdFromSlug, toolIds } from "../../tool-content";

type ToolPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return toolIds.map((id) => ({ slug: toolContent[id].slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const toolId = toolIdFromSlug(slug);
  if (!toolId) return {};
  const content = toolContent[toolId];
  const canonical = absoluteUrl(`/tools/${content.slug}`);

  return {
    title: `${content.metaTitle}｜Pixkit`,
    description: content.description,
    alternates: { canonical },
    openGraph: {
      title: `${content.metaTitle}｜Pixkit`,
      description: content.description,
      type: "website",
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
  if (!toolId) notFound();
  return <ImageWorkbench initialTool={toolId} />;
}
