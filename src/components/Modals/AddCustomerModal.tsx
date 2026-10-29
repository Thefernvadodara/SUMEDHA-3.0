import React, { useState, useEffect } from 'react';
import { Company, Customer } from '../../types';
import { X, UserPlus, Check, Building2 } from 'lucide-react';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCustomer: (customer: Customer) => void;
  existingCustomer?: Customer | null;
  companies?: Company[];
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  onSaveCustomer,
  existingCustomer,
  companies = [],
}) => {
  const [name, setName] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Ahmedabad');
  const [gstin, setGstin] = useState('');
  const [notes, setNotes] = useState('');
  const [customerIdCode, setCustomerIdCode] = useState('');
  const [openingBalance, setOpeningBalance] = useState('0');
  const [creditLimit, setCreditLimit] = useState('100000');
  const [amcStatus, setAmcStatus] = useState<Customer['amcStatus']>('Comprehensive AMC');
  const [amcExpiryDate, setAmcExpiryDate] = useState('2027-10-31');
  const [equipmentCount, setEquipmentCount] = useState('24');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingCustomer) {
      setName(existingCustomer.name);
      setCompanyId(existingCustomer.companyId || '');
      setCompanyName(existingCustomer.company);
      setContactPerson(existingCustomer.contactPerson);
      setPhone(existingCustomer.phone);
      setEmail(existingCustomer.email);
      setAddress(existingCustomer.address);
      setCity(existingCustomer.city);
      setGstin(existingCustomer.gstin || '');
      setNotes(existingCustomer.notes || '');
      setCustomerIdCode(existingCustomer.customerIdCode || '');
      setOpeningBalance(String(existingCustomer.openingBalance ?? 0));
      setCreditLimit(String(existingCustomer.creditLimit ?? 100000));
      setAmcStatus(existingCustomer.amcStatus);
      setAmcExpiryDate(existingCustomer.amcExpiryDate || '2027-10-31');
      setEquipmentCount(String(existingCustomer.installedEquipmentCount));
    } else {
      setName('');
      setCompanyId(companies[0]?.id || '');
      setCompanyName(companies[0]?.name || '');
      setContactPerson('');
      setPhone('+91 ');
      setEmail('');
      setAddress('');
      setCity('Ahmedabad');
      setGstin(companies[0]?.gstin || '');
      setNotes('');
      setCustomerIdCode(`CUST-${Math.floor(1000 + Math.random() * 9000)}`);
      setOpeningBalance('0');
      setCreditLimit('100000');
      setAmcStatus('Comprehensive AMC');
      setAmcExpiryDate('2027-10-31');
      setEquipmentCount('24');
    }
    setErrors({});
  }, [existingCustomer, isOpen, companies]);

  if (!isOpen) return null;

  const handleCompanyChange = (cId: string) => {
    setCompanyId(cId);
    const found = companies.find((c) => c.id === cId);
    if (found) {
      setCompanyName(found.name);
      if (!gstin) setGstin(found.gstin);
      if (!city) setCity(found.city);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = 'Client / Site name is required';
    if (!companyName.trim()) errs.companyName = 'Company is required';
    if (!contactPerson.trim()) errs.contactPerson = 'Contact person is required';
    if (!phone.trim() || phone.length < 8) errs.phone = 'Valid phone number required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email required';
    if (!address.trim()) errs.address = 'Site address is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const customerData: Customer = {
      id: existingCustomer ? existingCustomer.id : `cust-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      company: companyName.trim(),
      companyId: companyId || undefined,
      customerIdCode: customerIdCode.trim() || undefined,
      openingBalance: parseFloat(openingBalance) || 0,
      creditLimit: parseFloat(creditLimit) || 100000,
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      city: city.trim(),
      gstin: gstin.trim().toUpperCase() || undefined,
      notes: notes.trim() || undefined,
      amcStatus,
      amcExpiryDate,
      installedEquipmentCount: parseInt(equipmentCount) || 12,
      activeTicketsCount: existingCustomer ? existingCustomer.activeTicketsCount : 0,
      status: existingCustomer?.status || 'active',
      createdAt: existingCustomer?.createdAt || new Date().toISOString().split('T')[0],
    };

    onSaveCustomer(customerData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-cyan-500/30 p-6 shadow-2xl text-slate-100 scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {existingCustomer ? 'Edit Client Account' : 'New Corporate Client'}
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {existingCustomer ? existingCustomer.name : 'Onboard Client / Facility'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 mt-4 text-xs">
          {/* Linked Company & Client Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Parent Company *
              </label>
              {companies.length > 0 ? (
                <select
                  value={companyId}
                  onChange={(e) => handleCompanyChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-400"
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                  <option value="">Other / Standalone</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Reliance Logistics Hubs Ltd."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-400"
                />
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Client / Facility Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sanand Logistics Hub Bay #4"
                className={`w-full px-3 py-2 rounded-xl bg-slate-950 border text-white outline-none focus:border-cyan-400 ${
                  errors.name ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
              {errors.name && <span className="text-[10px] text-rose-400">{errors.name}</span>}
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Contact Person *
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Vikram Mehta"
                className={`w-full px-3 py-2 rounded-xl bg-slate-950 border text-white outline-none focus:border-cyan-400 ${
                  errors.contactPerson ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
              {errors.contactPerson && <span className="text-[10px] text-rose-400">{errors.contactPerson}</span>}
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Phone Number *</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 99201 18320"
                className={`w-full px-3 py-2 rounded-xl bg-slate-950 border text-white outline-none focus:border-cyan-400 ${
                  errors.phone ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
              {errors.phone && <span className="text-[10px] text-rose-400">{errors.phone}</span>}
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ops@reliancelogistics.com"
                className={`w-full px-3 py-2 rounded-xl bg-slate-950 border text-white outline-none focus:border-cyan-400 ${
                  errors.email ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
              {errors.email && <span className="text-[10px] text-rose-400">{errors.email}</span>}
            </div>
          </div>

          {/* Address & City */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">Site / Facility Address *</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Plot 48, GIDC Industrial Zone, Sanand"
                className={`w-full px-3 py-2 rounded-xl bg-slate-950 border text-white outline-none focus:border-cyan-400 ${
                  errors.address ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
              {errors.address && <span className="text-[10px] text-rose-400">{errors.address}</span>}
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">City / Region</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ahmedabad"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* GSTIN & AMC Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">GSTIN</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                placeholder="24AABCR2418M1Z2"
                maxLength={15}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono uppercase outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">AMC SLA Package</label>
              <select
                value={amcStatus}
                onChange={(e) => setAmcStatus(e.target.value as Customer['amcStatus'])}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-400"
              >
                <option value="Comprehensive AMC">Comprehensive AMC (24x7)</option>
                <option value="Active AMC">Active AMC (Standard)</option>
                <option value="On-Demand">On-Demand / Per Call</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Installed Hardware Count</label>
              <input
                type="number"
                min="1"
                value={equipmentCount}
                onChange={(e) => setEquipmentCount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Financial & Ledger Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Customer Code / ID</label>
              <input
                type="text"
                value={customerIdCode}
                onChange={(e) => setCustomerIdCode(e.target.value.toUpperCase())}
                placeholder="CUST-1042"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Opening Balance (₹)</label>
              <input
                type="number"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 font-mono outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Credit Limit (₹)</label>
              <input
                type="number"
                value={creditLimit}
                onChange={(e) => setCreditLimit(e.target.value)}
                placeholder="100000"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 font-mono outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Operational Notes */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Account &amp; Service Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Critical 4K NVR storage, VIP facility with restricted biometric entrance..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-cyan-400"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{existingCustomer ? 'Save Client Changes' : 'Onboard Client'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
