import React, { useState } from 'react';
import { X, MapPin, Check, Compass } from 'lucide-react';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: { zip: string; city: string; state: string };
  onSaveLocation: (loc: { zip: string; city: string; state: string }) => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSaveLocation
}) => {
  const [zip, setZip] = useState(currentLocation.zip);
  const [city, setCity] = useState(currentLocation.city);
  const [state, setState] = useState(currentLocation.state);

  if (!isOpen) return null;

  const popularLocations = [
    { zip: '90210', city: 'Beverly Hills', state: 'CA' },
    { zip: '10001', city: 'New York', state: 'NY' },
    { zip: '60601', city: 'Chicago', state: 'IL' },
    { zip: '78701', city: 'Austin', state: 'TX' },
    { zip: '98101', city: 'Seattle', state: 'WA' }
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveLocation({ zip, city, state });
    onClose();
  };

  return (
    <div 
      id="location-picker-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        id="location-picker-modal"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#0f1422] border border-[#222b3e] rounded-2xl p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-[#222b3e]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Set Your Shopping Location</h2>
              <p className="text-xs text-neutral-400">Personalize in-store food deals, grocery flyers & regional sales</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#1a2133] hover:bg-[#252f47] text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleApply} className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <label className="block font-semibold text-neutral-300 mb-1">ZIP Code</label>
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="90210"
                className="w-full px-3 py-2 rounded-xl bg-[#0b0e17] border border-[#222b3e] text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block font-semibold text-neutral-300 mb-1">City, State</label>
              <input
                type="text"
                value={`${city}, ${state}`}
                onChange={(e) => {
                  const parts = e.target.value.split(',');
                  setCity(parts[0]?.trim() || '');
                  setState(parts[1]?.trim() || '');
                }}
                placeholder="Los Angeles, CA"
                className="w-full px-3 py-2 rounded-xl bg-[#0b0e17] border border-[#222b3e] text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <span className="block font-semibold text-neutral-400 mb-2">Or select a metropolitan area:</span>
            <div className="flex flex-wrap gap-1.5">
              {popularLocations.map((loc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setZip(loc.zip);
                    setCity(loc.city);
                    setState(loc.state);
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] transition-colors ${
                    zip === loc.zip
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-bold'
                      : 'bg-[#0b0e17] text-neutral-300 border-[#222b3e] hover:border-neutral-700'
                  }`}
                >
                  {loc.city}, {loc.state} ({loc.zip})
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#222b3e]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#141926] hover:bg-[#1f273b] text-neutral-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
            >
              Save Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
