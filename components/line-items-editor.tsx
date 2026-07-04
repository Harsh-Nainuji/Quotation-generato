'use client';

import { LineItem } from '@/lib/types';
import { Trash2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LineItemsEditorProps {
  items: LineItem[];
  currency: string;
  onUpdateItem: (id: string, updates: Partial<LineItem>) => void;
  onAddItem: (type?: 'product' | 'service' | 'function') => void;
  onRemoveItem: (id: string) => void;
}

export function LineItemsEditor({
  items,
  currency,
  onUpdateItem,
  onAddItem,
  onRemoveItem,
}: LineItemsEditorProps) {
  const getSymbol = (curr: string) => {
    const symbols: Record<string, string> = {
      USD: '$', EUR: '€', GBP: '£', CAD: '$', AUD: '$', 
      JPY: '¥', INR: '₹', CNY: '¥', CHF: 'CHF', SGD: '$', NZD: '$', ZAR: 'R'
    };
    return symbols[curr] || '$';
  };
  const currencySymbol = getSymbol(currency);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-2 text-sm font-bold font-heading text-[var(--color-pencil)] px-2 mb-2">
        <div className="col-span-6">Description</div>
        <div className="col-span-2 text-center">Qty</div>
        <div className="col-span-3 text-center">Rate</div>
        <div className="col-span-1" />
      </div>

      {items.map((item, index) => {
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-2 bg-white border-2 border-[var(--color-pencil)] p-3 shadow-[2px_2px_0_0_#2d2d2d] hover:-translate-y-1 transition-transform relative"
            style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}
          >
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-6 flex flex-col gap-1 relative">
                <input
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => onUpdateItem(item.id, { description: e.target.value })}
                  className="w-full bg-transparent border-b-2 border-dashed border-[var(--color-pencil)] text-[var(--color-pencil)] text-base font-bold outline-none px-1 py-1 placeholder:font-normal placeholder:opacity-50"
                />
                {item.type === 'function' && (
                  <span className="absolute -top-3 -right-2 text-[10px] uppercase font-bold text-[var(--color-marker-red)] bg-white px-1 border border-dashed border-[var(--color-marker-red)] rotate-2">Function</span>
                )}
              </div>
              
              <input
                type="number"
                placeholder="Qty"
                value={item.quantity === 0 ? '' : item.quantity}
                onChange={(e) => onUpdateItem(item.id, { quantity: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                className="col-span-2 w-full bg-transparent border-b-2 border-dashed border-[var(--color-pencil)] text-[var(--color-pencil)] text-base font-bold outline-none px-1 py-1 text-center"
                min="0"
                step="0.01"
              />
              
              <div className="col-span-3 relative">
                <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[var(--color-pencil)] font-bold">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  placeholder="Rate"
                  value={item.rate === 0 ? '' : item.rate}
                  onChange={(e) => onUpdateItem(item.id, { rate: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                  className="w-full bg-transparent border-b-2 border-dashed border-[var(--color-pencil)] text-[var(--color-pencil)] text-base font-bold outline-none pl-5 py-1 text-right"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <button
                onClick={() => onRemoveItem(item.id)}
                className="col-span-1 flex items-center justify-center text-[var(--color-pencil)] hover:text-[var(--color-marker-red)] hover:scale-110 transition-transform disabled:opacity-30 disabled:hover:scale-100"
                disabled={items.length === 1}
                title={items.length === 1 ? 'At least one item required' : 'Remove item'}
              >
                {items.length > 1 && <Trash2 className="w-5 h-5 stroke-[2.5px]" />}
              </button>
            </div>
            
            <div className="flex items-center justify-between px-1 mt-2 border-t-2 border-dotted border-[var(--color-pencil)]/30 pt-2">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => onUpdateItem(item.id, { isNegotiable: item.isNegotiable === false })}>
                <div className={`w-4 h-4 border-2 border-[var(--color-pencil)] flex items-center justify-center ${item.isNegotiable !== false ? 'bg-[var(--color-pen-blue)]' : 'bg-white'}`} style={{ borderRadius: '4px 6px 4px 6px' }}>
                  {item.isNegotiable !== false && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5 L4 7 L8 2" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span className="text-sm font-bold opacity-80">
                  Client can negotiate
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold opacity-80">Flow Level:</span>
                <Select value={String(item.level || 1)} onValueChange={(value) => onUpdateItem(item.id, { level: parseInt(value || '1') })}>
                  <SelectTrigger className="h-6 w-[55px] bg-white border-2 border-[var(--color-pencil)] rounded-none text-xs font-bold shadow-[1px_1px_0_0_#2d2d2d] focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-[var(--color-pencil)] rounded-none">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <SelectItem key={lvl} value={String(lvl)}>
                        Lv {lvl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        );
      })}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex gap-4 mt-6"
      >
        <button
          onClick={() => onAddItem('product')}
          className="flex-1 hand-button text-sm !py-2 !px-0 bg-white"
        >
          <Plus className="w-4 h-4 mr-1 stroke-[3px]" />
          Add Product
        </button>
        <button
          onClick={() => onAddItem('function')}
          className="flex-1 hand-button-secondary text-sm !py-2 !px-0 bg-[var(--color-paper)]"
        >
          <Plus className="w-4 h-4 mr-1 stroke-[3px]" />
          Add Function
        </button>
      </motion.div>
    </div>
  );
}
