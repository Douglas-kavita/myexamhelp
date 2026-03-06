"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

function extractCriteria(text: string) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Heuristic: keep lines that look like criteria (bullets, numbered, or contain ":" or "pts")
  const criteria = lines
    .filter((l) => /^[-*•]\s+/.test(l) || /^\d+[\).]\s+/.test(l) || l.includes(":") || /pts|points/i.test(l))
    .map((l) => l.replace(/^[-*•]\s+/, "").replace(/^\d+[\).]\s+/, ""));

  // If heuristic finds nothing, fallback to first 10 non-empty lines
  return (criteria.length ? criteria : lines.slice(0, 10)).slice(0, 20);
}

export default function Page() {
  const [rubric, setRubric] = useState("");
  const [maxScore, setMaxScore] = useState(100);

  const criteria = useMemo(() => extractCriteria(rubric), [rubric]);
  const [checks, setChecks] = useState<Record<number, boolean>>({});

  const score = useMemo(() => {
    const total = criteria.length || 1;
    const done = criteria.reduce((sum, _, i) => sum + (checks[i] ? 1 : 0), 0);
    const max = Number(maxScore) || 0;
    return Math.round((done / total) * max);
  }, [criteria, checks, maxScore]);

  const toggle = (i: number) => setChecks((p) => ({ ...p, [i]: !p[i] }));
  const reset = () => setChecks({});

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-6 pt-28 pb-16">
        <p className="text-sm font-semibold text-orange-600">Free Tools</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-extrabold text-slate-900">Rubric Analyzer</h1>
        <p className="mt-3 text-slate-700 max-w-2xl">
          Paste a rubric. This tool pulls likely criteria and turns them into a checklist + quick score estimate.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Rubric</h2>
            <textarea
              value={rubric}
              onChange={(e) => setRubric(e.target.value)}
              className="mt-3 h-52 w-full rounded-lg border border-slate-200 p-3 text-sm"
              placeholder="Paste your rubric here..."
            />

            <label className="mt-4 block text-xs font-semibold text-slate-600">Max score</label>
            <input
              type="number"
              min={1}
              value={maxScore}
              onChange={(e) => setMaxScore(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />

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
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900">Checklist</h2>
              <button
                onClick={reset}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Reset checks
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-sm text-slate-600">Criteria found</div>
                <div className="mt-1 text-3xl font-extrabold text-slate-900">{criteria.length}</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 sm:col-span-2">
                <div className="text-sm text-slate-600">Estimated score (based on checked items)</div>
                <div className="mt-1 text-3xl font-extrabold text-orange-600">{score} / {maxScore}</div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
              {criteria.length === 0 ? (
                <div className="text-slate-700">Paste a rubric to generate criteria.</div>
              ) : (
                <ul className="space-y-2">
                  {criteria.map((c, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={!!checks[i]}
                        onChange={() => toggle(i)}
                        className="mt-1 h-4 w-4"
                      />
                      <span className="text-sm text-slate-800">{c}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-4 text-xs text-slate-500">
              Tip: Use this as a “submission checklist” before turning in your work.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}