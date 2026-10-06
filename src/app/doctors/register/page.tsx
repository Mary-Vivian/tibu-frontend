"use client";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { AppShell } from "@/components/AppShell";
import { Alert, Card, Field, SubmitButton, useForm, useSubmit } from "@/components/ui";

const fields = [
  ["username", "Username", "text"],
  ["password", "Temporary password", "password"],
  ["specialization", "Specialization", "text"],
] as const;

function DoctorForm() {
  const router = useRouter();
  const { values, onChange, reset } = useForm({ username: "", password: "", specialization: "" });
  const { busy, status, run } = useSubmit();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(async () => {
      await api.post("/api/doctors/register/", values);
      reset();
      setTimeout(() => router.push("/doctors"), 1500);
      return "Doctor registered successfully!";
    });
  };

  return (
    <Card>
      <form onSubmit={onSubmit} className="space-y-4">
        {fields.map(([name, label, type]) => (
          <Field key={name} label={label} name={name} type={type} value={values[name]} onChange={onChange} />
        ))}
        <p className="text-xs text-slate-500">Share the password with the doctor privately.</p>
        <Alert status={status} />
        <SubmitButton busy={busy}>Register doctor</SubmitButton>
      </form>
    </Card>
  );
}

export default function DoctorRegisterPage() {
  return (
    <AppShell title="Add a doctor" subtitle="Create an account for a new doctor" allow={["admin"]}>
      {() => <DoctorForm />}
    </AppShell>
  );
}