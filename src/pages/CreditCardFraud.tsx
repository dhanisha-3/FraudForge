import { CreditCardScamDetection } from "@/components/CreditCardScamDetection";

export default function CreditCardFraud() {
  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-4xl font-bold">Credit Card Fraud Detection</h1>
      <CreditCardScamDetection />
    </div>
  );
}
