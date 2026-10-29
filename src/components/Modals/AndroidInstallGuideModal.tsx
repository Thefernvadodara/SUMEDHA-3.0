import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  Terminal,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface AndroidInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidInstallGuideModal: React.FC<AndroidInstallGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'pwa' | 'native'>('pwa');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-cyan-500/30 p-6 shadow-2xl text-slate-100 scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  Android Installation Center
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified PWA &amp; Native
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Install Sumedha Tech Infra on Android
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Option Tabs */}
        <div className="flex rounded-xl bg-slate-950 p-1 mt-4 border border-slate-800">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'pwa'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Progressive Web App (Instant Install)</span>
          </button>
          <button
            onClick={() => setActiveTab('native')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'native'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Native Android Project &amp; APK Build</span>
          </button>
        </div>

        {/* Tab 1: PWA Installation */}
        {activeTab === 'pwa' && (
          <div className="flex flex-col gap-4 mt-5">
            {isInstalled ? (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-300">
                    Application is Already Installed!
                  </h4>
                  <p className="text-xs text-emerald-400/80">
                    Sumedha Tech Infra is running in standalone Android mode with offline caching and hardware acceleration.
                  </p>
                </div>
              </div>
            ) : isInstallable ? (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-cyan-300 uppercase tracking-wider">
                    Quick Action
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Direct 1-Tap Android Installation
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Your browser has detected the PWA manifest and is ready to install the icon to your home screen and app launcher.
                  </p>
                </div>
                <button
                  onClick={handleInstallClick}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Install App Now</span>
                </button>
              </div>
            ) : null}

            {/* Step-by-Step Instructions */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col gap-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                How to Install on Any Android Device (Chrome, Samsung Internet, Edge):
              </h4>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold shrink-0">
                    1
                  </span>
                  <div>
                    <span className="font-semibold text-white">Open the App in Google Chrome on your Android phone</span>
                    <p className="text-slate-400 mt-0.5">
                      Navigate to your hosted application URL.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold shrink-0">
                    2
                  </span>
                  <div>
                    <span className="font-semibold text-white">Tap the Chrome Menu (⋮) or the Install Banner</span>
                    <p className="text-slate-400 mt-0.5">
                      In the top-right corner of Chrome, tap the three vertical dots <strong className="text-cyan-300">(⋮)</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold shrink-0">
                    3
                  </span>
                  <div>
                    <span className="font-semibold text-white">Select &quot;Install app&quot; or &quot;Add to Home screen&quot;</span>
                    <p className="text-slate-400 mt-0.5">
                      Android will register <strong className="text-cyan-300">Sumedha IT</strong> as a standalone application with its custom high-res icon and launch screen.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold shrink-0">
                    4
                  </span>
                  <div>
                    <span className="font-semibold text-white">Launch from your App Drawer</span>
                    <p className="text-slate-400 mt-0.5">
                      The app launches fullscreen without browser chrome, supports full offline caching via Service Worker, and operates like a native app.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PWA Features Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-cyan-400">Zero App Store Wait</span>
                <p className="text-xs font-semibold text-white mt-1">Instant Direct Install</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-emerald-400">Offline Fallback</span>
                <p className="text-xs font-semibold text-white mt-1">Cached Service Records</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-purple-400">Automatic Updates</span>
                <p className="text-xs font-semibold text-white mt-1">Background Sync</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Native Android Project & APK Build */}
        {activeTab === 'native' && (
          <div className="flex flex-col gap-4 mt-5">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  Native Android Project Structure
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Directory: /android
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                A complete native Android Gradle project has been generated in the <code className="text-cyan-300 font-mono bg-slate-900 px-1 py-0.5 rounded">/android</code> directory. It contains both a native Jetpack Compose UI suite and a hardware-accelerated Trusted Web Activity / WebView container.
              </p>
            </div>

            {/* Build Steps */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#040812] border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Step 1: Open in Android Studio</span>
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-2">
                  Launch <strong>Android Studio (Ladybug / Jellyfish / Hedgehog)</strong>, choose <strong>Open Existing Project</strong>, and select the <code className="text-cyan-300 font-mono">/android</code> folder. Android Studio will automatically sync Gradle and download dependencies.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#040812] border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Step 2: Build Debug APK via Command Line</span>
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        'cd android && ./gradlew assembleDebug',
                        'assembleDebug'
                      )
                    }
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono cursor-pointer"
                  >
                    {copiedCode === 'assembleDebug' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedCode === 'assembleDebug' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300 border border-slate-800/80">
                  cd android &amp;&amp; ./gradlew assembleDebug
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Generates: <code className="text-slate-300 font-mono">android/app/build/outputs/apk/debug/app-debug.apk</code>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#040812] border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Step 3: Build Release APK or AAB for Google Play</span>
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        'cd android && ./gradlew assembleRelease',
                        'assembleRelease'
                      )
                    }
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono cursor-pointer"
                  >
                    {copiedCode === 'assembleRelease' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedCode === 'assembleRelease' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300 border border-slate-800/80">
                  cd android &amp;&amp; ./gradlew assembleRelease
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Generates: <code className="text-slate-300 font-mono">android/app/build/outputs/apk/release/app-release-unsigned.apk</code>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#040812] border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">
                    Step 4: Sideload onto Android Phone / Tablet via ADB
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        'adb install -r android/app/build/outputs/apk/debug/app-debug.apk',
                        'adbInstall'
                      )
                    }
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono cursor-pointer"
                  >
                    {copiedCode === 'adbInstall' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedCode === 'adbInstall' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300 border border-slate-800/80">
                  adb install -r android/app/build/outputs/apk/debug/app-debug.apk
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 text-[11px] text-amber-300/90 flex items-start gap-2.5">
              <span className="font-bold text-amber-400 shrink-0">Note:</span>
              <span>
                An APK is a compiled binary that requires the Android SDK / Gradle daemon to assemble. The complete project code is located in <code className="text-white font-mono">/android</code>, ready to compile in Android Studio or standard CI/CD.
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-5 mt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
