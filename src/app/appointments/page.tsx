"use client";
import { useEffect, useState } from "react";
import { api, errorMessage } from "@/lib/api";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import CallButton from "@/components/CallButton";
import { Profile, useProfile } from "@/lib/useProfile";
import { DoctorShell } from "@/components/doctor/DoctorShell";
import { PatientShell } from "@/components/patient/PatientShell";

interface Appt {
  id: number;
  appointment_date: string;
  status: string;
  room_id: string;
  doctor__user__username: string;
  patient__user__username: string;
}

function List({ profile }: { profile: Profile }) {
  const [items, setItems] = useState<Appt[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<Appt[]>("/api/appointments/mine/").then((r) => setItems(r.data)).catch((e) => setError(errorMessage(e)));
  }, []);

  const setStatus = async (id: number, status: "Cancelled" | "Completed") => {
    if (!confirm(`Mark this appointment as ${status.toLowerCase()}?`)) return;
    setError("");
    try {
      await api.post(`/api/appointments/${id}/status/`, { status });
      setItems((list) => list!.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  return (
    <>
      {error && <p className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-900">{error}</p>}
      {!items && !error && <div className="h-24 animate-pulse rounded-2xl bg-slate-200" />}
      {items?.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
          No appointments yet.
        </div>
      )}

      <ul className="space-y-3">
        {items?.map((a) => (
          <li key={a.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {new Date(a.appointment_date).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                </p>
                <p className="text-sm text-slate-600">Doctor: Dr. {a.doctor__user__username}</p>
                {profile.role !== "patient" && (
                  <p className="text-sm text-slate-600">Patient: {a.patient__user__username}</p>
                )}
              </div>
              <StatusBadge status={a.status} />
            </div>

            {a.status === "Scheduled" && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <CallButton roomId={a.room_id} status={a.status} />
                <button
                  onClick={() => setStatus(a.id, "Cancelled")}
                  className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                >
                  Cancel
                </button>
                {profile.role === "doctor" && (
                  <button
                    onClick={() => setStatus(a.id, "Completed")}
                    className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
                  >
                    Mark completed
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

export default function AppointmentsPage() {
  const profile = useProfile();
  if (!profile) return <p className="mt-10 text-center text-slate-500">Loading...</p>;
  if (profile.role === "doctor") {
    return (
      <DoctorShell profile={profile} active="/appointments" title="Appointments">
        <List profile={profile} />
      </DoctorShell>
    );
  }
  if (profile.role === "patient") {
    return (
      <PatientShell profile={profile} active="/appointments" title="My appointments">
        <List profile={profile} />
      </PatientShell>
    );
  }
  return (
    <AppShell title="Appointments">
      {(p) => <List profile={p} />}
    </AppShell>
  );
}