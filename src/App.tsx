import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Layers, 
  TrendingDown, 
  Gift, 
  ShieldCheck, 
  ArrowRight, 
  Filter, 
  Compass, 
  ExternalLink,
  Flame,
  CheckCircle2,
  RefreshCw,
  Trophy,
  Bell,
  PiggyBank
} from 'lucide-react';
import { api } from './services/api';
import { 
  Deal, 
  Store, 
  UserList, 
  DealAlert, 
  ProductWatchlistItem, 
  NaturalSearchIntent,
  BestDealEvaluation,
  PriceDropCombinationAlert,
  SupportedCurrency
} from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CouponCard } from './components/CouponCard';
import { BestDealBanner } from './components/BestDealBanner';
import { PriceDropAlertsDrawer } from './components/PriceDropAlertsDrawer';
import { PostDealConfirmationModal } from './components/PostDealConfirmationModal';
import { WhyNotFreeModal } from './components/WhyNotFreeModal';
import { PrivacyAndSettingsModal } from './components/PrivacyAndSettingsModal';
import { SavingsTrackerView } from './components/SavingsTrackerView';
import { DealDetailsModal } from './components/DealDetailsModal';
import { DealComparisonModal } from './components/DealComparisonModal';
import { AddToListModal } from './components/AddToListModal';
import { FinalPriceCalculatorModal } from './components/FinalPriceCalculatorModal';
import { ReceiptScannerModal } from './components/ReceiptScannerModal';
import { BarcodeScannerModal } from './components/BarcodeScannerModal';
import { ExtensionSimulator } from './components/ExtensionSimulator';
import { AiShoppingAssistant } from './components/AiShoppingAssistant';
import { LocationPickerModal } from './components/LocationPickerModal';
import { ZigAvatar } from './components/ZigMascot';
import { FreeDealsHub } from './components/FreeDealsHub';
import { StoreDirectory } from './components/StoreDirectory';
import { SavedAndLists } from './components/SavedAndLists';
import { AdminDashboard } from './components/AdminDashboard';
import { SnagzSplashScreen, SnagzLoadingState } from './components/SnagzSplashScreen';
import { PennyListView } from './components/PennyListView';
import { PennyHomeModule } from './components/PennyHomeModule';

