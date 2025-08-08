import React from 'react';
import { DefenseMatrix } from '@/components/DefenseMatrix';

export default function DefenseMatrixPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Defense Matrix</h2>
        <p className="text-muted-foreground">
          Multi-layered security system status and performance metrics
        </p>
      </div>
      <DefenseMatrix />
    </div>
  );
}
