import { getAllPostMeta } from "@/lib/posts";

export default function sitemap() {
  const baseUrl = "https://example.com"; // change later

  const staticRoutes = [
    "",
    "/services",
    "/pricing",
    "/blog",
    "/about",
    "/contact",
  ].map((p) => ({
    url: `${baseUrl}${p}`,
    lastModified: new Date(),
  }));

  const blogRoutes = getAllPostMeta().map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(p.date),
  }));

  return [...staticRoutes, ...blogRoutes];
}
