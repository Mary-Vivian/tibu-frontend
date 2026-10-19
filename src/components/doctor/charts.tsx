"use client";
import { KeyboardEvent, PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { Appt, dayKey } from "@/lib/useAppointments";

const INK = { grid: "#e1e0d9", axis: "#c3c2b7", muted: "#898781", primary: "#0f172a" };
const SERIES = "#2a78d6";

export const STATUS_COLORS = {
  Scheduled: "#2a78d6",
  Completed: "#1baf7a",
  Cancelled: "#eb6834",
} as const;
export type StatusName = keyof typeof STATUS_COLORS;
const STATUSES: StatusName[] = ["Scheduled", "Completed", "Cancelled"];

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(Math.floor(el.clientWidth));
    const ro = new ResizeObserver(([e]) => setW(Math.floor(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

const SPAN = 7; // days either side of today
const N = SPAN * 2 + 1;
const H = 230; // includes the x-axis band
const M = { l: 34, r: 14, t: 14, b: 30 };

export function DayChart({ items, className = "" }: { items: Appt[]; className?: string }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const [table, setTable] = useState(false);

  const days = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of items) {
      if (a.status === "Cancelled") continue;
      const k = dayKey(new Date(a.appointment_date));
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - SPAN);
    return Array.from({ length: N }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return { date: d, n: counts.get(dayKey(d)) ?? 0 };
    });
  }, [items]);

  const max = Math.max(0, ...days.map((d) => d.n));
  const top = Math.max(4, Math.ceil(max / 4) * 4);
  const ticks = [0, 1, 2, 3, 4].map((i) => (top / 4) * i);
  const pw = Math.max(width - M.l - M.r, 0);
  const ph = H - M.t - M.b;
  const x = (i: number) => M.l + (i * pw) / (N - 1);
  const y = (v: number) => M.t + ph * (1 - v / top);
  const line = days.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.n)}`).join("");
  const area = `${line}L${x(N - 1)},${y(0)}L${x(0)},${y(0)}Z`;
  const short = (d: Date) => d.toLocaleDateString([], { day: "numeric", month: "short" });
  const hd = hover !== null ? days[hover] : null;

  const move = (e: PointerEvent<SVGRectElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - r.left) / pw) * (N - 1));
    setHover(Math.min(N - 1, Math.max(0, i)));
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") setHover((h) => Math.min(N - 1, (h ?? SPAN) + 1));
    else if (e.key === "ArrowLeft") setHover((h) => Math.max(0, (h ?? SPAN) - 1));
    else if (e.key === "Escape") setHover(null);
    else return;
    e.preventDefault();
  };

  return (
    <section className={`rounded-2xl bg-white p-5 shadow-sm ${className}`}>
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-semibold text-slate-900">Appointments per day</h2>
          <p className="text-xs text-slate-500">7 days back to 7 days ahead. Cancelled ones are not counted.</p>
        </div>
        <button
          onClick={() => setTable(!table)}
          className="rounded-lg border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50"
        >
          {table ? "Chart view" : "Table view"}
        </button>
      </div>

      <div ref={ref} className="relative">
        {table ? (
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 text-right font-medium">Appointments</th>
                </tr>
              </thead>
              <tbody>
                {days.map((d) => (
                  <tr key={d.date.toISOString()} className="border-t border-slate-100">
                    <td className="py-1.5 text-slate-700">
                      {d.date.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })}
                    </td>
                    <td className="py-1.5 text-right tabular-nums text-slate-900">{d.n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          width > 0 && (
            <svg
              width={width}
              height={H}
              role="img"
              aria-label="Appointments per day, from 7 days ago to 7 days ahead. Use the arrow keys to read each day."
              tabIndex={0}
              onKeyDown={onKey}
              onFocus={() => setHover((h) => h ?? SPAN)}
              onBlur={() => setHover(null)}
              className="block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              {ticks.map((t) => (
                <g key={t}>
                  <line x1={M.l} x2={width - M.r} y1={y(t)} y2={y(t)} stroke={t === 0 ? INK.axis : INK.grid} strokeWidth={1} />
                  <text x={M.l - 8} y={y(t) + 4} textAnchor="end" fontSize={11} fill={INK.muted} style={{ fontVariantNumeric: "tabular-nums" }}>
                    {t}
                  </text>
                </g>
              ))}

              {days.map(
                (d, i) =>
                  (i - SPAN) % 2 === 0 && (
                    <text
                      key={i}
                      x={x(i)}
                      y={H - 8}
                      textAnchor="middle"
                      fontSize={11}
                      fill={i === SPAN ? INK.primary : INK.muted}
                      fontWeight={i === SPAN ? 600 : 400}
                    >
                      {i === SPAN ? "Today" : short(d.date)}
                    </text>
                  )
              )}

              <path d={area} fill={SERIES} fillOpacity={0.1} />
              <path d={line} fill="none" stroke={SERIES} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

              {hover !== null && (
                <line x1={x(hover)} x2={x(hover)} y1={M.t} y2={y(0)} stroke={INK.axis} strokeWidth={1} />
              )}
              {[...new Set([SPAN, ...(hover === null ? [] : [hover])])].map((i) => (
                <circle key={i} cx={x(i)} cy={y(days[i].n)} r={5} fill={SERIES} stroke="#fff" strokeWidth={2} />
              ))}

              {/* The whole plot area is the hover target, not just the dots */}
              <rect
                x={M.l}
                y={M.t}
                width={pw}
                height={ph}
                fill="transparent"
                onPointerMove={move}
                onPointerDown={move}
                onPointerLeave={() => setHover(null)}
              />
            </svg>
          )
        )}

        {!table && hd && hover !== null && width > 0 && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg"
            style={{ left: Math.min(Math.max(x(hover), 70), width - 70), top: Math.max(y(hd.n) - 72, 0) }}
          >
            <p className="text-xs text-slate-500">
              {hd.date.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })}
            </p>
            <p className="mt-0.5 flex items-center gap-2 text-sm text-slate-600">
              <span className="inline-block h-0.5 w-3 rounded" style={{ background: SERIES }} />
              <strong className="text-lg font-semibold text-slate-900">{hd.n}</strong>
              {hd.n === 1 ? "appointment" : "appointments"}
            </p>
          </div>
        )}
      </div>

      {max === 0 && <p className="mt-2 text-center text-sm text-slate-500">No appointments in this window yet.</p>}
    </section>
  );
}

export function StatusDonut({
  counts,
  className = "",
}: {
  counts: Record<StatusName, number>;
  className?: string;
}) {
  const [hover, setHover] = useState<StatusName | null>(null);
  const total = STATUSES.reduce((s, k) => s + counts[k], 0);
  const R = 52;
  const SW = 16;
  const C = 2 * Math.PI * R;
  const live = STATUSES.filter((k) => counts[k] > 0);
  const GAP = live.length > 1 ? 2 : 0; // surface-coloured gap between segments

  let acc = 0;
  const segs = live.map((k) => {
    const len = (counts[k] / total) * C;
    const s = { k, len, off: acc };
    acc += len;
    return s;
  });

  return (
    <section className={`rounded-2xl bg-white p-5 shadow-sm ${className}`}>
      <h2 className="font-semibold text-slate-900">Appointments by status</h2>

      <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
        <div className="relative h-40 w-40 shrink-0">
          <svg
            viewBox="0 0 140 140"
            className="h-full w-full"
            role="img"
            aria-label={STATUSES.map((k) => `${k} ${counts[k]}`).join(", ")}
          >
            <g transform="rotate(-90 70 70)">
              <circle cx={70} cy={70} r={R} fill="none" stroke="#eef0ee" strokeWidth={SW} />
              {segs.map((s) => (
                <circle
                  key={s.k}
                  cx={70}
                  cy={70}
                  r={R}
                  fill="none"
                  stroke={STATUS_COLORS[s.k]}
                  strokeWidth={hover === s.k ? SW + 4 : SW}
                  strokeDasharray={`${Math.max(s.len - GAP, 0.5)} ${C}`}
                  strokeDashoffset={-s.off}
                  onPointerEnter={() => setHover(s.k)}
                  onPointerLeave={() => setHover(null)}
                  style={{ transition: "stroke-width 120ms" }}
                />
              ))}
            </g>
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold text-slate-900">{hover ? counts[hover] : total}</span>
            <span className="text-xs text-slate-500">{hover ?? "Total"}</span>
          </div>
        </div>

        <ul className="w-full space-y-1 text-sm">
          {STATUSES.map((k) => (
            <li
              key={k}
              onPointerEnter={() => setHover(k)}
              onPointerLeave={() => setHover(null)}
              className={`flex items-center gap-3 rounded-lg px-2 py-1.5 ${hover === k ? "bg-slate-50" : ""}`}
            >
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: STATUS_COLORS[k] }} />
              <span className="flex-1 text-slate-700">{k}</span>
              <strong className="text-slate-900">{counts[k]}</strong>
              <span className="w-10 text-right text-xs text-slate-500">
                {total ? Math.round((counts[k] / total) * 100) : 0}%
              </span>
            </li>
          ))}
        </ul>
      </div>

      {total === 0 && <p className="mt-3 text-center text-sm text-slate-500">No appointments yet.</p>}
    </section>
  );
}