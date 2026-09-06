import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  MapPin, 
  Calculator, 
  Camera, 
  ScanBarcode, 
  Puzzle, 
  ShieldAlert, 
  Gift, 
  SlidersHorizontal,
  X,
  Bot,
  Bell,
  PiggyBank,
  Settings,
  Store as StoreIcon,
  Globe
} from 'lucide-react';
import { NaturalSearchIntent, SupportedCurrency } from '../types';
import { SnagzLogo } from './SnagzLogo';
import { PWAInstallButton } from './PWAInstallButton';
import { ZigAvatar } from './ZigMascot';

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
  // Advanced Deal Intelligence props
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
  currency,
  activeNavTab = 'home',
  onNavigateTab
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Main Row: Logo, Search Bar, Tool CTAs */}
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <SnagzLogo 
            onClick={() => onSelectCategory('All')} 
            showTagline={true} 
            size="md" 
          />

          {/* Center Search Input */}
          <div className="flex-1 max-w-2xl relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5" />
              <input
                id="main-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Search products, stores, or ask: "AirPods Pro under $160", "Target diapers coupon"...'
                className="w-full pl-9 pr-24 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 focus:border-emerald-500 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none transition-all shadow-inner"
              />
              <button
                id="btn-search-ai"
                type="button"
                onClick={() => onSearchSubmit(searchQuery)}
                className="absolute right-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-neutral-950 text-xs font-bold transition-all flex items-center gap-1 border border-emerald-500/30"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Best Deal</span>
              </button>
            </div>
          </div>

          {/* Right Action Tools Bar */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* PWA In-App Install Prompt */}
            <PWAInstallButton compact={true} />

            {/* Price Drop Alerts Bell */}
            <button
              id="btn-open-price-alerts-header"
              type="button"
              onClick={onOpenAlertsDrawer}
              title="Price Drop + Coupon Combination Alerts"
              className="relative p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              {alertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-neutral-950 text-[9px] font-black flex items-center justify-center animate-pulse">
                  {alertsCount}
                </span>
              )}
            </button>

            {/* Savings Tracker */}
            <button
              id="btn-open-savings-tracker-header"
              type="button"
              onClick={onOpenSavingsTracker}
              title="Personal Savings Tracker & Milestones"
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
            >
              <PiggyBank className="w-4 h-4 text-emerald-400" />
            </button>

            {/* ZIG — Your Deal Hunter */}
            <button
              id="btn-open-assistant"
              type="button"
              onClick={onOpenAiAssistant}
              aria-label="ZIG — Your Deal Hunter"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-emerald-500/40 hover:border-emerald-400 text-white font-bold text-xs shadow-md transition-all group"
            >
              <div className="relative flex items-center justify-center">
                <ZigAvatar size={22} expression="confident" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-emerald-400 font-black tracking-wide">ZIG</span>
              <span className="hidden lg:inline text-[10px] text-neutral-400 font-normal">Deal Hunter</span>
            </button>

            {/* Stack Calculator */}
            <button
              id="btn-open-calculator-header"
              type="button"
              onClick={onOpenCalculator}
              title="Stacking Calculator"
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
            >
              <Calculator className="w-4 h-4 text-sky-400" />
            </button>

            {/* Receipt Scanner */}
            <button
              id="btn-open-receipt-scanner-header"
              type="button"
              onClick={onOpenReceiptScanner}
              title="AI Receipt Scanner"
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
            </button>

            {/* In-store Barcode */}
            <button
              id="btn-open-barcode-scanner-header"
              type="button"
              onClick={onOpenBarcodeScanner}
              title="In-Store Barcode Lookup"
              className="hidden lg:flex p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
            >
              <ScanBarcode className="w-4 h-4 text-amber-400" />
            </button>

            {/* Extension preview */}
            <button
              id="btn-open-extension-header"
              type="button"
              onClick={onOpenExtensionModal}
              title="Browser Extension Preview"
              className="hidden xl:flex p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
            >
              <Puzzle className="w-4 h-4 text-purple-400" />
            </button>

            {/* Location Pill */}
            <button
              id="btn-open-location"
              type="button"
              onClick={onOpenLocationPicker}
              title={`Shopping location: ${currentLocation.city}, ${currentLocation.state} (${currentLocation.zip})`}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-300 hover:text-white transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentLocation.city}</span>
            </button>

            {/* Privacy & Settings */}
            <button
              id="btn-open-privacy-settings-header"
              type="button"
              onClick={onOpenPrivacySettings}
              title="Privacy, Currency & Settings"
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Admin Toggle */}
            <button
              id="btn-toggle-admin-header"
              type="button"
              onClick={onOpenAdmin}
              title="Admin & Pipeline Telemetry"
              className={`p-2 rounded-xl border transition-colors ${
                isAdminActive 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                  : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </button>
          </div>
        </div>

        {/* Natural Language Intent Banner */}
        {naturalIntent && (
          <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold flex items-center gap-1 text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interpreted:</span>
              </span>
              <span>"{naturalIntent.understoodQuery}"</span>
              {naturalIntent.aiExplanation && (
                <span className="text-[11px] text-neutral-400">({naturalIntent.aiExplanation})</span>
              )}
            </div>
            <button
              type="button"
              onClick={onClearNaturalIntent}
              className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Primary Section Navigation Tabs */}
        <div className="mt-2.5 pt-2 border-t border-neutral-900 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              id="header-nav-all-deals"
              type="button"
              onClick={() => {
                onNavigateTab?.('home');
                onSelectCategory('All');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeNavTab === 'home' && selectedCategory === 'All' && !freeOnly
                  ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800'
              }`}
            >
              <span>🔥 All Deals</span>
            </button>

            {/* First-class Penny List Section */}
            <button
              id="header-nav-penny-list"
              type="button"
              onClick={() => onNavigateTab?.('penny')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeNavTab === 'penny'
                  ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-950/40'
                  : 'bg-amber-950/40 text-amber-300 hover:text-amber-200 border border-amber-500/40 hover:bg-amber-900/50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>1¢ PENNY LIST</span>
            </button>

            <button
              id="header-nav-free"
              type="button"
              onClick={() => onNavigateTab?.('free')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeNavTab === 'free' || freeOnly
                  ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>$0 FREE Offers</span>
            </button>

            <button
              id="header-nav-stores"
              type="button"
              onClick={() => onNavigateTab?.('stores')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeNavTab === 'stores'
                  ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800'
              }`}
            >
              <StoreIcon className="w-3.5 h-3.5" />
              <span>Popular Stores</span>
            </button>

            <button
              id="header-nav-saved"
              type="button"
              onClick={() => onNavigateTab?.('saved')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeNavTab === 'saved'
                  ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Saved & Lists</span>
            </button>
          </div>

          {/* Location indicator button */}
          <button
            type="button"
            onClick={onOpenLocationPicker}
            className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white transition-colors bg-neutral-900/60 px-2 py-1 rounded-lg border border-neutral-800/80 shrink-0"
          >
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>{currentLocation.city}, {currentLocation.state} ({currentLocation.zip})</span>
          </button>
        </div>

        {/* Sub-bar: Category Pills & Sort Select */}
        <div className="mt-3 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none pb-1">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onSelectCategory('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'All'
                  ? 'bg-emerald-500 text-neutral-950 font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              All Deals
            </button>

            {categories.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => onSelectCategory(c.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === c.name
                    ? 'bg-emerald-500 text-neutral-950 font-bold'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Channel Filter (Online vs In Store) */}
            <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-xl px-2 py-1 text-xs">
              <Globe className="w-3.5 h-3.5 text-neutral-500" />
              <select
                id="select-channel-filter"
                value={channelFilter}
                onChange={(e) => onChannelFilterChange(e.target.value)}
                className="bg-transparent text-neutral-300 focus:outline-none text-xs font-medium cursor-pointer"
              >
                <option value="ALL" className="bg-neutral-900">All Channels</option>
                <option value="ONLINE" className="bg-neutral-900">Online Only</option>
                <option value="IN_STORE" className="bg-neutral-900">In-Store Local</option>
              </select>
            </div>

            {/* 100% Free Toggle */}
            <button
              type="button"
              onClick={onToggleFreeOnly}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                freeOnly
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>$0 Free Offers</span>
            </button>

            {/* Expiring Soon Toggle */}
            <button
              type="button"
              onClick={onToggleExpiringOnly}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                expiringOnly
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
              }`}
            >
              <span>Ending Soon</span>
            </button>

            {/* Sort selector */}
            <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-xl px-2 py-1 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
              <select
                id="select-sort-deals"
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-transparent text-neutral-300 focus:outline-none text-xs font-medium cursor-pointer"
              >
                <option value="best_deal" className="bg-neutral-900">Best Deal Engine (Math Rank #1)</option>
                <option value="money_maker" className="bg-neutral-900">💰 Money Makers (Rewards &gt; Register Cost)</option>
                <option value="lowest_net" className="bg-neutral-900">🎯 Lowest Effective Net Cost ($)</option>
                <option value="biggest_savings" className="bg-neutral-900">Biggest Savings ($)</option>
                <option value="highest_discount" className="bg-neutral-900">Highest % Off</option>
                <option value="newest" className="bg-neutral-900">Newest Discovered</option>
                <option value="expiring_soon" className="bg-neutral-900">Expiring Soon</option>
                <option value="most_popular" className="bg-neutral-900">Most Popular</option>
                <option value="recently_verified" className="bg-neutral-900">Recently Verified</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
