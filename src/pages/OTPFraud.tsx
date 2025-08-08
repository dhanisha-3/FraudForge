import { OTPFraudDetection } from "@/components/OTPFraudDetection";
import { TransactionMonitoring } from "@/components/TransactionMonitoring";

export default function OTPFraud() {
  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-4xl font-bold">OTP Fraud Detection</h1>
      <OTPFraudDetection />
      <TransactionMonitoring />
    </div>
  );
}
