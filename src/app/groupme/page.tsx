// src/app/groupme/page.tsx
import Link from "next/link";

const groups = [
  { label: "MyExamHelp – Proctored Exam Support (All Exams)", href: "/groupme/proctored-exams" },
  { label: "MyExamHelp – Nursing & TEAS / HESI", href: "/groupme/nursing" },
  { label: "MyExamHelp – Praxis Exam Prep", href: "/groupme/praxis" },
  { label: "MyExamHelp – GMAT / GRE Support", href: "/groupme/gmat-gre" },
  { label: "MyExamHelp – Real Estate Licensing Exams", href: "/groupme/real-estate" },
  { label: "MyExamHelp – CompTIA / IT Certification Exams", href: "/groupme/comptia-it" },
  { label: "MyExamHelp – LSAT / Law School Prep", href: "/groupme/lsat-law" },
  { label: "MyExamHelp – ATI & NCLEX Practice Support", href: "/groupme/ati-nclex" },
  { label: "Assignment & Coursework Groups", href: "/groupme/assignment-coursework" },
];

export default function GroupMePage() {
  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-10 md:pt-16">
        <p className="text-sm opacity-70">MyExamHelp</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold leading-tight">
          GroupMe Study Groups (Coming Soon)
        </h1>
        <p className="mt-4 text-base md:text-lg opacity-80">
          These pages will mirror your Services layout. You’ll add the group links, rules,
          and verification details later.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/request-help"
            className="rounded-xl bg-orange-500 px-5 py-3 text-white font-semibold hover:bg-orange-600 transition"
          >
            Request Help
          </Link>
          <Link
            href="/services"
            className="rounded-xl border px-5 py-3 font-semibold hover:bg-black hover:text-white transition"
          >
            View Services
          </Link>
        </div>
      </section>

      {/* GROUP CARDS */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          {groups.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-bold">{g.label}</h3>
              <p className="mt-2 text-sm opacity-75">
                Placeholder page — you’ll add GroupMe join links and content later.
              </p>
              <div className="mt-4">
                <span className="inline-flex rounded-full border px-3 py-1 text-xs font-semibold">
                  Coming Soon
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}