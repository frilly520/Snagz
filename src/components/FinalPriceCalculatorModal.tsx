import React, { useState, useEffect } from 'react';
import { X, Calculator, Layers, Sparkles, DollarSign, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { StackingBreakdown } from '../types';

interface FinalPriceCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrice?: number;
}

export const FinalPriceCalculatorModal: React.FC<FinalPriceCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialPrice = 100
}) => {
  const [originalPrice, setOriginalPrice] = useState<number>(initialPrice);
  const [storeSalePercent, setStoreSalePercent] = useState<number>(20);
  const [storeSaleDollar, setStoreSaleDollar] = useState<number>(0);
  const [couponPercent, setCouponPercent] = useState<number>(15);
  const [couponDollar, setCouponDollar] = useState<number>(0);
  const [mfrCouponDollar, setMfrCouponDollar] = useState<number>(5);
  const [cashbackPercent, setCashbackPercent] = useState<number>(5);
  const [freeShipping, setFreeShipping] = useState<boolean>(true);
  const [shippingCost, setShippingCost] = useState<number>(8.00);

  const [breakdown, setBreakdown] = useState<StackingBreakdown | null>(null);

  // Recalculate on state changes
  useEffect(() => {
    if (!isOpen) return;
    const calculate = async () => {
      try {
        const res = await api.calculateStack({
          originalPrice,
          storeSalePercent,
          storeSaleDollar,
          couponPercent,
          couponDollar,
          mfrCouponDollar,
          cashbackPercent,
          freeShipping,
          shippingCost
        });
        setBreakdown(res);
      } catch (err) {
        console.error('Stack calculation failed:', err);
      }
    };
    calculate();
  }, [
    isOpen,
    originalPrice,
    storeSalePercent,
    storeSaleDollar,
    couponPercent,
    couponDollar,
    mfrCouponDollar,
    cashbackPercent,
    freeShipping,
    shippingCost
  ]);

  if (!isOpen) return null;

  return (
    <div 
      id="final-price-calculator-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="final-price-calculator-modal"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#0f1422] border border-[#222b3e] rounded-2xl p-6 sm:p-7 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[#222b3e]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Final Price & Stacking Calculator</h2>
              <p className="text-xs text-neutral-400">Calculate real out-of-pocket vs effective price across stackable promotions</p>
            </div>
          </div>
          <button
            id="btn-close-calculator"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1a2133] hover:bg-[#252f47] text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Controls */}
          <div className="space-y-4">
            {/* Original Price */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Original Retail Price ($)
              </label>
              <input
                id="input-calc-original-price"
                type="number"
                min="0"
                step="0.01"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0b0e17] border border-[#222b3e] focus:border-blue-500 focus:outline-none text-white font-mono text-base font-bold"
              />
            </div>

            {/* Store Markdown Sale */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">
                  Store Sale (% Off)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={storeSalePercent}
                  onChange={(e) => setStoreSalePercent(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0b0e17] border border-[#222b3e] text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">
                  Or Sale ($ Off)
                </label>
                <input
                  type="number"
                  min="0"
                  value={storeSaleDollar}
                  onChange={(e) => setStoreSaleDollar(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0b0e17] border border-[#222b3e] text-white font-mono text-sm"
                />
              </div>
            </div>

            {/* Store Coupon Code */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">
                  Store Promo Code (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={couponPercent}
                  onChange={(e) => setCouponPercent(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0b0e17] border border-[#222b3e] text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">
                  Or Promo Code ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={couponDollar}
                  onChange={(e) => setCouponDollar(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0b0e17] border border-[#222b3e] text-white font-mono text-sm"
                />
              </div>
            </div>

            {/* Manufacturer Coupon & Cashback */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">
                  Mfr Coupon ($ Off)
                </label>
                <input
                  type="number"
                  min="0"
                  value={mfrCouponDollar}
                  onChange={(e) => setMfrCouponDollar(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0b0e17] border border-[#222b3e] text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">
                  Cashback Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={cashbackPercent}
                  onChange={(e) => setCashbackPercent(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0b0e17] border border-[#222b3e] text-white font-mono text-sm"
                />
              </div>
            </div>

            {/* Free Shipping Checkbox */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0b0e17] border border-[#222b3e] text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={freeShipping}
                  onChange={(e) => setFreeShipping(e.target.checked)}
                  className="rounded border-neutral-700 text-blue-500 focus:ring-blue-500 bg-[#161c2c]"
                />
                <span className="text-neutral-300 font-medium">Free Shipping Applied</span>
              </label>
              <span className="text-neutral-500 font-mono">(saves ${shippingCost.toFixed(2)})</span>
            </div>
          </div>

          {/* Results Summary Box */}
          {breakdown && (
            <div className="flex flex-col justify-between p-5 rounded-2xl bg-[#0b0e17] border border-[#222b3e]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Live Calculation
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    {breakdown.totalSavedPercentage}% Total Saved
                  </span>
                </div>

                <div className="space-y-2.5 text-xs font-mono mb-6">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Original Price</span>
                    <span className="text-white">${breakdown.originalPrice.toFixed(2)}</span>
                  </div>

                  {breakdown.components.map((comp, idx) => (
                    <div key={idx} className="flex items-center justify-between text-neutral-300">
                      <span>{comp.title}</span>
                      <span className="text-blue-400 font-semibold">-${comp.discountAmount.toFixed(2)}</span>
                    </div>
                  ))}

                  {freeShipping && (
                    <div className="flex items-center justify-between text-neutral-300">
                      <span>Standard Shipping Waived</span>
                      <span className="text-blue-400 font-semibold">-${shippingCost.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#222b3e] flex items-center justify-between font-bold text-neutral-200">
                    <span>Actual Checkout Price</span>
                    <span className="text-white font-sans text-sm">${breakdown.actualCheckoutPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Final Effective Highlight Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/60 to-[#0f1422] border border-blue-500/30">
                <span className="text-xs text-blue-400 font-medium block mb-1">
                  Estimated Effective Price (After Cashback Rebates):
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-blue-300 tracking-tight font-sans">
                    ${breakdown.estimatedEffectivePrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    Total Savings: <strong className="text-blue-400 font-sans font-bold">${breakdown.totalSaved.toFixed(2)}</strong>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
