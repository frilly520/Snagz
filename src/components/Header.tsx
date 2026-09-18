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
  Globe,
  Tag,
  EyeOff,
  ArrowUpDown
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
  onNavigateTab?: (tab: any) => void;
  hiddenDealsCount?: number;
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
  onNavigateTab,
  hiddenDealsCount = 0
}) => {
  const [showToolsMenu, setShowToolsMenu] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit(searchQuery);
    }
  };

  // Core Destinations
  const primaryNavDestinations: { 
    id: 'deals' | 'promocodes' | 'pricefinder' | 'stores' | 'free' | 'penny' | 'saved'; 
    label: string; 
    icon: React.ReactNode; 
    isPenny?: boolean; 
  }[] = [
    { id: 'deals', label: 'DEALS', icon: <Flame className="w-4 h-4" /> },
    { id: 'promocodes', label: 'PROMO CODES', icon: <Tag className="w-4 h-4" /> },
    { id: 'pricefinder', label: 'PRICE FINDER', icon: <ArrowUpDown className="w-4 h-4" /> },
    { id: 'stores', label: 'STORES', icon: <StoreIcon className="w-4 h-4" /> },
    { id: 'free', label: 'FREE', icon: <Gift className="w-4 h-4" /> },
    { id: 'penny', label: 'PENNY', icon: <span className="w-3.5 h-3.5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-[9px] flex items-center justify-center font-mono border border-amber-400/50">1¢</span>, isPenny: true },
    { id: 'saved', label: 'SAVED', icon: <Bookmark className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0c101c]/95 backdrop-blur-md border-b border-[#1f2638] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Header Row: Logo, Primary Search, Minimal Right Actions */}
        <div className="flex items-center justify-between gap-3 sm:gap-6 py-3">
          {/* Brand Logo -> Navigates to Home */}
          <div className="shrink-0 cursor-pointer" onClick={() => onNavigateTab?.('home')}>
            <SnagzLogo 
              onClick={() => onNavigateTab?.('home')} 
              showTagline={false} 
              size="md" 
            />
          </div>

          {/* Search Bar: Clean and wide */}
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
                className="w-full pl-10 pr-20 py-2 sm:py-2.5 rounded-xl bg-[#121624] border border-[#222b3e] hover:border-[#2f3b54] focus:border-blue-500 text-sm text-slate-100 placeholder-slate-400 focus:outline-none transition-colors"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('');
                    onClearNaturalIntent();
                  }}
                  className="absolute right-12 text-slate-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : null}
              <button
                id="btn-search-ai"
                type="button"
                onClick={() => onSearchSubmit(searchQuery)}
                className="absolute right-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          {/* Right Action Icons: Secondary ZIG launcher, Location, Alerts, Settings */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Secondary ZIG AI Assistant Pill (does not compete with primary nav) */}
            <button
              id="btn-open-assistant-secondary"
              type="button"
              onClick={onOpenAiAssistant}
              title="Ask ZIG AI Deal Assistant"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#121624] hover:bg-[#192134] border border-blue-500/30 text-xs font-bold text-slate-300 hover:text-white transition-colors"
            >
              <ZigAvatar size={18} expression="confident" />
              <span className="text-blue-400">Ask ZIG</span>
            </button>

            {/* Location Chip */}
            <button
              id="btn-open-location"
              type="button"
              onClick={onOpenLocationPicker}
              title={`Location: ${currentLocation.city}, ${currentLocation.state} (${currentLocation.zip})`}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121624] hover:bg-[#192134] border border-[#222b3e] text-xs text-slate-300 hover:text-white transition-colors"
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
              className="relative p-2 rounded-xl bg-[#121624] hover:bg-[#192134] border border-[#222b3e] text-slate-300 hover:text-white transition-colors"
            >
              <Bell className="w-4 h-4" />
              {alertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {alertsCount}
                </span>
              )}
            </button>

            {/* Settings & Preferences (including Hidden Deals) */}
            <button
              id="btn-open-settings-header"
              type="button"
              onClick={onOpenPrivacySettings}
              title="Settings & Hidden Deals"
              className="relative p-2 rounded-xl bg-[#121624] hover:bg-[#192134] border border-[#222b3e] text-slate-300 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
              {hiddenDealsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {hiddenDealsCount}
                </span>
              )}
            </button>

            {/* Tools Menu (Calculator, Scanner, Admin) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowToolsMenu(!showToolsMenu)}
                title="More Tools"
                className="p-2 rounded-xl bg-[#121624] hover:bg-[#192134] border border-[#222b3e] text-slate-300 hover:text-white transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showToolsMenu && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0f1422] border border-[#222b3e] shadow-2xl py-1.5 z-50 text-xs text-slate-300 animate-in fade-in"
                  onClick={() => setShowToolsMenu(false)}
                >
                  <button
                    type="button"
                    onClick={onOpenSavingsTracker}
                    className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-[#182138] text-left transition-colors"
                  >
                    <PiggyBank className="w-4 h-4 text-emerald-400" />
                    <span>Savings Tracker</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenCalculator}
                    className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-[#182138] text-left transition-colors"
                  >
                    <Calculator className="w-4 h-4 text-blue-400" />
                    <span>Stacking Calculator</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenReceiptScanner}
                    className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-[#182138] text-left transition-colors"
                  >
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>AI Receipt Scanner</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenBarcodeScanner}
                    className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-[#182138] text-left transition-colors"
                  >
                    <ScanBarcode className="w-4 h-4 text-amber-400" />
                    <span>Barcode Scanner</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenExtensionModal}
                    className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-[#182138] text-left transition-colors"
                  >
                    <Puzzle className="w-4 h-4 text-purple-400" />
                    <span>Browser Extension</span>
                  </button>

                  <div className="my-1 border-t border-[#1f2638]" />

                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-[#182138] text-left transition-colors"
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

        {/* Natural Search Intent Feedback (if active) */}
        {naturalIntent && (
          <div className="mb-2 px-3 py-2 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between text-xs text-blue-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Interpreted: <strong className="text-white">"{naturalIntent.understoodQuery}"</strong></span>
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

        {/* Primary Desktop Navigation Bar: DEALS, STORES, PROMO CODES, FREE, PENNY, SAVED */}
        <div className="hidden md:flex items-center justify-between py-2 border-t border-[#1a2133]">
          <nav className="flex items-center gap-1.5">
            {primaryNavDestinations.map((item) => {
              const isActive = activeNavTab === item.id || (item.id === 'deals' && activeNavTab === 'home');
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  type="button"
                  onClick={() => {
                    onNavigateTab?.(item.id);
                  }}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-colors ${
                    isActive
                      ? item.isPenny
                        ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                        : 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#121624]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Filters (shown on deals tab) */}
          {(activeNavTab === 'deals' || activeNavTab === 'home') && (
            <div className="flex items-center gap-2">
              {/* In-Store vs Online Channel */}
              <div className="flex items-center gap-1 bg-[#121624] border border-[#222b3e] rounded-lg px-2.5 py-1 text-xs">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <select
                  id="select-channel-filter"
                  value={channelFilter}
                  onChange={(e) => onChannelFilterChange(e.target.value)}
                  className="bg-transparent text-slate-300 focus:outline-none text-xs cursor-pointer font-medium"
                >
                  <option value="ALL" className="bg-[#121624]">All Channels</option>
                  <option value="ONLINE" className="bg-[#121624]">Online</option>
                  <option value="IN_STORE" className="bg-[#121624]">In-Store</option>
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1 bg-[#121624] border border-[#222b3e] rounded-lg px-2.5 py-1 text-xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <select
                  id="select-sort-deals"
                  value={sortOption}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="bg-transparent text-slate-300 focus:outline-none text-xs cursor-pointer font-medium"
                >
                  <option value="best_deal" className="bg-[#121624]">Best Deals</option>
                  <option value="lowest_net" className="bg-[#121624]">Lowest Price</option>
                  <option value="biggest_savings" className="bg-[#121624]">Biggest Savings ($)</option>
                  <option value="highest_discount" className="bg-[#121624]">Highest % Off</option>
                  <option value="newest" className="bg-[#121624]">Newest</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
