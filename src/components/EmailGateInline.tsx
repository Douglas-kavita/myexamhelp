"use client";

import { useEffect, useMemo, useState } from "react";

const LS_EMAIL_KEY = "myexamhelp_email_gate_v1";

export default function EmailGateInline({
  title = "Enter your email to continue",
  note = "Email-only access for now (no phone verification).",
  children,
}: {
  title?: string;
  note?: string;
  children: React.ReactNode;
}) {
  const [savedEmail, setSavedEmail] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_EMAIL_KEY);
      if (raw) setSavedEmail(raw);
    } catch {}
  }, []);

  const canSubmit = useMemo(() => {
    const e = email.trim();
    return e.includes("@") && e.includes(".");
  }, [email]);

  const submit = () => {
    setError(null);
    if (!canSubmit) {
      setError("Please enter a valid email.");
      return;
    }
    const e = email.trim();
    try {
      localStorage.setItem(LS_EMAIL_KEY, e);
    } catch {}
    setSavedEmail(e);
  };

  if (savedEmail) return <>{children}</>;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{note}</p>

      <div className="mt-3 flex flex-col gap-2">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          type="email"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={submit}
          className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
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