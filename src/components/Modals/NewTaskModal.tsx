import React, { useState } from 'react';
import { Customer, EquipmentType, Technician, Ticket, TicketPriority } from '../../types';
import { EquipmentIcon, getEquipmentLabel } from '../EquipmentIcon';
import { X, Wrench, Calendar, MapPin, AlertCircle } from 'lucide-react';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  technicians: Technician[];
  onCreateTicket: (ticket: Ticket) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  customers,
  technicians,
  onCreateTicket,
}) => {
  const [title, setTitle] = useState('');
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [equipmentType, setEquipmentType] = useState<EquipmentType>('cctv_camera');
  const [equipmentModel, setEquipmentModel] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('high');
  const [technicianId, setTechnicianId] = useState(technicians[0]?.id || '');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [billable, setBillable] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedCust = customers.find((c) => c.id === customerId) || customers[0];
    const selectedTech = technicians.find((t) => t.id === technicianId) || technicians[0];

    const newTicket: Ticket = {
      id: `STI-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title.trim(),
      customerId: selectedCust.id,
      customerName: selectedCust.name,
      customerCompany: selectedCust.company,
      customerPhone: selectedCust.phone,
      location: location.trim() || selectedCust.address,
      equipmentType,
      equipmentModel: equipmentModel.trim() || getEquipmentLabel(equipmentType),
      priority,
      status: 'pending',
      technicianId: selectedTech.id,
      technicianName: selectedTech.name,
      technicianAvatar: selectedTech.avatarUrl,
      createdAt: 'Just now',
      scheduledDate: 'Today, within 2h',
      description: description.trim() || 'Service ticket initiated via dispatcher.',
      billable,
      estimatedCost: estimatedCost ? parseFloat(estimatedCost) : undefined,
      slaTimeHours: priority === 'urgent' ? 2 : priority === 'high' ? 4 : 8,
    };

    onCreateTicket(newTicket);
    onClose();
  };

  const equipmentOptions: EquipmentType[] = [
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-br from-[#0c1527] to-[#070c18] border border-cyan-500/30 p-6 shadow-2xl glow-cyan text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Dispatch New Service Ticket</h3>
              <p className="text-xs text-slate-400">
                Sumedha Tech Infra Service Operations
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          {/* Issue Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Issue / Service Subject *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CCTV Bullet Camera feed glitch in Factory Hall 2"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm text-white placeholder-slate-500 outline-none"
            />
          </div>

          {/* Customer & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Client / Company *
              </label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white outline-none focus:border-cyan-400 cursor-pointer"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.amcStatus})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Specific Location / Room
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Server Room 2F, Rack #3"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Equipment Category Selection Grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select IT Equipment Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {equipmentOptions.map((opt) => {
                const isSelected = equipmentType === opt;
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setEquipmentType(opt)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <EquipmentIcon type={opt} size="md" />
                    <span className="text-[10px] font-medium leading-tight">
                      {getEquipmentLabel(opt)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Equipment Model / Specs */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Equipment Model / Serial No.
            </label>
            <input
              type="text"
              value={equipmentModel}
              onChange={(e) => setEquipmentModel(e.target.value)}
              placeholder="e.g. Hikvision 4MP DarkFighter (DS-2CD2043G2-I)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400"
            />
          </div>

          {/* Priority & Assigned Technician */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="urgent">🔴 Urgent (2-hour SLA)</option>
                <option value="high">🟠 High (4-hour SLA)</option>
                <option value="medium">🔵 Medium (8-hour SLA)</option>
                <option value="low">⚪ Low (24-hour SLA)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Assign Field Engineer
              </label>
              <select
                value={technicianId}
                onChange={(e) => setTechnicianId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white outline-none focus:border-cyan-400 cursor-pointer"
              >
                {technicians.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.rating}★ - {t.activeTasks} active)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Problem Details */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Service Diagnostics & Symptoms
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe symptoms, error codes, network indicators, or customer complaint..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          {/* Billable & Estimated Cost */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="billable"
                checked={billable}
                onChange={(e) => setBillable(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 bg-slate-800 border-slate-700"
              />
              <label htmlFor="billable" className="text-xs font-semibold text-slate-200 cursor-pointer">
                Non-AMC / Chargeable Service (Out of Warranty)
              </label>
            </div>

            {billable && (
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="text-slate-400">Est. ₹</span>
                <input
                  type="number"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  placeholder="3500"
                  className="w-24 px-2 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-bold outline-none"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
            >
              Confirm Dispatch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
