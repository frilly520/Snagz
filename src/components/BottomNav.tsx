import React from 'react';
import { Flame, Store, Gift, Bookmark } from 'lucide-react';
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
    <nav 
      id="mobile-bottom-navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0e121c]/95 backdrop-blur-lg border-t border-[#1f2638] px-3 py-2 flex items-center justify-around safe-area-bottom"
    >
      {/* Deals */}
      <button
        id="nav-tab-home"
        type="button"
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors ${
          activeTab === 'home' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Flame className="w-5 h-5" />
        <span className="text-[10px] font-medium">Deals</span>
      </button>

      {/* Stores */}
      <button
        id="nav-tab-stores"
        type="button"
        onClick={() => onTabChange('stores')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors ${
          activeTab === 'stores' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Store className="w-5 h-5" />
        <span className="text-[10px] font-medium">Stores</span>
      </button>

      {/* Center ZIG Assistant */}
      <button
        id="nav-tab-zig"
        type="button"
        onClick={onOpenAiAssistant}
        aria-label="Ask ZIG Deal Hunter"
        className="flex flex-col items-center -mt-3"
      >
        <div className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-500 p-0.5 shadow-lg shadow-blue-600/30 border-2 border-[#0e121c] flex items-center justify-center transition-transform active:scale-95">
          <div className="w-full h-full rounded-full bg-[#121624] flex items-center justify-center overflow-hidden">
            <ZigAvatar size={26} expression="confident" />
          </div>
        </div>
        <span className="text-[9px] font-bold text-blue-400 mt-0.5">ZIG</span>
      </button>

      {/* Free */}
      <button
        id="nav-tab-free"
        type="button"
        onClick={() => onTabChange('free')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors ${
          activeTab === 'free' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Gift className="w-5 h-5" />
        <span className="text-[10px] font-medium">Free</span>
      </button>

      {/* Penny Finds */}
      <button
        id="nav-tab-penny"
        type="button"
        onClick={() => onTabChange('penny')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors ${
          activeTab === 'penny' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-amber-300'
        }`}
      >
        <span className="w-5 h-5 rounded-full border border-current font-black text-[10px] flex items-center justify-center font-mono">
          1¢
        </span>
        <span className="text-[10px] font-medium">Penny</span>
      </button>

      {/* Saved */}
      <button
        id="nav-tab-saved"
        type="button"
        onClick={() => onTabChange('saved')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors relative ${
          activeTab === 'saved' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Bookmark className="w-5 h-5" />
        <span className="text-[10px] font-medium">Saved</span>
        {savedCount > 0 && (
          <span className="absolute top-0 right-1.5 w-3.5 h-3.5 rounded-full bg-blue-600 text-white text-[8px] font-bold flex items-center justify-center">
            {savedCount}
          </span>
        )}
      </button>
    </nav>
  );
};
