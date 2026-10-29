import React from 'react';
import { ShieldCheck, Activity, Users, PlusCircle } from 'lucide-react';
import { Ticket } from '../types';

interface HeroServiceOverviewProps {
  tickets: Ticket[];
  onQuickNewTicket: () => void;
}

export const HeroServiceOverview: React.FC<HeroServiceOverviewProps> = ({
  tickets,
  onQuickNewTicket,
}) => {
  const pendingTickets = tickets.filter((t) => t.status === 'pending').length;
  const inProgressTickets = tickets.filter((t) => t.status === 'in_progress').length;
  const urgentCount = tickets.filter((t) => t.priority === 'urgent' && t.status !== 'solved').length;

  return (
    <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#0c1b3a] via-[#09152e] to-[#060c1d] border border-cyan-500/30 shadow-2xl glow-cyan">
      {/* Decorative vector background circuit lines */}
      <div className="absolute top-0 right-0 -mt-6 -mr-6 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Vector Grid overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="infra-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-cyan-400" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#infra-grid)" />
      </svg>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono font-semibold tracking-wider uppercase text-cyan-300">
              Operations Control Center
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> All Field Gateways Online
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Service Overview
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
            Today's IT service operations: <strong className="text-cyan-300 font-medium">{inProgressTickets} active repairs</strong> underway,{' '}
            <strong className="text-amber-300 font-medium">{pendingTickets} awaiting technician dispatch</strong>, and{' '}
            <strong className="text-rose-400 font-medium">{urgentCount} urgent emergency SLAs</strong> being handled across enterprise facilities.
          </p>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mt-4 pt-3 border-t border-cyan-500/20">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                SLA Compliance
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-base sm:text-lg font-bold text-white font-mono tabular-nums">
                  98.4%
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Field Engineers
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-base sm:text-lg font-bold text-white font-mono tabular-nums">
                  3 Dispatched
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Avg Response
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Activity className="w-4 h-4 text-sky-400" />
                <span className="text-base sm:text-lg font-bold text-white font-mono tabular-nums">
                  24 mins
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex sm:flex-col items-center justify-end gap-2.5 shrink-0">
          <button
            onClick={onQuickNewTicket}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span>Dispatch Service Ticket</span>
          </button>
          <span className="text-[11px] text-slate-400 text-center font-mono">
            Auto-assigned to nearest engineer
          </span>
        </div>
      </div>
    </div>
  );
};
