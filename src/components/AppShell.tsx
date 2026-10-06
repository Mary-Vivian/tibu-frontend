"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Profile, useProfile } from "@/lib/useProfile";

const nav: Record<Profile["role"], [string, string][]> = {
  admin: [["/dashboard", "Dashboard"], ["/doctors", "Doctors"], ["/doctors/register", "Add doctor"], ["/appointments", "Appointments"]],
  patient: [["/dashboard", "Dashboard"], ["/doctors", "Find a doctor"], ["/appointments", "My appointments"]],
  doctor: [["/dashboard", "Dashboard"], ["/appointments", "My appointments"]],
  user: [["/dashboard", "Dashboard"]],
};

export function AppShell({
  title,
  subtitle,
  allow,
  children,
}: {
  title: string;
  subtitle?: string;
  allow?: Profile["role"][];
  children: (profile: Profile) => ReactNode;
}) {
  const router = useRouter();
  const path = usePathname();
  const profile = useProfile(allow);

  const logout = async () => {
    await api.post("/api/logout/").catch(() => {});
    router.replace("/login");
  };

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="text-lg font-bold text-teal-700">
            🩺 Tibu Health
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slate-600 sm:inline">
              {profile.username} · <span className="capitalize">{profile.role}</span>
            </span>
            <button onClick={logout} className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-100">
              Logout
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-2 text-sm">
          {nav[profile.role].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 ${
                path === href ? "bg-teal-50 font-medium text-teal-700" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-slate-600">{subtitle}</p>}
        <div className="mt-6">{children(profile)}</div>
      </main>
    </div>
  );
}