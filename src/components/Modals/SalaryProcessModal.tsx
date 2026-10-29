import React, { useState, useEffect } from 'react';
import { StaffMember, MonthlySalaryRecord } from '../../types';
import { CreditCard, X, Check, IndianRupee, AlertCircle } from 'lucide-react';

interface SalaryProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffMembers: StaffMember[];
  selectedStaff?: StaffMember | null;
  onConfirmSalary: (data: Partial<MonthlySalaryRecord>) => void;
}

export const SalaryProcessModal: React.FC<SalaryProcessModalProps> = ({
  isOpen,
  onClose,
  staffMembers,
  selectedStaff,
  onConfirmSalary,
}) => {
  const [staffId, setStaffId] = useState('');
  const [month, setMonth] = useState('October 2026');
  const [year, setYear] = useState('2026');
  const [basicSalary, setBasicSalary] = useState('0');
  const [hra, setHra] = useState('0');
  const [allowances, setAllowances] = useState('0');
  const [overtimeBonus, setOvertimeBonus] = useState('0');
  const [authorizedDeductions, setAuthorizedDeductions] = useState('0');
  const [advanceDeduction, setAdvanceDeduction] = useState('0');
  const [amountPaid, setAmountPaid] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState<'Bank Transfer' | 'UPI' | 'Cash' | 'Cheque'>('Bank Transfer');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');

  const activeStaff = staffMembers.find((s) => s.id === staffId) || selectedStaff || staffMembers[0];

  useEffect(() => {
    if (activeStaff) {
      setStaffId(activeStaff.id);
      setBasicSalary((activeStaff.basicSalary || 0).toString());
      setHra((activeStaff.hra || 0).toString());
      setAllowances((activeStaff.allowances || 0).toString());
      setAuthorizedDeductions((activeStaff.deductions || 0).toString());
      setOvertimeBonus('0');
      // If staff has active advance, suggest deducting up to advance balance
      const maxAdv = activeStaff.outstandingAdvance || 0;
      setAdvanceDeduction(maxAdv > 5000 ? '5000' : maxAdv.toString());
      setReferenceNumber(`NEFT-SAL-${Date.now()}`);
    }
  }, [activeStaff?.id, isOpen]);

  // Recalculate net payable
  const basic = parseFloat(basicSalary) || 0;
  const numHra = parseFloat(hra) || 0;
  const numAll = parseFloat(allowances) || 0;
  const numBonus = parseFloat(overtimeBonus) || 0;
  const numDed = parseFloat(authorizedDeductions) || 0;
  const numAdvDed = parseFloat(advanceDeduction) || 0;

  const gross = basic + numHra + numAll + numBonus;
  const netPayable = Math.max(0, gross - numDed - numAdvDed);

  useEffect(() => {
    setAmountPaid(netPayable.toString());
  }, [netPayable]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStaff) return;

    onConfirmSalary({
      staffId: activeStaff.id,
      month,
      year: parseInt(year, 10) || 2026,
      basicSalary: basic,
      hra: numHra,
      allowances: numAll,
      overtimeBonus: numBonus,
      authorizedDeductions: numDed,
      advanceDeduction: numAdvDed,
      amountPaid: parseFloat(amountPaid) || netPayable,
      paymentMethod,
      referenceNumber: referenceNumber.trim(),
      notes: notes.trim(),
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
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Disburse Monthly Salary</h3>
              <p className="text-xs text-slate-400">Payroll slip generation &amp; advance reconciliation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 my-4 text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Select Staff Member *</label>
              <select
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              >
                {staffMembers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.employeeId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Payroll Cycle Month *</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              >
                <option value="October 2026">October 2026</option>
                <option value="November 2026">November 2026</option>
                <option value="September 2026">September 2026</option>
                <option value="August 2026">August 2026</option>
              </select>
            </div>
          </div>

          {/* Active staff advance warning */}
          {activeStaff && (activeStaff.outstandingAdvance || 0) > 0 && (
            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold">Active Advance Balance:</span>
                <span className="font-mono ml-1.5">{formatCurrency(activeStaff.outstandingAdvance)}</span>
              </div>
              <span className="text-[10px] text-amber-400">Reconciled in deduction below</span>
            </div>
          )}

          {/* Detailed Earnings & Deductions */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider font-bold">
              Breakdown of Earnings &amp; Deductions
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-500 text-[10px] mb-0.5">Basic Salary (₹)</label>
                <input
                  type="number"
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] mb-0.5">HRA (₹)</label>
                <input
                  type="number"
                  value={hra}
                  onChange={(e) => setHra(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] mb-0.5">Allowances (₹)</label>
                <input
                  type="number"
                  value={allowances}
                  onChange={(e) => setAllowances(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] mb-0.5">Overtime / Bonus (₹)</label>
                <input
                  type="number"
                  value={overtimeBonus}
                  onChange={(e) => setOvertimeBonus(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] mb-0.5">Auth. Deductions (₹)</label>
                <input
                  type="number"
                  value={authorizedDeductions}
                  onChange={(e) => setAuthorizedDeductions(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-rose-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] mb-0.5">Advance Deduction (₹)</label>
                <input
                  type="number"
                  value={advanceDeduction}
                  onChange={(e) => setAdvanceDeduction(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-amber-500/50 text-amber-300 font-mono"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Gross: {formatCurrency(gross)}</span>
              <span className="font-bold text-emerald-400 text-sm">
                Net Calculated: {formatCurrency(netPayable)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Actual Amount Disbursed (₹) *</label>
              <input
                type="number"
                required
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Disbursal Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              >
                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                <option value="UPI">UPI Direct</option>
                <option value="Cheque">Bank Cheque</option>
                <option value="Cash">Cash Voucher</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Bank UTR / Transaction Reference #</label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="e.g. NEFT-HDFC-91823901"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none"
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
              <span>Confirm &amp; Generate Slip</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
