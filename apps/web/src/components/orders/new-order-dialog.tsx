"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { tokens } from "@/lib/theme";
import { EmployeeSelect } from "@/components/employees/employee-select";
import { PrescriptionCamera } from "./prescription-camera";
import { PrescriptionPreview } from "./prescription-preview";
import { OrderExtractionSummary } from "./order-extraction-summary";
import { useOrderStore } from "@/stores/order-store";
import { useAuthStore } from "@/stores/auth-store";
import { extractNewOrder } from "@/services/api/new-order-extraction-service";
import type { ExtractionStatus, OrderExtractionResult } from "@/services/api/order-extraction-types";
import type { EntryMode, OcrStatus } from "@/lib/types";
import { toast } from "sonner";

const EXTRACTION_PROGRESS_MS = 40_000;

interface NewOrderDialogProps {
  open: boolean;
  onClose: () => void;
}

type Step = "choose" | "camera" | "preview" | "form";

export function NewOrderDialog({ open, onClose }: NewOrderDialogProps) {
  const session = useAuthStore((s) => s.session);
  const createOrder = useOrderStore((s) => s.createOrder);

  const [step, setStep] = useState<Step>("choose");
  const [entryMode, setEntryMode] = useState<EntryMode>("auto");
  const [assignedEmployeeId, setAssignedEmployeeId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [extractionStatus, setExtractionStatus] = useState<ExtractionStatus>("idle");
  const [extractionResult, setExtractionResult] = useState<OrderExtractionResult | null>(null);
  const [extractionError, setExtractionError] = useState("");
  const [extractionProgress, setExtractionProgress] = useState(0);

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
    setExtractionStatus("idle");
    setExtractionResult(null);
    setExtractionError("");
    setExtractionProgress(0);
    setClientName("");
    setClientPhone("");
    setFrameDescription("");
    setLensType("");
    setNotes("");
  }

  function handleClose() { reset(); onClose(); }

  function handleChoose(mode: EntryMode) {
    setEntryMode(mode);
    setStep(mode === "auto" ? "camera" : "form");
  }

  useEffect(() => {
    if (extractionStatus !== "loading") return;

    const startedAt = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setExtractionProgress(Math.min(95, Math.round((elapsed / EXTRACTION_PROGRESS_MS) * 95)));
    }, 500);

    return () => clearInterval(interval);
  }, [extractionStatus]);

  function handleCapture(dataUri: string, file: File) {
    setImageUrl(dataUri);
    setStep("preview");
    setExtractionStatus("loading");
    setExtractionResult(null);
    setExtractionError("");
    setExtractionProgress(0);

    void extractNewOrder(file)
      .then((data) => {
        console.info("/new extraction response", data);
        setExtractionStatus("success");
        setExtractionResult(data);
        setExtractionProgress(100);
        applyExtractionResult(data);
      })
      .catch((error: unknown) => {
        console.error("/new extraction failed", error);
        setExtractionStatus("error");
        setExtractionError(error instanceof Error ? error.message : "Unknown extraction error");
        setExtractionProgress(100);
      });
  }

  function applyExtractionResult(result: OrderExtractionResult) {
    const firstItem = result.items[0];

    setClientName(result.client.fullName.value ?? "");
    setLensType(firstItem?.label.value ?? "");
    setFrameDescription(firstItem?.frame.value ?? "");
    setNotes([
      formatLensNote("OD correction", firstItem?.lenses.right.correction.value),
      formatLensNote("OD verre", firstItem?.lenses.right.details.value),
      formatLensNote("OG correction", firstItem?.lenses.left.correction.value),
      formatLensNote("OG verre", firstItem?.lenses.left.details.value),
    ].filter(Boolean).join("\n"));
  }

  function formatLensNote(label: string, value: string | null | undefined): string | null {
    return value ? `${label}: ${value}` : null;
  }

  async function handleSubmit() {
    if (!session || !clientName.trim() || (entryMode === "manual" && !assignedEmployeeId)) return;

    const ocrStatus: OcrStatus = entryMode === "auto" && extractionResult ? "complete" : "none";

    await createOrder(session.tenantId, {
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim() || undefined,
      prescriptionData: {},
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
            <div className="space-y-2">
              <p className={`${tokens.fontSize.body} text-text-muted`}>
                How would you like to enter the prescription?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex-col gap-1" onClick={() => handleChoose("auto")}>
                  <span className="text-lg">📸</span>
                  <span className={tokens.fontSize.body}>Auto (Photo)</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-1" onClick={() => handleChoose("manual")} disabled={!assignedEmployeeId}>
                  <span className="text-lg">✏️</span>
                  <span className={tokens.fontSize.body}>Manual Entry</span>
                </Button>
              </div>
              {!assignedEmployeeId && (
                <p className={`${tokens.fontSize.caption} text-text-muted`}>Assigned employee is only required for manual entry.</p>
              )}
            </div>

            <FormField label="Assigned Employee">
              <EmployeeSelect value={assignedEmployeeId} onChange={setAssignedEmployeeId} />
            </FormField>
          </div>
        )}

        {step === "camera" && (
          <div className="space-y-4">
            <p className={`${tokens.fontSize.body} text-text-muted`}>Take a photo of the doctor&apos;s prescription</p>
            <PrescriptionCamera onCapture={handleCapture} />
            <Button variant="ghost" onClick={() => setStep("choose")}>Back</Button>
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-4">
            <PrescriptionPreview imageUrl={imageUrl} />
            <OrderExtractionSummary status={extractionStatus} result={extractionResult} error={extractionError} progress={extractionProgress} />
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => { setImageUrl(""); setExtractionStatus("idle"); setExtractionResult(null); setExtractionError(""); setExtractionProgress(0); setStep("camera"); }}>Retake</Button>
              <Button className="flex-1" onClick={() => setStep("form")} disabled={extractionStatus === "loading" || extractionStatus === "idle"}>Continue</Button>
            </div>
          </div>
        )}

        {step === "form" && (
          <div className="space-y-4">
            <FormField label="Client Name *">
              <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Jean-Pierre Lefèvre" />
            </FormField>
            <FormField label="Phone">
              <Input value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="+33 6 12 34 56 78" type="tel" />
            </FormField>
            <FormField label="Frame">
              <Input value={frameDescription} onChange={(e) => setFrameDescription(e.target.value)} placeholder="Ray-Ban RB5154 Black" />
            </FormField>
            <FormField label="Lens Type">
              <Input value={lensType} onChange={(e) => setLensType(e.target.value)} placeholder="Progressive, Single Vision..." />
            </FormField>
            <FormField label="Notes">
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional notes..." rows={2} />
            </FormField>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep(entryMode === "auto" ? "preview" : "choose")}>Back</Button>
              <Button className="flex-1" onClick={handleSubmit} disabled={!clientName.trim() || (entryMode === "manual" && !assignedEmployeeId)}>Create Order</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={`block ${tokens.fontSize.label} text-text-secondary mb-1`}>{label}</label>
      {children}
    </div>
  );
}
