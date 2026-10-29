import React, { useState } from 'react';
import { Supplier, PurchaseInvoice } from '../../types';
import { CreditCard, X, Check, IndianRupee, AlertCircle } from 'lucide-react';

interface SupplierPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
  purchases: PurchaseInvoice[];
  onRecordPayment: (data: {
    supplierId: string;
    amount: number;
    method: string;
    referenceNumber: string;
    notes?: string;
    purchaseInvoiceId?: string;
  }) => void;
}

export const SupplierPaymentModal: React.FC<SupplierPaymentModalProps> = ({
  isOpen,
  onClose,
  supplier,
  purchases,
  onRecordPayment,
}) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'NEFT/RTGS' | 'UPI' | 'Cheque' | 'Cash' | 'Card'>('NEFT/RTGS');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [purchaseInvoiceId, setPurchaseInvoiceId] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !supplier) return null;

  const supplierPurchases = purchases.filter(
    (p) => p.supplierId === supplier.id && p.paymentStatus !== 'paid'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid disbursement amount');
      return;
    }

    onRecordPayment({
      supplierId: supplier.id,
      amount: numAmount,
      method,
      referenceNumber: referenceNumber.trim() || `REF-${Date.now()}`,
      notes: notes.trim(),
      purchaseInvoiceId: purchaseInvoiceId || undefined,
    });

    onClose();
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Record Vendor Disbursal</h3>
              <p className="text-xs text-slate-400">{supplier.company}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Payable Banner */}
        <div className="my-4 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400">Current Outstanding Payable:</span>
            <div className="text-base font-extrabold text-rose-400 font-mono mt-0.5">
              {formatCurrency(supplier.outstandingPayable || 0)}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAmount(supplier.outstandingPayable?.toString() || '0')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-[11px] cursor-pointer"
          >
            Pay Full Due
          </button>
        </div>

        {error && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-sans">
          <div>
            <label className="block text-slate-400 mb-1">Payment Amount (₹) *</label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="number"
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-base font-bold focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Disbursal Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              >
                <option value="NEFT/RTGS">NEFT / RTGS</option>
                <option value="UPI">UPI Transfer</option>
                <option value="Cheque">Bank Cheque</option>
                <option value="Cash">Cash</option>
                <option value="Card">Corporate Card</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">UTR / Cheque / Ref #</label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="e.g. UTR-91823901"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          {supplierPurchases.length > 0 && (
            <div>
              <label className="block text-slate-400 mb-1">Link to Purchase Bill (Optional)</label>
              <select
                value={purchaseInvoiceId}
                onChange={(e) => setPurchaseInvoiceId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              >
                <option value="">General On-Account Payment</option>
                {supplierPurchases.map((pur) => (
                  <option key={pur.id} value={pur.id}>
                    {pur.purchaseNumber} (Balance Due: {formatCurrency(pur.balanceDue)})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-slate-400 mb-1">Notes / Remarks</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. CCTV Batch advance payment"
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
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/25 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Disbursal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
