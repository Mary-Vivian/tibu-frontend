import Link from "next/link";

export default function CallButton({ roomId, status, compact }: { roomId?: string; status: string; compact?: boolean }) {
  if (!roomId || status !== "Scheduled") return null;
  return (
    <Link
      href={`/call/${roomId}`}
      className={`inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 font-medium text-white transition hover:bg-emerald-700 ${
        compact ? "px-2.5 py-1 text-xs" : "px-4 py-2 text-sm"
      }`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="13" height="12" rx="2" /><path d="m15 10 7-4v12l-7-4" />
      </svg>
      Join call
    </Link>
  );
}