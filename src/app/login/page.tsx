"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Alert, AuthCard, Field, SubmitButton, useForm, useSubmit } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const { values, onChange } = useForm({ username: "", password: "" });
  const { busy, status, run } = useSubmit();
  const [show, setShow] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(async () => {
      await api.post("/api/login/", values);
      router.push("/dashboard");
    });
  };

  return (
    <AuthCard title="Login">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Username" name="username" value={values.username} onChange={onChange} />
        <Field
          label="Password"
          name="password"
          type={show ? "text" : "password"}
          value={values.password}
          onChange={onChange}
        />
        <button type="button" onClick={() => setShow(!show)} className="text-sm text-teal-700 hover:underline">
          {show ? "Hide" : "Show"} password
        </button>
        <Alert status={status} />
        <SubmitButton busy={busy}>Login</SubmitButton>
        <p className="text-center text-sm">
          No account?{" "}
          <Link href="/patients/register" className="text-teal-700 underline">
            Register
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}