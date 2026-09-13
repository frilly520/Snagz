import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  RefreshCw, 
  Copy, 
  Check, 
  Bookmark, 
  Sparkles, 
  Plus, 
  ExternalLink, 
  HelpCircle, 
  ShieldCheck, 
  Tag, 
  Barcode, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  ThumbsUp, 
  ThumbsDown, 
  Info, 
  Store, 
  X,
  SlidersHorizontal,
  Flame,
  ArrowRight,
  Share2
} from 'lucide-react';
import { PennyItem, PennyListHealth, PennyStatus, PennyFeedbackType, PennyReportSubmission, SupportedCurrency } from '../types';
import { api } from '../services/api';
import { ZigAvatar } from './ZigMascot';

interface PennyListViewProps {
  onAskZigAboutPenny?: (query?: string) => void;
  onSelectDeal?: (item: PennyItem) => void;
  savedItemIds: Set<string>;
  onToggleSave: (id: string, itemTitle?: string) => void;
  currency?: SupportedCurrency;
}

export const PennyListView: React.FC<PennyListViewProps> = ({
  onAskZigAboutPenny,
  onSelectDeal,
  savedItemIds,
  onToggleSave,
  currency = 'USD'
}) => {
  const [items, setItems] = useState<PennyItem[]>([]);
  const [health, setHealth] = useState<PennyListHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL_ACTIVE');
  const [selectedRetailer, setSelectedRetailer] = useState<string>('ALL');
  const [sortOption, setSortOption] = useState('highest_confidence');
  
  // UI interaction states
  const [copiedUpcId, setCopiedUpcId] = useState<string | null>(null);
  const [expandedInstructionsId, setExpandedInstructionsId] = useState<string | null>(null);
  const [feedbackSuccessId, setFeedbackSuccessId] = useState<string | null>(null);
  const [feedbackSuccessMessage, setFeedbackSuccessMessage] = useState<string>('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // New report submission form
  const [newReport, setNewReport] = useState<PennyReportSubmission>({
    retailerId: 'store-dollargeneral',
    productName: '',
    brand: '',
    upc: '',
    itemNumber: '',
    category: 'Household',
    reportedPrice: 0.01,
    storeLocation: '',
    source: 'Community User Submission',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const categories = [
    'All',
    'Household',
    'Cleaning',
    'Apparel',
    'Food',
    'Kitchen',
    'Lawn & Garden',
    'Personal Care',
    'Electronics'
  ];

  const loadPennyData = async () => {
    setIsLoading(true);
    try {
      const [itemsRes, healthRes] = await Promise.all([
        api.getPennyItems({
          category: selectedCategory,
          retailerId: selectedRetailer !== 'ALL' ? selectedRetailer : undefined,
          status: selectedStatus === 'ALL_ACTIVE' ? undefined : selectedStatus,
          sort: sortOption,
          q: searchQuery,
          activeOnly: selectedStatus === 'ALL_ACTIVE'
        }),
        api.getPennyHealth()
      ]);

      if (itemsRes && Array.isArray(itemsRes.items)) {
        setItems(itemsRes.items);
      }
      if (healthRes) {
        setHealth(healthRes);
      }
    } catch (err) {
      console.error('Failed to load penny list data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPennyData();
  }, [selectedCategory, selectedRetailer, selectedStatus, sortOption]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadPennyData();
  };

  const handleCopyUpc = (item: PennyItem) => {
    navigator.clipboard.writeText(item.upc);
    setCopiedUpcId(item.id);
    setTimeout(() => setCopiedUpcId(null), 2500);
  };

  const handleFeedback = async (id: string, type: PennyFeedbackType) => {
    try {
      const res = await api.submitPennyFeedback(id, type);
      if (res.success) {
        setItems(prev => prev.map(item => item.id === id ? res.item : item));
        setFeedbackSuccessId(id);
        setFeedbackSuccessMessage(
          type === 'RANG_UP_PENNY' 
            ? 'Confirmed! Your verification was added to the live health score.' 
            : 'Feedback recorded. Flagged for verification audit.'
        );
        setTimeout(() => setFeedbackSuccessId(null), 3000);
      }
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReport.productName || !newReport.upc) return;
    setIsSubmitting(true);
    setSubmissionFeedback(null);
    try {
      const res = await api.submitPennyReport(newReport);
      setSubmissionFeedback({ success: res.success, message: res.message });
      if (res.success) {
        setTimeout(() => {
          setIsSubmitModalOpen(false);
          setSubmissionFeedback(null);
          setNewReport({
            retailerId: 'store-dollargeneral',
            productName: '',
            brand: '',
            upc: '',
            itemNumber: '',
            category: 'Household',
            reportedPrice: 0.01,
            storeLocation: '',
            source: 'Community User Submission',
            notes: ''
          });
          loadPennyData();
        }, 2000);
      }
    } catch (err: any) {
      setSubmissionFeedback({ success: false, message: err.message || 'Submission failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: PennyStatus) => {
    switch (status) {
      case 'CONFIRMED_PENNY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            CONFIRMED 1¢ PENNY
          </span>
        );
      case 'REPORTED_PENNY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            REPORTED 1¢ (AUDIT IN PROGRESS)
          </span>
        );
      case 'STALE_NEEDS_VERIFICATION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
            NEEDS VERIFICATION
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-neutral-800 text-neutral-400 border border-neutral-700">
            NO LONGER 1¢
          </span>
        );
    }
  };

  return (
    <div id="snagz-penny-list-view" className="space-y-6">
      {/* 1. Header Banner & System Health */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/40 border border-neutral-800 p-5 sm:p-7 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-neutral-950 tracking-wider shadow-sm">
                <span className="w-2 h-2 rounded-full bg-neutral-950 animate-ping" />
                1¢ PENNY RADAR
              </span>
              <span className="text-xs text-neutral-400 font-medium">
                Official Dollar General & Retail Clearance
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>PENNY LIST</span>
              <span className="text-amber-400 font-mono text-xl sm:text-2xl">$0.01</span>
            </h1>
            <p className="text-sm text-neutral-300 mt-1 max-w-2xl font-medium">
              Current $0.01 Finds — Active clearance items confirmed ringing up for exactly one cent at store checkout.
            </p>

            {/* Health indicators */}
            {health && (
              <div className="flex items-center gap-4 mt-4 flex-wrap text-xs text-neutral-400">
                <div className="flex items-center gap-1.5 bg-neutral-950/80 px-2.5 py-1 rounded-lg border border-neutral-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-neutral-200 font-bold">{health.confirmedCount} Confirmed Active</span>
                </div>
                <div className="flex items-center gap-1.5 bg-neutral-950/80 px-2.5 py-1 rounded-lg border border-neutral-800">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Last updated moments ago</span>
                </div>
                <div className="flex items-center gap-1.5 bg-neutral-950/80 px-2.5 py-1 rounded-lg border border-neutral-800">
                  <Store className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-neutral-200 font-medium">Dollar General (Active Coverage)</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions Right Column */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            {/* Guide Button */}
            <button
              type="button"
              onClick={() => setIsGuideModalOpen(true)}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-neutral-950/90 hover:bg-neutral-800 border border-neutral-700 text-xs font-bold text-neutral-200 hover:text-white transition-colors"
            >
              <Info className="w-4 h-4 text-amber-400" />
              <span>How Penny Shopping Works</span>
            </button>

            {/* Submit Penny Item CTA */}
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 text-xs font-extrabold shadow-md shadow-amber-950/50 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Submit a 1¢ Find</span>
            </button>
          </div>
        </div>

        {/* ZIG Penny Advisor Callout Banner */}
        <div className="mt-5 pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-neutral-950/50 p-3 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-neutral-900 border border-blue-500/40 flex items-center justify-center overflow-hidden shrink-0">
              <ZigAvatar size={28} expression="confident" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-400">ZIG's Penny Radar Tip:</span>
              <p className="text-xs text-neutral-300">
                Penny pricing can vary by location and may be corrected or removed by the retailer. Verify the price at checkout!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onAskZigAboutPenny && onAskZigAboutPenny("What are the best Dollar General penny items right now?")}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 shrink-0 bg-blue-950/40 border border-blue-500/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ask ZIG about Penny Items →</span>
          </button>
        </div>
      </div>

      {/* 2. Controls Row: Search & Filters */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search penny items by name, brand, UPC barcode (e.g. '076753', 'Gain', 'Yellow Dot')..."
              className="w-full pl-9 pr-24 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/60"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-colors"
            >
              Search
            </button>
          </form>

          {/* Filters & Sorting */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs">
              <span className="text-neutral-500 font-medium">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-neutral-200 focus:outline-none text-xs font-semibold cursor-pointer"
              >
                <option value="ALL_ACTIVE" className="bg-neutral-900">All Active 1¢ Items</option>
                <option value="CONFIRMED_PENNY" className="bg-neutral-900">Confirmed Penny (High Conf)</option>
                <option value="REPORTED_PENNY" className="bg-neutral-900">Reported (Community Reports)</option>
                <option value="STALE_NEEDS_VERIFICATION" className="bg-neutral-900">Needs Verification</option>
                <option value="ALL" className="bg-neutral-900">Include Inactive</option>
              </select>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-transparent text-neutral-200 focus:outline-none text-xs font-semibold cursor-pointer"
              >
                <option value="highest_confidence" className="bg-neutral-900">Highest Confidence Rank</option>
                <option value="recently_verified" className="bg-neutral-900">Recently Verified</option>
                <option value="newest" className="bg-neutral-900">Newest Discovered</option>
                <option value="most_confirmations" className="bg-neutral-900">Most User Confirmations</option>
                <option value="category" className="bg-neutral-900">By Category</option>
              </select>
            </div>

            {/* Refresh button */}
            <button
              type="button"
              onClick={loadPennyData}
              title="Refresh Penny List"
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Items Grid */}
      {isLoading ? (
        <div className="p-16 text-center rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
          <h3 className="font-bold text-white text-base">Scanning Penny Database</h3>
          <p className="text-xs text-neutral-400 mt-1">Cross-referencing Dollar General markdown schedule and community receipts...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <Barcode className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="font-bold text-white text-base">No Penny Items Matched</h3>
          <p className="text-xs text-neutral-400 mt-1">Try resetting the category filter or searching for another term.</p>
          <button
            type="button"
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setSelectedStatus('ALL_ACTIVE'); }}
            className="mt-4 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {items.map((item) => {
            const isSaved = savedItemIds.has(item.id);
            const isInstructionsOpen = expandedInstructionsId === item.id;
            const savingsPercent = item.previousPrice > 0 ? (((item.previousPrice - 0.01) / item.previousPrice) * 100).toFixed(1) : '99.9';

            return (
              <div
                key={item.id}
                id={`penny-card-${item.id}`}
                className="group relative flex flex-col bg-neutral-900/90 hover:bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700 rounded-xl p-4 sm:p-5 transition-all duration-200 shadow-lg hover:shadow-neutral-950/60"
              >
                {/* Card Top: Retailer & Actions */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-950 border border-neutral-800 p-1 flex items-center justify-center shrink-0">
                      <img 
                        src={item.retailerLogo} 
                        alt={item.retailerName} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain rounded"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-neutral-300 group-hover:text-white block">
                        {item.retailerName}
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        {item.locationApplicability.region || 'Nationwide Stores'}
                      </span>
                    </div>
                  </div>

                  {/* Bookmark Save Button */}
                  <button
                    type="button"
                    onClick={() => onToggleSave(item.id, item.productName)}
                    title={isSaved ? 'Remove from Saved' : 'Save Penny Item'}
                    className={`p-2 rounded-lg border transition-colors ${
                      isSaved 
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                        : 'bg-neutral-950/70 hover:bg-neutral-800 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Status Badge & Confidence */}
                <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
                  {getStatusBadge(item.status)}
                  <span className="text-[11px] font-mono text-neutral-400">
                    {item.confidence}% confidence
                  </span>
                </div>

                {/* Product Image & Title */}
                <div className="flex gap-3 mb-3">
                  <div className="w-16 h-16 rounded-lg bg-neutral-950 border border-neutral-800 overflow-hidden shrink-0">
                    <img 
                      src={item.productImage} 
                      alt={item.productName} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                      {item.brand}
                    </span>
                    <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug">
                      {item.productName}
                    </h3>
                    {item.variant && (
                      <span className="text-[11px] text-neutral-400 block mt-0.5 truncate">
                        {item.variant} {item.size ? `• ${item.size}` : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Price Display */}
                <div className="mb-3 p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-amber-400 tracking-tight font-mono">
                        $0.01
                      </span>
                      <span className="text-xs text-neutral-400 line-through font-mono">
                        ${item.previousPrice.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      {savingsPercent}% OFF RETAIL
                    </span>
                  </div>

                  {item.seasonalInfo && (
                    <div className="text-right max-w-[50%]">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-900 border border-neutral-800 text-amber-300">
                        <Tag className="w-3 h-3 text-amber-400" />
                        <span className="truncate">{item.seasonalInfo}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Barcode & UPC with Copy Button */}
                <div className="mb-3 px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <Barcode className="w-4 h-4 text-neutral-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] text-neutral-500 uppercase block leading-none">UPC Barcode</span>
                      <span className="text-xs font-mono font-bold text-neutral-200 tracking-wider truncate block">
                        {item.upc}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyUpc(item)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-semibold transition-colors shrink-0"
                  >
                    {copiedUpcId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-neutral-400" />
                        <span>Copy UPC</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Verification Freshness & Confirmations Count */}
                <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-3 px-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-neutral-500" />
                    <span>Verified {item.lastVerifiedRelative}</span>
                  </span>
                  <span className="text-emerald-400 font-semibold">
                    {item.userFeedbackStats.rangUpPennyCount} verified checkouts
                  </span>
                </div>

                {/* In-Store Instructions Accordion Toggle */}
                <button
                  type="button"
                  onClick={() => setExpandedInstructionsId(isInstructionsOpen ? null : item.id)}
                  className="w-full mb-3 flex items-center justify-between px-3 py-1.5 rounded-lg bg-neutral-950/60 hover:bg-neutral-950 border border-neutral-800 text-xs font-medium text-neutral-300 transition-colors"
                >
                  <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                    <Info className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isInstructionsOpen ? 'Hide In-Store Instructions' : 'View In-Store Hunting Guide'}</span>
                  </span>
                  {isInstructionsOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                  )}
                </button>

                {/* Expanded Instructions Content */}
                {isInstructionsOpen && (
                  <div className="mb-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 space-y-2 animate-in fade-in duration-150">
                    <div className="font-bold text-amber-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>Where to Find:</span>
                    </div>
                    <p className="text-neutral-300 leading-relaxed">
                      {item.availabilityDetails}
                    </p>

                    <div className="border-t border-neutral-800/80 pt-2 text-[11px] text-neutral-400 space-y-1">
                      <div className="font-semibold text-neutral-200">How to Checkout:</div>
                      <p>1. Scan the UPC with your Dollar General app price checker before heading to checkout.</p>
                      <p>2. If it scans $0.01, bring to register. Cashier scans barcode; register total will display $0.01.</p>
                      <p className="text-amber-400/90 italic">
                        *Penny pricing can vary by location and may be corrected or removed by the retailer. Verify the price at checkout.
                      </p>
                    </div>
                  </div>
                )}

                {/* Feedback Success Notification */}
                {feedbackSuccessId === item.id && (
                  <div className="mb-2 p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-300 text-center animate-in fade-in">
                    {feedbackSuccessMessage}
                  </div>
                )}

                {/* Action Row: Community Feedback Buttons */}
                <div className="mt-auto pt-3 border-t border-neutral-800/80 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleFeedback(item.id, 'RANG_UP_PENNY')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-xs font-bold transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Rang Up 1¢</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFeedback(item.id, 'DIDNT_WORK')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-rose-950/30 hover:bg-rose-950/60 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-medium transition-colors"
                  >
                    <ThumbsDown className="w-3.5 h-3.5 text-rose-400" />
                    <span>Didn't Work</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. MODAL: How Penny Shopping Works */}
      {isGuideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-amber-400 text-neutral-950 font-black flex items-center justify-center text-xs">1¢</span>
                <h3 className="text-lg font-bold text-white">How Dollar General Penny Shopping Works</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsGuideModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-neutral-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="font-bold text-amber-300">Why do items drop to 1 cent?</span>
                <p>
                  At Dollar General, seasonal clearance items go through sequential markdown stages (25% off &rarr; 50% off &rarr; 70% off &rarr; 90% off). 
                  When an item reaches the end of its markdown lifecycle, the corporate inventory system schedules it to drop to <strong>$0.01</strong> every Tuesday morning as an internal signal to store employees to remove the item from shelves.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="font-bold text-amber-300">Are penny items glitches?</span>
                <p>
                  <strong>No.</strong> Penny items are not classified as glitches. They are standard corporate clearance markdown lifecycle items that remain in the register point-of-sale system at 1 cent until physically pulled by store associates.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="font-bold text-amber-300">Important Rules of In-Store Hunting:</span>
                <ul className="list-disc list-inside space-y-1 text-neutral-400 mt-1">
                  <li><strong>Never ask associates for penny items:</strong> Employees are supposed to pull them; asking will prompt them to remove the items before you can purchase.</li>
                  <li><strong>Use the DG App:</strong> Scan items using the in-app price scanner to verify the price reads $0.01 before approaching the counter.</li>
                  <li><strong>Be polite at the register:</strong> Store policy allows associates to complete the transaction if an item is brought to the counter, but remain courteous if an item is declined or already marked out of stock.</li>
                  <li><strong>Penny pricing can vary by location and may be corrected or removed by the retailer. Verify the price at checkout.</strong></li>
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsGuideModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-colors"
            >
              Got It, Let's Hunt 1¢ Items
            </button>
          </div>
        </div>
      )}

      {/* 5. MODAL: Submit a Penny Find */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Submit a 1¢ Penny Find</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-400">
              Found an item ringing up for $0.01? Submit details below to help community shoppers. Items are audited by SNAGZ verification scanners.
            </p>

            {submissionFeedback && (
              <div className={`p-3 rounded-xl border text-xs ${
                submissionFeedback.success 
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
                  : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
              }`}>
                {submissionFeedback.message}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Retailer</label>
                <select
                  value={newReport.retailerId}
                  onChange={(e) => setNewReport({ ...newReport, retailerId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="store-dollargeneral">Dollar General (Active)</option>
                  <option value="store-homedepot">The Home Depot (Planned)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clorox Disinfecting Bleach 43oz Meadow Fresh"
                  value={newReport.productName}
                  onChange={(e) => setNewReport({ ...newReport, productName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Brand</label>
                  <input
                    type="text"
                    placeholder="e.g. Clorox, Gain, Gildan"
                    value={newReport.brand}
                    onChange={(e) => setNewReport({ ...newReport, brand: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Category</label>
                  <select
                    value={newReport.category}
                    onChange={(e) => setNewReport({ ...newReport, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">UPC Barcode (Digits only) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 044600322582"
                  value={newReport.upc}
                  onChange={(e) => setNewReport({ ...newReport, upc: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-neutral-500 mt-0.5 block">
                  Exact UPC barcode is essential to avoid false positives.
                </span>
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Store Location or City, State</label>
                <input
                  type="text"
                  placeholder="e.g. Dallas, TX or Store #14022"
                  value={newReport.storeLocation}
                  onChange={(e) => setNewReport({ ...newReport, storeLocation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Receipt Notes / Clearance Tag Dot</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Yellow Dot seasonal clearance, rang up $0.01 at register. Located on top clearance shelf."
                  value={newReport.notes}
                  onChange={(e) => setNewReport({ ...newReport, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newReport.productName || !newReport.upc}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  {isSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Penny Item'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
