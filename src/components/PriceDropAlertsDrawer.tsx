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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div 
        id="price-drop-alerts-drawer"
        className="w-full max-w-md bg-neutral-900 border-l border-neutral-800 h-full flex flex-col shadow-2xl p-5 overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
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
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
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
                className="group p-4 rounded-xl bg-neutral-950/80 hover:bg-neutral-950 border border-neutral-800 hover:border-amber-500/40 transition-all cursor-pointer shadow-lg"
              >
                {/* Alert Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <TrendingDown className="w-3 h-3" />
                    <span>Price Drop + Coupon Combo</span>
                  </span>
                  <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Active</span>
                  </span>
                </div>

                <h3 className="font-bold text-sm text-neutral-100 group-hover:text-amber-300 transition-colors mb-1.5">
                  {alert.productName}
                </h3>

                <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
                  {alert.description}
                </p>

                {/* Price Journey Equation */}
                <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/80 mb-3 text-xs font-mono space-y-1">
                  <div className="flex justify-between text-neutral-400">
                    <span>Was Previous:</span>
                    <span className="line-through">{formatPrice(alert.previousPrice)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>New Sale Price:</span>
                    <span>{formatPrice(alert.newPrice)}</span>
                  </div>
                  {alert.couponCode && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Code {alert.couponCode}:</span>
                      <span>-{formatPrice(alert.couponSavings)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-amber-400 font-bold pt-1 border-t border-neutral-800">
                    <span>Effective Final:</span>
                    <span className="text-sm">{formatPrice(alert.effectivePrice)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-800/60">
                  <span className="text-neutral-400 font-medium">{alert.storeName}</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Save {formatPrice(alert.totalSaved)}</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Alerts trigger when total checkout price reaches a multi-month low.</span>
        </div>
      </div>
    </div>
  );
};
