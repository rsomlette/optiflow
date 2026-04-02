"use client";

import { useDroppable } from "@dnd-kit/core";
import type { Order } from "@/lib/types";
import type { ColumnDefinition } from "@/lib/constants";
import { KanbanCard } from "./kanban-card";

interface KanbanColumnProps {
  column: ColumnDefinition;
  orders: Order[];
  onCardClick: (order: Order) => void;
}

export function KanbanColumn({
  column,
  orders,
  onCardClick,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", columnId: column.id },
  });

  return (
    <div
      className={`flex flex-col min-w-0 min-h-0 h-full rounded-xl border-2 ${column.borderColor} ${column.bgColor} transition-colors ${
        isOver ? "ring-2 ring-blue-400 ring-offset-2" : ""
      }`}
    >
      <div className="px-3 py-2.5 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <h2 className={`font-semibold text-sm ${column.color}`}>
            {column.label}
          </h2>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${column.bgColor} ${column.color}`}
          >
            {orders.length}
          </span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-2 space-y-2"
      >
        {orders.map((order) => (
          <KanbanCard
            key={order.id}
            order={order}
            columnId={column.id}
            onClick={() => onCardClick(order)}
          />
        ))}

        {orders.length === 0 && (
          <div className="flex items-center justify-center h-24 text-sm text-gray-400">
            No orders
          </div>
        )}
      </div>
    </div>
  );
}
