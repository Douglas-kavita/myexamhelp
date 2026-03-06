// src/app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — MyExamHelp",
  description:
    "Learn about MyExamHelp and how we support exams, assignments, and online assessments.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-14 space-y-16">
      {/* Header */}
      <section className="space-y-4">
        <p className="text-sm opacity-70">MyExamHelp</p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Support that helps you submit on time — and understand the work.
        </h1>
        <p className="text-base md:text-lg opacity-80 max-w-3xl leading-relaxed">
          We help students with exam prep, assignments, and online assessments through clear
          step-by-step guidance, strong structure, and clean submission-ready output.
          If you want learning-focused help (not confusion), you’re in the right place.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/contact"
            className="rounded-xl px-5 py-3 bg-black text-white font-medium"
          >
            Get Help
          </Link>
          <Link
            href="/services"
            className="rounded-xl px-5 py-3 border font-medium"
          >
            View Services
          </Link>
          <Link
            href="/chat"
            className="rounded-xl px-5 py-3 border font-medium"
          >
            Open Chat
          </Link>
        </div>
      </section>

      {/* Values */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6">
          <div className="text-lg font-semibold">Clarity</div>
          <p className="mt-2 text-sm opacity-80">
            We explain step-by-step so you understand what’s happening and why.
          </p>
        </div>
        <div className="rounded-2xl border bg-white p-6">
          <div className="text-lg font-semibold">Speed</div>
          <p className="mt-2 text-sm opacity-80">
            Fast turnaround with clear timelines—especially for urgent deadlines.
          </p>
        </div>
        <div className="rounded-2xl border bg-white p-6">
          <div className="text-lg font-semibold">Privacy</div>
          <p className="mt-2 text-sm opacity-80">
            Confidential handling from first message to final delivery.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="rounded-2xl border bg-gray-50/60 p-6 md:p-8 space-y-4">
        <h2 className="text-2xl font-bold">How it works</h2>
        <ol className="list-decimal pl-5 space-y-2 opacity-85">
          <li>Start a chat and share your subject, deadline, and instructions.</li>
          <li>We confirm scope, timeline, and any key requirements.</li>
          <li>You receive step-by-step guidance and clean, submission-ready output.</li>
        </ol>
      </section>
    </div>
  );
}