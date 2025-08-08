import { DeepfakeDetectionLab } from "@/components/DeepfakeDetectionLab";
import { AdvancedPhishingDetection } from "@/components/AdvancedPhishingDetection";

export default function PhishingDetection() {
  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-4xl font-bold">Phishing Detection</h1>
      <AdvancedPhishingDetection />
      <DeepfakeDetectionLab />
    </div>
  );
}
