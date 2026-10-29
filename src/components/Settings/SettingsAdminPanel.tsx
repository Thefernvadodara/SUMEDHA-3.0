import React, { useState } from 'react';
import {
  Company,
  Customer,
  Invoice,
  StaffAccount,
  SystemSettings,
} from '../../types';
import { StorageService } from '../../services/storage';
import { AuthService, hashPassword, StoredUser } from '../../services/auth';
import {
  Building2,
  Users,
  CreditCard,
  Settings,
  Database,
  ShieldCheck,
  Save,
  Plus,
  Trash2,
  Edit2,
  Download,
  Upload,
  RotateCcw,
  Check,
  Search,
  ExternalLink,
  MapPin,
  FileSpreadsheet,
  Cloud,
  CheckCircle2,
  Layers,
  Archive,
  X,
  Camera,
  Image as ImageIcon,
  Eye,
  EyeOff,
} from 'lucide-react';
import { SumedhaDocumentHeader } from '../Document/SumedhaDocumentHeader';

interface SettingsAdminPanelProps {
  settings: SystemSettings;
  companies: Company[];
  customers: Customer[];
  invoices: Invoice[];
  onSaveSettings: (newSettings: SystemSettings) => void;
  onOpenCompanyModal: (company?: Company) => void;
  onOpenCompanyDetail: (company: Company) => void;
  onDeleteCompany: (company: Company) => void;
  onToggleCompanyStatus: (companyId: string) => void;
  showToast: (msg: string) => void;
  onResetAllData: () => void;
}

