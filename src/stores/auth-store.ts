"use client";

import { create } from "zustand";
import type { Session } from "@/lib/types";

interface AuthState {
  session: Session | null;
  login: (tenantId: string, employeeId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  login: (tenantId, employeeId) =>
    set({ session: { tenantId, employeeId } }),
  logout: () => set({ session: null }),
}));
