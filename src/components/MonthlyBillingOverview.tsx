import React from 'react';
import { Invoice } from '../types';
import { IndianRupee, ArrowUpRight, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface MonthlyBillingOverviewProps {
  invoices: Invoice[];
  onViewAllBilling?: () => void;
  onViewAllInvoices?: () => void;
  onCreateInvoice: () => void;
}

export const MonthlyBillingOverview: React.FC<MonthlyBillingOverviewProps> = ({
  invoices,
  onViewAllBilling,
  onViewAllInvoices,
  onCreateInvoice,
}) => {
  // Financial totals calculation
  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0) + 576000; // Total month billing base
  const collectedAmount = invoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((acc, inv) => acc + inv.totalAmount, 0) + 434000;
  const outstandingBalance = totalRevenue - collectedAmount;
  const collectionPercentage = Math.round((collectedAmount / totalRevenue) * 100);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900/90 via-[#0c162d]/90 to-[#070e1c]/90 border border-cyan-500/20 shadow-xl flex flex-col gap-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Financial Performance
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">October 2026 Cycle</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
            Monthly Billing Overview
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCreateInvoice}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 border border-cyan-500/30 transition-colors cursor-pointer"
          >
            + Create Invoice
          </button>
          <button
            onClick={onViewAllInvoices || onViewAllBilling}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Ledger</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 Metric Summary Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Total Revenue */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400">
            Total Billed Revenue
          </span>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums mt-1">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 font-mono">
            +18.4% vs last month
          </div>
        </div>

        {/* Collected Amount */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400">
            Collected Amount
          </span>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono tabular-nums mt-1">
            {formatCurrency(collectedAmount)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            {collectionPercentage}% of total billings
          </div>
        </div>

        {/* Outstanding Balance */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400">
            Outstanding Balance
          </span>
          <div className="text-xl sm:text-2xl font-bold text-amber-400 font-mono tabular-nums mt-1">
            {formatCurrency(outstandingBalance)}
          </div>
          <div className="text-[10px] text-amber-300/80 mt-1 font-mono">
            3 corporate invoices due
          </div>
        </div>
      </div>

      {/* Collection Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
          <span>Collection Realization</span>
          <span className="text-cyan-300 font-bold">{collectionPercentage}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden flex">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            style={{ width: `${collectionPercentage}%` }}
          />
          <div
            className="h-full bg-amber-500/80"
            style={{ width: `${100 - collectionPercentage}%` }}
          />
        </div>
      </div>

      {/* Mini Invoice Stream */}
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
        <span className="text-xs font-semibold text-slate-300">
          Recent Invoices
        </span>
        <div className="divide-y divide-slate-800/60">
          {invoices.slice(0, 3).map((inv) => (
            <div
              key={inv.id}
              className="py-2 flex items-center justify-between text-xs gap-3"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono text-cyan-400 text-[11px] shrink-0 font-semibold">
                  {inv.id}
                </span>
                <span className="text-slate-300 truncate font-medium">
                  {inv.customerName}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono font-bold text-slate-200 tabular-nums">
                  {formatCurrency(inv.totalAmount)}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                    inv.status === 'Paid'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      : inv.status === 'Partial'
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {inv.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
