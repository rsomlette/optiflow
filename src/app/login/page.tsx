"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores/auth-store";
import { TenantServiceImpl, EmployeeServiceImpl } from "@/services";
import type { Tenant, Employee } from "@/lib/types";

const tenantService = new TenantServiceImpl();
const employeeService = new EmployeeServiceImpl();

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const session = useAuthStore((s) => s.session);

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  // Load tenants on mount
  useEffect(() => {
    tenantService.getTenants().then(setTenants);
  }, []);

  // Load employees when tenant changes
  useEffect(() => {
    if (selectedTenant) {
      setSelectedEmployee("");
      employeeService.getEmployeesByTenant(selectedTenant).then(setEmployees);
    } else {
      setEmployees([]);
    }
  }, [selectedTenant]);

  function handleLogin() {
    if (!selectedTenant || !selectedEmployee) return;
    login(selectedTenant, selectedEmployee);
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
        <Link href="/" className="text-2xl font-bold text-blue-700">
          OptiFlow
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Select your shop and employee to continue
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop
              </label>
              <Select value={selectedTenant} onValueChange={(v) => setSelectedTenant(v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a shop" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee
              </label>
              <Select
                value={selectedEmployee}
                onValueChange={(v) => setSelectedEmployee(v ?? "")}
                disabled={!selectedTenant}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name} — {e.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full"
              onClick={handleLogin}
              disabled={!selectedTenant || !selectedEmployee}
            >
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
