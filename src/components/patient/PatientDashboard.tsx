"use client";
import Link from "next/link";
import { ReactNode, useMemo } from "react";
import { Profile } from "@/lib/useProfile";
import { Appt, byDate, fmtDate, fmtTime, useAppointments } from "@/lib/useAppointments";
import CallButton from "@/components/CallButton";
import { StatusBadge } from "@/components/StatusBadge";
import { PatientShell } from "./PatientShell";

function until(iso: string) {
  const mins = Math.round((new Date(iso).getTime() - Date.now()) / 60000);
  if (mins <= 0) return "Starting now";
  if (mins < 60) return `in ${mins} min`;
  const h = Math.round(mins / 60);
  if (h < 24) return `in ${h} hr${h > 1 ? "s" : ""}`;
  const d = Math.round(h / 24);
  return d === 1 ? "tomorrow" : `in ${d} days`;
}

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};

function Card({ title, action, className = "", children }: { title: string; action?: ReactNode; className?: string; children: ReactNode }) {
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

const Avatar = ({ name, size = "h-10 w-10" }: { name: string; size?: string }) => (
  <span className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700`}>
    {name.slice(0, 2).toUpperCase()}
  </span>
);

const Empty = ({ text }: { text: string }) => (
  <p className="rounded-xl border border-dashed border-slate-200 p-5 text-center text-sm text-slate-500">{text}</p>
);

const STEPS: [string, string, string][] = [
  ["1", "Pick a doctor", "Browse doctors by specialization."],
  ["2", "Choose a time", "Select a slot that suits you."],
  ["3", "Join the video call", "Open the visit from this page when it's time."],
];

const TIPS = [
  "Test your camera and microphone before the call.",
  "Find a quiet, well-lit place.",
  "Join 5 minutes early.",
  "Have your medicines and questions ready.",
];

export function PatientDashboard({ profile }: { profile: Profile }) {
  const { items, error, setStatus } = useAppointments();

  const all = useMemo(() => [...(items ?? [])].sort(byDate), [items]);
  const cutoff = Date.now() - 60 * 60 * 1000;
  const upcoming = all.filter((a) => a.status === "Scheduled" && new Date(a.appointment_date).getTime() >= cutoff);
  const next = upcoming[0];
  const later = upcoming.slice(1, 5);
  const history = all.filter((a) => a.status !== "Scheduled").slice(-4).reverse();
  const completed = all.filter((a) => a.status === "Completed").length;
  const cancelled = all.filter((a) => a.status === "Cancelled").length;

  const team = useMemo(() => {
    const map = new Map<string, number>();
    all.filter((a) => a.status !== "Cancelled").forEach((a) => map.set(a.doctor__user__username, (map.get(a.doctor__user__username) ?? 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [all]);

  const cancel = (id: number) => {
    if (confirm("Cancel this appointment?")) setStatus(id, "Cancelled");
  };

  const stats: [number, string, string, string][] = [
    [upcoming.length, "Upcoming", "🕒", "from-[#2a78d6] to-[#1c5cab]"],
    [completed, "Completed", "✅", "from-[#14966a] to-[#0d7a55]"],
    [cancelled, "Cancelled", "✖️", "from-[#e0612c] to-[#c24a1a]"],
    [team.length, "Doctors seen", "🩺", "from-emerald-700 to-emerald-600"],
  ];

  const loading = !items && !error;
  const noAppointments = !!items && all.length === 0;

  return (
    <PatientShell
      profile={profile}
      active="/dashboard"
      title="Overview"
      action={
        <Link href="/appointments/book" className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">
          Book appointment
        </Link>
      }
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          {greeting()}, {profile.username}
        </h2>
        <p className="text-sm text-slate-500">
          {next ? `Your next visit is ${until(next.appointment_date)}.` : "Book a visit with a doctor from anywhere."}
        </p>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-100 p-3 text-sm text-red-900">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([n, label, icon, grad]) => (
          <div key={label} className={`flex items-center gap-4 rounded-2xl bg-gradient-to-br p-5 text-white shadow-sm ${grad}`}>
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/90 text-2xl">{icon}</span>
            <div>
              <p className="text-4xl font-semibold leading-none">{items ? n : "–"}</p>
              <p className="mt-1 text-sm font-medium text-white/90">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {noAppointments && (
        <Card title="Get started" className="mt-6">
          <ol className="grid gap-4 sm:grid-cols-3">
            {STEPS.map(([n, t, d]) => (
              <li key={n} className="rounded-xl border border-slate-100 p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">{n}</span>
                <p className="mt-3 font-medium text-slate-900">{t}</p>
                <p className="text-sm text-slate-500">{d}</p>
              </li>
            ))}
          </ol>
        </Card>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Next appointment" action={<Link href="/appointments" className="text-sm font-medium text-teal-600 hover:underline">See all</Link>}>
            {loading ? (
              <div className="h-28 animate-pulse rounded-xl bg-slate-100" />
            ) : !next ? (
              <Empty text="Nothing scheduled. Book a visit to get started." />
            ) : (
              <div className="rounded-xl bg-emerald-50/60 p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar name={next.doctor__user__username} size="h-14 w-14" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">Dr. {next.doctor__user__username}</p>
                    <p className="text-sm text-slate-600">
                      {fmtDate(next.appointment_date)} · {fmtTime(next.appointment_date)}
                    </p>
                  </div>
                  <span className="rounded-lg bg-white px-3 py-1 text-xs font-medium text-emerald-700 shadow-sm">{until(next.appointment_date)}</span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <CallButton roomId={next.room_id} status={next.status} />
                  <button onClick={() => cancel(next.id)} className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </Card>

          {later.length > 0 && (
            <Card title="Also coming up">
              <ul className="divide-y divide-slate-100">
                {later.map((a) => (
                  <li key={a.id} className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <Avatar name={a.doctor__user__username} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900">Dr. {a.doctor__user__username}</p>
                      <p className="text-xs text-slate-500">
                        {fmtDate(a.appointment_date)} · {fmtTime(a.appointment_date)} · {until(a.appointment_date)}
                      </p>
                    </div>
                    <CallButton roomId={a.room_id} status={a.status} compact />
                    <button onClick={() => cancel(a.id)} className="rounded-lg border border-red-200 px-2.5 py-1 text-xs text-red-600 hover:bg-red-50">
                      Cancel
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {history.length > 0 && (
            <Card title="Recent activity">
              <ul className="divide-y divide-slate-100">
                {history.map((a: Appt) => (
                  <li key={a.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">Dr. {a.doctor__user__username}</p>
                      <p className="text-xs text-slate-500">{fmtDate(a.appointment_date)}</p>
                    </div>
                    <StatusBadge status={a.status} />
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card title="Your care team">
            {team.length === 0 ? (
              <Empty text="Doctors you see will appear here." />
            ) : (
              <ul className="space-y-3">
                {team.slice(0, 5).map(([name, n]) => (
                  <li key={name} className="flex items-center gap-3">
                    <Avatar name={name} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">Dr. {name}</p>
                      <p className="text-xs text-slate-500">{n} visit{n > 1 ? "s" : ""}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/appointments/book" className="mt-4 block rounded-xl border border-teal-200 py-2 text-center text-sm font-medium text-teal-700 hover:bg-teal-50">
              Book another visit
            </Link>
          </Card>

          <Card title="Before your video visit">
            <ul className="space-y-2.5 text-sm text-slate-600">
              {TIPS.map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="mt-0.5 text-emerald-600">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </PatientShell>
  );
}