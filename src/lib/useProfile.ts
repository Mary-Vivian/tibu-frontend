"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "./api";

export interface Profile {
  username: string;
  role: "admin" | "doctor" | "patient" | "user";
  patient_id: number | null;
  doctor_id: number | null;
  specialization?: string | null;
}

// Pass allowed roles to restrict a page; others are sent back to the dashboard
export function useProfile(allowed?: Profile["role"][]) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    api
      .get<Profile>("/api/profile/")
      .then((r) => {
        if (allowed && !allowed.includes(r.data.role)) {
          router.replace("/dashboard");
          return;
        }
        setProfile(r.data);
      })
      .catch(() => router.replace("/login"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return profile;
}