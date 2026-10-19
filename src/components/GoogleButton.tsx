"use client";
import { useEffect, useRef, useState } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { api, errorMessage } from "@/lib/api";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleButton({ onError }: { onError: (msg: string) => void }) {
  const router = useRouter();
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(320);

  useEffect(() => {
    if (box.current) setWidth(Math.max(200, Math.min(400, Math.floor(box.current.clientWidth))));
  }, []);

  if (!CLIENT_ID) return null;

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="my-5 flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        or
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <div ref={box} className="flex justify-center">
        <GoogleLogin
          width={String(width)}
          text="continue_with"
          shape="pill"
          onSuccess={async (res) => {
            try {
              await api.post("/api/google-login/", { credential: res.credential });
              router.push("/dashboard");
            } catch (err) {
              onError(errorMessage(err));
            }
          }}
          onError={() => onError("Google sign-in was cancelled or failed.")}
        />
      </div>
    </GoogleOAuthProvider>
  );
}