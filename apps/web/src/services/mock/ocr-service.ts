import type { PrescriptionData } from "@/lib/types";
import type { OcrService } from "../types";

export class MockOcrService implements OcrService {
  async parsePrescriptionImage(
    _imageDataUri: string
  ): Promise<PrescriptionData> {
    // Simulate OCR processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      odSphere: -2.25,
      odCylinder: -0.75,
      odAxis: 180,
      odAdd: 1.5,
      osSphere: -2.5,
      osCylinder: -0.5,
      osAxis: 175,
      osAdd: 1.5,
      pd: 63,
      rawText:
        "OD: SPH -2.25 CYL -0.75 AXE 180 ADD 1.50\nOS: SPH -2.50 CYL -0.50 AXE 175 ADD 1.50\nEP: 63",
    };
  }
}
