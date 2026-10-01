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
  PiggyBank,
  Tag
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
  SupportedCurrency,
  HideDealReason
} from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CouponCard } from './components/CouponCard';
import { CleanHomeView } from './components/CleanHomeView';
import { PromoCodesView } from './components/PromoCodesView';
import { DealHiddenToast } from './components/DealHiddenToast';
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
import { PriceFinderView } from './components/PriceFinderView';
import { hiddenDealsManager } from './services/hiddenDealsManager';
import { testFirestoreConnection, isFirebaseConfigured } from './services/firebase';

export type AppNavTab = 'home' | 'deals' | 'stores' | 'promocodes' | 'pricefinder' | 'free' | 'saved' | 'penny' | 'savings' | 'admin';

export function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<AppNavTab>('home');

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

  // Hidden Deals Management
  const [hiddenVersion, setHiddenVersion] = useState(0);
  const [toastHiddenDeal, setToastHiddenDeal] = useState<Deal | null>(null);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFinderQuery, setPriceFinderQuery] = useState('');
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
    const timer = setTimeout(() => setIsInitialSplash(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Subscribe to hidden deals changes
  useEffect(() => {
    const unsubscribe = hiddenDealsManager.subscribe(() => {
      setHiddenVersion(v => v + 1);
    });
    return () => unsubscribe();
  }, []);

  // Filter out hidden deals across all feeds
  const visibleDeals = useMemo(() => {
    return hiddenDealsManager.filterVisibleDeals(deals);
  }, [deals, hiddenVersion]);

  const handleOpenBestDealComparison = () => {
    if (!bestDealData) return;
    const topChoice = { ...bestDealData.bestDeal, isBestChoice: true };
    const others = visibleDeals.filter(d => d.id !== topChoice.id).slice(0, 2);
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
      if (isFirebaseConfigured) {
        testFirestoreConnection().catch(e => console.info('[Firebase] Notice:', e));
      }

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

    // Switch to deals tab to view matching search results
    if (activeTab === 'home') {
      setActiveTab('deals');
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

  // Hide Deal Feature Handlers
  const handleHideDeal = (deal: Deal) => {
    hiddenDealsManager.hideDeal(deal);
    setToastHiddenDeal(deal);
  };

  const handleUndoHide = (deal: Deal) => {
    hiddenDealsManager.restoreDeal(deal.id);
    setToastHiddenDeal(null);
  };

  const handleSelectHideReason = (dealId: string, reason: HideDealReason) => {
    hiddenDealsManager.setReason(dealId, reason);
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

  // Post Deal Confirmation
  const handleConfirmSuccess = async (dealId: string, amountSaved: number, code?: string) => {
    try {
      await api.confirmSavings(dealId, amountSaved, code);
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

  // Store Follow
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
    return visibleDeals.filter(d => savedDealIds.has(d.id));
  }, [visibleDeals, savedDealIds]);

  return (
    <div className="min-h-screen bg-[#0a0d14] text-neutral-100 flex flex-col font-sans pb-16 md:pb-8 selection:bg-blue-500 selection:text-white">
      {/* Splash / Launch Experience */}
      {isInitialSplash && <SnagzSplashScreen />}

      {/* Primary Header with 6 destinations and secondary ZIG */}
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
          if (activeTab !== 'deals') setActiveTab('deals');
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
        hiddenDealsCount={hiddenDealsManager.getHiddenDeals().length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* DESTINATION 1: HOMEPAGE (Clean Front Door) */}
        {activeTab === 'home' && (
          <CleanHomeView
            deals={visibleDeals}
            stores={stores}
            currency={currency}
            savedDealIds={savedDealIds}
            onToggleSaveDeal={handleToggleSaveDeal}
            onOpenDetails={(d) => setSelectedDealForDetails(d)}
            onHideDeal={handleHideDeal}
            onReportDeal={(d) => setSelectedDealForDetails(d)}
            onTriggerConfirmation={(d) => setDealToConfirm(d)}
            onNavigateTab={(tab, query) => {
              if (query) setPriceFinderQuery(query);
              setActiveTab(tab);
            }}
            onSelectStore={(storeName) => {
              setSearchQuery(storeName);
              setActiveTab('deals');
            }}
            onDealsUpdated={(freshDeals) => {
              setDeals(prev => {
                const freshIds = new Set(freshDeals.map(f => f.id));
                return [...freshDeals, ...prev.filter(p => !freshIds.has(p.id))];
              });
            }}
          />
        )}

        {/* DESTINATION 2: DEALS (Full Filtered Feed) */}
        {activeTab === 'deals' && (
          <div className="space-y-6">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => { 
                  setFreeOnly(false); 
                  setMoneyMakerOnly(false); 
                  setRecipesOnly(false); 
                  setSelectedCategory('All'); 
                }}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition shrink-0 ${
                  selectedCategory === 'All' && !freeOnly && !moneyMakerOnly && !recipesOnly
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm shadow-blue-900/30'
                    : 'bg-[#121624] hover:bg-[#182138] border-[#222b3e] text-neutral-300'
                }`}
              >
                All Deals
              </button>

              {categories.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(c.name);
                    setFreeOnly(false);
                    setMoneyMakerOnly(false);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition shrink-0 ${
                    selectedCategory === c.name && !freeOnly && !moneyMakerOnly
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm shadow-blue-900/30'
                      : 'bg-[#121624] hover:bg-[#182138] border-[#222b3e] text-neutral-300'
                  }`}
                >
                  {c.name}
                </button>
              ))}

              <button
                type="button"
                onClick={() => { 
                  setMoneyMakerOnly(!moneyMakerOnly); 
                  setFreeOnly(false);
                  if (!moneyMakerOnly) setSortOption('money_maker');
                }}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition shrink-0 ${
                  moneyMakerOnly 
                    ? 'bg-amber-500/30 text-amber-300 border-amber-500/70 shadow-sm' 
                    : 'bg-[#121624] hover:bg-[#182138] border-[#222b3e] text-neutral-300'
                }`}
              >
                💰 Money Makers
              </button>

              <button
                type="button"
                onClick={() => { 
                  setSearchQuery(searchQuery === 'Krazy Coupon Lady' ? '' : 'Krazy Coupon Lady');
                  setMoneyMakerOnly(false);
                  setFreeOnly(false);
                }}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition shrink-0 ${
                  searchQuery.toLowerCase().includes('krazy')
                    ? 'bg-purple-600 text-white border-purple-500 shadow-sm' 
                    : 'bg-[#121624] hover:bg-[#182138] border-[#222b3e] text-neutral-300'
                }`}
              >
                🏷️ Krazy Coupon Lady
              </button>

              <button
                type="button"
                onClick={() => { 
                  setSearchQuery(searchQuery === 'Koupons.ai' ? '' : 'Koupons.ai');
                  setMoneyMakerOnly(false);
                  setFreeOnly(false);
                }}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition shrink-0 ${
                  searchQuery.toLowerCase().includes('koupons')
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm' 
                    : 'bg-[#121624] hover:bg-[#182138] border-[#222b3e] text-neutral-300'
                }`}
              >
                ⚡ Koupons.ai Codes
              </button>
            </div>

            {/* Best Deal Engine Showcase (if not hidden) */}
            {bestDealData && !hiddenDealsManager.isDealHidden(bestDealData.bestDeal.id) && !freeOnly && (
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

            {/* Feed Header */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>{selectedCategory === 'All' ? 'Verified Deals & Stacks' : `${selectedCategory} Deals`}</span>
                  <span className="text-xs font-mono text-neutral-400 font-normal">({visibleDeals.length} active)</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Hand-verified offers updated in real-time
                </p>
              </div>

              <button
                type="button"
                onClick={loadDeals}
                title="Refresh Deals Feed"
                className="p-2 rounded-xl bg-[#121624] hover:bg-[#182138] border border-[#222b3e] text-neutral-400 hover:text-white transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingDeals ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Deals Grid */}
            {isLoadingDeals ? (
              <SnagzLoadingState 
                message="Scanning offers…" 
                subMessage="Checking verification confidence and prices..." 
              />
            ) : visibleDeals.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#121624] border border-[#222b3e]">
                <ShieldCheck className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <h3 className="font-bold text-white text-base">No matching deals</h3>
                <p className="text-xs text-neutral-400 mt-1">Try broadening your search or resetting category filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {visibleDeals.map((deal) => (
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
                    onHideDeal={handleHideDeal}
                    onReportDeal={(d) => setSelectedDealForDetails(d)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* DESTINATION 3: PROMO CODES (Dedicated Verified Promo Codes Page) */}
        {activeTab === 'promocodes' && (
          <PromoCodesView />
        )}

        {/* DESTINATION: UNIVERSAL PRICE FINDER */}
        {activeTab === 'pricefinder' && (
          <PriceFinderView initialQuery={priceFinderQuery} />
        )}

        {/* DESTINATION 4: STORES (Directory) */}
        {activeTab === 'stores' && (
          <StoreDirectory
            stores={stores}
            deals={visibleDeals}
            savedDealIds={savedDealIds}
            onToggleSaveDeal={handleToggleSaveDeal}
            onToggleFollowStore={handleToggleFollowStore}
            onOpenDetails={(d) => setSelectedDealForDetails(d)}
            onOpenAddToList={(d) => setSelectedDealForAddToList(d)}
            onVote={handleVote}
          />
        )}

        {/* DESTINATION 5: FREE DEALS HUB */}
        {activeTab === 'free' && (
          <FreeDealsHub
            deals={visibleDeals}
            savedDealIds={savedDealIds}
            onToggleSave={handleToggleSaveDeal}
            onOpenDetails={(d) => setSelectedDealForDetails(d)}
            onOpenAddToList={(d) => setSelectedDealForAddToList(d)}
            onVote={handleVote}
          />
        )}

        {/* DESTINATION 6: PENNY LIST SECTION */}
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

        {/* DESTINATION 7: SAVED DEALS & CUSTOM LISTS */}
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
            allDeals={visibleDeals}
          />
        )}

        {/* SAVINGS TRACKER DASHBOARD */}
        {activeTab === 'savings' && (
          <SavingsTrackerView
            currency={currency}
            onSelectDeal={(dealId) => {
              const found = visibleDeals.find(d => d.id === dealId);
              if (found) setSelectedDealForDetails(found);
            }}
          />
        )}

        {/* ADMIN & TELEMETRY */}
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

      {/* Floating ZIG Mascot Trigger on Desktop */}
      <div className="hidden md:block fixed bottom-6 right-6 z-30">
        <button
          id="btn-desktop-zig-assistant"
          type="button"
          onClick={() => setIsAiAssistantOpen(true)}
          aria-label="Ask ZIG — Your Deal Hunter"
          className="group flex items-center gap-3 pl-2 pr-4 py-2 rounded-full bg-[#0f1422]/95 hover:bg-[#161f36] text-white font-bold text-xs shadow-2xl shadow-blue-950/80 border border-blue-500/40 hover:border-blue-400 transition-all hover:scale-105 backdrop-blur-md"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#141926] border border-blue-400/50 flex items-center justify-center overflow-hidden">
              <ZigAvatar size={28} expression="confident" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-blue-400 border border-[#0f1422] animate-pulse" />
          </div>
          <div className="text-left leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-blue-400 tracking-wider">ZIG</span>
              <span className="text-[9px] px-1 rounded bg-blue-950 text-blue-300 font-mono">HUNTER</span>
            </div>
            <span className="text-[10px] text-neutral-400 font-normal">Ask for deals & stacks</span>
          </div>
        </button>
      </div>

      {/* 5-Item Clean Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        savedCount={savedDealIds.size}
        onOpenPrivacySettings={() => setIsPrivacyModalOpen(true)}
        onOpenSavingsTracker={() => setActiveTab('savings')}
      />

      {/* Deal Hidden Toast with Undo & Feedback Reasons */}
      <DealHiddenToast
        hiddenDeal={toastHiddenDeal}
        onUndo={handleUndoHide}
        onSelectReason={handleSelectHideReason}
        onDismiss={() => setToastHiddenDeal(null)}
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
          const found = visibleDeals.find(d => d.id === dealId);
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
          const found = visibleDeals.find(d => d.id === dealId);
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
          const found = visibleDeals.find(d => d.id === dealId);
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

      {/* 12. Privacy, Currency & Settings Modal (includes Hidden Deals manager tab) */}
      <PrivacyAndSettingsModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        currency={currency}
        onCurrencyChange={(c) => setCurrency(c)}
        onDealRestored={() => setHiddenVersion(v => v + 1)}
        onAllRestored={() => setHiddenVersion(v => v + 1)}
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
