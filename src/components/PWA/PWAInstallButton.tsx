import React from 'react';
import { Download, Smartphone, Check } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  onOpenGuideModal: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ onOpenGuideModal }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  // If already running inside standalone app, show small verified indicator
  if (isInstalled) {
    return (
      <button
        onClick={onOpenGuideModal}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/60 transition cursor-pointer"
        title="App Installed & Running in Standalone Mode"
      >
        <Check className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden sm:inline">Installed PWA</span>
        <span className="sm:hidden">Installed</span>
      </button>
    );
  }

  // Chromium / Android prompt available
  if (isInstallable) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={install}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 transition cursor-pointer"
          title="Install Sumedha Tech Infra on Android"
        >
          <Smartphone className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Install on Android</span>
        </button>
        <button
          onClick={onOpenGuideModal}
          className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:text-white hover:border-cyan-500/40 text-xs transition cursor-pointer"
          title="Android Install & APK Build Guide"
        >
          ?
        </button>
      </div>
    );
  }

  // Fallback button that opens the comprehensive install guide modal
  return (
    <button
      onClick={onOpenGuideModal}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition cursor-pointer"
      title="Install on Android or View APK Steps"
    >
      <Download className="w-3.5 h-3.5 text-cyan-400" />
      <span className="hidden sm:inline">Install on Android</span>
      <span className="sm:hidden">Install</span>
    </button>
  );
};
