'use client';

import { LineItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
      <div className="grid grid-cols-12 gap-2 text-xs font-medium text-slate-500 px-2">
        <div className="col-span-5">Description</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-2">Qty</div>
        <div className="col-span-2">Rate</div>
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
            className="flex flex-col gap-2 bg-slate-100 dark:bg-slate-900 p-3 rounded-lg group hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-6 flex flex-col gap-1">
                <Input
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => onUpdateItem(item.id, { description: e.target.value })}
                  className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm"
                />
                {item.type === 'function' && (
                  <span className="text-[10px] uppercase font-bold text-orange-500 ml-1">Function</span>
                )}
              </div>
              
              <Input
                type="number"
                placeholder="Qty"
                value={item.quantity === 0 ? '' : item.quantity}
                onChange={(e) => onUpdateItem(item.id, { quantity: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                className="col-span-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm"
                min="0"
                step="0.01"
              />
              
              <div className="col-span-3 relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold">
                  {currencySymbol}
                </span>
                <Input
                  type="number"
                  placeholder="Rate"
                  value={item.rate === 0 ? '' : item.rate}
                  onChange={(e) => onUpdateItem(item.id, { rate: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                  className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm pl-7 font-medium"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <button
                onClick={() => onRemoveItem(item.id)}
                className="col-span-1 h-9 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                disabled={items.length === 1}
                title={items.length === 1 ? 'At least one item required' : 'Remove item'}
              >
                {items.length > 1 && <Trash2 className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="flex items-center justify-between px-1 mt-2">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id={`negotiable-${item.id}`}
                  checked={item.isNegotiable !== false}
                  onChange={(e) => onUpdateItem(item.id, { isNegotiable: e.target.checked })}
                  className="w-3 h-3 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor={`negotiable-${item.id}`} className="text-[11px] text-slate-500">
                  Client can negotiate
                </label>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-medium">Flow Level:</span>
                <Select value={String(item.level || 1)} onValueChange={(value) => onUpdateItem(item.id, { level: parseInt(value || '1') })}>
                  <SelectTrigger className="h-6 w-[60px] text-[11px] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
        className="flex gap-2"
      >
        <Button
          onClick={() => onAddItem('product')}
          variant="outline"
          className="flex-1 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Product
        </Button>
        <Button
          onClick={() => onAddItem('function')}
          variant="outline"
          className="flex-1 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Function
        </Button>
      </motion.div>
    </div>
  );
}
