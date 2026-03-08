"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type ToolKey =
  | "gpa"
  | "countdown"
  | "study"
  | "citation"
  | "flashcards"
  | "rubric"
  | "ready";

type ToolItem = {
  key: ToolKey;
  label: string;
  heading: string;
  subheading: string;
  howTo: string[];
  whyItMatters: string[];
};

const TOOL_PREVIEW: Record<string, string> = {
  gpa: "/images/tools/gpa.jpg",
  countdown: "/images/tools/countdown.jpg",
  study: "/images/tools/study.jpg",
  citation: "/images/tools/citation.jpg",
  flashcards: "/images/tools/flashcards.jpg",
  rubric: "/images/tools/rubric.jpg",
  ready: "/images/tools/ready.jpg",
};

const TOOLS: ToolItem[] = [
  {
    key: "gpa",
    label: "GPA Calculator",
    heading: "GPA Calculator",
    subheading: "Enter courses + credits, and we calculate your GPA.",
    howTo: [
      "Add each class you’re taking.",
      "Enter the credits for each class.",
      "Pick your grade for each class.",
      "Your GPA updates automatically (use Reset to start fresh).",
    ],
    whyItMatters: [
      "Knowing your GPA helps you plan scholarships, eligibility, and target grades.",
      "It also helps you quickly see which class has the biggest impact (higher credits = bigger impact).",
    ],
  },
  {
    key: "countdown",
    label: "Exam Countdown Planner",
    heading: "Exam Countdown Planner",
    subheading: "Pick an exam date and get a clean countdown.",
    howTo: [
      "Enter your exam date.",
      "Optionally set your weekly study hours target.",
      "Use the plan to pace your prep and avoid last-minute cramming.",
    ],
    whyItMatters: [
      "Deadlines create clarity: you know exactly how many days you have left.",
      "A steady weekly plan reduces stress and improves retention.",
    ],
  },
  {
    key: "study",
    label: "Study Time Tracker",
    heading: "Study Time Tracker",
    subheading: "Track daily study time and build consistency.",
    howTo: [
      "Log the time you study each day (even small sessions count).",
      "Aim for consistency instead of “all-nighters”.",
      "Review totals weekly to adjust your schedule.",
    ],
    whyItMatters: [
      "Consistency beats intensity: daily study improves memory and confidence.",
      "Tracking makes progress visible and keeps you accountable.",
    ],
  },
  {
    key: "citation",
    label: "Citation Generator (APA, MLA, Chicago)",
    heading: "Citation Generator",
    subheading: "Generate clean citations (template mode for now).",
    howTo: [
      "Enter source details (author, title, year, link).",
      "Pick a style (APA/MLA/Chicago).",
      "Copy the output into your paper and double-check names/dates.",
    ],
    whyItMatters: [
      "Correct citations protect you from accidental plagiarism.",
      "They also make your work look professional and easier to verify.",
    ],
  },
  {
    key: "flashcards",
    label: "AI Flashcard Generator",
    heading: "AI Flashcard Generator",
    subheading: "Create flashcards from a topic (template mode for now).",
    howTo: [
      "Type the topic you’re studying.",
      "Generate flashcards and practice them daily.",
      "Mark any hard cards and repeat them more often.",
    ],
    whyItMatters: [
      "Flashcards use active recall — one of the fastest ways to learn.",
      "They’re perfect for definitions, formulas, concepts, and quick review.",
    ],
  },
  {
    key: "rubric",
    label: "Assignment Rubric Analyzer",
    heading: "Assignment Rubric Analyzer",
    subheading: "Paste a rubric and get a checklist breakdown.",
    howTo: [
      "Paste the rubric or assignment grading requirements.",
      "Use the checklist to confirm you covered every point.",
      "Review before submission to catch missing parts.",
    ],
    whyItMatters: [
      "Rubrics tell you exactly how points are earned — this helps you focus on what matters.",
      "A checklist reduces mistakes and improves grades without extra effort.",
    ],
  },
  {
    key: "ready",
    label: "“Am I Ready?” Practice Quiz Generator",
    heading: "Am I Ready? Practice Quiz",
    subheading:
      "Generate a quick practice quiz for any topic. (Offline template version — we can upgrade to real AI later.)",
    howTo: [
      "Type the topic you want to practice.",
      "Choose the number of questions.",
      "Generate, answer them, and review what you missed.",
    ],
    whyItMatters: [
      "Practice questions reveal weak areas fast.",
      "Testing yourself is the best way to build exam confidence.",
    ],
  },
];

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function isToolKey(value: string | null): value is ToolKey {
  return (
    value === "gpa" ||
    value === "countdown" ||
    value === "study" ||
    value === "citation" ||
    value === "flashcards" ||
    value === "rubric" ||
    value === "ready"
  );
}

