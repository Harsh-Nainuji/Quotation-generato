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
    <div className="bg-white text-[var(--color-pencil)] relative">
      {/* Decorative Header Tape */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-black/5 backdrop-blur-sm -rotate-2 z-10 hidden sm:block"></div>
      
      <div className="p-8 sm:p-12 space-y-12 bg-white" style={{ 
        backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e5e0d8 31px, #e5e0d8 32px)',
        backgroundPositionY: '52px'
      }}>
        {/* Header Section */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-start gap-8 relative bg-white pb-4 z-10 border-b-2 border-dashed border-[var(--color-pencil)]">
          <div className="bg-white px-2">
            <h1 className="text-5xl font-heading font-extrabold text-[var(--color-pencil)] mb-2 uppercase rotate-1">Proposal</h1>
            <p className="font-bold text-xl opacity-80">#{proposal.proposalNumber || 'DRAFT'}</p>
          </div>
          <div className="sm:text-right bg-white px-2">
            <div className="w-16 h-16 bg-[var(--color-marker-red)] text-white flex items-center justify-center font-heading font-bold text-3xl sm:ml-auto mb-3 border-2 border-[var(--color-pencil)] shadow-[4px_4px_0_0_#2d2d2d] -rotate-3" style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}>
              {proposal.companyName ? proposal.companyName.substring(0, 2).toUpperCase() : 'QF'}
            </div>
            <h3 className="font-heading font-bold text-2xl">{proposal.companyName || 'Your Company'}</h3>
            {proposal.email && <p className="text-lg opacity-80 mt-1">{proposal.email}</p>}
            {proposal.phone && <p className="text-lg opacity-80">{proposal.phone}</p>}
          </div>
        </div>

        {/* Client & Date Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-[var(--color-paper)] p-6 border-2 border-[var(--color-pencil)] shadow-[4px_4px_0_0_#2d2d2d] relative z-10 rotate-1" style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}>
          <div>
            <h4 className="font-bold uppercase tracking-widest mb-1 opacity-70">Prepared For</h4>
            <p className="text-2xl font-heading font-bold">{proposal.clientName || 'Client Name'}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold uppercase tracking-widest mb-1 opacity-70">Date</h4>
              <p className="text-xl font-bold">{new Date(proposal.date).toLocaleDateString()}</p>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest mb-1 opacity-70">Valid Until</h4>
              <p className="text-xl font-bold">{new Date(proposal.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white relative z-10 inline-block px-2">
          <h2 className="text-3xl font-heading font-bold">{proposal.title || 'Proposal Title'}</h2>
          <div className="h-2 w-full scribble-underline mt-1"></div>
        </div>

        {/* Line Items Table */}
        <div className="bg-white relative z-10 border-2 border-[var(--color-pencil)]" style={{ borderRadius: '15px' }}>
          <div className="grid grid-cols-12 gap-4 p-4 border-b-2 border-[var(--color-pencil)] bg-[var(--color-postit)] font-bold text-lg" style={{ borderTopLeftRadius: '13px', borderTopRightRadius: '13px' }}>
            <div className="col-span-6">Description</div>
            <div className="col-span-2 text-right">Qty</div>
            <div className="col-span-2 text-right">Rate</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>
          <div className="divide-y-2 divide-dashed divide-[var(--color-pencil)]">
            {proposal.lineItems.map((item, index) => (
              <div key={item.id} className={`grid grid-cols-12 gap-4 p-4 items-center ${index % 2 !== 0 ? 'bg-slate-50' : 'bg-white'}`}>
                <div className="col-span-6">
                  <p className="font-bold text-xl">{item.description || 'Item Description'}</p>
                  {item.type === 'function' && (
                    <span className="inline-block mt-1 text-[11px] uppercase font-bold bg-[var(--color-marker-red)] text-white px-2 rounded-sm rotate-2">Function</span>
                  )}
                  {item.isNegotiable === false && (
                    <span className="inline-block mt-1 ml-2 text-[11px] uppercase font-bold bg-slate-200 text-slate-700 px-2 rounded-sm -rotate-1">Fixed</span>
                  )}
                </div>
                <div className="col-span-2 text-right font-bold text-lg">{item.quantity}</div>
                <div className="col-span-2 text-right font-bold text-lg">{currencySymbol}{item.rate.toFixed(2)}</div>
                <div className="col-span-2 text-right font-bold text-lg">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end relative z-10">
          <div className="w-72 space-y-3 bg-white p-6 border-2 border-[var(--color-pencil)] shadow-[4px_4px_0_0_#2d2d2d] -rotate-1" style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}>
            <div className="flex justify-between font-bold text-lg opacity-80">
              <span>Subtotal</span>
              <span>{currencySymbol}{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg opacity-80">
              <span>Tax ({proposal.taxRate}%)</span>
              <span>{currencySymbol}{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t-2 border-[var(--color-pencil)] text-2xl font-heading font-bold text-[var(--color-marker-red)]">
              <span>Total</span>
              <span>{currencySymbol}{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {proposal.notes && (
          <div className="bg-white relative z-10 mt-12 p-6 border-2 border-[var(--color-pencil)] shadow-[4px_4px_0_0_#2d2d2d] rotate-1" style={{ borderRadius: '15px 255px 15px 255px / 255px 15px 255px 15px' }}>
            <h4 className="font-heading font-bold text-2xl mb-4 underline decoration-[var(--color-marker-red)] decoration-4 underline-offset-4">Notes & Terms</h4>
            <p className="whitespace-pre-wrap font-medium text-lg leading-relaxed">{proposal.notes}</p>
          </div>
        )}
        
        {/* Status Stamp */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-10 flex flex-col items-center justify-center">
          <div className="w-64 h-64 border-8 border-current rounded-full flex items-center justify-center -rotate-12">
            <span className="text-5xl font-heading font-bold uppercase tracking-widest">{proposal.status || 'DRAFT'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
