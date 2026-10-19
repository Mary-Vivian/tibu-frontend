"use client";
import { FormEvent } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Alert, AuthCard, Field, SubmitButton, useForm, useSubmit } from "@/components/ui";

export default function ForgotPasswordPage() {
  const { values, onChange } = useForm({ email: "" });
  const { busy, status, run } = useSubmit();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(async () => {
      await api.post("/api/password/forgot/", values);
      return "If an account exists for that email, we've sent a reset link. It expires in 1 hour, so check your spam folder too.";
    });
  };

  return (
    <AuthCard title="Forgot password">
      <p className="mb-4 text-center text-sm text-slate-600">
        Enter the email on your account and we'll send you a link to choose a new password.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Email" name="email" type="email" autoComplete="email" value={values.email} onChange={onChange} />
        <Alert status={status} />
        <SubmitButton busy={busy}>Send reset link</SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm">
        <Link href="/login" className="font-medium text-teal-700 underline">Back to login</Link>
      </p>
    </AuthCard>
  );
}