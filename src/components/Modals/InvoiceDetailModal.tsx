import React, { useState } from 'react';
import { Invoice, PaymentRecord, SystemSettings } from '../../types';
import {
  X,
  Printer,
  Download,
  CreditCard,
  Ban,
  ArrowRightLeft,
  FileCheck2,
  FileText,
  History,
  Check,
  Plus,
  Share2,
} from 'lucide-react';
import { DocumentViewer } from '../Document/DocumentViewer';

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  settings: SystemSettings;
  onRecordPayment: (invoiceId: string, payment: PaymentRecord) => void;
  onCancelInvoice: (invoiceId: string, reason: string) => void;
  onEditDraft?: (invoice: Invoice) => void;
  onConvertToInvoice?: (quotation: Invoice, targetDocType: 'invoice_with_gst' | 'invoice_without_gst') => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  invoice,
  isOpen,
  onClose,
  settings,
  onRecordPayment,
  onCancelInvoice,
  onEditDraft,
  onConvertToInvoice,
}) => {
  const [activeTab, setActiveTab] = useState<'document' | 'payments' | 'audit'>('document');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Payment form states
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentRecord['method']>('UPI');
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  if (!isOpen || !invoice) return null;

  const isQuotation = invoice.docType === 'quotation_without_gst' || invoice.docType === 'quotation_with_gst';
  const balanceDue = invoice.balanceDue ?? (invoice.status === 'Paid' ? 0 : invoice.totalAmount - (invoice.paidAmount || 0));

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${isQuotation ? 'Quotation' : 'Invoice'} - ${invoice.invoiceNumber || invoice.id}`,
        text: `Sumedha Tech Infra ${isQuotation ? 'Price Proposal' : 'Invoice'} for ${invoice.customerName}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Document link copied to clipboard!');
    }
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(paymentAmount);
    if (!amt || amt <= 0) return;

    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      amount: amt,
      method: paymentMethod,
      referenceNumber: paymentRef.trim() || undefined,
      notes: paymentNotes.trim() || undefined,
      recordedBy: 'Hardik Patel',
    };

    onRecordPayment(invoice.id, newPayment);
    setShowPaymentForm(false);
    setPaymentAmount('');
    setPaymentRef('');
    setPaymentNotes('');
  };

  const handleConfirmCancel = () => {
    if (!cancelReason.trim()) return;
    onCancelInvoice(invoice.id, cancelReason.trim());
    setShowCancelPrompt(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[96vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 overflow-hidden">
        {/* Top Control Bar (Non-Printable) */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 bg-slate-950 border-b border-slate-800 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('document')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'document'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isQuotation ? 'Quotation PDF' : 'Invoice PDF'}</span>
            </button>

            {!isQuotation && (
              <button
                onClick={() => setActiveTab('payments')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'payments'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Payments ({invoice.payments?.length || 0})</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'audit'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Audit Trail</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Convert Quotation to Invoice Action */}
            {isQuotation && onConvertToInvoice && invoice.status !== 'Cancelled' && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onConvertToInvoice(invoice, 'invoice_with_gst')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Generate a GST Tax Invoice from this quotation"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Convert to GST Invoice</span>
                  <span className="sm:hidden">To Invoice</span>
                </button>
              </div>
            )}

            {/* Record Payment Button (for Invoices only) */}
            {!isQuotation && invoice.status !== 'Paid' && invoice.status !== 'Cancelled' && (
              <button
                onClick={() => setShowPaymentForm(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Record Payment</span>
                <span className="sm:hidden">Pay</span>
              </button>
            )}

            {/* Print & Download Buttons */}
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={handleDownloadPDF}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Save as PDF"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Share Document"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Cancel Document (Audit Protected) */}
            {invoice.status !== 'Cancelled' && (
              <button
                onClick={() => setShowCancelPrompt(true)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 border border-slate-700 hover:border-rose-500/40 text-rose-400 transition-colors"
                title="Cancel Document (Audit Protected)"
              >
                <Ban className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-950/60">
          {activeTab === 'document' && (
            <div className="flex flex-col items-center">
              {/* If converted, show linkage banner */}
              {invoice.linkedQuotationId && (
                <div className="w-full max-w-[210mm] mb-3 p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs flex items-center justify-between print:hidden">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
                    <span>
                      Generated from Quotation <strong>#{invoice.linkedQuotationId}</strong>. Original quotation preserved.
                    </span>
                  </div>
                </div>
              )}

              {/* Document Sheet Container */}
              <DocumentViewer
                invoice={invoice}
                companyProfile={settings.companyProfile}
                billingConfig={settings.billingConfig}
              />
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-400 block font-mono uppercase">Outstanding Balance</span>
                  <span className="text-2xl font-bold font-mono text-rose-400">
                    ₹{balanceDue.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-mono uppercase text-right">Settled Amount</span>
                  <span className="text-2xl font-bold font-mono text-emerald-400 text-right">
                    ₹{(invoice.paidAmount || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase text-slate-400">Payment Transactions</h4>
                {invoice.payments && invoice.payments.length > 0 ? (
                  invoice.payments.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {p.method}
                          </span>
                          <span className="text-xs font-bold text-white">
                            ₹{p.amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          Date: {p.date} {p.referenceNumber && `· Ref: ${p.referenceNumber}`}
                        </div>
                        {p.notes && <div className="text-[11px] text-slate-500 italic mt-0.5">{p.notes}</div>}
                      </div>
                      <div className="text-right text-[10px] text-slate-500 font-mono">
                        Logged by {p.recordedBy}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-500 text-xs">
                    No payment entries recorded yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="max-w-2xl mx-auto space-y-3">
              <h4 className="text-xs font-mono uppercase text-slate-400">Authorized Audit Trail</h4>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                {invoice.auditLogs && invoice.auditLogs.length > 0 ? (
                  invoice.auditLogs.map((log) => (
                    <div key={log.id} className="pb-3 border-b border-slate-800 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-cyan-300">{log.action}</span>
                        <span className="text-slate-500 font-mono text-[10px]">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{log.details}</p>
                      <span className="text-[10px] text-slate-500 font-mono">Actor: {log.actor}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-500 italic">No audit records found.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Record Payment Sub-Modal */}
        {showPaymentForm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl">
              <h3 className="text-base font-bold text-white mb-1">Record Payment Receipt</h3>
              <p className="text-xs text-slate-400 mb-4">
                Remaining outstanding balance: <strong className="text-rose-400">₹{balanceDue.toLocaleString('en-IN')}</strong>
              </p>

              <form onSubmit={handleSavePayment} className="space-y-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={balanceDue}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder={`Max ₹${balanceDue}`}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentRecord['method'])}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                    <option value="NEFT/RTGS">NEFT / RTGS / IMPS Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Cash">Cash Receipt</option>
                    <option value="Card">Debit / Credit Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    UTR / Cheque / Transaction Ref (optional)
                  </label>
                  <input
                    type="text"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    placeholder="e.g. UTR/AXIS/4091823"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Notes (optional)</label>
                  <input
                    type="text"
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    placeholder="e.g. Part payment received via corporate account"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowPaymentForm(false)}
                    className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                  >
                    Save Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Cancel Document Prompt */}
        {showCancelPrompt && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl">
              <h3 className="text-base font-bold text-rose-400 mb-1">Cancel Document</h3>
              <p className="text-xs text-slate-400 mb-3">
                Invoices and quotations cannot be permanently deleted. This cancellation will be permanently logged in the audit ledger.
              </p>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Reason for Cancellation (Required)
                </label>
                <textarea
                  rows={3}
                  required
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Customer cancelled order / Re-issuing revised invoice with updated GSTIN"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-rose-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCancelPrompt(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-400 hover:text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={!cancelReason.trim()}
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs disabled:opacity-50"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
