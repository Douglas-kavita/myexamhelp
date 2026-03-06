"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type TabKey = "certification" | "ged" | "teas" | "lsat" | "aws" | "proctored";

type Tab = {
  key: TabKey;
  label: string;
  heading: string;
  subheading: string;
  body: string[];
};

type CategoryKey =
  | "certificationExams"
  | "standardizedTests"
  | "professionalLicensure"
  | "technology"
  | "lawSchoolAdmissions"
  | "cloudCertifications";

type Category = {
  key: CategoryKey;
  label: string;
  heading: string;
  subheading: string;
  body: string[];
};

type QuickKey = "freeTools" | "blog" | "groupme";
type ContentMode = "hero" | "category" | "quick";

const SIDEBAR_BULLETS = [
  "Certification Exams",
  "Standardized Tests",
  "Professional Licensure",
  "Technology",
  "Law School Admissions",
  "Cloud Certifications",
] as const;

// ✅ Categories are independent from hero tabs (no shared state, no URL sync)
const CATEGORIES: Category[] = [
  {
    key: "certificationExams",
    label: "Certification Exams",
    heading: "Certification Exams",
    subheading:
      "Support across popular certification tracks with clear, structured guidance.",
    body: [
      "Placeholder content — you will paste unique content for this category.",
      "This category is independent from the hero tabs above.",
    ],
  },
  {
    key: "standardizedTests",
    label: "Standardized Tests",
    heading: "Standardized Tests",
    subheading:
      "Study plans, practice structure, and targeted improvement for standardized tests.",
    body: [
      "Placeholder content — you will paste unique content for this category.",
      "This category is independent from the hero tabs above.",
    ],
  },
  {
    key: "professionalLicensure",
    label: "Professional Licensure",
    heading: "Professional Licensure",
    subheading:
      "Licensure-focused support with requirements clarity and step-by-step planning.",
    body: [
      "Placeholder content — you will paste unique content for this category.",
      "This category is independent from the hero tabs above.",
    ],
  },
  {
    key: "technology",
    label: "Technology",
    heading: "Technology",
    subheading:
      "Technical learning support with practical breakdowns and guided practice.",
    body: [
      "Placeholder content — you will paste unique content for this category.",
      "This category is independent from the hero tabs above.",
    ],
  },
  {
    key: "lawSchoolAdmissions",
    label: "Law School Admissions",
    heading: "Law School Admissions",
    subheading:
      "Admissions support and prep guidance with clear strategy and structure.",
    body: [
      "Placeholder content — you will paste unique content for this category.",
      "This category is independent from the hero tabs above.",
    ],
  },
  {
    key: "cloudCertifications",
    label: "Cloud Certifications",
    heading: "Cloud Certifications",
    subheading:
      "Cloud certification prep support with exam-focused clarity and structure.",
    body: [
      "Placeholder content — you will paste unique content for this category.",
      "This category is independent from the hero tabs above.",
    ],
  },
];

const CATEGORY_BY_LABEL: Record<(typeof SIDEBAR_BULLETS)[number], CategoryKey> = {
  "Certification Exams": "certificationExams",
  "Standardized Tests": "standardizedTests",
  "Professional Licensure": "professionalLicensure",
  Technology: "technology",
  "Law School Admissions": "lawSchoolAdmissions",
  "Cloud Certifications": "cloudCertifications",
};

// ✅ Images mapping (kept exactly; no new paths)
const GALLERY_IMAGES: Record<
  "hero" | "category",
  Record<string, { src: string; alt: string }[]>
> = {
  hero: {
    certification: [
      { src: "/images/services/cert/1.jpg", alt: "Certification support" },
      { src: "/images/services/cert/2.jpg", alt: "Tutor guidance" },
      { src: "/images/services/cert/3.jpg", alt: "Study planning" },
      { src: "/images/services/cert/4.jpg", alt: "Exam preparation" },
    ],
    ged: [
      { src: "/images/services/cert/1.jpg", alt: "GED study support" },
      { src: "/images/services/cert/2.jpg", alt: "GED practice and planning" },
      { src: "/images/services/cert/3.jpg", alt: "GED focused learning" },
      { src: "/images/services/cert/4.jpg", alt: "GED confidence building" },
    ],
    teas: [
      { src: "/images/services/cert/1.jpg", alt: "ATI TEAS prep" },
      { src: "/images/services/cert/2.jpg", alt: "Focused practice" },
      { src: "/images/services/cert/3.jpg", alt: "Topic review" },
      { src: "/images/services/cert/4.jpg", alt: "Study guidance" },
    ],
    lsat: [
      { src: "/images/services/lsat-4.jpg", alt: "LSAT prep" },
      { src: "/images/services/lsat-4.jpg", alt: "Strategy and practice" },
      { src: "/images/services/lsat-4.jpg", alt: "Reading and reasoning" },
      { src: "/images/services/lsat-4.jpg", alt: "Practice drills" },
    ],
    aws: [
      { src: "/images/services/aws/1.jpg", alt: "Cloud certification prep" },
      { src: "/images/services/aws/2.jpg", alt: "Hands-on learning" },
      { src: "/images/services/aws/3.jpg", alt: "Cloud labs" },
      { src: "/images/services/aws/4.jpg", alt: "Exam readiness" },
    ],
    proctored: [
      { src: "/images/services/cert/1.jpg", alt: "Proctored exam support" },
      { src: "/images/services/cert/2.jpg", alt: "Proctoring guidance" },
      { src: "/images/services/cert/3.jpg", alt: "Secure exam setup" },
      { src: "/images/services/cert/4.jpg", alt: "Exam-day support" },
    ],
  },
  category: {
    certificationExams: [
      { src: "/images/services/cert/1.jpg", alt: "Certification category" },
      { src: "/images/services/cert/2.jpg", alt: "Tutoring support" },
      { src: "/images/services/cert/3.jpg", alt: "Study sessions" },
      { src: "/images/services/cert/4.jpg", alt: "Exam planning" },
    ],
    standardizedTests: [
      { src: "/images/services/cert/1.jpg", alt: "Standardized tests" },
      { src: "/images/services/cert/2.jpg", alt: "Practice tests" },
      { src: "/images/services/cert/3.jpg", alt: "Study resources" },
      { src: "/images/services/cert/4.jpg", alt: "Guided prep" },
    ],
    professionalLicensure: [
      { src: "/images/services/cert/1.jpg", alt: "Licensure support" },
      { src: "/images/services/cert/2.jpg", alt: "Requirements review" },
      { src: "/images/services/cert/3.jpg", alt: "Focused planning" },
      { src: "/images/services/cert/4.jpg", alt: "Exam guidance" },
    ],
    technology: [
      { src: "/images/services/aws/1.jpg", alt: "Technology support" },
      { src: "/images/services/aws/2.jpg", alt: "Hands-on practice" },
      { src: "/images/services/aws/3.jpg", alt: "Tutoring sessions" },
      { src: "/images/services/aws/4.jpg", alt: "Guided learning" },
    ],
    lawSchoolAdmissions: [
      { src: "/images/services/lsat-4.jpg", alt: "Law admissions support" },
      { src: "/images/services/lsat-4.jpg", alt: "Preparation strategy" },
      { src: "/images/services/lsat-4.jpg", alt: "Study planning" },
      { src: "/images/services/lsat-4.jpg", alt: "Guided practice" },
    ],
    cloudCertifications: [
      { src: "/images/services/aws/1.jpg", alt: "Cloud certification support" },
      { src: "/images/services/aws/2.jpg", alt: "Cloud learning" },
      { src: "/images/services/aws/3.jpg", alt: "Practice labs" },
      { src: "/images/services/aws/4.jpg", alt: "Exam readiness" },
    ],
  },
};

