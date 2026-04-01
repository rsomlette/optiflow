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
import { useEmployeeStore } from "@/stores/employee-store";
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
        <div className="text-xs font-medium text-gray-500 mb-1.5">
          Assigned To
        </div>
        <EmployeeSelect
          value={order.assignedEmployeeId}
          onChange={onAssign}
        />
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
  return (
    <div>
      <div className="text-xs font-medium text-gray-500">{label}</div>
      <div className="text-sm mt-0.5">{value}</div>
    </div>
  );
}

function PrescriptionTable({ order }: { order: Order }) {
  const { prescriptionData: rx } = order;
  const hasData =
    rx.odSphere != null ||
    rx.osSphere != null ||
    rx.odCylinder != null ||
    rx.osCylinder != null;

  if (!hasData) return null;

  return (
    <div>
      <div className="text-xs font-medium text-gray-500 mb-1.5">
        Prescription
      </div>
      <div className="text-xs border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 py-1.5 text-left font-medium text-gray-500">
                Eye
              </th>
              <th className="px-3 py-1.5 text-right font-medium text-gray-500">
                SPH
              </th>
              <th className="px-3 py-1.5 text-right font-medium text-gray-500">
                CYL
              </th>
              <th className="px-3 py-1.5 text-right font-medium text-gray-500">
                AXE
              </th>
              <th className="px-3 py-1.5 text-right font-medium text-gray-500">
                ADD
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-3 py-1.5 font-medium">OD</td>
              <td className="px-3 py-1.5 text-right">
                {rx.odSphere ?? "—"}
              </td>
              <td className="px-3 py-1.5 text-right">
                {rx.odCylinder ?? "—"}
              </td>
              <td className="px-3 py-1.5 text-right">{rx.odAxis ?? "—"}</td>
              <td className="px-3 py-1.5 text-right">{rx.odAdd ?? "—"}</td>
            </tr>
            <tr className="border-t">
              <td className="px-3 py-1.5 font-medium">OS</td>
              <td className="px-3 py-1.5 text-right">
                {rx.osSphere ?? "—"}
              </td>
              <td className="px-3 py-1.5 text-right">
                {rx.osCylinder ?? "—"}
              </td>
              <td className="px-3 py-1.5 text-right">{rx.osAxis ?? "—"}</td>
              <td className="px-3 py-1.5 text-right">{rx.osAdd ?? "—"}</td>
            </tr>
          </tbody>
        </table>
        {rx.pd && (
          <div className="border-t px-3 py-1.5 bg-gray-50">
            <span className="font-medium text-gray-500">PD:</span> {rx.pd}mm
          </div>
        )}
      </div>
    </div>
  );
}
