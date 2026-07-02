'use client';

import { ProposalData } from '@/lib/types';

interface ProposalPreviewProps {
  proposal: ProposalData;
}

export function ProposalPreview({ proposal }: ProposalPreviewProps) {
  // Safe fallback for currency if the new ones aren't processed yet
  const getSymbol = (curr: string) => {
    const symbols: Record<string, string> = {
      USD: '$', EUR: '€', GBP: '£', CAD: '$', AUD: '$', 
      JPY: '¥', INR: '₹', CNY: '¥', CHF: 'CHF', SGD: '$', NZD: '$', ZAR: 'R'
    };
    return symbols[curr] || '$';
  };
  
  const currencySymbol = getSymbol(proposal.currency);

  const subtotal = proposal.lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const tax = (subtotal * proposal.taxRate) / 100;
  const total = subtotal + tax;

  return (
    <div className="bg-white text-slate-900 rounded-[24px] overflow-hidden border border-slate-200">
      {/* Decorative Header */}
      <div className="h-4 w-full bg-gradient-to-r from-[var(--color-accent-highlight)] to-[var(--color-accent-jade)]"></div>
      
      <div className="p-10 space-y-12">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-accent-highlight)] mb-2 uppercase">Proposal</h1>
            <p className="text-slate-500 font-medium tracking-wide">#{proposal.proposalNumber || 'DRAFT'}</p>
          </div>
          <div className="text-right">
            <div className="w-12 h-12 bg-[var(--color-accent-highlight)] text-white rounded-lg flex items-center justify-center font-bold text-xl ml-auto mb-3 shadow-md">
              {proposal.companyName ? proposal.companyName.substring(0, 2).toUpperCase() : 'QF'}
            </div>
            <h3 className="font-bold text-lg text-slate-800">{proposal.companyName || 'Your Company'}</h3>
            {proposal.email && <p className="text-sm text-slate-500 mt-1">{proposal.email}</p>}
            {proposal.phone && <p className="text-sm text-slate-500">{proposal.phone}</p>}
          </div>
        </div>

        {/* Client & Date Info */}
        <div className="grid grid-cols-2 gap-12 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Prepared For</h4>
            <p className="text-xl font-bold text-slate-800">{proposal.clientName || 'Client Name'}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Date</h4>
              <p className="font-medium text-slate-800">{new Date(proposal.date).toLocaleDateString()}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Valid Until</h4>
              <p className="font-medium text-slate-800">{new Date(proposal.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        {proposal.description && (
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Project Overview</h4>
            <p className="text-slate-700 leading-relaxed">{proposal.description}</p>
          </div>
        )}

        {/* Line Items */}
        <div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-4 font-bold text-slate-400 uppercase tracking-wider">Item Description</th>
                <th className="text-center py-4 font-bold text-slate-400 uppercase tracking-wider w-24">Qty</th>
                <th className="text-right py-4 font-bold text-slate-400 uppercase tracking-wider w-32">Rate</th>
                <th className="text-right py-4 font-bold text-slate-400 uppercase tracking-wider w-32">Amount</th>
              </tr>
            </thead>
            <tbody>
              {proposal.lineItems.map((item, idx) => (
                <tr key={item.id} className={idx !== proposal.lineItems.length - 1 ? 'border-b border-slate-100' : ''}>
                  <td className="py-5">
                    <p className="font-bold text-slate-800">{item.description || 'Untitled Item'}</p>
                    <span className="text-xs text-slate-400 px-2 py-0.5 bg-slate-100 rounded-md mt-1 inline-block capitalize">{item.type}</span>
                  </td>
                  <td className="text-center py-5 font-medium text-slate-600">{item.quantity}</td>
                  <td className="text-right py-5 font-medium text-slate-600">
                    {currencySymbol}{item.rate.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="text-right py-5 font-bold text-slate-800">
                    {currencySymbol}{(item.quantity * item.rate).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Box */}
        <div className="flex justify-end pt-4">
          <div className="w-full md:w-[350px] bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between text-slate-500 font-medium">
              <span>Subtotal</span>
              <span>{currencySymbol}{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            {proposal.taxRate > 0 && (
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Tax ({proposal.taxRate}%)</span>
                <span>{currencySymbol}{tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="pt-4 mt-2 border-t border-slate-200 flex justify-between items-center">
              <span className="text-lg font-bold text-slate-800">Total</span>
              <span className="text-2xl font-black text-[var(--color-accent-highlight)]">
                {currencySymbol}{total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {proposal.notes && (
          <div className="pt-8 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Additional Notes</h4>
            <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{proposal.notes}</p>
          </div>
        )}
      </div>
      
      {/* Footer Decoration */}
      <div className="bg-slate-50 py-4 text-center text-xs text-slate-400 font-medium border-t border-slate-100">
        Generated by QuoteFlow • Secure Proposal Management
      </div>
    </div>
  );
}
