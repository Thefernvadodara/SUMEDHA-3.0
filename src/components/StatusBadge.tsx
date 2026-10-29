import React from 'react';
import { TicketPriority, TicketStatus } from '../types';

interface StatusIndicatorProps {
  status: TicketStatus;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, className = '' }) => {
  switch (status) {
    case 'pending':
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span>Pending</span>
        </span>
      );
    case 'in_progress':
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span>In Progress</span>
        </span>
      );
    case 'solved':
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Solved</span>
        </span>
      );
    case 'on_hold':
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          <span>On Hold</span>
        </span>
      );
  }
};

interface PriorityIndicatorProps {
  priority: TicketPriority;
  className?: string;
}

export const PriorityIndicator: React.FC<PriorityIndicatorProps> = ({ priority, className = '' }) => {
  switch (priority) {
    case 'urgent':
      return (
        <span className={`text-[11px] font-semibold text-rose-400 uppercase tracking-wider ${className}`}>
          Urgent
        </span>
      );
    case 'high':
      return (
        <span className={`text-[11px] font-semibold text-amber-400 uppercase tracking-wider ${className}`}>
          High
        </span>
      );
    case 'medium':
      return (
        <span className={`text-[11px] font-semibold text-sky-400 uppercase tracking-wider ${className}`}>
          Medium
        </span>
      );
    case 'low':
      return (
        <span className={`text-[11px] font-semibold text-slate-400 uppercase tracking-wider ${className}`}>
          Low
        </span>
      );
  }
};
