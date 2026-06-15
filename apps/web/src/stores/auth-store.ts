"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Session } from "@/lib/types";

interface AuthState {
  session: Session | null;
  login: (tenantId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      login: (tenantId) => set({ session: { tenantId } }),
      logout: () => set({ session: null }),
    }),
    {
      name: "optiflow-auth",
    }
  )
);
