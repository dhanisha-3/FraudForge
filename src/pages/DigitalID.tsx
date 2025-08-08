import { DigitalIDManagement } from "@/components/DigitalIDManagement";
import { DecentralizedIdentityKYC } from "@/components/DecentralizedIdentityKYC";
import { BehavioralBiometrics } from "@/components/BehavioralBiometrics";

export default function DigitalID() {
  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-4xl font-bold">Digital Identity Management</h1>
      <DigitalIDManagement />
      <DecentralizedIdentityKYC />
      <BehavioralBiometrics />
    </div>
  );
}
