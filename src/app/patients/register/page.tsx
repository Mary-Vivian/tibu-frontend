"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { GoogleButton } from "@/components/GoogleButton";
import { Alert, AuthCard, Field, Status, SubmitButton, useForm, useSubmit } from "@/components/ui";

export default function RegisterPatient() {
  const router = useRouter();
  const { values, onChange } = useForm({ username: "", email: "", password: "", phone: "", insurance_id: "" });
  const { busy, status, run } = useSubmit();
  const [googleError, setGoogleError] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setGoogleError("");
    run(async () => {
      await api.post("/api/patients/register/", values);
      setTimeout(() => router.push("/login"), 1500);
      return "Registration successful! Redirecting to login...";
    });
  };

  const alert: Status = googleError ? { type: "error", text: googleError } : status;

  return (
    <AuthCard
      title="Create your account"
      subtitle="It's free and takes about a minute"
      heading="Join Tibu Health"
      tagline="See a doctor whenever you need one, without the phone calls and the queues."
      perks={["Free to join", "Book and cancel online", "Search doctors by specialization"]}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Username" name="username" placeholder="Choose a username" autoComplete="username" value={values.username} onChange={onChange} />
        <Field label="Email" name="email" type="email" placeholder="you@example.com" autoComplete="email" value={values.email} onChange={onChange} />
        <Field label="Password" name="password" type="password" minLength={8} placeholder="At least 8 characters" autoComplete="new-password" value={values.password} onChange={onChange} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone number" name="phone" type="tel" placeholder="07..." value={values.phone} onChange={onChange} />
          <Field label="Insurance ID" name="insurance_id" placeholder="Your insurance ID" value={values.insurance_id} onChange={onChange} />
        </div>
        <p className="text-xs text-slate-500">We use your email to reset your password if you forget it.</p>
        <Alert status={alert} />
        <SubmitButton busy={busy}>Register</SubmitButton>
      </form>

      <GoogleButton onError={setGoogleError} />

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-emerald-700 hover:underline">Login</Link>
      </p>
    </AuthCard>
  );
}