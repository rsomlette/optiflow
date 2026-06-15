"use client";

import type { PrescriptionData } from "@/lib/types";
import { tokens } from "@/lib/theme";

interface PrescriptionPreviewProps {
  imageUrl: string;
  data: PrescriptionData | null;
  isLoading: boolean;
}

export function PrescriptionPreview({ imageUrl, data, isLoading }: PrescriptionPreviewProps) {
  return (
    <div className="space-y-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt="Prescription" className={`w-full max-h-48 object-contain ${tokens.radius.card} border`} />

      {isLoading && (
        <div className={`text-center ${tokens.fontSize.body} text-text-muted py-2`}>Processing prescription...</div>
      )}

      {data && !isLoading && (
        <div className={`${tokens.fontSize.caption} border ${tokens.radius.card} overflow-hidden`}>
          <div className="bg-status-complete-bg text-status-complete px-2 py-1 font-medium">OCR Results</div>
          <table className="w-full">
            <thead>
              <tr className="bg-surface-muted">
                <th className="px-2 py-1 text-left text-text-muted">Eye</th>
                <th className="px-2 py-1 text-right text-text-muted">SPH</th>
                <th className="px-2 py-1 text-right text-text-muted">CYL</th>
                <th className="px-2 py-1 text-right text-text-muted">AXE</th>
                <th className="px-2 py-1 text-right text-text-muted">ADD</th>
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
              <span className="text-text-muted">PD:</span> {data.pd}mm
            </div>
          )}
        </div>
      )}
    </div>
  );
}
