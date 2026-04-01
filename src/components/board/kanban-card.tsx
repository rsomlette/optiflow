"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Order } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { useElapsedTime } from "@/hooks/use-elapsed-time";
import { useEmployeeStore } from "@/stores/employee-store";

interface KanbanCardProps {
  order: Order;
  onClick: () => void;
}

export function KanbanCard({ order, onClick }: KanbanCardProps) {
  const elapsed = useElapsedTime(order.stageEnteredAt);
  const employees = useEmployeeStore((s) => s.employees);
  const assignee = employees.find((e) => e.id === order.assignedEmployeeId);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: order.id,
    data: { order },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const ocrBadge = {
    pending: { label: "OCR Pending", variant: "outline" as const, className: "border-yellow-400 text-yellow-700 bg-yellow-50" },
    complete: { label: "OCR Complete", variant: "outline" as const, className: "border-green-400 text-green-700 bg-green-50" },
    none: { label: "Manual", variant: "outline" as const, className: "border-blue-400 text-blue-700 bg-blue-50" },
  }[order.ocrStatus];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow touch-manipulation"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-sm text-gray-900 truncate">
          {order.clientName}
        </h3>
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {elapsed}
        </span>
      </div>

      {order.frameDescription && (
        <p className="text-xs text-gray-500 mb-2 truncate">
          {order.frameDescription}
        </p>
      )}

      <div className="flex items-center gap-1.5 flex-wrap">
        {order.stage === "pending_order" && (
          <Badge variant={ocrBadge.variant} className={ocrBadge.className}>
            {ocrBadge.label}
          </Badge>
        )}
        {order.lensType && (
          <Badge variant="secondary" className="text-xs">
            {order.lensType}
          </Badge>
        )}
      </div>

      {assignee && (
        <div className="mt-2 text-xs text-gray-400">
          {assignee.name}
        </div>
      )}
    </div>
  );
}
