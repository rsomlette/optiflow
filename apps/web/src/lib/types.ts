export const ORDER_STAGES = [
  "pending_order",
  "ordered_awaiting_delivery",
  "received_ready_to_assemble",
  "in_assembly",
  "ready_for_pickup",
] as const;

export type OrderStage = (typeof ORDER_STAGES)[number];

export const ORDER_STAGE_LABELS: Record<OrderStage, string> = {
  pending_order: "Pending Order",
  ordered_awaiting_delivery: "Ordered — Awaiting Delivery",
  received_ready_to_assemble: "Received — Ready to Assemble",
  in_assembly: "In Assembly",
  ready_for_pickup: "Ready for Pickup",
};

export type EntryMode = "auto" | "manual";
export type OcrStatus = "pending" | "complete" | "none";

export interface Tenant {
  id: string;
  name: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  tenantId: string;
  name: string;
  avatarUrl?: string;
  role: "optician" | "assistant" | "manager";
}

export interface PrescriptionData {
  odSphere?: number;
  odCylinder?: number;
  odAxis?: number;
  odAdd?: number;
  osSphere?: number;
  osCylinder?: number;
  osAxis?: number;
  osAdd?: number;
  pd?: number;
  rawText?: string;
}

export interface Order {
  id: string;
  tenantId: string;
  clientName: string;
  clientPhone?: string;
  stage: OrderStage;
  prescriptionData: PrescriptionData;
  prescriptionImageUrl?: string;
  frameDescription?: string;
  lensType?: string;
  assignedEmployeeId: string;
  notes?: string;
  entryMode: EntryMode;
  ocrStatus: OcrStatus;
  stageEnteredAt: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

export interface CreateOrderInput {
  clientName: string;
  clientPhone?: string;
  prescriptionData: PrescriptionData;
  prescriptionImageUrl?: string;
  frameDescription?: string;
  lensType?: string;
  assignedEmployeeId: string;
  notes?: string;
  entryMode: EntryMode;
  ocrStatus: OcrStatus;
}

export interface Session {
  tenantId: string;
}
