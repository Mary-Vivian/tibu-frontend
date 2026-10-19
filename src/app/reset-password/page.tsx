"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Alert, AuthCard, Field, Status, SubmitButton, useForm, useSubmit } from "@/components/ui";

export default function ResetPasswordPage() {
  const router = useRouter();
  // undefined = still reading the URL, null = link is missing its parts
  const [link, setLink] = useState<{ uid: string; token: string } | null | undefined>(undefined);
  const [mismatch, setMismatch] = useState(false);
  const { values, onChange } = useForm({ password: "", confirm: "" });
  const { busy, status, run } = useSubmit();

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const uid = p.get("uid");
    const token = p.get("token");
    setLink(uid && token ? { uid, token } : null);
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (values.password !== values.confirm) {
      setMismatch(true);
      return;
    }
    setMismatch(false);
    run(async () => {
      await api.post("/api/password/reset/", { ...link, password: values.password });
      setTimeout(() => router.push("/login"), 2000);
      return "Password updated! Redirecting to login...";
    });
  };

  if (link === undefined) return null;

  if (link === null) {
    return (
      <AuthCard title="Reset password">
        <p className="text-center text-slate-600">This reset link is incomplete.</p>
        <p className="mt-4 text-center text-sm">
          <Link href="/forgot-password" className="font-medium text-teal-700 underline">Request a new link</Link>
        </p>
      </AuthCard>
    );
  }

  const alert: Status = mismatch ? { type: "error", text: "Passwords do not match." } : status;

  return (
    <AuthCard title="Choose a new password">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="New password" name="password" type="password" minLength={8} autoComplete="new-password" value={values.password} onChange={onChange} />
        <Field label="Confirm password" name="confirm" type="password" minLength={8} autoComplete="new-password" value={values.confirm} onChange={onChange} />
        <Alert status={alert} />
        <SubmitButton busy={busy}>Update password</SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm">
        <Link href="/forgot-password" className="text-teal-700 hover:underline">Link expired? Request a new one</Link>
      </p>
    </AuthCard>
  );
}