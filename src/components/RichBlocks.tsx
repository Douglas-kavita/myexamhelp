import React from "react";

type Tone = "blue" | "green" | "amber" | "pink" | "purple" | "teal" | "red";

const TONE_STYLES: Record<Tone, { wrap: string; title: string; text: string }> =
  {
    blue: {
      wrap: "bg-sky-100 border-sky-500",
      title: "text-sky-950",
      text: "text-sky-900/90",
    },
    green: {
      wrap: "bg-emerald-100 border-emerald-500",
      title: "text-emerald-950",
      text: "text-emerald-900/90",
    },
    amber: {
      wrap: "bg-amber-100 border-amber-500",
      title: "text-amber-950",
      text: "text-amber-900/90",
    },
    pink: {
      wrap: "bg-pink-100 border-pink-500",
      title: "text-pink-950",
      text: "text-pink-900/90",
    },
    purple: {
      wrap: "bg-purple-100 border-purple-500",
      title: "text-purple-950",
      text: "text-purple-900/90",
    },
    teal: {
      wrap: "bg-teal-100 border-teal-500",
      title: "text-teal-950",
      text: "text-teal-900/90",
    },
    red: {
      wrap: "bg-red-100 border-red-500",
      title: "text-red-950",
      text: "text-red-900/90",
    },
  };

export function ColorBox({
  tone = "blue",
  title,
  children,
}: {
  tone?: Tone;
  title?: string;
  children: React.ReactNode;
}) {
  const s = TONE_STYLES[tone];
  return (
    <section className={`rounded-2xl border-2 ${s.wrap} p-5 shadow-sm`}>
      {title ? (
        <h3 className={`text-lg font-extrabold ${s.title}`}>{title}</h3>
      ) : null}
      <div className={`mt-2 leading-relaxed ${s.text}`}>{children}</div>
    </section>
  );
}

export function Bullets({
  items,
  columns = 1,
}: {
  items: string[];
  columns?: 1 | 2;
}) {
  return (
    <ul
      className={`mt-2 list-disc pl-5 ${
        columns === 2 ? "grid md:grid-cols-2 gap-x-10" : ""
      }`}
    >
      {items.map((t, i) => (
        <li key={i} className="mb-1">
          {t}
        </li>
      ))}
    </ul>
  );
}

/**
 * Bright, readable, mobile-friendly table.
 * Use arrays only — NEVER embed <tr> in strings.
 */
export function BrightTable({
  title,
  tone = "purple",
  columns,
  rows,
  note,
}: {
  title?: string;
  tone?: Tone;
  columns: string[];
  rows: (string | React.ReactNode)[][];
  note?: string;
}) {
  const s = TONE_STYLES[tone];

  return (
    <section className={`rounded-2xl border-2 ${s.wrap} p-4 shadow-sm`}>
      {title ? (
        <div className="flex items-center justify-between gap-3">
          <h3 className={`text-base md:text-lg font-extrabold ${s.title}`}>
            {title}
          </h3>
          <span className="text-xs font-semibold text-black/60">
            Scroll sideways on mobile →
          </span>
        </div>
      ) : null}

      <div className="mt-3 overflow-x-auto rounded-xl border border-black/10 bg-white">
        <table className="min-w-[720px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-black/5">
              {columns.map((c, i) => (
                <th
                  key={i}
                  className="text-left px-4 py-3 font-extrabold text-black/80 border-b border-black/10"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className="odd:bg-white even:bg-black/[0.02]">
                {r.map((cell, ci) => (
                  <td
                    key={ci}
                    className="align-top px-4 py-3 border-b border-black/10 text-black/80"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {note ? (
        <p className={`mt-3 text-sm ${s.text}`}>
          <span className="font-bold">Note:</span> {note}
        </p>
      ) : null}
    </section>
  );
}