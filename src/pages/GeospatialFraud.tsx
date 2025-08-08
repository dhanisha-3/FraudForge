import { GeospatialFraudDetection } from "@/components/GeospatialFraudDetection";
import { FraudNetworkVisualization } from "@/components/FraudNetworkVisualization";

export default function GeospatialFraud() {
  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-4xl font-bold">Geospatial Fraud Detection</h1>
      <GeospatialFraudDetection />
      <FraudNetworkVisualization />
    </div>
  );
}