const TABS: Tab[] = [
  {
    key: "certification",
    label: "Certification Exam Help",
    heading: "Certification Exam Help",
    subheading: "Prep support and structured guidance for certification pathways.",
    body: [],
  },
  {
    key: "ged",
    label: "GED Exam Help",
    heading: "GED Exam Help",
    subheading:
      "Simple plan, focused practice, and confidence-building guidance for GED success.",
    body: [],
  },
  {
    key: "teas",
    label: "ATI TEAS Exam Help",
    heading: "ATI TEAS Exam Help",
    subheading:
      "Targeted prep for ATI TEAS with clear steps and topic-by-topic improvement.",
    body: [],
  },
  {
    key: "lsat",
    label: "LSAT Exam Help Master Guide",
    heading: "LSAT Exam Help Master Guide",
    subheading:
      "Strategy-first guidance: logic games, logical reasoning, and reading comp structure.",
    body: [],
  },
  {
    key: "aws",
    label: "AWS Exam Help Master Guide",
    heading: "AWS Exam Help Master Guide",
    subheading:
      "Cloud certification support with practical breakdowns and exam-focused clarity.",
    body: [],
  },
  {
    key: "proctored",
    label: "Proctored Exam Help",
    heading: "Proctored Exam Help",
    subheading:
      "Support for proctored exam workflows with clear steps, setup guidance, and calm execution.",
    body: [],
  },
];

// put image here -> public/images/services/services-hero.jpg
const HERO_BG = "/images/services/services-hero.jpg";

type StepItem = { title: string; body: string };

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function isTabKey(x: string | null): x is TabKey {
  return (
    x === "certification" ||
    x === "ged" ||
    x === "teas" ||
    x === "lsat" ||
    x === "aws" ||
    x === "proctored"
  );
}

/**
 * Best-effort open chat widget (if available),
 * and also broadcast a custom event so YOUR widget can listen.
 */
function tryOpenChatWidget() {
  try {
    const w = window as any;
    w?.ChatWidget?.open?.();
    w?.chatWidget?.open?.();
    w?.$chat?.open?.();
    window.dispatchEvent(new CustomEvent("myexamhelp:open-chat"));
  } catch {
    // no-op
  }
}

const CERT_STEPS: StepItem[] = [
  {
    title: "Submit Your Certification Exam Details",
    body: "Share your certification (e.g., PMP, AWS, CompTIA), target exam date, and any requirements or weak areas. This helps us build a focused plan that fits your timeline.",
  },
  {
    title: "Get a Free Study Plan + Quote",
    body: "We review your request and send a personalized study plan with a clear, no-obligation quote. You’ll know exactly what support you’re getting and what to expect.",
  },
  {
    title: "Start 1:1 Tutoring + Targeted Practice",
    body: "You’ll work with a tutor aligned to your certification track. We break down tough concepts, guide practice questions, and teach you exam-style thinking.",
  },
  {
    title: "Fix Weak Areas + Build Exam Strategy",
    body: "We identify what’s costing you points and focus there. You’ll learn timing, elimination tactics, and how to handle tricky questions with confidence.",
  },
  {
    title: "Final Review + Exam-Day Confidence",
    body: "Before test day, we tighten your revision plan and run a readiness check. You’ll get a simple exam-day checklist so you walk in calm and prepared.",
  },
];

const CERT_PHOTOS = [
  {
    src: "/images/services/cert/1.jpg",
    alt: "Student submitting certification exam details for a personalized study plan",
  },
  {
    src: "/images/services/cert/2.jpg",
    alt: "1:1 tutoring session for certification preparation",
  },
  {
    src: "/images/services/cert/3.jpg",
    alt: "Focused classroom-style review of key certification concepts",
  },
  {
    src: "/images/services/cert/4.jpg",
    alt: "Group study support and practice question walkthroughs",
  },
] as const;

