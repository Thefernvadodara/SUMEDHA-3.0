import React, { useState, useEffect } from 'react';
import { Supplier } from '../../types';
import { Truck, X, Save, Building2, Phone, Mail, MapPin, IndianRupee } from 'lucide-react';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplierData: Partial<Supplier>) => void;
  existingSupplier?: Supplier | null;
}

export const SupplierModal: React.FC<SupplierModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingSupplier,
}) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [supplierCode, setSupplierCode] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Vadodara');
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');
  const [productsStr, setProductsStr] = useState('');
  const [openingBalance, setOpeningBalance] = useState('0');
  const [paymentTermsDays, setPaymentTermsDays] = useState('30');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (existingSupplier) {
      setName(existingSupplier.name || '');
      setCompany(existingSupplier.company || '');
      setSupplierCode(existingSupplier.supplierCode || '');
      setContactPerson(existingSupplier.contactPerson || '');
      setPhone(existingSupplier.phone || '+91 ');
      setEmail(existingSupplier.email || '');
      setAddress(existingSupplier.address || '');
      setCity(existingSupplier.city || 'Vadodara');
      setGstin(existingSupplier.gstin || '');
      setPan(existingSupplier.pan || '');
      setProductsStr((existingSupplier.productsServicesPurchased || []).join(', '));
      setOpeningBalance((existingSupplier.openingBalance || 0).toString());
      setPaymentTermsDays((existingSupplier.paymentTermsDays || 30).toString());
      setBankName(existingSupplier.bankDetails?.bankName || '');
      setAccountNumber(existingSupplier.bankDetails?.accountNumber || '');
      setIfsc(existingSupplier.bankDetails?.ifsc || '');
      setNotes(existingSupplier.notes || '');
    } else {
      setName('');
      setCompany('');
      setSupplierCode('');
      setContactPerson('');
      setPhone('+91 ');
      setEmail('');
      setAddress('');
      setCity('Vadodara');
      setGstin('');
      setPan('');
      setProductsStr('CCTV IP Cameras, NVR, Switches');
      setOpeningBalance('0');
      setPaymentTermsDays('30');
      setBankName('');
      setAccountNumber('');
      setIfsc('');
      setNotes('');
    }
  }, [existingSupplier, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productsServicesPurchased = productsStr
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    onSave({
      name: name.trim() || company.trim(),
      company: company.trim(),
      supplierCode: supplierCode.trim() || undefined,
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      city: city.trim(),
      gstin: gstin.trim().toUpperCase(),
      pan: pan.trim().toUpperCase(),
      productsServicesPurchased,
      openingBalance: parseFloat(openingBalance) || 0,
      paymentTermsDays: parseInt(paymentTermsDays, 10) || 30,
      bankDetails: bankName
        ? {
            bankName,
            accountNumber,
            ifsc,
            branch: city,
          }
        : undefined,
      notes: notes.trim(),
      status: 'active',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {existingSupplier ? 'Edit Vendor / Supplier' : 'Register New Vendor / Supplier'}
              </h3>
              <p className="text-xs text-slate-400">Hardware distributors &amp; component suppliers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 my-4 text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Company / Firm Name *</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. SecureVision Technologies Pvt Ltd"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-indigo-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Supplier Code / ID</label>
              <input
                type="text"
                value={supplierCode}
                onChange={(e) => setSupplierCode(e.target.value)}
                placeholder="Auto-generated e.g. SUP-005"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:border-indigo-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Contact Person *</label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Mukesh Panchal"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-indigo-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Mobile / Phone *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98250 88210"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-indigo-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="orders@supplier.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-indigo-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">GSTIN (15 Digits)</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                placeholder="24AAECS4912J1ZG"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:border-indigo-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Vadodara / Ahmedabad"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-indigo-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Credit Terms (Days)</label>
              <input
                type="number"
                value={paymentTermsDays}
                onChange={(e) => setPaymentTermsDays(e.target.value)}
                placeholder="30"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:border-indigo-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Registered Warehouse / Office Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Plot / Street / GIDC Area"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Supplied Products &amp; Services (comma-separated)</label>
            <input
              type="text"
              value={productsStr}
              onChange={(e) => setProductsStr(e.target.value)}
              placeholder="CCTV Cameras, NVR, Solid CAT6 Cable, Biometric Devices"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-indigo-400 focus:outline-none"
            />
          </div>

          {!existingSupplier && (
            <div>
              <label className="block text-slate-400 mb-1">Opening Payable Balance (₹)</label>
              <input
                type="number"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:border-indigo-400 focus:outline-none"
              />
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="font-mono text-[10px] text-indigo-400 uppercase tracking-wider font-bold">
              Vendor Bank Details for NEFT/RTGS Disbursals
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Bank Name (e.g. HDFC Bank)"
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
              />
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Account Number"
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
              />
              <input
                type="text"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                placeholder="IFSC Code"
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/25 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{existingSupplier ? 'Update Supplier' : 'Save Supplier'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
