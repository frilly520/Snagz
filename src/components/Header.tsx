import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Bell, 
  PiggyBank, 
  SlidersHorizontal,
  X,
  Store as StoreIcon,
  Gift,
  Bookmark,
  Sparkles,
  Flame,
  MoreVertical,
  Calculator,
  Camera,
  ScanBarcode,
  Puzzle,
  Settings,
  ShieldAlert,
  Globe
} from 'lucide-react';
import { NaturalSearchIntent, SupportedCurrency } from '../types';
import { SnagzLogo } from './SnagzLogo';
import { ZigAvatar } from './ZigMascot';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (q: string) => void;
  naturalIntent: NaturalSearchIntent | null;
  onClearNaturalIntent: () => void;
  currentLocation: { zip: string; city: string; state: string };
  onOpenLocationPicker: () => void;
  onOpenCalculator: () => void;
  onOpenReceiptScanner: () => void;
  onOpenBarcodeScanner: () => void;
  onOpenExtensionModal: () => void;
  onOpenAiAssistant: () => void;
  onOpenAdmin: () => void;
  isAdminActive: boolean;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  categories: { name: string; count: number }[];
  sortOption: string;
  onSortChange: (sort: string) => void;
  freeOnly: boolean;
  onToggleFreeOnly: () => void;
  expiringOnly: boolean;
  onToggleExpiringOnly: () => void;
  onOpenAlertsDrawer: () => void;
  alertsCount?: number;
  onOpenSavingsTracker: () => void;
  onOpenPrivacySettings: () => void;
  channelFilter: string;
  onChannelFilterChange: (channel: string) => void;
  currency: SupportedCurrency;
  activeNavTab?: string;
  onNavigateTab?: (tab: 'home' | 'savings' | 'stores' | 'free' | 'saved' | 'penny') => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  naturalIntent,
  onClearNaturalIntent,
  currentLocation,
  onOpenLocationPicker,
  onOpenCalculator,
  onOpenReceiptScanner,
  onOpenBarcodeScanner,
  onOpenExtensionModal,
  onOpenAiAssistant,
  onOpenAdmin,
  isAdminActive,
  selectedCategory,
  onSelectCategory,
  categories,
  sortOption,
  onSortChange,
  freeOnly,
  onToggleFreeOnly,
  expiringOnly,
  onToggleExpiringOnly,
  onOpenAlertsDrawer,
  alertsCount = 3,
  onOpenSavingsTracker,
  onOpenPrivacySettings,
  channelFilter,
  onChannelFilterChange,
  activeNavTab = 'home',
  onNavigateTab
}) => {
  const [showToolsMenu, setShowToolsMenu] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit(searchQuery);
    }
  };

  const navItems: { id: 'home' | 'stores' | 'free' | 'penny' | 'saved'; label: string; icon: React.ReactNode; isPenny?: boolean }[] = [
    { id: 'home', label: 'Deals', icon: <Flame className="w-4 h-4" /> },
    { id: 'stores', label: 'Stores', icon: <StoreIcon className="w-4 h-4" /> },
    { id: 'free', label: 'Free', icon: <Gift className="w-4 h-4" /> },
    { id: 'penny', label: 'Penny Finds', icon: <span className="w-3.5 h-3.5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-[9px] flex items-center justify-center font-mono border border-amber-400/50">1¢</span>, isPenny: true },
    { id: 'saved', label: 'Saved', icon: <Bookmark className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0e121c]/95 backdrop-blur-md border-b border-[#1f2638] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Header Row: Logo, Primary Search, Actions */}
        <div className="flex items-center justify-between gap-3 sm:gap-6 py-3">
          {/* Brand Logo */}
          <div className="shrink-0">
            <SnagzLogo 
              onClick={() => {
                onNavigateTab?.('home');
                onSelectCategory('All');
              }} 
              showTagline={false} 
              size="md" 
            />
          </div>

          {/* Prominent Search Bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                id="main-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search deals, stores, or products..."
                className="w-full pl-10 pr-20 py-2 sm:py-2.5 rounded-xl bg-[#141926] border border-[#222b3e] hover:border-[#2f3b54] focus:border-blue-500 text-sm text-slate-100 placeholder-slate-400 focus:outline-none transition-colors"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('');
                    onClearNaturalIntent();
                  }}
                  className="absolute right-10 text-slate-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : null}
              <button
                id="btn-search-ai"
                type="button"
                onClick={() => onSearchSubmit(searchQuery)}
                className="absolute right-1.5 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          {/* Quick Right Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Location Chip */}
            <button
              id="btn-open-location"
              type="button"
              onClick={onOpenLocationPicker}
              title={`Location: ${currentLocation.city}, ${currentLocation.state} (${currentLocation.zip})`}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141926] hover:bg-[#1a2133] border border-[#222b3e] text-xs text-slate-300 hover:text-white transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>{currentLocation.city}, {currentLocation.state}</span>
            </button>

            {/* Price Drop Alerts */}
            <button
              id="btn-open-price-alerts-header"
              type="button"
              onClick={onOpenAlertsDrawer}
              title="Price Drop Alerts"
              className="relative p-2 rounded-lg bg-[#141926] hover:bg-[#1a2133] border border-[#222b3e] text-slate-300 hover:text-white transition-colors"
            >
              <Bell className="w-4 h-4" />
              {alertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {alertsCount}
                </span>
              )}
            </button>

            {/* Savings Tracker */}
            <button
              id="btn-open-savings-tracker-header"
              type="button"
              onClick={onOpenSavingsTracker}
              title="Savings Tracker"
              className="hidden sm:flex p-2 rounded-lg bg-[#141926] hover:bg-[#1a2133] border border-[#222b3e] text-slate-300 hover:text-white transition-colors"
            >
              <PiggyBank className="w-4 h-4 text-emerald-400" />
            </button>

            {/* ZIG Deal Assistant */}
            <button
              id="btn-open-assistant"
              type="button"
              onClick={onOpenAiAssistant}
              aria-label="Ask ZIG Deal Hunter"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141926] hover:bg-[#1a2133] border border-blue-500/30 hover:border-blue-400/50 text-slate-200 text-xs font-semibold transition-colors"
            >
              <ZigAvatar size={18} expression="confident" />
              <span className="text-blue-400 font-bold">ZIG</span>
            </button>

            {/* More Tools Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowToolsMenu(!showToolsMenu)}
                title="Tools & Settings"
                className="p-2 rounded-lg bg-[#141926] hover:bg-[#1a2133] border border-[#222b3e] text-slate-300 hover:text-white transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showToolsMenu && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-[#141926] border border-[#222b3e] shadow-2xl py-1.5 z-50 text-xs text-slate-300"
                  onClick={() => setShowToolsMenu(false)}
                >
                  <button
                    type="button"
                    onClick={onOpenCalculator}
                    className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-[#1f2638] text-left transition-colors"
                  >
                    <Calculator className="w-4 h-4 text-blue-400" />
                    <span>Stacking Calculator</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenReceiptScanner}
                    className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-[#1f2638] text-left transition-colors"
                  >
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>AI Receipt Scanner</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenBarcodeScanner}
                    className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-[#1f2638] text-left transition-colors"
                  >
                    <ScanBarcode className="w-4 h-4 text-amber-400" />
                    <span>Barcode Scanner</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenExtensionModal}
                    className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-[#1f2638] text-left transition-colors"
                  >
                    <Puzzle className="w-4 h-4 text-purple-400" />
                    <span>Browser Extension</span>
                  </button>

                  <div className="my-1 border-t border-[#222b3e]" />

                  <button
                    type="button"
                    onClick={onOpenPrivacySettings}
                    className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-[#1f2638] text-left transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Settings & Currency</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-[#1f2638] text-left transition-colors"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>{isAdminActive ? 'Exit Admin Mode' : 'Admin Operations'}</span>
                  </button>
                </div>
              )}
            </div>

            <PWAInstallButton compact={true} />
          </div>
        </div>

        {/* Natural Language Intent Bar (if active) */}
        {naturalIntent && (
          <div className="mb-2 px-3 py-2 rounded-lg bg-blue-950/40 border border-blue-500/30 flex items-center justify-between text-xs text-blue-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Interpreted: <strong className="text-white">"{naturalIntent.understoodQuery}"</strong></span>
              {naturalIntent.aiExplanation && (
                <span className="text-slate-400 hidden sm:inline">({naturalIntent.aiExplanation})</span>
              )}
            </div>
            <button
              type="button"
              onClick={onClearNaturalIntent}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Desktop Navigation: Deals, Stores, Free, Penny Finds, Saved */}
        <div className="hidden md:flex items-center justify-between py-2 border-t border-[#1a2133]">
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeNavTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  type="button"
                  onClick={() => {
                    onNavigateTab?.(item.id);
                    if (item.id === 'home') {
                      onSelectCategory('All');
                    }
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? item.isPenny
                        ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                        : 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-[#141926]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Filters / Controls */}
          <div className="flex items-center gap-2">
            {/* In-Store vs Online Channel */}
            <div className="flex items-center gap-1 bg-[#141926] border border-[#222b3e] rounded-lg px-2 py-1 text-xs">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="select-channel-filter"
                value={channelFilter}
                onChange={(e) => onChannelFilterChange(e.target.value)}
                className="bg-transparent text-slate-300 focus:outline-none text-xs cursor-pointer"
              >
                <option value="ALL" className="bg-[#141926]">All Channels</option>
                <option value="ONLINE" className="bg-[#141926]">Online Only</option>
                <option value="IN_STORE" className="bg-[#141926]">In-Store Local</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 bg-[#141926] border border-[#222b3e] rounded-lg px-2 py-1 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="select-sort-deals"
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-transparent text-slate-300 focus:outline-none text-xs cursor-pointer"
              >
                <option value="best_deal" className="bg-[#141926]">Best Deals First</option>
                <option value="money_maker" className="bg-[#141926]">Money Makers</option>
                <option value="lowest_net" className="bg-[#141926]">Lowest Price</option>
                <option value="biggest_savings" className="bg-[#141926]">Biggest Savings ($)</option>
                <option value="highest_discount" className="bg-[#141926]">Highest % Off</option>
                <option value="newest" className="bg-[#141926]">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories Bar (clean horizontal scroll) */}
        {activeNavTab === 'home' && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-2 border-t border-[#1a2133] scrollbar-none">
            <button
              type="button"
              onClick={() => onSelectCategory('All')}
              className={`px-3 py-1 rounded-md text-xs whitespace-nowrap transition-colors ${
                selectedCategory === 'All' && !freeOnly && !expiringOnly
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-[#141926] text-slate-400 hover:text-white border border-[#222b3e]'
              }`}
            >
              All Deals
            </button>
            {categories.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => onSelectCategory(c.name)}
                className={`px-3 py-1 rounded-md text-xs whitespace-nowrap transition-colors ${
                  selectedCategory === c.name
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-[#141926] text-slate-400 hover:text-white border border-[#222b3e]'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
