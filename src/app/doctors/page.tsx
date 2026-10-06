"use client";
import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { useDoctors } from "@/lib/useDoctors";

export default function DoctorListPage() {
  const { doctors, loading, failed } = useDoctors();
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const shown = doctors.filter(
    (d) => d.user__username.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q)
  );

  return (
    <AppShell title="Find a doctor" subtitle="Search by name or specialization">
      {(profile) => (
        <>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 Search doctors..."
            className="mb-5 w-full max-w-md rounded-lg border border-slate-300 bg-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          {loading && (
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-200" />)}
            </div>
          )}
          {failed && <p className="text-red-600">Could not load doctors. Please refresh.</p>}
          {!loading && !failed && shown.length === 0 && (
            <p className="text-slate-600">{doctors.length === 0 ? "No doctors registered yet." : "No doctors match your search."}</p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {shown.map((d) => (
              <div key={d.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-100 font-bold text-teal-700">
                  {d.user__username.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">Dr. {d.user__username}</p>
                  <p className="text-sm text-slate-600">{d.specialization}</p>
                </div>
                {profile.role === "patient" && (
                  <Link
                    href={`/appointments/book?doctor=${d.id}`}
                    className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                  >
                    Book
                  </Link>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}