import type {
  Order,
  CreateOrderInput,
  OrderStage,
} from "@/lib/types";
import { generateId } from "@/lib/id";
import type { OrderService } from "../types";
import { MOCK_ORDERS } from "./seed-data";

export class MockOrderService implements OrderService {
  private orders: Map<string, Order>;

  constructor() {
    this.orders = new Map(MOCK_ORDERS.map((o) => [o.id, { ...o }]));
  }

  async getOrdersByTenant(tenantId: string): Promise<Order[]> {
    return [...this.orders.values()].filter(
      (o) => o.tenantId === tenantId && !o.archivedAt
    );
  }

  async getOrderById(
    tenantId: string,
    orderId: string
  ): Promise<Order | null> {
    const order = this.orders.get(orderId);
    if (!order || order.tenantId !== tenantId) return null;
    return { ...order };
  }

  async createOrder(
    tenantId: string,
    input: CreateOrderInput
  ): Promise<Order> {
    const now = new Date().toISOString();
    const order: Order = {
      id: generateId(),
      tenantId,
      clientName: input.clientName,
      clientPhone: input.clientPhone,
      stage: "pending_order",
      prescriptionData: input.prescriptionData,
      prescriptionImageUrl: input.prescriptionImageUrl,
      frameDescription: input.frameDescription,
      lensType: input.lensType,
      assignedEmployeeId: input.assignedEmployeeId,
      notes: input.notes,
      entryMode: input.entryMode,
      ocrStatus: input.ocrStatus,
      stageEnteredAt: now,
      createdAt: now,
      updatedAt: now,
    };
    this.orders.set(order.id, order);
    return { ...order };
  }

  async moveOrder(
    tenantId: string,
    orderId: string,
    newStage: OrderStage
  ): Promise<Order> {
    const order = this.orders.get(orderId);
    if (!order || order.tenantId !== tenantId) {
      throw new Error("Order not found");
    }
    const now = new Date().toISOString();
    order.stage = newStage;
    order.stageEnteredAt = now;
    order.updatedAt = now;
    return { ...order };
  }

  async assignEmployee(
    tenantId: string,
    orderId: string,
    employeeId: string
  ): Promise<Order> {
    const order = this.orders.get(orderId);
    if (!order || order.tenantId !== tenantId) {
      throw new Error("Order not found");
    }
    order.assignedEmployeeId = employeeId;
    order.updatedAt = new Date().toISOString();
    return { ...order };
  }

  async archiveOrder(tenantId: string, orderId: string): Promise<Order> {
    const order = this.orders.get(orderId);
    if (!order || order.tenantId !== tenantId) {
      throw new Error("Order not found");
    }
    order.archivedAt = new Date().toISOString();
    order.updatedAt = order.archivedAt;
    return { ...order };
  }

  async matchOrderByQuery(tenantId: string, query: string): Promise<Order[]> {
    const lower = query.toLowerCase();
    return [...this.orders.values()].filter(
      (o) =>
        o.tenantId === tenantId &&
        !o.archivedAt &&
        (o.clientName.toLowerCase().includes(lower) ||
          o.id.toLowerCase().includes(lower))
    );
  }
}
