// src/lib/posts.ts
import fs from "fs";
import path from "path";

export type PostMeta = {
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
  image?: string;
  date?: string;
  category?: "services" | "free-tools" | "general";
  tags?: string[];
};

export type Post = PostMeta & {
  content: string;
};

const ROOT = process.cwd();

// ✅ Support BOTH locations:
// 1) /content/posts
// 2) /src/content/posts
const POSTS_DIR_PRIMARY = path.join(ROOT, "content", "posts");
const POSTS_DIR_FALLBACK = path.join(ROOT, "src", "content", "posts");

function getPostsDir() {
  if (fs.existsSync(POSTS_DIR_PRIMARY)) return POSTS_DIR_PRIMARY;
  return POSTS_DIR_FALLBACK;
}

// ✅ Support .md and .mdx, but keep SAME slug name
function fileToSlug(filename: string) {
  return filename.replace(/\.(md|mdx)$/i, "");
}

// Very simple frontmatter parser (YAML-ish)
function parseFrontmatter(raw: string): { meta: Partial<PostMeta>; content: string } {
  if (!raw.startsWith("---")) return { meta: {}, content: raw };

  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { meta: {}, content: raw };

  const fm = raw.slice(3, end).trim();
  const content = raw.slice(end + 4).trim();

  const meta: Record<string, any> = {};
  for (const line of fm.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;

    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();

    // arrays like: tags: [a, b]
    if (val.startsWith("[") && val.endsWith("]")) {
      meta[key] = val
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      meta[key] = val.replace(/^"|"$/g, "").replace(/^'|'$/g, "");
    }
  }

  return { meta, content };
}

function listPostFiles(dir: string) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(md|mdx)$/i.test(f)); // ✅ .md or .mdx
}

function readPostFileFromEitherDir(slug: string): string | null {
  const dirsToTry = [getPostsDir()];

  // also try the other location just in case
  const primary = POSTS_DIR_PRIMARY;
  const fallback = POSTS_DIR_FALLBACK;
  const chosen = dirsToTry[0];
  const altDir = chosen === primary ? fallback : primary;
  if (altDir && altDir !== chosen) dirsToTry.push(altDir);

  const exts = ["md", "mdx"];

  for (const dir of dirsToTry) {
    for (const ext of exts) {
      const fp = path.join(dir, `${slug}.${ext}`);
      if (fs.existsSync(fp)) return fs.readFileSync(fp, "utf8");
    }
  }

  return null;
}

export function getAllPostMeta(): PostMeta[] {
  const primaryDir = getPostsDir();

  // ✅ combine both dirs (avoid missing posts if some are in the other path)
  const allDirs = [primaryDir];
  const altDir = primaryDir === POSTS_DIR_PRIMARY ? POSTS_DIR_FALLBACK : POSTS_DIR_PRIMARY;
  if (altDir && altDir !== primaryDir) allDirs.push(altDir);

  const seen = new Set<string>();
  const metas: PostMeta[] = [];

  for (const dir of allDirs) {
    for (const f of listPostFiles(dir)) {
      const slug = fileToSlug(f);
      if (seen.has(slug)) continue; // ✅ avoid duplicates across dirs/extensions
      seen.add(slug);

      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const { meta } = parseFrontmatter(raw);

      metas.push({
        slug,
        title: meta.title || slug.replace(/-/g, " "),
        description: meta.description,
        excerpt: meta.excerpt,
        image: meta.image,
        date: meta.date,
        category: (meta.category as any) || "general",
        tags: (meta.tags as any) || [],
      });
    }
  }

  return metas;
}

export function getPostBySlug(slug: string): Post | null {
  const raw = readPostFileFromEitherDir(slug);
  if (!raw) return null;

  const { meta, content } = parseFrontmatter(raw);

  return {
    slug,
    title: meta.title || slug.replace(/-/g, " "),
    description: meta.description,
    excerpt: meta.excerpt,
    image: meta.image,
    date: meta.date,
    category: (meta.category as any) || "general",
    tags: (meta.tags as any) || [],
    content,
  };
}