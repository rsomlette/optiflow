"use client";

import { tokens } from "@/lib/theme";

interface PrescriptionPreviewProps {
  imageUrl: string;
}

export function PrescriptionPreview({ imageUrl }: PrescriptionPreviewProps) {
  return (
    <div className="space-y-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt="Prescription" className={`w-full max-h-48 object-contain ${tokens.radius.card} border`} />
    </div>
  );
}
