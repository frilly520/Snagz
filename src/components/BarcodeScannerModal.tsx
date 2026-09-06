import React, { useState } from 'react';
import { X, ScanBarcode, Search, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { db } from '../../server/db';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDeal?: (dealId: string) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onSelectDeal
}) => {
  const [upcQuery, setUpcQuery] = useState('');
  const [activeScan, setActiveScan] = useState(false);
  const [matchedProduct, setMatchedProduct] = useState<any | null>(null);

  if (!isOpen) return null;

  const sampleBarcodes = [
    { upc: '037000184201', name: 'Tide Pods Spring Meadow 81ct', brand: 'Procter & Gamble' },
    { upc: '194253714201', name: 'Apple MacBook Air 13" M3', brand: 'Apple' },
    { upc: '091200482019', name: 'Nike Air Max 90 Sneaker', brand: 'Nike' }
  ];

  const handleLookup = (upc: string) => {
    setActiveScan(true);
    setUpcQuery(upc);
    setTimeout(() => {
      setActiveScan(false);
      if (upc.includes('194253') || upc.toLowerCase().includes('macbook')) {
        setMatchedProduct({
          name: 'Apple MacBook Air 13" M3 Chip (16GB / 512GB)',
          brand: 'Apple',
          upc: upc,
          msrp: 1099.00,
          bestPrice: 835.50,
          bestStore: 'Best Buy',
          availableCoupons: [
            { code: 'PLUSMEMBER50', discount: '$50 Off' },
            { code: 'TECH10EXTRA', discount: '10% Accessory bundle' }
          ],
          cashbackRate: '1.5%',
          dealId: 'deal-bestbuy-macbook'
        });
      } else if (upc.includes('091200') || upc.toLowerCase().includes('nike')) {
        setMatchedProduct({
          name: 'Nike Air Max 90 Classic Running Shoes',
          brand: 'Nike',
          upc: upc,
          msrp: 130.00,
          bestPrice: 70.47,
          bestStore: 'Nike.com',
          availableCoupons: [
            { code: 'AIR25EXTRA', discount: '25% Off Clearance' }
          ],
          cashbackRate: '6.0%',
          dealId: 'deal-nike-airmax'
        });
      } else {
        setMatchedProduct({
          name: 'Tide Pods Laundry Detergent Spring Meadow 81ct',
          brand: 'P&G Tide',
          upc: upc,
          msrp: 21.49,
          bestPrice: 15.49,
          bestStore: 'Target',
          availableCoupons: [
            { code: 'CIRCLE3MFR', discount: '$3 Mfr Coupon' },
            { code: 'TARGETHOUSE10', discount: '10% Off Circle' }
          ],
          cashbackRate: '1.0%',
          dealId: 'deal-target-circle-stack'
        });
      }
    }, 600);
  };

  return (
    <div 
      id="barcode-scanner-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="barcode-scanner-modal"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ScanBarcode className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">In-Store Barcode Scanner</h2>
              <p className="text-xs text-neutral-400">Scan UPC in store to instantly check lowest price & coupons</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder animation representation */}
        <div className="relative mb-5 p-6 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col items-center justify-center overflow-hidden">
          <div className="w-48 h-28 border-2 border-dashed border-emerald-500/60 rounded-xl relative flex items-center justify-center">
            <ScanBarcode className="w-12 h-12 text-emerald-400/80" />
            <div className="absolute inset-x-0 h-0.5 bg-emerald-400/80 shadow-lg shadow-emerald-400 animate-pulse"></div>
          </div>
          <span className="text-xs text-neutral-400 mt-3 font-medium">Ready to scan physical barcode</span>
        </div>

        {/* Quick Sample Barcodes */}
        <div className="mb-4">
          <div className="text-xs text-neutral-400 mb-2 font-medium">Tap a sample product barcode:</div>
          <div className="flex flex-col gap-1.5">
            {sampleBarcodes.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLookup(s.upc)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-xs text-left flex items-center justify-between text-neutral-200 transition-colors"
              >
                <div>
                  <span className="font-semibold block">{s.name}</span>
                  <span className="text-[11px] text-neutral-500 font-mono">UPC: {s.upc}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-500" />
              </button>
            ))}
          </div>
        </div>

        {/* Manual UPC Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={upcQuery}
            onChange={(e) => setUpcQuery(e.target.value)}
            placeholder="Or type 12-digit UPC barcode..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="button"
            disabled={activeScan || !upcQuery.trim()}
            onClick={() => handleLookup(upcQuery)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Check</span>
          </button>
        </div>

        {/* Matched Result */}
        {matchedProduct && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Found In Store Database</span>
              </span>
              <span className="text-[11px] text-neutral-400 font-mono">UPC {matchedProduct.upc}</span>
            </div>

            <h4 className="font-bold text-white text-sm mb-1">{matchedProduct.name}</h4>
            <div className="flex items-baseline gap-3 my-2">
              <span className="text-xs text-neutral-400 line-through font-mono">MSRP: ${matchedProduct.msrp.toFixed(2)}</span>
              <span className="text-base font-extrabold text-emerald-400 font-mono">
                Best Price: ${matchedProduct.bestPrice.toFixed(2)} at {matchedProduct.bestStore}
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-neutral-800 space-y-1">
              <span className="text-neutral-300 font-semibold block">Applicable Coupons & Promos:</span>
              {matchedProduct.availableCoupons.map((c: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-neutral-200">
                  <span className="font-mono text-emerald-300 font-bold">{c.code}</span>
                  <span className="text-emerald-400 font-semibold">{c.discount}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400">
              <span>Cashback: {matchedProduct.cashbackRate} available</span>
              {onSelectDeal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectDeal(matchedProduct.dealId);
                  }}
                  className="text-emerald-400 font-bold hover:underline"
                >
                  View Full Stack Breakdown →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
