"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Toaster } from "@/components/ui/sonner";
import { ScreenGuard } from "@/components/layout/screen-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);

  useEffect(() => {
    if (!session) {
      router.replace("/login");
    }
  }, [session, router]);

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-gray-400">Redirecting...</div>
      </div>
    );
  }

  return (
    <ScreenGuard>
      <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
        {children}
        <Toaster />
      </div>
    </ScreenGuard>
  );
}
