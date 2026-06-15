"use client";

import { create } from "zustand";
import type { Order, CreateOrderInput, OrderStage } from "@/lib/types";
import { OrderServiceImpl } from "@/services";

const orderService = new OrderServiceImpl();

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  newOrderIds: Set<string>;
  fetchOrders: (tenantId: string) => Promise<void>;
  createOrder: (tenantId: string, input: CreateOrderInput) => Promise<Order>;
  moveOrder: (
    tenantId: string,
    orderId: string,
    newStage: OrderStage
  ) => Promise<void>;
  assignEmployee: (
    tenantId: string,
    orderId: string,
    employeeId: string
  ) => Promise<void>;
  archiveOrder: (tenantId: string, orderId: string) => Promise<void>;
  matchOrder: (tenantId: string, query: string) => Promise<Order[]>;
  clearNewOrderId: (orderId: string) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  isLoading: false,
  newOrderIds: new Set(),

  fetchOrders: async (tenantId) => {
    set({ isLoading: true });
    const orders = await orderService.getOrdersByTenant(tenantId);
    set({ orders, isLoading: false });
  },

  createOrder: async (tenantId, input) => {
    const order = await orderService.createOrder(tenantId, input);
    const newIds = new Set(get().newOrderIds);
    newIds.add(order.id);
    set({ orders: [...get().orders, order], newOrderIds: newIds });
    return order;
  },

  moveOrder: async (tenantId, orderId, newStage) => {
    const updated = await orderService.moveOrder(tenantId, orderId, newStage);
    set({
      orders: get().orders.map((o) => (o.id === orderId ? updated : o)),
    });
  },

  assignEmployee: async (tenantId, orderId, employeeId) => {
    const updated = await orderService.assignEmployee(
      tenantId,
      orderId,
      employeeId
    );
    set({
      orders: get().orders.map((o) => (o.id === orderId ? updated : o)),
    });
  },

  archiveOrder: async (tenantId, orderId) => {
    await orderService.archiveOrder(tenantId, orderId);
    set({
      orders: get().orders.filter((o) => o.id !== orderId),
    });
  },

  matchOrder: async (tenantId, query) => {
    return orderService.matchOrderByQuery(tenantId, query);
  },

  clearNewOrderId: (orderId) => {
    const newIds = new Set(get().newOrderIds);
    newIds.delete(orderId);
    set({ newOrderIds: newIds });
  },
}));
