import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import jsPDF from 'jspdf';
import { FileText, Download } from 'lucide-react';

export default function FIRWizard() {
  const [form, setForm] = useState({
    reporterName: '',
    contact: '',
    incidentDate: '',
    channel: 'upi',
    amount: '',
    description: '',
    artifacts: ''
  });
  const [risk, setRisk] = useState(48);

  const onChange = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const generatePdf = () => {
    const doc = new jsPDF();
    let y = 18;
    doc.setFontSize(16);
    doc.text('FraudGuard AI - Incident Report (FIR)', 14, y); y += 8;
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, y); y += 8;

    const rows = [
      ['Reporter', form.reporterName],
      ['Contact', form.contact],
      ['Incident Date', form.incidentDate],
      ['Channel', form.channel.toUpperCase()],
      ['Amount', form.amount ? `₹${form.amount}` : '—'],
      ['Risk Score', `${risk}%`],
    ];
    rows.forEach(([k, v]) => { doc.text(`${k}: ${v}`, 14, y); y += 6; });

    y += 4; doc.text('Description:', 14, y); y += 6;
    doc.text(doc.splitTextToSize(form.description || '—', 180), 14, y); y += 20;

    doc.text('Artifacts/Evidence:', 14, y); y += 6;
    doc.text(doc.splitTextToSize(form.artifacts || '—', 180), 14, y);

    doc.save(`fraudguard_fir_${Date.now()}.pdf`);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center"><FileText className="w-6 h-6 mr-2"/>FIR Wizard</h1>
        <Badge variant="outline">Draft</Badge>
      </div>

      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Reporter Name</label>
            <Input value={form.reporterName} onChange={e => onChange('reporterName', e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Contact (phone/email)</label>
            <Input value={form.contact} onChange={e => onChange('contact', e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Incident Date</label>
            <Input type="date" value={form.incidentDate} onChange={e => onChange('incidentDate', e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Channel</label>
            <select className="w-full border rounded px-3 py-2 bg-background" value={form.channel} onChange={e => onChange('channel', e.target.value)}>
              <option value="upi">UPI</option>
              <option value="card_present">Card Present</option>
              <option value="card_not_present">Card Not Present</option>
              <option value="online">Online Payment</option>
              <option value="atm">ATM</option>
            </select>
          </div>
          <div>
            <label className="text-sm">Amount (₹)</label>
            <Input type="number" value={form.amount} onChange={e => onChange('amount', e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Risk Score</label>
            <Input type="number" value={risk} onChange={e => setRisk(Number(e.target.value))} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm">Description</label>
            <Textarea value={form.description} onChange={e => onChange('description', e.target.value)} rows={5} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm">Artifacts / Evidence (links, notes)</label>
            <Textarea value={form.artifacts} onChange={e => onChange('artifacts', e.target.value)} rows={4} />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline">Save Draft</Button>
          <Button onClick={generatePdf}><Download className="w-4 h-4 mr-2"/>Download PDF</Button>
        </div>
      </Card>
    </div>
  );
}

