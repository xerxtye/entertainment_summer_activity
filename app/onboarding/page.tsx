"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestCode() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setSentCode(data.code); // FAKE SMS: show the code on screen
      setStep("code");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function verify() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid code");
      router.replace(data.isNew ? "/profile" : "/feed");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-grass-900 via-neutral-950 to-neutral-950 px-6">
      <div className="flex flex-1 flex-col justify-center">
        <div className="mb-10 text-center">
          <div className="mb-3 text-5xl">🌱</div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Touch the Grass
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Meet people through real-world events.
          </p>
        </div>

        {step === "phone" ? (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-neutral-300">
              Your phone number
            </label>
            <input
              autoFocus
              type="tel"
              inputMode="tel"
              placeholder="+1 555 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && phone && requestCode()}
              className="w-full rounded-2xl border border-neutral-700 bg-neutral-900 px-4 py-3.5 text-lg outline-none focus:border-grass-500"
            />
            <button
              disabled={loading || !phone}
              onClick={requestCode}
              className="w-full rounded-2xl bg-grass-500 py-3.5 text-lg font-semibold text-neutral-950 transition active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send code"}
            </button>
            <p className="text-center text-xs text-neutral-500">
              We&apos;ll text you a verification code. No password needed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sentCode && (
              <div className="rounded-2xl border border-grass-700 bg-grass-900/40 p-3 text-center text-sm">
                <span className="text-neutral-400">Demo SMS — your code is </span>
                <span className="text-lg font-bold tracking-widest text-grass-300">
                  {sentCode}
                </span>
              </div>
            )}
            <label className="block text-sm font-medium text-neutral-300">
              Enter the 4-digit code
            </label>
            <input
              autoFocus
              inputMode="numeric"
              maxLength={4}
              placeholder="••••"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && code.length === 4 && verify()}
              className="w-full rounded-2xl border border-neutral-700 bg-neutral-900 px-4 py-3.5 text-center text-2xl tracking-[0.5em] outline-none focus:border-grass-500"
            />
            <button
              disabled={loading || code.length !== 4}
              onClick={verify}
              className="w-full rounded-2xl bg-grass-500 py-3.5 text-lg font-semibold text-neutral-950 transition active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & enter"}
            </button>
            <button
              onClick={() => {
                setStep("phone");
                setCode("");
                setSentCode(null);
              }}
              className="w-full py-1 text-center text-xs text-neutral-500"
            >
              Change number
            </button>
          </div>
        )}

        {error && (
          <p className="mt-4 text-center text-sm text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
}
