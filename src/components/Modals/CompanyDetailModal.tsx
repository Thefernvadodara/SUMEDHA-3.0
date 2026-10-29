import React from 'react';
import { Company, Customer, Invoice, Ticket } from '../../types';
import {
  Building2,
  X,
  MapPin,
  Phone,
  Mail,
  Receipt,
  Wrench,
  Users,
  ShieldCheck,
  Edit2,
  CheckCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface CompanyDetailModalProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  tickets: Ticket[];
  invoices: Invoice[];
  onEditCompany: (company: Company) => void;
  onToggleStatus?: (companyId: string) => void;
  onOpenCustomerDetail?: (customer: Customer) => void;
  onOpenTicketDetail?: (ticket: Ticket) => void;
  onOpenInvoiceDetail?: (invoice: Invoice) => void;
}

export const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({
  company,
  isOpen,
  onClose,
  customers,
  tickets,
  invoices,
  onEditCompany,
  onToggleStatus,
  onOpenCustomerDetail,
  onOpenTicketDetail,
  onOpenInvoiceDetail,
}) => {
  if (!isOpen || !company) return null;

  // Filter linked records
  const linkedCustomers = customers.filter(
    (c) => c.companyId === company.id || c.company.toLowerCase() === company.name.toLowerCase()
  );

  const customerIds = new Set(linkedCustomers.map((c) => c.id));
  const linkedTickets = tickets.filter(
    (t) =>
      customerIds.has(t.customerId) ||
      t.customerCompany.toLowerCase() === company.name.toLowerCase()
  );

  const linkedInvoices = invoices.filter(
    (inv) =>
      inv.companyId === company.id ||
      customerIds.has(inv.customerId) ||
      inv.company.toLowerCase() === company.name.toLowerCase()
  );

  const totalBilled = linkedInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalPaid = linkedInvoices.reduce((acc, inv) => acc + (inv.paidAmount || (inv.status === 'Paid' ? inv.totalAmount : 0)), 0);
  const totalOutstanding = totalBilled - totalPaid;

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
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                    company.status === 'active'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {company.status === 'active' ? 'Active Enterprise AMC' : 'Deactivated'}
                </span>
                <span className="text-xs font-mono text-cyan-400">ID: {company.id}</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">{company.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditCompany(company)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition cursor-pointer"
              title="Edit Company Details"
            >
              <Edit2 className="w-4 h-4" />
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Linked Accounts</span>
            <div className="text-base font-bold text-white mt-0.5">{linkedCustomers.length}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Service Tickets</span>
            <div className="text-base font-bold text-cyan-400 mt-0.5">{linkedTickets.length}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Total Billed</span>
            <div className="text-base font-bold text-white mt-0.5">₹{totalBilled.toLocaleString('en-IN')}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Outstanding</span>
            <div className={`text-base font-bold mt-0.5 ${totalOutstanding > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              ₹{totalOutstanding.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Company Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Corporate &amp; Tax Identifiers
            </h4>
            <div className="text-xs space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">GSTIN:</span>
                <span className="font-mono text-cyan-300 font-semibold">{company.gstin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">PAN:</span>
                <span className="font-mono text-white font-semibold">{company.pan || company.gstin.substring(2, 12)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Primary Contact:</span>
                <span className="text-white font-medium">{company.contactPerson}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="text-cyan-400">{company.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="text-slate-300 truncate max-w-[200px]">{company.email}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Billing Address &amp; Notes
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">{company.billingAddress}</p>
            {company.notes && (
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 italic">
                Note: {company.notes}
              </div>
            )}
          </div>
        </div>

        {/* Branch / Service Locations */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 mb-4">
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5 mb-2.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Service Locations &amp; Plant Units ({company.serviceLocations?.length || 0})</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {company.serviceLocations && company.serviceLocations.length > 0 ? (
              company.serviceLocations.map((loc) => (
                <div key={loc.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <span className="font-semibold text-cyan-300">{loc.name}</span>
                  <p className="text-[11px] text-slate-400 mt-1">{loc.address}</p>
                  {loc.contactPerson && (
                    <p className="text-[10px] text-slate-500 mt-1">
                      POC: {loc.contactPerson} · {loc.phone}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 py-2">No separate branch locations recorded.</div>
            )}
          </div>
        </div>

        {/* Linked Accounts */}
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-mono flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Customer Accounts Under This Company</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {linkedCustomers.map((cust) => (
                <div
                  key={cust.id}
                  onClick={() => onOpenCustomerDetail && onOpenCustomerDetail(cust)}
                  className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800/80 transition flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <h5 className="text-xs font-bold text-white">{cust.name}</h5>
                    <span className="text-[10px] text-cyan-400 font-mono">{cust.amcStatus} · {cust.installedEquipmentCount} Devices</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Invoices for this company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-mono flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-teal-400" />
              <span>Invoice Ledger</span>
            </h4>
            <div className="space-y-1.5">
              {linkedInvoices.length === 0 ? (
                <div className="text-xs text-slate-500 py-2">No invoices recorded yet.</div>
              ) : (
                linkedInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => onOpenInvoiceDetail && onOpenInvoiceDetail(inv)}
                    className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800/80 transition flex items-center justify-between text-xs cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-cyan-300 font-bold">{inv.invoiceNumber || inv.id}</span>
                      <span className="text-slate-400">{inv.issuedDate}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white">₹{inv.totalAmount.toLocaleString('en-IN')}</span>
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
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

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
