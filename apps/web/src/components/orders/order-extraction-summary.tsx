"use client";

import { tokens } from "@/lib/theme";
import type { BarcodeExtraction, ExtractionStatus, LensExtraction, OrderExtractionResult } from "@/services/api/order-extraction-types";

interface OrderExtractionSummaryProps {
  status: ExtractionStatus;
  result: OrderExtractionResult | null;
  error: string;
  progress: number;
}

const BARCODE_KEYS = ["reception", "centrage", "montage", "verification"] as const;

export function OrderExtractionSummary({ status, result, error, progress }: OrderExtractionSummaryProps) {
  if (status === "idle") return null;

  return (
    <section className={`${tokens.radius.card} border bg-surface p-3 ${tokens.fontSize.body}`}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h3 className="font-semibold text-text-primary">Extraction API</h3>
          <p className={`${tokens.fontSize.caption} text-text-muted`}>{statusLabel(status)}</p>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass(status)}`}>{status}</span>
      </div>

      {status === "loading" && (
        <div className="space-y-2 text-text-muted">
          <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
            <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className={tokens.fontSize.caption}>Le modele analyse la photo. Cela peut prendre environ 20-40 secondes en local.</p>
        </div>
      )}

      {status === "error" && <div className="rounded-md bg-destructive/10 p-2 text-sm text-destructive">{error}</div>}

      {status === "success" && result && <ExtractionResult result={result} />}
    </section>
  );
}

function ExtractionResult({ result }: { result: OrderExtractionResult }) {
  const reviewItems = reviewMessages(result);

  return (
    <div className="space-y-3">
      {reviewItems.length > 0 && (
        <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 p-2 text-xs text-yellow-800 dark:text-yellow-200">
          <div className="font-medium">A verifier</div>
          <ul className="mt-1 list-inside list-disc space-y-0.5">
            {reviewItems.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Fact label="Client" value={result.client.fullName.value} confidence={result.client.fullName.confidence} />
        <Fact label="Conseiller" value={result.order.advisor.value} confidence={result.order.advisor.confidence} />
        <Fact label="Date" value={result.order.deliveryDate.rawValue ?? result.order.deliveryDate.value} confidence={result.order.deliveryDate.confidence} />
        <Fact label="Statut date" value={result.order.deliveryDate.status} />
      </div>

      <div>
        <h4 className="mb-2 font-medium text-text-secondary">Paires / lignes detectees</h4>
        <div className="space-y-2">
          {result.items.length === 0 ? (
            <p className={`${tokens.fontSize.caption} text-text-muted`}>Aucune paire detectee.</p>
          ) : (
            result.items.map((item, index) => (
              <div key={`${item.label.value ?? "item"}-${index}`} className="rounded-md border bg-surface-muted p-2">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="font-medium text-text-primary">{item.label.value ?? `Ligne ${index + 1}`}</span>
                  <ConfidencePill confidence={item.label.confidence} />
                </div>
                <LensSpec right={item.lenses.right} left={item.lenses.left} />
                <ComponentBlock label="Monture" value={cleanComponentValue(item.frame.value)} />
                <CompactLine label="Notes" value={item.notes.value} />
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-text-secondary">Codes-barres</h4>
        <div className="grid grid-cols-2 gap-2">
          {BARCODE_KEYS.map((key) => <BarcodeCard key={key} barcode={result.barcodes[key]} />)}
        </div>
      </div>
    </div>
  );
}

function Fact({ label, value, confidence }: { label: string; value: string | null; confidence?: string }) {
  return (
    <div className="rounded-md bg-surface-muted p-2">
      <div className={`${tokens.fontSize.caption} text-text-muted`}>{label}</div>
      <div className="mt-0.5 break-words font-medium text-text-primary">{value ?? "Non lu"}</div>
      {confidence && <ConfidencePill confidence={confidence} />}
    </div>
  );
}

function BarcodeCard({ barcode }: { barcode: BarcodeExtraction }) {
  const value = barcode.digits ? `${barcode.digits}${barcode.suffix ?? ""}` : barcode.rawText;

  return (
    <div className="rounded-md border bg-surface-muted p-2">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-text-primary">{barcode.label}</span>
        <ConfidencePill confidence={barcode.confidence} />
      </div>
      <div className={`${tokens.fontSize.caption} mt-1 break-words text-text-muted`}>{value ?? "Non lu"}</div>
    </div>
  );
}

function LensSpec({ right, left }: { right: LensExtraction; left: LensExtraction }) {
  const hasRight = right.correction.value || right.details.value;
  const hasLeft = left.correction.value || left.details.value;

  if (!hasRight && !hasLeft) return null;

  return (
    <div className="mt-2 space-y-1">
      <EyeLensBlock label="VER OD" lens={right} />
      <EyeLensBlock label="VER OG" lens={left} />
    </div>
  );
}

function EyeLensBlock({ label, lens }: { label: string; lens: LensExtraction }) {
  if (!lens.correction.value && !lens.details.value) return null;

  return (
    <div className="rounded border border-border/70 bg-surface px-2 py-1">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">{label}</div>
      <CompactLine label="Correction" value={lens.correction.value} />
      <CompactLine label="Verre" value={lens.details.value} />
    </div>
  );
}

function ComponentBlock({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;

  return (
    <div className="rounded border border-border/70 bg-surface px-2 py-1">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">{label}</div>
      <div className={`${tokens.fontSize.caption} whitespace-pre-wrap text-text-secondary`}>{value}</div>
    </div>
  );
}

function CompactLine({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;

  return <div className={`${tokens.fontSize.caption} text-text-muted`}><span className="text-text-secondary">{label}:</span> {value}</div>;
}

function ConfidencePill({ confidence }: { confidence: string }) {
  return <span className={`mt-1 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium ${confidenceClass(confidence)}`}>{confidence}</span>;
}

function statusLabel(status: ExtractionStatus): string {
  if (status === "loading") return "Analyse de la commande en cours";
  if (status === "success") return "Reponse recue depuis /api/new";
  if (status === "error") return "La requete a echoue";
  return "En attente";
}

function statusClass(status: ExtractionStatus): string {
  if (status === "success") return "bg-status-complete-bg text-status-complete";
  if (status === "error") return "bg-destructive/10 text-destructive";
  return "bg-primary/10 text-primary";
}

function confidenceClass(confidence: string): string {
  if (confidence === "high") return "bg-status-complete-bg text-status-complete";
  if (confidence === "medium") return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300";
  return "bg-destructive/10 text-destructive";
}

function cleanComponentValue(value: string | null): string | null {
  if (!value) return null;

  return value.replace(/^\s*MON\s*(?::|-)?\s*/i, "").trim();
}


function reviewMessages(result: OrderExtractionResult): string[] {
  const messages: string[] = [];

  if (!result.order.advisor.value || result.order.advisor.confidence === "low") {
    messages.push("Conseiller non lu ou incertain");
  }

  if (result.order.deliveryDate.status === "unknown" || result.order.deliveryDate.confidence === "low") {
    messages.push("Date a confirmer");
  }

  for (const warning of result.warnings) {
    messages.push(warning);
  }

  return [...new Set(messages)];
}
