import React from 'react';
import { Customer, Invoice, Ticket } from '../../types';
import {
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Wrench,
  Receipt,
  Edit2,
  Trash2,
  ExternalLink,
  Plus,
  AlertCircle,
  Archive,
} from 'lucide-react';
import { EquipmentIcon, getEquipmentLabel } from '../EquipmentIcon';

interface CustomerDetailModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  tickets: Ticket[];
  invoices: Invoice[];
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customer: Customer) => void;
  onNewTicketForCustomer?: (customer: Customer) => void;
  onNewInvoiceForCustomer?: (customer: Customer) => void;
  onOpenTicketDetail?: (ticket: Ticket) => void;
  onOpenInvoiceDetail?: (invoice: Invoice) => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  isOpen,
  onClose,
  tickets,
  invoices,
  onEditCustomer,
  onDeleteCustomer,
  onNewTicketForCustomer,
  onNewInvoiceForCustomer,
  onOpenTicketDetail,
  onOpenInvoiceDetail,
}) => {
  if (!isOpen || !customer) return null;

  const customerTickets = tickets.filter(
    (t) => t.customerId === customer.id || t.customerName.toLowerCase() === customer.name.toLowerCase()
  );

  const customerInvoices = invoices.filter(
    (inv) => inv.customerId === customer.id || inv.customerName.toLowerCase() === customer.name.toLowerCase()
  );

  const openingBal = customer.openingBalance || 0;
  const creditLimit = customer.creditLimit || 100000;
  const totalBilled = customerInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalPaid = customerInvoices.reduce((acc, inv) => acc + (inv.paidAmount || (inv.status === 'Paid' ? inv.totalAmount : 0)), 0);
  const balanceDue = openingBal + totalBilled - totalPaid;
  const creditAvailable = Math.max(0, creditLimit - balanceDue);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-cyan-500/30 p-6 shadow-2xl text-slate-100 scrollbar-thin">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                  {customer.amcStatus}
                </span>
                {customer.status === 'archived' && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase">
                    Archived
                  </span>
                )}
                <span className="text-xs font-mono text-slate-400">ID: {customer.id}</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">{customer.name}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>{customer.company}</span>
                <span>·</span>
                <span className="text-emerald-400 font-mono">AMC Expires: {customer.amcExpiryDate}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditCustomer(customer)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition cursor-pointer"
              title="Edit Client Information"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteCustomer(customer)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-400 border border-slate-700 transition cursor-pointer"
              title="Delete or Archive Client"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 my-4">
          <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Opening Bal</span>
            <div className="text-xs sm:text-sm font-bold text-slate-300 mt-0.5">₹{openingBal.toLocaleString('en-IN')}</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Total Billed</span>
            <div className="text-xs sm:text-sm font-bold text-white mt-0.5">₹{totalBilled.toLocaleString('en-IN')}</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Total Paid</span>
            <div className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5">₹{totalPaid.toLocaleString('en-IN')}</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Balance Due</span>
            <div className={`text-xs sm:text-sm font-bold mt-0.5 ${balanceDue > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              ₹{balanceDue.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Credit Limit</span>
            <div className="text-xs sm:text-sm font-bold text-cyan-300 mt-0.5">₹{creditLimit.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider font-mono">
              Contact &amp; Location
            </h4>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-slate-500 w-24">Contact Person:</span>
              <span className="text-white font-medium">{customer.contactPerson}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-slate-500 w-24">Phone:</span>
              <a href={`tel:${customer.phone}`} className="text-cyan-400 hover:underline">
                {customer.phone}
              </a>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-slate-500 w-24">Email:</span>
              <a href={`mailto:${customer.email}`} className="text-cyan-400 hover:underline">
                {customer.email}
              </a>
            </div>
            <div className="flex items-start gap-2 text-slate-300">
              <span className="text-slate-500 w-24 shrink-0">Address:</span>
              <span>{customer.address}, {customer.city}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider font-mono">
              Tax &amp; Account Notes
            </h4>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-slate-500 w-20">GSTIN:</span>
              <span className="font-mono text-cyan-300 font-semibold">{customer.gstin || '24AAACS1234F1Z8'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-slate-500 w-20">AMC Expiry:</span>
              <span className="font-mono text-emerald-400">{customer.amcExpiryDate}</span>
            </div>
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-slate-500 block mb-1">Operational Notes:</span>
              <p className="text-slate-300 italic leading-relaxed">
                {customer.notes || 'Full maintenance coverage for all networked terminals, IP CCTV cams and fiber switches.'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {onNewTicketForCustomer && (
            <button
              onClick={() => {
                onClose();
                onNewTicketForCustomer(customer);
              }}
              className="px-3.5 py-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Dispatch Service Ticket</span>
            </button>
          )}

          {onNewInvoiceForCustomer && (
            <button
              onClick={() => {
                onClose();
                onNewInvoiceForCustomer(customer);
              }}
              className="px-3.5 py-2 rounded-xl bg-teal-950 border border-teal-500/40 text-teal-300 hover:bg-teal-900 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Generate Tax Invoice</span>
            </button>
          )}
        </div>

        {/* Section 1: Service Task History */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                <span>Service Task History ({customerTickets.length})</span>
              </h4>
            </div>

            <div className="space-y-2">
              {customerTickets.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500">
                  No service tickets recorded for this client.
                </div>
              ) : (
                customerTickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onOpenTicketDetail && onOpenTicketDetail(t)}
                    className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 transition flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
                        <EquipmentIcon type={t.equipmentType} size="sm" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-cyan-400 font-bold text-xs">{t.id}</span>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                              t.priority === 'urgent' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {t.priority}
                          </span>
                        </div>
                        <h5 className="text-xs font-semibold text-white mt-0.5 line-clamp-1">{t.title}</h5>
                        <p className="text-[10px] text-slate-400">Assigned: {t.technicianName} · {t.createdAt}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          t.status === 'solved'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : t.status === 'in_progress'
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {t.status.replace('_', ' ')}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section 2: Invoice History */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-mono flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-teal-400" />
              <span>Invoice &amp; Billing History ({customerInvoices.length})</span>
            </h4>

            <div className="space-y-2">
              {customerInvoices.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500">
                  No billing invoices issued yet.
                </div>
              ) : (
                customerInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => onOpenInvoiceDetail && onOpenInvoiceDetail(inv)}
                    className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 transition flex items-center justify-between text-xs cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-cyan-300 font-bold">{inv.invoiceNumber || inv.id}</span>
                        <span className="text-slate-500 font-mono text-[11px]">{inv.issuedDate}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {inv.items?.length || 1} line item(s) · Due: {inv.dueDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold text-white">₹{inv.totalAmount.toLocaleString('en-IN')}</div>
                        {inv.balanceDue && inv.balanceDue > 0 ? (
                          <span className="text-[10px] text-amber-400 font-mono">Bal: ₹{inv.balanceDue.toLocaleString('en-IN')}</span>
                        ) : null}
                      </div>

                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : inv.status === 'Partial'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {inv.status}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-5 mt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
