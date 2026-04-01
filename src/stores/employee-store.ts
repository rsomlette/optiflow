"use client";

import { create } from "zustand";
import type { Employee } from "@/lib/types";
import { EmployeeServiceImpl } from "@/services";

const employeeService = new EmployeeServiceImpl();

interface EmployeeState {
  employees: Employee[];
  isLoading: boolean;
  fetchEmployees: (tenantId: string) => Promise<void>;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: [],
  isLoading: false,

  fetchEmployees: async (tenantId) => {
    set({ isLoading: true });
    const employees = await employeeService.getEmployeesByTenant(tenantId);
    set({ employees, isLoading: false });
  },
}));
