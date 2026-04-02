"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import type { Tenant } from "@/lib/types";

interface LoginFormProps {
  tenants: Tenant[];
}

export function LoginForm({ tenants }: LoginFormProps) {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const session = useAuthStore((s) => s.session);

  const [selectedTenant, setSelectedTenant] = useState("");

  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTenant) return;
    login(selectedTenant);
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Select your shop to continue
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="shop"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Shop
          </label>
          <select
            id="shop"
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
          >
            <option value="">Select a shop</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={!selectedTenant}
          className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
        >
          Continue to Dashboard
        </button>
      </div>
    </form>
  );
}
