"use client";
import { FormEvent, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useDoctors } from "@/lib/useDoctors";
import { useProfile } from "@/lib/useProfile";
import { PatientShell } from "@/components/patient/PatientShell";
import { Alert, Card, Field, SubmitButton, inputClass, useForm, useSubmit } from "@/components/ui";

// Earliest selectable time = now, in the user's local timezone
function minDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

function BookForm() {
  const { doctors, loading, failed } = useDoctors();
  const { values, onChange, set, reset } = useForm({ doctor_id: "", appointment_date: "" });
  const { busy, status, run } = useSubmit();

  // Pre-select the doctor when arriving from the "Book" button: /appointments/book?doctor=3
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("doctor");
    if (id) set({ doctor_id: id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(async () => {
      await api.post("/api/appointments/book/", {
        doctor_id: Number(values.doctor_id),
        // local time -> UTC, so the server stores the right moment
        appointment_date: new Date(values.appointment_date).toISOString(),
      });
      reset();
      return "Appointment booked successfully!";
    });
  };

  return (
    <Card>
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Doctor</span>
          <select
            name="doctor_id"
            value={values.doctor_id}
            onChange={onChange}
            required
            disabled={loading || failed}
            className={inputClass}
          >
            <option value="">
              {loading
                ? "Loading doctors (server may be waking up)..."
                : failed
                ? "Could not load doctors"
                : doctors.length === 0
                ? "No doctors available yet"
                : "Select a doctor"}
            </option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                Dr. {d.user__username} - {d.specialization}
              </option>
            ))}
          </select>
        </label>

        <Field
          label="Date and time"
          name="appointment_date"
          type="datetime-local"
          min={minDateTime()}
          value={values.appointment_date}
          onChange={onChange}
        />

        <Alert status={status} />
        <SubmitButton busy={busy}>Book appointment</SubmitButton>

        {status?.type === "success" && (
          <Link href="/appointments" className="block text-center text-sm font-medium text-teal-700 underline">
            View my appointments
          </Link>
        )}
      </form>
    </Card>
  );
}

export default function BookAppointmentPage() {
  const profile = useProfile(["patient"]);
  if (!profile) return <p className="mt-10 text-center text-slate-500">Loading...</p>;

  return (
    <PatientShell profile={profile} active="/appointments/book" title="Book an appointment">
      <p className="mb-4 text-sm text-slate-500">Choose a doctor and a time that suits you.</p>
      <div className="max-w-xl">
        <BookForm />
      </div>
    </PatientShell>
  );
}