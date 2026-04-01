"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  const employees = useEmployeeStore((s) => s.employees);
  const archiveOrder = useOrderStore((s) => s.archiveOrder);
  const assignEmployee = useOrderStore((s) => s.assignEmployee);

  if (!order) return null;

  const assignee = employees.find((e) => e.id === order.assignedEmployeeId);

  async function handleArchive() {
    if (!session || !order) return;
    await archiveOrder(session.tenantId, order.id);
    toast.success(`Order for ${order.clientName} marked as picked up`);
    onClose();
  }

  function handleNotifyClient() {
    if (!order) return;
    toast.success(
      `Notification sent to ${order.clientName}${order.clientPhone ? ` at ${order.clientPhone}` : ""}`
    );
  }

  async function handleAssignEmployee(employeeId: string) {
    if (!session || !order) return;
    await assignEmployee(session.tenantId, order.id, employeeId);
  }

  return (
    <Sheet open={!!order} onOpenChange={() => onClose()}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{order.clientName}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{ORDER_STAGE_LABELS[order.stage]}</Badge>
            <ElapsedBadge stageEnteredAt={order.stageEnteredAt} />
          </div>

          {order.clientPhone && (
            <div>
              <div className="text-xs text-gray-500">Phone</div>
              <div className="text-sm">{order.clientPhone}</div>
            </div>
          )}

          <Separator />

          <div>
            <div className="text-xs text-gray-500 mb-1">Assigned To</div>
            <EmployeeSelect
              value={order.assignedEmployeeId}
              onChange={handleAssignEmployee}
            />
          </div>

          <Separator />

          <div>
            <div className="text-xs text-gray-500 mb-2">Prescription</div>
            <PrescriptionTable order={order} />
          </div>

          {order.frameDescription && (
            <div>
              <div className="text-xs text-gray-500">Frame</div>
              <div className="text-sm">{order.frameDescription}</div>
            </div>
          )}

          {order.lensType && (
            <div>
              <div className="text-xs text-gray-500">Lens Type</div>
              <div className="text-sm">{order.lensType}</div>
            </div>
          )}

          {order.notes && (
            <div>
              <div className="text-xs text-gray-500">Notes</div>
              <div className="text-sm">{order.notes}</div>
            </div>
          )}

          {order.stage === "ready_for_pickup" && (
            <>
              <Separator />
              <div className="space-y-2">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleNotifyClient}
                >
                  Notify Client
                </Button>
                <Button className="w-full" onClick={handleArchive}>
                  Mark as Picked Up
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ElapsedBadge({ stageEnteredAt }: { stageEnteredAt: string }) {
  const elapsed = useElapsedTime(stageEnteredAt);
  return (
    <Badge variant="secondary" className="text-xs">
      {elapsed}
    </Badge>
  );
}

function PrescriptionTable({ order }: { order: Order }) {
  const { prescriptionData: rx } = order;
  return (
    <div className="text-xs border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-2 py-1 text-left font-medium text-gray-500">Eye</th>
            <th className="px-2 py-1 text-right font-medium text-gray-500">SPH</th>
            <th className="px-2 py-1 text-right font-medium text-gray-500">CYL</th>
            <th className="px-2 py-1 text-right font-medium text-gray-500">AXE</th>
            <th className="px-2 py-1 text-right font-medium text-gray-500">ADD</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="px-2 py-1 font-medium">OD</td>
            <td className="px-2 py-1 text-right">{rx.odSphere ?? "—"}</td>
            <td className="px-2 py-1 text-right">{rx.odCylinder ?? "—"}</td>
            <td className="px-2 py-1 text-right">{rx.odAxis ?? "—"}</td>
            <td className="px-2 py-1 text-right">{rx.odAdd ?? "—"}</td>
          </tr>
          <tr className="border-t">
            <td className="px-2 py-1 font-medium">OS</td>
            <td className="px-2 py-1 text-right">{rx.osSphere ?? "—"}</td>
            <td className="px-2 py-1 text-right">{rx.osCylinder ?? "—"}</td>
            <td className="px-2 py-1 text-right">{rx.osAxis ?? "—"}</td>
            <td className="px-2 py-1 text-right">{rx.osAdd ?? "—"}</td>
          </tr>
        </tbody>
      </table>
      {rx.pd && (
        <div className="border-t px-2 py-1 bg-gray-50">
          <span className="font-medium text-gray-500">PD:</span> {rx.pd}mm
        </div>
      )}
    </div>
  );
}
