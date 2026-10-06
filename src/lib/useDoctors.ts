"use client";
import { useEffect, useState } from "react";
import { api } from "./api";

export interface Doctor {
  id: number;
  user__username: string;
  specialization: string;
}

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api
      .get<Doctor[]>("/api/doctors/")
      .then((r) => setDoctors(r.data))
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  return { doctors, loading, failed };
}