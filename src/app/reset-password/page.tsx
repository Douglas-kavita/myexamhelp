"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseBrowser";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("Checking reset session...");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setStatus(error.message);
        return;
      }

      if (!data.session) {
        setStatus("Reset link is invalid or expired. Please request a new one.");
        return;
      }

      setReady(true);
      setStatus("");
    };

    checkSession();
  }, []);

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 8) {
      setStatus("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setStatus("Passwords do not match.");
      return;
    }

    setStatus("Updating password...");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("Password updated successfully. You can now sign in.");
    setPassword("");
    setConfirm("");
  }

  return (
    <main className="min-h-screen grid place-items-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-xl">
        <h1 className="text-2xl font-semibold">Reset Password</h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter your new password below.
        </p>

        {!ready ? (
          <div className="mt-4 text-sm text-red-600">{status}</div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="mt-4 space-y-3">
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />

            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 py-2 text-sm text-white hover:bg-slate-800"
            >
              Update password
            </button>

            {status && (
              <div className="text-sm text-slate-600">{status}</div>
            )}
          </form>
        )}
      </div>
    </main>
  );
}