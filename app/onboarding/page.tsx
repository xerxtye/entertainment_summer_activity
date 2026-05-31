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
    <div className="flex min-h-screen flex-col px-6">
      <div className="flex flex-1 flex-col justify-center">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-[1.75rem] bg-brand-gradient text-4xl shadow-glow">
            🌱
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight">
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
              className="input text-lg"
            />
            <button
              disabled={loading || !phone}
              onClick={requestCode}
              className="btn-primary w-full py-3.5 text-lg"
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
              <div className="glass rounded-2xl p-3 text-center text-sm">
                <span className="text-neutral-400">Demo SMS — your code is </span>
                <span className="text-lg font-bold tracking-widest text-brand-300">
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
              className="input text-center text-2xl tracking-[0.5em]"
            />
            <button
              disabled={loading || code.length !== 4}
              onClick={verify}
              className="btn-primary w-full py-3.5 text-lg"
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
