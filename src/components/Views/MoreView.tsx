import React, { useState } from 'react';
import { EQUIPMENT_SPECS } from '../../data/mockData';
import { Company, Customer, EquipmentType, Invoice, SystemSettings, Technician } from '../../types';
import { EquipmentIcon, getEquipmentLabel } from '../EquipmentIcon';
import { JetpackComposeCodeViewer } from '../JetpackComposeCodeViewer';
import { SettingsAdminPanel } from '../Settings/SettingsAdminPanel';
import {
  Wrench,
  Users,
  RotateCcw,
  ShieldCheck,
  Database,
  Smartphone,
  Phone,
  Settings,
  Sparkles,
  Layers,
  Sliders,
} from 'lucide-react';

interface MoreViewProps {
  technicians: Technician[];
  companies: Company[];
  customers: Customer[];
  invoices: Invoice[];
  settings: SystemSettings;
  onSaveSettings: (settings: SystemSettings) => void;
  onOpenCompanyModal: (company?: Company) => void;
  onOpenCompanyDetail: (company: Company) => void;
  onDeleteCompany: (company: Company) => void;
  onToggleCompanyStatus: (companyId: string) => void;
  onResetDemoData: () => void;
  onToggleLoadingState: () => void;
  onToggleErrorState: () => void;
  isLoading: boolean;
  isError: boolean;
  onCallTechnician: ((tech: Technician) => void) | ((phone: string, name: string) => void);
  onOpenInstallGuide?: () => void;
  showToast: (msg: string) => void;
}

export const MoreView: React.FC<MoreViewProps> = ({
  technicians,
  companies,
  customers,
  invoices,
  settings,
  onSaveSettings,
  onOpenCompanyModal,
  onOpenCompanyDetail,
  onDeleteCompany,
  onToggleCompanyStatus,
  onResetDemoData,
  onToggleLoadingState,
  onToggleErrorState,
  isLoading,
  isError,
  onCallTechnician,
  onOpenInstallGuide,
  showToast,
}) => {
  const [section, setSection] = useState<'settings' | 'equipment' | 'technicians' | 'android' | 'demo'>('settings');

  const equipmentTypes: EquipmentType[] = [
    'cctv_camera',
    'nvr_dvr',
    'desktop_pc',
    'laptop',
    'network_printer',
    'biometric_punch',
    'networking_switch',
    'wifi_ap',
    'server_rack',
    'epabx_system',
  ];

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Top Section Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto scrollbar-thin">
        {[
          { id: 'settings' as const, label: 'Settings & Admin Panel', icon: Settings },
          { id: 'equipment' as const, label: 'Equipment Catalog', icon: Layers },
          { id: 'technicians' as const, label: 'Field Engineers', icon: Users },
          { id: 'android' as const, label: 'Android Studio Code', icon: Smartphone },
          { id: 'demo' as const, label: 'Demo Simulator', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = section === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSection(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: SETTINGS & ADMIN PANEL */}
      {section === 'settings' && (
        <SettingsAdminPanel
          settings={settings}
          companies={companies}
          customers={customers}
          invoices={invoices}
          onSaveSettings={onSaveSettings}
          onOpenCompanyModal={onOpenCompanyModal}
          onOpenCompanyDetail={onOpenCompanyDetail}
          onDeleteCompany={onDeleteCompany}
          onToggleCompanyStatus={onToggleCompanyStatus}
          showToast={showToast}
          onResetAllData={onResetDemoData}
        />
      )}

      {/* SECTION 2: EQUIPMENT CATALOG */}
      {section === 'equipment' && (
        <div className="flex flex-col gap-3">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>IT Infrastructure Equipment Catalog</span>
              <span className="text-xs font-mono text-cyan-400">
                ({equipmentTypes.length} Supported Categories)
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Certified surveillance, networking, biometric and telecom hardware serviced by Sumedha Tech Infra
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {equipmentTypes.map((eq) => {
              const spec = EQUIPMENT_SPECS[eq] || { vendor: 'OEM Certified', category: 'General' };
              return (
                <div
                  key={eq}
                  className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0b1426] border border-cyan-500/15 hover:border-cyan-500/35 transition-all flex items-start gap-3"
                >
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 shrink-0">
                    <EquipmentIcon type={eq} size="lg" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{getEquipmentLabel(eq)}</h4>
                    <span className="text-[10px] font-mono text-cyan-300">{spec.category}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{spec.vendor}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: FIELD SUPPORT ENGINEERS */}
      {section === 'technicians' && (
        <div className="flex flex-col gap-3">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Field Support Engineers
            </h3>
            <p className="text-xs text-slate-400">
              Dedicated Level 2 and Level 3 on-site engineers with mobile dispatch
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {technicians.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatarUrl}
                    alt={t.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-cyan-400 shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.name}</h4>
                    <p className="text-[10px] text-slate-400">{t.role}</p>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {t.rating}★ · {t.completedThisMonth} tickets
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => (onCallTechnician as (t: any, n?: string) => void)(t, t.name)}
                  className="p-2 rounded-xl bg-slate-800 text-cyan-400 hover:text-white hover:bg-cyan-600 transition-colors cursor-pointer"
                  title={`Call ${t.phone}`}
                >
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: NATIVE ANDROID CODE INSPECTOR */}
      {section === 'android' && (
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-2 font-mono">
            Native Android Jetpack Compose Code
          </h3>
          <JetpackComposeCodeViewer onOpenInstallGuide={onOpenInstallGuide} />
        </div>
      )}

      {/* SECTION 5: DEMO CONTROLS */}
      {section === 'demo' && (
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Interactive State &amp; Feedback Simulator
            </h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Simulate loading skeletons, test error boundary states, or refresh state data.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={onResetDemoData}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-cyan-500/20 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data to Factory Default</span>
            </button>

            <button
              onClick={onToggleLoadingState}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                isLoading
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <span>Simulate Loading Skeleton</span>
            </button>

            <button
              onClick={onToggleErrorState}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                isError
                  ? 'bg-rose-500 text-white border-rose-400 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <span>Simulate Error State</span>
            </button>
          </div>
        </div>
      )}

      {/* Enterprise Company Footer */}
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center text-xs text-slate-500 font-mono">
        Sumedha Tech Infra IT Service Manager v4.3.0 · Ahmedabad NOC · 24x7 Enterprise Support
      </div>
    </div>
  );
};
