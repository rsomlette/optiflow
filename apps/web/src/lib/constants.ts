import { type OrderStage, ORDER_STAGES, ORDER_STAGE_LABELS } from "./types";

export const COLUMN_STAGES = ORDER_STAGES;
export const COLUMN_LABELS = ORDER_STAGE_LABELS;

export const STAGE_INDEX: Record<OrderStage, number> = Object.fromEntries(
  ORDER_STAGES.map((s, i) => [s, i])
) as Record<OrderStage, number>;

export const DEFAULT_TENANT_ID = "tenant_default";
