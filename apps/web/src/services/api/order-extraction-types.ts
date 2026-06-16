export type ExtractionStatus = "idle" | "loading" | "success" | "error";
export type Confidence = "high" | "medium" | "low";

export interface ExtractedField<T> {
  value: T | null;
  confidence: Confidence;
}

export interface ExtractedDateField extends ExtractedField<string> {
  rawValue: string | null;
  status: "estimated" | "confirmed" | "unknown";
}

export interface OrderExtractionItem {
  label: ExtractedField<string>;
  lenses: {
    right: LensExtraction;
    left: LensExtraction;
  };
  frame: ExtractedField<string>;
  notes: ExtractedField<string>;
}

export interface LensExtraction {
  correction: ExtractedField<string>;
  details: ExtractedField<string>;
}

export interface BarcodeExtraction {
  label: string;
  rawText: string | null;
  digits: string | null;
  suffix: string | null;
  confidence: Confidence;
}

export interface OrderExtractionResult {
  client: {
    fullName: ExtractedField<string>;
  };
  order: {
    deliveryDate: ExtractedDateField;
    advisor: ExtractedField<string>;
  };
  items: OrderExtractionItem[];
  barcodes: {
    reception: BarcodeExtraction;
    centrage: BarcodeExtraction;
    montage: BarcodeExtraction;
    verification: BarcodeExtraction;
  };
  warnings: string[];
}
