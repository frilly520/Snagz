import React, { useState } from 'react';
import { 
  X, 
  Puzzle, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Layers, 
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

interface ExtensionSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExtensionSimulator: React.FC<ExtensionSimulatorProps> = ({
  isOpen,
  onClose
}) => {
  const [targetUrl, setTargetUrl] = useState('nike.com/cart');
  const [cartAmount, setCartAmount] = useState('130.00');
  const [matchData, setMatchData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [testingCodes, setTestingCodes] = useState(false);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestMatch = async (url: string) => {
    setLoading(true);
    setMatchData(null);
    setAppliedCode(null);
    setTargetUrl(url);
    try {
      const data = await api.matchExtension(url, parseFloat(cartAmount) || 0);
      setMatchData(data);
    } catch (err) {
      console.error('Extension match failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoApply = () => {
    if (!matchData || !matchData.deals) return;
    setTestingCodes(true);
    setTimeout(() => {
      setTestingCodes(false);
      setAppliedCode(matchData.recommendedCode || 'AIR25EXTRA');
    }, 1200);
  };

  return (
    <div 
      id="extension-simulator-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="extension-simulator-modal"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#0f1422] border border-[#222b3e] rounded-2xl p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-5 pb-4 border-b border-[#222b3e]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Puzzle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>SNAGZ Browser Extension</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-500/30">
                  Live Preview
                </span>
              </h2>
              <p className="text-xs text-neutral-400">Test how the 1-click auto-apply extension works on store checkouts</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1a2133] hover:bg-[#252f47] text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick URL presets */}
        <div className="mb-4">
          <span className="text-xs text-neutral-400 block mb-2 font-medium">Simulate checkout on retailer site:</span>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleTestMatch('nike.com/cart')}
              className="px-3 py-1.5 rounded-xl bg-[#0b0e17] hover:bg-[#192138] border border-[#222b3e] text-xs text-neutral-200"
            >
              Nike.com ($130 Cart)
            </button>
            <button
              type="button"
              onClick={() => handleTestMatch('bestbuy.com/checkout')}
              className="px-3 py-1.5 rounded-xl bg-[#0b0e17] hover:bg-[#192138] border border-[#222b3e] text-xs text-neutral-200"
            >
              BestBuy.com ($899 Cart)
            </button>
            <button
              type="button"
              onClick={() => handleTestMatch('target.com/cart')}
              className="px-3 py-1.5 rounded-xl bg-[#0b0e17] hover:bg-[#192138] border border-[#222b3e] text-xs text-neutral-200"
            >
              Target.com ($65 Cart)
            </button>
          </div>
        </div>

        {/* Browser Mock Popup UI */}
        <div className="rounded-2xl bg-[#0b0e17] border border-[#222b3e] overflow-hidden shadow-xl">
          {/* Extension Browser Chrome bar */}
          <div className="px-4 py-2.5 bg-[#141926] border-b border-[#222b3e] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span className="text-neutral-400 font-mono text-[11px] ml-2">https://www.{targetUrl}</span>
            </div>
            <span className="text-[10px] text-blue-400 font-bold">SNAGZ Active</span>
          </div>

          {/* Extension Popup Body */}
          <div className="p-5 space-y-4">
            {loading ? (
              <div className="p-6 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400 animate-spin" />
                <span>Checking store promotions & verified coupons...</span>
              </div>
            ) : matchData ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={matchData.store.logoUrl} 
                      alt="" 
                      className="w-7 h-7 rounded object-contain bg-[#161d2d] p-0.5"
                    />
                    <strong className="text-white text-sm">{matchData.store.name}</strong>
                  </div>
                  <span className="text-xs font-bold text-blue-400 font-mono">
                    +{matchData.cashbackRate}% Cashback Active
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#141926] border border-[#222b3e] text-xs">
                  <div className="flex items-center justify-between text-neutral-300 mb-1">
                    <span>Found {matchData.dealCount} active coupons</span>
                    <span className="text-blue-400 font-bold">Best Code: {matchData.recommendedCode}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Stackable with store sale & automatic cashback rebate.
                  </p>
                </div>

                {appliedCode ? (
                  <div className="mt-3 p-3.5 rounded-xl bg-blue-950/60 border border-blue-500/50 text-xs text-blue-200">
                    <div className="flex items-center gap-2 font-bold mb-1">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      <span>Code "{appliedCode}" Applied Successfully!</span>
                    </div>
                    <p className="text-[11px]">Saved $32.50 on checkout + 6% Cashback tracked.</p>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={testingCodes}
                    onClick={handleAutoApply}
                    className="w-full mt-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-950 transition-all"
                  >
                    {testingCodes ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin text-white" />
                        <span>Testing {matchData.dealCount} coupon codes in cart...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-white" />
                        <span>Auto-Test All Coupons & Apply Best Code</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-neutral-400">
                Tap one of the test store buttons above to simulate automatic coupon detection on checkout.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
