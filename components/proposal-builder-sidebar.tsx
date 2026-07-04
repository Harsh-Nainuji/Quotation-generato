'use client';

import { ProposalData } from '@/lib/types';
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
    <div className="space-y-8 max-h-[80vh] overflow-y-auto pr-4 custom-scrollbar">
      {/* Company Section */}
      <div className="space-y-3">
        <h3 className="text-xl font-heading font-bold text-[var(--color-pencil)]">Company</h3>
        <div className="space-y-3">
          <input
            placeholder="Company name"
            value={proposal.companyName}
            onChange={(e) => onUpdate({ companyName: e.target.value })}
            className="hand-input"
          />
          <input
            placeholder="Email"
            type="email"
            value={proposal.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            className="hand-input"
          />
          <input
            placeholder="Phone"
            value={proposal.phone}
            onChange={(e) => onUpdate({ phone: e.target.value })}
            className="hand-input"
          />
        </div>
      </div>

      {/* Client Section */}
      <div className="space-y-3 border-t-2 border-dashed border-[var(--color-pencil)] pt-8">
        <h3 className="text-xl font-heading font-bold text-[var(--color-pencil)]">Client</h3>
        <input
          placeholder="Client name"
          value={proposal.clientName}
          onChange={(e) => onUpdate({ clientName: e.target.value })}
          className="hand-input"
        />
      </div>

      {/* Proposal Details Section */}
      <div className="space-y-3 border-t-2 border-dashed border-[var(--color-pencil)] pt-8">
        <h3 className="text-xl font-heading font-bold text-[var(--color-pencil)]">Details</h3>
        <div className="space-y-3">
          <input
            placeholder="Proposal title"
            value={proposal.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="hand-input font-bold"
          />
          <input
            type="date"
            value={proposal.date}
            onChange={(e) => onUpdate({ date: e.target.value })}
            className="hand-input"
          />
          
          {/* Currency Selection */}
          <div className="flex items-center gap-3 bg-white border-2 border-[var(--color-pencil)] p-2" style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}>
            <span className="text-sm font-bold text-[var(--color-pencil)] ml-2">Currency:</span>
            <Select 
              value={proposal.currency || 'USD'} 
              onValueChange={(val) => onUpdate({ currency: val })}
            >
              <SelectTrigger className="w-[120px] bg-transparent border-0 shadow-none font-bold text-[var(--color-pencil)] focus:ring-0">
                <SelectValue placeholder="USD" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-[var(--color-pencil)] rounded-none">
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="CAD">CAD ($)</SelectItem>
                <SelectItem value="AUD">AUD ($)</SelectItem>
                <SelectItem value="JPY">JPY (¥)</SelectItem>
                <SelectItem value="INR">INR (₹)</SelectItem>
                <SelectItem value="CNY">CNY (¥)</SelectItem>
                <SelectItem value="CHF">CHF</SelectItem>
                <SelectItem value="SGD">SGD ($)</SelectItem>
                <SelectItem value="NZD">NZD ($)</SelectItem>
                <SelectItem value="ZAR">ZAR (R)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Features & Pricing */}
      <div className="space-y-4 border-t-2 border-dashed border-[var(--color-pencil)] pt-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-heading font-bold text-[var(--color-pencil)]">Features & Pricing</h3>
        </div>
        
        <LineItemsEditor
          items={proposal.lineItems}
          currency={proposal.currency}
          onUpdateItem={onUpdateLineItem}
          onAddItem={onAddLineItem}
          onRemoveItem={onRemoveLineItem}
        />
      </div>

      {/* Notes Section */}
      <div className="space-y-3 border-t-2 border-dashed border-[var(--color-pencil)] pt-8 pb-8">
        <h3 className="text-xl font-heading font-bold text-[var(--color-pencil)]">Notes & Terms</h3>
        <textarea
          placeholder="Add any notes, terms, or conditions here..."
          value={proposal.notes}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          className="hand-input h-32 resize-none"
        />
      </div>
    </div>
  );
}
