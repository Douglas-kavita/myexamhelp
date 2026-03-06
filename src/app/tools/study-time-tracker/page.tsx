"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Session = { id: string; startedAt: number; minutes: number; note: string };

const LS_KEY = "myexamhelp_tool_study_tracker_v1";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function startOfDay(ts: number) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export default function Page() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [running, setRunning] = useState(false);
  const [note, setNote] = useState("");
  const [manualMinutes, setManualMinutes] = useState(30);

  const startRef = useRef<number | null>(null);
  const tickRef = useRef<number | null>(null);
  const [liveMinutes, setLiveMinutes] = useState(0);

  // load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setSessions(JSON.parse(raw));
    } catch {}
  }, []);

  // save
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(sessions));
    } catch {}
  }, [sessions]);

  const stopTimer = () => {
    if (!running) return;
    const startedAt = startRef.current;
    if (!startedAt) return;

    const mins = Math.max(1, Math.round((Date.now() - startedAt) / 60000));
    setSessions((prev) => [{ id: uid(), startedAt, minutes: mins, note: note.trim() }, ...prev]);
    setRunning(false);
    startRef.current = null;
    setLiveMinutes(0);
    setNote("");

    if (tickRef.current) window.clearInterval(tickRef.current);
    tickRef.current = null;
  };

  const startTimer = () => {
    if (running) return;
    setRunning(true);
    startRef.current = Date.now();
    setLiveMinutes(0);

    tickRef.current = window.setInterval(() => {
      const st = startRef.current;
      if (!st) return;
      setLiveMinutes(Math.floor((Date.now() - st) / 60000));
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, []);

  const addManual = () => {
    const mins = Math.max(1, Number(manualMinutes) || 0);
    setSessions((prev) => [{ id: uid(), startedAt: Date.now(), minutes: mins, note: note.trim() }, ...prev]);
    setNote("");
  };

  const remove = (id: string) => setSessions((prev) => prev.filter((s) => s.id !== id));
  const clearAll = () => setSessions([]);

  const weekly = useMemo(() => {
    // last 7 days totals
    const today = startOfDay(Date.now());
    const days = Array.from({ length: 7 }, (_, i) => today - i * 86400000).reverse();

    const totals = days.map((dayTs) => {
      const next = dayTs + 86400000;
      const minutes = sessions
        .filter((s) => s.startedAt >= dayTs && s.startedAt < next)
        .reduce((sum, s) => sum + s.minutes, 0);

      const label = new Date(dayTs).toLocaleDateString(undefined, { weekday: "short" });
      return { label, minutes };
    });

    const total = totals.reduce((sum, t) => sum + t.minutes, 0);
    return { totals, total };
  }, [sessions]);

  const maxMin = Math.max(60, ...weekly.totals.map((t) => t.minutes));

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-6 pt-28 pb-16">
        <p className="text-sm font-semibold text-orange-600">Free Tools</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-extrabold text-slate-900">Study Time Tracker</h1>
        <p className="mt-3 text-slate-700 max-w-2xl">
          Track study sessions. Start a timer or add minutes manually. Saved automatically.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Quick add</h2>

            <label className="mt-4 block text-xs font-semibold text-slate-600">Note (optional)</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              placeholder="e.g., Math practice test"
            />

            <div className="mt-4 flex gap-2">
              {!running ? (
                <button
                  onClick={startTimer}
                  className="flex-1 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
                >
                  Start timer
                </button>
              ) : (
                <button
                  onClick={stopTimer}
                  className="flex-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Stop ({liveMinutes} min)
                </button>
              )}
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">Manual minutes</div>
              <div className="mt-2 flex gap-2">
                <input
                  type="number"
                  min={1}
                  value={manualMinutes}
                  onChange={(e) => setManualMinutes(Number(e.target.value))}
                  className="w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
                />
                <button
                  onClick={addManual}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Add session
                </button>
              </div>
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
              <h2 className="text-lg font-bold text-slate-900">Last 7 days</h2>
              <button
                onClick={clearAll}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Clear all
              </button>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-2 items-end">
              {weekly.totals.map((d) => (
                <div key={d.label} className="text-center">
                  <div
                    className="mx-auto w-full rounded-lg bg-orange-200"
                    style={{ height: `${Math.max(8, (d.minutes / maxMin) * 120)}px` }}
                    title={`${d.minutes} minutes`}
                  />
                  <div className="mt-2 text-xs text-slate-600">{d.label}</div>
                  <div className="text-xs font-semibold text-slate-900">{Math.round(d.minutes / 60)}h</div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-sm text-slate-600">Total (7 days)</div>
              <div className="mt-1 text-2xl font-extrabold text-slate-900">
                {Math.floor(weekly.total / 60)}h {weekly.total % 60}m
              </div>
            </div>

            <h3 className="mt-6 text-sm font-bold text-slate-900">Recent sessions</h3>
            <div className="mt-3 space-y-2">
              {sessions.slice(0, 10).map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{s.minutes} min</div>
                    <div className="text-xs text-slate-600">
                      {new Date(s.startedAt).toLocaleString()} {s.note ? `• ${s.note}` : ""}
                    </div>
                  </div>
                  <button
                    onClick={() => remove(s.id)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    Remove
                  </button>
                </div>
              ))}

              {sessions.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 text-slate-700">
                  No sessions yet. Start a timer or add minutes.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}