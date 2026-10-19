"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useProfile } from "@/lib/useProfile";
import { useAppointments, fmtDate } from "@/lib/useAppointments";

export default function CallPage() {
  useProfile(["doctor", "patient"]);
  const { room } = useParams<{ room: string }>();
  const { items, error } = useAppointments();

  const appt = items?.find((a) => a.room_id === room);
  const src = `https://meet.jit.si/tibu-${room}#config.prejoinPageEnabled=false&config.disableDeepLinking=true`;

  return (
    <main className="flex min-h-screen flex-col bg-slate-950">
      <header className="flex items-center justify-between px-4 py-3 text-white">
        <div>
          <p className="text-sm font-semibold">Tibu Health consultation</p>
          {appt && <p className="text-xs text-slate-400">{fmtDate(appt.appointment_date)}</p>}
        </div>
        <Link href="/appointments" className="rounded-lg bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20">
          Leave
        </Link>
      </header>

      {error ? (
        <p className="m-auto text-slate-300">{error}</p>
      ) : !items ? (
        <p className="m-auto text-slate-400">Loading…</p>
      ) : !appt || appt.status !== "Scheduled" ? (
        <p className="m-auto max-w-sm text-center text-slate-300">
          This consultation isn&apos;t available. It may be cancelled, completed, or not yours.
        </p>
      ) : (
        <iframe
          title="Video consultation"
          src={src}
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          className="w-full flex-1 border-0"
          style={{ minHeight: "calc(100vh - 56px)" }}
        />
      )}
    </main>
  );
}