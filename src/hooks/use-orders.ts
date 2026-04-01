"use client";

import { useEffect } from "react";
import { useOrderStore } from "@/stores/order-store";
import { useAuthStore } from "@/stores/auth-store";
import type { OrderStage } from "@/lib/types";

export function useOrders() {
  const session = useAuthStore((s) => s.session);
  const { orders, isLoading, fetchOrders } = useOrderStore();

  useEffect(() => {
    if (session) {
      fetchOrders(session.tenantId);
    }
  }, [session, fetchOrders]);

  return { orders, isLoading };
}

export function useOrdersByStage(stage: OrderStage) {
  const orders = useOrderStore((s) =>
    s.orders.filter((o) => o.stage === stage)
  );
  return orders;
}
