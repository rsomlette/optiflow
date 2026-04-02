"use client";

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
import { useElapsedTime } from "@/hooks/use-elapsed-time";
import { useOrderStore } from "@/stores/order-store";
import { useAuthStore } from "@/stores/auth-store";
import { useTheme } from "@/stores/theme-store";
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

  if (!order) return null;

  return (
    <Dialog open={!!order} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{order.clientName}</DialogTitle>
        </DialogHeader>

        <OrderDetailContent
          order={order}
          onClose={onClose}
          onArchive={async () => {
            if (!session) return;
            await archiveOrder(session.tenantId, order.id);
            toast.success(`Order for ${order.clientName} marked as picked up`);
            onClose();
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
  const t = useTheme();

  return (
    <div className="space-y-4">
      <StatusRow order={order} />

      <div className="grid grid-cols-2 gap-4">
        {order.clientPhone && (
          <InfoField label="Phone" value={order.clientPhone} />
        )}
        {order.frameDescription && (
          <InfoField label="Frame" value={order.frameDescription} />
        )}
        {order.lensType && (
          <InfoField label="Lens Type" value={order.lensType} />
        )}
      </div>

      <Separator />

      <div>
        <div className={`${t.fontSize.caption} font-medium ${t.text.muted} mb-1.5`}>
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
      <Badge variant="secondary" className="text-xs">
        {elapsed}
      </Badge>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  const t = useTheme();

  return (
    <div>
      <div className={`${t.fontSize.caption} font-medium ${t.text.muted}`}>{label}</div>
      <div className={`${t.fontSize.body} mt-0.5`}>{value}</div>
    </div>
  );
}

function PrescriptionTable({ order }: { order: Order }) {
  const t = useTheme();
  const { prescriptionData: rx } = order;
  const hasData =
    rx.odSphere != null ||
    rx.osSphere != null ||
    rx.odCylinder != null ||
    rx.osCylinder != null;

  if (!hasData) return null;

  return (
    <div>
      <div className={`${t.fontSize.caption} font-medium ${t.text.muted} mb-1.5`}>
        Prescription
      </div>
      <div className={`${t.fontSize.caption} border ${t.radius.card} overflow-hidden`}>
        <table className="w-full">
          <thead>
            <tr className={t.surfaceMuted}>
              <th className={`px-3 py-1.5 text-left font-medium ${t.text.muted}`}>Eye</th>
              <th className={`px-3 py-1.5 text-right font-medium ${t.text.muted}`}>SPH</th>
              <th className={`px-3 py-1.5 text-right font-medium ${t.text.muted}`}>CYL</th>
              <th className={`px-3 py-1.5 text-right font-medium ${t.text.muted}`}>AXE</th>
              <th className={`px-3 py-1.5 text-right font-medium ${t.text.muted}`}>ADD</th>
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
          <div className={`border-t px-3 py-1.5 ${t.surfaceMuted}`}>
            <span className={`font-medium ${t.text.muted}`}>PD:</span> {rx.pd}mm
          </div>
        )}
      </div>
    </div>
  );
}
