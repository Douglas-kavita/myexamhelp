"use client";

// src/app/page.tsx
import Link from "next/link";
import Image from "next/image";
import ContactForm from "@/components/contactForm";

import HelpBlogsSection from "@/components/HelpBlogsSection";

function TrustImageCard({
  title,
  desc,
  src,
  alt,
}: {
  title: string;
  desc: string;
  src: string;
  alt: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden hover:border-slate-700 transition-colors">
      <div className="relative w-full h-44 md:h-52 bg-slate-800">
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(e) => {
            // If path is wrong, show a visible fallback instead of silently failing
            (e.currentTarget as HTMLImageElement).src = "/images/fallback.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
      </div>

      <div className="p-6">
        <div className="text-sm font-semibold text-blue-300">{title}</div>
        <div className="mt-2 text-sm text-slate-300 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="w-full bg-white text-slate-100">
      {/* HERO — background image with white overlay */}
      <section className="relative w-full overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          {/* ✅ FIX: next/image src must be a path (NO url(...)) */}
          <Image
            src="/images/services/services-hero.jpg"
            alt="Students studying"
            fill
            priority
            className="object-cover object-center"
          />
          {/* White overlay so text is black + section feels white */}
          <div className="absolute inset-0 bg-white/85" />
          {/* Optional soft fade at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-white/0 to-white" />
        </div>

        {/* Content */}
        <div className="relative w-full px-6 sm:px-10 lg:px-16 pt-16 pb-14 md:pt-24 md:pb-18">
          <p className="text-sm text-orange-500 font-semibold">MyExamHelp</p>

          {/* Heading spanning wide */}
          <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight text-black">
            Tutoring For All Proctored Exams and All Assignments Help, including
            LSAT,ATI TEAS,CLEP,GED
          </h1>

          <p className="mt-6 text-base md:text-lg text-gray-700 max-w-4xl">
            Fast turnaround, clear explanations, and confidential handling.
            Start a chat and we’ll guide you from requirements to delivery.
          </p>

          {/* Orange buttons (unchanged) */}
          <div className="mt-8 flex flex-wrap gap-4">
            <OpenChatButton className="rounded-xl px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-semibold">
              Request Help
            </OpenChatButton>

            <Link
              href="/services"
              className="rounded-xl px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-semibold"
            >
              View Services
            </Link>
            <Link
              href="/blog"
              className="rounded-xl px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-semibold"
            >
              Read Blog
            </Link>
          </div>

          {/* Optional: keep or remove these stats */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-yellow-300/70 bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-500 p-5 shadow-lg">
              <div className="text-lg font-semibold text-black">Fast</div>
              <div className="text-black/80">Quick turnaround</div>
            </div>
            <div className="rounded-2xl border border-yellow-300/70 bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-500 p-5 shadow-lg">
              <div className="text-lg font-semibold text-black">Clear</div>
              <div className="text-black/80">Step-by-step explanations</div>
            </div>
            <div className="rounded-2xl border border-yellow-300/70 bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-500 p-5 shadow-lg">
              <div className="text-lg font-semibold text-black">Private</div>
              <div className="text-black/80">Confidential handling</div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL BUTTONS */}
      <section className="w-full bg-white">
        <div className="w-full px-6 sm:px-10 lg:px-16 py-10">
          <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm">
            <h2 className="text-xl md:text-2xl font-bold text-black">
              Tap any button below to start chat immediately
            </h2>

            <div className="mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* LEFT SIDE – Existing Chat Buttons */}
              <div className="flex flex-wrap gap-4">
                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-sm"
                  style={{ backgroundColor: "#16a34a" }}
                >
                  <span aria-hidden>📱</span> WHATSAPP
                </a>

                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-sm"
                  style={{ backgroundColor: "#22c55e" }}
                >
                  <span aria-hidden>📱</span> WHATSAPP 2
                </a>

                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-sm"
                  style={{ backgroundColor: "#0ea5e9" }}
                >
                  <span aria-hidden>✈️</span> TELEGRAM
                </a>

                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-sm"
                  style={{ backgroundColor: "#2563eb" }}
                >
                  <span aria-hidden>✉️</span> EMAIL
                </a>
              </div>

              {/* RIGHT SIDE – New Shining Buttons */}
              <div className="flex flex-wrap gap-24 mr-4 lg:mr-36">
                <Link
                  href="/services"
                  className="group relative inline-flex items-center justify-center px-7 py-3 font-semibold text-white rounded-xl
                             bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg
                             transition-all duration-300 hover:scale-105 hover:shadow-orange-400/70
                             overflow-hidden"
                >
                  <span className="relative z-10">View Services →</span>
                  <span
                    className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-12
                               bg-gradient-to-r from-transparent via-white/35 to-transparent
                               animate-[shine_3s_infinite]"
                  />
                </Link>

                <Link
                  href="/tools"
                  className="group relative inline-flex items-center justify-center px-9 py-5 font-semibold text-white rounded-xl
                             bg-gradient-to-r from-indigo-500 to-blue-600 shadow-lg
                             transition-all duration-300 hover:scale-105 hover:shadow-blue-400/70
                             overflow-hidden"
                >
                  <span className="relative z-10">Free Tools →</span>
                  <span
                    className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-12
                               bg-gradient-to-r from-transparent via-white/35 to-transparent
                               animate-[shine_3s_infinite]"
                  />
                </Link>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-600">
              Prefer the site chat? Use the chat bubble at the bottom-right
              anytime.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="w-full bg-slate-950">
        <div className="w-full px-6 sm:px-10 lg:px-16 py-12">
          <div className="grid gap-10 lg:grid-cols-3">
            <Feature
              title="24/7 Tutor Support"
              body="Our global tutor bench stays online around the clock—ideal for last-minute deadlines and late-night study sessions."
            />
            <Feature
              title="Affordable Installments"
              body="Flexible payment options so you can start quickly while staying within budget—especially for time-sensitive work."
            />
            <Feature
              title="Fast Turnaround"
              body="From same-day emergencies to accelerated catch-up, we mobilize vetted experts fast—measured in hours, not days."
            />
            <Feature
              title="Specialist Subject Experts"
              body="We match you with support aligned to your course or certification—no generic, one-size-fits-all help."
            />
            <Feature
              title="Privacy First"
              body="Your details are handled discreetly. We prioritize confidentiality and careful communication end-to-end."
            />
            <Feature
              title="Platform-Ready Support"
              body="Guidance designed for real coursework and assessment platforms—clear steps, clean structure, and submission-ready output."
            />
          </div>
        </div>
      </section>

      {/* TRUST SECTION (2 image cards in rounded boxes) */}
      {/* TRUST SECTION */}
      <section className="w-full bg-slate-950">
        <div className="w-full px-6 sm:px-10 lg:px-16 py-14">
          <div className="grid gap-6 lg:grid-cols-3 items-start">
            <div className="lg:col-span-1">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Secure, confidential support
              </h2>
              <p className="mt-3 text-slate-300 leading-relaxed">
                We prioritize privacy, careful communication, and a professional process—so you can
                get tutoring and guidance confidently.
              </p>

              <div className="mt-6 space-y-3">
                <Bullet title="Privacy-first" body="Discreet handling and clear communication end-to-end." />
                <Bullet title="Transparent process" body="Scope, timelines, and expectations confirmed upfront." />
                <Bullet title="Flexible options" body="For eligible requests, pay-after-completion can be available." />
              </div>

              <div className="mt-8">
                <OpenChatButton className="inline-block w-full sm:w-auto rounded-xl px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm shadow-blue-600/20">
                  Request Help
                </OpenChatButton>
              </div>
            </div>

            <div className="lg:col-span-2 grid gap-4 md:grid-cols-2">
              <TrustImageCard
                title="Confidential Support"
                desc="Private 1-on-1 tutoring and guidance."
                src="/images/tools/security-1.png"
                alt="Confidential support"
              />
              <TrustImageCard
                title="Pay After Completion"
                desc="Available for eligible requests—confirm in chat."
                src="/images/tools/security-2.png"
                alt="Pay after completion"
              />
            </div>
          </div>
        </div>
      </section>

      <HelpBlogsSection />

      {/* TESTIMONIALS */}
      <section className="w-full bg-white py-16 overflow-hidden">
        <div className="w-full px-6 sm:px-10 lg:px-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black">
            TESTIMONIALS
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl">
            Real feedback from learners who used MyExamHelp.
          </p>

          <div className="mt-10 overflow-hidden">
            <div className="flex gap-6 w-max animate-marquee">
              {[...Array(2)].map((_, loop) => (
                <div key={loop} className="flex gap-6">
                  {[
                    {
                      name: "Jasmine R.",
                      text: "Clear explanations and very fast turnaround. Highly recommend.",
                    },
                    {
                      name: "Michael T.",
                      text: "Professional and confidential. Helped me meet a tight deadline.",
                    },
                    {
                      name: "Ava K.",
                      text: "Step-by-step guidance that actually made the topic easier.",
                    },
                    {
                      name: "Noah S.",
                      text: "Very responsive team. Smooth process from start to finish.",
                    },
                  ].map((t, i) => (
                    <div
                      key={`${loop}-${i}`}
                      className="w-[420px] rounded-2xl bg-slate-50 border border-slate-200 shadow-sm p-6"
                    >
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, star) => (
                          <span key={star} className="text-amber-400 text-lg">
                            ★
                          </span>
                        ))}
                      </div>

                      <p className="mt-4 text-gray-700 leading-relaxed">
                        “{t.text}”
                      </p>

                      <div className="mt-5 font-semibold text-black">
                        {t.name}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="w-full bg-blue-700 text-white">
        <div className="w-full px-6 sm:px-10 lg:px-16 py-16">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to get help?</h2>
          <p className="mt-3 opacity-90 max-w-2xl">
            Start a chat, share your requirements, and we’ll guide you with
            clear timelines.
          </p>
          <div className="mt-7">
            <OpenChatButton className="inline-block w-full sm:w-auto rounded-xl px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm shadow-blue-600/20">
              Request Help
            </OpenChatButton>
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 h-10 w-10 shrink-0 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center justify-center">
        <span className="text-lg text-blue-300" aria-hidden>
          ✓
        </span>
      </div>
      <div>
        <div className="text-lg font-semibold text-slate-100">{title}</div>
        <div className="mt-2 text-slate-300 leading-relaxed">{body}</div>
      </div>
    </div>
  );
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-[#4F63C6] p-6 hover:opacity-95 transition">
      <h3 className="font-semibold text-lg text-white">{title}</h3>
      <p className="mt-2 text-sm text-white/90">{desc}</p>
      <Link href="/chat" className="mt-4 inline-block underline text-sm text-white">
        Start chat →
      </Link>
    </div>
  );
}

function Bullet({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <div className="mt-1 h-9 w-9 shrink-0 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center justify-center">
        <span className="text-blue-300" aria-hidden>
          ✓
        </span>
      </div>
      <div>
        <div className="font-semibold text-slate-100">{title}</div>
        <div className="text-sm text-slate-300 leading-relaxed">{body}</div>
      </div>
    </div>
  );
}

function ImageCard({
  title,
  desc,
  src,
  alt,
}: {
  title: string;
  desc: string;
  src: string;
  alt: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden hover:border-slate-700 transition-colors">
      <div className="relative w-full h-44 md:h-52">
        <Image src={src} alt={alt} fill className="object-cover" priority={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
      </div>

      <div className="p-6">
        <div className="text-sm font-semibold text-blue-300">{title}</div>
        <div className="mt-2 text-sm text-slate-300 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-2xl border border-white/10 bg-white/10 px-5 py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <span className="text-white font-semibold">{q}</span>
        <span className="text-white/80 text-2xl leading-none group-open:rotate-45 transition-transform">
          +
        </span>
      </summary>
      <div className="mt-3 text-white/75 leading-relaxed">{a}</div>
    </details>
  );
}