import React, { useState } from 'react';
import { DocumentType, Invoice } from '../../types';
import {
  CreditCard,
  Plus,
  Search,
  FileText,
  Printer,
  ChevronDown,
} from 'lucide-react';

interface BillingViewProps {
  invoices: Invoice[];
  onCreateDocument: (docType?: DocumentType) => void;
  onOpenInvoiceDetail: (invoice: Invoice) => void;
  onUpdateInvoiceStatus: (invoiceId: string, status: Invoice['status']) => void;
}

export const BillingView: React.FC<BillingViewProps> = ({
  invoices,
  onCreateDocument,
  onOpenInvoiceDetail,
}) => {
  const [filter, setFilter] = useState<
    'all' | 'quotations' | 'invoices_gst' | 'invoices_nongst' | 'Paid' | 'Pending' | 'Draft'
  >('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const filteredInvoices = invoices.filter((inv) => {
    // Category filters
    if (filter === 'quotations') {
      if (inv.docType !== 'quotation_without_gst' && inv.docType !== 'quotation_with_gst') {
        return false;
      }
    } else if (filter === 'invoices_gst') {
      if (inv.docType !== 'invoice_with_gst') return false;
    } else if (filter === 'invoices_nongst') {
      if (inv.docType !== 'invoice_without_gst') return false;
    } else if (filter !== 'all') {
      if (inv.status !== filter) return false;
    }

    const docNum = inv.invoiceNumber || inv.quoteNumber || inv.id;
    const matchesSearch =
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      docNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalBilled = invoices
    .filter((inv) => inv.status !== 'Cancelled')
    .reduce((acc, inv) => acc + inv.totalAmount, 0);

  const totalPaid = invoices
    .filter((inv) => inv.status !== 'Cancelled')
    .reduce(
      (acc, inv) => acc + (inv.paidAmount || (inv.status === 'Paid' ? inv.totalAmount : 0)),
      0
    );

  const totalPending = totalBilled - totalPaid;
  const totalTax = invoices
    .filter((inv) => inv.status !== 'Cancelled')
    .reduce((acc, inv) => acc + inv.taxAmount, 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getDocTypeBadge = (inv: Invoice) => {
    switch (inv.docType) {
      case 'quotation_without_gst':
        return {
          label: 'Quotation (No GST)',
          color: 'bg-blue-950/80 text-blue-300 border-blue-500/40',
          indicator: 'bg-blue-500',
        };
      case 'quotation_with_gst':
        return {
          label: 'Quotation (18% GST)',
          color: 'bg-blue-950/80 text-blue-300 border-blue-500/40',
          indicator: 'bg-blue-400',
        };
      case 'invoice_without_gst':
        return {
          label: 'Invoice (No GST)',
          color: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
          indicator: 'bg-rose-500',
        };
      case 'invoice_with_gst':
      default:
        return {
          label: 'GST Tax Invoice',
          color: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
          indicator: 'bg-rose-400',
        };
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Billing, Invoicing &amp; Quotations</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
              Sumedha Tech Infra
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Official GST invoices, Price proposals, AMC contracts &amp; payment tracking
          </p>
        </div>

        {/* Action Button with 4 Document Type Options */}
        <div className="relative">
          <div className="flex items-center">
            <button
              onClick={() => onCreateDocument()}
              className="px-4 py-2.5 rounded-l-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Document</span>
            </button>
            <button
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="px-2.5 py-2.5 rounded-r-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 border-l border-cyan-700/40 transition-colors"
              title="Select document option"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Document Type Dropdown */}
          {showCreateMenu && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-30 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Select Document Option:
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCreateMenu(false);
                  onCreateDocument('quotation_without_gst');
                }}
                className="w-full p-2 rounded-xl hover:bg-slate-800 text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-blue-300">Quotation Without GST</div>
                  <div className="text-[10px] text-slate-400">Blue Darshanam layout (No tax)</div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 font-mono">
                  Blue
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowCreateMenu(false);
                  onCreateDocument('quotation_with_gst');
                }}
                className="w-full p-2 rounded-xl hover:bg-slate-800 text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-blue-300">Quotation With GST</div>
                  <div className="text-[10px] text-slate-400">Blue layout + 18% Tax column</div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 font-mono">
                  Blue
                </span>
              </button>

              <div className="border-t border-slate-800 my-1" />

              <button
                type="button"
                onClick={() => {
                  setShowCreateMenu(false);
                  onCreateDocument('invoice_without_gst');
                }}
                className="w-full p-2 rounded-xl hover:bg-slate-800 text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-rose-300">Invoice Without GST</div>
                  <div className="text-[10px] text-slate-400">Red Avadh layout (No tax lines)</div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 font-mono">
                  Red
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowCreateMenu(false);
                  onCreateDocument('invoice_with_gst');
                }}
                className="w-full p-2 rounded-xl hover:bg-slate-800 text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-rose-300">Invoice With GST</div>
                  <div className="text-[10px] text-slate-400">Red layout + HSN &amp; 18% GST</div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 font-mono">
                  Red
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0c1527] border border-cyan-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Invoiced</span>
            <CreditCard className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-2xl font-bold font-mono text-white">
              {formatCurrency(totalBilled)}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Across all issued documents</div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0c1527] border border-emerald-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Collected</span>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-2xl font-bold font-mono text-emerald-400">
              {formatCurrency(totalPaid)}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Realized payments</div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0c1527] border border-amber-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Outstanding Balance</span>
            <span className="text-[10px] font-mono text-amber-400">Due</span>
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-2xl font-bold font-mono text-amber-400">
              {formatCurrency(totalPending)}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Pending client remittance</div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0c1527] border border-purple-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>GST Output Tax</span>
            <span className="text-[10px] font-mono text-purple-400">18%</span>
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-2xl font-bold font-mono text-purple-300">
              {formatCurrency(totalTax)}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">CGST 9% + SGST 9% liability</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Documents ({invoices.length})
          </button>
          <button
            onClick={() => setFilter('quotations')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === 'quotations'
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Quotations
          </button>
          <button
            onClick={() => setFilter('invoices_gst')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === 'invoices_gst'
                ? 'bg-rose-600 text-white font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Invoices (With GST)
          </button>
          <button
            onClick={() => setFilter('invoices_nongst')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === 'invoices_nongst'
                ? 'bg-slate-700 text-white font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Invoices (Non-GST)
          </button>
          <button
            onClick={() => setFilter('Pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === 'Pending'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Unpaid
          </button>
          <button
            onClick={() => setFilter('Paid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === 'Paid'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Paid
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by quote #, invoice #, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>
      </div>

      {/* Document Ledger Table / List */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-mono uppercase text-slate-400">
                <th className="py-3 px-4">Document Details</th>
                <th className="py-3 px-4">Client &amp; Facility</th>
                <th className="py-3 px-4">Issued / Due Date</th>
                <th className="py-3 px-4 text-right">Taxable &amp; Tax</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => {
                  const badge = getDocTypeBadge(inv);
                  const docNum = inv.invoiceNumber || inv.quoteNumber || inv.id;
                  const isQuote =
                    inv.docType === 'quotation_without_gst' ||
                    inv.docType === 'quotation_with_gst';

                  return (
                    <tr
                      key={inv.id}
                      onClick={() => onOpenInvoiceDetail(inv)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      {/* Document Details & Badge */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold font-mono border ${badge.color}`}
                          >
                            {badge.label}
                          </span>
                        </div>
                        <div className="font-bold text-white font-mono text-xs flex items-center gap-1.5">
                          <span>{docNum}</span>
                          {inv.ticketId && (
                            <span className="text-[10px] text-cyan-400 font-normal">
                              (Ticket #{inv.ticketId})
                            </span>
                          )}
                        </div>
                        {inv.linkedQuotationId && (
                          <div className="text-[9.5px] text-slate-400 mt-0.5">
                            From Quote: #{inv.linkedQuotationId}
                          </div>
                        )}
                      </td>

                      {/* Client */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">{inv.customerName}</div>
                        <div className="text-[11px] text-slate-400">{inv.company}</div>
                        {inv.customerGstin && (
                          <div className="text-[10px] font-mono text-slate-500">
                            GST: {inv.customerGstin}
                          </div>
                        )}
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                        <div>
                          Issued: <span className="text-slate-200">{inv.issuedDate}</span>
                        </div>
                        <div>
                          {isQuote ? 'Valid:' : 'Due:'}{' '}
                          <span className="text-slate-300">
                            {isQuote ? inv.validUntil || inv.dueDate : inv.dueDate}
                          </span>
                        </div>
                      </td>

                      {/* Tax Breakdown */}
                      <td className="py-3.5 px-4 text-right font-mono">
                        <div className="text-slate-300">₹{inv.amount.toLocaleString('en-IN')}</div>
                        {inv.taxAmount > 0 ? (
                          <div className="text-[10px] text-purple-400">
                            + ₹{inv.taxAmount.toLocaleString('en-IN')} (GST)
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-500 italic">No Tax</div>
                        )}
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 px-4 text-right font-mono">
                        <div className="text-sm font-bold text-cyan-300">
                          ₹{inv.totalAmount.toLocaleString('en-IN')}
                        </div>
                        {inv.balanceDue !== undefined && inv.balanceDue > 0 && (
                          <div className="text-[10px] text-rose-400">
                            Due: ₹{inv.balanceDue.toLocaleString('en-IN')}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10.5px] font-bold ${
                            inv.status === 'Paid'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : inv.status === 'Partial'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : inv.status === 'Cancelled'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                              : inv.status === 'Accepted'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onOpenInvoiceDetail(inv)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="View Document"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              onOpenInvoiceDetail(inv);
                              setTimeout(() => window.print(), 300);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Print PDF"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No matching documents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
