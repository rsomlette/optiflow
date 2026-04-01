"use client";

import { useEffect } from "react";
import { useEmployeeStore } from "@/stores/employee-store";
import { useAuthStore } from "@/stores/auth-store";

export function useEmployees() {
  const session = useAuthStore((s) => s.session);
  const { employees, isLoading, fetchEmployees } = useEmployeeStore();

  useEffect(() => {
    if (session) {
      fetchEmployees(session.tenantId);
    }
  }, [session, fetchEmployees]);

  return { employees, isLoading };
}
