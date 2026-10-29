import React, { useState, useEffect } from 'react';
import { Customer, DocumentType, Invoice, InvoiceLineItem, SystemSettings, Ticket } from '../../types';
import {
  X,
  Plus,
  Trash2,
  Check,
  Receipt,
  FileText,
  Eye,
  Sliders,
  Sparkles,
  Building2,
  User,
} from 'lucide-react';
import { DocumentViewer } from '../Document/DocumentViewer';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  tickets: Ticket[];
  settings?: SystemSettings;
  onCreateInvoice: (invoice: Invoice) => void;
  preselectedCustomerId?: string;
  initialDocType?: DocumentType;
}

// Preset products catalog from the reference PDFs and IT service inventory
const INVENTORY_PRESETS = [
  {
    name: 'DAHUA Nvr 4216-4KS3',
    hsn: '852190',
    type: 'equipment' as const,
    price: 8600,
    serials: 'AL03F6DPCA36E19',
  },
  {
    name: 'Dahua 2MP IP Silver Bullet Camera IPC-HFW1230TL2-A',
    hsn: '85258020',
    type: 'equipment' as const,
    price: 3100,
    serials: 'AE0BA49PCA18E89, AE0BA49PCA18D58',
  },
  {
    name: 'Dahua Hdcvi Dome Camera Dh-Ipc-Hdw1330t1p-S4',
    hsn: '85258090',
    type: 'equipment' as const,
    price: 3050,
    serials: '8G00550PCA1C925, 8G00550PCA1C264',
  },
  {
    name: 'Hard Disk 2TB Sata - 2 Years',
    hsn: '847170',
    type: 'spare_parts' as const,
    price: 11800,
    serials: 'WCC6Y4KXTG6B',
  },
  {
    name: 'Hard Disk 4TB Sata - 2 Years',
    hsn: '847170',
    type: 'spare_parts' as const,
    price: 15700,
    serials: 'WCC7K0PYFY6F',
  },
  {
    name: 'Tenda Poe Switch 8+2 TE-S110PC',
    hsn: '85176290',
    type: 'equipment' as const,
    price: 2120,
    serials: 'TT070202608001464, TT070202608001461',
  },
  {
    name: 'Cat 6 Cable (Flat for Lift 4 Pair)',
    hsn: '85444999',
    type: 'spare_parts' as const,
    price: 49,
    serials: '',
  },
  {
    name: 'Cat 6 Cable Tenda Copper',
    hsn: '85444299',
    type: 'spare_parts' as const,
    price: 9710,
    serials: '',
  },
  {
    name: '2MP CP Plus Bullet IP Camera',
    hsn: '85258020',
    type: 'equipment' as const,
    price: 3100,
    serials: 'CP-B2026-99182',
  },
  {
    name: '2MP CP Plus Dome IP Camera',
    hsn: '85258090',
    type: 'equipment' as const,
    price: 3050,
    serials: 'CP-D2026-11829',
  },
  {
    name: '8 CH NVR CP Plus',
    hsn: '852190',
    type: 'equipment' as const,
    price: 7600,
    serials: 'CP-NVR-77182',
  },
  {
    name: 'CAT6 Cable 305M box D-Link',
    hsn: '85444999',
    type: 'spare_parts' as const,
    price: 10600,
    serials: '',
  },
  {
    name: '4 Port PoE Switch CP Plus',
    hsn: '85176290',
    type: 'equipment' as const,
    price: 1920,
    serials: 'CP-POE4-8812',
  },
  {
    name: '3U Rack',
    hsn: '85381010',
    type: 'equipment' as const,
    price: 1420,
    serials: '',
  },
  {
    name: '4x4 PVC Box',
    hsn: '39269099',
    type: 'spare_parts' as const,
    price: 60,
    serials: '',
  },
  {
    name: 'NOC Surveillance Installation & Cabling Labour',
    hsn: '998719',
    type: 'labour' as const,
    price: 3500,
    serials: '',
  },
];

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen,
  onClose,
  customers,
  tickets,
  settings,
  onCreateInvoice,
  preselectedCustomerId,
  initialDocType,
}) => {
  const [docType, setDocType] = useState<DocumentType>(initialDocType || 'invoice_with_gst');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const [customerId, setCustomerId] = useState(preselectedCustomerId || customers[0]?.id || '');
  const [docNumber, setDocNumber] = useState('');
  const [customerIdCode, setCustomerIdCode] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState('');
  const [issuedDate, setIssuedDate] = useState('');
  const [dueDateOrValidUntil, setDueDateOrValidUntil] = useState('');
  const [status, setStatus] = useState<'Draft' | 'Pending'>('Pending');
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('');

  const defaultGst = settings?.billingConfig.defaultGstRate || 18;
  const isQuotation = docType === 'quotation_without_gst' || docType === 'quotation_with_gst';
  const isGST = docType === 'quotation_with_gst' || docType === 'invoice_with_gst';

  const [items, setItems] = useState<InvoiceLineItem[]>([
    {
      id: `item-${Date.now()}-1`,
      type: 'equipment',
      description: 'DAHUA Nvr 4216-4KS3',
      hsnSac: '852190',
      serialNumbers: 'AL03F6DPCA36E19',
      qty: 1,
      unitPrice: 8600,
      discountPercent: 0,
      taxPercent: defaultGst,
      total: 8600,
    },
  ]);

  // Update default document numbers and terms whenever docType changes
  useEffect(() => {
    if (!isOpen) return;

    if (preselectedCustomerId) {
      setCustomerId(preselectedCustomerId);
    } else if (customers.length > 0 && !customerId) {
      setCustomerId(customers[0].id);
    }

    const today = new Date().toISOString().split('T')[0];
    setIssuedDate(today);

    const isQuote = docType === 'quotation_without_gst' || docType === 'quotation_with_gst';
    const due = new Date();
    const daysToAdd = isQuote
      ? settings?.billingConfig.defaultQuotationValidityDays || 15
      : settings?.billingConfig.defaultDueDays || 15;
    due.setDate(due.getDate() + daysToAdd);
    setDueDateOrValidUntil(due.toISOString().split('T')[0]);

    // Generate separated sequential number
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');
    const datePrefix = `${day}${month}${year}`;

    if (isQuote) {
      const qPrefix = settings?.billingConfig.quotationPrefix || `${datePrefix}-`;
      const qNum = settings?.billingConfig.nextQuotationNumber || 1;
      setDocNumber(`${qPrefix}${qNum}`);
      setTerms(settings?.billingConfig.quotationTerms || '');
    } else {
      const invPrefix = settings?.billingConfig.invoicePrefix || `${day}/${month}/${year}-`;
      const invNum = settings?.billingConfig.nextInvoiceNumber || 1;
      setDocNumber(`${invPrefix}${invNum}`);
      setTerms(settings?.billingConfig.invoiceTerms || '');
    }
  }, [isOpen, docType, preselectedCustomerId, customers, settings]);

  if (!isOpen) return null;

  const currentCustomer = customers.find((c) => c.id === customerId) || customers[0];

  // Calculation totals
  const subtotal = items.reduce((acc, curr) => acc + curr.unitPrice * curr.qty, 0);
  const discountTotal = items.reduce(
    (acc, curr) => acc + curr.unitPrice * curr.qty * ((curr.discountPercent || 0) / 100),
    0
  );
  const taxableAmount = subtotal - discountTotal;
  const taxAmount = isGST ? Math.round(taxableAmount * (defaultGst / 100)) : 0;
  const grandTotal = taxableAmount + taxAmount;

  const handleAddItem = (preset?: (typeof INVENTORY_PRESETS)[0]) => {
    if (preset) {
      setItems([
        ...items,
        {
          id: `item-${Date.now()}-${items.length + 1}`,
          type: preset.type,
          description: preset.name,
          hsnSac: preset.hsn,
          serialNumbers: preset.serials,
          qty: 1,
          unitPrice: preset.price,
          discountPercent: 0,
          taxPercent: isGST ? defaultGst : 0,
          total: preset.price,
        },
      ]);
    } else {
      setItems([
        ...items,
        {
          id: `item-${Date.now()}-${items.length + 1}`,
          type: 'equipment',
          description: '',
          hsnSac: '',
          serialNumbers: '',
          qty: 1,
          unitPrice: 1000,
          discountPercent: 0,
          taxPercent: isGST ? defaultGst : 0,
          total: 1000,
        },
      ]);
    }
  };

  const handleRemoveItem = (idx: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== idx));
    }
  };

  const handleItemChange = (idx: number, field: keyof InvoiceLineItem, val: string | number) => {
    const updated = [...items];
    const curr = { ...updated[idx] };

    if (field === 'qty') {
      const q = parseFloat(val as string) || 0;
      curr.qty = q;
      curr.total = q * curr.unitPrice * (1 - curr.discountPercent / 100);
    } else if (field === 'unitPrice') {
      const p = parseFloat(val as string) || 0;
      curr.unitPrice = p;
      curr.total = curr.qty * p * (1 - curr.discountPercent / 100);
    } else if (field === 'discountPercent') {
      const d = parseFloat(val as string) || 0;
      curr.discountPercent = d;
      curr.total = curr.qty * curr.unitPrice * (1 - d / 100);
    } else {
      // @ts-expect-error dynamic key assignment
      curr[field] = val;
    }

    updated[idx] = curr;
    setItems(updated);
  };

  const handleSave = (saveStatus: 'Draft' | 'Pending') => {
    if (!currentCustomer) return;

    const newDoc: Invoice = {
      id: `doc-${Date.now()}`,
      docType,
      invoiceNumber: docNumber.trim() || `STI-${Date.now().toString().slice(-4)}`,
      quoteNumber: isQuotation ? docNumber.trim() : undefined,
      customerIdCode: customerIdCode.trim() || currentCustomer.customerIdCode || undefined,
      validUntil: isQuotation ? dueDateOrValidUntil : undefined,
      ticketId: selectedTicketId || undefined,
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      companyId: currentCustomer.companyId,
      company: currentCustomer.company,
      customerGstin: currentCustomer.gstin,
      customerAddress: currentCustomer.address,
      customerCity: currentCustomer.city,
      customerPhone: currentCustomer.phone,
      amount: subtotal,
      discountTotal,
      taxPercent: isGST ? defaultGst : 0,
      taxAmount,
      totalAmount: grandTotal,
      paidAmount: 0,
      balanceDue: grandTotal,
      status: saveStatus === 'Draft' ? 'Draft' : isQuotation ? 'Issued' : 'Pending',
      dueDate: dueDateOrValidUntil,
      issuedDate,
      items,
      notes: notes.trim() || undefined,
      terms: terms.trim() || undefined,
      auditLogs: [
        {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: `${isQuotation ? 'Quotation' : 'Invoice'} Created (${docType})`,
          actor: 'Hardik Patel',
          details: `${isQuotation ? 'Quotation' : 'Invoice'} ${docNumber} issued to ${currentCustomer.name} for ₹${grandTotal.toLocaleString('en-IN')}`,
        },
      ],
    };

    onCreateInvoice(newDoc);
    onClose();
  };

  // Mock invoice object for live document preview
  const previewInvoice: Invoice = {
    id: 'preview-doc',
    docType,
    invoiceNumber: docNumber || 'STI-PREVIEW',
    quoteNumber: isQuotation ? docNumber : undefined,
    customerIdCode: customerIdCode || currentCustomer?.customerIdCode,
    validUntil: isQuotation ? dueDateOrValidUntil : undefined,
    customerId: currentCustomer?.id || 'cust-1',
    customerName: currentCustomer?.name || 'Customer Name',
    company: currentCustomer?.company || 'Company Name',
    customerGstin: currentCustomer?.gstin,
    customerAddress: currentCustomer?.address,
    customerCity: currentCustomer?.city,
    customerPhone: currentCustomer?.phone,
    amount: subtotal,
    discountTotal,
    taxPercent: isGST ? defaultGst : 0,
    taxAmount,
    totalAmount: grandTotal,
    paidAmount: 0,
    balanceDue: grandTotal,
    status: 'Draft',
    dueDate: dueDateOrValidUntil,
    issuedDate,
    items,
    terms,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 overflow-hidden">
        {/* Header with Title & Preview Toggle */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Create New Document</h2>
              <p className="text-xs text-slate-400">
                Choose between GST &amp; Non-GST Quotations or Invoices
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'editor'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Editor</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live PDF Preview</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'preview' ? (
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 overflow-x-auto">
              {settings?.companyProfile && (
                <DocumentViewer
                  invoice={previewInvoice}
                  companyProfile={settings.companyProfile}
                  billingConfig={settings.billingConfig}
                />
              )}
            </div>
          ) : (
            <>
              {/* 1. DOCUMENT TYPE SELECTOR (4 Required Options) */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
                  Select Document Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {/* Option A: Quotation Without GST */}
                  <button
                    type="button"
                    onClick={() => setDocType('quotation_without_gst')}
                    className={`p-3 rounded-2xl border text-left transition-all relative ${
                      docType === 'quotation_without_gst'
                        ? 'bg-blue-950/60 border-blue-400 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-400'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-blue-300">Quotation (Price Proposal)</span>
                      {docType === 'quotation_without_gst' && <Check className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div className="text-[11px] text-slate-400">Without GST</div>
                    <div className="text-[9.5px] text-blue-400/80 mt-1 font-mono">Blue · Darshanam Layout</div>
                  </button>

                  {/* Option B: Quotation With GST */}
                  <button
                    type="button"
                    onClick={() => setDocType('quotation_with_gst')}
                    className={`p-3 rounded-2xl border text-left transition-all relative ${
                      docType === 'quotation_with_gst'
                        ? 'bg-blue-950/60 border-blue-400 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-400'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-blue-300">Quotation (Price Proposal)</span>
                      {docType === 'quotation_with_gst' && <Check className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div className="text-[11px] text-slate-400">With 18% GST</div>
                    <div className="text-[9.5px] text-blue-400/80 mt-1 font-mono">Blue · Darshanam Layout</div>
                  </button>

                  {/* Option C: Invoice Without GST */}
                  <button
                    type="button"
                    onClick={() => setDocType('invoice_without_gst')}
                    className={`p-3 rounded-2xl border text-left transition-all relative ${
                      docType === 'invoice_without_gst'
                        ? 'bg-rose-950/60 border-rose-500 text-white shadow-lg shadow-rose-500/10 ring-1 ring-rose-500'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-rose-300">Commercial Invoice</span>
                      {docType === 'invoice_without_gst' && <Check className="w-4 h-4 text-rose-400" />}
                    </div>
                    <div className="text-[11px] text-slate-400">Without GST</div>
                    <div className="text-[9.5px] text-rose-400/80 mt-1 font-mono">Red · Avadh Layout</div>
                  </button>

                  {/* Option D: Invoice With GST */}
                  <button
                    type="button"
                    onClick={() => setDocType('invoice_with_gst')}
                    className={`p-3 rounded-2xl border text-left transition-all relative ${
                      docType === 'invoice_with_gst'
                        ? 'bg-rose-950/60 border-rose-500 text-white shadow-lg shadow-rose-500/10 ring-1 ring-rose-500'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-rose-300">Tax Invoice (Official)</span>
                      {docType === 'invoice_with_gst' && <Check className="w-4 h-4 text-rose-400" />}
                    </div>
                    <div className="text-[11px] text-slate-400">With 18% GST</div>
                    <div className="text-[9.5px] text-rose-400/80 mt-1 font-mono">Red · Avadh Layout</div>
                  </button>
                </div>
              </div>

              {/* 2. CUSTOMER & METADATA GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="lg:col-span-2">
                  <label className="block text-xs font-mono text-slate-400 mb-1">Client / Customer</label>
                  <select
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.company})
                      </option>
                    ))}
                  </select>
                  {currentCustomer && (
                    <div className="mt-1 text-[11px] text-slate-400">
                      {currentCustomer.address}, {currentCustomer.city}
                      {currentCustomer.gstin && ` · GSTIN: ${currentCustomer.gstin}`}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    {isQuotation ? 'Quotation #' : 'Invoice #'}
                  </label>
                  <input
                    type="text"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Customer ID (optional)</label>
                  <input
                    type="text"
                    value={customerIdCode}
                    onChange={(e) => setCustomerIdCode(e.target.value)}
                    placeholder="e.g. CUST-2026"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Document Date</label>
                  <input
                    type="date"
                    value={issuedDate}
                    onChange={(e) => setIssuedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    {isQuotation ? 'Valid Until' : 'Payment Due Date'}
                  </label>
                  <input
                    type="date"
                    value={dueDateOrValidUntil}
                    onChange={(e) => setDueDateOrValidUntil(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Link Service Ticket (optional)
                  </label>
                  <select
                    value={selectedTicketId}
                    onChange={(e) => setSelectedTicketId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="">No linked ticket (Direct billing)</option>
                    {tickets.map((t) => (
                      <option key={t.id} value={t.id}>
                        #{t.id} - {t.title} ({t.customerName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. PRODUCT & INVENTORY CATALOG QUICK SELECTOR */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Line Items &amp; Equipment</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-mono">
                        {items.length} items
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Add products from catalog presets or enter custom line items
                    </p>
                  </div>

                  {/* Preset quick pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase whitespace-nowrap">
                      Presets:
                    </span>
                    {INVENTORY_PRESETS.slice(0, 5).map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => handleAddItem(preset)}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 hover:text-white border border-slate-700 whitespace-nowrap transition-colors"
                      >
                        + {preset.name.split(' ')[0]} {preset.name.split(' ')[1] || ''}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddItem()}
                      className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1 whitespace-nowrap transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Custom Item</span>
                    </button>
                  </div>
                </div>

                {/* Table of items */}
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-xs text-slate-400 font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-white">Item Details</span>
                        </div>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Remove line item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        {/* Description */}
                        <div className="sm:col-span-5">
                          <label className="block text-[10px] font-mono text-slate-400 mb-1">
                            Description / Model
                          </label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                            placeholder="e.g. DAHUA Nvr 4216-4KS3"
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                          />
                        </div>

                        {/* HSN/SAC */}
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-mono text-slate-400 mb-1">
                            HSN / SAC
                          </label>
                          <input
                            type="text"
                            value={item.hsnSac || ''}
                            onChange={(e) => handleItemChange(idx, 'hsnSac', e.target.value)}
                            placeholder="e.g. 852190"
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                          />
                        </div>

                        {/* Unit Price */}
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-mono text-slate-400 mb-1">
                            Unit Price (₹)
                          </label>
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                          />
                        </div>

                        {/* Quantity */}
                        <div className="sm:col-span-1">
                          <label className="block text-[10px] font-mono text-slate-400 mb-1">Qty</label>
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                            className="w-full px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono text-center focus:border-cyan-400 focus:outline-none"
                          />
                        </div>

                        {/* Line Amount */}
                        <div className="sm:col-span-2 text-right">
                          <label className="block text-[10px] font-mono text-slate-400 mb-1">Amount</label>
                          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-cyan-300">
                            ₹{(item.unitPrice * item.qty).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>

                      {/* Serial Numbers Row (Multi-line or comma-separated as seen in PDF) */}
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-1">
                          Serial Numbers (Listed beneath description in printed document)
                        </label>
                        <input
                          type="text"
                          value={item.serialNumbers || ''}
                          onChange={(e) => handleItemChange(idx, 'serialNumbers', e.target.value)}
                          placeholder="e.g. AL03F6DPCA36E19, AE0BA49PCA18E89 (comma separated)"
                          className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 font-mono italic focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. TOTALS SUMMARY & TERMS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">
                    Terms and Conditions
                  </label>
                  <textarea
                    rows={4}
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    placeholder="Enter document terms and conditions..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none font-sans"
                  />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400 font-mono">Taxable Subtotal:</span>
                    <span className="font-mono text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {isGST ? (
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400 font-mono">GST ({defaultGst}%):</span>
                      <span className="font-mono text-cyan-400">
                        ₹{taxAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400 font-mono">GST Status:</span>
                      <span className="font-mono text-slate-400 italic">Non-GST Document</span>
                    </div>
                  )}

                  <div className="flex justify-between py-2 border-t-2 border-slate-700 text-sm font-bold">
                    <span className="text-white uppercase tracking-wider">Grand Total:</span>
                    <span className="font-mono text-cyan-300">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 bg-slate-950 border-t border-slate-800 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSave('Draft')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave('Pending')}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Issue Document</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