export const SettingsAdminPanel: React.FC<SettingsAdminPanelProps> = ({
  settings,
  companies,
  customers,
  invoices,
  onSaveSettings,
  onOpenCompanyModal,
  onOpenCompanyDetail,
  onDeleteCompany,
  onToggleCompanyStatus,
  showToast,
  onResetAllData,
}) => {
  const [subTab, setSubTab] = useState<
    'profile' | 'companies' | 'staff' | 'billing_config' | 'equipment' | 'backup'
  >('profile');

  // Company Profile form state
  const [profile, setProfile] = useState(settings.companyProfile);
  // Billing Config form state
  const [billingConfig, setBillingConfig] = useState(settings.billingConfig);
  // Staff Accounts
  const [staffList, setStaffList] = useState<StaffAccount[]>(settings.staffAccounts);

  // Staff Search & Modal
  const [staffSearch, setStaffSearch] = useState('');
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('+91 ');
  const [staffRole, setStaffRole] = useState<StaffAccount['role']>('Operations Manager');
  const [staffAvatarUrl, setStaffAvatarUrl] = useState<string>('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffConfirmPassword, setStaffConfirmPassword] = useState('');
  const [showStaffPassword, setShowStaffPassword] = useState(false);

  // Company Search filter
  const [companySearch, setCompanySearch] = useState('');

  // Equipment categories local state
  const [equipmentCategories, setEquipmentCategories] = useState([
    'Surveillance & CCTV',
    'NVR & Storage RAID',
    'Enterprise Networking',
    'Wi-Fi 6 Mesh & APs',
    'Server Racks & UPS',
    'Biometric & Access Control',
    'EPABX & IP Telephony',
    'Workstations & Computing',
  ]);
  const [newCategoryName, setNewCategoryName] = useState('');

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(companySearch.toLowerCase()) ||
      c.gstin.toLowerCase().includes(companySearch.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(companySearch.toLowerCase()) ||
      c.city.toLowerCase().includes(companySearch.toLowerCase())
  );

  const filteredStaff = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(staffSearch.toLowerCase()) ||
      s.role.toLowerCase().includes(staffSearch.toLowerCase())
  );

  // Logo file upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Logo file size must be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setProfile((prev) => ({ ...prev, logoUrl: result }));
        showToast('Company logo updated. Save settings to apply.');
      };
      reader.readAsDataURL(file);
    }
  };

  // Staff avatar file upload handler
  const handleStaffPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Staff photo size must be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setStaffAvatarUrl(reader.result as string);
        showToast('Photo selected.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: SystemSettings = {
      ...settings,
      companyProfile: profile,
    };
    onSaveSettings(updatedSettings);
    showToast('Company profile and branding saved successfully.');
  };

  const handleSaveBilling = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: SystemSettings = {
      ...settings,
      billingConfig: billingConfig,
    };
    onSaveSettings(updatedSettings);
    showToast('Invoice & quotation configurations updated.');
  };

  const handleOpenStaffModal = (staff?: StaffAccount) => {
    if (staff) {
      setEditingStaffId(staff.id);
      setStaffName(staff.name);
      setStaffEmail(staff.email);
      setStaffPhone(staff.phone);
      setStaffRole(staff.role);
      setStaffAvatarUrl(staff.avatarUrl || '');
      setStaffPassword('');
      setStaffConfirmPassword('');
    } else {
      setEditingStaffId(null);
      setStaffName('');
      setStaffEmail('');
      setStaffPhone('+91 ');
      setStaffRole('Operations Manager');
      setStaffAvatarUrl('');
      setStaffPassword('');
      setStaffConfirmPassword('');
    }
    setShowStaffPassword(false);
    setIsStaffModalOpen(true);
  };

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim() || !staffEmail.trim()) {
      showToast('Staff name and email are required.');
      return;
    }

    const normalizedEmail = staffEmail.trim().toLowerCase();
    const authUsers = AuthService.getStoredUsers();
    const existingAuthUser = authUsers.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!editingStaffId) {
      if (!staffPassword || staffPassword.length < 8) {
        showToast('Password must be at least 8 characters long.');
        return;
      }
      if (staffPassword !== staffConfirmPassword) {
        showToast('Password and Confirm Password do not match.');
        return;
      }
      if (existingAuthUser) {
        showToast('An account with this email already exists.');
        return;
      }
    } else if (existingAuthUser && existingAuthUser.id !== editingStaffId && existingAuthUser.email.toLowerCase() !== normalizedEmail) {
      showToast('An account with this email already exists.');
      return;
    }

    let updated: StaffAccount[];
    if (editingStaffId) {
      const oldStaff = staffList.find((s) => s.id === editingStaffId);
      updated = staffList.map((s) =>
        s.id === editingStaffId
          ? {
              ...s,
              name: staffName.trim(),
              email: normalizedEmail,
              phone: staffPhone.trim(),
              role: staffRole,
              avatarUrl: staffAvatarUrl || s.avatarUrl,
            }
          : s
      );
      // Keep the login account's profile and role aligned with the staff record.
      const linkedUser = authUsers.find((u) => u.id === editingStaffId || (oldStaff && u.email.toLowerCase() === oldStaff.email.toLowerCase()));
      if (linkedUser) {
        const mappedRole = staffRole === 'Super Admin' || staffRole === 'Billing Specialist' ? 'admin' : 'technician';
        const updatedUsers = authUsers.map((u) => u.id === linkedUser.id ? {
          ...u,
          name: staffName.trim(),
          email: normalizedEmail,
          phone: staffPhone.trim(),
          role: mappedRole as StoredUser['role'],
          avatarUrl: staffAvatarUrl || u.avatarUrl,
        } : u);
        AuthService.saveStoredUsers(updatedUsers);
      }
      showToast(`Staff member "${staffName}" updated.`);
    } else {
      const newStaff: StaffAccount = {
        id: `staff-${Date.now()}`,
        name: staffName.trim(),
        email: normalizedEmail,
        phone: staffPhone.trim(),
        role: staffRole,
        permissions: ['dispatch_tickets', 'view_reports'],
        active: true,
        avatarUrl: staffAvatarUrl || undefined,
      };
      const mappedRole = staffRole === 'Super Admin' || staffRole === 'Billing Specialist' ? 'admin' : 'technician';
      const newAuthUser: StoredUser = {
        id: newStaff.id,
        name: newStaff.name,
        email: newStaff.email,
        role: mappedRole,
        phone: newStaff.phone,
        passwordHash: await hashPassword(staffPassword),
        avatarUrl: newStaff.avatarUrl,
        active: true,
      };
      AuthService.saveStoredUsers([...authUsers, newAuthUser]);
      updated = [...staffList, newStaff];
      showToast(`Staff member "${staffName}" registered with login access.`);
    }

    setStaffList(updated);
    onSaveSettings({ ...settings, staffAccounts: updated });
    setIsStaffModalOpen(false);
    setStaffPassword('');
    setStaffConfirmPassword('');
  };

  const handleToggleStaffStatus = (id: string) => {
    const updated = staffList.map((s) => (s.id === id ? { ...s, active: !s.active } : s));
    setStaffList(updated);
    onSaveSettings({ ...settings, staffAccounts: updated });
    const target = updated.find((s) => s.id === id);
    if (target) {
      const users = AuthService.getStoredUsers().map((u) => u.id === id || u.email.toLowerCase() === target.email.toLowerCase() ? { ...u, active: target.active } : u);
      AuthService.saveStoredUsers(users);
    }
    showToast('Staff status updated.');
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    if (equipmentCategories.includes(newCategoryName.trim())) {
      showToast('Category already exists.');
      return;
    }
    setEquipmentCategories([...equipmentCategories, newCategoryName.trim()]);
    setNewCategoryName('');
    showToast('Equipment category registered.');
  };

  const handleRemoveCategory = (cat: string) => {
    setEquipmentCategories(equipmentCategories.filter((c) => c !== cat));
    showToast(`Category "${cat}" removed.`);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Settings &amp; Administration</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                Sumedha Tech Infra
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Corporate profile, multi-branch companies, billing/quotation sequences, staff RBAC &amp; cloud sync
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
        <button
          onClick={() => setSubTab('profile')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'profile'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Company Profile &amp; Logo</span>
        </button>

        <button
          onClick={() => setSubTab('companies')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'companies'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Customer Companies ({companies.length})</span>
        </button>

        <button
          onClick={() => setSubTab('billing_config')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'billing_config'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Billing &amp; Quotation Settings</span>
        </button>

        <button
          onClick={() => setSubTab('staff')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'staff'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Staff Accounts &amp; RBAC</span>
        </button>

        <button
          onClick={() => setSubTab('equipment')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'equipment'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Equipment &amp; SLAs</span>
        </button>

        <button
          onClick={() => setSubTab('backup')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'backup'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Data Backup &amp; Cloud Sync</span>
        </button>
      </div>

      {/* 1. COMPANY PROFILE & LOGO UPLOAD */}
      {subTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Corporate Identity &amp; Document Header
              </h3>
              <p className="text-xs text-slate-400">
                Details appear on official GST invoices, quotations, and client service reports
              </p>
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Save Company Profile</span>
            </button>
          </div>

          {/* Logo Upload Card & Live Header Preview */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-slate-950 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                  {profile.logoUrl ? (
                    <img
                      src={profile.logoUrl}
                      alt="Logo"
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <div className="text-center p-2">
                      <ImageIcon className="w-6 h-6 text-slate-500 mx-auto mb-1" />
                      <span className="text-[8px] text-slate-400 block font-mono">Default Logo</span>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Company Logo &amp; Brand Insignia</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Upload PNG, JPG, or SVG to appear on Quotation &amp; Invoice headers.
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <label className="px-3 py-1.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload New Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    {profile.logoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setProfile({ ...profile, logoUrl: undefined });
                          showToast('Logo reset to Sumedha Tech Infra emblem.');
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs transition-colors"
                      >
                        Reset to Vector Emblem
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono">
                <div>Format: PNG, JPG, SVG</div>
                <div>Max Size: 2 MB</div>
                <div>Background: Transparent / White</div>
              </div>
            </div>

            {/* Live Document Header Preview */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider block mb-2">
                Live Header Preview on White Document Sheet:
              </span>
              <div className="p-3 rounded-xl bg-white text-slate-900 border border-slate-300 overflow-x-auto">
                <SumedhaDocumentHeader
                  companyProfile={profile}
                  docType="invoice_with_gst"
                  docNumber="PREVIEW-001"
                  docDate="11/10/2026"
                  dueDateOrValidUntil="25/10/2026"
                  customerIdCode="CUST-001"
                />
              </div>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Sumedha Tech Infra Corporate Registration Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Company Registered Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Corporate Tagline / Subtitle</label>
                <input
                  type="text"
                  value={profile.tagline}
                  onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Authorized Signatory / Name</label>
                <input
                  type="text"
                  value={profile.contactPerson}
                  onChange={(e) => setProfile({ ...profile, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">GSTIN Number</label>
                <input
                  type="text"
                  value={profile.gstin}
                  onChange={(e) => setProfile({ ...profile, gstin: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono font-bold uppercase outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">PAN Number</label>
                <input
                  type="text"
                  value={profile.pan}
                  onChange={(e) => setProfile({ ...profile, pan: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono uppercase outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Support Phone / WhatsApp</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Official Billing Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1">Office Street Address</label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">City</label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">State</label>
                <input
                  type="text"
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Postal Code (PIN)</label>
                <input
                  type="text"
                  value={profile.pincode}
                  onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Banking Details */}
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 pt-3 border-t border-slate-800">
              Bank Remittance Details (Printed on Invoices &amp; Quotations)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={profile.bankName}
                  onChange={(e) => setProfile({ ...profile, bankName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Account Number</label>
                <input
                  type="text"
                  value={profile.accountNumber}
                  onChange={(e) => setProfile({ ...profile, accountNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={profile.ifscCode}
                  onChange={(e) => setProfile({ ...profile, ifscCode: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono uppercase outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Branch Name</label>
                <input
                  type="text"
                  value={profile.branch}
                  onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1">UPI ID for Quick QR</label>
                <input
                  type="text"
                  value={profile.upiId}
                  onChange={(e) => setProfile({ ...profile, upiId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* 2. CUSTOMER COMPANIES */}
      {subTab === 'companies' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Customer Companies &amp; Enterprise Accounts</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {companies.length} Registered
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Corporate entities managing multiple sites, branches, and billing agreements
              </p>
            </div>

            <button
              onClick={() => onOpenCompanyModal()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Customer Company</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
              placeholder="Search companies by name, GSTIN, contact person, or city..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
            />
          </div>

          {/* Company Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredCompanies.map((comp) => {
              const linkedCusts = customers.filter(
                (c) => c.companyId === comp.id || c.company.toLowerCase() === comp.name.toLowerCase()
              );
              return (
                <div
                  key={comp.id}
                  className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{comp.name}</span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                              comp.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {comp.status}
                          </span>
                        </h4>
                        <div className="text-xs text-slate-400 mt-0.5">
                          GSTIN: <span className="font-mono text-cyan-300">{comp.gstin}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenCompanyModal(comp)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Edit Company"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteCompany(comp)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                        title="Deactivate / Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Primary Contact:</span>
                      <strong className="text-white">{comp.contactPerson}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Phone:</span>
                      <span className="font-mono">{comp.phone}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Billing HQ:</span>
                      <span>{comp.city}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-400">
                      Locations: <strong>{comp.serviceLocations.length} sites</strong> · Clients:{' '}
                      <strong>{linkedCusts.length}</strong>
                    </span>
                    <button
                      onClick={() => onOpenCompanyDetail(comp)}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                    >
                      <span>View Ledger</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. BILLING & QUOTATION SETTINGS */}
      {subTab === 'billing_config' && (
        <form onSubmit={handleSaveBilling} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Billing &amp; Quotation Numbering Configurations
              </h3>
              <p className="text-xs text-slate-400">
                Separate numbering sequences, default terms, GST rate, and validity periods
              </p>
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Save Billing Config</span>
            </button>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-rose-400">
              Tax Invoice Settings (Red Avadh Layout)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Invoice Number Prefix
                </label>
                <input
                  type="text"
                  value={billingConfig.invoicePrefix}
                  onChange={(e) => setBillingConfig({ ...billingConfig, invoicePrefix: e.target.value })}
                  placeholder="e.g. 11/10/2026- or STI-INV-"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Next Invoice Sequence #
                </label>
                <input
                  type="number"
                  value={billingConfig.nextInvoiceNumber || 1}
                  onChange={(e) =>
                    setBillingConfig({
                      ...billingConfig,
                      nextInvoiceNumber: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Payment Due Days
                </label>
                <input
                  type="number"
                  value={billingConfig.defaultDueDays}
                  onChange={(e) =>
                    setBillingConfig({
                      ...billingConfig,
                      defaultDueDays: parseInt(e.target.value) || 15,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono outline-none focus:border-cyan-400"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-semibold text-slate-300 mb-1">
                  Default Invoice Terms &amp; Conditions (Printed on Invoices)
                </label>
                <textarea
                  rows={3}
                  value={billingConfig.invoiceTerms}
                  onChange={(e) =>
                    setBillingConfig({ ...billingConfig, invoiceTerms: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <h4 className="text-xs font-mono uppercase tracking-wider text-blue-400 pt-4 border-t border-slate-800">
              Quotation / Price Proposal Settings (Blue Darshanam Layout)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Quotation Number Prefix
                </label>
                <input
                  type="text"
                  value={billingConfig.quotationPrefix}
                  onChange={(e) =>
                    setBillingConfig({ ...billingConfig, quotationPrefix: e.target.value })
                  }
                  placeholder="e.g. 31082026- or STI-QTN-"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Next Quotation Sequence #
                </label>
                <input
                  type="number"
                  value={billingConfig.nextQuotationNumber || 1}
                  onChange={(e) =>
                    setBillingConfig({
                      ...billingConfig,
                      nextQuotationNumber: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Quotation Validity (Days)
                </label>
                <input
                  type="number"
                  value={billingConfig.defaultQuotationValidityDays || 15}
                  onChange={(e) =>
                    setBillingConfig({
                      ...billingConfig,
                      defaultQuotationValidityDays: parseInt(e.target.value) || 15,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono outline-none focus:border-cyan-400"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-semibold text-slate-300 mb-1">
                  Quotation Special Wiring Note (Italics notice beneath product table)
                </label>
                <textarea
                  rows={2}
                  value={billingConfig.quotationWiringNotice}
                  onChange={(e) =>
                    setBillingConfig({
                      ...billingConfig,
                      quotationWiringNotice: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-cyan-400 text-xs italic"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-semibold text-slate-300 mb-1">
                  Default Quotation Terms &amp; Conditions
                </label>
                <textarea
                  rows={3}
                  value={billingConfig.quotationTerms}
                  onChange={(e) =>
                    setBillingConfig({ ...billingConfig, quotationTerms: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 pt-4 border-t border-slate-800">
              Taxation &amp; Payment Methods
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Default GST Rate (%)</label>
                <select
                  value={billingConfig.defaultGstRate}
                  onChange={(e) =>
                    setBillingConfig({ ...billingConfig, defaultGstRate: parseInt(e.target.value) })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono outline-none focus:border-cyan-400"
                >
                  <option value={18}>18% (Standard IT Hardware &amp; Surveillance Services)</option>
                  <option value={12}>12% (Telecom / Networking Hardware)</option>
                  <option value={28}>28% (Specialized Air-Conditioned Equipment)</option>
                  <option value={0}>0% (Exempted / Non-GST Supply)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Accepted Payment Modes</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {billingConfig.paymentMethods.map((m) => (
                    <span
                      key={m}
                      className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{m}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* 4. STAFF ACCOUNTS & ROLES & PHOTO UPLOAD */}
      {subTab === 'staff' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Staff Management &amp; Role-Based Access Control (RBAC)
              </h3>
              <p className="text-xs text-slate-400">
                Manage accounts, roles, upload employee photos from gallery/camera, and configure permissions
              </p>
            </div>
            <button
              onClick={() => handleOpenStaffModal()}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Register New Staff</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={staffSearch}
              onChange={(e) => setStaffSearch(e.target.value)}
              placeholder="Search staff members by name, email, or role..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredStaff.map((staff) => (
              <div key={staff.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                      {staff.avatarUrl ? (
                        <img
                          src={staff.avatarUrl}
                          alt={staff.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-bold text-sm text-cyan-400">
                          {staff.name.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{staff.name}</h4>
                        <span
                          className={`text-[9.5px] font-mono px-2 py-0.5 rounded-full ${
                            staff.active
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {staff.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <span className="text-xs text-cyan-400 font-semibold">{staff.role}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenStaffModal(staff)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                      title="Edit Staff Member"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleStaffStatus(staff.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-[10px] font-mono"
                      title={staff.active ? 'Deactivate' : 'Activate'}
                    >
                      {staff.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Email:</span>
                    <span className="text-slate-200">{staff.email}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Phone:</span>
                    <span className="font-mono text-slate-200">{staff.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add / Edit Staff Modal */}
          {isStaffModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white">
                    {editingStaffId ? 'Edit Staff Member' : 'Register New Staff Member'}
                  </h3>
                  <button
                    onClick={() => setIsStaffModalOpen(false)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveStaff} className="space-y-4">
                  {/* Photo Upload Area */}
                  <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                      {staffAvatarUrl ? (
                        <img
                          src={staffAvatarUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="w-6 h-6 text-slate-500" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white block">Staff Profile Photo</span>
                      <p className="text-[10px] text-slate-400 mb-2">Upload from gallery or take camera snapshot</p>
                      <label className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                        <Upload className="w-3 h-3" />
                        <span>Choose Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleStaffPhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={staffName}
                      onChange={(e) => setStaffName(e.target.value)}
                      placeholder="e.g. Hardik Patel"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={staffEmail}
                      onChange={(e) => setStaffEmail(e.target.value)}
                      placeholder="name@sumedhatechinfra.com"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  {!editingStaffId && (
                    <>
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Set Login Password (minimum 8 characters)</label>
                        <div className="flex gap-2">
                          <input
                            type={showStaffPassword ? 'text' : 'password'}
                            required
                            minLength={8}
                            autoComplete="new-password"
                            value={staffPassword}
                            onChange={(e) => setStaffPassword(e.target.value)}
                            placeholder="Create staff login password"
                            className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                          />
                          <button type="button" onClick={() => setShowStaffPassword(!showStaffPassword)} className="px-3 rounded-xl border border-slate-700 text-slate-300 hover:text-white" aria-label={showStaffPassword ? 'Hide password' : 'Show password'}>
                            {showStaffPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Confirm Password</label>
                        <input
                          type={showStaffPassword ? 'text' : 'password'}
                          required
                          minLength={8}
                          autoComplete="new-password"
                          value={staffConfirmPassword}
                          onChange={(e) => setStaffConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={staffPhone}
                      onChange={(e) => setStaffPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Designated Role</label>
                    <select
                      value={staffRole}
                      onChange={(e) => setStaffRole(e.target.value as StaffAccount['role'])}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="Super Admin">Super Admin (All permissions &amp; billing)</option>
                      <option value="Operations Manager">Operations Manager (Dispatch &amp; customers)</option>
                      <option value="Senior Field Engineer">Senior Field Engineer (Field tasks &amp; reports)</option>
                      <option value="Billing Specialist">Billing Specialist (Invoices &amp; receipts)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setIsStaffModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                    >
                      Save Staff Record
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. EQUIPMENT CATEGORIES */}
      {subTab === 'equipment' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Equipment Taxonomies &amp; SLA Prioritization
              </h3>
              <p className="text-xs text-slate-400">
                Configure standard hardware categories for ticketing, asset tracking, and spares
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter new equipment category..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              />
              <button
                onClick={handleAddCategory}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              {equipmentCategories.map((cat) => (
                <div
                  key={cat}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <span className="text-xs font-semibold text-slate-200">{cat}</span>
                  <button
                    onClick={() => handleRemoveCategory(cat)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. DATA BACKUP & CLOUD DATABASE SETUP */}
      {subTab === 'backup' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Data Persistence, Export &amp; Cloud Database Sync
              </h3>
              <p className="text-xs text-slate-400">
                Download offline JSON/CSV archives or connect a shared cloud database
              </p>
            </div>
          </div>

          {/* Cloud Database Integration Architecture Guide */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-3">
            <div className="flex items-center gap-2.5 text-cyan-400">
              <Cloud className="w-5 h-5" />
              <h4 className="text-sm font-bold text-white">
                Multi-User Shared Database Architecture (Firebase &amp; Cloud SQL)
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your application currently persists all records locally in browser storage using the unified{' '}
              <code className="text-cyan-300 font-mono">sumedha_*_v1</code> engine. To enable real-time
              multi-user access across multiple technician smartphones and dispatch desktops simultaneously,
              a shared cloud database is required:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-emerald-400 block">
                  Option 1: Firebase Firestore &amp; Auth (Recommended)
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Provides live WebSocket document synchronization, offline caching for technicians in the field,
                  and mobile-ready push notifications. To provision, request Firebase in the chat.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-blue-400 block">
                  Option 2: Cloud SQL PostgreSQL
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Best for high-volume enterprise accounting, relational ledger integrity, and SQL reporting.
                  Uses Drizzle ORM and Express backend API routes.
                </p>
              </div>
            </div>
          </div>

          {/* Backup & Export Actions */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              One-Click Offline Data Exports
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  StorageService.exportBackupJSON();
                  showToast('Complete JSON backup downloaded.');
                }}
                className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>Complete JSON Snapshot</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    All companies, customers, tickets &amp; invoices
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  StorageService.exportCSV('customers');
                  showToast('Customers CSV downloaded.');
                }}
                className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span>Export Customers CSV</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{customers.length} customer records</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  StorageService.exportCSV('invoices');
                  showToast('Invoices & Quotations CSV downloaded.');
                }}
                className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-purple-400" />
                    <span>Export Billing CSV</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{invoices.length} billing documents</div>
                </div>
              </button>
            </div>
          </div>

          {/* Factory Reset Danger Zone */}
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-rose-300">Reset Application to Official Reference Data</h4>
              <p className="text-xs text-rose-400/80 mt-0.5">
                Restores original Sumedha Tech Infra settings, Darshanam quotation, and Avadh Sky GST invoice.
              </p>
            </div>
            <button
              type="button"
              onClick={onResetAllData}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
