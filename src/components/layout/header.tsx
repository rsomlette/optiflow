"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { useEmployeeStore } from "@/stores/employee-store";

interface HeaderProps {
  onNewOrder: () => void;
  onScanReceived: () => void;
}

export function Header({ onNewOrder, onScanReceived }: HeaderProps) {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const logout = useAuthStore((s) => s.logout);
  const employees = useEmployeeStore((s) => s.employees);

  const currentEmployee = employees.find(
    (e) => e.id === session?.employeeId
  );

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-blue-700">OptiFlow</h1>
        {currentEmployee && (
          <span className="text-sm text-gray-500">
            {currentEmployee.name}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={onNewOrder}>New Order</Button>
        <Button variant="outline" onClick={onScanReceived}>
          Scan Received
        </Button>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Sign Out
        </Button>
      </div>
    </header>
  );
}
