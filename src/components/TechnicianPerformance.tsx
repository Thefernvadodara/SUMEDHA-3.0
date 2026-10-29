import React from 'react';
import { Technician } from '../types';
import { Star, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { EquipmentIcon, getEquipmentLabel } from './EquipmentIcon';

interface TechnicianPerformanceProps {
  technicians: Technician[];
  onCallTechnician?: ((tech: Technician) => void) | ((phone: string, name: string) => void);
  onViewAllStaff?: () => void;
}

export const TechnicianPerformance: React.FC<TechnicianPerformanceProps> = ({
  technicians,
  onCallTechnician,
  onViewAllStaff,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Technician Performance</span>
            <span className="text-xs font-mono font-medium text-emerald-400">
              ({technicians.filter((t) => t.isAvailable).length} Available)
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            SLA velocity, rating & monthly resolution metrics
          </p>
        </div>
      </div>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {technicians.map((tech) => (
          <div
            key={tech.id}
            className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 via-[#0a1224]/90 to-[#070d1a]/90 border border-cyan-500/15 hover:border-cyan-500/35 transition-all duration-200 shadow-md group"
          >
            {/* Top Row: Avatar & Rating */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={tech.avatarUrl}
                    alt={tech.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-cyan-500/30 group-hover:ring-cyan-400/50 transition-all"
                  />
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {tech.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {tech.role}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-xs font-semibold shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{tech.rating}</span>
              </div>
            </div>

            {/* Middle: Completion Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                <span className="text-slate-400">Monthly Completion</span>
                <span className="text-cyan-300 font-bold tabular-nums">
                  {tech.completionRate}% ({tech.completedThisMonth}/{tech.totalTasks})
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)] transition-all duration-500"
                  style={{ width: `${tech.completionRate}%` }}
                />
              </div>
            </div>

            {/* Specializations & Active Load */}
            <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Gear:
                </span>
                <div className="flex items-center gap-1">
                  {tech.specializations.slice(0, 3).map((spec) => (
                    <div
                      key={spec}
                      title={getEquipmentLabel(spec)}
                      className="p-1 rounded bg-slate-800 border border-slate-700/60"
                    >
                      <EquipmentIcon type={spec} size="sm" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-300 font-mono">
                  <strong className="text-cyan-400">{tech.activeTasks}</strong> active
                </span>
                <button
                  onClick={() => {
                    if (onCallTechnician) {
                      (onCallTechnician as (t: any, n?: string) => void)(tech, tech.name);
                    }
                  }}
                  aria-label={`Call ${tech.name}`}
                  className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 hover:text-white hover:bg-cyan-600 transition-colors cursor-pointer"
                  title={`Call ${tech.phone}`}
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
