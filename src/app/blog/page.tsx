// src/app/blog/page.tsx
import Link from "next/link";
import Image from "next/image";
import { getAllPostMeta } from "@/lib/posts";

// ✅ ensure dev always reflects changes (no stale cache)
export const revalidate = 0;
export const dynamic = "force-dynamic";

export default function BlogPage() {
  // ✅ Put this file in: /public/images/blog/blog-hero.jpg
  const heroBgUrl = "/images/blog/blog-hero.jpg"; // only leave the sections that already have pictures

  // ✅ Newest first (so featured always makes sense)
  const posts = getAllPostMeta()
    .filter((p) => !!p.image) // ✅ ONLY posts that have images
    .map((p) => {
      // ✅ Rename ONLY these 3 cards by slug (do not affect links or layout)
      if (p.slug === "lsat-exam-help-master-guide") {
        return { ...p, title: "LSAT Exam Help Master Guide" };
      }
      if (p.slug === "ged-exam-help-master-guide-us-focus") {
        return { ...p, title: "GED Exam Help Master Guide (U.S. Focus)" };
      }
      if (p.slug === "wondering-the-kind-of-help-you-need-to-pass-exams") {
        return { ...p, title: "Wondering the Kind of help you need to pass exam" };
      }
      return p;
    })
    .sort((a, b) => {
      const ad = a.date ? Date.parse(a.date) : 0;
      const bd = b.date ? Date.parse(b.date) : 0;
      return bd - ad;
    });

  const featured = posts.slice(0, 2);
  const regular = posts.slice(2); // ✅ SHOW ALL remaining posts (with images)

  return (
    <main className="min-h-screen bg-white">
      {/* ================= HERO SECTION ================= */}
      <section
        className="relative w-full"
        style={{
          backgroundImage: `url(${heroBgUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative mx-auto max-w-6xl px-6 pt-28 pb-16">
          <h1 className="text-3xl font-bold text-white">Latest from MyExamHelp</h1>
          <p className="mt-2 text-white/80">
            Company news, guides and exam preparation articles.
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        {/* ================= FEATURED POSTS ================= */}
        <div className="space-y-12">
          {featured.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="cursor-pointer overflow-hidden rounded-2xl bg-white shadow transition hover:shadow-lg">
                {post.image && (
                  <div className="relative h-[420px] w-full">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}

                <div className="p-6">
                  <p className="text-sm text-blue-600 uppercase">{post.category}</p>
                  <h2 className="mt-2 text-2xl font-semibold">{post.title}</h2>
                  <p className="mt-3 text-gray-600">
                    {post.excerpt || post.description || "Read the full guide →"}
                  </p>
                  <span className="mt-4 inline-block text-blue-600 font-medium">
                    Read More →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* ================= SMALLER POSTS ================= */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {regular.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="cursor-pointer overflow-hidden rounded-xl bg-white shadow transition hover:shadow-lg">
                {post.image && (
                  <div className="relative h-52 w-full">
                    <Image src={post.image} alt={post.title} fill className="object-cover" />
                  </div>
                )}

                <div className="p-5">
                  <p className="text-xs text-blue-600 uppercase">{post.category}</p>
                  <h3 className="mt-2 font-semibold">{post.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {post.excerpt || post.description || "Read the full post →"}
                  </p>
                  <span className="mt-3 inline-block text-blue-600 text-sm">
                    Read More →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}