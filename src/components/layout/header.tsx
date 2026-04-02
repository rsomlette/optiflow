"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { useTheme } from "@/stores/theme-store";
import { ThemeSwitcher } from "./theme-switcher";

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
  const t = useTheme();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className={`flex items-center justify-between px-4 py-3 ${t.surface} border-b ${t.border.default} shrink-0`}>
      <h1 className={`text-xl font-bold ${t.brand}`}>OptiFlow</h1>

      <div className="flex items-center gap-2">
        <ThemeSwitcher />
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
