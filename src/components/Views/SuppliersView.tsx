import React, { useState } from 'react';
import { Supplier, SupplierPayment, PurchaseInvoice } from '../../types';
import {
  Truck,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Building2,
  Receipt,
  CreditCard,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  IndianRupee,
  Calendar,
  X,
  FileText,
  AlertTriangle,
} from 'lucide-react';

interface SuppliersViewProps {
  suppliers: Supplier[];
  supplierPayments: SupplierPayment[];
  purchases: PurchaseInvoice[];
  onAddSupplier: () => void;
  onEditSupplier: (supplier: Supplier) => void;
  onRecordPayment: (supplier: Supplier) => void;
  onArchiveSupplier: (supplierId: string) => void;
  showToast: (msg: string) => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  suppliers,
  supplierPayments,
  purchases,
  onAddSupplier,
  onEditSupplier,
  onRecordPayment,
  onArchiveSupplier,
  showToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('active');
  const [selectedSupplierForLedger, setSelectedSupplierForLedger] = useState<Supplier | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const filteredSuppliers = suppliers.filter((sup) => {
    const matchesSearch =
      sup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sup.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sup.supplierCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sup.gstin && sup.gstin.toLowerCase().includes(searchTerm.toLowerCase())) ||
      sup.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || sup.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOutstandingPayable = suppliers
    .filter((s) => s.status === 'active')
    .reduce((acc, s) => acc + (s.outstandingPayable || 0), 0);

  const totalPurchasesYTD = suppliers.reduce((acc, s) => acc + (s.totalPurchased || 0), 0);
  const totalPaidYTD = suppliers.reduce((acc, s) => acc + (s.totalPaid || 0), 0);

  const handleExportSuppliersCSV = () => {
    const headers = [
      'Code',
      'Supplier Name',
      'Company',
      'Contact Person',
      'Phone',
      'Email',
      'City',
      'GSTIN',
      'Total Purchased (INR)',
      'Total Paid (INR)',
      'Outstanding Payable (INR)',
      'Status',
    ];
    const rows = filteredSuppliers.map((s) => [
      s.supplierCode,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.company.replace(/"/g, '""')}"`,
      `"${s.contactPerson.replace(/"/g, '""')}"`,
      `"${s.phone}"`,
      `"${s.email}"`,
      `"${s.city}"`,
      `"${s.gstin || ''}"`,
      s.totalPurchased || 0,
      s.totalPaid || 0,
      s.outstandingPayable || 0,
      s.status,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sumedha_Suppliers_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported suppliers directory to CSV.');
  };

  return (
    <div className="flex flex-col gap-5 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Truck className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
              Procurement &amp; Supply Chain
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">
            Vendor &amp; Supplier Management
          </h2>
          <p className="text-xs text-slate-400">
            Hardware distributors, component purchase invoices, supplier ledgers, and accounts payable
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSuppliersCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onAddSupplier}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vendor</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-indigo-950/30 border border-indigo-500/20 shadow-md">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Total Accounts Payable
          </span>
          <div className="text-xl font-extrabold text-rose-400 font-mono mt-1">
            {formatCurrency(totalOutstandingPayable)}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Money currently owed to hardware vendors</p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/40 border border-slate-800 shadow-md">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Total Procured YTD
          </span>
          <div className="text-xl font-extrabold text-cyan-300 font-mono mt-1">
            {formatCurrency(totalPurchasesYTD)}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Total recognized purchase billing value</p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-emerald-950/20 border border-emerald-500/20 shadow-md">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Total Paid to Vendors
          </span>
          <div className="text-xl font-extrabold text-emerald-400 font-mono mt-1">
            {formatCurrency(totalPaidYTD)}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Disbursed via verified NEFT, UPI &amp; Cheque</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vendor name, code, GSTIN, city..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-indigo-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'active' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Active ({suppliers.filter((s) => s.status === 'active').length})
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({suppliers.length})
            </button>
          </div>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4">Supplier &amp; Code</th>
              <th className="py-3 px-4">Contact Person</th>
              <th className="py-3 px-4">GSTIN &amp; City</th>
              <th className="py-3 px-4">Catalog / Supplies</th>
              <th className="py-3 px-4 text-right">Total Purchased</th>
              <th className="py-3 px-4 text-right">Outstanding Payable</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredSuppliers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-500">
                  <Truck className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  <p className="text-sm font-semibold text-slate-400">No suppliers found</p>
                  <p className="text-xs text-slate-500 mt-0.5">Add hardware vendors to track purchase invoices &amp; accounts payable.</p>
                </td>
              </tr>
            ) : (
              filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-sm">{supplier.company}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-indigo-400 font-semibold">{supplier.supplierCode}</span>
                      <span>·</span>
                      <span>{supplier.name}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">
                    <div>{supplier.contactPerson}</div>
                    <div className="text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{supplier.phone}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">
                    <div className="font-mono text-cyan-300">{supplier.gstin || 'Unregistered'}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{supplier.city}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {supplier.productsServicesPurchased?.slice(0, 2).map((item, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/60 text-[10px] text-slate-300 font-medium"
                        >
                          {item}
                        </span>
                      ))}
                      {(supplier.productsServicesPurchased?.length || 0) > 2 && (
                        <span className="text-[10px] text-slate-500 self-center">
                          +{supplier.productsServicesPurchased.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                    {formatCurrency(supplier.totalPurchased || 0)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div
                      className={`font-mono font-bold text-sm ${
                        (supplier.outstandingPayable || 0) > 0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {formatCurrency(supplier.outstandingPayable || 0)}
                    </div>
                    {(supplier.outstandingPayable || 0) > 0 && (
                      <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-mono bg-rose-500/15 text-rose-300 border border-rose-500/25 mt-0.5">
                        Due in {supplier.paymentTermsDays || 30}d
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onRecordPayment(supplier)}
                        title="Record Payment to Supplier"
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <CreditCard className="w-3 h-3" />
                        <span>Pay</span>
                      </button>

                      <button
                        onClick={() => setSelectedSupplierForLedger(supplier)}
                        title="View Supplier Ledger &amp; Purchase History"
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onEditSupplier(supplier)}
                        title="Edit Supplier"
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Supplier Ledger Modal */}
      {selectedSupplierForLedger && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-indigo-400 font-bold">
                    {selectedSupplierForLedger.supplierCode}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs text-slate-400">Statement of Account</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {selectedSupplierForLedger.company}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedSupplierForLedger.contactPerson} · {selectedSupplierForLedger.phone} · GSTIN:{' '}
                  {selectedSupplierForLedger.gstin || 'N/A'}
                </p>
              </div>
              <button
                onClick={() => setSelectedSupplierForLedger(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Total Billed</span>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  {formatCurrency(selectedSupplierForLedger.totalPurchased || 0)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Total Paid</span>
                <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                  {formatCurrency(selectedSupplierForLedger.totalPaid || 0)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/30">
                <span className="text-[10px] text-rose-400 uppercase font-mono">Payable Balance</span>
                <div className="text-sm font-bold text-rose-400 font-mono mt-0.5">
                  {formatCurrency(selectedSupplierForLedger.outstandingPayable || 0)}
                </div>
              </div>
            </div>

            {/* Purchases history */}
            <div className="mt-5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-2 flex items-center justify-between">
                <span>Purchase Invoices</span>
                <span className="text-slate-400 font-normal">
                  {purchases.filter((p) => p.supplierId === selectedSupplierForLedger.id).length} records
                </span>
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {purchases.filter((p) => p.supplierId === selectedSupplierForLedger.id).length === 0 ? (
                  <p className="text-xs text-slate-500 py-3 text-center">No purchases recorded yet</p>
                ) : (
                  purchases
                    .filter((p) => p.supplierId === selectedSupplierForLedger.id)
                    .map((pur) => (
                      <div
                        key={pur.id}
                        className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-white">{pur.purchaseNumber}</div>
                          <div className="text-[11px] text-slate-500">
                            Date: {pur.purchaseDate} · Bill: {pur.billNumber || 'N/A'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-white">
                            {formatCurrency(pur.totalAmount)}
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                              pur.paymentStatus === 'paid'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {pur.paymentStatus.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Payments history */}
            <div className="mt-5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-2 flex items-center justify-between">
                <span>Payment Disbursement History</span>
                <span className="text-slate-400 font-normal">
                  {supplierPayments.filter((p) => p.supplierId === selectedSupplierForLedger.id).length} payments
                </span>
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {supplierPayments.filter((p) => p.supplierId === selectedSupplierForLedger.id).length === 0 ? (
                  <p className="text-xs text-slate-500 py-3 text-center">No payment disbursements recorded</p>
                ) : (
                  supplierPayments
                    .filter((p) => p.supplierId === selectedSupplierForLedger.id)
                    .map((spay) => (
                      <div
                        key={spay.id}
                        className="p-3 rounded-xl bg-slate-950/70 border border-emerald-500/20 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-emerald-300">{formatCurrency(spay.amount)}</div>
                          <div className="text-[11px] text-slate-500">
                            {spay.date} via {spay.method} · Ref: {spay.referenceNumber}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400">By {spay.recordedBy}</span>
                      </div>
                    ))
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedSupplierForLedger(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white cursor-pointer"
              >
                Close Statement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
