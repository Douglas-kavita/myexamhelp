"use client";

import { useMemo, useState } from "react";

function waLink(number: string, text: string) {
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${number}?text=${encoded}`;
}

export default function ContactForm() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "1234567890";

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [generated, setGenerated] = useState("");

  const href = useMemo(() => waLink(phone, generated || ""), [phone, generated]);

  function build() {
    const text = `Hi MyExamHelp,
Name: ${name}
Contact: ${contact}

Request:
${message}

Deadline: (add your deadline)
Files: (add if you have any)`;
    setGenerated(text);
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold">Send a message</h2>
      <p className="mt-1 text-sm opacity-70">
        Fill this in, then send via WhatsApp.
      </p>

      <div className="mt-4 grid gap-3">
        <label className="grid gap-1 text-sm">
          Your name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-black/10 bg-transparent px-3 py-2 dark:border-white/10"
            placeholder="Jane"
          />
        </label>

        <label className="grid gap-1 text-sm">
          Email or phone
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="rounded-xl border border-black/10 bg-transparent px-3 py-2 dark:border-white/10"
            placeholder="jane@email.com or +123..."
          />
        </label>

        <label className="grid gap-1 text-sm">
          What do you need help with?
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-32 rounded-xl border border-black/10 bg-transparent px-3 py-2 dark:border-white/10"
            placeholder="Describe your task, topic, deadline, platform…"
          />
        </label>

        <button
          onClick={build}
          className="rounded-xl border border-black/10 bg-black/5 px-4 py-2 font-semibold hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
        >
          Generate WhatsApp message
        </button>

        {generated && (
          <div className="grid gap-2">
            <textarea
              value={generated}
              readOnly
              className="min-h-40 rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10"
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={async () => navigator.clipboard.writeText(generated)}
                className="rounded-xl border border-black/10 px-4 py-2 text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
              >
                Copy
              </button>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-black/10 bg-black/5 px-4 py-2 text-sm font-semibold hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                Send on WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
