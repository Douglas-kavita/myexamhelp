// src/app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getAllPostMeta, getPostBySlug } from "@/lib/posts";
import { marked } from "marked";
import Image from "next/image";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return getAllPostMeta().map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = getPostBySlug(slug);
  if (!post) return notFound();

  // ✅ IMPORTANT: marked.parse can be async depending on version/config
  const html = await marked.parse(post.content);

  return (
    <main className="min-h-screen bg-white">
      <article className="mx-auto max-w-4xl px-6 pt-28 pb-16">
        {post.image && (
          <div className="relative mb-10 h-[400px] w-full overflow-hidden rounded-2xl">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <h1 className="text-3xl font-bold">{post.title}</h1>

        {post.date ? <p className="mt-2 text-sm text-gray-500">{post.date}</p> : null}

        <div
          className="prose prose-lg mt-8 max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </main>
  );
}