function FreeToolsPageContent() {
  const router = useRouter();
  const sp = useSearchParams();

  const queryTool = sp.get("tool");
  const initialKey: ToolKey = isToolKey(queryTool) ? queryTool : "gpa";
  const [active, setActive] = useState<ToolKey>(initialKey);

  useEffect(() => {
    const urlKey = sp.get("tool");
    const safeKey: ToolKey = isToolKey(urlKey) ? urlKey : "gpa";
    if (safeKey !== active) setActive(safeKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  const activeItem = useMemo(
    () => TOOLS.find((t) => t.key === active) || TOOLS[0],
    [active]
  );

  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-100">
      <section className="relative w-full">
        <div
          className="h-[240px] md:h-[300px] w-full bg-cover bg-center"
          style={{ backgroundImage: "url(/images/tools/free-tools-hero.jpg)" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0">
          <div className="w-full px-4 md:px-10 h-full flex items-end pb-8">
            <div className="w-full">
              <p className="text-xs font-semibold tracking-wide text-orange-200">
                Free Tools
              </p>
              <h1 className="mt-2 text-3xl md:text-5xl font-extrabold text-white">
                {activeItem.heading}
              </h1>
              <p className="mt-2 max-w-2xl text-sm md:text-base text-white/85">
                {activeItem.subheading}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="w-full px-4 md:px-10 py-10">
          <div className="w-full">
            <div className="grid gap-6 lg:grid-cols-[360px_260px_1fr] items-start">
              <aside className="rounded-3xl bg-gradient-to-b from-orange-100 to-white shadow-sm ring-1 ring-orange-200 p-6 sticky top-24">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-extrabold text-slate-900">
                    Free Tools
                  </h2>
                  <Link
                    href="/tools"
                    className="text-xs font-semibold text-orange-800 hover:underline underline-offset-4"
                  >
                    All tools
                  </Link>
                </div>

                <ul className="mt-4 space-y-2">
                  {TOOLS.map((t) => {
                    const isActive = t.key === active;
                    return (
                      <li key={t.key}>
                        <button
                          type="button"
                          onClick={() => {
                            setActive(t.key);
                            router.replace(`/tools?tool=${t.key}`);
                          }}
                          className={cn(
                            "w-full text-left rounded-2xl px-4 py-3 transition",
                            "flex items-start gap-3",
                            isActive
                              ? "bg-white ring-1 ring-orange-300 shadow-sm"
                              : "hover:bg-white/70"
                          )}
                        >
                          <span
                            className={cn(
                              "mt-1.5 h-2.5 w-2.5 rounded-full flex-none",
                              isActive ? "bg-orange-700" : "bg-slate-500"
                            )}
                          />
                          <span
                            className={cn(
                              "text-sm",
                              isActive
                                ? "font-extrabold text-slate-900"
                                : "text-slate-700"
                            )}
                          >
                            {t.label}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Link
                    href="/"
                    className="rounded-2xl border border-orange-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-orange-100 text-center"
                  >
                    Tools Home
                  </Link>
                  <button
                    type="button"
                    onClick={() => setHelpOpen(true)}
                    className="rounded-2xl bg-orange-700 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-800"
                  >
                    Request Help
                  </button>
                </div>

                <p className="mt-3 text-xs text-slate-700">
                  Your help request is saved locally on this device for now.
                </p>
              </aside>

              <aside className="hidden lg:block sticky top-24">
                <VerticalLooper />
              </aside>

              <section className="space-y-6">
                <div className="rounded-3xl bg-sky-100 shadow-sm ring-1 ring-sky-200 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base md:text-lg font-extrabold text-slate-900">
                      How to use {activeItem.heading}
                    </h3>
                    <span className="text-xs text-slate-600">Quick steps</span>
                  </div>

                  <ul className="mt-3 grid gap-2 md:grid-cols-2">
                    {activeItem.howTo.map((line, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-slate-800">
                        <span className="mt-1 h-2 w-2 rounded-full bg-orange-700 flex-none" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="rounded-3xl bg-orange-100 shadow-sm ring-1 ring-orange-200 p-6">
                    <h3 className="text-base font-extrabold text-slate-900">
                      Setup
                    </h3>
                    <p className="mt-1 text-sm text-slate-700">
                      Configure your inputs. Your output updates on the right.
                    </p>

                    <div className="mt-4">
                      <ToolSetup active={active} />
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link
                        href="/tools"
                        className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 hover:bg-slate-100"
                      >
                        Back to Tools
                      </Link>
                      <button
                        type="button"
                        onClick={() => setHelpOpen(true)}
                        className="rounded-2xl bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-800"
                      >
                        Request Help
                      </button>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-violet-100 shadow-sm ring-1 ring-violet-200 p-6">
                    <h3 className="text-base font-extrabold text-slate-900">
                      Output
                    </h3>
                    <div className="mt-4">
                      <ToolOutput active={active} />
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-emerald-100 shadow-sm ring-1 ring-emerald-200 p-6">
                  <h3 className="text-base md:text-lg font-extrabold text-slate-900">
                    Why this tool matters
                  </h3>
                  <p className="mt-2 text-sm text-slate-700">
                    These tools are built to help you move faster, stay organized,
                    and submit with confidence.
                  </p>

                  <ul className="mt-3 space-y-2">
                    {activeItem.whyItMatters.map((line, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-slate-800">
                        <span className="mt-1 h-2 w-2 rounded-full bg-slate-900 flex-none" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      {helpOpen && <RequestHelpModal onClose={() => setHelpOpen(false)} />}
    </main>
  );
}

function VerticalLooper() {
  const images = [
    "/images/security-1.png",
    "/images/security-2.png",
    "/images/services/services-hero.jpg",
    "/images/services/cert/1.jpg",
    "/images/services/aws/1.jpg",
  ];

  const items = [...images, ...images];

  return (
    <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/10 overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <div className="text-sm font-extrabold text-slate-900">Student Wins</div>
        <div className="text-xs text-slate-600">
          Quick inspiration as you study
        </div>
      </div>

      <div className="relative h-[620px]">
        <div className="vertical-marquee absolute inset-0">
          {items.map((src, idx) => (
            <div key={idx} className="px-4 pt-4">
              <div className="overflow-hidden rounded-2xl ring-1 ring-black/20 bg-slate-400">
                <img
                  src={src}
                  alt=""
                  className="h-[160px] w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ToolSetup({ active }: { active: ToolKey }) {
  switch (active) {
    case "ready":
      return <ReadyQuizSetup />;
    case "gpa":
      return <GpaSetup />;
    case "countdown":
      return <CountdownSetup />;
    case "study":
      return <StudySetup />;
    case "citation":
      return <CitationSetup />;
    case "flashcards":
      return <FlashcardsSetup />;
    case "rubric":
      return <RubricSetup />;
    default:
      return null;
  }
}

function ToolOutput({ active }: { active: ToolKey }) {
  switch (active) {
    case "ready":
      return <ReadyQuizOutput />;
    case "gpa":
      return <GpaOutput />;
    case "countdown":
      return <CountdownOutput />;
    case "study":
      return <StudyOutput />;
    case "citation":
      return <CitationOutput />;
    case "flashcards":
      return <FlashcardsOutput />;
    case "rubric":
      return <RubricOutput />;
    default:
      return null;
  }
}

/* ----- Ready Quiz ----- */
function ReadyQuizSetup() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState("10");

  useEffect(() => {
    const raw = localStorage.getItem("myexamhelp_readyquiz");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as {
        topic?: string;
        count?: number;
        questions?: string[];
      };
      setTopic(parsed.topic || "");
      setCount(String(parsed.count || 10));
    } catch {}
  }, []);

  const handleGenerate = () => {
    const safeTopic = topic.trim();
    const safeCount = Math.max(5, Math.min(20, Number(count) || 10));

    const questions = Array.from({ length: safeCount }, (_, i) => {
      const n = i + 1;
      return `${n}. (${safeTopic || "General Practice"}) Question ${n}: Explain the key idea in 2–3 sentences.`;
    });

    localStorage.setItem(
      "myexamhelp_readyquiz",
      JSON.stringify({
        topic: safeTopic,
        count: safeCount,
        questions,
        createdAt: Date.now(),
      })
    );

    window.dispatchEvent(new Event("myexamhelp_readyquiz_updated"));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-800">Topic</label>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Biology cells, Algebra, AI"
          className="mt-2 w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-800">
          Number of questions (5–20)
        </label>
        <input
          type="number"
          min={5}
          max={20}
          value={count}
          onChange={(e) => setCount(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        className="w-full rounded-2xl bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-800"
      >
        Generate quiz
      </button>
    </div>
  );
}

function ReadyQuizOutput() {
  const [text, setText] = useState("Set a topic and click Generate quiz.");

  useEffect(() => {
    const load = () => {
      const raw = localStorage.getItem("myexamhelp_readyquiz");

      if (!raw) {
        setText("Set a topic and click Generate quiz.");
        return;
      }

      try {
        const parsed = JSON.parse(raw) as {
          topic?: string;
          count?: number;
          questions?: string[];
        };

        if (parsed.questions && parsed.questions.length > 0) {
          setText(parsed.questions.join("\n"));
          return;
        }

        const safeTopic = (parsed.topic || "").trim();
        const safeCount = Math.max(5, Math.min(20, Number(parsed.count) || 10));

        const questions = Array.from({ length: safeCount }, (_, i) => {
          const n = i + 1;
          return `${n}. (${safeTopic || "General Practice"}) Question ${n}: Explain the key idea in 2–3 sentences.`;
        });

        setText(questions.join("\n"));
      } catch {
        setText("Set a topic and click Generate quiz.");
      }
    };

    load();
    window.addEventListener("myexamhelp_readyquiz_updated", load);

    return () => {
      window.removeEventListener("myexamhelp_readyquiz_updated", load);
    };
  }, []);

  return (
    <div className="rounded-2xl border border-slate-400 bg-slate-100 p-4">
      <pre className="whitespace-pre-wrap text-sm text-slate-900 leading-6">
        {text}
      </pre>
    </div>
  );
}

/* ----- GPA ----- */
type GpaCourse = {
  id: number;
  name: string;
  credits: number;
  grade: string;
};

const GPA_GRADES: Record<string, number> = {
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
  F: 0,
};

function defaultGpaCourses(): GpaCourse[] {
  return [
    { id: 1, name: "Course 1", credits: 3, grade: "A" },
    { id: 2, name: "Course 2", credits: 3, grade: "B+" },
  ];
}

function GpaSetup() {
  const [courses, setCourses] = useState<GpaCourse[]>(defaultGpaCourses());

  useEffect(() => {
    const raw = localStorage.getItem("myexamhelp_gpa");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { courses?: GpaCourse[] };
      if (parsed.courses?.length) setCourses(parsed.courses);
    } catch {}
  }, []);

  const saveCourses = (next: GpaCourse[]) => {
    setCourses(next);
    localStorage.setItem("myexamhelp_gpa", JSON.stringify({ courses: next }));
    window.dispatchEvent(new Event("myexamhelp_gpa_updated"));
  };

  const updateCourse = (
    id: number,
    field: keyof GpaCourse,
    value: string | number
  ) => {
    const next = courses.map((course) =>
      course.id === id ? { ...course, [field]: value } : course
    );
    saveCourses(next);
  };

  const addCourse = () => {
    const nextId =
      courses.length > 0 ? Math.max(...courses.map((c) => c.id)) + 1 : 1;
    saveCourses([
      ...courses,
      { id: nextId, name: `Course ${nextId}`, credits: 3, grade: "A" },
    ]);
  };

  const removeCourse = (id: number) => {
    if (courses.length === 1) return;
    saveCourses(courses.filter((course) => course.id !== id));
  };

  const resetCourses = () => {
    saveCourses(defaultGpaCourses());
  };

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <div
          key={course.id}
          className="rounded-2xl border border-slate-300 bg-white p-3"
        >
          <div className="grid gap-3 sm:grid-cols-[1.5fr_110px_110px_auto] items-end">
            <div>
              <label className="text-sm font-medium text-slate-800">
                Course
              </label>
              <input
                value={course.name}
                onChange={(e) =>
                  updateCourse(course.id, "name", e.target.value)
                }
                className="mt-2 w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-800">
                Credits
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={course.credits}
                onChange={(e) =>
                  updateCourse(
                    course.id,
                    "credits",
                    Math.max(1, Number(e.target.value) || 1)
                  )
                }
                className="mt-2 w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-800">
                Grade
              </label>
              <select
                value={course.grade}
                onChange={(e) =>
                  updateCourse(course.id, "grade", e.target.value)
                }
                className="mt-2 w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                {Object.keys(GPA_GRADES).map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => removeCourse(course.id)}
              className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 hover:bg-slate-100"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={addCourse}
          className="rounded-2xl bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-800"
        >
          Add course
        </button>
        <button
          type="button"
          onClick={resetCourses}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 hover:bg-slate-100"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function GpaOutput() {
  const [courses, setCourses] = useState<GpaCourse[]>([]);

  useEffect(() => {
    const load = () => {
      const raw = localStorage.getItem("myexamhelp_gpa");
      if (!raw) {
        setCourses(defaultGpaCourses());
        return;
      }
      try {
        const parsed = JSON.parse(raw) as { courses?: GpaCourse[] };
        setCourses(parsed.courses?.length ? parsed.courses : defaultGpaCourses());
      } catch {
        setCourses(defaultGpaCourses());
      }
    };

    load();
    window.addEventListener("myexamhelp_gpa_updated", load);
    return () => window.removeEventListener("myexamhelp_gpa_updated", load);
  }, []);

  const totalCredits = courses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
  const totalPoints = courses.reduce(
    (sum, c) => sum + (GPA_GRADES[c.grade] ?? 0) * (Number(c.credits) || 0),
    0
  );
  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

  return (
    <div className="rounded-2xl border border-slate-500 bg-slate-100 p-4 text-sm text-slate-900 space-y-2">
      <p>
        <span className="font-semibold">Courses:</span> {courses.length}
      </p>
      <p>
        <span className="font-semibold">Total credits:</span> {totalCredits}
      </p>
      <p>
        <span className="font-semibold">Estimated GPA:</span> {gpa.toFixed(2)}
      </p>
    </div>
  );
}

/* ----- Countdown ----- */
function CountdownSetup() {
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("myexamhelp_countdown");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { date?: string; hours?: string };
      if (parsed.date) setDate(parsed.date);
      if (parsed.hours) setHours(parsed.hours);
    } catch {}
  }, []);

  const save = (nextDate: string, nextHours: string) => {
    localStorage.setItem(
      "myexamhelp_countdown",
      JSON.stringify({ date: nextDate, hours: nextHours })
    );
    window.dispatchEvent(new Event("myexamhelp_countdown_updated"));
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium text-slate-800">Exam date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => {
            const next = e.target.value;
            setDate(next);
            save(next, hours);
          }}
          className="mt-2 w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-800">
          Weekly study hours target
        </label>
        <input
          type="number"
          min={0}
          value={hours}
          onChange={(e) => {
            const next = e.target.value;
            setHours(next);
            save(date, next);
          }}
          placeholder="e.g. 10"
          className="mt-2 w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
    </div>
  );
}

function CountdownOutput() {
  const [msg, setMsg] = useState("Pick a date to see your countdown.");

  useEffect(() => {
    const calc = () => {
      const raw = localStorage.getItem("myexamhelp_countdown");
      if (!raw) {
        setMsg("Pick a date to see your countdown.");
        return;
      }

      try {
        const parsed = JSON.parse(raw) as { date?: string; hours?: string };
        if (!parsed.date) {
          setMsg("Pick a date to see your countdown.");
          return;
        }

        const d = new Date(parsed.date + "T00:00:00");
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const ms = d.getTime() - today.getTime();
        const days = Math.ceil(ms / (1000 * 60 * 60 * 24));

        if (Number.isNaN(days)) {
          setMsg("Pick a date to see your countdown.");
          return;
        }

        if (days < 0) {
          setMsg("That date has already passed. Pick a new exam date.");
          return;
        }

        if (days === 0) {
          setMsg("Exam is today. You’ve got this.");
          return;
        }

        const weeklyHours = parsed.hours?.trim()
          ? ` Target study time: ${parsed.hours} hour(s) per week.`
          : "";

        setMsg(`${days} day(s) left until your exam.${weeklyHours}`);
      } catch {
        setMsg("Pick a date to see your countdown.");
      }
    };

    calc();
    window.addEventListener("myexamhelp_countdown_updated", calc);
    return () =>
      window.removeEventListener("myexamhelp_countdown_updated", calc);
  }, []);

  return (
    <div className="rounded-2xl border border-slate-500 bg-slate-100 p-4 text-sm text-slate-900">
      {msg}
    </div>
  );
}

/* ----- Study ----- */
function StudySetup() {
  const [minutes, setMinutes] = useState("");
  const [note, setNote] = useState("");

  const addSession = () => {
    const safeMinutes = Number(minutes);
    if (!safeMinutes || safeMinutes <= 0) return;

    const raw = localStorage.getItem("myexamhelp_study");
    let sessions: Array<{ minutes: number; note: string; createdAt: number }> = [];

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as {
          sessions?: Array<{ minutes: number; note: string; createdAt: number }>;
        };
        sessions = parsed.sessions || [];
      } catch {}
    }

    sessions.unshift({
      minutes: safeMinutes,
      note: note.trim(),
      createdAt: Date.now(),
    });

    localStorage.setItem("myexamhelp_study", JSON.stringify({ sessions }));
    window.dispatchEvent(new Event("myexamhelp_study_updated"));
    setMinutes("");
    setNote("");
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-800">
          Study minutes
        </label>
        <input
          type="number"
          min={1}
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          placeholder="e.g. 45"
          className="mt-2 w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-800">Topic / note</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Algebra revision"
          className="mt-2 w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <button
        type="button"
        onClick={addSession}
        className="w-full rounded-2xl bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-800"
      >
        Save study session
      </button>
    </div>
  );
}

function StudyOutput() {
  const [summary, setSummary] = useState(
    "Add a study session to start tracking."
  );

  useEffect(() => {
    const load = () => {
      const raw = localStorage.getItem("myexamhelp_study");
      if (!raw) {
        setSummary("Add a study session to start tracking.");
        return;
      }

      try {
        const parsed = JSON.parse(raw) as {
          sessions?: Array<{ minutes: number; note: string; createdAt: number }>;
        };
        const sessions = parsed.sessions || [];

        if (!sessions.length) {
          setSummary("Add a study session to start tracking.");
          return;
        }

        const totalMinutes = sessions.reduce(
          (sum, session) => sum + (Number(session.minutes) || 0),
          0
        );
        const totalHours = (totalMinutes / 60).toFixed(1);
        const latest = sessions[0];

        setSummary(
          `Total study time logged: ${totalMinutes} minute(s) (${totalHours} hour(s)). Latest session: ${latest.minutes} minute(s)${
            latest.note ? ` on ${latest.note}` : ""
          }.`
        );
      } catch {
        setSummary("Add a study session to start tracking.");
      }
    };

    load();
    window.addEventListener("myexamhelp_study_updated", load);
    return () => window.removeEventListener("myexamhelp_study_updated", load);
  }, []);

  return (
    <div className="rounded-2xl border border-slate-500 bg-slate-100 p-4 text-sm text-slate-800">
      {summary}
    </div>
  );
}

/* ----- Citation ----- */
function CitationSetup() {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [link, setLink] = useState("");
  const [style, setStyle] = useState("APA");

  useEffect(() => {
    const raw = localStorage.getItem("myexamhelp_citation");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as {
        author?: string;
        title?: string;
        year?: string;
        link?: string;
        style?: string;
      };
      setAuthor(parsed.author || "");
      setTitle(parsed.title || "");
      setYear(parsed.year || "");
      setLink(parsed.link || "");
      setStyle(parsed.style || "APA");
    } catch {}
  }, []);

  const generate = () => {
    localStorage.setItem(
      "myexamhelp_citation",
      JSON.stringify({ author, title, year, link, style })
    );
    window.dispatchEvent(new Event("myexamhelp_citation_updated"));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-800">Author</label>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="e.g. John Smith"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-800">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="e.g. Introduction to Biology"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-800">Year</label>
          <input
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="e.g. 2026"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-800">Style</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          >
            <option>APA</option>
            <option>MLA</option>
            <option>Chicago</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-800">Link</label>
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="e.g. https://example.com"
        />
      </div>

      <button
        type="button"
        onClick={generate}
        className="w-full rounded-2xl bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-800"
      >
        Generate citation
      </button>
    </div>
  );
}

function CitationOutput() {
  const [text, setText] = useState("Fill the form and generate a citation.");

  useEffect(() => {
    const load = () => {
      const raw = localStorage.getItem("myexamhelp_citation");
      if (!raw) {
        setText("Fill the form and generate a citation.");
        return;
      }

      try {
        const { author, title, year, link, style } = JSON.parse(raw) as {
          author: string;
          title: string;
          year: string;
          link: string;
          style: string;
        };

        if (!title?.trim()) {
          setText("Fill the form and generate a citation.");
          return;
        }

        let citation = "";

        if (style === "MLA") {
          citation = `${author || "Unknown author"}. "${title}." ${
            year || "n.d."
          }. ${link || ""}`.trim();
        } else if (style === "Chicago") {
          citation = `${author || "Unknown author"}. ${year || "n.d."}. "${title}." ${
            link || ""
          }`.trim();
        } else {
          citation = `${author || "Unknown author"} (${year || "n.d."}). ${title}. ${
            link || ""
          }`.trim();
        }

        setText(citation);
      } catch {
        setText("Fill the form and generate a citation.");
      }
    };

    load();
    window.addEventListener("myexamhelp_citation_updated", load);
    return () =>
      window.removeEventListener("myexamhelp_citation_updated", load);
  }, []);

  return (
    <div className="rounded-2xl border border-slate-500 bg-slate-100 p-4 text-sm text-slate-800">
      {text}
    </div>
  );
}

/* ----- Flashcards ----- */
function FlashcardsSetup() {
  const [topic, setTopic] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("myexamhelp_flashcards");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { topic?: string };
      if (parsed.topic) setTopic(parsed.topic);
    } catch {}
  }, []);

  const generate = () => {
    localStorage.setItem(
      "myexamhelp_flashcards",
      JSON.stringify({ topic: topic.trim() })
    );
    window.dispatchEvent(new Event("myexamhelp_flashcards_updated"));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-800">Topic</label>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Photosynthesis"
          className="mt-2 w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <button
        type="button"
        onClick={generate}
        className="w-full rounded-2xl bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-800"
      >
        Generate flashcards
      </button>
    </div>
  );
}

function FlashcardsOutput() {
  const [text, setText] = useState("Type a topic and generate flashcards.");

  useEffect(() => {
    const load = () => {
      const raw = localStorage.getItem("myexamhelp_flashcards");
      if (!raw) {
        setText("Type a topic and generate flashcards.");
        return;
      }

      try {
        const { topic } = JSON.parse(raw) as { topic: string };
        if (!topic?.trim()) {
          setText("Type a topic and generate flashcards.");
          return;
        }

        const cards = [
          `1. Q: What is ${topic}?  A: Write a simple definition in your own words.`,
          `2. Q: Why is ${topic} important?  A: Note its main purpose or role.`,
          `3. Q: What are the key parts of ${topic}?  A: List 3 main points.`,
          `4. Q: Give one example of ${topic}.  A: Add a practical example.`,
          `5. Q: What is one common mistake about ${topic}?  A: Write what to avoid.`,
        ];

        setText(cards.join("\n"));
      } catch {
        setText("Type a topic and generate flashcards.");
      }
    };

    load();
    window.addEventListener("myexamhelp_flashcards_updated", load);
    return () =>
      window.removeEventListener("myexamhelp_flashcards_updated", load);
  }, []);

  return (
    <div className="rounded-2xl border border-slate-500 bg-slate-100 p-4">
      <pre className="whitespace-pre-wrap text-sm text-slate-800 leading-6">
        {text}
      </pre>
    </div>
  );
}

/* ----- Rubric ----- */
function RubricSetup() {
  const [rubric, setRubric] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("myexamhelp_rubric");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { rubric?: string };
      if (parsed.rubric) setRubric(parsed.rubric);
    } catch {}
  }, []);

  const analyze = () => {
    localStorage.setItem(
      "myexamhelp_rubric",
      JSON.stringify({ rubric: rubric.trim() })
    );
    window.dispatchEvent(new Event("myexamhelp_rubric_updated"));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-800">
          Paste rubric
        </label>
        <textarea
          value={rubric}
          onChange={(e) => setRubric(e.target.value)}
          placeholder="Paste your grading rubric here..."
          className="mt-2 w-full min-h-[140px] rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <button
        type="button"
        onClick={analyze}
        className="w-full rounded-2xl bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-800"
      >
        Analyze rubric
      </button>
    </div>
  );
}

function RubricOutput() {
  const [text, setText] = useState("Paste a rubric to generate a checklist.");

  useEffect(() => {
    const load = () => {
      const raw = localStorage.getItem("myexamhelp_rubric");
      if (!raw) {
        setText("Paste a rubric to generate a checklist.");
        return;
      }

      try {
        const { rubric } = JSON.parse(raw) as { rubric: string };
        if (!rubric?.trim()) {
          setText("Paste a rubric to generate a checklist.");
          return;
        }

        const lines = rubric
          .split(/\n|\. /)
          .map((line) => line.trim())
          .filter(Boolean)
          .slice(0, 8);

        if (!lines.length) {
          setText("Paste a rubric to generate a checklist.");
          return;
        }

        const checklist = lines.map((line, i) => `☐ ${i + 1}. ${line}`);
        setText(checklist.join("\n"));
      } catch {
        setText("Paste a rubric to generate a checklist.");
      }
    };

    load();
    window.addEventListener("myexamhelp_rubric_updated", load);
    return () =>
      window.removeEventListener("myexamhelp_rubric_updated", load);
  }, []);

  return (
    <div className="rounded-2xl border border-slate-300 bg-slate-100 p-4">
      <pre className="whitespace-pre-wrap text-sm text-slate-800 leading-6">
        {text}
      </pre>
    </div>
  );
}

/* ---------------------------
   Request Help Modal
---------------------------- */
function RequestHelpModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-xl ring-1 ring-black/10 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Request Help</h3>
            <p className="mt-1 text-sm text-slate-700">
              This saves your request locally on this device for now.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-800">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-800">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-2 w-full min-h-[110px] rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Tell us what you need help with..."
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                const payload = { name, message, createdAt: Date.now() };
                localStorage.setItem(
                  "myexamhelp_request_help",
                  JSON.stringify(payload)
                );
                setSaved(true);
              }}
              className="rounded-2xl bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-800"
            >
              Save request
            </button>

            <button
              type="button"
              onClick={async () => {
                const payload = { name, message };
                await navigator.clipboard.writeText(
                  JSON.stringify(payload, null, 2)
                );
                setSaved(true);
              }}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 hover:bg-slate-100"
            >
              Copy to clipboard
            </button>
          </div>

          {saved && (
            <p className="text-sm text-emerald-800">
              Request saved successfully.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FreeToolsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FreeToolsPageContent />
    </Suspense>
  );
}