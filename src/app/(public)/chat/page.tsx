"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ChatPage() {
  useEffect(() => {
    window.dispatchEvent(new Event("myexamhelp:open-chat"));
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/chat/chat-bg.jpg')" }}
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
     <section className="relative z-10 flex items-start justify-center min-h-screen px-6 pt-84 md:pt-100">
        <div className="w-full max-w-3xl rounded-3xl bg-white/95 backdrop-blur-md shadow-2xl border border-white/30 p-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            Start a Chat with MyExamHelp
          </h1>

          <p className="mt-3 text-black/70">
            The chat bubble should open automatically. If it doesn’t,
            click the button below.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new Event("myexamhelp:open-chat"))
              }
              className="rounded-xl px-5 py-3 bg-black text-white font-medium hover:opacity-95"
            >
              Open Chat
            </button>

            <Link
              href="/services"
              className="rounded-xl px-5 py-3 border border-black/20 font-medium hover:bg-black/5"
            >
              Back to Services
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border bg-orange-50 p-5">
              <h2 className="font-semibold">What to send</h2>
              <ul className="mt-3 list-disc pl-5 text-sm text-black/70 space-y-1">
                <li>Exam / service name</li>
                <li>Deadline / target date</li>
                <li>Instructions</li>
                <li>Screenshots (optional)</li>
              </ul>
            </div>

            <div className="rounded-2xl border bg-emerald-50 p-5">
              <h2 className="font-semibold">What happens next</h2>
              <ul className="mt-3 list-disc pl-5 text-sm text-black/70 space-y-1">
                <li>We review your request</li>
                <li>Recommend a clear plan</li>
                <li>Guide you step-by-step</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}