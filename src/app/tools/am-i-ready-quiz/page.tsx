"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Q = { id: string; question: string; options: string[]; correctIndex: number };

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function makeQuiz(topic: string, count: number): Q[] {
  const t = (topic || "your topic").trim();
  const n = Math.min(20, Math.max(5, count || 10));

  // Simple template generator (non-AI, offline). You can swap this later for real AI.
  const templates = [
    `What is the best definition of ${t}?`,
    `Which option is an example of ${t}?`,
    `What is a common mistake in ${t}?`,
    `Which statement about ${t} is TRUE?`,
    `What is the main purpose of ${t}?`,
  ];

  const answers = [
    "Correct choice",
    "Plausible distractor",
    "Common confusion",
    "Unrelated option",
  ];

  const quiz: Q[] = [];
  for (let i = 0; i < n; i++) {
    const question = templates[i % templates.length] + ` (Q${i + 1})`;
    const correctIndex = 0;
    quiz.push({
      id: uid(),
      question,
      options: [...answers].sort(() => Math.random() - 0.5),
      correctIndex,
    });
  }

  // Ensure correctIndex points to "Correct choice"
  return quiz.map((q) => ({
    ...q,
    correctIndex: q.options.indexOf("Correct choice") >= 0 ? q.options.indexOf("Correct choice") : 0,
  }));
}

export default function Page() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(10);
  const [quiz, setQuiz] = useState<Q[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const generate = () => {
    const q = makeQuiz(topic, count);
    setQuiz(q);
    setAnswers({});
    setSubmitted(false);
  };

  const score = useMemo(() => {
    if (!submitted) return null;
    const total = quiz.length || 1;
    const correct = quiz.reduce((sum, q) => sum + ((answers[q.id] ?? -1) === q.correctIndex ? 1 : 0), 0);
    return { correct, total, percent: Math.round((correct / total) * 100) };
  }, [submitted, quiz, answers]);

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-6 pt-28 pb-16">
        <p className="text-sm font-semibold text-orange-600">Free Tools</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-extrabold text-slate-900">Am I Ready? Practice Quiz</h1>
        <p className="mt-3 text-slate-700 max-w-2xl">
          Generate a quick practice quiz for any topic. (Offline template version — we can upgrade to real AI later.)
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Quiz setup</h2>

            <label className="mt-4 block text-xs font-semibold text-slate-600">Topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              placeholder="e.g., Biology cells, Algebra, AWS IAM..."
            />

            <label className="mt-4 block text-xs font-semibold text-slate-600">Number of questions (5–20)</label>
            <input
              type="number"
              min={5}
              max={20}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />

            <button
              onClick={generate}
              className="mt-4 w-full rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
            >
              Generate quiz
            </button>

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
              <h2 className="text-lg font-bold text-slate-900">Quiz</h2>
              {quiz.length > 0 && (
                <button
                  onClick={() => setSubmitted(true)}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Submit
                </button>
              )}
            </div>

            {score && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-sm text-slate-600">Score</div>
                <div className="mt-1 text-2xl font-extrabold text-orange-600">
                  {score.correct}/{score.total} ({score.percent}%)
                </div>
              </div>
            )}

            {quiz.length === 0 ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-slate-700">
                Set a topic and click <b>Generate quiz</b>.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {quiz.map((q, i) => (
                  <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-sm font-bold text-slate-900">
                      {i + 1}. {q.question}
                    </div>

                    <div className="mt-3 space-y-2">
                      {q.options.map((opt, idx) => {
                        const picked = answers[q.id] === idx;
                        const isCorrect = idx === q.correctIndex;
                        const showResult = submitted;

                        return (
                          <label
                            key={idx}
                            className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm cursor-pointer ${
                              picked ? "border-orange-300 bg-orange-50" : "border-slate-200"
                            } ${showResult && isCorrect ? "border-green-300 bg-green-50" : ""}`}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              checked={picked}
                              onChange={() => setAnswers((p) => ({ ...p, [q.id]: idx }))}
                            />
                            <span className="text-slate-800">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {quiz.length > 0 && (
              <p className="mt-4 text-xs text-slate-500">
                Note: This is a template-based quiz. If you want real exam-style questions, we can connect it to AI next.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}