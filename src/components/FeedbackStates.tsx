import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export const DashboardLoadingSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      {/* Hero Skeleton */}
      <div className="h-44 rounded-3xl bg-slate-900/80 border border-slate-800" />

      {/* 4 Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-900/70 border border-slate-800" />
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-56 rounded-2xl bg-slate-900/70 border border-slate-800" />
        <div className="h-56 rounded-2xl bg-slate-900/70 border border-slate-800" />
      </div>

      {/* Recent calls skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-slate-900/60 border border-slate-800" />
        ))}
      </div>
    </div>
  );
};

interface ErrorStateProps {
  onRetry: () => void;
  message?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  onRetry,
  message = 'Unable to establish secure telemetry link with field gateway.',
}) => {
  return (
    <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-[#070b14] border border-rose-500/30 text-center flex flex-col items-center justify-center gap-3 my-4">
      <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
        <WifiOff className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-white tracking-tight">
        Service Gateway Connection Error
      </h3>
      <p className="text-xs text-slate-300 max-w-md leading-relaxed">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors cursor-pointer"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Reconnect Gateway</span>
      </button>
    </div>
  );
};
