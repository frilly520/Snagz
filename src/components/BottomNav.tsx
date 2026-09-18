import React, { useState } from 'react';
import { 
  Flame, 
  Store, 
  Tag, 
  Bookmark, 
  MoreHorizontal, 
  Gift, 
  Settings, 
  PiggyBank, 
  X,
  ShieldCheck,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  savedCount: number;
  onOpenPrivacySettings?: () => void;
  onOpenSavingsTracker?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  savedCount,
  onOpenPrivacySettings,
  onOpenSavingsTracker
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  return (
    <>
      {/* More Options Sheet / Popover */}
      {showMoreMenu && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setShowMoreMenu(false)}
        >
          <div 
            className="absolute bottom-16 inset-x-3 bg-[#101524] border border-[#222b3e] rounded-2xl p-3 shadow-2xl animate-in slide-in-from-bottom-3 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-[#1f2638]">
              <span className="text-xs font-bold text-slate-300">More Destinations</span>
              <button 
                type="button" 
                onClick={() => setShowMoreMenu(false)} 
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Saved Deals */}
              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  onTabChange('saved');
                }}
                className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-colors relative ${
                  activeTab === 'saved'
                    ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 font-bold'
                    : 'bg-[#141926] text-slate-300 border-[#222b3e] hover:bg-[#1a2133]'
                }`}
              >
                <Bookmark className="w-4 h-4 text-blue-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span>Saved Deals</span>
                    {savedCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[9px] font-bold">
                        {savedCount}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400">Personal Watchlist</div>
                </div>
              </button>

              {/* Free Deals */}
              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  onTabChange('free');
                }}
                className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-colors ${
                  activeTab === 'free'
                    ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 font-bold'
                    : 'bg-[#141926] text-slate-300 border-[#222b3e] hover:bg-[#1a2133]'
                }`}
              >
                <Gift className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold">Free Deals</div>
                  <div className="text-[10px] text-slate-400">$0 & 100% Free</div>
                </div>
              </button>

              {/* Penny Finds */}
              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  onTabChange('penny');
                }}
                className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-colors ${
                  activeTab === 'penny'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                    : 'bg-[#141926] text-slate-300 border-[#222b3e] hover:bg-[#1a2133]'
                }`}
              >
                <span className="w-4 h-4 rounded-full border border-amber-400/60 font-black text-[9px] flex items-center justify-center font-mono text-amber-300 shrink-0">
                  1¢
                </span>
                <div>
                  <div className="text-xs font-bold">Penny Finds</div>
                  <div className="text-[10px] text-slate-400">In-Store 1¢ Glitches</div>
                </div>
              </button>

              {/* Settings & Hidden Deals */}
              {onOpenPrivacySettings && (
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    onOpenPrivacySettings();
                  }}
                  className="p-2.5 rounded-xl border bg-[#141926] text-slate-300 border-[#222b3e] hover:bg-[#1a2133] flex items-center gap-2 text-left transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Settings & Hidden</div>
                    <div className="text-[10px] text-slate-400">Preferences</div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5-Item Mobile Bottom Navigation */}
      <nav 
        id="mobile-bottom-navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[#0c101c]/95 backdrop-blur-lg border-t border-[#1f2638] px-2 py-1.5 flex items-center justify-around safe-area-bottom shadow-lg"
      >
        {/* 1. Deals */}
        <button
          id="nav-tab-deals"
          type="button"
          onClick={() => onTabChange('deals')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'deals' || activeTab === 'home' 
              ? 'text-blue-400 font-bold' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-5 h-5" />
          <span className="text-[10px]">Deals</span>
        </button>

        {/* 2. Promo Codes */}
        <button
          id="nav-tab-promocodes"
          type="button"
          onClick={() => onTabChange('promocodes')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'promocodes' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Tag className="w-5 h-5" />
          <span className="text-[10px]">Promo Codes</span>
        </button>

        {/* 3. Price Finder */}
        <button
          id="nav-tab-pricefinder"
          type="button"
          onClick={() => onTabChange('pricefinder')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'pricefinder' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ArrowUpDown className="w-5 h-5" />
          <span className="text-[10px]">Price Finder</span>
        </button>

        {/* 4. Stores */}
        <button
          id="nav-tab-stores"
          type="button"
          onClick={() => onTabChange('stores')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'stores' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Store className="w-5 h-5" />
          <span className="text-[10px]">Stores</span>
        </button>

        {/* 5. More */}
        <button
          id="nav-tab-more"
          type="button"
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
            activeTab === 'free' || activeTab === 'penny' || activeTab === 'saved' || showMoreMenu 
              ? 'text-blue-400 font-bold' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px]">More</span>
        </button>
      </nav>
    </>
  );
};
