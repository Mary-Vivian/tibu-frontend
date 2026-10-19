"use client";
import { ChangeEvent, InputHTMLAttributes, ReactNode, useState } from "react";
import Link from "next/link";
import { errorMessage } from "@/lib/api";
import { heroBackground } from "@/lib/themes";

export type Status = { type: "success" | "error"; text: string } | null;

export const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 disabled:bg-slate-100";

export function useForm<T extends Record<string, string>>(initial: T) {
  const [values, setValues] = useState(initial);
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  const set = (patch: Partial<T>) => setValues((v) => ({ ...v, ...patch }));
  return { values, onChange, set, reset: () => setValues(initial) };
}

// Runs an async action with loading + success/error state.
// Return a string from the action to show it as a success message.
export function useSubmit() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const run = async (action: () => Promise<string | void>) => {
    setBusy(true);
    setStatus(null);
    try {
      const text = await action();
      if (text) setStatus({ type: "success", text });
    } catch (err) {
      setStatus({ type: "error", text: errorMessage(err) });
    } finally {
      setBusy(false);
    }
  };
  return { busy, status, run };
}

export function Field({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <input required {...props} className={inputClass} />
    </label>
  );
}

export function Alert({ status }: { status: Status }) {
  if (!status) return null;
  const color =
    status.type === "success"
      ? "bg-green-50 text-green-800 border-green-200"
      : "bg-red-50 text-red-800 border-red-200";
  return (
    <p role="status" className={`rounded-lg border p-3 text-center text-sm ${color}`}>
      {status.text}
    </p>
  );
}

export function SubmitButton({ busy, children }: { busy: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="w-full rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 px-4 py-3 text-lg font-semibold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {busy ? "Please wait..." : children}
    </button>
  );
}

// White card used inside AppShell pages (book, register doctor)
export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      {children}
    </div>
  );
}

// Centered card on a light background, for logged-out pages (login, patient register)
export function AuthCard({
  title,
  subtitle,
  heading = "Your health, one booking away",
  tagline = "Book appointments with doctors online, quickly and simply.",
  perks = [],
  children,
}: {
  title: string;
  subtitle?: string;
  heading?: string;
  tagline?: string;
  perks?: string[];
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-slate-100 to-teal-100 p-4 sm:p-8">
      {/* Soft shapes behind the card */}
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-300/40 blur-2xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-28 -left-20 h-96 w-96 rounded-full bg-teal-300/40 blur-2xl" />
      <div aria-hidden className="pointer-events-none absolute bottom-6 right-6 hidden h-40 w-40 rounded-full border-[18px] border-emerald-300/50 lg:block" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-2xl backdrop-blur-xl md:grid-cols-2">
        {/* Left: decorative panel (hidden on phones) */}
        <div
          className="relative hidden flex-col justify-between overflow-hidden p-10 text-white md:flex"
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundImage:
             heroBackground(160),
          }}
        >
          <Link href="/" className="text-lg font-bold">🩺 Tibu Health</Link>

          <div className="my-8">
            <h2 className="text-4xl font-extrabold leading-tight">{heading}</h2>
            <p className="mt-3 max-w-sm text-white/85">{tagline}</p>
            {perks.length > 0 && (
              <ul className="mt-6 space-y-2 text-sm">
                {perks.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Rings and floating glass chips */}
          <div aria-hidden className="relative h-44">
            <div className="absolute left-0 top-2 h-32 w-32 rounded-full border-2 border-amber-200/70" />
            <div className="absolute left-14 top-10 h-24 w-24 rounded-full border border-white/40 bg-white/10 backdrop-blur-sm" />
            <div className="floaty absolute right-2 top-0 rounded-2xl border border-white/30 bg-white/15 px-4 py-2 text-sm backdrop-blur-md">📅 Book online</div>
            <div className="floaty absolute bottom-8 left-8 rounded-2xl border border-white/30 bg-white/15 px-4 py-2 text-sm backdrop-blur-md" style={{ animationDelay: "1s" }}>🩺 Trusted doctors</div>
            <div className="floaty absolute bottom-0 right-8 rounded-2xl border border-white/30 bg-white/15 px-4 py-2 text-sm backdrop-blur-md" style={{ animationDelay: "2s" }}>✓ Free to join</div>
          </div>
        </div>

        {/* Right: the form */}
        <div className="flex flex-col justify-center bg-white/80 px-6 py-10 sm:px-12">
          <Link href="/" className="mb-4 text-center text-lg font-bold text-emerald-700 md:hidden">
            🩺 Tibu Health
          </Link>
          <h1 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-center text-sm text-slate-600">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}