import React, { useState } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { SnagzSymbol } from './SnagzLogo';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        id="snagz-install-app-btn"
        className={`flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-sm ${
          compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs'
        }`}
        title="Install SNAGZ App to your device"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install SNAGZ</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          id="snagz-install-ios-btn"
          className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/50 px-2.5 py-1 text-xs font-bold text-emerald-300 transition"
          title="Install SNAGZ on iPhone/iPad"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Get App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <SnagzSymbol size={40} />
                  <div>
                    <h3 className="text-base font-bold text-white">Install SNAGZ</h3>
                    <p className="text-xs text-neutral-400">Find it. Save it. Snag it.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-neutral-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-neutral-300 bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-neutral-800 flex items-center justify-center font-bold text-white shrink-0">1</div>
                  <div className="flex items-center gap-1.5">
                    <span>Tap the Safari </span>
                    <Share className="w-4 h-4 text-emerald-400 inline shrink-0" />
                    <span><strong>Share</strong> button below.</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-neutral-800 flex items-center justify-center font-bold text-white shrink-0">2</div>
                  <div className="flex items-center gap-1.5">
                    <span>Scroll and choose </span>
                    <PlusSquare className="w-4 h-4 text-emerald-400 inline shrink-0" />
                    <span><strong>Add to Home Screen</strong>.</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-neutral-800 flex items-center justify-center font-bold text-white shrink-0">3</div>
                  <span>Launch directly from your home screen for full instant deals!</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2 text-xs font-bold text-white transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
