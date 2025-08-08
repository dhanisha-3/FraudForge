import { AISpamDetection as AISpamDetectionComponent } from "@/components/AISpamDetection";
import { MLModelShowcase } from "@/components/MLModelShowcase";

export default function AISpamDetection() {
  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-4xl font-bold">AI Spam Detection</h1>
      <AISpamDetectionComponent />
      <MLModelShowcase />
    </div>
  );
}
