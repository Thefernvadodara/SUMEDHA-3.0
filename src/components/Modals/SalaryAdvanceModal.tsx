import React, { useState } from 'react';
import { StaffMember } from '../../types';
import { IndianRupee, X, Check, AlertCircle } from 'lucide-react';

interface SalaryAdvanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffMembers: StaffMember[];
  selectedStaff?: StaffMember | null;
  onConfirmAdvance: (data: { staffId: string; amount: number; reason: string }) => void;
}

export const SalaryAdvanceModal: React.FC<SalaryAdvanceModalProps> = ({
  isOpen,
  onClose,
  staffMembers,
  selectedStaff,
  onConfirmAdvance,
}) => {
  const [staffId, setStaffId] = useState(selectedStaff?.id || staffMembers[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeStaff = staffMembers.find((s) => s.id === staffId) || staffMembers[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid advance amount');
      return;
    }
    if (!reason.trim()) {
      setError('Please provide a reason or justification for this advance');
      return;
    }

    onConfirmAdvance({
      staffId: activeStaff.id,
      amount: numAmount,
      reason: reason.trim(),
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
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Issue Staff Salary Advance</h3>
              <p className="text-xs text-slate-400">Advance disbursement against upcoming payroll</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="my-3 p-2.5 rounded-xl bg-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 my-4 text-xs font-sans">
          <div>
            <label className="block text-slate-400 mb-1">Staff Member *</label>
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
            >
              {staffMembers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.employeeId}) - Net Sal: {formatCurrency(s.netMonthlySalary)}
                </option>
              ))}
            </select>
          </div>

          {activeStaff && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Monthly Base Salary:</span>
                <span className="font-mono text-white">{formatCurrency(activeStaff.netMonthlySalary)}</span>
              </div>
              <div className="flex justify-between">
                <span>Existing Outstanding Advance:</span>
                <span className="font-mono text-amber-400 font-bold">
                  {formatCurrency(activeStaff.outstandingAdvance || 0)}
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-400 mb-1">Advance Amount (₹) *</label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="number"
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 10000"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-base font-bold focus:border-amber-400 focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Note: Advances are tracked separately as loans and automatically deducted upon monthly salary slip generation to avoid double expenses.
            </p>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Reason / Purpose of Advance *</label>
            <textarea
              required
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Family medical expense / festival advance"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none resize-none"
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
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold flex items-center gap-1.5 shadow-md shadow-amber-600/25 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Authorize &amp; Disburse Advance</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
