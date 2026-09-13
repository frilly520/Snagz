import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  X, 
  Globe, 
  MapPin, 
  Bell, 
  Trash2, 
  Check, 
  EyeOff, 
  Smartphone,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { UserPrivacySettings, SupportedCurrency } from '../types';
import { api } from '../services/api';
import { SnagzLogo } from './SnagzLogo';

interface PrivacyAndSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: SupportedCurrency;
  onCurrencyChange: (currency: SupportedCurrency) => void;
}

export const PrivacyAndSettingsModal: React.FC<PrivacyAndSettingsModalProps> = ({
  isOpen,
  onClose,
  currency,
  onCurrencyChange
}) => {
  const [settings, setSettings] = useState<UserPrivacySettings>({
    allowPersonalization: true,
    allowLocationDeals: true,
    allowPushNotifications: true,
    notificationFrequency: 'realtime',
    currency: currency || 'USD',
    enableOfflineCache: true
  });
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<{ configured: boolean; mode: string; keyProtection: string; status: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      api.getPrivacySettings()
        .then((res) => {
          if (res.settings) setSettings(res.settings);
          if (res.searchHistory) setSearchHistory(res.searchHistory);
        })
        .catch(console.error);

      api.getAiStatus()
        .then((res) => {
          if (res) setAiStatus(res);
        })
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggle = (key: keyof UserPrivacySettings) => {
    const updated = {
      ...settings,
      [key]: !settings[key]
    };
    setSettings(updated);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.updatePrivacySettings(settings);
      onCurrencyChange(settings.currency);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await api.clearSearchHistory();
      setSearchHistory([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePurgeAll = async () => {
    if (window.confirm('Are you sure you want to purge all your personal lists, watchlists, search history, and saved data?')) {
      try {
        await api.purgeUserData();
        setSearchHistory([]);
        alert('All personal data has been erased.');
        onClose();
        window.location.reload();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div 
        id="privacy-and-settings-modal"
        className="w-full max-w-lg bg-[#0f1422] border border-[#222b3e] rounded-2xl p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <button
          id="btn-close-privacy-modal"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1a2133] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-[#222b3e]">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Privacy, Currency & Settings</h2>
            <p className="text-xs text-neutral-400">User control, zero-tracking transparency, and localization</p>
          </div>
        </div>

        {/* Currency Switcher */}
        <div className="mb-5 p-3.5 rounded-xl bg-[#0b0e17] border border-[#222b3e]">
          <label className="block text-xs font-bold text-neutral-200 mb-2 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-blue-400" />
            <span>Display Currency</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { code: 'USD', label: 'USD ($)', country: 'United States' },
              { code: 'CAD', label: 'CAD (C$)', country: 'Canada' },
              { code: 'GBP', label: 'GBP (£)', country: 'United Kingdom' },
              { code: 'EUR', label: 'EUR (€)', country: 'Eurozone' }
            ].map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => setSettings({ ...settings, currency: c.code as SupportedCurrency })}
                className={`py-2 px-2 text-center rounded-lg border text-xs font-bold transition-all ${
                  settings.currency === c.code 
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/50' 
                    : 'bg-[#141926] text-neutral-400 border-[#222b3e] hover:bg-[#1f273b]'
                }`}
              >
                <div>{c.code}</div>
                <div className="text-[10px] font-normal text-neutral-500">{c.country}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Privacy Toggles */}
        <div className="space-y-3 mb-5">
          <div className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
            Data & Personalization Controls
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0b0e17] border border-[#222b3e]/80">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Personalized Deal Feed</span>
              </div>
              <div className="text-[11px] text-neutral-400">
                Tailor recommended deals based on categories and stores you browse.
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('allowPersonalization')}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.allowPersonalization ? 'bg-blue-600' : 'bg-[#1c2336]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                settings.allowPersonalization ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0b0e17] border border-[#222b3e]/80">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Local & Regional Store Deals</span>
              </div>
              <div className="text-[11px] text-neutral-400">
                Include in-store circular specials matching your postal code.
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('allowLocationDeals')}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.allowLocationDeals ? 'bg-blue-600' : 'bg-[#1c2336]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                settings.allowLocationDeals ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0b0e17] border border-[#222b3e]/80">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                <span>Offline Data Cache</span>
              </div>
              <div className="text-[11px] text-neutral-400">
                Cache your bookmarked coupons and saved lists for offline checkout.
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('enableOfflineCache')}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.enableOfflineCache ? 'bg-blue-600' : 'bg-[#1c2336]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                settings.enableOfflineCache ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>
        </div>

        {/* Search History Management */}
        <div className="mb-5 p-3.5 rounded-xl bg-[#0b0e17] border border-[#222b3e]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-200">Recent Search History</span>
            {searchHistory.length > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear History</span>
              </button>
            )}
          </div>
          {searchHistory.length === 0 ? (
            <div className="text-xs text-neutral-500">No search history stored.</div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {searchHistory.map((item, idx) => (
                <span key={idx} className="text-xs px-2 py-0.5 rounded bg-[#141926] border border-[#222b3e] text-neutral-300">
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* AI & API Key Protection Status Card */}
        <div className="mb-5 p-4 rounded-xl bg-[#0b0e17] border border-[#222b3e] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-white">AI Deal Engine & API Key Security</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">
              <Check className="w-3 h-3 text-blue-400" />
              SERVER-SIDE PROTECTED
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
            <div className="p-2.5 rounded-lg bg-[#141926] border border-[#222b3e]/80">
              <div className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">Client Privacy</div>
              <div className="text-neutral-200 font-bold mt-0.5 flex items-center gap-1.5">
                <EyeOff className="w-3.5 h-3.5 text-blue-400" />
                <span>Zero Browser Exposure</span>
              </div>
              <p className="text-[10px] text-neutral-400 mt-1 leading-snug">
                Keys remain isolated on the Express backend container. Visitors cannot view or inspect credentials.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-[#141926] border border-[#222b3e]/80">
              <div className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">Engine Status</div>
              <div className="text-neutral-200 font-bold mt-0.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>{aiStatus?.configured ? 'Active Gemini Model' : 'Active Server Intelligence'}</span>
              </div>
              <p className="text-[10px] text-neutral-400 mt-1 leading-snug">
                {aiStatus?.status || 'All queries routed via backend proxy'}
              </p>
            </div>
          </div>
        </div>

        {/* About SNAGZ Section */}
        <div className="mb-5 p-4 rounded-xl bg-[#0b0e17] border border-[#222b3e] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SnagzLogo variant="symbol" size="md" />
            <div>
              <div className="text-sm font-black text-white">SNAG<span className="text-blue-400">Z</span></div>
              <div className="text-[10px] font-bold text-blue-400 tracking-wider uppercase">Find it. Save it. Snag it.</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Version 2.0.0 • Verified Real-Time Deal Intelligence</div>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30">
            PWA READY
          </span>
        </div>

        {/* Danger Zone: Purge All */}
        <div className="mb-6 pt-3 border-t border-[#222b3e] flex items-center justify-between text-xs">
          <span className="text-neutral-400">Erase all saved lists and stored preferences:</span>
          <button
            type="button"
            onClick={handlePurgeAll}
            className="px-3 py-1.5 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-800/40 hover:bg-rose-900 font-semibold"
          >
            Purge All Data
          </button>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#222b3e]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#141926] hover:bg-[#1f273b] text-neutral-300 font-semibold text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            id="btn-save-privacy-settings"
            type="button"
            disabled={loading}
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Preferences</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
