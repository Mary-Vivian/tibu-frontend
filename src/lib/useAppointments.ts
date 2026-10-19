"use client";
import { useCallback, useEffect, useState } from "react";
import { api, errorMessage } from "./api";

export interface Appt {
  id: number;
  appointment_date: string;
  status: string;
  doctor__user__username: string;
  patient__user__username: string;
  patient__phone?: string;
  room_id:string;
}

const pad = (n: number) => String(n).padStart(2, "0");
export const dayKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
export const byDate = (a: Appt, b: Appt) =>
  +new Date(a.appointment_date) - +new Date(b.appointment_date);

export function useAppointments() {
  const [items, setItems] = useState<Appt[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<Appt[]>("/api/appointments/mine/")
      .then((r) => setItems(r.data))
      .catch((e) => setError(errorMessage(e)));
  }, []);

  const setStatus = useCallback(async (id: number, status: "Cancelled" | "Completed") => {
    setError("");
    try {
      await api.post(`/api/appointments/${id}/status/`, { status });
      setItems((l) => l && l.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch (e) {
      setError(errorMessage(e));
    }
  }, []);

  return { items, error, setStatus };
}