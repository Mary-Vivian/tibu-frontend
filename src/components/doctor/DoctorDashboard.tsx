"use client";
import { ReactNode, useMemo, useState } from "react";
import Link from "next/link";
import { Profile } from "@/lib/useProfile";
import { Appt, byDate, dayKey, fmtDate, fmtTime, useAppointments } from "@/lib/useAppointments";
import CallButton from "@/components/CallButton";
import { DoctorShell } from "./DoctorShell";
import { DayChart, StatusDonut } from "./charts";
import OnlineConsultCard from "./OnlineConsultCard";

function Card({
  title,
  action,
  className = "",
  children,
}: {
  title: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`rounded-2xl bg-white p-5 shadow-sm ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

const Empty = ({ text }: { text: string }) => (
  <p className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">{text}</p>
);

const Avatar = ({ name }: { name: string }) => (
  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
    {name.slice(0, 2).toUpperCase()}
  </span>
);

function Chip({ a }: { a: Appt }) {
  const base = "shrink-0 rounded-lg px-3 py-1 text-xs font-medium";
  if (a.status === "Completed") return <span className={`${base} bg-emerald-100 text-emerald-700`}>Done</span>;
  if (a.status === "Cancelled") return <span className={`${base} bg-slate-100 text-slate-500`}>Cancelled</span>;
  if (new Date(a.appointment_date) < new Date()) return <span className={`${base} bg-amber-100 text-amber-800`}>Past due</span>;
  return <span className={`${base} bg-sky-100 text-sky-700`}>{fmtTime(a.appointment_date)}</span>;
}

export function DoctorDashboard({ profile }: { profile: Profile }) {
  const { items, error, setStatus } = useAppointments();
  const todayKey = dayKey(new Date());
  const [day, setDay] = useState(todayKey);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<number | null>(null);

  const all = useMemo(() => [...(items ?? [])].sort(byDate), [items]);
  const q = query.trim().toLowerCase();
  const match = (a: Appt) => !q || a.patient__user__username.toLowerCase().includes(q);

  const isToday = day === todayKey;
  const dayLabel = isToday
    ? "Today"
    : new Date(`${day}T00:00`).toLocaleDateString([], { day: "numeric", month: "short" });

  const dayAll = all.filter((a) => dayKey(new Date(a.appointment_date)) === day && a.status !== "Cancelled");
  const dayItems = dayAll.filter(match);
  const scheduled = all.filter((a) => a.status === "Scheduled");
  const tableRows = scheduled.filter(match);
  const counts = {
    Scheduled: scheduled.length,
    Completed: all.filter((a) => a.status === "Completed").length,
    Cancelled: all.filter((a) => a.status === "Cancelled").length,
  };

  const nextId = dayItems.find((a) => a.status === "Scheduled" && new Date(a.appointment_date) >= new Date())?.id;
  const selected = all.find((a) => a.id === picked) ?? dayItems[0] ?? scheduled[0];
  const history = selected ? all.filter((a) => a.patient__user__username === selected.patient__user__username) : [];
  const completedVisits = history.filter((a) => a.status === "Completed");
  const lastVisit = completedVisits[completedVisits.length - 1];

  const stats: [number, string, string, string][] = [
    [dayAll.length, dayLabel, "📅", "from-emerald-700 to-emerald-600"],
    [counts.Scheduled, "Scheduled", "🕒", "from-[#2a78d6] to-[#1c5cab]"],
    [counts.Completed, "Completed", "✅", "from-[#14966a] to-[#0d7a55]"],
    [counts.Cancelled, "Cancelled", "✖️", "from-[#e0612c] to-[#c24a1a]"],
  ];

  const cancel = (id: number) => {
    if (confirm("Cancel this appointment?")) setStatus(id, "Cancelled");
  };

  return (
    <DoctorShell profile={profile} active="/dashboard" title="Overview" search={{ value: query, onChange: setQuery }}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Welcome Dr. {profile.username}</h2>
          <p className="text-sm text-slate-500">Have a great day at work.</p>
        </div>
        <div className="flex items-center gap-2">
          {!isToday && (
            <button onClick={() => setDay(todayKey)} className="text-sm font-medium text-teal-700 hover:underline">
              Back to today
            </button>
          )}
          <input
            type="date"
            value={day}
            onChange={(e) => e.target.value && setDay(e.target.value)}
            aria-label="Choose a day"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          />
        </div>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-100 p-3 text-sm text-red-900">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map(([n, label, icon, grad]) => (
          <div key={label} className={`flex items-center gap-4 rounded-2xl bg-gradient-to-br p-5 text-white shadow-sm ${grad}`}>
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/90 text-2xl">{icon}</span>
            <div>
              <p className="text-4xl font-semibold leading-none">{items ? n : "–"}</p>
              <p className="mt-1 text-sm font-medium text-white/90">{label}</p>
            </div>
          </div>
        ))}
        <div className="sm:col-span-2 xl:col-span-1">
          <OnlineConsultCard items={all} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card
          title={isToday ? "Today's appointments" : `Appointments on ${dayLabel}`}
          action={<Link href="/appointments" className="text-sm font-medium text-teal-600 hover:underline">See all</Link>}
        >
          {!items && !error ? (
            <Empty text="Loading..." />
          ) : dayItems.length === 0 ? (
            <Empty text={q ? "No patients match your search." : "No appointments on this day."} />
          ) : (
            <ul className="space-y-2">
              {dayItems.map((a) => (
                <li key={a.id} className="flex items-center gap-2">
                  <button
                    onClick={() => setPicked(a.id)}
                    className={`flex min-w-0 flex-1 items-center gap-3 rounded-xl border p-3 text-left transition ${
                      selected?.id === a.id ? "border-teal-400 bg-teal-50" : "border-slate-100 hover:bg-slate-50"
                    }`}
                  >
                    <Avatar name={a.patient__user__username} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-slate-900">{a.patient__user__username}</span>
                      <span className="block truncate text-xs text-slate-500">{a.patient__phone || "Patient"}</span>
                    </span>
                    <Chip a={a} />
                  </button>
                  <CallButton roomId={a.room_id} status={a.status} compact />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Patient details">
          {!selected ? (
            <Empty text="Select a patient to see their details." />
          ) : (
            <div>
              <div className="flex items-center gap-3">
                <Avatar name={selected.patient__user__username} />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{selected.patient__user__username}</p>
                  <p className="text-xs text-slate-500">
                    {selected.patient__phone ? (
                      <a href={`tel:${selected.patient__phone}`} className="hover:underline">{selected.patient__phone}</a>
                    ) : (
                      "No phone on file"
                    )}
                  </p>
                </div>
              </div>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Appointment</dt>
                  <dd className="text-right text-slate-900">
                    {fmtDate(selected.appointment_date)}, {fmtTime(selected.appointment_date)}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Status</dt>
                  <dd className="text-slate-900">{selected.status}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Completed visits</dt>
                  <dd className="text-slate-900">{completedVisits.length}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Last visit</dt>
                  <dd className="text-slate-900">{lastVisit ? fmtDate(lastVisit.appointment_date) : "None yet"}</dd>
                </div>
              </dl>
              {selected.status === "Scheduled" && (
                <div className="mt-5">
                  <CallButton roomId={selected.room_id} status={selected.status} />
                </div>
              )}
            </div>
          )}
        </Card>

        <Card title="Timeline" className="lg:col-span-2 xl:col-span-1">
          {dayItems.length === 0 ? (
            <Empty text="Nothing on this day." />
          ) : (
            <ol className="relative space-y-5 border-l-2 border-slate-200 pl-6">
              {dayItems.map((a) => {
                const done = a.status === "Completed";
                const next = a.id === nextId;
                return (
                  <li key={a.id} className="relative">
                    <span
                      className={`absolute -left-8 top-1 h-3.5 w-3.5 rounded-full border-2 ${
                        done
                          ? "border-emerald-500 bg-emerald-500"
                          : next
                          ? "border-teal-500 bg-white ring-4 ring-teal-100"
                          : "border-slate-300 bg-white"
                      }`}
                    />
                    <p className="text-sm font-medium text-slate-900">
                      {fmtTime(a.appointment_date)}{" "}
                      <span className="font-normal text-slate-500">· {a.patient__user__username}</span>
                    </p>
                    <p className="text-xs text-slate-500">{done ? "Completed" : next ? "Up next" : a.status}</p>
                  </li>
                );
              })}
            </ol>
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        <Card
          title="Scheduled appointments"
          className="xl:col-span-3"
          action={<Link href="/appointments" className="text-sm font-medium text-teal-600 hover:underline">See all</Link>}
        >
          {tableRows.length === 0 ? (
            <Empty text={q ? "No patients match your search." : "No scheduled appointments."} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-teal-700">
                    <th className="pb-2 font-medium">Patient</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Time</th>
                    <th className="pb-2 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.slice(0, 6).map((a) => (
                    <tr key={a.id} className="border-t border-slate-100">
                      <td className="py-3">
                        <button onClick={() => setPicked(a.id)} className="flex items-center gap-2 font-medium text-slate-900 hover:underline">
                          <Avatar name={a.patient__user__username} />
                          {a.patient__user__username}
                        </button>
                      </td>
                      <td className="py-3 tabular-nums text-slate-600">{fmtDate(a.appointment_date)}</td>
                      <td className="py-3 tabular-nums text-slate-600">
                        {fmtTime(a.appointment_date)}
                        {new Date(a.appointment_date) < new Date() && (
                          <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">Past due</span>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center justify-end gap-2">
                          <CallButton roomId={a.room_id} status={a.status} compact />
                          <button
                            onClick={() => setStatus(a.id, "Completed")}
                            aria-label="Mark completed"
                            title="Mark completed"
                            className="h-8 w-8 rounded-lg border border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => cancel(a.id)}
                            aria-label="Cancel appointment"
                            title="Cancel appointment"
                            className="h-8 w-8 rounded-lg border border-red-300 text-red-500 hover:bg-red-50"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <StatusDonut counts={counts} className="xl:col-span-2" />
      </div>

      <DayChart items={all} className="mt-6" />
    </DoctorShell>
  );
}