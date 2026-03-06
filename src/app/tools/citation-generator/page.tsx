"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type SourceType = "website" | "book" | "journal";

function clean(s: string) {
  return (s || "").trim();
}

function formatAuthor(author: string, style: "apa" | "mla" | "chicago") {
  // simple: "First Last" or "Last, First"
  const a = clean(author);
  if (!a) return "";
  const parts = a.split(/\s+/);
  if (parts.length < 2) return a;

  const last = parts[parts.length - 1];
  const first = parts[0];
  const restInitials = parts.slice(1, -1).map((p) => p[0].toUpperCase() + ".").join(" ");

  if (style === "apa") return `${last}, ${first[0].toUpperCase()}. ${restInitials}`.replace(/\s+/g, " ").trim();
  if (style === "mla") return `${last}, ${first} ${parts.slice(1, -1).join(" ")}`.replace(/\s+/g, " ").trim();
  return `${first} ${parts.slice(1, -1).join(" ")} ${last}`.replace(/\s+/g, " ").trim();
}

export default function Page() {
  const [style, setStyle] = useState<"apa" | "mla" | "chicago">("apa");
  const [type, setType] = useState<SourceType>("website");

  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [site, setSite] = useState("");
  const [publisher, setPublisher] = useState("");
  const [year, setYear] = useState("");
  const [url, setUrl] = useState("");
  const [accessed, setAccessed] = useState("");

  const citation = useMemo(() => {
    const A = formatAuthor(author, style);
    const T = clean(title);
    const S = clean(site);
    const P = clean(publisher);
    const Y = clean(year);
    const U = clean(url);
    const Acc = clean(accessed);

    if (!T) return "";

    if (type === "website") {
      if (style === "apa") {
        // APA (simplified)
        return `${A ? `${A}. ` : ""}${Y ? `(${Y}). ` : ""}${T}. ${S ? `${S}. ` : ""}${U}`;
      }
      if (style === "mla") {
        return `${A ? `${A}. ` : ""}"${T}." ${S ? `${S}, ` : ""}${Y ? `${Y}, ` : ""}${U}${Acc ? `. Accessed ${Acc}.` : ""}`;
      }
      // Chicago (simplified)
      return `${A ? `${A}. ` : ""}"${T}." ${S ? `${S}. ` : ""}${Y ? `${Y}. ` : ""}${U}${Acc ? ` (accessed ${Acc}).` : ""}`;
    }

    if (type === "book") {
      if (style === "apa") {
        return `${A ? `${A}. ` : ""}${Y ? `(${Y}). ` : ""}${T}. ${P}`;
      }
      if (style === "mla") {
        return `${A ? `${A}. ` : ""}${T}. ${P}${Y ? `, ${Y}` : ""}.`;
      }
      return `${A ? `${A}. ` : ""}${T}. ${P}${Y ? `, ${Y}` : ""}.`;
    }

    // journal
    // fields reused: site = journal name, publisher optional
    if (style === "apa") {
      return `${A ? `${A}. ` : ""}${Y ? `(${Y}). ` : ""}${T}. ${S ? `${S}. ` : ""}${U}`;
    }
    if (style === "mla") {
      return `${A ? `${A}. ` : ""}"${T}." ${S ? `${S}, ` : ""}${Y ? `${Y}, ` : ""}${U}${Acc ? `. Accessed ${Acc}.` : ""}`;
    }
    return `${A ? `${A}. ` : ""}"${T}." ${S ? `${S}. ` : ""}${Y ? `${Y}. ` : ""}${U}${Acc ? ` (accessed ${Acc}).` : ""}`;
  }, [author, title, site, publisher, year, url, accessed, style, type]);

  const copy = async () => {
    if (!citation) return;
    try {
      await navigator.clipboard.writeText(citation);
      alert("Copied!");
    } catch {
      alert("Copy failed. Please copy manually.");
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-6 pt-28 pb-16">
        <p className="text-sm font-semibold text-orange-600">Free Tools</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-extrabold text-slate-900">Citation Generator</h1>
        <p className="mt-3 text-slate-700 max-w-2xl">
          Generate a clean citation (simplified formats). For strict academic rules, always double-check your school guidelines.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Settings</h2>

            <label className="mt-4 block text-xs font-semibold text-slate-600">Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as any)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
            >
              <option value="apa">APA</option>
              <option value="mla">MLA</option>
              <option value="chicago">Chicago</option>
            </select>

            <label className="mt-4 block text-xs font-semibold text-slate-600">Source type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as SourceType)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
            >
              <option value="website">Website</option>
              <option value="book">Book</option>
              <option value="journal">Journal / Article</option>
            </select>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/tools"
                className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-800 border border-slate-200 hover:bg-slate-50"
              >
                Back to Tools
              </Link>
              <Link
                href="/request-help"
                className="inline-flex items-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
              >
                Request Help
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-bold text-slate-900">Enter details</h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-600">Author (optional)</label>
                <input value={author} onChange={(e) => setAuthor(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Year (optional)</label>
                <input value={year} onChange={(e) => setYear(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="2026" />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600">Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Title of the page/book/article" />
              </div>

              {type !== "book" && (
                <div>
                  <label className="text-xs font-semibold text-slate-600">{type === "website" ? "Website name" : "Journal name"}</label>
                  <input value={site} onChange={(e) => setSite(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                </div>
              )}

              {type === "book" && (
                <div>
                  <label className="text-xs font-semibold text-slate-600">Publisher</label>
                  <input value={publisher} onChange={(e) => setPublisher(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                </div>
              )}

              <div className={type === "book" ? "" : "sm:col-span-2"}>
                <label className="text-xs font-semibold text-slate-600">URL (optional)</label>
                <input value={url} onChange={(e) => setUrl(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="https://..." />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600">Accessed date (optional)</label>
                <input value={accessed} onChange={(e) => setAccessed(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Feb 26, 2026" />
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-slate-900">Generated citation</div>
                <button onClick={copy} className="rounded-lg bg-orange-600 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-700">
                  Copy
                </button>
              </div>
              <div className="mt-3 text-sm text-slate-800 break-words">{citation || "Fill in at least a title to generate a citation."}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}