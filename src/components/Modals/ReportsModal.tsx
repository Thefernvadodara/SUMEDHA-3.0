import React, { useState } from 'react';
import { X, BarChart3, Download, Check, ShieldCheck, Clock, Award } from 'lucide-react';

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportsModal: React.FC<ReportsModalProps> = ({ isOpen, onClose }) => {
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const equipmentBreakdown = [
    { label: 'CCTV & Surveillance', count: 48, pct: 28, color: 'bg-cyan-400' },
    { label: 'PoE Switches & Routers', count: 41, pct: 24, color: 'bg-blue-500' },
    { label: 'Biometrics & Attendance', count: 31, pct: 18, color: 'bg-emerald-400' },
    { label: 'Servers & Hyper-V', count: 26, pct: 15, color: 'bg-indigo-400' },
    { label: 'EPABX & IP Phones', count: 17, pct: 10, color: 'bg-violet-400' },
    { label: 'Workstations & Printers', count: 9, pct: 5, color: 'bg-teal-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-br from-[#0c1527] to-[#070c18] border border-cyan-500/30 p-6 shadow-2xl glow-cyan text-white">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Sumedha IT SLA & Operations Report</h3>
              <p className="text-xs text-slate-400">
                Monthly Infrastructure Health & Dispatch Analytics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Key KPI cards */}
        <div className="grid grid-cols-3 gap-3 my-4">
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">98.4%</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">SLA Met</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
            <div className="text-xl font-bold font-mono text-cyan-400 tabular-nums">1.8h</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Avg MTTR</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <Award className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <div className="text-xl font-bold font-mono text-amber-400 tabular-nums">4.9 / 5</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">CSAT Rating</div>
          </div>
        </div>

        {/* Equipment Incident Breakdown */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 mb-4">
          <h4 className="text-xs font-semibold text-slate-300 mb-3">
            Service Incidents by Equipment Category
          </h4>
          <div className="flex flex-col gap-2.5">
            {equipmentBreakdown.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">{item.label}</span>
                  <span className="font-mono text-slate-400 tabular-nums">
                    {item.count} calls ({item.pct}%)
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <span className="text-[11px] text-slate-400 font-mono">
            Audited cycle: Oct 1 - Oct 27, 2026
          </span>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
          >
            {downloaded ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Downloaded CSV</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export Operations Report</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
