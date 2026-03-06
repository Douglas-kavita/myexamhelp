"use client";

import ToolShell from "@/components/ToolShell";
import { useEffect, useMemo, useState } from "react";

console.log("GPA PAGE UPDATED ✅");


type Course = { id: string; name: string; credits: number; grade: string };

const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  F: 0.0,
};

const LS_KEY = "myexamhelp_tool_gpa_v1";
const LS_EMAIL_KEY = "myexamhelp_email_gate_v1";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

/** Email-only gate shown INSIDE the left panel (no phone/SMS). */
function EmailGateInline({
  children,
}: {
  children: React.ReactNode;
}) {
  const [email, setEmail] = useState("");
  const [savedEmail, setSavedEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_EMAIL_KEY);
      if (raw) setSavedEmail(raw);
    } catch {}
  }, []);

  const isValidEmail = (value: string) => {
    const v = value.trim();
    return v.includes("@") && v.includes(".");
  };

  const submit = () => {
    setError(null);
    if (!isValidEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }
    const v = email.trim();
    try {
      localStorage.setItem(LS_EMAIL_KEY, v);
    } catch {}
    setSavedEmail(v);
  };

  if (savedEmail) return <>{children}</>;

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-base font-bold text-slate-900">Enter your email to continue</h3>
      <p className="mt-1 text-sm text-slate-600">
        Email-only access for now (no phone verification). You’ll unlock this tool instantly.
      </p>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={submit}
          className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
        >
          Continue
        </button>
      </div>

      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

      <p className="mt-3 text-xs text-slate-500">
        You’ll only be asked once on this device.
      </p>
    </div>
  );
}

export default function Page() {
  const [courses, setCourses] = useState<Course[]>([
    { id: uid(), name: "Course 1", credits: 3, grade: "A" },
  ]);

  // load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setCourses(JSON.parse(raw));
    } catch {}
  }, []);

  // save
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(courses));
    } catch {}
  }, [courses]);

  const { totalCredits, gpa } = useMemo(() => {
    let credits = 0;
    let points = 0;

    for (const c of courses) {
      const cr = Number(c.credits) || 0;
      const gp = GRADE_POINTS[c.grade] ?? 0;
      credits += cr;
      points += cr * gp;
    }

    const value = credits > 0 ? points / credits : 0;
    return { totalCredits: credits, gpa: value };
  }, [courses]);

  const addCourse = () =>
    setCourses((prev) => [
      ...prev,
      { id: uid(), name: `Course ${prev.length + 1}`, credits: 3, grade: "A" },
    ]);

  const removeCourse = (id: string) =>
    setCourses((prev) => prev.filter((c) => c.id !== id));

  const update = (id: string, patch: Partial<Course>) =>
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const reset = () =>
    setCourses([{ id: uid(), name: "Course 1", credits: 3, grade: "A" }]);

  return (
    <ToolShell
      title="GPA Calculator"
      subtitle="Add courses, credits, and grades. Your GPA updates instantly."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left: Courses */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Courses</h2>
            <div className="flex gap-2">
              <button
                onClick={addCourse}
                className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
              >
                Add course
              </button>
              <button
                onClick={reset}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </div>

          {/* ✅ Email prompt appears inside this box */}
          <EmailGateInline>
            <div className="mt-4 space-y-3">
              {courses.map((c) => (
                <div
                  key={c.id}
                  className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-12"
                >
                  <div className="md:col-span-6">
                    <label className="text-xs font-semibold text-slate-600">Course name</label>
                    <input
                      value={c.name}
                      onChange={(e) => update(c.id, { name: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      placeholder="e.g., Biology 101"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-xs font-semibold text-slate-600">Credits</label>
                    <input
                      type="number"
                      min={0}
                      step={0.5}
                      value={c.credits}
                      onChange={(e) => update(c.id, { credits: Number(e.target.value) })}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-slate-600">Grade</label>
                    <select
                      value={c.grade}
                      onChange={(e) => update(c.id, { grade: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
                    >
                      {Object.keys(GRADE_POINTS).map((g) => (
                        <option key={g} value={g}>
                          {g} ({GRADE_POINTS[g].toFixed(1)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-1 flex items-end">
                    <button
                      onClick={() => removeCourse(c.id)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </EmailGateInline>
        </div>

        {/* Right: Results */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-lg font-bold text-slate-900">Results</h2>

          <div className="mt-4 rounded-xl bg-white border border-slate-200 p-4">
            <div className="text-sm text-slate-600">Total Credits</div>
            <div className="mt-1 text-2xl font-extrabold text-slate-900">{totalCredits}</div>
          </div>

          <div className="mt-3 rounded-xl bg-white border border-slate-200 p-4">
            <div className="text-sm text-slate-600">GPA</div>
            <div className="mt-1 text-3xl font-extrabold text-orange-600">{gpa.toFixed(2)}</div>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            GPA scales vary by school. We can add custom grade scales later.
          </p>
        </div>
      </div>
    </ToolShell>
  );
}