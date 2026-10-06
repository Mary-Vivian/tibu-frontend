"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Profile } from "@/lib/useProfile";

interface Appt {
  id: number;
  appointment_date: string;
  status: string;
  doctor__user__username: string;
  patient__user__username: string;
}

const actions: Record<Profile["role"], [string, string, string][]> = {
  admin: [["/doctors/register", "➕", "Add a doctor"], ["/doctors", "👨‍⚕️", "View doctors"], ["/appointments", "📋", "All appointments"]],
  patient: [["/appointments/book", "📅", "Book an appointment"], ["/doctors", "🔍", "Find a doctor"], ["/appointments", "📋", "My appointments"]],
  doctor: [["/appointments", "📋", "My appointments"]],
  user: [],
};

function Overview({ profile }: { profile: Profile }) {
  const [items, setItems] = useState<Appt[] | null>(null);

  useEffect(() => {
    api.get<Appt[]>("/api/appointments/mine/").then((r) => setItems(r.data)).catch(() => setItems([]));
  }, []);

  const now = Date.now();
  const upcoming = (items ?? []).filter((a) => a.status === "Scheduled" && new Date(a.appointment_date).getTime() >= now);
  const count = (s: string) => (items ?? []).filter((a) => a.status === s).length;
  const next = upcoming[0];

  const stats: [string, number | string, string][] = [
    ["Upcoming", items ? upcoming.length : "–", "text-blue-600"],
    ["Completed", items ? count("Completed") : "–", "text-green-600"],
    ["Cancelled", items ? count("Cancelled") : "–", "text-slate-500"],
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        {stats.map(([label, value, color]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className={`mt-1 text-3xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">Next appointment</h2>
        {!items ? (
          <div className="mt-3 h-12 animate-pulse rounded bg-slate-100" />
        ) : next ? (
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="font-medium">
                {new Date(next.appointment_date).toLocaleString([], { dateStyle: "full", timeStyle: "short" })}
              </p>
              <p className="text-sm text-slate-600">
                {profile.role === "doctor" ? `Patient: ${next.patient__user__username}` : `Dr. ${next.doctor__user__username}`}
              </p>
            </div>
            <StatusBadge status={next.status} />
          </div>
        ) : (
          <div className="mt-3 text-sm text-slate-600">
            Nothing scheduled.{" "}
            {profile.role === "patient" && (
              <Link href="/appointments/book" className="font-medium text-teal-700 underline">
                Book one now
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {actions[profile.role].map(([href, icon, label]) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-400 hover:shadow-md"
          >
            <div className="text-2xl">{icon}</div>
            <p className="mt-2 font-medium">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <AppShell title="Dashboard">
      {(profile) => <Overview profile={profile} />}
    </AppShell>
  );
}