// ✅ Brighter / thicker tab backgrounds (aim “400” vibe)
const MIDDLE_BG_BY_TAB: Record<TabKey, string> = {
  certification:
    "bg-gradient-to-br from-amber-300 via-yellow-200 to-lime-200",
  ged: "bg-gradient-to-br from-emerald-300 via-lime-200 to-green-200",
  teas: "bg-gradient-to-br from-sky-300 via-cyan-200 to-teal-200",
  lsat: "bg-gradient-to-br from-violet-300 via-fuchsia-200 to-pink-200",
  aws: "bg-gradient-to-br from-orange-300 via-amber-200 to-yellow-200",
  proctored: "bg-gradient-to-br from-rose-300 via-pink-200 to-orange-200",
};

const MIDDLE_ACCENT_BY_TAB: Record<TabKey, string> = {
  certification: "text-amber-950",
  ged: "text-emerald-950",
  teas: "text-sky-950",
  lsat: "text-violet-950",
  aws: "text-orange-950",
  proctored: "text-rose-950",
};

export default function ServicesPage() {
  const sp = useSearchParams();

  const initialHeroTab: TabKey = isTabKey(sp.get("tab"))
    ? (sp.get("tab") as TabKey)
    : "certification";
  const [activeHeroTab, setActiveHeroTab] = useState<TabKey>(initialHeroTab);

  const [activeCategory, setActiveCategory] =
    useState<CategoryKey>("certificationExams");

  const [contentMode, setContentMode] = useState<ContentMode>("hero");
  const [activeQuick, setActiveQuick] = useState<QuickKey>("freeTools");

  const [certStep, setCertStep] = useState<number>(1);

  useEffect(() => {
    const next = sp.get("tab");
    if (isTabKey(next) && next !== activeHeroTab) {
      setActiveHeroTab(next);
      setContentMode("hero");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  useEffect(() => {
    if (contentMode === "hero") setCertStep(1);
  }, [contentMode, activeHeroTab]);

  const heroCurrent = useMemo(
    () => TABS.find((t) => t.key === activeHeroTab) ?? TABS[0],
    [activeHeroTab]
  );

  const categoryCurrent = useMemo(
    () => CATEGORIES.find((c) => c.key === activeCategory) ?? CATEGORIES[0],
    [activeCategory]
  );

  // ✅ Right gallery stays constant (uses your existing working cert images)
  const rightSidebarImages = GALLERY_IMAGES.hero.certification;

  const middleBg =
    contentMode === "hero" ? MIDDLE_BG_BY_TAB[activeHeroTab] : "bg-slate-100";
  const middleAccent =
    contentMode === "hero"
      ? MIDDLE_ACCENT_BY_TAB[activeHeroTab]
      : "text-slate-900";

  const activeCertStep = CERT_STEPS[Math.max(0, Math.min(4, certStep - 1))];

  // ✅ Colored “white” boxes (still readable)
  const PANEL_TINTS: Record<
    TabKey,
    { panel: string; panel2: string; panel3: string }
  > = {
    certification: {
      panel: "bg-white/80",
      panel2: "bg-amber-50/80",
      panel3: "bg-yellow-50/80",
    },
    ged: {
      panel: "bg-white/80",
      panel2: "bg-emerald-50/80",
      panel3: "bg-lime-50/80",
    },
    teas: {
      panel: "bg-white/80",
      panel2: "bg-sky-50/80",
      panel3: "bg-cyan-50/80",
    },
    lsat: {
      panel: "bg-white/80",
      panel2: "bg-violet-50/80",
      panel3: "bg-fuchsia-50/80",
    },
    aws: {
      panel: "bg-white/80",
      panel2: "bg-orange-50/80",
      panel3: "bg-amber-50/80",
    },
    proctored: {
      panel: "bg-white/80",
      panel2: "bg-rose-50/80",
      panel3: "bg-pink-50/80",
    },
  };

  const tints = PANEL_TINTS[activeHeroTab];

  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="pt-10">
        <div className="relative w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_BG})` }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/55" aria-hidden="true" />

          <div className="relative mx-auto max-w-6xl px-6 py-10">
            <p className="text-xs uppercase tracking-wide text-white/80">
              Services
            </p>

            {/* Tabs (KEEP LINKS EXACTLY AS-IS) */}
            <div className="mt-4 flex flex-wrap gap-2">
              {TABS.map((t) => {
                const isActive = t.key === activeHeroTab;
                return (
                  <Link
                    key={t.key}
                    href={
                      t.key === "certification"
                        ? "/services?tab=certification"
                        : `/services?tab=${encodeURIComponent(t.key)}`
                    }
                    onClick={() => {
                      setActiveHeroTab(t.key);
                      setContentMode("hero");
                    }}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition border",
                      isActive
                        ? "bg-white text-black border-white"
                        : "bg-white/10 text-white border-white/20 hover:bg-white/15"
                    )}
                  >
                    {t.label}
                  </Link>
                );
              })}
            </div>

            {/* Heading */}
            <div className="mt-6">
              <h1 className="text-3xl md:text-4xl font-semibold text-white">
                {heroCurrent.heading}
              </h1>
              <p className="mt-2 max-w-2xl text-sm md:text-base text-white/85">
                {heroCurrent.subheading}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT GRID */}
      <section className="w-full max-w-none px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr_340px] items-stretch">
          {/* LEFT: constant sidebar (BRIGHTER + MORE BOXES) */}
          <aside className="h-full self-stretch rounded-3xl border border-black/10 bg-gradient-to-br from-yellow-300 via-amber-200 to-orange-200 p-4 shadow-sm flex flex-col">
            <div className="space-y-6">
              <section className="rounded-2xl border border-black/10 bg-white/90 p-5 shadow-sm">
                <h3 className="text-sm font-semibold">Categories</h3>
                <ul className="mt-4 space-y-3 text-black">
                  {SIDEBAR_BULLETS.map((b) => {
                    const mappedCategory = CATEGORY_BY_LABEL[b];
                    const isActive =
                      contentMode === "category" &&
                      mappedCategory === activeCategory;

                    return (
                      <li key={b} className="flex items-start gap-3">
                        <span className="mt-2 h-2 w-2 rounded-full bg-black" />
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCategory(mappedCategory);
                            setContentMode("category");
                          }}
                          className={cn(
                            "text-left text-sm font-medium underline-offset-4",
                            isActive ? "underline" : "hover:underline"
                          )}
                          aria-current={isActive ? "page" : undefined}
                        >
                          {b}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section className="rounded-2xl border border-black/10 bg-white/90 p-5 shadow-sm">
                <h3 className="text-sm font-semibold">Need help now?</h3>
                <p className="mt-2 text-sm text-black/70">
                  Start a chat and share your exam, deadline, and instructions.
                </p>
                <div className="mt-4">
                  <Link
                    href="/chat"
                    onClick={() => tryOpenChatWidget()}
                    className="inline-flex rounded-xl px-4 py-2 bg-black text-white text-sm font-medium"
                  >
                    Start Chat →
                  </Link>
                </div>
              </section>

              {/* ✅ Quick links now control the MIDDLE like a “full page” */}
              <section className="rounded-2xl border border-black/10 bg-white/90 p-5 shadow-sm">
                <h3 className="text-sm font-semibold">Quick links</h3>
                <p className="mt-2 text-xs text-black/60">
                  Click to preview here (middle). You can still open the real page.
                </p>

                <div className="mt-4 grid gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveQuick("freeTools");
                        setContentMode("quick");
                      }}
                      className="text-sm font-medium underline underline-offset-4"
                    >
                      Free Tools (Preview)
                    </button>
                    <Link href="/free-tools" className="text-xs underline">
                      Open →
                    </Link>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveQuick("blog");
                        setContentMode("quick");
                      }}
                      className="text-sm font-medium underline underline-offset-4"
                    >
                      Blog (Preview)
                    </button>
                    <Link href="/blog" className="text-xs underline">
                      Open →
                    </Link>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveQuick("groupme");
                        setContentMode("quick");
                      }}
                      className="text-sm font-medium underline underline-offset-4"
                    >
                      GroupMe (Preview)
                    </button>
                    <Link href="/groupme" className="text-xs underline">
                      Open →
                    </Link>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-black/10 bg-white/90 p-5 shadow-sm">
                <h3 className="text-sm font-semibold">What to send in chat</h3>
                <ul className="mt-3 space-y-2 text-sm text-black/70">
                  <li>• Exam/service name</li>
                  <li>• Deadline / target date</li>
                  <li>• Any instructions</li>
                  <li>• Screenshots (optional)</li>
                </ul>
              </section>

              {/* ✅ NEW BOX 1 */}
              <section className="rounded-2xl border border-black/10 bg-white/90 p-5 shadow-sm">
                <h3 className="text-sm font-semibold">Typical turnaround</h3>
                <ul className="mt-3 space-y-2 text-sm text-black/70">
                  <li>• Same-day response in chat</li>
                  <li>• Plan + next steps after details</li>
                  <li>• Weekly structure (or urgent timeline)</li>
                </ul>
              </section>

              {/* ✅ NEW BOX 2 */}
              <section className="rounded-2xl border border-black/10 bg-white/90 p-5 shadow-sm">
                <h3 className="text-sm font-semibold">What you’ll get</h3>
                <ul className="mt-3 space-y-2 text-sm text-black/70">
                  <li>• 1:1 tutoring</li>
                  <li>• Targeted practice</li>
                  <li>• Strategy + review plan</li>
                </ul>
              </section>
            </div>

            <div className="mt-auto pt-6">
              <section className="rounded-2xl border border-black/10 bg-white/90 p-5 shadow-sm">
                <h3 className="text-sm font-semibold">Ready when you are</h3>
                <p className="mt-2 text-sm text-black/70">
                  Switch services above, then start a chat when ready.
                </p>
                <div className="mt-3">
                  <Link
                    href="/chat"
                    onClick={() => tryOpenChatWidget()}
                    className="inline-flex rounded-xl px-4 py-2 bg-black text-white text-sm font-medium"
                  >
                    Start Chat →
                  </Link>
                </div>
              </section>
            </div>
          </aside>

          {/* MIDDLE: the ONLY changing column */}
          <div className="space-y-6">
            {/* Main middle panel */}
            <article
              className={cn(
                "rounded-3xl border border-black/10 p-6 sm:p-8 shadow-sm",
                middleBg
              )}
            >
              {/* HERO MODE */}
              {contentMode === "hero" ? (
                <>
                  {/* CERTIFICATION */}
                  {activeHeroTab === "certification" ? (
                    <div className="prose prose-sm sm:prose-base max-w-none">
                      <h1 className={cn("font-semibold", middleAccent)}>
                        Feeling stuck with your certification exam?
                      </h1>
                      <p>
                        The pressure to pass, limited prep time, and fear of failing can make certification exams feel overwhelming.
                        When you’re balancing work, family, and deadlines, it’s hard to study consistently — and even with effort,
                        tricky questions can increase stress.
                      </p>
                      <p>
                        <strong>You don’t need shortcuts — you need a clear plan and real support.</strong>{" "}
                        We help you prepare properly for certifications like PMP, AWS, CompTIA, and more with tutoring, practice, and accountability.
                      </p>

                      <div className="not-prose mt-8">
                        <div className="flex flex-wrap gap-6 text-sm font-semibold">
                          {[1, 2, 3, 4, 5].map((n) => {
                            const active = n === certStep;
                            return (
                              <button
                                key={n}
                                type="button"
                                onClick={() => setCertStep(n)}
                                className={cn(
                                  "pb-2 border-b-4 transition",
                                  active
                                    ? "border-black text-black"
                                    : "border-transparent text-black/70 hover:text-black"
                                )}
                                aria-current={active ? "step" : undefined}
                              >
                                Step {n}
                              </button>
                            );
                          })}
                        </div>

                        <div className="mt-6">
                          <h2 className="text-xl sm:text-2xl font-semibold">
                            {activeCertStep.title}
                          </h2>
                          <p className="mt-3 text-sm sm:text-base text-black/75 leading-relaxed">
                            {activeCertStep.body}
                          </p>

                          <div className="mt-6 grid grid-cols-2 gap-3">
                            {CERT_PHOTOS.map((img) => (
                              <div
                                key={img.src}
                                className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border bg-white/70"
                              >
                                <Image
                                  src={img.src}
                                  alt={img.alt}
                                  fill
                                  className="object-cover"
                                  sizes="(min-width: 1024px) 520px, 45vw"
                                  priority={false}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 not-prose flex flex-wrap gap-3">
                        <Link
                          href="/chat"
                          onClick={() => tryOpenChatWidget()}
                          className="rounded-xl px-5 py-3 bg-black text-white font-medium"
                        >
                          Request Help
                        </Link>
                        <Link
                          href="/blog"
                          className="rounded-xl px-5 py-3 border border-black/20 bg-white/80 font-medium"
                        >
                          Read Blog
                        </Link>
                      </div>

                      <p className="mt-4 text-xs text-black/60">
                        Integrity note: tutoring and preparation only — no cheating, impersonation, or bypassing rules.
                      </p>
                    </div>
                  ) : null}

                  {/* GED (unique layout) */}
                  {activeHeroTab === "ged" ? (
                    <div className="space-y-6">
                      <div>
                        <h2 className={cn("text-2xl sm:text-3xl font-bold", middleAccent)}>
                          GED prep that’s clear, simple, and beginner-friendly
                        </h2>
                        <p className="mt-2 text-sm sm:text-base text-black/75">
                          We help you build confidence with clear explanations, smart practice, and a weekly plan that fits your schedule.
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <Card title="Math" body="Foundations → practice sets → timed questions." tint="bg-emerald-50/80" />
                        <Card title="Reading" body="Comprehension skills + question patterns." tint="bg-lime-50/80" />
                        <Card title="Science" body="Core concepts + interpreting data." tint="bg-green-50/80" />
                        <Card title="Social Studies" body="Key topics + source-based questions." tint="bg-emerald-50/80" />
                      </div>

                      <div className="rounded-2xl border border-black/10 bg-white/85 p-5">
                        <div className="text-sm font-semibold">Simple plan</div>
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                          <MiniStep title="Diagnose" body="Find weak areas fast." tint="bg-emerald-50/80" />
                          <MiniStep title="Build" body="Learn + practice daily." tint="bg-lime-50/80" />
                          <MiniStep title="Polish" body="Timed sets + review." tint="bg-green-50/80" />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Link
                          href="/chat"
                          onClick={() => tryOpenChatWidget()}
                          className="rounded-xl px-5 py-3 bg-black text-white font-medium"
                        >
                          Start GED Chat →
                        </Link>
                        <Link
                          href="/blog"
                          className="rounded-xl px-5 py-3 border border-black/20 bg-white/80 font-medium"
                        >
                          Study Tips
                        </Link>
                      </div>
                    </div>
                  ) : null}

                  {/* TEAS (unique layout) */}
                  {activeHeroTab === "teas" ? (
                    <div className="space-y-6">
                      <div>
                        <h2 className={cn("text-2xl sm:text-3xl font-bold", middleAccent)}>
                          ATI TEAS prep with structure + speed
                        </h2>
                        <p className="mt-2 text-sm sm:text-base text-black/75">
                          We focus on high-yield sections and build timing confidence with realistic practice.
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <BadgeCard title="Reading" bullets={["Patterns", "Speed", "Review"]} tint="bg-sky-50/80" />
                        <BadgeCard title="Math" bullets={["Formulas", "Timed drills", "Traps"]} tint="bg-cyan-50/80" />
                        <BadgeCard title="Science" bullets={["High-yield topics", "Data", "Recall"]} tint="bg-teal-50/80" />
                        <BadgeCard title="English" bullets={["Grammar rules", "Editing", "Quick wins"]} tint="bg-sky-50/80" />
                      </div>

                      <div className="rounded-2xl border border-black/10 bg-white/85 p-5">
                        <div className="text-sm font-semibold">How we improve your score</div>
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                          <MiniStep title="Diagnose" body="Pinpoint weak areas." tint="bg-sky-50/80" />
                          <MiniStep title="Train" body="Timed practice + fixes." tint="bg-cyan-50/80" />
                          <MiniStep title="Refine" body="Final review + strategy." tint="bg-teal-50/80" />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Link
                          href="/chat"
                          onClick={() => tryOpenChatWidget()}
                          className="rounded-xl px-5 py-3 bg-black text-white font-medium"
                        >
                          Start TEAS Chat →
                        </Link>
                        <Link
                          href="/blog"
                          className="rounded-xl px-5 py-3 border border-black/20 bg-white/80 font-medium"
                        >
                          Guides
                        </Link>
                      </div>
                    </div>
                  ) : null}

                  {/* LSAT (unique layout) */}
                  {activeHeroTab === "lsat" ? (
                    <div className="space-y-6">
                      <div>
                        <h2 className={cn("text-2xl sm:text-3xl font-bold", middleAccent)}>
                          LSAT support that’s strategy-first
                        </h2>
                        <p className="mt-2 text-sm sm:text-base text-black/75">
                          We teach repeatable systems, targeted drilling, and timed practice to break plateaus.
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <Card title="Logical Reasoning" body="Argument structure + traps." tint="bg-violet-50/80" />
                        <Card title="Reading Comp" body="Passage mapping + timing." tint="bg-fuchsia-50/80" />
                        <Card title="Test Strategy" body="Review system + pacing." tint="bg-pink-50/80" />
                      </div>

                      <div className="rounded-2xl border border-black/10 bg-white/85 p-5">
                        <div className="text-sm font-semibold">The drill method</div>
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                          <MiniStep title="Learn" body="One method at a time." tint="bg-violet-50/80" />
                          <MiniStep title="Drill" body="Target sets + error log." tint="bg-fuchsia-50/80" />
                          <MiniStep title="Timed" body="Sections + review rules." tint="bg-pink-50/80" />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Link
                          href="/chat"
                          onClick={() => tryOpenChatWidget()}
                          className="rounded-xl px-5 py-3 bg-black text-white font-medium"
                        >
                          Start LSAT Chat →
                        </Link>
                        <Link
                          href="/blog"
                          className="rounded-xl px-5 py-3 border border-black/20 bg-white/80 font-medium"
                        >
                          LSAT Articles
                        </Link>
                      </div>
                    </div>
                  ) : null}

                  {/* AWS (unique layout) */}
                  {activeHeroTab === "aws" ? (
                    <div className="space-y-6">
                      <div>
                        <h2 className={cn("text-2xl sm:text-3xl font-bold", middleAccent)}>
                          AWS exam help with scenario clarity
                        </h2>
                        <p className="mt-2 text-sm sm:text-base text-black/75">
                          We teach how to read AWS scenarios, map services, and eliminate wrong answers quickly.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-black/10 bg-white/85 p-5">
                        <div className="text-sm font-semibold">High-yield service map</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {["EC2", "S3", "IAM", "VPC", "RDS", "CloudWatch", "Lambda", "SQS", "CloudFront"].map(
                            (x) => (
                              <span
                                key={x}
                                className="rounded-full border border-black/10 bg-orange-100 px-3 py-1 text-xs font-semibold"
                              >
                                {x}
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-black/10 bg-white/85 p-5">
                        <div className="text-sm font-semibold">Scenario workflow</div>
                        <div className="mt-3 grid gap-3 sm:grid-cols-4">
                          <MiniStep title="Read" body="Find constraints." tint="bg-orange-50/80" />
                          <MiniStep title="Map" body="Pick service family." tint="bg-amber-50/80" />
                          <MiniStep title="Eliminate" body="Remove traps." tint="bg-yellow-50/80" />
                          <MiniStep title="Choose" body="Best answer." tint="bg-orange-50/80" />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Link
                          href="/chat"
                          onClick={() => tryOpenChatWidget()}
                          className="rounded-xl px-5 py-3 bg-black text-white font-medium"
                        >
                          Start AWS Chat →
                        </Link>
                        <Link
                          href="/blog"
                          className="rounded-xl px-5 py-3 border border-black/20 bg-white/80 font-medium"
                        >
                          AWS Guides
                        </Link>
                      </div>
                    </div>
                  ) : null}

                  {/* PROCTORED (unique layout) */}
                  {activeHeroTab === "proctored" ? (
                    <div className="space-y-6">
                      <div>
                        <h2 className={cn("text-2xl sm:text-3xl font-bold", middleAccent)}>
                          Proctored exam support (setup + calm execution)
                        </h2>
                        <p className="mt-2 text-sm sm:text-base text-black/75">
                          We help you prepare your environment, understand the workflow, and avoid common proctoring issues.
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-black/10 bg-white/85 p-5">
                          <div className="text-sm font-semibold">Setup checklist</div>
                          <ul className="mt-3 space-y-2 text-sm text-black/75">
                            <li>• Stable internet + power</li>
                            <li>• Clean desk + allowed items</li>
                            <li>• Camera/mic check</li>
                            <li>• ID ready + room scan</li>
                          </ul>
                        </div>
                        <div className="rounded-2xl border border-black/10 bg-white/85 p-5">
                          <div className="text-sm font-semibold">Rehearsal steps</div>
                          <ol className="mt-3 space-y-2 text-sm text-black/75 list-decimal ml-5">
                            <li>Login + rules</li>
                            <li>ID + environment scan</li>
                            <li>System checks</li>
                            <li>Start exam navigation</li>
                          </ol>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Link
                          href="/chat"
                          onClick={() => tryOpenChatWidget()}
                          className="rounded-xl px-5 py-3 bg-black text-white font-medium"
                        >
                          Start Proctored Chat →
                        </Link>
                        <Link
                          href="/blog"
                          className="rounded-xl px-5 py-3 border border-black/20 bg-white/80 font-medium"
                        >
                          Proctor Tips
                        </Link>
                      </div>
                    </div>
                  ) : null}
                </>
              ) : contentMode === "quick" ? (
                <QuickPreview which={activeQuick} onStartChat={() => tryOpenChatWidget()} />
              ) : (
                // CATEGORY MODE
                <div className="prose prose-sm sm:prose-base max-w-none">
                  <h1>{categoryCurrent.heading}</h1>
                  <p>{categoryCurrent.subheading}</p>
                  {categoryCurrent.body.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                  <div className="mt-8 not-prose flex flex-wrap gap-3">
                    <Link
                      href="/chat"
                      onClick={() => tryOpenChatWidget()}
                      className="rounded-xl px-5 py-3 bg-black text-white font-medium"
                    >
                      Request Help
                    </Link>
                    <Link
                      href="/blog"
                      className="rounded-xl px-5 py-3 border border-black/20 bg-white/80 font-medium"
                    >
                      Read Blog
                    </Link>
                  </div>
                </div>
              )}
            </article>

            {/* Middle extras (now tinted, not plain white) */}
            <section className={cn("rounded-3xl border border-black/10 p-6 sm:p-8 shadow-sm", tints.panel2)}>
              <h2 className="text-xl sm:text-2xl font-bold">How we help</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                <Feature title="Clear plan" body="We organize your prep into steps you can follow." />
                <Feature title="Guided practice" body="We correct mistakes and explain the right approach." />
                <Feature title="Confidence" body="Stay consistent, calm, and exam-ready." />
              </div>
            </section>

            <section className={cn("rounded-3xl border border-black/10 p-6 sm:p-8 shadow-sm", tints.panel3)}>
              <div className="flex items-end justify-between gap-6 flex-wrap">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">Testimonials</h2>
                  <p className="mt-2 text-sm text-black/70 max-w-2xl">
                    What learners say about the support.
                  </p>
                </div>
                <Link
                  href="/chat"
                  onClick={() => tryOpenChatWidget()}
                  className="underline text-sm"
                >
                  Start chat →
                </Link>
              </div>

              <div className="mt-6 overflow-x-auto pb-3">
                <div className="flex gap-4 min-w-max snap-x snap-mandatory">
                  <Testimonial name="Student" text="Clear explanations and fast replies. I stopped feeling lost." />
                  <Testimonial name="Exam Candidate" text="The plan kept me consistent. I knew exactly what to do next." />
                  <Testimonial name="Busy Professional" text="Structured support helped me study without stress." />
                </div>
              </div>
            </section>

            <section className={cn("rounded-3xl border border-black/10 p-6 sm:p-8 shadow-sm", tints.panel2)}>
              <h2 className="text-xl sm:text-2xl font-bold">FAQ</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Faq q="How do I start?" a="Click Start Chat and share your exam/service, deadline, and instructions." />
                <Faq q="Do you support urgent deadlines?" a="Yes—share your timeline and we’ll recommend the fastest plan." />
                <Faq q="Do you provide tutoring only?" a="Yes. We support learning and preparation only." />
                <Faq q="Can I get a plan first?" a="Yes—start chat and we’ll outline steps and expectations." />
              </div>

              <div className="mt-8">
                <Link
                  href="/chat"
                  onClick={() => tryOpenChatWidget()}
                  className="rounded-xl px-5 py-3 bg-black text-white font-medium inline-flex"
                >
                  Start Chat Now
                </Link>
              </div>
            </section>

            {/* CTA inside grid */}
            <section className="rounded-3xl border border-black/10 bg-black text-white p-8 shadow-sm">
              <h2 className="text-2xl md:text-3xl font-bold">Ready to get help?</h2>
              <p className="mt-3 opacity-80 max-w-2xl">
                Start a chat, share your requirements, and we’ll guide you with clear timelines.
              </p>
              <div className="mt-7">
                <Link
                  href="/chat"
                  onClick={() => tryOpenChatWidget()}
                  className="rounded-xl px-5 py-3 bg-white text-black font-medium inline-flex"
                >
                  Start Chat
                </Link>
              </div>
            </section>
          </div>

          {/* RIGHT: constant sidebar (BRIGHTER + MORE BOXES) */}
          <aside className="h-full self-stretch rounded-3xl border border-black/10 bg-gradient-to-br from-sky-300 via-cyan-200 to-indigo-200 p-4 shadow-sm flex flex-col">
            <div className="space-y-6">
              <section className="rounded-2xl border border-black/10 bg-white/90 p-4 shadow-sm">
                <h3 className="text-sm font-semibold">Gallery</h3>
                <p className="mt-1 text-xs text-black/60">
                  Put images in <span className="font-medium">/public/images/services/</span>
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {rightSidebarImages.map((img) => (
                    <div
                      key={img.src}
                      className="relative aspect-square w-full overflow-hidden rounded-xl border bg-gray-50"
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover"
                        sizes="170px"
                        priority={false}
                      />
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-black/10 bg-white/90 p-5 shadow-sm">
                <h3 className="text-sm font-semibold">Request Help</h3>
                <p className="mt-2 text-sm text-black/70">
                  Click below to open chat and send the details.
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <Link
                    href="/chat"
                    onClick={() => tryOpenChatWidget()}
                    className="inline-flex justify-center rounded-xl px-4 py-2 bg-black text-white text-sm font-medium"
                  >
                    Start Chat →
                  </Link>
                  <Link
                    href="/blog"
                    className="inline-flex justify-center rounded-xl px-4 py-2 border border-black/20 bg-white/80 text-sm font-medium"
                  >
                    Read Blog
                  </Link>
                </div>
              </section>

              <section className="rounded-2xl border border-black/10 bg-white/90 p-5 shadow-sm">
                <h3 className="text-sm font-semibold">Quick checklist</h3>
                <ul className="mt-3 space-y-2 text-sm text-black/70">
                  <li>• Exam/service</li>
                  <li>• Deadline / target date</li>
                  <li>• Any instructions</li>
                  <li>• Screenshots (optional)</li>
                </ul>
              </section>

              <section className="rounded-2xl border border-black/10 bg-white/90 p-5 shadow-sm">
                <h3 className="text-sm font-semibold">Privacy</h3>
                <p className="mt-2 text-sm text-black/70">
                  Your details are handled carefully and professionally.
                </p>
              </section>

              {/* ✅ NEW BOX 1 */}
              <section className="rounded-2xl border border-black/10 bg-white/90 p-5 shadow-sm">
                <h3 className="text-sm font-semibold">Support hours</h3>
                <p className="mt-2 text-sm text-black/70">
                  We reply quickly in chat and can plan sessions across time zones.
                </p>
              </section>

              {/* ✅ NEW BOX 2 */}
              <section className="rounded-2xl border border-black/10 bg-white/90 p-5 shadow-sm">
                <h3 className="text-sm font-semibold">Recommended next step</h3>
                <p className="mt-2 text-sm text-black/70">
                  Send your exam + deadline. We’ll reply with a clear plan.
                </p>
              </section>
            </div>

            <div className="mt-auto pt-6">
              <section className="rounded-2xl border border-black/10 bg-white/90 p-5 shadow-sm">
                <h3 className="text-sm font-semibold">Need a fast start?</h3>
                <p className="mt-2 text-sm text-black/70">
                  Send your exam + deadline and we’ll reply with next steps.
                </p>
                <div className="mt-3">
                  <Link
                    href="/chat"
                    onClick={() => tryOpenChatWidget()}
                    className="inline-flex rounded-xl px-4 py-2 bg-black text-white text-sm font-medium"
                  >
                    Start Chat →
                  </Link>
                </div>
              </section>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 h-10 w-10 shrink-0 rounded-xl border bg-white/80 flex items-center justify-center">
        <span className="text-lg" aria-hidden>
          ✓
        </span>
      </div>
      <div>
        <div className="text-lg font-semibold">{title}</div>
        <div className="mt-2 opacity-80 leading-relaxed">{body}</div>
      </div>
    </div>
  );
}

function Testimonial({ name, text }: { name: string; text: string }) {
  return (
    <div className="snap-start w-[320px] md:w-[380px] rounded-2xl border bg-white/90 p-6 shadow-sm">
      <div className="text-sm opacity-70">{name}</div>
      <div className="mt-3 text-base leading-relaxed">“{text}”</div>
      <div className="mt-5 text-sm font-semibold">— {name}</div>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border p-6 bg-white/90">
      <div className="font-semibold">{q}</div>
      <div className="mt-2 text-sm opacity-80 leading-relaxed">{a}</div>
    </div>
  );
}

function Card({ title, body, tint }: { title: string; body: string; tint?: string }) {
  return (
    <div className={cn("rounded-2xl border border-black/10 p-5 shadow-sm", tint ?? "bg-white/90")}>
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-2 text-sm text-black/70">{body}</div>
    </div>
  );
}

function MiniStep({ title, body, tint }: { title: string; body: string; tint?: string }) {
  return (
    <div className={cn("rounded-xl border border-black/10 p-4", tint ?? "bg-white/90")}>
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-2 text-sm text-black/70">{body}</div>
    </div>
  );
}

function BadgeCard({
  title,
  bullets,
  tint,
}: {
  title: string;
  bullets: string[];
  tint?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-black/10 p-5 shadow-sm", tint ?? "bg-white/90")}>
      <div className="text-sm font-semibold">{title}</div>
      <ul className="mt-3 space-y-2 text-sm text-black/70">
        {bullets.map((b) => (
          <li key={b}>• {b}</li>
        ))}
      </ul>
    </div>
  );
}

function QuickPreview({
  which,
  onStartChat,
}: {
  which: "freeTools" | "blog" | "groupme";
  onStartChat: () => void;
}) {
  const title =
    which === "freeTools"
      ? "Free Tools"
      : which === "blog"
      ? "Blog"
      : "GroupMe Communities";

  const desc =
    which === "freeTools"
      ? "Quick access to calculators, study helpers, and learning tools — built to save time."
      : which === "blog"
      ? "Practical tips, exam strategies, and step-by-step breakdowns you can use immediately."
      : "Join focused discussion groups for exam prep, accountability, and shared resources.";

  const bullets =
    which === "freeTools"
      ? [
          "GPA Calculator",
          "Study Planner",
          "Citation Helper",
          "Flashcards",
          "Rubric Generator",
          "Exam Countdown",
        ]
      : which === "blog"
      ? [
          "Study strategies by exam type",
          "Time management tips",
          "Practice routines",
          "Common mistakes to avoid",
          "How to stay consistent",
          "Confidence building",
        ]
      : [
          "Proctored Exam Support",
          "Nursing & TEAS / HESI",
          "LSAT / Law School Prep",
          "CompTIA / IT Certifications",
          "GED & Standardized Tests",
          "General Assignments",
        ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
        <p className="mt-2 text-sm sm:text-base text-black/75">{desc}</p>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white/85 p-5">
        <div className="text-sm font-semibold">What you’ll find here</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {bullets.map((b) => (
            <div
              key={b}
              className="rounded-xl border border-black/10 bg-white/90 p-4 text-sm text-black/75"
            >
              • {b}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white/85 p-5">
        <div className="text-sm font-semibold">Want help using these?</div>
        <p className="mt-2 text-sm text-black/70">
          Start a chat and tell us what you’re preparing for — we’ll guide you with clear steps.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/chat"
            onClick={() => onStartChat()}
            className="rounded-xl px-5 py-3 bg-black text-white font-medium"
          >
            Start Chat →
          </Link>
          <Link
            href={which === "freeTools" ? "/free-tools" : which === "blog" ? "/blog" : "/groupme"}
            className="rounded-xl px-5 py-3 border border-black/20 bg-white/80 font-medium"
          >
            Open full page →
          </Link>
        </div>
      </div>
    </div>
  );
}