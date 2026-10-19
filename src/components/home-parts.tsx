"use client";
import { useEffect, useState } from "react";
import { useDoctors } from "@/lib/useDoctors";
import { CountUp, Reveal } from "@/components/motion";

// Real numbers pulled from your API, not made-up ones
export function LiveStats() {
  const { doctors, loading } = useDoctors();
  const specs = new Set(doctors.map((d) => d.specialization.trim().toLowerCase())).size;
  const stats: [number, string, string][] = [
    [doctors.length, "Doctors on the platform", "👩🏾‍⚕️"],
    [specs, "Specializations", "🩺"],
    [3, "Steps to book", "📅"],
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map(([n, label, icon], i) => (
        <Reveal key={label} delay={i * 120}>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="text-3xl">{icon}</div>
            <p className="mt-2 text-4xl font-extrabold text-emerald-700">
              {loading ? "–" : <CountUp to={n} />}
            </p>
            <p className="mt-1 text-sm text-slate-600">{label}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

const steps: [string, string, string][] = [
  ["👤", "Create your free account", "Sign up with your name, phone number and insurance ID. It takes a minute and costs nothing."],
  ["🔍", "Choose a doctor and a time", "Search by name or specialization, pick a date and time, and confirm. Taken slots can't be double-booked."],
  ["✅", "Attend your appointment", "See all your visits in one list. Plans changed? Cancel in one tap and free the slot."],
];

// Auto-advancing steps. Click one to jump, hover to pause.
export function HowItWorks() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % steps.length), 4500);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div
      className="grid gap-6 md:grid-cols-2"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="space-y-3">
        {steps.map(([icon, title], idx) => (
          <button
            key={title}
            onClick={() => setI(idx)}
            className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
              i === idx
                ? "border-emerald-600 bg-emerald-50 shadow-md"
                : "border-slate-200 bg-white hover:border-emerald-300"
            }`}
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold transition ${
                i === idx ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {idx + 1}
            </span>
            <span className="font-medium">{title}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col justify-between rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-600 p-8 text-white shadow-lg">
        <div key={i} className="reveal in">
          <div className="text-5xl">{steps[i][0]}</div>
          <h3 className="mt-4 text-2xl font-bold">{steps[i][1]}</h3>
          <p className="mt-2 text-white/85">{steps[i][2]}</p>
        </div>
        <div className="mt-6 flex gap-2">
          {steps.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Step ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${i === idx ? "w-8 bg-white" : "w-2 bg-white/40"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Tabs({ tabs }: { tabs: { label: string; icon: string; items: string[] }[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="mx-auto flex max-w-md gap-1 rounded-full bg-slate-200/70 p-1">
        {tabs.map((t, idx) => (
          <button
            key={t.label}
            onClick={() => setActive(idx)}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
              active === idx ? "bg-white text-emerald-800 shadow" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <ul key={active} className="reveal in mx-auto mt-8 max-w-xl space-y-3">
        {tabs[active].items.map((item) => (
          <li key={item} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-emerald-600">✓</span>
            <span className="text-slate-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Faq({ items }: { items: [string, string][] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {items.map(([q, a], i) => (
        <div key={q} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium"
          >
            {q}
            <span className={`text-xl text-emerald-700 transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}>＋</span>
          </button>
          <div className={`grid transition-all duration-300 ${open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
            <div className="overflow-hidden">
              <p className="px-5 pb-4 text-slate-600">{a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}