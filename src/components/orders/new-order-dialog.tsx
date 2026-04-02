"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmployeeSelect } from "@/components/employees/employee-select";
import { PrescriptionCamera } from "./prescription-camera";
import { PrescriptionPreview } from "./prescription-preview";
import { useOrderStore } from "@/stores/order-store";
import { useAuthStore } from "@/stores/auth-store";
import { useTheme } from "@/stores/theme-store";
import { OcrServiceImpl } from "@/services";
import type { PrescriptionData, EntryMode, OcrStatus } from "@/lib/types";
import { toast } from "sonner";

const ocrService = new OcrServiceImpl();

interface NewOrderDialogProps {
  open: boolean;
  onClose: () => void;
}

type Step = "choose" | "camera" | "preview" | "form";

export function NewOrderDialog({ open, onClose }: NewOrderDialogProps) {
  const t = useTheme();
  const session = useAuthStore((s) => s.session);
  const createOrder = useOrderStore((s) => s.createOrder);

  const [step, setStep] = useState<Step>("choose");
  const [entryMode, setEntryMode] = useState<EntryMode>("auto");
  const [assignedEmployeeId, setAssignedEmployeeId] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [ocrData, setOcrData] = useState<PrescriptionData | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [frameDescription, setFrameDescription] = useState("");
  const [lensType, setLensType] = useState("");
  const [notes, setNotes] = useState("");

  function reset() {
    setStep("choose");
    setEntryMode("auto");
    setAssignedEmployeeId("");
    setImageUrl("");
    setOcrData(null);
    setOcrLoading(false);
    setClientName("");
    setClientPhone("");
    setFrameDescription("");
    setLensType("");
    setNotes("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleChoose(mode: EntryMode) {
    setEntryMode(mode);
    setStep(mode === "auto" ? "camera" : "form");
  }

  async function handleCapture(dataUri: string) {
    setImageUrl(dataUri);
    setStep("preview");
    setOcrLoading(true);
    try {
      const data = await ocrService.parsePrescriptionImage(dataUri);
      setOcrData(data);
    } finally {
      setOcrLoading(false);
    }
  }

  async function handleSubmit() {
    if (!session || !clientName.trim() || !assignedEmployeeId) return;

    let ocrStatus: OcrStatus = "none";
    if (entryMode === "auto") {
      ocrStatus = ocrData ? "complete" : "pending";
    }

    await createOrder(session.tenantId, {
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim() || undefined,
      prescriptionData: ocrData ?? {},
      prescriptionImageUrl: imageUrl || undefined,
      frameDescription: frameDescription.trim() || undefined,
      lensType: lensType.trim() || undefined,
      assignedEmployeeId,
      notes: notes.trim() || undefined,
      entryMode,
      ocrStatus,
    });

    toast.success(`Order created for ${clientName}`);
    handleClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Order</DialogTitle>
        </DialogHeader>

        {step === "choose" && (
          <div className="space-y-4">
            <div>
              <label className={`block ${t.fontSize.label} ${t.text.secondary} mb-1`}>
                Assigned Employee
              </label>
              <EmployeeSelect
                value={assignedEmployeeId}
                onChange={setAssignedEmployeeId}
              />
            </div>

            {assignedEmployeeId && (
              <div className="space-y-2">
                <p className={`${t.fontSize.body} ${t.text.muted}`}>
                  How would you like to enter the prescription?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-1"
                    onClick={() => handleChoose("auto")}
                  >
                    <span className="text-lg">📸</span>
                    <span className={t.fontSize.body}>Auto (Photo)</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-1"
                    onClick={() => handleChoose("manual")}
                  >
                    <span className="text-lg">✏️</span>
                    <span className={t.fontSize.body}>Manual Entry</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === "camera" && (
          <div className="space-y-4">
            <p className={`${t.fontSize.body} ${t.text.muted}`}>
              Take a photo of the doctor&apos;s prescription
            </p>
            <PrescriptionCamera onCapture={handleCapture} />
            <Button variant="ghost" onClick={() => setStep("choose")}>
              Back
            </Button>
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-4">
            <PrescriptionPreview
              imageUrl={imageUrl}
              data={ocrData}
              isLoading={ocrLoading}
            />
            {!ocrLoading && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setImageUrl("");
                    setOcrData(null);
                    setStep("camera");
                  }}
                >
                  Retake
                </Button>
                <Button className="flex-1" onClick={() => setStep("form")}>
                  Continue
                </Button>
              </div>
            )}
          </div>
        )}

        {step === "form" && (
          <div className="space-y-4">
            <FormField label="Client Name *">
              <Input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Jean-Pierre Lefèvre"
              />
            </FormField>

            <FormField label="Phone">
              <Input
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+33 6 12 34 56 78"
                type="tel"
              />
            </FormField>

            <FormField label="Frame">
              <Input
                value={frameDescription}
                onChange={(e) => setFrameDescription(e.target.value)}
                placeholder="Ray-Ban RB5154 Black"
              />
            </FormField>

            <FormField label="Lens Type">
              <Input
                value={lensType}
                onChange={(e) => setLensType(e.target.value)}
                placeholder="Progressive, Single Vision..."
              />
            </FormField>

            <FormField label="Notes">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes..."
                rows={2}
              />
            </FormField>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() =>
                  setStep(entryMode === "auto" ? "preview" : "choose")
                }
              >
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={!clientName.trim() || !assignedEmployeeId}
              >
                Create Order
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const t = useTheme();
  return (
    <div>
      <label className={`block ${t.fontSize.label} ${t.text.secondary} mb-1`}>
        {label}
      </label>
      {children}
    </div>
  );
}
