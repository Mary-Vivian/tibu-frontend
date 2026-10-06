"use client";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Alert, AuthCard, Field, SubmitButton, useForm, useSubmit } from "@/components/ui";

const fields = [
  ["username", "Username", "text"],
  ["password", "Password", "password"],
  ["phone", "Phone number", "tel"],
  ["insurance_id", "Insurance ID", "text"],
] as const;

export default function RegisterPatient() {
  const router = useRouter();
  const { values, onChange } = useForm({ username: "", password: "", phone: "", insurance_id: "" });
  const { busy, status, run } = useSubmit();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(async () => {
      await api.post("/api/patients/register/", values);
      setTimeout(() => router.push("/login"), 1500);
      return "Registration successful! Redirecting to login...";
    });
  };

  return (
    <AuthCard title="Patient Registration">
      <form onSubmit={onSubmit} className="space-y-4">
        {fields.map(([name, label, type]) => (
          <Field key={name} label={label} name={name} type={type} value={values[name]} onChange={onChange} />
        ))}
        <Alert status={status} />
        <SubmitButton busy={busy}>Register</SubmitButton>
        <p className="text-center text-sm">
          <Link href="/login" className="text-teal-700 underline">
            Already have an account? Login
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}