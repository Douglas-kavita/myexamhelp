export default function robots() {
  const baseUrl = "https://example.com"; // change later
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

