"use client";
import { ChangeEvent, ReactNode, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Profile } from "@/lib/useProfile";

const nav: [string, string, string][] = [
  ["/dashboard", "▦", "Overview"],
  ["/appointments", "📅", "Appointments"],
];

export function DoctorShell({
  profile,
  active,
  title,
  search,
  children,
}: {
  profile: Profile;
  active: string;
  title: string;
  search?: { value: string; onChange: (v: string) => void };
  children: ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await api.post("/api/logout/").catch(() => {});
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <div className="flex items-center justify-between bg-emerald-950 px-4 py-3 text-white md:hidden">
        <span className="font-bold">🩺 Tibu Health</span>
        <button
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          aria-expanded={open}
          className="rounded-lg border border-white/30 px-3 py-1"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      <aside
        className={`${open ? "flex" : "hidden"} w-full shrink-0 flex-col bg-emerald-950 px-4 py-6 text-white md:sticky md:top-0 md:flex md:h-screen md:w-64`}
      >
        <Link href="/" className="mb-6 hidden px-2 text-xl font-bold md:block">
          🩺 Tibu Health
        </Link>

        <div className="mb-6 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-3xl font-bold shadow-lg ring-4 ring-white/10">
            {profile.username.slice(0, 2).toUpperCase()}
          </div>
          <p className="mt-3 font-semibold text-teal-200">Dr. {profile.username}</p>
          {profile.specialization && (
            <p className="text-xs text-emerald-100/70">{profile.specialization}</p>
          )}
        </div>

        <nav className="space-y-1">
          {nav.map(([href, icon, label]) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                active === href
                  ? "bg-teal-500 text-white shadow"
                  : "text-emerald-100/80 hover:bg-white/10"
              }`}
            >
              <span className="w-5 text-center">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mt-6 flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-emerald-100/80 transition hover:bg-white/10 md:mt-auto"
        >
          <span className="w-5 text-center">⏻</span>
          Logout
        </button>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {search && (
            <label className="relative w-full sm:w-80">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input
                value={search.value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => search.onChange(e.target.value)}
                placeholder="Search by patient name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
            </label>
          )}
        </header>
        {children}
      </main>
    </div>
  );
}