import CallButton from "@/components/CallButton";
import { Appt } from "@/lib/useAppointments";
import { fmtTime } from "@/lib/useAppointments";

export default function OnlineConsultCard({ items }: { items: Appt[] }) {
  const today = new Date().toDateString();
  const upcoming = items
    .filter((a) => a.status === "Scheduled" && new Date(a.appointment_date) >= new Date(new Date().setHours(0, 0, 0, 0)))
    .sort((a, b) => +new Date(a.appointment_date) - +new Date(b.appointment_date));
  const todayCount = upcoming.filter((a) => new Date(a.appointment_date).toDateString() === today).length;
  const next = upcoming[0];

  return (
    <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 p-5 text-white shadow-sm">
      <p className="text-sm text-emerald-100">Online consultancy</p>
      <p className="mt-1 text-4xl font-semibold">{todayCount}</p>
      <p className="text-xs text-emerald-100">video calls today</p>
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/20 pt-3">
        {next ? (
          <>
            <span className="text-xs text-emerald-50">Next: {fmtTime(next.appointment_date)}</span>
            <CallButton roomId={next.room_id} status={next.status} compact />
          </>
        ) : (
          <span className="text-xs text-emerald-50">No upcoming calls</span>
        )}
      </div>
    </div>
  );
}