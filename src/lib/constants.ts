import { type OrderStage, ORDER_STAGES, ORDER_STAGE_LABELS } from "./types";

export interface ColumnDefinition {
  id: OrderStage;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const COLUMNS: ColumnDefinition[] = [
  {
    id: "pending_order",
    label: ORDER_STAGE_LABELS.pending_order,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
  },
  {
    id: "ordered_awaiting_delivery",
    label: ORDER_STAGE_LABELS.ordered_awaiting_delivery,
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-300",
  },
  {
    id: "received_ready_to_assemble",
    label: ORDER_STAGE_LABELS.received_ready_to_assemble,
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-300",
  },
  {
    id: "in_assembly",
    label: ORDER_STAGE_LABELS.in_assembly,
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-300",
  },
  {
    id: "ready_for_pickup",
    label: ORDER_STAGE_LABELS.ready_for_pickup,
    color: "text-teal-700",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-300",
  },
];

export const STAGE_INDEX: Record<OrderStage, number> = Object.fromEntries(
  ORDER_STAGES.map((s, i) => [s, i])
) as Record<OrderStage, number>;

export const DEFAULT_TENANT_ID = "tenant_default";
