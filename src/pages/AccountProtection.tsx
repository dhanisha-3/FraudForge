import { AdvancedAnalyticsDashboard } from "@/components/AdvancedAnalyticsDashboard";
import { UnifiedAccountProtection } from "@/components/UnifiedAccountProtection";

export default function AccountProtection() {
  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-4xl font-bold">Account Protection</h1>
      <UnifiedAccountProtection />
      <AdvancedAnalyticsDashboard />
    </div>
  );
}
