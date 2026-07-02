'use client';

import { ProposalData } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { LineItemsEditor } from './line-items-editor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProposalBuilderSidebarProps {
  proposal: ProposalData;
  onUpdate: (updates: Partial<ProposalData>) => void;
  onUpdateLineItem: (id: string, updates: any) => void;
  onAddLineItem: (type?: 'product' | 'service' | 'function') => void;
  onRemoveLineItem: (id: string) => void;
}

export function ProposalBuilderSidebar({
  proposal,
  onUpdate,
  onUpdateLineItem,
  onAddLineItem,
  onRemoveLineItem,
}: ProposalBuilderSidebarProps) {
  return (
    <div className="space-y-6 max-h-screen overflow-y-auto pr-4">
      {/* Company Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase">Company</h3>
        <div className="space-y-2">
          <Input
            placeholder="Company name"
            value={proposal.companyName}
            onChange={(e) => onUpdate({ companyName: e.target.value })}
            className="text-sm"
          />
          <Input
            placeholder="Email"
            type="email"
            value={proposal.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            className="text-sm"
          />
          <Input
            placeholder="Phone"
            value={proposal.phone}
            onChange={(e) => onUpdate({ phone: e.target.value })}
            className="text-sm"
          />
        </div>
      </div>

      {/* Client Section */}
      <div className="space-y-3 border-t border-slate-200 pt-6">
        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase">Client</h3>
        <Input
          placeholder="Client name"
          value={proposal.clientName}
          onChange={(e) => onUpdate({ clientName: e.target.value })}
          className="text-sm"
        />
      </div>

      {/* Proposal Details Section */}
      <div className="space-y-3 border-t border-slate-200 pt-6">
        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase">Details</h3>
        <div className="space-y-2">
          <Input
            placeholder="Proposal #"
            value={proposal.proposalNumber}
            onChange={(e) => onUpdate({ proposalNumber: e.target.value })}
            className="text-sm"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-[var(--color-text-muted)]">Date</label>
              <Input
                type="date"
                value={proposal.date}
                onChange={(e) => onUpdate({ date: e.target.value })}
                className="text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--color-text-muted)]">Due Date</label>
              <Input
                type="date"
                value={proposal.dueDate}
                onChange={(e) => onUpdate({ dueDate: e.target.value })}
                className="text-sm"
              />
            </div>
          </div>
          <Textarea
            placeholder="Proposal description"
            value={proposal.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="text-sm resize-none h-20"
          />
        </div>
      </div>

      {/* Line Items Section */}
      <div className="space-y-3 border-t border-slate-200 pt-6">
        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase">Items</h3>
        <LineItemsEditor
          items={proposal.lineItems}
          currency={proposal.currency}
          onUpdateItem={onUpdateLineItem}
          onAddItem={onAddLineItem}
          onRemoveItem={onRemoveLineItem}
        />
      </div>

      {/* Finance Section */}
      <div className="space-y-3 border-t border-slate-200 pt-6">
        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase">Finance</h3>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-[var(--color-text-muted)]">Currency</label>
            <Select value={proposal.currency} onValueChange={(value) => onUpdate({ currency: value as string })}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="CAD">CAD ($)</SelectItem>
                <SelectItem value="AUD">AUD ($)</SelectItem>
                <SelectItem value="JPY">JPY (¥)</SelectItem>
                <SelectItem value="INR">INR (₹)</SelectItem>
                <SelectItem value="CNY">CNY (¥)</SelectItem>
                <SelectItem value="CHF">CHF (CHF)</SelectItem>
                <SelectItem value="SGD">SGD ($)</SelectItem>
                <SelectItem value="NZD">NZD ($)</SelectItem>
                <SelectItem value="ZAR">ZAR (R)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-[var(--color-text-muted)]">Tax Rate (%)</label>
            <Input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={proposal.taxRate}
              onChange={(e) => onUpdate({ taxRate: parseFloat(e.target.value) || 0 })}
              className="text-sm"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="space-y-3 border-t border-slate-200 pt-6">
        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase">Notes</h3>
        <Textarea
          placeholder="Add any additional notes for the client..."
          value={proposal.notes}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          className="text-sm resize-none h-24"
        />
      </div>
    </div>
  );
}
