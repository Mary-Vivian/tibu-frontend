"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { GoogleButton } from "@/components/GoogleButton";
import { Alert, AuthCard, Field, Status, SubmitButton, useForm, useSubmit } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const { values, onChange } = useForm({ username: "", password: "" });
  const { busy, status, run } = useSubmit();
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [googleError, setGoogleError] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setGoogleError("");
    run(async () => {
      await api.post("/api/login/", { ...values, remember });
      router.push("/dashboard");
    });
  };

  const alert: Status = googleError ? { type: "error", text: googleError } : status;

  return (
    <AuthCard
      title="Hello! Welcome back"
      subtitle="Log in to manage your appointments"
      heading="Welcome back to Tibu Health"
      tagline="Pick up where you left off: your doctors, your appointments, all in one place."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          label="Username or email"
          name="username"
          placeholder="Enter your username or email"
          autoComplete="username"
          value={values.username}
          onChange={onChange}
        />
        <Field
          label="Password"
          name="password"
          type={show ? "text" : "password"}
          placeholder="Enter your password"
          autoComplete="current-password"
          value={values.password}
          onChange={onChange}
        />
        <button type="button" onClick={() => setShow(!show)} className="text-sm text-emerald-700 hover:underline">
          {show ? "Hide" : "Show"} password
        </button>

        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-slate-700">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 accent-emerald-700"
            />
            Remember me
          </label>
          <Link href="/forgot-password" className="font-medium text-emerald-700 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Alert status={alert} />
        <SubmitButton busy={busy}>Login</SubmitButton>
      </form>

      <GoogleButton onError={setGoogleError} />

      <p className="mt-6 text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link href="/patients/register" className="font-semibold text-emerald-700 hover:underline">
          Create account!
        </Link>
      </p>
    </AuthCard>
  );
}