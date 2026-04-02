"use client";

import { useDraggable } from "@dnd-kit/core";
import type { Order, OrderStage } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { useElapsedTime } from "@/hooks/use-elapsed-time";
import { useEmployeeStore } from "@/stores/employee-store";
import { useTheme } from "@/stores/theme-store";

interface KanbanCardProps {
  order: Order;
  columnId: OrderStage;
  onClick: () => void;
}

export function KanbanCard({ order, columnId, onClick }: KanbanCardProps) {
  const t = useTheme();
  const elapsed = useElapsedTime(order.stageEnteredAt);
  const employees = useEmployeeStore((s) => s.employees);
  const assignee = employees.find((e) => e.id === order.assignedEmployeeId);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: order.id,
    data: { type: "card", order, columnId },
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        opacity: isDragging ? 0.4 : 1,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`${t.surface} ${t.radius.card} ${t.border.default} border ${t.spacing.card} ${t.shadow.card} cursor-grab active:cursor-grabbing hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5 transition-all duration-150 touch-manipulation select-none`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className={`font-semibold ${t.fontSize.body} ${t.text.primary} truncate`}>
          {order.clientName}
        </h3>
        <span className={`${t.fontSize.caption} ${t.text.dimmed} whitespace-nowrap`}>
          {elapsed}
        </span>
      </div>

      {order.frameDescription && (
        <p className={`${t.fontSize.caption} ${t.text.muted} mb-2 truncate`}>
          {order.frameDescription}
        </p>
      )}

      <div className="flex items-center gap-1.5 flex-wrap">
        <OcrBadge order={order} />
        {order.lensType && (
          <Badge variant="secondary" className={t.fontSize.caption}>
            {order.lensType}
          </Badge>
        )}
      </div>

      {assignee && (
        <div className={`mt-2 ${t.fontSize.caption} ${t.text.dimmed}`}>
          {assignee.name}
        </div>
      )}
    </div>
  );
}

function OcrBadge({ order }: { order: Order }) {
  const t = useTheme();
  if (order.stage !== "pending_order") return null;

  const statusClass = {
    pending: t.status.ocrPending,
    complete: t.status.ocrComplete,
    none: t.status.manual,
  }[order.ocrStatus];

  const label = {
    pending: "OCR Pending",
    complete: "OCR Complete",
    none: "Manual",
  }[order.ocrStatus];

  return (
    <Badge variant="outline" className={statusClass}>
      {label}
    </Badge>
  );
}
