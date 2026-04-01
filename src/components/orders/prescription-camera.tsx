"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface PrescriptionCameraProps {
  onCapture: (dataUri: string) => void;
}

export function PrescriptionCamera({ onCapture }: PrescriptionCameraProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onCapture(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        className="w-full h-32 border-dashed border-2"
        onClick={() => fileInputRef.current?.click()}
      >
        <span className="text-gray-500">
          Tap to take a photo or upload an image
        </span>
      </Button>
    </div>
  );
}
