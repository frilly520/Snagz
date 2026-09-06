import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Store as StoreIcon, 
  MapPin, 
  Clock, 
  TrendingDown, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ArrowRight, 
  Split, 
  Navigation, 
  DollarSign,
  Layers,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { ShoppingTripPlan, ShoppingTripItem } from '../types';

interface ShoppingTripViewProps {
  onBackToDeals?: () => void;
}

export const ShoppingTripView: React.FC<ShoppingTripViewProps> = ({ onBackToDeals }) => {
  const [items, setItems] = useState<string[]>([
    'Milk',
    'Eggs',
    'Chicken Breast',
    'Breakfast Cereal',
    'Toothpaste'
  ]);
  const [newItemInput, setNewItemInput] = useState('');
  const [optimizationMode, setOptimizationMode] = useState<'MAXIMUM_SAVINGS' | 'MINIMUM_TRAVEL'>('MAXIMUM_SAVINGS');
  const [plan, setPlan] = useState<ShoppingTripPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedPlan, setCopiedPlan] = useState(false);

  // Suggestions for fast addition
  const quickSuggestions = [
    'Laundry Detergent',
    'Coffee Beans',
    'Paper Towels',
    'Diapers',
    'Olive Oil',
    'Greek Yogurt'
  ];

  const handleAddItem = (name: string) => {
    if (!name.trim()) return;
    if (!items.includes(name.trim())) {
      setItems([...items, name.trim()]);
    }
    setNewItemInput('');
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const runOptimization = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const res = await api.optimizeShoppingTrip({
        items,
        mode: optimizationMode
      });
      setPlan(res);
    } catch (err) {
      console.error('Optimization error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runOptimization();
  }, [items, optimizationMode]);

  const handleCopyPlan = () => {
    if (!plan) return;
    const text = `🛒 SNAGZ Smart Shopping Plan:\n\n` +
      `Option 1: Single Store (${plan.oneStoreOption.storeName}) - Total: $${plan.oneStoreOption.totalPrice.toFixed(2)} (Save $${plan.oneStoreOption.estimatedSavings.toFixed(2)})\n\n` +
      `Option 2: Multi-Store Split - Total: $${plan.multiStoreOption.totalPrice.toFixed(2)} (Save $${plan.multiStoreOption.estimatedSavings.toFixed(2)})\n` +
      `Additional savings: $${plan.multiStoreOption.additionalSavingsVsOneStore.toFixed(2)} for ${plan.multiStoreOption.additionalDistanceMiles} extra miles.`;
    navigator.clipboard.writeText(text);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2000);
  };

  return (
    <div id="shopping-trip-view" className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Multi-Store Cart Optimizer</span>
            </span>
            <span className="text-xs text-neutral-400">Smart Trip Routing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Shopping Trip & Cart Optimization
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Compare single-store shopping versus splitting your basket across optimal nearby merchants to maximize savings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {plan && (
            <button
              id="btn-copy-shopping-plan"
              type="button"
              onClick={handleCopyPlan}
              className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-neutral-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              {copiedPlan ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPlan ? 'Plan Copied!' : 'Copy Plan'}</span>
            </button>
          )}
          {onBackToDeals && (
            <button
              type="button"
              onClick={onBackToDeals}
              className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-colors"
            >
              Back to Deals
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Basket Items Manager */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
              <span>Your Shopping List ({items.length})</span>
              <button
                type="button"
                onClick={() => setItems([])}
                className="text-xs text-neutral-500 hover:text-rose-400 font-normal transition-colors"
              >
                Clear all
              </button>
            </h2>

            {/* Input to Add Item */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleAddItem(newItemInput);
              }}
              className="flex items-center gap-2 mb-4"
            >
              <input
                id="input-add-shopping-item"
                type="text"
                value={newItemInput}
                onChange={(e) => setNewItemInput(e.target.value)}
                placeholder="Add item (e.g. Milk, Tide Pods)..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                id="btn-submit-add-item"
                type="submit"
                className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shrink-0 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Suggestions Chips */}
            <div className="mb-4">
              <span className="text-[10px] uppercase font-mono text-neutral-500 block mb-1.5">Quick Add:</span>
              <div className="flex flex-wrap gap-1.5">
                {quickSuggestions.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => handleAddItem(sug)}
                    className="px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-neutral-300 transition-colors"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Item List */}
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs text-neutral-200"
                >
                  <span className="font-medium">{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1 text-neutral-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {items.length === 0 && (
                <p className="text-center text-xs text-neutral-500 py-6">
                  Your shopping list is empty. Add items above to compute the optimal multi-store savings!
                </p>
              )}
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
            <h3 className="text-xs font-bold text-neutral-300 mb-2">Trip Preference</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOptimizationMode('MAXIMUM_SAVINGS')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  optimizationMode === 'MAXIMUM_SAVINGS'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Maximum Savings</span>
                <span className="text-[10px] font-normal text-neutral-500">Split to save most</span>
              </button>

              <button
                type="button"
                onClick={() => setOptimizationMode('MINIMUM_TRAVEL')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  optimizationMode === 'MINIMUM_TRAVEL'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <Navigation className="w-4 h-4 text-sky-400" />
                <span>Minimum Travel</span>
                <span className="text-[10px] font-normal text-neutral-500">Single convenient stop</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Plans */}
        <div className="lg:col-span-7 space-y-4">
          {loading ? (
            <div className="p-12 text-center bg-neutral-900 border border-neutral-800 rounded-2xl">
              <RefreshCw className="w-6 h-6 animate-spin text-emerald-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-white">Analyzing store feeds and coupon combinations...</p>
            </div>
          ) : plan ? (
            <div className="space-y-4">
              {/* Comparison Summary Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    Basket Optimization Result
                  </h3>
                  <span className="text-xs text-emerald-400 font-mono font-bold">
                    +${plan.multiStoreOption.additionalSavingsVsOneStore.toFixed(2)} Extra Savings Split
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                    <span className="text-[11px] text-neutral-400 block">Single-Store Total</span>
                    <span className="text-xl font-bold text-white font-mono">
                      ${plan.oneStoreOption.totalPrice.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-neutral-500 block mt-0.5">
                      {plan.oneStoreOption.distanceMiles} miles travel
                    </span>
                  </div>

                  <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/30">
                    <span className="text-[11px] text-emerald-300 block">Optimal Split Total</span>
                    <span className="text-xl font-black text-emerald-400 font-mono">
                      ${plan.multiStoreOption.totalPrice.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-emerald-400 block mt-0.5 font-bold">
                      Save ${plan.multiStoreOption.estimatedSavings.toFixed(2)} total
                    </span>
                  </div>
                </div>
              </div>

              {/* OPTION 1: Multi-Store Split Plan */}
              <div className="p-5 rounded-2xl bg-neutral-900 border-2 border-emerald-500/60 shadow-xl shadow-emerald-950/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500 text-neutral-950 uppercase tracking-wider">
                      Recommended
                    </span>
                    <h3 className="text-sm font-bold text-white">Multi-Store Split Trip</h3>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">
                    {plan.multiStoreOption.stores.length} Stops • ~{plan.multiStoreOption.estimatedTravelTimeMin} mins
                  </span>
                </div>

                <div className="space-y-3">
                  {plan.multiStoreOption.stores.map((store, sIdx) => (
                    <div key={sIdx} className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center justify-center">
                            {sIdx + 1}
                          </span>
                          <span className="font-bold text-white">{store.storeName}</span>
                          <span className="text-neutral-500 text-[11px]">({store.itemCount} items)</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-400">${store.totalPrice.toFixed(2)}</span>
                      </div>

                      <div className="space-y-1.5 pl-7 border-l border-neutral-800 my-2">
                        {store.items.map((item, iIdx) => (
                          <div key={iIdx} className="flex items-center justify-between text-neutral-300">
                            <span>{item.itemName}</span>
                            <div className="flex items-center gap-2">
                              {item.couponTitle && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-mono">
                                  {item.dealCode || 'Coupon'}
                                </span>
                              )}
                              <span className="font-mono text-white">${item.price.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* OPTION 2: Single Store Option */}
              <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-neutral-300">Single-Store Direct Trip</h4>
                  <span className="font-mono font-bold text-white">${plan.oneStoreOption.totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-neutral-400 mb-2">
                  Buy all {plan.oneStoreOption.itemCount} items at {plan.oneStoreOption.storeName} in a single trip ({plan.oneStoreOption.distanceMiles} miles).
                </p>
                <div className="text-[11px] text-neutral-500">
                  Trade-off: Pay ${plan.multiStoreOption.additionalSavingsVsOneStore.toFixed(2)} more for the convenience of 1 store stop.
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
