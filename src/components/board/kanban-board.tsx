"use client";

import { useState, useCallback, useMemo } from "react";
import {
  DndContext,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import { COLUMNS } from "@/lib/constants";
import type { Order } from "@/lib/types";
import { resolveTargetStage } from "@/lib/dnd-utils";
import { useOrders } from "@/hooks/use-orders";
import { useEmployees } from "@/hooks/use-employees";
import { useOrderStore } from "@/stores/order-store";
import { useAuthStore } from "@/stores/auth-store";
import { Header } from "@/components/layout/header";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";
import { OrderDetailSheet } from "@/components/orders/order-detail-sheet";
import { NewOrderDialog } from "@/components/orders/new-order-dialog";
import { ScanReceivedDialog } from "@/components/scan/scan-received-dialog";

export function KanbanBoard() {
  const session = useAuthStore((s) => s.session);
  const { orders, isLoading } = useOrders();
  useEmployees();
  const moveOrder = useOrderStore((s) => s.moveOrder);

  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [showScanReceived, setShowScanReceived] = useState(false);

  const hasOrdersAwaitingDelivery = useMemo(
    () => orders.some((o) => o.stage === "ordered_awaiting_delivery"),
    [orders]
  );

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const order = orders.find((o) => o.id === event.active.id);
      setActiveOrder(order ?? null);
    },
    [orders]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveOrder(null);

      if (!session) return;

      const orderId = event.active.id as string;
      const targetStage = resolveTargetStage(event.over);

      if (!targetStage) return;

      const order = orders.find((o) => o.id === orderId);
      if (!order || order.stage === targetStage) return;

      moveOrder(session.tenantId, orderId, targetStage);
    },
    [orders, session, moveOrder]
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-400">Loading orders...</div>
      </div>
    );
  }

  return (
    <>
      <Header
        onNewOrder={() => setShowNewOrder(true)}
        onScanReceived={() => setShowScanReceived(true)}
        scanDisabled={!hasOrdersAwaitingDelivery}
      />

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-hidden p-4">
          <div className="grid grid-cols-5 gap-3 h-full">
            {COLUMNS.map((column) => {
              const columnOrders = orders
                .filter((o) => o.stage === column.id)
                .sort(
                  (a, b) =>
                    new Date(a.stageEnteredAt).getTime() -
                    new Date(b.stageEnteredAt).getTime()
                );
              return (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  orders={columnOrders}
                  onCardClick={setSelectedOrder}
                />
              );
            })}
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeOrder && (
            <div className="rotate-2 scale-105 shadow-xl rounded-lg">
              <KanbanCard
                order={activeOrder}
                columnId={activeOrder.stage}
                onClick={() => {}}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <OrderDetailSheet
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      <NewOrderDialog
        open={showNewOrder}
        onClose={() => setShowNewOrder(false)}
      />

      <ScanReceivedDialog
        open={showScanReceived}
        onClose={() => setShowScanReceived(false)}
      />
    </>
  );
}
