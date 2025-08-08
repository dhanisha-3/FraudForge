import { DefenseMatrix } from "@/components/DefenseMatrix";
import { LiveDemo } from "@/components/LiveDemo";

export default function Security() {
  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-4xl font-bold">Security Defense Matrix</h1>
      <DefenseMatrix />
      <LiveDemo />
    </div>
  );
}
