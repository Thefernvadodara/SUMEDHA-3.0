import React from 'react';
import { AlertTriangle, Archive, Trash2, X, ShieldAlert } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  itemName: string;
  itemType: 'customer' | 'company' | 'invoice' | 'staff' | 'task';
  linkedCounts?: {
    tickets?: number;
    invoices?: number;
    customers?: number;
  };
  onConfirmDelete: () => void;
  onConfirmArchive?: () => void;
  isArchived?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  title,
  itemName,
  itemType,
  linkedCounts,
  onConfirmDelete,
  onConfirmArchive,
  isArchived,
}) => {
  if (!isOpen) return null;

  const hasLinkedRecords =
    (linkedCounts?.tickets ?? 0) > 0 ||
    (linkedCounts?.invoices ?? 0) > 0 ||
    (linkedCounts?.customers ?? 0) > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-rose-500/30 p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
              <p className="text-[11px] text-slate-400">Security & Data Audit Validation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          <p className="text-xs text-slate-300 leading-relaxed">
            Are you sure you want to proceed with <strong className="text-white">{itemName}</strong>?
          </p>

          {hasLinkedRecords && (
            <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Historical Audit Protection Warning</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-200/90">
                This {itemType} is linked to:
                {linkedCounts?.tickets ? ` ${linkedCounts.tickets} service ticket(s),` : ''}
                {linkedCounts?.invoices ? ` ${linkedCounts.invoices} invoice record(s),` : ''}
                {linkedCounts?.customers ? ` ${linkedCounts.customers} corporate client(s).` : ''}
                <br />
                Permanent deletion will break historical audit trails. We strongly recommend{' '}
                <strong>Archiving / Deactivating</strong> instead.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            Cancel
          </button>

          {onConfirmArchive && (
            <button
              onClick={() => {
                onConfirmArchive();
                onClose();
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{isArchived ? 'Reactivate' : 'Deactivate / Archive'}</span>
            </button>
          )}

          {!hasLinkedRecords && (
            <button
              onClick={() => {
                onConfirmDelete();
                onClose();
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Permanently</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
