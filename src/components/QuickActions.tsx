import React from 'react';
import { Plus, UserPlus, FileText, BarChart3 } from 'lucide-react';

interface QuickActionsProps {
  onNewTask: () => void;
  onAddCustomer: () => void;
  onCreateInvoice: () => void;
  onViewReports: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onNewTask,
  onAddCustomer,
  onCreateInvoice,
  onViewReports,
}) => {
  const actions = [
    {
      label: '+ New Task',
      sub: 'Dispatch ticket',
      icon: Plus,
      onClick: onNewTask,
      color: 'from-cyan-500/20 to-blue-600/20 border-cyan-500/30 hover:border-cyan-400 text-cyan-300',
      iconBg: 'bg-cyan-500/20 text-cyan-400',
    },
    {
      label: 'Add Customer',
      sub: 'AMC / Corporate client',
      icon: UserPlus,
      onClick: onAddCustomer,
      color: 'from-blue-600/20 to-indigo-600/20 border-blue-500/30 hover:border-blue-400 text-blue-300',
      iconBg: 'bg-blue-500/20 text-blue-400',
    },
    {
      label: 'Create Invoice',
      sub: 'Service bill / GST',
      icon: FileText,
      onClick: onCreateInvoice,
      color: 'from-teal-500/20 to-emerald-600/20 border-teal-500/30 hover:border-teal-400 text-teal-300',
      iconBg: 'bg-teal-500/20 text-teal-400',
    },
    {
      label: 'View Reports',
      sub: 'SLA & analytics',
      icon: BarChart3,
      onClick: onViewReports,
      color: 'from-purple-500/20 to-sky-600/20 border-purple-500/30 hover:border-purple-400 text-purple-300',
      iconBg: 'bg-purple-500/20 text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
      {actions.map((act) => {
        const IconComponent = act.icon;
        return (
          <button
            key={act.label}
            onClick={act.onClick}
            className={`p-3.5 rounded-2xl bg-gradient-to-br ${act.color} border transition-all duration-200 text-left flex items-center gap-3 cursor-pointer group shadow-md hover:shadow-cyan-500/10 active:scale-[0.98]`}
          >
            <div className={`p-2.5 rounded-xl ${act.iconBg} border border-white/5 group-hover:scale-110 transition-transform shrink-0`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="block text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                {act.label}
              </span>
              <span className="block text-[10px] text-slate-400 truncate">
                {act.sub}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
