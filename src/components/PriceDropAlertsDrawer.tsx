import React from 'react';
import { 
  Bell, 
  X, 
  TrendingDown, 
  Tag, 
  ExternalLink, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';
import { PriceDropCombinationAlert, SupportedCurrency } from '../types';

interface PriceDropAlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: PriceDropCombinationAlert[];
  currency?: SupportedCurrency;
  onSelectDeal?: (dealId: string) => void;
}

export const PriceDropAlertsDrawer: React.FC<PriceDropAlertsDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  currency = 'USD',
  onSelectDeal
}) => {
  if (!isOpen) return null;

  const formatPrice = (val: number) => {
    const symbol = currency === 'CAD' ? 'C$' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${val.toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div 
        id="price-drop-alerts-drawer"
        className="w-full max-w-md bg-[#0f1422] border-l border-[#222b3e] h-full flex flex-col shadow-2xl p-5 overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222b3e] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Price Drop + Coupon Alerts</h2>
              <p className="text-xs text-neutral-400">Combined effective discount triggers</p>
            </div>
          </div>
          <button
            id="btn-close-alerts-drawer"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1a2133] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="space-y-4 flex-1">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-sm">
              No active price drop triggers right now. We monitor products 24/7.
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => onSelectDeal && onSelectDeal(alert.dealId)}
                className="group p-4 rounded-xl bg-[#0b0e17] hover:bg-[#141926] border border-[#222b3e] hover:border-blue-500/40 transition-all cursor-pointer shadow-lg"
              >
                {/* Alert Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    <TrendingDown className="w-3 h-3" />
                    <span>Price Drop + Coupon Combo</span>
                  </span>
                  <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Active</span>
                  </span>
                </div>

                <h3 className="font-bold text-sm text-neutral-100 group-hover:text-blue-300 transition-colors mb-1.5">
                  {alert.productName}
                </h3>

                <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
                  {alert.description}
                </p>

                {/* Price Journey Equation */}
                <div className="p-2.5 rounded-lg bg-[#07090f] border border-[#222b3e]/80 mb-3 text-xs font-mono space-y-1">
                  <div className="flex justify-between text-neutral-400">
                    <span>Was Previous:</span>
                    <span className="line-through">{formatPrice(alert.previousPrice)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>New Sale Price:</span>
                    <span>{formatPrice(alert.newPrice)}</span>
                  </div>
                  {alert.couponCode && (
                    <div className="flex justify-between text-blue-400 font-semibold">
                      <span>Code {alert.couponCode}:</span>
                      <span>-{formatPrice(alert.couponSavings)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-blue-300 font-bold pt-1 border-t border-[#222b3e]">
                    <span>Effective Final:</span>
                    <span className="text-sm">{formatPrice(alert.effectivePrice)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#222b3e]/60">
                  <span className="text-neutral-400 font-medium">{alert.storeName}</span>
                  <span className="text-blue-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Save {formatPrice(alert.totalSaved)}</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-[#222b3e] text-[11px] text-neutral-400 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>Alerts trigger when total checkout price reaches a multi-month low.</span>
        </div>
      </div>
    </div>
  );
};
