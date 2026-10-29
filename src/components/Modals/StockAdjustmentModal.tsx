import React, { useState } from 'react';
import { InventoryItem } from '../../types';
import { ArrowUpDown, X, Check, AlertCircle } from 'lucide-react';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  onConfirmAdjustment: (
    itemId: string,
    data: { type: 'in' | 'out' | 'adjustment'; qty: number; reference?: string; notes?: string }
  ) => void;
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  isOpen,
  onClose,
  item,
  onConfirmAdjustment,
}) => {
  const [type, setType] = useState<'in' | 'out' | 'adjustment'>('in');
  const [qty, setQty] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const numQty = parseInt(qty, 10);
    if (isNaN(numQty) || numQty <= 0) {
      setError('Please enter a valid positive quantity');
      return;
    }

    if (type === 'out' && item.currentStock < numQty) {
      setError(`Cannot dispatch ${numQty} units. Current stock is only ${item.currentStock}.`);
      return;
    }

    onConfirmAdjustment(item.id, {
      type,
      qty: numQty,
      reference: reference.trim() || 'Manual stock update',
      notes: notes.trim(),
    });

    onClose();
  };

  const previewStock = () => {
    const num = parseInt(qty, 10) || 0;
    if (type === 'in') return item.currentStock + num;
    if (type === 'out') return Math.max(0, item.currentStock - num);
    if (type === 'adjustment') return num;
    return item.currentStock;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ArrowUpDown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Adjust Stock Level</h3>
              <p className="text-xs text-slate-400 font-mono">{item.sku}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="my-3.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <div className="font-bold text-white text-sm">{item.name}</div>
          <div className="flex items-center justify-between mt-1 text-slate-400">
            <span>Current In-Hand Stock:</span>
            <span className="font-mono font-bold text-white text-sm">
              {item.currentStock} {item.unit}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-sans">
          <div>
            <label className="block text-slate-400 mb-1">Adjustment Action</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType('in')}
                className={`py-2 rounded-xl font-bold font-mono text-[11px] border transition-colors cursor-pointer ${
                  type === 'in'
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                + Stock In
              </button>
              <button
                type="button"
                onClick={() => setType('out')}
                className={`py-2 rounded-xl font-bold font-mono text-[11px] border transition-colors cursor-pointer ${
                  type === 'out'
                    ? 'bg-rose-600 border-rose-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                - Stock Out
              </button>
              <button
                type="button"
                onClick={() => setType('adjustment')}
                className={`py-2 rounded-xl font-bold font-mono text-[11px] border transition-colors cursor-pointer ${
                  type === 'adjustment'
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                = Audit Count
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">
              {type === 'adjustment' ? 'New Exact Stock Count' : 'Units Quantity'} ({item.unit}) *
            </label>
            <input
              type="number"
              min="1"
              required
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder="e.g. 5"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-base font-bold focus:border-cyan-400 focus:outline-none"
            />
            {qty && (
              <p className="text-[11px] text-cyan-300 mt-1 font-mono">
                Projected New Stock: <strong>{previewStock()} {item.unit}</strong>
              </p>
            )}
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Reference Reason / Invoice #</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. Returned from site / Warranty Replacement"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Audit Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Physical count verified by technician"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/25 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Stock Adjustment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
