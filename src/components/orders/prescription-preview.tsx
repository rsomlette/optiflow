"use client";

import type { PrescriptionData } from "@/lib/types";
import { useTheme } from "@/stores/theme-store";

interface PrescriptionPreviewProps {
  imageUrl: string;
  data: PrescriptionData | null;
  isLoading: boolean;
}

export function PrescriptionPreview({
  imageUrl,
  data,
  isLoading,
}: PrescriptionPreviewProps) {
  const t = useTheme();

  return (
    <div className="space-y-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt="Prescription"
        className={`w-full max-h-48 object-contain ${t.radius.card} border`}
      />

      {isLoading && (
        <div className={`text-center ${t.fontSize.body} ${t.text.muted} py-2`}>
          Processing prescription...
        </div>
      )}

      {data && !isLoading && (
        <div className={`${t.fontSize.caption} border ${t.radius.card} overflow-hidden`}>
          <div className={`${t.status.ocrComplete} px-2 py-1 font-medium`}>
            OCR Results
          </div>
          <table className="w-full">
            <thead>
              <tr className={t.surfaceMuted}>
                <th className={`px-2 py-1 text-left ${t.text.muted}`}>Eye</th>
                <th className={`px-2 py-1 text-right ${t.text.muted}`}>SPH</th>
                <th className={`px-2 py-1 text-right ${t.text.muted}`}>CYL</th>
                <th className={`px-2 py-1 text-right ${t.text.muted}`}>AXE</th>
                <th className={`px-2 py-1 text-right ${t.text.muted}`}>ADD</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-2 py-1 font-medium">OD</td>
                <td className="px-2 py-1 text-right">{data.odSphere ?? "—"}</td>
                <td className="px-2 py-1 text-right">{data.odCylinder ?? "—"}</td>
                <td className="px-2 py-1 text-right">{data.odAxis ?? "—"}</td>
                <td className="px-2 py-1 text-right">{data.odAdd ?? "—"}</td>
              </tr>
              <tr className="border-t">
                <td className="px-2 py-1 font-medium">OS</td>
                <td className="px-2 py-1 text-right">{data.osSphere ?? "—"}</td>
                <td className="px-2 py-1 text-right">{data.osCylinder ?? "—"}</td>
                <td className="px-2 py-1 text-right">{data.osAxis ?? "—"}</td>
                <td className="px-2 py-1 text-right">{data.osAdd ?? "—"}</td>
              </tr>
            </tbody>
          </table>
          {data.pd && (
            <div className="border-t px-2 py-1">
              <span className={t.text.muted}>PD:</span> {data.pd}mm
            </div>
          )}
        </div>
      )}
    </div>
  );
}
