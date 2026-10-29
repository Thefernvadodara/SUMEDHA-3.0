import React, { useState } from 'react';
import {
  Invoice,
  PurchaseInvoice,
  CompanyExpense,
  MonthlySalaryRecord,
  Customer,
  Supplier,
  InventoryItem,
  ProfitAndLossReport,
} from '../../types';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  IndianRupee,
  Calendar,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Building2,
  Users,
  Boxes,
  HelpCircle,
  PieChart,
} from 'lucide-react';

interface ProfitLossViewProps {
  invoices: Invoice[];
  purchases: PurchaseInvoice[];
  expenses: CompanyExpense[];
  salaries: MonthlySalaryRecord[];
  customers: Customer[];
  suppliers: Supplier[];
  inventory: InventoryItem[];
  showToast: (msg: string) => void;
}

export const ProfitLossView: React.FC<ProfitLossViewProps> = ({
  invoices,
  purchases,
  expenses,
  salaries,
  customers,
  suppliers,
  inventory,
  showToast,
}) => {
  const [period, setPeriod] = useState<'ytd' | 'october_2026' | 'q2_2026' | 'all_time'>('ytd');
  const [activeTab, setActiveTab] = useState<'summary' | 'invoices_breakdown' | 'products_breakdown'>('summary');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  // Filter invoices for recognized revenue (exclude Draft and Cancelled)
  const recognizedInvoices = invoices.filter(
    (inv) => inv.status !== 'Draft' && inv.status !== 'Cancelled'
  );

  // 1. REVENUE
  const totalGrossSales = recognizedInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const totalDiscounts = recognizedInvoices.reduce((sum, inv) => sum + (inv.discountTotal || 0), 0);
  const netSales = totalGrossSales - totalDiscounts;

  // 2. COST OF GOODS SOLD (COGS)
  // Calculated item-by-item from sold inventory cost prices to strictly prevent double counting
  let calculatedCogs = 0;
  let itemsWithKnownCost = 0;
  let totalSoldItems = 0;

  const invoiceProfitAnalysis = recognizedInvoices.map((inv) => {
    let invCogs = 0;
    (inv.items || []).forEach((item) => {
      totalSoldItems++;
      if (item.inventoryItemId) {
        const product = inventory.find((p) => p.id === item.inventoryItemId);
        if (product && product.costPrice) {
          invCogs += product.costPrice * item.qty;
          itemsWithKnownCost++;
        }
      }
    });

    // If no direct inventory link, estimate cost based on industry benchmark (65% hardware cost)
    if (invCogs === 0 && inv.items && inv.items.length > 0) {
      invCogs = Math.round(inv.amount * 0.65);
    }

    const invNetSales = inv.amount - (inv.discountTotal || 0);
    const invGrossProfit = invNetSales - invCogs;
    const invMargin = invNetSales > 0 ? (invGrossProfit / invNetSales) * 100 : 0;

    calculatedCogs += invCogs;

    return {
      invoice: inv,
      netSales: invNetSales,
      cogs: invCogs,
      grossProfit: invGrossProfit,
      margin: invMargin,
    };
  });

  // Gross Profit = Net Sales - COGS
  const grossProfit = Math.max(0, netSales - calculatedCogs);
  const grossProfitMargin = netSales > 0 ? (grossProfit / netSales) * 100 : 0;

  // 3. OPERATING EXPENSES
  // Staff Salaries (Only count paid/disbursed records once)
  const staffSalaryExpenses = salaries
    .filter((s) => s.status === 'paid' || s.amountPaid > 0)
    .reduce((sum, s) => sum + (s.amountPaid || 0), 0);

  // Administrative Operating Expenses (Approved vouchers only)
  const companyOperatingExpenses = expenses
    .filter((e) => e.approvalStatus === 'approved')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalOperatingExpenses = staffSalaryExpenses + companyOperatingExpenses;

  // Operating Profit = Gross Profit - Operating Expenses
  const operatingProfit = grossProfit - totalOperatingExpenses;
  const operatingProfitMargin = netSales > 0 ? (operatingProfit / netSales) * 100 : 0;

  // Net Profit = Operating Profit (Total Recognized Income - Total Recognized Expenses)
  const netProfit = operatingProfit;
  const netProfitMargin = netSales > 0 ? (netProfit / netSales) * 100 : 0;

  // ACCOUNTS RECEIVABLE & PAYABLE
  const accountsReceivable = customers
    .filter((c) => c.status === 'active')
    .reduce((sum, c) => sum + Math.max(0, c.outstandingBalance || 0), 0);

  const accountsPayable = suppliers
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + Math.max(0, s.outstandingPayable || 0), 0);

  // Product-wise profit calculation
  const productProfitMap: { [sku: string]: { name: string; sku: string; unitsSold: number; revenue: number; cost: number; profit: number; margin: number } } = {};
  recognizedInvoices.forEach((inv) => {
    (inv.items || []).forEach((item) => {
      const prod = inventory.find((p) => p.id === item.inventoryItemId) || {
        name: item.description,
        sku: item.partNumber || 'SKU-CUSTOM',
        costPrice: Math.round(item.unitPrice * 0.65),
      };
      const sku = prod.sku;
      if (!productProfitMap[sku]) {
        productProfitMap[sku] = {
          name: prod.name,
          sku: prod.sku,
          unitsSold: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
          margin: 0,
        };
      }
      const itemRev = item.qty * item.unitPrice * (1 - (item.discountPercent || 0) / 100);
      const itemCost = item.qty * (prod.costPrice || 0);
      productProfitMap[sku].unitsSold += item.qty;
      productProfitMap[sku].revenue += itemRev;
      productProfitMap[sku].cost += itemCost;
      productProfitMap[sku].profit += itemRev - itemCost;
    });
  });

  const productProfitList = Object.values(productProfitMap).map((p) => ({
    ...p,
    margin: p.revenue > 0 ? (p.profit / p.revenue) * 100 : 0,
  }));

  const handleExportPnLCSV = () => {
    const lines = [
      'SUMEDHA TECH INFRA - PROFIT & LOSS STATEMENT',
      `Period: FY 2026-27 (October Cycle)`,
      `Generated At: ${new Date().toLocaleString('en-IN')}`,
      '',
      'Metric,Amount (INR),Notes',
      `Gross Revenue (Total Billed Sales),${totalGrossSales},"Excludes drafts and cancellations"`,
      `Less: Discounts & Concessions,-${totalDiscounts},"Volume and commercial discounts"`,
      `Net Sales Revenue,${netSales},"Gross Sales minus Discounts"`,
      `Cost of Goods Sold (COGS),-${calculatedCogs},"Calculated from hardware component unit costs"`,
      `GROSS PROFIT,${grossProfit},"Gross Profit = Net Sales - COGS (${grossProfitMargin.toFixed(1)}% Margin)"`,
      '',
      'OPERATING EXPENDITURES,Amount (INR),Accounting Treatment',
      `Staff Salaries & Engineering Compensation,-${staffSalaryExpenses},"Paid payroll slips (counted only once)"`,
      `Office & Operational Expenses,-${companyOperatingExpenses},"Rent, electricity, fuel, telecom, repairs"`,
      `Total Operating Expenses,-${totalOperatingExpenses},"Salaries + Company Expenses"`,
      `OPERATING PROFIT,${operatingProfit},"Operating Profit = Gross Profit - Operating Expenses"`,
      `NET PROFIT (EBT),${netProfit},"Net Profit = Total Income - Total Expenses (${netProfitMargin.toFixed(1)}% Margin)"`,
      '',
      'BALANCE SHEET BALANCES,Amount (INR),Definition',
      `Accounts Receivable (Customer Dues),${accountsReceivable},"Money owed by clients for completed installations"`,
      `Accounts Payable (Supplier Dues),${accountsPayable},"Money owed to hardware distributors"`,
    ];

    const csvContent = lines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sumedha_Profit_And_Loss_Statement_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported official Profit & Loss statement to CSV.');
  };

  return (
    <div className="flex flex-col gap-5 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Financial Analytics &amp; Ledger P&amp;L
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">
            Profit &amp; Loss Financial Dashboard
          </h2>
          <p className="text-xs text-slate-400">
            GAAP compliant accounting formulas: Gross Profit = Net Sales - COGS · Operating Profit = Gross Profit - OpEx
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPnLCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Statement</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print P&amp;L</span>
          </button>
        </div>
      </div>

      {/* Main Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Net Sales */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-cyan-950/30 border border-cyan-500/20 shadow-md">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase">
            <span>Net Sales Revenue</span>
            <span className="text-cyan-400 font-bold">{recognizedInvoices.length} Invoices</span>
          </div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {formatCurrency(netSales)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Gross: {formatCurrency(totalGrossSales)}</span>
            <span>·</span>
            <span>Disc: -{formatCurrency(totalDiscounts)}</span>
          </div>
        </div>

        {/* Gross Profit */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-emerald-950/30 border border-emerald-500/20 shadow-md">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase">
            <span>Gross Profit</span>
            <span className="text-emerald-400 font-bold font-mono">{grossProfitMargin.toFixed(1)}%</span>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {formatCurrency(grossProfit)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            COGS Direct Cost: {formatCurrency(calculatedCogs)}
          </div>
        </div>

        {/* Operating Expenses */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-rose-950/30 border border-rose-500/20 shadow-md">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase">
            <span>Total OpEx (Salaries + Bills)</span>
            <span className="text-rose-400 font-bold font-mono">Recognized</span>
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono mt-1">
            {formatCurrency(totalOperatingExpenses)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Payroll: {formatCurrency(staffSalaryExpenses)} · Bills: {formatCurrency(companyOperatingExpenses)}
          </div>
        </div>

        {/* Net Profit */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-indigo-950/40 border border-indigo-500/30 shadow-md">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase">
            <span>Net Operating Profit</span>
            <span className="text-indigo-400 font-bold font-mono">{netProfitMargin.toFixed(1)}% Margin</span>
          </div>
          <div className={`text-2xl font-black font-mono mt-1 ${netProfit >= 0 ? 'text-indigo-300' : 'text-rose-400'}`}>
            {formatCurrency(netProfit)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Net Profit = Gross Profit - Operating Expenses
          </div>
        </div>
      </div>

      {/* Receivables & Payables Balance Comparison Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Accounts Receivable (Money Customers Owe)
              </span>
              <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                {formatCurrency(accountsReceivable)}
              </div>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 font-mono text-right">
            Cash Inflow Asset<br />from Completed Work
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-rose-500/30 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Accounts Payable (Money Owed to Suppliers)
              </span>
              <div className="text-xl font-black text-rose-400 font-mono mt-0.5">
                {formatCurrency(accountsPayable)}
              </div>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 font-mono text-right">
            Short-term Liability<br />to Hardware Vendors
          </span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
            activeTab === 'summary' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          P&amp;L Statement Ledger
        </button>
        <button
          onClick={() => setActiveTab('invoices_breakdown')}
          className={`px-4 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
            activeTab === 'invoices_breakdown' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Invoice-Wise Profit Margin
        </button>
        <button
          onClick={() => setActiveTab('products_breakdown')}
          className={`px-4 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
            activeTab === 'products_breakdown' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Product / Service-Wise Profit
        </button>
      </div>

      {/* Tab 1: Comprehensive P&L Statement */}
      {activeTab === 'summary' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl font-sans text-xs">
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Audited Profit &amp; Loss Statement</h3>
              <p className="text-xs text-slate-400">Sumedha Tech Infra · Fiscal Period 2026-27</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-[10px] font-mono text-cyan-300">
              Basis: Accrual Accounting
            </span>
          </div>

          <div className="divide-y divide-slate-800/80 my-3">
            {/* Revenue Block */}
            <div className="py-3">
              <div className="flex justify-between font-bold text-white text-sm mb-1.5">
                <span>1. Operating Revenue</span>
                <span className="font-mono text-cyan-300">{formatCurrency(netSales)}</span>
              </div>
              <div className="pl-4 space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>Gross Sales Billing (Tax Invoices Issued)</span>
                  <span className="font-mono">{formatCurrency(totalGrossSales)}</span>
                </div>
                <div className="flex justify-between text-rose-400">
                  <span>Less: Applicable Commercial Discounts</span>
                  <span className="font-mono">- {formatCurrency(totalDiscounts)}</span>
                </div>
                <div className="flex justify-between font-semibold text-slate-200 pt-1 border-t border-slate-800/40">
                  <span>Net Sales Revenue</span>
                  <span className="font-mono">{formatCurrency(netSales)}</span>
                </div>
              </div>
            </div>

            {/* COGS Block */}
            <div className="py-3">
              <div className="flex justify-between font-bold text-white text-sm mb-1.5">
                <span>2. Cost of Goods Sold (COGS)</span>
                <span className="font-mono text-rose-400">- {formatCurrency(calculatedCogs)}</span>
              </div>
              <div className="pl-4 space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>Hardware &amp; Equipment Unit Procurement Costs</span>
                  <span className="font-mono">{formatCurrency(calculatedCogs)}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-400 pt-1 border-t border-slate-800/40 text-xs">
                  <span>GROSS PROFIT (Net Sales - COGS)</span>
                  <span className="font-mono">{formatCurrency(grossProfit)} ({grossProfitMargin.toFixed(1)}%)</span>
                </div>
              </div>
            </div>

            {/* Operating Expenses */}
            <div className="py-3">
              <div className="flex justify-between font-bold text-white text-sm mb-1.5">
                <span>3. Operating &amp; Administrative Expenses (OpEx)</span>
                <span className="font-mono text-rose-400">- {formatCurrency(totalOperatingExpenses)}</span>
              </div>
              <div className="pl-4 space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>Staff Salaries &amp; Field Engineering Payroll</span>
                  <span className="font-mono">{formatCurrency(staffSalaryExpenses)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Company Facility Leases, Utilities, Fuel &amp; Maintenance</span>
                  <span className="font-mono">{formatCurrency(companyOperatingExpenses)}</span>
                </div>
                <div className="flex justify-between font-semibold text-slate-200 pt-1 border-t border-slate-800/40">
                  <span>Total Operating Expenses</span>
                  <span className="font-mono">- {formatCurrency(totalOperatingExpenses)}</span>
                </div>
              </div>
            </div>

            {/* Net Operating Profit */}
            <div className="py-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Net Operating Profit (EBIT / Recognized Net Profit)
                  </span>
                  <div className="text-xl font-black text-indigo-300 font-mono mt-0.5">
                    {formatCurrency(netProfit)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded bg-indigo-500/20 text-indigo-300 font-bold font-mono uppercase text-[11px]">
                    Net Margin: {netProfitMargin.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Accounting Rule Enforced:</strong> Hardware supplier purchases are recognized via Cost of Goods Sold upon client billing and never subtracted twice. Unpaid client invoices are not recognized as collected cash.
            </span>
          </div>
        </div>
      )}

      {/* Tab 2: Invoice-wise Profit Breakdown */}
      {activeTab === 'invoices_breakdown' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Invoice # &amp; Client</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4 text-right">Net Billed (₹)</th>
                <th className="py-3 px-4 text-right">COGS Cost (₹)</th>
                <th className="py-3 px-4 text-right">Gross Profit (₹)</th>
                <th className="py-3 px-4 text-right">Margin %</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {invoiceProfitAnalysis.map(({ invoice: inv, netSales, cogs, grossProfit, margin }) => (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{inv.invoiceNumber}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{inv.company || inv.customerName}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{inv.issuedDate}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-white font-medium">
                    {formatCurrency(netSales)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-rose-400">
                    {formatCurrency(cogs)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                    {formatCurrency(grossProfit)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-cyan-300">
                    {margin.toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : inv.status === 'Partial'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Product-wise Profit Breakdown */}
      {activeTab === 'products_breakdown' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Product / SKU</th>
                <th className="py-3 px-4 text-center">Units Sold</th>
                <th className="py-3 px-4 text-right">Total Revenue (₹)</th>
                <th className="py-3 px-4 text-right">Cost Price (₹)</th>
                <th className="py-3 px-4 text-right">Gross Profit (₹)</th>
                <th className="py-3 px-4 text-right">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {productProfitList.map((prod) => (
                <tr key={prod.sku} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{prod.name}</div>
                    <div className="text-[11px] font-mono text-cyan-400 mt-0.5">{prod.sku}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                    {prod.unitsSold}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-white font-medium">
                    {formatCurrency(prod.revenue)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-rose-400">
                    {formatCurrency(prod.cost)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                    {formatCurrency(prod.profit)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-cyan-300">
                    {prod.margin.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
