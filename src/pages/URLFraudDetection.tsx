import { URLFraudDetection as URLFraudDetectionComponent } from "@/components/URLFraudDetection";
import { SafeZonePortal } from "@/components/SafeZonePortal";

export default function URLFraudDetection() {
  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-4xl font-bold">URL Fraud Detection</h1>
      <URLFraudDetectionComponent />
      <SafeZonePortal />
    </div>
  );
}
