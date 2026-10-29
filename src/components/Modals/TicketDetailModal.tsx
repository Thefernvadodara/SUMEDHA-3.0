import React, { useState } from 'react';
import { Ticket, TicketStatus, Technician } from '../../types';
import { EquipmentIcon, getEquipmentLabel } from '../EquipmentIcon';
import { StatusIndicator, PriorityIndicator } from '../StatusBadge';
import { X, MapPin, Phone, User, Calendar, Check, Clock, Save, FileText } from 'lucide-react';

interface TicketDetailModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  technicians: Technician[];
  onUpdateTicket: (updated: Ticket) => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  isOpen,
  onClose,
  technicians,
  onUpdateTicket,
}) => {
  if (!isOpen || !ticket) return null;

  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [resolutionNotes, setResolutionNotes] = useState(ticket.resolutionNotes || '');
  const [technicianId, setTechnicianId] = useState(ticket.technicianId);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    const selectedTech = technicians.find((t) => t.id === technicianId) || technicians[0];
    const updated: Ticket = {
      ...ticket,
      status,
      technicianId: selectedTech.id,
      technicianName: selectedTech.name,
      technicianAvatar: selectedTech.avatarUrl,
      resolutionNotes: resolutionNotes.trim() || undefined,
    };
    onUpdateTicket(updated);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-br from-[#0c1527] to-[#070c18] border border-cyan-500/30 p-6 shadow-2xl glow-cyan text-white">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shrink-0">
              <EquipmentIcon type={ticket.equipmentType} size="lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  #{ticket.id}
                </span>
                <span className="text-slate-600">·</span>
                <PriorityIndicator priority={ticket.priority} />
                <span className="text-slate-600">·</span>
                <StatusIndicator status={status} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                {ticket.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="mt-4 flex flex-col gap-4 text-xs">
          {/* Status Switcher Bar */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <label className="block text-[11px] font-semibold text-slate-300 mb-2">
              Update Ticket Status
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['pending', 'in_progress', 'solved', 'on_hold'] as TicketStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`py-2 px-1.5 rounded-xl font-medium text-center transition-all capitalize cursor-pointer text-xs ${
                    status === st
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Client & Equipment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-2">
              <span className="text-[10px] uppercase font-semibold text-slate-500">
                Customer & Location
              </span>
              <div className="font-semibold text-slate-200 text-sm">
                {ticket.customerName}
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{ticket.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href={`tel:${ticket.customerPhone}`} className="text-cyan-400 hover:underline">
                  {ticket.customerPhone}
                </a>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-2">
              <span className="text-[10px] uppercase font-semibold text-slate-500">
                Equipment Information
              </span>
              <div className="font-semibold text-slate-200 text-sm">
                {getEquipmentLabel(ticket.equipmentType)}
              </div>
              <div className="text-slate-300">
                {ticket.equipmentModel}
              </div>
              {ticket.serialNumber && (
                <div className="text-slate-400 font-mono text-[11px]">
                  S/N: {ticket.serialNumber}
                </div>
              )}
            </div>
          </div>

          {/* Problem Diagnostics */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">
              Issue Diagnostics
            </span>
            <p className="text-slate-300 text-xs leading-relaxed">
              {ticket.description}
            </p>
          </div>

          {/* Assigned Technician */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">
                Assigned Field Engineer
              </span>
              <div className="flex items-center gap-2.5">
                <img
                  src={ticket.technicianAvatar}
                  alt={ticket.technicianName}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-cyan-400"
                />
                <div>
                  <div className="font-semibold text-white text-sm">
                    {ticket.technicianName}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    SLA Max Window: {ticket.slaTimeHours} Hours
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-48">
              <label className="text-[10px] text-slate-400 block mb-1">Reassign Engineer</label>
              <select
                value={technicianId}
                onChange={(e) => setTechnicianId(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs outline-none focus:border-cyan-400 cursor-pointer"
              >
                {technicians.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Field Resolution Notes */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Technician Resolution Notes / Action Taken
            </label>
            <textarea
              rows={2}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="e.g. Swapped PoE power injector, checked RJ45 crimping, updated camera firmware to v5.8..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400 resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-800">
          <span className="text-[11px] font-mono text-slate-500">
            {ticket.billable ? `Chargeable Service (Est ₹${ticket.estimatedCost || 0})` : 'Covered under AMC contract'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{isSaved ? 'Updated!' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
