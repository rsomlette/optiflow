"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useTheme } from "@/stores/theme-store";
import { Toaster } from "@/components/ui/sonner";
import { ScreenGuard } from "@/components/layout/screen-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const t = useTheme();

  useEffect(() => {
    if (!session) {
      router.replace("/login");
    }
  }, [session, router]);

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className={t.text.dimmed}>Redirecting...</div>
      </div>
    );
  }

  return (
    <ScreenGuard>
      <style>{`html, body { overflow: hidden; height: 100%; }`}</style>
      <div className={`h-dvh flex flex-col overflow-hidden ${t.surfaceMuted} touch-manipulation`}>
        {children}
        <Toaster />
      </div>
    </ScreenGuard>
  );
}
