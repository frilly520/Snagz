import React, { useState } from 'react';
import { 
  Heart, 
  Bookmark, 
  Eye, 
  Bell, 
  Plus, 
  Trash2, 
  Share2, 
  Check, 
  DollarSign, 
  ArrowRight,
  TrendingDown,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { Deal, UserList, ProductWatchlistItem, DealAlert } from '../types';
import { CouponCard } from './CouponCard';
import { ShoppingTripView } from './ShoppingTripView';

interface SavedAndListsProps {
  savedDeals: Deal[];
  userLists: UserList[];
  watchlist: ProductWatchlistItem[];
  alerts: DealAlert[];
  savedDealIds: Set<string>;
  onToggleSaveDeal: (dealId: string) => void;
  onOpenDetails: (deal: Deal) => void;
  onOpenAddToList: (deal: Deal) => void;
  onVote: (dealId: string, type: 'works' | 'doesnt_work') => void;
  onCreateList: (name: string, description?: string) => void;
  onDeleteList: (listId: string) => void;
  onRemoveFromList: (listId: string, dealId: string) => void;
  onAddToWatchlist: (item: { productName: string; targetPrice: number; currentBestPrice: number; bestStore: string }) => void;
  onRemoveFromWatchlist: (id: string) => void;
  onCreateAlert: (params: Partial<DealAlert>) => void;
  onDeleteAlert: (id: string) => void;
  allDeals: Deal[];
}

export const SavedAndLists: React.FC<SavedAndListsProps> = ({
  savedDeals,
  userLists,
  watchlist,
  alerts,
  savedDealIds,
  onToggleSaveDeal,
  onOpenDetails,
  onOpenAddToList,
  onVote,
  onCreateList,
  onDeleteList,
  onRemoveFromList,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  onCreateAlert,
  onDeleteAlert,
  allDeals
}) => {
  const [activeTab, setActiveTab] = useState<'saved' | 'lists' | 'watchlist' | 'alerts' | 'trip'>('saved');

  // List creation state
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');

  // Watchlist creation state
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [watchProdName, setWatchProdName] = useState('');
  const [watchTargetPrice, setWatchTargetPrice] = useState('');
  const [watchCurrentPrice, setWatchCurrentPrice] = useState('');
  const [watchStore, setWatchStore] = useState('Best Buy');

  // Alert creation state
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertQuery, setAlertQuery] = useState('');
  const [alertStore, setAlertStore] = useState('');
  const [alertMinDiscount, setAlertMinDiscount] = useState('');

  const [copiedShare, setCopiedShare] = useState<string | null>(null);

  const handleShareList = (list: UserList) => {
    const shareText = `Check out my "${list.name}" shopping list with ${list.dealIds.length} savings stacks on SNAGZ! Find it. Save it. Snag it.`;
    navigator.clipboard.writeText(shareText);
    setCopiedShare(list.id);
    setTimeout(() => setCopiedShare(null), 2000);
  };

  return (
    <div id="saved-and-lists" className="space-y-6">
      {/* Tab Selector */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-neutral-900 border border-neutral-800 max-w-2xl overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('saved')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'saved'
              ? 'bg-emerald-500 text-neutral-950 shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Saved ({savedDeals.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('lists')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'lists'
              ? 'bg-emerald-500 text-neutral-950 shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Custom Lists ({userLists.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('watchlist')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'watchlist'
              ? 'bg-emerald-500 text-neutral-950 shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Watchlist ({watchlist.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'alerts'
              ? 'bg-emerald-500 text-neutral-950 shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Alerts ({alerts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('trip')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'trip'
              ? 'bg-emerald-500 text-neutral-950 shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Trip Optimizer</span>
        </button>
      </div>

      {/* TAB 1: SAVED DEALS */}
      {activeTab === 'saved' && (
        <div>
          {savedDeals.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-neutral-900/60 border border-neutral-800">
              <Heart className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
              <h3 className="font-bold text-white text-base">No saved deals yet</h3>
              <p className="text-xs text-neutral-400 mt-1">Tap the heart icon on any coupon or deal to keep track of it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedDeals.map((deal) => (
                <CouponCard
                  key={deal.id}
                  deal={deal}
                  isSaved={true}
                  onToggleSave={onToggleSaveDeal}
                  onOpenDetails={onOpenDetails}
                  onOpenAddToList={onOpenAddToList}
                  onVote={onVote}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CUSTOM LISTS */}
      {activeTab === 'lists' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Your Curated Shopping Lists</h2>
            <button
              type="button"
              onClick={() => setShowCreateListModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create New List</span>
            </button>
          </div>

          <div className="space-y-6">
            {userLists.map((list) => {
              const listDeals = allDeals.filter(d => list.dealIds.includes(d.id));
              return (
                <div key={list.id} className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-neutral-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <Bookmark className="w-4 h-4 text-emerald-400" />
                        <h3 className="font-bold text-white text-base">{list.name}</h3>
                        <span className="text-xs text-neutral-500 font-mono">({listDeals.length} items)</span>
                      </div>
                      {list.description && (
                        <p className="text-xs text-neutral-400 mt-1">{list.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleShareList(list)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{copiedShare === list.id ? 'Copied Link!' : 'Share List'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteList(list.id)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-950/60 text-neutral-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {listDeals.length === 0 ? (
                    <div className="p-6 text-center text-xs text-neutral-500">
                      No deals saved to this list yet. Click "+ Add to List" on any deal card.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {listDeals.map((deal) => (
                        <div key={deal.id} className="relative">
                          <CouponCard
                            deal={deal}
                            isSaved={savedDealIds.has(deal.id)}
                            onToggleSave={onToggleSaveDeal}
                            onOpenDetails={onOpenDetails}
                            onOpenAddToList={onOpenAddToList}
                            onVote={onVote}
                          />
                          <button
                            type="button"
                            onClick={() => onRemoveFromList(list.id, deal.id)}
                            title="Remove from this list"
                            className="absolute top-2 right-12 z-10 p-1.5 rounded-lg bg-neutral-950/80 hover:bg-rose-950 text-neutral-400 hover:text-rose-400 border border-neutral-800"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCT WATCHLIST */}
      {activeTab === 'watchlist' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Price Drop Product Watchlist</h2>
            <button
              type="button"
              onClick={() => setShowWatchlistModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Track Product</span>
            </button>
          </div>

          <div className="space-y-3">
            {watchlist.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white text-sm">{item.productName}</h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-neutral-400">
                    <span>Store: <strong className="text-neutral-200">{item.bestStore}</strong></span>
                    <span>• Target Price: <strong className="text-emerald-400 font-mono">${item.targetPrice.toFixed(2)}</strong></span>
                    <span>• Current Best: <strong className="text-white font-mono">${item.currentBestPrice.toFixed(2)}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-medium">
                    {item.activeCouponsCount} Active Promo Codes
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveFromWatchlist(item.id)}
                    className="p-2 rounded-lg bg-neutral-800 hover:bg-rose-950/60 text-neutral-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DEAL ALERTS */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Automated Savings Alerts</h2>
            <button
              type="button"
              onClick={() => setShowAlertModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>New Alert</span>
            </button>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Query: "{alert.query}"</h4>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-400">
                      {alert.targetStore && <span>Store: {alert.targetStore} • </span>}
                      {alert.minDiscountPercent && <span>Min: {alert.minDiscountPercent}% Off • </span>}
                      <span className="text-emerald-400 font-semibold">{alert.matchCount} current matches</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteAlert(alert.id)}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-rose-950/60 text-neutral-400 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: MULTI-STORE TRIP OPTIMIZER */}
      {activeTab === 'trip' && (
        <ShoppingTripView />
      )}

      {/* Modal: Create List */}
      {showCreateListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Create New Shopping List</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">List Name</label>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="e.g. Back to School, Kitchen Refresh"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={newListDesc}
                  onChange={(e) => setNewListDesc(e.target.value)}
                  placeholder="e.g. Tracking coupon stacks for upcoming moves"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateListModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 text-xs hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!newListName.trim()}
                  onClick={() => {
                    onCreateList(newListName, newListDesc);
                    setShowCreateListModal(false);
                    setNewListName('');
                    setNewListDesc('');
                  }}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 text-neutral-950 font-bold text-xs hover:bg-emerald-400"
                >
                  Create List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Track Watchlist Product */}
      {showWatchlistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Track Price Drop on Product</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Product Name</label>
                <input
                  type="text"
                  value={watchProdName}
                  onChange={(e) => setWatchProdName(e.target.value)}
                  placeholder="e.g. Sony WH-1000XM5 Headphones"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Target Price ($)</label>
                  <input
                    type="number"
                    value={watchTargetPrice}
                    onChange={(e) => setWatchTargetPrice(e.target.value)}
                    placeholder="299.00"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Current Price ($)</label>
                  <input
                    type="number"
                    value={watchCurrentPrice}
                    onChange={(e) => setWatchCurrentPrice(e.target.value)}
                    placeholder="348.00"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowWatchlistModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!watchProdName.trim()}
                  onClick={() => {
                    onAddToWatchlist({
                      productName: watchProdName,
                      targetPrice: parseFloat(watchTargetPrice) || 50,
                      currentBestPrice: parseFloat(watchCurrentPrice) || 60,
                      bestStore: watchStore
                    });
                    setShowWatchlistModal(false);
                    setWatchProdName('');
                  }}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 text-neutral-950 font-bold hover:bg-emerald-400"
                >
                  Track Price
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Alert */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Create Automated Deal Alert</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Keyword or Brand</label>
                <input
                  type="text"
                  value={alertQuery}
                  onChange={(e) => setAlertQuery(e.target.value)}
                  placeholder="e.g. Nike Air Max, AirPods Pro, Domino's Pizza"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Store (Optional)</label>
                  <input
                    type="text"
                    value={alertStore}
                    onChange={(e) => setAlertStore(e.target.value)}
                    placeholder="e.g. Target, Best Buy"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Min Discount (%)</label>
                  <input
                    type="number"
                    value={alertMinDiscount}
                    onChange={(e) => setAlertMinDiscount(e.target.value)}
                    placeholder="25"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAlertModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!alertQuery.trim()}
                  onClick={() => {
                    onCreateAlert({
                      query: alertQuery,
                      targetStore: alertStore || undefined,
                      minDiscountPercent: alertMinDiscount ? parseFloat(alertMinDiscount) : undefined
                    });
                    setShowAlertModal(false);
                    setAlertQuery('');
                  }}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 text-neutral-950 font-bold hover:bg-emerald-400"
                >
                  Save Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
