"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import { COLUMNS } from "@/lib/constants";
import type { Order, OrderStage } from "@/lib/types";
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
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
      const { active, over } = event;
      if (!over || !session) return;

      const orderId = active.id as string;
      const targetStage = over.id as OrderStage;

      // Only move if dropping on a different column
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
      />

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
          <div className="flex gap-4 h-full">
            {COLUMNS.map((column) => {
              const columnOrders = orders.filter(
                (o) => o.stage === column.id
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

        <DragOverlay>
          {activeOrder && (
            <div className="w-[280px]">
              <KanbanCard order={activeOrder} onClick={() => {}} />
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
