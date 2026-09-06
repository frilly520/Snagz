import React from 'react';
import { SnagzSymbol } from './SnagzLogo';

export const SnagzSplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070a08] select-none transition-opacity duration-300">
      <div className="flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <SnagzSymbol size={72} className="shadow-2xl shadow-emerald-500/20" />
        <div className="space-y-1.5">
          <h1 className="text-3xl font-black tracking-tight text-white font-sans">
            SNAG<span className="text-emerald-400">Z</span>
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400/90" style={{ letterSpacing: '0.2em' }}>
            Find it. Save it. Snag it.
          </p>
        </div>
      </div>
    </div>
  );
};

export const SnagzLoadingState: React.FC<{ message?: string; subMessage?: string }> = ({
  message = 'Scanning current offers…',
  subMessage
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center select-none">
      <div className="relative mb-4">
        <SnagzSymbol size={48} className="animate-pulse shadow-lg shadow-emerald-500/10" />
        <span className="absolute -inset-1 rounded-2xl bg-emerald-500/20 animate-ping -z-10 opacity-40 pointer-events-none" />
      </div>
      <div className="space-y-1">
        <div className="text-sm font-black tracking-wide text-white flex items-center justify-center gap-1">
          <span>SNAG</span><span className="text-emerald-400">Z</span>
        </div>
        <p className="text-xs font-medium text-neutral-300">{message}</p>
        {subMessage && (
          <p className="text-[11px] text-neutral-500">{subMessage}</p>
        )}
      </div>
    </div>
  );
};
