import React from 'react';
import { QRCodeSecurityAnalyzer } from '@/components/QRCodeSecurityAnalyzer';

export default function QRCodeSecurity() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">QR Code Security</h2>
        <p className="text-muted-foreground">
          AI-powered QR code analysis and threat detection
        </p>
      </div>
      <QRCodeSecurityAnalyzer />
    </div>
  );
}
