"use client";

import type { PrescriptionData } from "@/lib/types";

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
  return (
    <div className="space-y-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt="Prescription"
        className="w-full max-h-48 object-contain rounded-lg border"
      />

      {isLoading && (
        <div className="text-center text-sm text-gray-500 py-2">
          Processing prescription...
        </div>
      )}

      {data && !isLoading && (
        <div className="text-xs border rounded-lg overflow-hidden">
          <div className="bg-green-50 px-2 py-1 text-green-700 font-medium">
            OCR Results
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 py-1 text-left text-gray-500">Eye</th>
                <th className="px-2 py-1 text-right text-gray-500">SPH</th>
                <th className="px-2 py-1 text-right text-gray-500">CYL</th>
                <th className="px-2 py-1 text-right text-gray-500">AXE</th>
                <th className="px-2 py-1 text-right text-gray-500">ADD</th>
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
              <span className="text-gray-500">PD:</span> {data.pd}mm
            </div>
          )}
        </div>
      )}
    </div>
  );
}
