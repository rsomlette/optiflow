import type { Over } from "@dnd-kit/core";
import type { OrderStage } from "./types";
import { ORDER_STAGES } from "./types";

/**
 * Resolves the target column stage from a dnd-kit `over` target.
 * The target can be either a column (droppable) or a card (sortable).
 * Returns null if dropped outside any valid target.
 */
export function resolveTargetStage(over: Over | null): OrderStage | null {
  if (!over) return null;

  const data = over.data.current;

  // Dropped on a column droppable
  if (data?.type === "column") {
    return data.columnId as OrderStage;
  }

  // Dropped on a card — use the card's parent column
  if (data?.type === "card") {
    return data.columnId as OrderStage;
  }

  // Fallback: check if the over.id itself is a valid stage
  if (ORDER_STAGES.includes(over.id as OrderStage)) {
    return over.id as OrderStage;
  }

  return null;
}
