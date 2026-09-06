import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  Camera, 
  Sparkles, 
  DollarSign, 
  CheckCircle2, 
  FileText, 
  ArrowRight,
  AlertCircle,
  Clock,
  Gift
} from 'lucide-react';
import { api } from '../services/api';
import { ReceiptScanResult } from '../types';

interface ReceiptScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptScannerModal: React.FC<ReceiptScannerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [receiptText, setReceiptText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ReceiptScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const sampleReceipt1 = `TARGET SUPERCENTER #1842
08/30/2026 14:22
--------------------------------
1 TIDE PODS SPRING MEADOW 81CT      $21.49 T
1 BOUNTY SELECT-A-SIZE 6PK         $18.99 T
1 CREST PRO-HEALTH 3PK             $10.49 T
1 GOOD & GATHER SPRING MIX 16OZ     $5.49
1 CHOBANI GREEK YOGURT 4PK          $4.99
--------------------------------
SUBTOTAL                            $61.45
TAX (8.25%)                          $5.07
TOTAL                               $68.42
VISA ENDING 4092                    $68.42`;

  const sampleReceipt2 = `BEST BUY STORE #0412
08/29/2026 18:05
--------------------------------
1 APPLE MACBOOK AIR 13" M3         $1099.00 T
1 ANKER 65W USB-C FAST CHARGER      $39.99 T
1 LOGITECH MX MASTER 3S MOUSE       $99.99 T
--------------------------------
SUBTOTAL                           $1238.98
TAX (7.5%)                           $92.92
TOTAL                              $1331.90`;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const cleanBase64 = base64.split(',')[1];
      performScan({ imageBase64: cleanBase64, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  };

  const performScan = async (payload: { imageBase64?: string; receiptText?: string; mimeType?: string }) => {
    setIsScanning(true);
    setError(null);
    try {
      const result = await api.scanReceipt(payload);
      setScanResult(result);
    } catch (err: any) {
      console.error('Receipt scan failed:', err);
      setError(err.message || 'Failed to scan receipt');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div 
      id="receipt-scanner-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="receipt-scanner-modal"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-7 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>AI Receipt Scanner & Savings Finder</span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </h2>
              <p className="text-xs text-neutral-400">
                Scan past receipts to detect missed digital coupons, manufacturer discounts, and cash rebates
              </p>
            </div>
          </div>
          <button
            id="btn-close-receipt-scanner"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload or Text Input Section */}
        {!scanResult && (
          <div className="space-y-4">
            {/* File drop area */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-700 hover:border-emerald-500/60 rounded-2xl p-6 bg-neutral-950/60 hover:bg-neutral-950 cursor-pointer transition-all">
              <UploadCloud className="w-10 h-10 text-emerald-400 mb-2 animate-pulse" />
              <span className="font-bold text-sm text-neutral-200">Upload Receipt Photo (PNG, JPG)</span>
              <span className="text-xs text-neutral-500 mt-1">Our AI extracts store line items and cross-references active rebates</span>
              <input
                id="receipt-file-input"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Presets */}
            <div>
              <div className="text-xs text-neutral-400 mb-2 font-medium">Or test with a sample store receipt:</div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setReceiptText(sampleReceipt1)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 border border-neutral-700 flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Target Grocery & Household</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReceiptText(sampleReceipt2)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 border border-neutral-700 flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                  <span>Best Buy Electronics</span>
                </button>
              </div>
            </div>

            {/* Manual text area */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Receipt Text / OCR Stream
              </label>
              <textarea
                id="receipt-text-input"
                rows={5}
                value={receiptText}
                onChange={(e) => setReceiptText(e.target.value)}
                placeholder="Paste printed receipt text, items, and totals here..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-200 placeholder-neutral-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              id="btn-perform-receipt-scan"
              type="button"
              disabled={isScanning || (!receiptText.trim())}
              onClick={() => performScan({ receiptText })}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950"
            >
              {isScanning ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-neutral-950" />
                  <span>Analyzing Receipt Line Items & Coupons...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-neutral-950" />
                  <span>Analyze Receipt & Calculate Missed Savings</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Scan Results View */}
        {scanResult && (
          <div className="space-y-5">
            {/* Banner summary */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-neutral-950 border border-emerald-500/40">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Audit Complete • {scanResult.storeName}</span>
                </span>
                <span className="text-xs text-neutral-400 font-mono">Date: {scanResult.receiptDate}</span>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div>
                  <span className="text-xs text-neutral-400 block">Total Spent:</span>
                  <span className="text-lg font-bold text-white font-mono">${scanResult.totalPaid.toFixed(2)}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-emerald-300 font-semibold block">Available / Missed Savings:</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">+${scanResult.totalPotentialSavings.toFixed(2)}</span>
                </div>
              </div>
              <p className="text-xs text-neutral-300 mt-3 pt-3 border-t border-neutral-800 leading-relaxed">
                {scanResult.summary}
              </p>
            </div>

            {/* Line Items List with Missed Deals */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Parsed Line Items & Coupon Matches
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {scanResult.lineItems.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-200">{item.name}</span>
                      <span className="font-mono text-white">${item.price.toFixed(2)}</span>
                    </div>
                    {item.missedDeal ? (
                      <div className="mt-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-[11px] text-emerald-300">
                        <span className="flex items-center gap-1">
                          <Gift className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{item.missedDeal.title}</span>
                        </span>
                        <span className="font-bold text-emerald-400 font-mono">Save ${item.missedDeal.savings.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-neutral-500 block mt-1">No missed discounts on this item</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Rebate Opportunities */}
            {scanResult.rebateOpportunities && scanResult.rebateOpportunities.length > 0 && (
              <div className="p-4 rounded-xl bg-neutral-950 border border-sky-500/30">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  <span>Claimable Post-Purchase Cash Rebates</span>
                </h4>
                <div className="space-y-2">
                  {scanResult.rebateOpportunities.map((rebate, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-3 text-xs">
                      <div>
                        <strong className="text-white block">{rebate.title}</strong>
                        <p className="text-neutral-400 text-[11px] mt-0.5">{rebate.instructions}</p>
                      </div>
                      <span className="font-mono font-bold text-sky-300 bg-sky-950/60 px-2 py-1 rounded border border-sky-700/50 shrink-0">
                        +${rebate.amount.toFixed(2)} Cash
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setScanResult(null);
                setReceiptText('');
              }}
              className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition-colors"
            >
              Scan Another Receipt
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
