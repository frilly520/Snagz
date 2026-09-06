import React from 'react';
import { Home, Store, Gift, Bookmark, PiggyBank } from 'lucide-react';
import { ZigAvatar } from './ZigMascot';

interface BottomNavProps {
  activeTab: 'home' | 'savings' | 'stores' | 'free' | 'saved' | 'admin' | 'penny';
  onTabChange: (tab: 'home' | 'savings' | 'stores' | 'free' | 'saved' | 'admin' | 'penny') => void;
  savedCount: number;
  onOpenAiAssistant: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  savedCount,
  onOpenAiAssistant
}) => {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-800/80 px-2 py-1.5 flex items-center justify-around">
      <button
        id="nav-tab-home"
        type="button"
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-colors ${
          activeTab === 'home' ? 'text-emerald-400 font-bold' : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Deals</span>
      </button>

      {/* Dedicated 1¢ Penny List Tab */}
      <button
        id="nav-tab-penny"
        type="button"
        onClick={() => onTabChange('penny')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-colors relative ${
          activeTab === 'penny' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-amber-300'
        }`}
      >
        <div className="relative">
          <span className="w-5 h-5 rounded-full border border-current font-black text-[10px] flex items-center justify-center font-mono">
            1¢
          </span>
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        </div>
        <span className="text-[10px]">Penny List</span>
      </button>

      {/* Center Highlighted ZIG Mascot Button */}
      <button
        id="nav-tab-zig"
        type="button"
        onClick={onOpenAiAssistant}
        aria-label="ZIG — Your Deal Hunter"
        className="flex flex-col items-center -mt-4 group"
      >
        <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-[2px] shadow-lg shadow-emerald-950/80 border-2 border-neutral-950 group-hover:scale-105 transition-transform">
          <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center overflow-hidden">
            <ZigAvatar size={36} expression="confident" />
          </div>
          {/* Active Radar Ping */}
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-neutral-950" />
          </span>
        </div>
        <span className="text-[11px] font-black text-emerald-400 mt-0.5 tracking-wider group-hover:text-emerald-300 transition-colors">
          ZIG
        </span>
      </button>

      <button
        id="nav-tab-free"
        type="button"
        onClick={() => onTabChange('free')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-colors ${
          activeTab === 'free' ? 'text-emerald-400 font-bold' : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Gift className="w-5 h-5" />
        <span className="text-[10px]">$0 Free</span>
      </button>

      <button
        id="nav-tab-saved"
        type="button"
        onClick={() => onTabChange('saved')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-colors relative ${
          activeTab === 'saved' ? 'text-emerald-400 font-bold' : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Bookmark className="w-5 h-5" />
        <span className="text-[10px]">Saved</span>
        {savedCount > 0 && (
          <span className="absolute top-0.5 right-1 w-4 h-4 rounded-full bg-emerald-500 text-neutral-950 text-[9px] font-bold flex items-center justify-center">
            {savedCount}
          </span>
        )}
      </button>
    </div>
  );
};
