import React from 'react';
import { Ticket, TicketStatus } from '../types';
import { EquipmentIcon, getEquipmentLabel } from './EquipmentIcon';
import { StatusIndicator, PriorityIndicator } from './StatusBadge';
import { ChevronRight, Phone, MapPin } from 'lucide-react';

interface RecentServiceCallsProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
  onUpdateStatus: (ticketId: string, newStatus: TicketStatus) => void;
  onViewAllTasks: () => void;
}

export const RecentServiceCalls: React.FC<RecentServiceCallsProps> = ({
  tickets,
  onSelectTicket,
  onUpdateStatus,
  onViewAllTasks,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Recent Service Calls</span>
            <span className="text-xs font-mono font-medium text-cyan-400">
              ({tickets.length})
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Active dispatched tickets and on-site repair jobs
          </p>
        </div>
        <button
          onClick={onViewAllTasks}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>View All Tickets</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {tickets.slice(0, 6).map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => onSelectTicket(ticket)}
            className="group relative p-4 rounded-2xl bg-gradient-to-br from-slate-900/95 via-[#0b1325]/95 to-[#080d1a]/95 border border-cyan-500/15 hover:border-cyan-500/40 shadow-lg hover:shadow-cyan-500/10 transition-all duration-200 cursor-pointer"
          >
            {/* Header: Ticket ID & Priority & Equipment Tag */}
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-300">
                  #{ticket.id}
                </span>
                <span className="text-slate-600">·</span>
                <PriorityIndicator priority={ticket.priority} />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <EquipmentIcon type={ticket.equipmentType} size="sm" />
                <span className="text-[11px] font-medium text-slate-300">
                  {getEquipmentLabel(ticket.equipmentType)}
                </span>
              </div>
            </div>

            {/* Middle: Title & Client Information */}
            <div className="mt-3">
              <h4 className="text-sm font-semibold text-white group-hover:text-cyan-200 transition-colors line-clamp-1">
                {ticket.title}
              </h4>

              <div className="mt-2 flex flex-col gap-1 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 font-medium text-slate-200">
                  <span className="text-cyan-400">🏢</span>
                  <span className="truncate">{ticket.customerName}</span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="truncate">{ticket.location}</span>
                </div>
              </div>
            </div>

            {/* Bottom: Technician Assigned & Status Selector */}
            <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
              {/* Technician Avatar & Name */}
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={ticket.technicianAvatar}
                  alt={ticket.technicianName}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-cyan-500/30 shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-medium text-slate-300 truncate">
                    {ticket.technicianName}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    {ticket.createdAt}
                  </span>
                </div>
              </div>

              {/* Status Indicator & Quick Changer */}
              <div
                className="flex items-center gap-2 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <StatusIndicator status={ticket.status} />

                {/* Quick status dropdown */}
                <select
                  value={ticket.status}
                  onChange={(e) => onUpdateStatus(ticket.id, e.target.value as TicketStatus)}
                  className="text-[11px] bg-slate-800/90 border border-slate-700/80 rounded-lg px-2 py-1 text-slate-300 hover:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
                  title="Change status"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="solved">Solved</option>
                  <option value="on_hold">On Hold</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
