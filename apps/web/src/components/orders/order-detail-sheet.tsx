"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Order } from "@/lib/types";
import { ORDER_STAGE_LABELS } from "@/lib/types";
import { tokens } from "@/lib/theme";
import { useElapsedTime } from "@/hooks/use-elapsed-time";
import { useOrderStore } from "@/stores/order-store";
import { useAuthStore } from "@/stores/auth-store";
import { EmployeeSelect } from "@/components/employees/employee-select";
import { toast } from "sonner";

interface OrderDetailSheetProps {
  order: Order | null;
  onClose: () => void;
}

export function OrderDetailSheet({ order, onClose }: OrderDetailSheetProps) {
  const session = useAuthStore((s) => s.session);
  const archiveOrder = useOrderStore((s) => s.archiveOrder);
  const assignEmployee = useOrderStore((s) => s.assignEmployee);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!order) return null;

  return (
    <Dialog open={!!order} onOpenChange={() => { if (!showSuccess) onClose(); }}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <SuccessCheckmark />
              <p className={`${tokens.fontSize.subheading} text-text-primary`}>Picked up!</p>
              <p className={`${tokens.fontSize.body} text-text-muted`}>{order.clientName}</p>
            </motion.div>
          ) : (
            <motion.div key="detail" exit={{ opacity: 0, scale: 0.95 }}>
              <DialogHeader>
                <DialogTitle className="text-lg">{order.clientName}</DialogTitle>
              </DialogHeader>

              <OrderDetailContent
                order={order}
                onClose={onClose}
                onArchive={async () => {
                  if (!session) return;
                  setShowSuccess(true);
                  await archiveOrder(session.tenantId, order.id);
                  toast.success(`Order for ${order.clientName} marked as picked up`);
                  setTimeout(() => {
                    setShowSuccess(false);
                    onClose();
                  }, 1500);
                }}
                onNotify={() => {
                  toast.success(
                    `Notification sent to ${order.clientName}${order.clientPhone ? ` at ${order.clientPhone}` : ""}`
                  );
                }}
                onAssign={async (employeeId) => {
                  if (!session) return;
                  await assignEmployee(session.tenantId, order.id, employeeId);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

function OrderDetailContent({
  order,
  onArchive,
  onNotify,
  onAssign,
}: {
  order: Order;
  onClose: () => void;
  onArchive: () => void;
  onNotify: () => void;
  onAssign: (employeeId: string) => void;
}) {
  return (
    <div className="space-y-4">
      <StatusRow order={order} />

      <div className="grid grid-cols-2 gap-4">
        {order.clientPhone && <InfoField label="Phone" value={order.clientPhone} />}
        {order.frameDescription && <InfoField label="Frame" value={order.frameDescription} />}
        {order.lensType && <InfoField label="Lens Type" value={order.lensType} />}
      </div>

      <Separator />

      <div>
        <div className={`${tokens.fontSize.caption} font-medium text-text-muted mb-1.5`}>
          Assigned To
        </div>
        <EmployeeSelect value={order.assignedEmployeeId} onChange={onAssign} />
      </div>

      <Separator />
      <PrescriptionTable order={order} />
      {order.notes && <InfoField label="Notes" value={order.notes} />}

      {order.stage === "ready_for_pickup" && (
        <>
          <Separator />
          <div className="flex gap-2">
            <Button className="flex-1" variant="outline" onClick={onNotify}>
              Notify Client
            </Button>
            <Button className="flex-1" onClick={onArchive}>
              Mark as Picked Up
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function StatusRow({ order }: { order: Order }) {
  const elapsed = useElapsedTime(order.stageEnteredAt);
  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline">{ORDER_STAGE_LABELS[order.stage]}</Badge>
      <Badge variant="secondary" className={tokens.fontSize.caption}>{elapsed}</Badge>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className={`${tokens.fontSize.caption} font-medium text-text-muted`}>{label}</div>
      <div className={`${tokens.fontSize.body} mt-0.5`}>{value}</div>
    </div>
  );
}

function PrescriptionTable({ order }: { order: Order }) {
  const { prescriptionData: rx } = order;
  const hasData = rx.odSphere != null || rx.osSphere != null;
  if (!hasData) return null;

  return (
    <div>
      <div className={`${tokens.fontSize.caption} font-medium text-text-muted mb-1.5`}>Prescription</div>
      <div className={`${tokens.fontSize.caption} border ${tokens.radius.card} overflow-hidden`}>
        <table className="w-full">
          <thead>
            <tr className="bg-surface-muted">
              <th className="px-3 py-1.5 text-left font-medium text-text-muted">Eye</th>
              <th className="px-3 py-1.5 text-right font-medium text-text-muted">SPH</th>
              <th className="px-3 py-1.5 text-right font-medium text-text-muted">CYL</th>
              <th className="px-3 py-1.5 text-right font-medium text-text-muted">AXE</th>
              <th className="px-3 py-1.5 text-right font-medium text-text-muted">ADD</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-3 py-1.5 font-medium">OD</td>
              <td className="px-3 py-1.5 text-right">{rx.odSphere ?? "—"}</td>
              <td className="px-3 py-1.5 text-right">{rx.odCylinder ?? "—"}</td>
              <td className="px-3 py-1.5 text-right">{rx.odAxis ?? "—"}</td>
              <td className="px-3 py-1.5 text-right">{rx.odAdd ?? "—"}</td>
            </tr>
            <tr className="border-t">
              <td className="px-3 py-1.5 font-medium">OS</td>
              <td className="px-3 py-1.5 text-right">{rx.osSphere ?? "—"}</td>
              <td className="px-3 py-1.5 text-right">{rx.osCylinder ?? "—"}</td>
              <td className="px-3 py-1.5 text-right">{rx.osAxis ?? "—"}</td>
              <td className="px-3 py-1.5 text-right">{rx.osAdd ?? "—"}</td>
            </tr>
          </tbody>
        </table>
        {rx.pd && (
          <div className="border-t px-3 py-1.5 bg-surface-muted">
            <span className="font-medium text-text-muted">PD:</span> {rx.pd}mm
          </div>
        )}
      </div>
    </div>
  );
}

function SuccessCheckmark() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
      className="w-16 h-16 rounded-full bg-brand-bg flex items-center justify-center mb-4"
    >
      <svg className="w-8 h-8 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 13l4 4L19 7"
        />
      </svg>
    </motion.div>
  );
}
