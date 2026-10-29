import React, { useState, useEffect } from 'react';
import { StaffMember } from '../../types';
import { Users, X, Save, IndianRupee } from 'lucide-react';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (staffData: Partial<StaffMember>) => void;
  existingStaff?: StaffMember | null;
}

export const StaffModal: React.FC<StaffModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingStaff,
}) => {
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState<StaffMember['department']>('Technical & Engineering');
  const [role, setRole] = useState('Senior Field Engineer');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [basicSalary, setBasicSalary] = useState('30000');
  const [hra, setHra] = useState('10000');
  const [allowances, setAllowances] = useState('5000');
  const [deductions, setDeductions] = useState('2000');
  const [bankName, setBankName] = useState('HDFC Bank Ltd');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');

  useEffect(() => {
    if (existingStaff) {
      setName(existingStaff.name || '');
      setEmployeeId(existingStaff.employeeId || '');
      setPhone(existingStaff.phone || '+91 ');
      setEmail(existingStaff.email || '');
      setDepartment(existingStaff.department || 'Technical & Engineering');
      setRole(existingStaff.role || '');
      setJoiningDate(existingStaff.joiningDate || '');
      setBasicSalary((existingStaff.basicSalary || 0).toString());
      setHra((existingStaff.hra || 0).toString());
      setAllowances((existingStaff.allowances || 0).toString());
      setDeductions((existingStaff.deductions || 0).toString());
      setBankName(existingStaff.bankDetails?.bankName || '');
      setAccountNumber(existingStaff.bankDetails?.accountNumber || '');
      setIfsc(existingStaff.bankDetails?.ifsc || '');
    } else {
      setName('');
      setEmployeeId('');
      setPhone('+91 ');
      setEmail('');
      setDepartment('Technical & Engineering');
      setRole('Field Engineer');
      setJoiningDate(new Date().toISOString().split('T')[0]);
      setBasicSalary('30000');
      setHra('10000');
      setAllowances('5000');
      setDeductions('2000');
      setBankName('HDFC Bank Ltd');
      setAccountNumber('');
      setIfsc('HDFC0000182');
    }
  }, [existingStaff, isOpen]);

  if (!isOpen) return null;

  const basic = parseFloat(basicSalary) || 0;
  const numHra = parseFloat(hra) || 0;
  const numAll = parseFloat(allowances) || 0;
  const numDed = parseFloat(deductions) || 0;
  const net = basic + numHra + numAll - numDed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      employeeId: employeeId.trim() || undefined,
      phone: phone.trim(),
      email: email.trim(),
      department,
      role: role.trim(),
      joiningDate,
      basicSalary: basic,
      hra: numHra,
      allowances: numAll,
      deductions: numDed,
      netMonthlySalary: net,
      paymentFrequency: 'Monthly',
      bankDetails: {
        accountName: name.trim(),
        accountNumber: accountNumber.trim(),
        ifsc: ifsc.trim().toUpperCase(),
        bankName: bankName.trim(),
      },
      employmentStatus: 'active',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {existingStaff ? 'Edit Staff Member' : 'Register New Staff Member'}
              </h3>
              <p className="text-xs text-slate-400">Employee profile, role &amp; monthly salary structure</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 my-4 text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Full Legal Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aravind Sharma"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Employee ID</label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="e.g. STI-EMP-006 (Auto)"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Department *</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              >
                <option value="Technical & Engineering">Technical &amp; Engineering</option>
                <option value="Operations">Operations &amp; Dispatch</option>
                <option value="Billing & Accounts">Billing &amp; Accounts</option>
                <option value="Management">Management &amp; Direction</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Job Designation / Role *</label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Field Engineer"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Mobile Number *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98250 44120"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@sumedhatechinfra.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Joining Date</label>
              <input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Salary Structure Box */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider font-bold">
              Monthly Salary Compensation Structure
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="block text-slate-500 text-[10px] mb-0.5">Basic Pay (₹)</label>
                <input
                  type="number"
                  required
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
                <label className="block text-slate-500 text-[10px] mb-0.5">Deductions (₹)</label>
                <input
                  type="number"
                  value={deductions}
                  onChange={(e) => setDeductions(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-rose-400 font-mono"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Computed Net Monthly Compensation:</span>
              <span className="font-bold text-emerald-400 text-sm">
                ₹{net.toLocaleString('en-IN')} / month
              </span>
            </div>
          </div>

          {/* Bank Details */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider font-bold">
              Direct Bank Deposit Information
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Bank Name"
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
              />
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Account Number"
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
              />
              <input
                type="text"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                placeholder="IFSC Code"
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
              />
            </div>
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
              <Save className="w-4 h-4" />
              <span>{existingStaff ? 'Update Staff Member' : 'Save Staff Member'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