export function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'home' | 'savings' | 'stores' | 'free' | 'saved' | 'admin' | 'penny'>('home');

  // Main Data States
  const [deals, setDeals] = useState<Deal[]>([]);
  const [bestDealData, setBestDealData] = useState<{ bestDeal: Deal; evaluation: BestDealEvaluation } | null>(null);
  const [priceDropAlerts, setPriceDropAlerts] = useState<PriceDropCombinationAlert[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [userLists, setUserLists] = useState<UserList[]>([]);
  const [watchlist, setWatchlist] = useState<ProductWatchlistItem[]>([]);
  const [alerts, setAlerts] = useState<DealAlert[]>([]);
  const [savedDealIds, setSavedDealIds] = useState<Set<string>>(new Set(['deal-nike-airmax', 'deal-target-circle-stack']));

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [naturalIntent, setNaturalIntent] = useState<NaturalSearchIntent | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [sortOption, setSortOption] = useState('best_deal');
  const [freeOnly, setFreeOnly] = useState(false);
  const [moneyMakerOnly, setMoneyMakerOnly] = useState(false);
  const [recipesOnly, setRecipesOnly] = useState(false);
  const [expiringOnly, setExpiringOnly] = useState(false);
  const [currency, setCurrency] = useState<SupportedCurrency>('USD');
  const [isLoadingDeals, setIsLoadingDeals] = useState(false);

  // User location preference
  const [currentLocation, setCurrentLocation] = useState({
    zip: '90210',
    city: 'Beverly Hills',
    state: 'CA'
  });

  // Modals state
  const [selectedDealForDetails, setSelectedDealForDetails] = useState<Deal | null>(null);
  const [selectedDealForAddToList, setSelectedDealForAddToList] = useState<Deal | null>(null);
  const [selectedDealForWhyNotFree, setSelectedDealForWhyNotFree] = useState<Deal | null>(null);
  const [dealToConfirm, setDealToConfirm] = useState<Deal | null>(null);
  const [comparisonDeals, setComparisonDeals] = useState<(Deal & { isBestChoice?: boolean })[] | null>(null);

  const [isAlertsDrawerOpen, setIsAlertsDrawerOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isReceiptScannerOpen, setIsReceiptScannerOpen] = useState(false);
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isInitialSplash, setIsInitialSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialSplash(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenBestDealComparison = () => {
    if (!bestDealData) return;
    const topChoice = { ...bestDealData.bestDeal, isBestChoice: true };
    // Find 2 other alternative deals from the current category or list to compare side-by-side
    const others = deals.filter(d => d.id !== topChoice.id).slice(0, 2);
    setComparisonDeals([topChoice, ...others]);
  };

  // Initial Data Fetch
  const loadDeals = async () => {
    setIsLoadingDeals(true);
    try {
      const res = await api.getDeals({
        q: searchQuery,
        category: selectedCategory,
        channel: channelFilter,
        sort: sortOption,
        freeOnly: freeOnly || undefined,
        moneyMakerOnly: moneyMakerOnly || undefined,
        recipesOnly: recipesOnly || undefined,
        expiringOnly: expiringOnly || undefined,
        zip: currentLocation.zip
      });
      if (res && Array.isArray(res.deals)) {
        setDeals(res.deals);
      }

      // Load Best Deal Evaluation
      try {
        const best = await api.getBestDeal(searchQuery, selectedCategory === 'All' ? undefined : selectedCategory);
        setBestDealData(best);
      } catch (err) {
        setBestDealData(null);
      }
    } catch (err) {
      console.warn('Failed to load deals:', err);
    } finally {
      setIsLoadingDeals(false);
    }
  };

  const loadInitialData = async () => {
    try {
      const results = await Promise.allSettled([
        api.getStores(),
        api.getCategories(),
        api.getUserLists(),
        api.getWatchlist(),
        api.getAlerts(),
        api.getSavedDeals(),
        api.getPriceDropAlerts()
      ]);

      if (results[0].status === 'fulfilled') setStores(results[0].value);
      if (results[1].status === 'fulfilled') setCategories(results[1].value);
      if (results[2].status === 'fulfilled') setUserLists(results[2].value);
      if (results[3].status === 'fulfilled') setWatchlist(results[3].value);
      if (results[4].status === 'fulfilled') setAlerts(results[4].value);
      if (results[5].status === 'fulfilled') setSavedDealIds(new Set(results[5].value.savedDealIds));
      if (results[6].status === 'fulfilled') setPriceDropAlerts(results[6].value);
    } catch (err) {
      console.warn('Initial data load error:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadDeals();
  }, [searchQuery, selectedCategory, channelFilter, sortOption, freeOnly, moneyMakerOnly, recipesOnly, expiringOnly, currentLocation.zip]);

  // Natural Language Search with Gemini
  const handleSearchSubmit = async (query: string) => {
    if (!query.trim()) {
      setNaturalIntent(null);
      return;
    }

    try {
      const intent = await api.parseSearchIntent(query, `${currentLocation.city}, ${currentLocation.state}`);
      setNaturalIntent(intent);

      if (intent.matchedCategories.length > 0) {
        setSelectedCategory(intent.matchedCategories[0]);
      }
      if (intent.sortBy) {
        setSortOption(intent.sortBy);
      }
      if (intent.matchedFreeType && intent.matchedFreeType !== 'NOT_FREE') {
        setFreeOnly(true);
      }
    } catch (err) {
      console.error('Search intent parse error:', err);
    }
  };

  // Deal Save Toggle
  const handleToggleSaveDeal = async (dealId: string) => {
    try {
      const res = await api.toggleSaveDeal(dealId);
      setSavedDealIds(prev => {
        const next = new Set(prev);
        if (res.isSaved) next.add(dealId);
        else next.delete(dealId);
        return next;
      });
    } catch (err) {
      console.error('Failed to toggle save:', err);
    }
  };

  // Community Vote
  const handleVote = async (dealId: string, voteType: 'works' | 'doesnt_work') => {
    try {
      const res = await api.voteDeal(dealId, voteType);
      setDeals(prev => prev.map(d => {
        if (d.id === dealId) {
          return {
            ...d,
            verification: {
              ...d.verification,
              userConfirmations: res.userConfirmations,
              userFailureReports: res.userFailureReports,
              confidenceScore: res.confidenceScore,
              status: res.status as any
            }
          };
        }
        return d;
      }));
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  };

  // Report Issue
  const handleReport = async (dealId: string, reportType: string, comment?: string, savedAmount?: number) => {
    try {
      await api.reportDeal(dealId, reportType, comment, savedAmount);
    } catch (err) {
      console.error('Report submission failed:', err);
    }
  };

  // Post Deal Confirmation (Confirm savings & update achievements)
  const handleConfirmSuccess = async (dealId: string, amountSaved: number, code?: string) => {
    try {
      await api.confirmSavings(dealId, amountSaved, code);
      // increment confirmation on UI
      setDeals(prev => prev.map(d => {
        if (d.id === dealId) {
          return {
            ...d,
            verification: {
              ...d.verification,
              userConfirmations: d.verification.userConfirmations + 1,
              lastUserConfirmedAgo: 'Just now'
            }
          };
        }
        return d;
      }));
    } catch (err) {
      console.error('Failed to confirm savings:', err);
    }
  };

  // Toggle Store Follow
  const handleToggleFollowStore = async (storeId: string) => {
    try {
      const res = await api.toggleFollowStore(storeId);
      setStores(prev => prev.map(s => s.id === storeId ? { ...s, isFollowed: res.isFollowed } : s));
    } catch (err) {
      console.error('Failed to toggle store follow:', err);
    }
  };

  // Custom List Handlers
  const handleCreateList = async (name: string, description?: string) => {
    try {
      const newList = await api.createUserList(name, description);
      setUserLists(prev => [...prev, newList]);
    } catch (err) {
      console.error('Failed to create list:', err);
    }
  };

  const handleAddDealToList = async (listId: string, dealId: string, note?: string) => {
    try {
      const updated = await api.addDealToList(listId, dealId, note);
      setUserLists(prev => prev.map(l => l.id === listId ? updated : l));
    } catch (err) {
      console.error('Failed to add to list:', err);
    }
  };

  const handleCreateAndAdd = async (listName: string, dealId: string, note?: string) => {
    try {
      const newList = await api.createUserList(listName);
      const updated = await api.addDealToList(newList.id, dealId, note);
      setUserLists(prev => [...prev, updated]);
    } catch (err) {
      console.error('Failed to create and add to list:', err);
    }
  };

  const handleDeleteList = async (listId: string) => {
    try {
      await api.deleteUserList(listId);
      setUserLists(prev => prev.filter(l => l.id !== listId));
    } catch (err) {
      console.error('Failed to delete list:', err);
    }
  };

  const handleRemoveFromList = async (listId: string, dealId: string) => {
    try {
      const updated = await api.removeDealFromList(listId, dealId);
      setUserLists(prev => prev.map(l => l.id === listId ? updated : l));
    } catch (err) {
      console.error('Failed to remove from list:', err);
    }
  };

  // Watchlist Handlers
  const handleAddToWatchlist = async (item: {
    productName: string;
    targetPrice: number;
    currentBestPrice: number;
    bestStore: string;
  }) => {
    try {
      const newItem = await api.addToWatchlist(item);
      setWatchlist(prev => [newItem, ...prev]);
    } catch (err) {
      console.error('Failed to add to watchlist:', err);
    }
  };

  const handleRemoveFromWatchlist = async (id: string) => {
    try {
      await api.removeFromWatchlist(id);
      setWatchlist(prev => prev.filter(w => w.id !== id));
    } catch (err) {
      console.error('Failed to remove from watchlist:', err);
    }
  };

  // Alert Handlers
  const handleCreateAlert = async (params: Partial<DealAlert>) => {
    try {
      const newAlert = await api.createAlert(params);
      setAlerts(prev => [newAlert, ...prev]);
    } catch (err) {
      console.error('Failed to create alert:', err);
    }
  };

  const handleDeleteAlert = async (id: string) => {
    try {
      await api.deleteAlert(id);
      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Failed to delete alert:', err);
    }
  };

  const savedDeals = useMemo(() => {
    return deals.filter(d => savedDealIds.has(d.id));
  }, [deals, savedDealIds]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans pb-16 md:pb-8 selection:bg-emerald-500 selection:text-neutral-950">
      {/* Splash / Launch Experience */}
      {isInitialSplash && <SnagzSplashScreen />}

      {/* Header with Search, Price Alerts Bell, Savings Tracker, and Tool Launchers */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        naturalIntent={naturalIntent}
        onClearNaturalIntent={() => setNaturalIntent(null)}
        currentLocation={currentLocation}
        onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenReceiptScanner={() => setIsReceiptScannerOpen(true)}
        onOpenBarcodeScanner={() => setIsBarcodeScannerOpen(true)}
        onOpenExtensionModal={() => setIsExtensionModalOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenAdmin={() => setActiveTab(activeTab === 'admin' ? 'home' : 'admin')}
        isAdminActive={activeTab === 'admin'}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          if (activeTab !== 'home') setActiveTab('home');
        }}
        categories={categories}
        sortOption={sortOption}
        onSortChange={setSortOption}
        freeOnly={freeOnly}
        onToggleFreeOnly={() => setFreeOnly(!freeOnly)}
        expiringOnly={expiringOnly}
        onToggleExpiringOnly={() => setExpiringOnly(!expiringOnly)}
        onOpenAlertsDrawer={() => setIsAlertsDrawerOpen(true)}
        alertsCount={priceDropAlerts.length}
        onOpenSavingsTracker={() => setActiveTab('savings')}
        onOpenPrivacySettings={() => setIsPrivacyModalOpen(true)}
        channelFilter={channelFilter}
        onChannelFilterChange={setChannelFilter}
        currency={currency}
        activeNavTab={activeTab}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* VIEW 1: HOME DEALS FEED */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* SNAGZ Brand Quick Navigation Hub */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => { 
                  setFreeOnly(false); 
                  setMoneyMakerOnly(false); 
                  setRecipesOnly(false); 
                  setSelectedCategory('All'); 
                  setSortOption('best_deal'); 
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shrink-0 ${
                  !freeOnly && !moneyMakerOnly && !recipesOnly && selectedCategory === 'All'
                    ? 'bg-emerald-500 text-neutral-950 border-emerald-400 font-extrabold shadow-sm'
                    : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-200'
                }`}
              >
                <span>🔥 ALL DEALS</span>
              </button>

              {/* Quick Tab to 1¢ Penny List */}
              <button
                type="button"
                onClick={() => setActiveTab('penny')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-xs font-black text-amber-300 transition shrink-0"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>1¢ PENNY LIST</span>
              </button>

              <button
                type="button"
                onClick={() => { 
                  setRecipesOnly(!recipesOnly); 
                  setMoneyMakerOnly(false); 
                  setFreeOnly(false); 
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shrink-0 ${
                  recipesOnly 
                    ? 'bg-purple-500/30 text-purple-300 border-purple-500/70 shadow-sm' 
                    : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-200'
                }`}
              >
                <span>⚡ SAVINGS RECIPES</span>
              </button>

              <button
                type="button"
                onClick={() => { 
                  setMoneyMakerOnly(!moneyMakerOnly); 
                  setRecipesOnly(false); 
                  setFreeOnly(false); 
                  if (!moneyMakerOnly) setSortOption('money_maker');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shrink-0 ${
                  moneyMakerOnly 
                    ? 'bg-amber-500/30 text-amber-300 border-amber-500/70 shadow-sm' 
                    : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-200'
                }`}
              >
                <span>💰 MONEY MAKERS</span>
              </button>

              <button
                type="button"
                onClick={() => { 
                  setFreeOnly(!freeOnly); 
                  setMoneyMakerOnly(false); 
                  setRecipesOnly(false); 
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shrink-0 ${
                  freeOnly 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' 
                    : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-200'
                }`}
              >
                <span>🆓 FREE ($0 OFFERS)</span>
              </button>

              <button
                type="button"
                onClick={() => { 
                  setFreeOnly(false); 
                  setMoneyMakerOnly(false); 
                  setRecipesOnly(false); 
                  setSelectedCategory('Restaurants & Food'); 
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shrink-0 ${
                  selectedCategory === 'Restaurants & Food'
                    ? 'bg-teal-500/30 text-teal-300 border-teal-500/70'
                    : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-200'
                }`}
              >
                <span>🛒 GROCERY & FOOD</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('stores')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold text-neutral-200 transition shrink-0"
              >
                <span>🏪 POPULAR STORES</span>
              </button>
            </div>

            {/* 1¢ PENNY FINDS HOMEPAGE MODULE */}
            {!freeOnly && !moneyMakerOnly && !recipesOnly && (
              <PennyHomeModule onViewAllPennyFinds={() => setActiveTab('penny')} />
            )}

            {/* BEST DEAL ENGINE SHOWCASE */}
            {bestDealData && !freeOnly && (
              <BestDealBanner
                deal={bestDealData.bestDeal}
                evaluation={bestDealData.evaluation}
                isSaved={savedDealIds.has(bestDealData.bestDeal.id)}
                currency={currency}
                onToggleSave={handleToggleSaveDeal}
                onOpenDetails={(d) => setSelectedDealForDetails(d)}
                onOpenAddToList={(d) => setSelectedDealForAddToList(d)}
                onTriggerConfirmation={(d) => setDealToConfirm(d)}
                onOpenCompareModal={handleOpenBestDealComparison}
              />
            )}

            {/* Deals Grid Header */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>{selectedCategory === 'All' ? 'Verified Deals & Coupon Stacks' : `${selectedCategory} Deals`}</span>
                  <span className="text-xs font-mono text-neutral-500 font-normal">({deals.length} verified)</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Algorithmically ranked by discount depth, verification confidence, and price history advantage
                </p>
              </div>

              <button
                type="button"
                onClick={loadDeals}
                title="Refresh Deals Feed"
                className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingDeals ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Deals Grid */}
            {isLoadingDeals ? (
              <SnagzLoadingState 
                message="Scanning current offers…" 
                subMessage="Running real-time price verification, circular matching, and coupon stack analysis..." 
              />
            ) : deals.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-neutral-900/60 border border-neutral-800">
                <ShieldCheck className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <h3 className="font-bold text-white text-base">No matching deals found</h3>
                <p className="text-xs text-neutral-400 mt-1">Try broadening your search term or exploring another category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {deals.map((deal) => (
                  <CouponCard
                    key={deal.id}
                    deal={deal}
                    currency={currency}
                    isSaved={savedDealIds.has(deal.id)}
                    onToggleSave={handleToggleSaveDeal}
                    onOpenDetails={(d) => setSelectedDealForDetails(d)}
                    onOpenAddToList={(d) => setSelectedDealForAddToList(d)}
                    onVote={handleVote}
                    onOpenWhyNotFree={(d) => setSelectedDealForWhyNotFree(d)}
                    onTriggerConfirmation={(d) => setDealToConfirm(d)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: SAVINGS TRACKER DASHBOARD */}
        {activeTab === 'savings' && (
          <SavingsTrackerView
            currency={currency}
            onSelectDeal={(dealId) => {
              const found = deals.find(d => d.id === dealId);
              if (found) setSelectedDealForDetails(found);
            }}
          />
        )}

        {/* VIEW 3: STORES & CASHBACK DIRECTORY */}
        {activeTab === 'stores' && (
          <StoreDirectory
            stores={stores}
            deals={deals}
            savedDealIds={savedDealIds}
            onToggleSaveDeal={handleToggleSaveDeal}
            onToggleFollowStore={handleToggleFollowStore}
            onOpenDetails={(d) => setSelectedDealForDetails(d)}
            onOpenAddToList={(d) => setSelectedDealForAddToList(d)}
            onVote={handleVote}
          />
        )}

        {/* VIEW 4: FREE DEALS & SAMPLES HUB */}
        {activeTab === 'free' && (
          <FreeDealsHub
            deals={deals}
            savedDealIds={savedDealIds}
            onToggleSave={handleToggleSaveDeal}
            onOpenDetails={(d) => setSelectedDealForDetails(d)}
            onOpenAddToList={(d) => setSelectedDealForAddToList(d)}
            onVote={handleVote}
          />
        )}

        {/* VIEW 5: USER SAVED & CUSTOM LISTS */}
        {activeTab === 'saved' && (
          <SavedAndLists
            savedDeals={savedDeals}
            userLists={userLists}
            watchlist={watchlist}
            alerts={alerts}
            savedDealIds={savedDealIds}
            onToggleSaveDeal={handleToggleSaveDeal}
            onOpenDetails={(d) => setSelectedDealForDetails(d)}
            onOpenAddToList={(d) => setSelectedDealForAddToList(d)}
            onVote={handleVote}
            onCreateList={handleCreateList}
            onDeleteList={handleDeleteList}
            onRemoveFromList={handleRemoveFromList}
            onAddToWatchlist={handleAddToWatchlist}
            onRemoveFromWatchlist={handleRemoveFromWatchlist}
            onCreateAlert={handleCreateAlert}
            onDeleteAlert={handleDeleteAlert}
            allDeals={deals}
          />
        )}

        {/* VIEW 6: 1¢ PENNY LIST SECTION */}
        {activeTab === 'penny' && (
          <PennyListView
            onAskZigAboutPenny={(query) => {
              setIsAiAssistantOpen(true);
            }}
            savedItemIds={savedDealIds}
            onToggleSave={handleToggleSaveDeal}
            currency={currency}
          />
        )}

        {/* VIEW 7: ADMIN & TELEMETRY OPERATIONS */}
        {activeTab === 'admin' && (
          <AdminDashboard
            deals={deals}
            onRefreshDeals={() => {
              loadDeals();
              loadInitialData();
            }}
          />
        )}
      </main>

      {/* Floating ZIG Mascot Trigger on Desktop bottom-right */}
      <div className="hidden md:block fixed bottom-6 right-6 z-30">
        <button
          id="btn-desktop-zig-assistant"
          type="button"
          onClick={() => setIsAiAssistantOpen(true)}
          aria-label="Ask ZIG — Your Deal Hunter"
          className="group flex items-center gap-3 pl-2 pr-4 py-2 rounded-full bg-neutral-950/95 hover:bg-neutral-900 text-white font-bold text-xs shadow-2xl shadow-emerald-950 border border-emerald-500/40 hover:border-emerald-400 transition-all hover:scale-105 backdrop-blur-md"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-neutral-900 border border-emerald-400/50 flex items-center justify-center overflow-hidden">
              <ZigAvatar size={28} expression="confident" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-neutral-950 animate-pulse" />
          </div>
          <div className="text-left leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-emerald-400 tracking-wider">ZIG</span>
              <span className="text-[9px] px-1 rounded bg-emerald-950 text-emerald-300 font-mono">HUNTER</span>
            </div>
            <span className="text-[10px] text-neutral-400 font-normal">Ask for deals & stacks</span>
          </div>
        </button>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedCount={savedDealIds.size}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
      />

      {/* MODALS */}
      {/* 1. Deal Details Modal */}
      <DealDetailsModal
        deal={selectedDealForDetails}
        onClose={() => setSelectedDealForDetails(null)}
        onVote={handleVote}
        onReport={handleReport}
      />

      {/* 2. Add to Custom List Modal */}
      <AddToListModal
        deal={selectedDealForAddToList}
        userLists={userLists}
        onClose={() => setSelectedDealForAddToList(null)}
        onAddToList={handleAddDealToList}
        onCreateAndAdd={handleCreateAndAdd}
      />

      {/* 3. Final Price Stacking Calculator */}
      <FinalPriceCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      {/* 4. AI Receipt Scanner & OCR Savings */}
      <ReceiptScannerModal
        isOpen={isReceiptScannerOpen}
        onClose={() => setIsReceiptScannerOpen(false)}
      />

      {/* 5. In-Store Barcode Scanner */}
      <BarcodeScannerModal
        isOpen={isBarcodeScannerOpen}
        onClose={() => setIsBarcodeScannerOpen(false)}
        onSelectDeal={(dealId) => {
          const found = deals.find(d => d.id === dealId);
          if (found) setSelectedDealForDetails(found);
        }}
      />

      {/* 6. Browser Extension Simulator */}
      <ExtensionSimulator
        isOpen={isExtensionModalOpen}
        onClose={() => setIsExtensionModalOpen(false)}
      />

      {/* 7. Conversational AI Shopping Assistant */}
      <AiShoppingAssistant
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        onSelectDealId={(dealId) => {
          const found = deals.find(d => d.id === dealId);
          if (found) {
            setIsAiAssistantOpen(false);
            setSelectedDealForDetails(found);
          }
        }}
      />

      {/* 8. Location Preferences Modal */}
      <LocationPickerModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        currentLocation={currentLocation}
        onSaveLocation={setCurrentLocation}
      />

      {/* 9. Price Drop Alerts Drawer */}
      <PriceDropAlertsDrawer
        isOpen={isAlertsDrawerOpen}
        onClose={() => setIsAlertsDrawerOpen(false)}
        alerts={priceDropAlerts}
        currency={currency}
        onSelectDeal={(dealId) => {
          setIsAlertsDrawerOpen(false);
          const found = deals.find(d => d.id === dealId);
          if (found) setSelectedDealForDetails(found);
        }}
      />

      {/* 10. Post-Deal Savings Confirmation & Feedback Modal */}
      <PostDealConfirmationModal
        deal={dealToConfirm}
        isOpen={dealToConfirm !== null}
        currency={currency}
        onClose={() => setDealToConfirm(null)}
        onConfirmSuccess={handleConfirmSuccess}
        onReportIssue={handleReport}
      />

      {/* 11. Why Not Free Trust Modal */}
      <WhyNotFreeModal
        deal={selectedDealForWhyNotFree}
        isOpen={selectedDealForWhyNotFree !== null}
        onClose={() => setSelectedDealForWhyNotFree(null)}
      />

      {/* 12. Privacy, Currency & Settings Modal */}
      <PrivacyAndSettingsModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        currency={currency}
        onCurrencyChange={(c) => setCurrency(c)}
      />

      {/* 13. Side-by-Side Deal Comparison Modal */}
      {comparisonDeals && (
        <DealComparisonModal
          deals={comparisonDeals}
          onClose={() => setComparisonDeals(null)}
          onSelectDeal={(deal) => {
            setComparisonDeals(null);
            setSelectedDealForDetails(deal);
          }}
        />
      )}
    </div>
  );
}

export default App;
