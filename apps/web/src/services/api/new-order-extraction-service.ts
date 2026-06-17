import type { OrderExtractionResult } from "./order-extraction-types";

export async function extractNewOrder(file: File): Promise<OrderExtractionResult> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/new", {
    method: "POST",
    body: formData,
  });

  const data: unknown = await response.json();

  if (!response.ok) {
    throw new Error(`Order extraction failed with ${response.status}: ${JSON.stringify(data)}`);
  }

  return data as OrderExtractionResult;
}
