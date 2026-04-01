"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";

interface HeaderProps {
  onNewOrder: () => void;
  onScanReceived: () => void;
  scanDisabled?: boolean;
}

export function Header({
  onNewOrder,
  onScanReceived,
  scanDisabled,
}: HeaderProps) {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shrink-0">
      <h1 className="text-xl font-bold text-blue-700">OptiFlow</h1>

      <div className="flex items-center gap-2">
        <Button onClick={onNewOrder}>New Order</Button>
        <Button
          variant="outline"
          onClick={onScanReceived}
          disabled={scanDisabled}
        >
          Scan Received
        </Button>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Sign Out
        </Button>
      </div>
    </header>
  );
}
