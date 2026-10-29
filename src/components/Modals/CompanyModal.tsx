import React, { useState, useEffect } from 'react';
import { Company, ServiceLocation } from '../../types';
import { Building2, X, Plus, Trash2, MapPin, Phone, Mail, FileText, Check } from 'lucide-react';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCompany: (company: Company) => void;
  existingCompany?: Company | null;
}

export const CompanyModal: React.FC<CompanyModalProps> = ({
  isOpen,
  onClose,
  onSaveCompany,
  existingCompany,
}) => {
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [city, setCity] = useState('');
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'active' | 'deactivated'>('active');
  const [serviceLocations, setServiceLocations] = useState<ServiceLocation[]>([]);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingCompany) {
      setName(existingCompany.name);
      setContactPerson(existingCompany.contactPerson);
      setPhone(existingCompany.phone);
      setEmail(existingCompany.email);
      setBillingAddress(existingCompany.billingAddress);
      setCity(existingCompany.city);
      setGstin(existingCompany.gstin);
      setPan(existingCompany.pan || '');
      setNotes(existingCompany.notes || '');
      setStatus(existingCompany.status);
      setServiceLocations(existingCompany.serviceLocations || []);
    } else {
      setName('');
      setContactPerson('');
      setPhone('+91 ');
      setEmail('');
      setBillingAddress('');
      setCity('');
      setGstin('');
      setPan('');
      setNotes('');
      setStatus('active');
      setServiceLocations([
        {
          id: `loc-${Date.now()}`,
          name: 'Main Campus / Head Office',
          address: '',
          city: '',
          contactPerson: '',
          phone: '',
        },
      ]);
    }
    setErrors({});
  }, [existingCompany, isOpen]);

  if (!isOpen) return null;

  const handleAddLocation = () => {
    setServiceLocations([
      ...serviceLocations,
      {
        id: `loc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: `Branch Location #${serviceLocations.length + 1}`,
        address: '',
        city,
        contactPerson,
        phone,
      },
    ]);
  };

  const handleUpdateLocation = (index: number, field: keyof ServiceLocation, val: string) => {
    const updated = [...serviceLocations];
    updated[index] = { ...updated[index], [field]: val };
    setServiceLocations(updated);
  };

  const handleRemoveLocation = (index: number) => {
    if (serviceLocations.length <= 1) return;
    setServiceLocations(serviceLocations.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = 'Company name is required';
    if (!contactPerson.trim()) errs.contactPerson = 'Primary contact person is required';
    if (!phone.trim() || phone.length < 8) errs.phone = 'Valid phone number required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid corporate email required';
    if (!billingAddress.trim()) errs.billingAddress = 'Billing address is required';
    if (!gstin.trim() || gstin.length !== 15) {
      errs.gstin = 'GSTIN must be exactly 15 characters (e.g. 24AAACA9182K1Z9)';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const companyData: Company = {
      id: existingCompany ? existingCompany.id : `comp-${Date.now()}`,
      name: name.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: email.trim(),
      billingAddress: billingAddress.trim(),
      city: city.trim() || 'Ahmedabad',
      gstin: gstin.trim().toUpperCase(),
      pan: pan.trim().toUpperCase() || gstin.trim().substring(2, 12).toUpperCase(),
      status,
      serviceLocations: serviceLocations.map((loc) => ({
        ...loc,
        name: loc.name.trim() || 'Service Location',
        address: loc.address.trim() || billingAddress.trim(),
        city: loc.city.trim() || city.trim() || 'Ahmedabad',
      })),
      notes: notes.trim(),
      createdAt: existingCompany ? existingCompany.createdAt : new Date().toISOString().split('T')[0],
    };

    onSaveCompany(companyData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-cyan-500/30 p-6 shadow-2xl text-slate-100 scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {existingCompany ? 'Edit Corporate Account' : 'New Corporate Client Company'}
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {existingCompany ? existingCompany.name : 'Add Customer Company'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          {/* Basic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Reliance Logistics Hubs Ltd."
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 ${
                  errors.name ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
              {errors.name && <span className="text-[10px] text-rose-400 mt-1">{errors.name}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Primary Contact Person *
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Vikram Mehta (Plant Head)"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 ${
                  errors.contactPerson ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
              {errors.contactPerson && (
                <span className="text-[10px] text-rose-400 mt-1">{errors.contactPerson}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number *</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 99201 18320"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 ${
                  errors.phone ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
              {errors.phone && <span className="text-[10px] text-rose-400 mt-1">{errors.phone}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Corporate Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="procurement@reliancelogistics.com"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 ${
                  errors.email ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
              {errors.email && <span className="text-[10px] text-rose-400 mt-1">{errors.email}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                GSTIN (15 Digits) *
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                placeholder="24AABCR2418M1Z2"
                maxLength={15}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-xs text-white font-mono uppercase placeholder-slate-500 outline-none focus:border-cyan-400 ${
                  errors.gstin ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
              {errors.gstin && <span className="text-[10px] text-rose-400 mt-1">{errors.gstin}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                City &amp; Region *
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ahmedabad, Gujarat"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Registered Billing Address *
            </label>
            <textarea
              rows={2}
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              placeholder="Full legal billing address for tax invoices..."
              className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 ${
                errors.billingAddress ? 'border-rose-500' : 'border-slate-800'
              }`}
            />
            {errors.billingAddress && (
              <span className="text-[10px] text-rose-400 mt-1">{errors.billingAddress}</span>
            )}
          </div>

          {/* Service Locations (Multiple allowed per company) */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Service &amp; Branch Locations ({serviceLocations.length})</span>
                </h4>
                <p className="text-[10px] text-slate-400">
                  Multiple offices, plants, or data centers covered under this company's AMC
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddLocation}
                className="px-2.5 py-1.5 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Location</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {serviceLocations.map((loc, idx) => (
                <div
                  key={loc.id || idx}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={loc.name}
                      onChange={(e) => handleUpdateLocation(idx, 'name', e.target.value)}
                      placeholder="e.g. Sanand Hub #4 / Warehouse Bay 2"
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-cyan-200 font-semibold placeholder-slate-600 outline-none focus:border-cyan-400"
                    />
                    {serviceLocations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLocation(idx)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                        title="Remove location"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={loc.address}
                    onChange={(e) => handleUpdateLocation(idx, 'address', e.target.value)}
                    placeholder="Specific plant address / floor / unit details..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 placeholder-slate-600 outline-none focus:border-cyan-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Operational Notes & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Account Notes &amp; SLA Requirements
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. 24x7 gate security, VIP visitor pass required for engineers"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Account Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'deactivated')}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-cyan-400"
              >
                <option value="active">Active AMC Client</option>
                <option value="deactivated">Deactivated / Suspended</option>
              </select>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{existingCompany ? 'Save Changes' : 'Create Company'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
