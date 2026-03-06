"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Card = { id: string; front: string; back: string };

const LS_KEY = "myexamhelp_tool_flashcards_v1";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function generateFromText(text: string): Card[] {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const cards: Card[] = [];

  for (const line of lines) {
    // Try common separators: " - ", " — ", ":", "|"
    const separators = [" - ", " — ", ":", "|"];
    let found: [string, string] | null = null;

    for (const sep of separators) {
      const idx = line.indexOf(sep);
      if (idx > 0) {
        const a = line.slice(0, idx).trim();
        const b = line.slice(idx + sep.length).trim();
        if (a && b) {
          found = [a, b];
          break;
        }
      }
    }

    if (found) {
      cards.push({ id: uid(), front: found[0], back: found[1] });
    } else {
      // fallback: make it a definition card
      cards.push({ id: uid(), front: line, back: "Write the answer/definition here." });
    }
  }

  return cards.slice(0, 50);
}

export default function Page() {
  const [raw, setRaw] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) setCards(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(cards));
    } catch {}
  }, [cards]);

  const current = cards[index] || null;

  const importCards = () => {
    const generated = generateFromText(raw);
    setCards(generated);
    setIndex(0);
    setShowBack(false);
  };

  const addCard = () => {
    setCards((p) => [{ id: uid(), front: "New question", back: "New answer" }, ...p]);
    setIndex(0);
    setShowBack(false);
  };

  const removeCard = (id: string) => {
    setCards((p) => p.filter((c) => c.id !== id));
    setIndex(0);
    setShowBack(false);
  };

  const updateCard = (id: string, patch: Partial<Card>) => {
    setCards((p) => p.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const next = () => {
    if (!cards.length) return;
    setIndex((i) => (i + 1) % cards.length);
    setShowBack(false);
  };

  const prev = () => {
    if (!cards.length) return;
    setIndex((i) => (i - 1 + cards.length) % cards.length);
    setShowBack(false);
  };

  const progress = useMemo(() => (cards.length ? `${index + 1} / ${cards.length}` : "0 / 0"), [index, cards.length]);

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-6 pt-28 pb-16">
        <p className="text-sm font-semibold text-orange-600">Free Tools</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-extrabold text-slate-900">AI Flashcard Generator</h1>
        <p className="mt-3 text-slate-700 max-w-2xl">
          Paste notes, generate flashcards, and study. Saved automatically.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Paste notes</h2>
            <p className="mt-2 text-xs text-slate-500">Tip: Use “Term: Definition” or “Question - Answer” per line.</p>
            <textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              className="mt-3 h-44 w-full rounded-lg border border-slate-200 p-3 text-sm"
              placeholder={`Example:\nOsmosis: Movement of water across a membrane\nPythagorean theorem - a^2 + b^2 = c^2`}
            />

            <div className="mt-3 flex gap-2">
              <button
                onClick={importCards}
                className="flex-1 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
              >
                Generate
              </button>
              <button
                onClick={addCard}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Add card
              </button>
            </div>

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
              <h2 className="text-lg font-bold text-slate-900">Study</h2>
              <div className="text-sm font-semibold text-slate-700">{progress}</div>
            </div>

            {!current ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-slate-700">
                No cards yet. Paste notes and click <b>Generate</b>.
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowBack((v) => !v)}
                  className="mt-4 w-full rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm hover:shadow-md transition"
                >
                  <div className="text-xs font-semibold text-slate-500">{showBack ? "BACK" : "FRONT"}</div>
                  <div className="mt-2 text-xl font-bold text-slate-900">{showBack ? current.back : current.front}</div>
                  <div className="mt-3 text-sm font-semibold text-orange-600">Click to flip</div>
                </button>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={prev}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={next}
                    className="flex-1 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
                  >
                    Next
                  </button>
                </div>

                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-900">Edit current card</div>
                  <label className="mt-3 block text-xs font-semibold text-slate-600">Front</label>
                  <input
                    value={current.front}
                    onChange={(e) => updateCard(current.id, { front: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                  <label className="mt-3 block text-xs font-semibold text-slate-600">Back</label>
                  <textarea
                    value={current.back}
                    onChange={(e) => updateCard(current.id, { back: e.target.value })}
                    className="mt-1 h-24 w-full rounded-lg border border-slate-200 p-3 text-sm"
                  />
                  <div className="mt-3">
                    <button
                      onClick={() => removeCard(current.id)}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      Remove card
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}