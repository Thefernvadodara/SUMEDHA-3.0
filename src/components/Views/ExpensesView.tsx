import React, { useState } from 'react';
import { CompanyExpense, ExpenseCategory } from '../../types';
import {
  Receipt,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  IndianRupee,
  Building2,
  Calendar,
  Download,
  AlertCircle,
  Check,
  X,
  CreditCard,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';

interface ExpensesViewProps {
  expenses: CompanyExpense[];
  onAddExpense: () => void;
  onApproveExpense: (id: string, status: 'approved' | 'rejected') => void;
  onDeleteExpense: (id: string) => void;
  showToast: (msg: string) => void;
  isAdmin: boolean;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses,
  onAddExpense,
  onApproveExpense,
  onDeleteExpense,
  showToast,
  isAdmin,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const categories: ExpenseCategory[] = [
    'Office Rent',
    'Electricity & Utilities',
    'Internet & Telephone',
    'Fuel & Travel',
    'Tools & Field Gear',
    'CCTV & Security Equipment',
    'IT Equipment & Hardware',
    'Repairs & Maintenance',
    'Software & Subscriptions',
    'Marketing & Branding',
    'Transport & Logistics',
    'Staff Welfare & Tea',
    'Miscellaneous',
  ];

  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch =
      exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.expenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exp.vendorSupplier && exp.vendorSupplier.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (exp.transactionReference && exp.transactionReference.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCat = categoryFilter === 'all' || exp.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || exp.approvalStatus === statusFilter;

    return matchesSearch && matchesCat && matchesStatus;
  });

  const totalApproved = expenses
    .filter((e) => e.approvalStatus === 'approved')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalPending = expenses
    .filter((e) => e.approvalStatus === 'pending')
    .reduce((sum, e) => sum + e.amount, 0);

  const handleExportCSV = () => {
    const headers = [
      'Expense #',
      'Date',
      'Category',
      'Description',
      'Vendor/Supplier',
      'Amount (INR)',
      'Tax Amount',
      'Payment Mode',
      'Ref Number',
      'Status',
      'Approved By',
      'Recorded By',
    ];
    const rows = filteredExpenses.map((e) => [
      e.expenseNumber,
      e.expenseDate,
      `"${e.category}"`,
      `"${e.description.replace(/"/g, '""')}"`,
      `"${e.vendorSupplier || ''}"`,
      e.amount,
      e.taxAmount || 0,
      `"${e.paymentMethod}"`,
      `"${e.transactionReference || ''}"`,
      e.approvalStatus,
      `"${e.approvedBy || ''}"`,
      `"${e.createdBy}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sumedha_Expenses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported expense ledger to CSV.');
  };

  return (
    <div className="flex flex-col gap-5 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Receipt className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
              Operating Expenditure
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">
            Company Expense Management
          </h2>
          <p className="text-xs text-slate-400">
            Field fuel, office leases, utilities, equipment calibrations, and verified administrative disbursements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onAddExpense}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-rose-950/30 border border-rose-500/20 shadow-md">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Total Recognized Expenses (YTD)
          </span>
          <div className="text-xl font-extrabold text-rose-400 font-mono mt-1">
            {formatCurrency(totalApproved)}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Approved &amp; reconciled in official P&amp;L accounting</p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-amber-950/20 border border-amber-500/20 shadow-md">
          <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">
            Pending Admin Approvals
          </span>
          <div className="text-xl font-extrabold text-amber-300 font-mono mt-1">
            {formatCurrency(totalPending)}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Vouchers awaiting verification</p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-cyan-950/20 border border-cyan-500/20 shadow-md">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Total Expense Vouchers
          </span>
          <div className="text-xl font-extrabold text-cyan-300 font-mono mt-1">
            {expenses.length} Vouchers
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Full audit trail of transactions</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search description, vendor, ref..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-rose-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto text-xs">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:border-rose-400 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-rose-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'approved' ? 'bg-rose-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'pending' ? 'bg-rose-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pending
            </button>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4">Voucher &amp; Date</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Description &amp; Vendor</th>
              <th className="py-3 px-4 text-right">Amount (₹)</th>
              <th className="py-3 px-4">Payment Info</th>
              <th className="py-3 px-4 text-center">Approval Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-500">
                  <Receipt className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  <p className="text-sm font-semibold text-slate-400">No expenses found</p>
                  <p className="text-xs text-slate-500 mt-0.5">Record office bills, field travel or maintenance expenses.</p>
                </td>
              </tr>
            ) : (
              filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-bold text-white">{exp.expenseNumber}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{exp.expenseDate}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/60 text-[10px] text-cyan-300 font-medium">
                      {exp.category}
                    </span>
                    {exp.isRecurring && (
                      <span className="block text-[9px] text-slate-500 mt-1">Recurring Monthly</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-slate-200 font-medium max-w-sm">{exp.description}</div>
                    {exp.vendorSupplier && (
                      <div className="text-[11px] text-slate-400 mt-0.5">Vendor: {exp.vendorSupplier}</div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-400 text-sm">
                    {formatCurrency(exp.amount)}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400">
                    <div>{exp.paymentMethod}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {exp.transactionReference || 'N/A'}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase inline-flex items-center gap-1 ${
                        exp.approvalStatus === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : exp.approvalStatus === 'pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {exp.approvalStatus === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                      {exp.approvalStatus === 'pending' && <Clock className="w-3 h-3" />}
                      {exp.approvalStatus === 'rejected' && <XCircle className="w-3 h-3" />}
                      <span>{exp.approvalStatus}</span>
                    </span>
                    {exp.approvedBy && (
                      <div className="text-[9px] text-slate-500 mt-0.5">{exp.approvedBy}</div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {isAdmin && exp.approvalStatus === 'pending' && (
                        <>
                          <button
                            onClick={() => onApproveExpense(exp.id, 'approved')}
                            title="Approve Expense Voucher"
                            className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onApproveExpense(exp.id, 'rejected')}
                            title="Reject Expense Voucher"
                            className="p-1.5 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      {isAdmin && (
                        <button
                          onClick={() => onDeleteExpense(exp.id)}
                          title="Delete Expense Record"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
