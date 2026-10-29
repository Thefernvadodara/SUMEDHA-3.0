import React, { useState } from 'react';
import { Plus, Wrench, UserPlus, FilePlus2, X } from 'lucide-react';

interface FloatingActionButtonProps {
  onNewTicket: () => void;
  onAddCustomer: () => void;
  onCreateInvoice: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onNewTicket,
  onAddCustomer,
  onCreateInvoice,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-5 z-40 flex flex-col items-end gap-2.5">
      {/* Speed dial menu items */}
      {isOpen && (
        <div className="flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <button
            onClick={() => {
              onCreateInvoice();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-teal-500/40 text-teal-300 text-xs font-semibold shadow-xl hover:bg-slate-800 transition-all cursor-pointer"
          >
            <span>Create Invoice</span>
            <div className="p-1 rounded-lg bg-teal-500/20">
              <FilePlus2 className="w-4 h-4 text-teal-400" />
            </div>
          </button>

          <button
            onClick={() => {
              onAddCustomer();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-blue-500/40 text-blue-300 text-xs font-semibold shadow-xl hover:bg-slate-800 transition-all cursor-pointer"
          >
            <span>Add Customer</span>
            <div className="p-1 rounded-lg bg-blue-500/20">
              <UserPlus className="w-4 h-4 text-blue-400" />
            </div>
          </button>

          <button
            onClick={() => {
              onNewTicket();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-xl hover:bg-slate-800 transition-all cursor-pointer"
          >
            <span>Emergency Ticket</span>
            <div className="p-1 rounded-lg bg-cyan-500/20">
              <Wrench className="w-4 h-4 text-cyan-400" />
            </div>
          </button>
        </div>
      )}

      {/* Main Material 3 FAB Button */}
      <button
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
          } else {
            onNewTicket();
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-label="Create new service ticket"
        className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold flex items-center justify-center shadow-xl shadow-cyan-500/30 active:scale-95 transition-all duration-200 cursor-pointer border border-cyan-300/40 glow-cyan group"
        title="Click to dispatch ticket, right click or long tap for options"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-slate-950 stroke-[2.5]" />
        ) : (
          <Plus className="w-7 h-7 text-slate-950 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
        )}
      </button>
    </div>
  );
};
