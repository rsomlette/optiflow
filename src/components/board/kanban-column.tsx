"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useDroppable } from "@dnd-kit/core";
import type { Order, OrderStage } from "@/lib/types";
import { ORDER_STAGE_LABELS } from "@/lib/types";
import type { ColumnColors } from "@/lib/theme";
import { KanbanCard } from "./kanban-card";

interface KanbanColumnProps {
  stage: OrderStage;
  colors: ColumnColors;
  orders: Order[];
  onCardClick: (order: Order) => void;
}

export function KanbanColumn({
  stage,
  colors,
  orders,
  onCardClick,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
    data: { type: "column", columnId: stage },
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasMore, setHasMore] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setHasMore(el.scrollHeight - el.scrollTop - el.clientHeight > 8);
  }, []);

  useEffect(() => {
    checkScroll();
  }, [orders.length, checkScroll]);

  return (
    <div
      className={`flex flex-col min-w-0 min-h-0 h-full rounded-xl border-2 ${colors.border} ${colors.bg} transition-colors ${
        isOver ? `ring-2 ${colors.ring} ring-offset-2` : ""
      }`}
    >
      <div className="px-3 py-2.5 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <h2 className={`text-sm font-semibold ${colors.text}`}>
            {ORDER_STAGE_LABELS[stage]}
          </h2>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}
          >
            {orders.length}
          </span>
        </div>
      </div>

      <div className="relative flex-1 min-h-0">
        <div
          ref={(node) => {
            scrollRef.current = node;
            setNodeRef(node);
          }}
          onScroll={checkScroll}
          className="absolute inset-0 overflow-y-auto overscroll-contain p-2 space-y-2"
        >
          {orders.map((order) => (
            <KanbanCard
              key={order.id}
              order={order}
              columnId={stage}
              onClick={() => onCardClick(order)}
            />
          ))}

          {orders.length === 0 && (
            <div className="flex items-center justify-center h-24 text-sm text-gray-400">
              No orders
            </div>
          )}
        </div>

        {hasMore && (
          <div className={`absolute bottom-0 left-0 right-0 h-12 pointer-events-none backdrop-blur-sm ${colors.bg}/70 rounded-b-xl flex items-end justify-center pb-2`}>
            <span className={`text-xs font-medium ${colors.text}`}>↓ more</span>
          </div>
        )}
      </div>
    </div>
  );
}
