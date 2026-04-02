"use client";

import { useEffect, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import type { Order, OrderStage } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { useElapsedTime } from "@/hooks/use-elapsed-time";
import { useEmployeeStore } from "@/stores/employee-store";
import { useOrderStore } from "@/stores/order-store";
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
  const isNew = useOrderStore((s) => s.newOrderIds.has(order.id));
  const clearNewOrderId = useOrderStore((s) => s.clearNewOrderId);

  const [showShimmer, setShowShimmer] = useState(isNew);

  useEffect(() => {
    if (isNew) {
      setShowShimmer(true);
      const timer = setTimeout(() => {
        setShowShimmer(false);
        clearNewOrderId(order.id);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isNew, order.id, clearNewOrderId]);

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

  const dragStyle = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  // Show a ghost placeholder while dragging
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        className={`${t.radius.card} border-2 border-dashed ${t.border.default} ${t.spacing.card} opacity-30`}
        style={{ minHeight: 80 }}
      />
    );
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={dragStyle}
      {...attributes}
      {...listeners}
      onClick={onClick}
      layout
      initial={isNew ? { opacity: 0, y: -16, scale: 0.97 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -8, transition: { duration: 0.5, ease: "easeOut" } }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`${t.surface} ${t.radius.card} ${t.border.default} border ${t.spacing.card} ${t.shadow.card} cursor-grab active:cursor-grabbing hover:shadow-md hover:-translate-y-0.5 transition-shadow duration-150 touch-manipulation select-none relative overflow-hidden`}
    >
      {showShimmer && (
        <div className="absolute inset-0 animate-shimmer pointer-events-none" />
      )}

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
    </motion.div>
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
