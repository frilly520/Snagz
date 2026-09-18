import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  Tag, 
  Filter, 
  AlertCircle, 
  Clock, 
  ChevronRight, 
  Info, 
  Store as StoreIcon,
  Sparkles,
  X
} from 'lucide-react';
import { PromoCode, PromoCodeCategoryFilter } from '../types';
import { api } from '../services/api';

const CATEGORY_FILTERS: PromoCodeCategoryFilter[] = [
  'All',
  '20%+ Off',
  '$ Off',
  'Free Shipping',
  'New Customers',
  'Clearance',
  'Expiring Soon'
];

export const PromoCodesView: React.FC = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [stores, setStores] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PromoCodeCategoryFilter>('All');
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [selectedPromoForDetails, setSelectedPromoForDetails] = useState<PromoCode | null>(null);
  const [showArchNotice, setShowArchNotice] = useState<boolean>(false);

  useEffect(() => {
    loadPromoCodes();
  }, [searchQuery, selectedCategory, selectedStore, verifiedOnly]);

  const loadPromoCodes = async () => {
    setIsLoading(true);
    try {
      const res = await api.getPromoCodes({
        q: searchQuery,
        store: selectedStore,
        filter: selectedCategory,
        verifiedOnly
      });
      if (res) {
        setPromoCodes(res.promoCodes || []);
        if (res.stores && res.stores.length > 0) {
          setStores(res.stores);
        }
      }
    } catch (err) {
      console.warn('Error fetching promo codes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (promo: PromoCode, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(promo.code);
    setCopiedCodeId(promo.id);
    setTimeout(() => {
      setCopiedCodeId(null);
    }, 2500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Tag className="w-4 h-4" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Verified Promo Codes
              </h1>
            </div>
            <p className="text-sm text-slate-400">
              Currently working codes we’ve verified through official retailer circulars, direct feeds, and checkout tests.
            </p>
          </div>

          {/* Verification Architecture Notice Button */}
          <button
            type="button"
            onClick={() => setShowArchNotice(true)}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141926] hover:bg-[#1a2133] border border-[#222b3e] text-xs font-semibold text-slate-300 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>How We Verify</span>
          </button>
        </div>
      </div>

      {/* Search & Store Select Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stores or promo codes (e.g. Walmart, SAVE20, Nike)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#101524] border border-[#222b3e] focus:border-blue-500 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Store Selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="h-10 px-3 rounded-xl bg-[#101524] border border-[#222b3e] text-xs sm:text-sm font-semibold text-slate-200 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Stores ({stores.length || 'Major Retailers'})</option>
            {stores.map(store => (
              <option key={store} value={store.toLowerCase()}>
                {store}
              </option>
            ))}
          </select>

          {/* Verified Only Toggle */}
          <button
            type="button"
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`h-10 px-3 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 ${
              verifiedOnly 
                ? 'bg-blue-600/15 text-blue-300 border-blue-500/40' 
                : 'bg-[#101524] text-slate-400 border-[#222b3e] hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Verified Only</span>
          </button>
        </div>
      </div>

      {/* Category / Discount Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {CATEGORY_FILTERS.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white border-blue-500 shadow-sm shadow-blue-600/30'
                : 'bg-[#101524] hover:bg-[#182138] border-[#222b3e] text-slate-300 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Count & Current Filter Summary */}
      <div className="flex items-center justify-between mb-4 text-xs text-slate-400">
        <span>
          Showing <strong className="text-white">{promoCodes.length}</strong> {verifiedOnly ? 'verified' : ''} promo codes
        </span>
        {selectedStore !== 'all' && (
          <button
            type="button"
            onClick={() => setSelectedStore('all')}
            className="text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Clear store filter</span>
          </button>
        )}
      </div>

      {/* Promo Codes Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-44 rounded-2xl bg-[#101524] border border-[#222b3e] animate-pulse" />
          ))}
        </div>
      ) : promoCodes.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0f1422] border border-[#222b3e]">
          <Tag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No promo codes found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-4">
            We couldn’t find any verified promo codes matching your filter criteria. Try resetting filters or searching another store.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedStore('all');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {promoCodes.map((promo) => {
            const isCopied = copiedCodeId === promo.id;
            const isVerified = promo.verificationStatus === 'VERIFIED';

            return (
              <div
                key={promo.id}
                id={`promo-card-${promo.id}`}
                onClick={() => setSelectedPromoForDetails(promo)}
                className="group flex flex-col justify-between bg-[#101524] hover:bg-[#141b2e] border border-[#222b3e] hover:border-[#33415c] rounded-2xl p-4 sm:p-5 transition-colors cursor-pointer shadow-sm relative"
              >
                <div>
                  {/* Top Bar: Store Logo & Verification Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#0d101a] border border-[#222b3e] flex items-center justify-center p-0.5 shrink-0">
                        <img
                          src={promo.storeLogo}
                          alt={promo.storeName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain rounded"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-200 block truncate">
                          {promo.storeName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new URL(promo.storeUrl).hostname.replace('www.', '')}
                        </span>
                      </div>
                    </div>

                    {/* Verification Badge */}
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[11px] font-bold shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                        <span>✓ VERIFIED</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold shrink-0">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>UNVERIFIED</span>
                      </span>
                    )}
                  </div>

                  {/* Promo Code & Discount Highlight */}
                  <div className="my-3 p-3 rounded-xl bg-[#090d17] border border-[#1f2638] flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Promo Code</div>
                      <div className="text-lg font-black text-white tracking-wider font-mono">
                        {promo.code}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400 font-medium">Discount</div>
                      <div className="text-base font-black text-blue-400">
                        {promo.discount}
                      </div>
                    </div>
                  </div>

                  {/* Description & Min Purchase */}
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-2">
                    {promo.description}
                  </p>

                  {promo.minPurchase && (
                    <div className="text-[11px] text-slate-400 font-medium mb-1">
                      Min. purchase: <span className="text-slate-200 font-bold">${promo.minPurchase}</span>
                    </div>
                  )}

                  {/* Last verified time */}
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>Last verified: {promo.lastVerified}</span>
                  </div>
                </div>

                {/* Bottom Actions: Copy Code & Shop Retailer */}
                <div className="pt-3 border-t border-[#1a2133] mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleCopyCode(promo, e)}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                      isCopied
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>CODE COPIED!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>COPY CODE</span>
                      </>
                    )}
                  </button>

                  <a
                    href={promo.storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="py-2 px-3 rounded-xl bg-[#182138] hover:bg-[#222d4a] border border-[#2a3754] text-slate-200 hover:text-white text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
                    title={`Shop ${promo.storeName}`}
                  >
                    <span>SHOP {promo.storeName.toUpperCase().split(' ')[0]}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Modal for Restrictions & Verification Proof */}
      {selectedPromoForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0f1422] border border-[#222b3e] rounded-2xl p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedPromoForDetails(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2133]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Store & Discount Header */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#222b3e]">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#0a0d14] border border-[#222b3e] flex items-center justify-center p-1 shrink-0">
                <img
                  src={selectedPromoForDetails.storeLogo}
                  alt={selectedPromoForDetails.storeName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {selectedPromoForDetails.storeName}
                </h2>
                <div className="text-xs text-slate-400">
                  {selectedPromoForDetails.discount}
                </div>
              </div>
            </div>

            {/* Code Box with Copy */}
            <div className="p-4 rounded-xl bg-[#090d17] border border-[#1f2638] flex items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-xs text-slate-400 font-medium">Coupon Code</span>
                <div className="text-xl font-mono font-black text-white tracking-widest">
                  {selectedPromoForDetails.code}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopyCode(selectedPromoForDetails)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                {copiedCodeId === selectedPromoForDetails.id ? (
                  <>
                    <Check className="w-4 h-4 text-blue-300" />
                    <span>COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>COPY CODE</span>
                  </>
                )}
              </button>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Offer Description
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed">
                {selectedPromoForDetails.description}
              </p>
            </div>

            {/* Restrictions */}
            {selectedPromoForDetails.restrictions && (
              <div className="mb-4 p-3 rounded-xl bg-[#141926] border border-[#222b3e]">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Terms & Restrictions
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {selectedPromoForDetails.restrictions}
                </p>
              </div>
            )}

            {/* Verification Proof Info */}
            <div className="mb-5 p-3 rounded-xl bg-blue-950/20 border border-blue-800/30">
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-blue-300">
                  {selectedPromoForDetails.verificationStatus === 'VERIFIED' ? 'Verified Working Code' : 'Unverified Code'}
                </span>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <div>Source: <span className="text-white font-medium">{selectedPromoForDetails.verificationSource.replace(/_/g, ' ')}</span></div>
                {selectedPromoForDetails.verificationEvidence && (
                  <div>Evidence: <span className="text-slate-400">{selectedPromoForDetails.verificationEvidence}</span></div>
                )}
                <div>Last Checked: <span className="text-slate-400">{selectedPromoForDetails.lastVerified}</span></div>
                {selectedPromoForDetails.expirationDate && (
                  <div>Expires: <span className="text-slate-400">{selectedPromoForDetails.expirationDate}</span></div>
                )}
              </div>
            </div>

            {/* External Shop Now Button */}
            <div className="flex items-center gap-2">
              <a
                href={selectedPromoForDetails.storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <span>SHOP ON {selectedPromoForDetails.storeName.toUpperCase()}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Verification Architecture Notice Modal */}
      {showArchNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0f1422] border border-[#222b3e] rounded-2xl p-5 sm:p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowArchNotice(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2133]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[#222b3e]">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Promo Code Verification Architecture</h3>
                <p className="text-xs text-slate-400">Strict transparency on how codes are verified</p>
              </div>
            </div>

            <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>
                The entire purpose of <strong>Snagz Verified Promo Codes</strong> is <strong>trust</strong>. We never fabricate verification timestamps or present unverified community submissions as confirmed.
              </p>
              
              <div className="p-3 rounded-xl bg-[#0b0e17] border border-[#222b3e] space-y-2">
                <div className="font-bold text-white">Current Active Verification Methods:</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-400">
                  <li><strong>Official Retailer Promotion Pages:</strong> Active published coupon codes directly from retailer homepages and member portals.</li>
                  <li><strong>Partner & Affiliate Direct Feeds:</strong> Authorized merchant coupon manifests with approved expiration terms.</li>
                  <li><strong>Verified Weekly Circulars:</strong> Printed & digital store ad promotion codes.</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-800/30">
                <div className="font-bold text-blue-300 mb-1">Continuous Live Headless Checkout Testing Roadmap:</div>
                <p className="text-slate-400 text-[11px]">
                  Automated headless cart validation across 100+ stores requires dedicated headless checkout runners (Playwright/Puppeteer workers), rotating residential proxy infrastructure to prevent bot clearance blocks, and tokenized testing carts. Our pluggable verification pipeline is architected to ingest live validation results seamlessly.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowArchNotice(false)}
              className="mt-5 w-full py-2 rounded-xl bg-[#141926] hover:bg-[#1a2133] border border-[#222b3e] text-xs font-bold text-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
