import { FraudEducationCenter } from "@/components/FraudEducationCenter";
import { AIExplanationEngine } from "@/components/AIExplanationEngine";

export default function FraudEducation() {
  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-4xl font-bold">Fraud Education Center</h1>
      <FraudEducationCenter />
      <AIExplanationEngine />
    </div>
  );
}
