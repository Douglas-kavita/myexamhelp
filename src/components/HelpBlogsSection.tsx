"use client";

import Link from "next/link";

type BlogCard = {
  title: string;
  description: string;
  subtext: string;
  href: string;
  gradient: string;
  ring: string;
  glow: string;
};

const BLOG_CARDS: BlogCard[] = [
  {
    title: "LSAT Exam Help Master Guide",
    description:
      "Law school admissions guidance, exam structure, preparation strategy, and score understanding.",
    subtext:
      "Covers LSAT basics, timing, sections, study direction, and practical support.",
    href: "/blog/lsat-exam-help-master-guide",
    gradient: "from-amber-400 via-yellow-300 to-orange-500",
    ring: "ring-yellow-200/70",
    glow: "shadow-[0_0_25px_rgba(251,191,36,0.35)]",
  },
  {
    title: "AWS Exam Help Master Guide",
    description:
      "Cloud certification support, exam prep direction, key topic areas, and confidence-building guidance.",
    subtext:
      "Useful for learners preparing for AWS certifications and related assessments.",
    href: "/blog/aws-exam-help-master-guide",
    gradient: "from-cyan-400 via-sky-400 to-blue-600",
    ring: "ring-cyan-200/70",
    glow: "shadow-[0_0_25px_rgba(34,211,238,0.30)]",
  },
  {
    title: "GED Exam Help Master Guide (U.S. Focus)",
    description:
      "GED overview, subjects, scoring, scheduling, study planning, and what to expect before test day.",
    subtext:
      "Built for students who want a clear path toward GED preparation and readiness.",
    href: "/blog/ged-exam-help-master-guide-us-focus",
    gradient: "from-emerald-400 via-lime-300 to-green-500",
    ring: "ring-lime-200/70",
    glow: "shadow-[0_0_25px_rgba(132,204,22,0.30)]",
  },
  {
    title: "Praxis Exam Help Master Guide",
    description:
      "Teacher exam support, preparation direction, test understanding, and practical study help.",
    subtext:
      "A strong starting point for students preparing for Praxis-related exam goals.",
    href: "/blog/praxis-exam-help-master-guide",
    gradient: "from-fuchsia-500 via-pink-400 to-rose-500",
    ring: "ring-pink-200/70",
    glow: "shadow-[0_0_25px_rgba(236,72,153,0.30)]",
  },
];

export default function HelpBlogsSection() {
  return (
    <section className="bg-[#f7f7f7] py-12">

      <div className="w-full px-4 md:px-8 lg:px-12">

        <div className="mb-6">
          <h2 className="text-3xl font-extrabold text-black md:text-4xl">
            What we help with
          </h2>

          <p className="mt-2 text-slate-600 text-base">
            Explore our featured exam help master guides and open the full blog
            post for detailed support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {BLOG_CARDS.map((card) => (
            <article
              key={card.title}
              className={`relative rounded-[24px] bg-gradient-to-br ${card.gradient} p-[1px] ${card.glow} transition hover:-translate-y-1`}
            >
              <div className="relative flex flex-col justify-between rounded-[23px] bg-black/20 px-6 py-5">

                <div>
                  <h3 className="text-2xl font-extrabold text-white">
                    {card.title}
                  </h3>

                  <p className="mt-2 text-white/95 text-[14px] leading-6">
                    {card.description}
                  </p>

                  <p className="mt-1 text-white/85 text-[13px] leading-6">
                    {card.subtext}
                  </p>
                </div>

                <div className="mt-3">
                  <Link
                    href={card.href}
                    className="inline-flex items-center rounded-full bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-500 px-5 py-2 text-sm font-bold text-black shadow-md hover:scale-[1.03]"
                  >
                    Read more →
                  </Link>
                </div>

              </div>
            </article>
          ))}

        </div>

        <div className="mt-6">
          <Link
            href="/blog"
            className="inline-flex rounded-full bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-500 px-6 py-2.5 text-sm font-extrabold text-black shadow-md"
          >
            Read more →
          </Link>
        </div>

      </div>
    </section>
  );
}