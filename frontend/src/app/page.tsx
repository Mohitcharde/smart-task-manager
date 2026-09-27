"use client";

// --------------------------------------------------
// SMART TASK MANAGER - ROOT REDIRECT
// --------------------------------------------------

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Loading } from "../components/Loading";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loading message="Redirecting to Smart Task Manager..." />
    </div>
  );
}
