"use client";
import { ChangeEvent, InputHTMLAttributes, ReactNode, useState } from "react";
import Link from "next/link";
import { errorMessage } from "@/lib/api";

export type Status = { type: "success" | "error"; text: string } | null;

export const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 disabled:bg-slate-100";

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
      className="w-full rounded-lg bg-teal-600 px-4 py-2.5 font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
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
export function AuthCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-teal-50 to-slate-50 p-6">
      <Link href="/" className="mb-6 text-xl font-bold text-teal-700">
        🩺 Tibu Health
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold text-slate-900">{title}</h1>
        {children}
      </div>
    </div>
  );
}