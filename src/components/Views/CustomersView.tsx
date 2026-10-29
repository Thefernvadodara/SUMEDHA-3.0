import React, { useState } from 'react';
import { Company, Customer, Invoice, Ticket } from '../../types';
import {
  Search,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Wrench,
  ChevronRight,
  Edit2,
  Trash2,
  ExternalLink,
  Archive,
  Building2,
  Receipt,
} from 'lucide-react';

interface CustomersViewProps {
  customers: Customer[];
  companies?: Company[];
  tickets: Ticket[];
  invoices: Invoice[];
  onAddCustomer: () => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customer: Customer) => void;
  onOpenCustomerDetail: (customer: Customer) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  companies = [],
  tickets,
  invoices,
  onAddCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onOpenCustomerDetail,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'archived'>('all');

  const filteredCustomers = customers.filter((c) => {
    const matchesFilter = filterStatus === 'all' || (c.status || 'active') === filterStatus;
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.gstin && c.gstin.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Corporate Clients &amp; Facility Accounts</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
              {customers.length} Accounts
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Maintenance contracts, installed hardware inventory &amp; service coverage
          </p>
        </div>

        <button
          onClick={onAddCustomer}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client name, parent company, contact person, or GSTIN..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto text-xs">
          {(['all', 'active', 'archived'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg capitalize transition cursor-pointer ${
                filterStatus === status
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Clients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
            No customer accounts found matching &quot;{searchTerm}&quot;.
          </div>
        ) : (
          filteredCustomers.map((cust) => {
            const activeTickets = tickets.filter(
              (t) => t.customerId === cust.id && t.status !== 'solved'
            ).length;
            const custInvoices = invoices.filter((inv) => inv.customerId === cust.id);
            const totalBilled = custInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);

            return (
              <div
                key={cust.id}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0b1426] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between gap-3 shadow-lg group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-semibold">
                          {cust.amcStatus}
                        </span>
                        {cust.status === 'archived' && (
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30">
                            Archived
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-slate-500">{cust.id}</span>
                      </div>
                      <h3
                        onClick={() => onOpenCustomerDetail(cust)}
                        className="text-base font-bold text-white group-hover:text-cyan-300 transition cursor-pointer pt-0.5"
                      >
                        {cust.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-cyan-500" />
                        <span>{cust.company}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onOpenCustomerDetail(cust)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
                        title="View Full Client Profile & Ledger"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEditCustomer(cust)}
                        className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 hover:text-white transition cursor-pointer"
                        title="Edit Client Info"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteCustomer(cust)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                        title="Delete or Archive Client"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-3 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{cust.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{cust.city}</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2 text-[11px] text-slate-400">
                      <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{cust.email}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Wrench className="w-3 h-3 text-cyan-400" />
                    <span>{cust.installedEquipmentCount} Devices · {activeTickets} Open Tickets</span>
                  </span>

                  <span className="text-cyan-300 font-bold">
                    ₹{totalBilled.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
