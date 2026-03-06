"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const LS_KEY = "myexamhelp_tool_exam_countdown_v1";

type Plan = {
  examName: string;
  examDate: string; // yyyy-mm-dd
  weeklyHours: number;
};

function daysBetween(today: Date, target: Date) {
  const a = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const b = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

export default function Page() {
  const [plan, setPlan] = useState<Plan>({
    examName: "My Exam",
    examDate: "",
    weeklyHours: 8,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setPlan(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(plan));
    } catch {}
  }, [plan]);

  const computed = useMemo(() => {
    if (!plan.examDate) return null;
    const today = new Date();
    const target = new Date(plan.examDate + "T00:00:00");
    const d = daysBetween(today, target);
    const weeks = Math.max(0, Math.ceil(d / 7));
    const hoursTotal = Math.max(0, weeks * (Number(plan.weeklyHours) || 0));

    const milestones = [
      { label: "Start (today)", offset: 0 },
      { label: "25% progress", offset: Math.floor(d * 0.25) },
      { label: "50% progress", offset: Math.floor(d * 0.5) },
      { label: "75% progress", offset: Math.floor(d * 0.75) },
      { label: "Final review week", offset: Math.max(0, d - 7) },
      { label: "Exam day", offset: d },
    ].map((m) => {
      const dt = new Date();
      dt.setDate(dt.getDate() + m.offset);
      return { ...m, date: dt.toDateString() };
    });

    return { daysLeft: d, weeksLeft: weeks, totalHours: hoursTotal, milestones };
  }, [plan.examDate, plan.weeklyHours]);

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-5xl px-6 pt-28 pb-16">
        <p className="text-sm font-semibold text-orange-600">Free Tools</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-extrabold text-slate-900">Exam Countdown Planner</h1>
        <p className="mt-3 text-slate-700 max-w-2xl">
          Set your exam date and get a simple study timeline + milestones. Saved automatically.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Inputs</h2>

            <label className="mt-4 block text-xs font-semibold text-slate-600">Exam name</label>
            <input
              value={plan.examName}
              onChange={(e) => setPlan((p) => ({ ...p, examName: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              placeholder="e.g., TEAS, Praxis, CompTIA..."
            />

            <label className="mt-4 block text-xs font-semibold text-slate-600">Exam date</label>
            <input
              type="date"
              value={plan.examDate}
              onChange={(e) => setPlan((p) => ({ ...p, examDate: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
            />

            <label className="mt-4 block text-xs font-semibold text-slate-600">Target study hours per week</label>
            <input
              type="number"
              min={0}
              step={1}
              value={plan.weeklyHours}
              onChange={(e) => setPlan((p) => ({ ...p, weeklyHours: Number(e.target.value) }))}
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
            <h2 className="text-lg font-bold text-slate-900">Plan</h2>

            {!computed ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-slate-700">
                Pick an exam date to generate your countdown plan.
              </div>
            ) : (
              <>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-sm text-slate-600">Days left</div>
                    <div className="mt-1 text-3xl font-extrabold text-orange-600">{computed.daysLeft}</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-sm text-slate-600">Weeks left</div>
                    <div className="mt-1 text-3xl font-extrabold text-slate-900">{computed.weeksLeft}</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-sm text-slate-600">Planned study hours</div>
                    <div className="mt-1 text-3xl font-extrabold text-slate-900">{computed.totalHours}</div>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-900">Milestones for: {plan.examName}</div>
                  <ul className="mt-3 space-y-2">
                    {computed.milestones.map((m) => (
                      <li key={m.label} className="flex items-center justify-between gap-4">
                        <span className="text-sm text-slate-700">{m.label}</span>
                        <span className="text-sm font-semibold text-slate-900">{m.date}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 text-xs text-slate-500">
                  Tip: Keep “Final review week” for practice tests + weak areas.
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}