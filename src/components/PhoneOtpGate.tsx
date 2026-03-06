"use client";

import { useEffect, useState } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: any;
  }
}

export default function PhoneOtpGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.recaptchaVerifier) return;

    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });
  }, []);

  const sendCode = async () => {
    if (!phone.startsWith("+")) {
      setMsg("Enter phone with country code, e.g. +1...");
      return;
    }

    setLoading(true);
    try {
      const appVerifier = window.recaptchaVerifier!;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      window.confirmationResult = result;
      setStep("code");
      setMsg("OTP sent.");
    } catch (e: any) {
      setMsg(e.message);
    }
    setLoading(false);
  };

  const verifyCode = async () => {
    setLoading(true);
    try {
      const result = await window.confirmationResult.confirm(code);
      setUser(result.user);
    } catch (e: any) {
      setMsg("Invalid code.");
    }
    setLoading(false);
  };

  if (user) {
    return <>{children}</>;
  }

  return (
    <div className="rounded-xl border border-slate-200 p-6 max-w-md">
      <div id="recaptcha-container" />
      <h2 className="text-lg font-bold mb-4">Verify your phone</h2>

      {step === "phone" ? (
        <>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555 123 4567"
            className="w-full border px-3 py-2 rounded mb-3"
          />
          <button
            onClick={sendCode}
            disabled={loading}
            className="w-full bg-orange-600 text-white py-2 rounded"
          >
            Send OTP
          </button>
        </>
      ) : (
        <>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter OTP"
            className="w-full border px-3 py-2 rounded mb-3"
          />
          <button
            onClick={verifyCode}
            disabled={loading}
            className="w-full bg-orange-600 text-white py-2 rounded"
          >
            Verify
          </button>
        </>
      )}

      {msg && <p className="text-sm mt-3">{msg}</p>}
    </div>
  );
}