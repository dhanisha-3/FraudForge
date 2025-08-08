import { ThreatIntelligenceFusion } from "@/components/ThreatIntelligenceFusion";
import { ContinuousLearningSystem } from "@/components/ContinuousLearningSystem";

export default function ThreatIntelligence() {
  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-4xl font-bold">Threat Intelligence</h1>
      <ThreatIntelligenceFusion />
      <ContinuousLearningSystem />
    </div>
  );
}
