import React from 'react';
import { Layers, Clock, Flame, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { Ticket, TicketStatus } from '../types';

interface StatsGridProps {
  tickets: Ticket[];
  selectedFilter: TicketStatus | 'all' | null;
  onSelectFilter: (status: TicketStatus | 'all') => void;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  tickets,
  selectedFilter,
  onSelectFilter,
}) => {
  const totalTasks = tickets.length;
  const pendingCount = tickets.filter((t) => t.status === 'pending').length;
  const inProgressCount = tickets.filter((t) => t.status === 'in_progress').length;
  const solvedCount = tickets.filter((t) => t.status === 'solved').length;

  const statItems = [
    {
      id: 'all' as const,
      label: 'Total Tasks',
      count: totalTasks,
      trend: '+12% this wk',
      icon: Layers,
      gradient: 'from-blue-600/20 via-slate-900 to-[#0c1529]',
      borderColor: 'border-blue-500/30 hover:border-blue-400',
      activeRing: 'ring-2 ring-blue-500 shadow-blue-500/20',
      iconColor: 'text-blue-400',
      textColor: 'text-blue-300',
      accentBar: 'bg-blue-500',
    },
    {
      id: 'pending' as const,
      label: 'Pending',
      count: pendingCount,
      trend: '3 need assignment',
      icon: Clock,
      gradient: 'from-amber-500/20 via-slate-900 to-[#0c1529]',
      borderColor: 'border-amber-500/30 hover:border-amber-400',
      activeRing: 'ring-2 ring-amber-500 shadow-amber-500/20',
      iconColor: 'text-amber-400',
      textColor: 'text-amber-300',
      accentBar: 'bg-amber-500',
    },
    {
      id: 'in_progress' as const,
      label: 'In Progress',
      count: inProgressCount,
      trend: 'Active on-site',
      icon: Flame,
      gradient: 'from-cyan-500/20 via-slate-900 to-[#0c1529]',
      borderColor: 'border-cyan-500/30 hover:border-cyan-400',
      activeRing: 'ring-2 ring-cyan-500 shadow-cyan-500/20',
      iconColor: 'text-cyan-400',
      textColor: 'text-cyan-300',
      accentBar: 'bg-cyan-400',
    },
    {
      id: 'solved' as const,
      label: 'Solved',
      count: solvedCount,
      trend: '94% SLA met',
      icon: CheckCircle2,
      gradient: 'from-emerald-500/20 via-slate-900 to-[#0c1529]',
      borderColor: 'border-emerald-500/30 hover:border-emerald-400',
      activeRing: 'ring-2 ring-emerald-500 shadow-emerald-500/20',
      iconColor: 'text-emerald-400',
      textColor: 'text-emerald-300',
      accentBar: 'bg-emerald-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {statItems.map((item) => {
        const IconComponent = item.icon;
        const isSelected = selectedFilter === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onSelectFilter(item.id)}
            className={`relative text-left p-4 rounded-2xl bg-gradient-to-br ${item.gradient} border ${item.borderColor} transition-all duration-200 cursor-pointer overflow-hidden group shadow-md ${
              isSelected ? item.activeRing : ''
            }`}
          >
            {/* Top Row: Icon & Filter indicator */}
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 ${item.iconColor} group-hover:scale-105 transition-transform`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 group-hover:text-slate-200 font-mono transition-colors">
                <span>Filter</span>
                <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>

            {/* Metric Value */}
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight">
                {item.count}
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-0.5">
                {item.label}
              </div>
            </div>

            {/* Bottom Trend & Micro Accent */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-800/80">
              <span className="truncate">{item.trend}</span>
              <div className={`w-1.5 h-1.5 rounded-full ${item.accentBar}`} />
            </div>
          </button>
        );
      })}
    </div>
  );
};
