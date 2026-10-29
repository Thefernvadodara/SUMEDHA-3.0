import React, { useState } from 'react';
import { Ticket, TicketStatus, EquipmentType, TicketPriority } from '../../types';
import { EquipmentIcon, getEquipmentLabel } from '../EquipmentIcon';
import { StatusIndicator, PriorityIndicator } from '../StatusBadge';
import { Search, Filter, Plus, MapPin, Calendar, Clock, SlidersHorizontal } from 'lucide-react';

interface TasksViewProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
  onNewTicket?: () => void;
  onNewTask?: () => void;
  onUpdateStatus: (ticketId: string, status: TicketStatus) => void;
  initialFilter?: TicketStatus | 'all' | null;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tickets,
  onSelectTicket,
  onNewTicket,
  onNewTask,
  onUpdateStatus,
  initialFilter = 'all',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>(initialFilter || 'all');
  const [equipmentFilter, setEquipmentFilter] = useState<EquipmentType | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'all'>('all');

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesEquipment = equipmentFilter === 'all' || ticket.equipmentType === equipmentFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesEquipment && matchesPriority;
  });

  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>IT Service Tickets & Tasks</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
              {filteredTickets.length} / {tickets.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time field engineer dispatch, equipment repair queues, and SLA tracking
          </p>
        </div>

        <button
          onClick={onNewTask || onNewTicket}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Service Task</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ticket #, client, equipment, location..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 font-medium"
          />
        </div>

        {/* Status Filter Tabs (Interactive Filter Controls conforming to constitution) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {(['all', 'pending', 'in_progress', 'solved', 'on_hold'] as const).map((st) => {
            const count = st === 'all' ? tickets.length : tickets.filter((t) => t.status === st).length;
            const isSelected = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-colors cursor-pointer capitalize ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {st.replace('_', ' ')} ({count})
              </button>
            );
          })}
        </div>

        {/* Secondary Category Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-1 text-slate-400">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Equipment:</span>
          </div>

          <select
            value={equipmentFilter}
            onChange={(e) => setEquipmentFilter(e.target.value as EquipmentType | 'all')}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="all">All Equipment</option>
            <option value="cctv_camera">CCTV Cameras</option>
            <option value="nvr_dvr">NVR / DVR</option>
            <option value="networking_switch">PoE Switches</option>
            <option value="biometric_punch">Biometrics</option>
            <option value="server_rack">Servers</option>
            <option value="wifi_ap">Wi-Fi APs</option>
            <option value="epabx_system">EPABX</option>
          </select>

          <span className="text-slate-600">·</span>

          <div className="flex items-center gap-1 text-slate-400">
            <span>Priority:</span>
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as TicketPriority | 'all')}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Ticket Cards Stream */}
      {filteredTickets.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col items-center justify-center gap-3">
          <span className="text-2xl">🔍</span>
          <h4 className="text-sm font-bold text-white">No tickets match criteria</h4>
          <p className="text-xs text-slate-400 max-w-sm">
            Try adjusting your search query, equipment filter or status selections.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setEquipmentFilter('all');
              setPriorityFilter('all');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-xs text-cyan-300 font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => onSelectTicket(ticket)}
              className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0a1224] to-[#070d1a] border border-cyan-500/15 hover:border-cyan-500/40 shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Card Top */}
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

                {/* Title & Customer */}
                <h4 className="text-sm font-semibold text-white group-hover:text-cyan-200 transition-colors mt-2.5">
                  {ticket.title}
                </h4>

                <div className="mt-2 flex flex-col gap-1 text-xs">
                  <div className="font-medium text-slate-300 truncate">
                    🏢 {ticket.customerName}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 truncate">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>{ticket.location}</span>
                  </div>
                </div>

                <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                  {ticket.description}
                </p>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
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
                      SLA: {ticket.slaTimeHours}h
                    </span>
                  </div>
                </div>

                <div
                  className="flex items-center gap-2 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <StatusIndicator status={ticket.status} />
                  <select
                    value={ticket.status}
                    onChange={(e) => onUpdateStatus(ticket.id, e.target.value as TicketStatus)}
                    className="text-[11px] bg-slate-800/90 border border-slate-700/80 rounded-lg px-2 py-1 text-slate-300 hover:text-white outline-none cursor-pointer"
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
      )}
    </div>
  );
};
