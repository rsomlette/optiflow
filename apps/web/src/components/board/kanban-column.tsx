"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useDroppable } from "@dnd-kit/core";
import { AnimatePresence, motion } from "framer-motion";
import type { Order, OrderStage } from "@/lib/types";
import { ORDER_STAGE_LABELS } from "@/lib/types";
import { columnClasses, tokens } from "@/lib/theme";
import { KanbanCard } from "./kanban-card";

interface KanbanColumnProps {
  stage: OrderStage;
  columnIndex: number;
  orders: Order[];
  onCardClick: (order: Order) => void;
}

export function KanbanColumn({
  stage,
  columnIndex,
  orders,
  onCardClick,
}: KanbanColumnProps) {
  const col = columnClasses[columnIndex];

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
      className={`flex flex-col min-w-0 min-h-0 h-full ${tokens.radius.column} border-2 ${col.border} ${col.bg} transition-colors ${
        isOver ? `ring-2 ${col.ring} ring-offset-2 animate-column-glow` : ""
      }`}
    >
      <div className="px-3 py-2.5 border-b border-border/30">
        <div className="flex items-center justify-between">
          <h2 className={`${tokens.fontSize.columnTitle} ${col.text}`}>
            {ORDER_STAGE_LABELS[stage]}
          </h2>
          <span className={`${tokens.fontSize.caption} font-medium px-2 py-0.5 ${tokens.radius.badge} ${col.bg} ${col.text}`}>
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
          className={`absolute inset-0 overflow-y-auto overscroll-contain ${tokens.spacing.column} space-y-2`}
        >
          <AnimatePresence mode="popLayout">
            {orders.map((order) => (
              <KanbanCard
                key={order.id}
                order={order}
                columnId={stage}
                onClick={() => onCardClick(order)}
              />
            ))}
          </AnimatePresence>

          {orders.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className={`flex items-center justify-center h-24 ${tokens.fontSize.body} ${col.text} opacity-40`}
            >
              No orders
            </motion.div>
          )}
        </div>

        {hasMore && (
          <div className={`absolute bottom-0 left-0 right-0 h-12 pointer-events-none backdrop-blur-sm ${col.bg}/70 rounded-b-xl flex items-end justify-center pb-2`}>
            <span className={`${tokens.fontSize.caption} font-medium ${col.text}`}>↓ more</span>
          </div>
        )}
      </div>
    </div>
  );
}
