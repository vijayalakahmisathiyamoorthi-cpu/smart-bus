import React, { useState } from 'react';
import { MapPin, Navigation, Search, ArrowRightLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { POPULAR_LOCATIONS } from '../constants';

interface RouteSearchProps {
  onSearch: (from: string, to: string) => void;
  initialFrom?: string;
  initialTo?: string;
  isStandalonePage?: boolean;
}

export const RouteSearch: React.FC<RouteSearchProps> = ({
  onSearch,
  initialFrom = 'Avadi',
  initialTo = 'Broadway',
  isStandalonePage = false,
}) => {
  const [fromLocation, setFromLocation] = useState(initialFrom);
  const [toLocation, setToLocation] = useState(initialTo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(fromLocation.trim(), toLocation.trim());
  };

  const handleSwap = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
    onSearch(toLocation.trim(), temp.trim());
  };

  const selectPreset = (from: string, to: string) => {
    setFromLocation(from);
    setToLocation(to);
    onSearch(from, to);
  };

  return (
    <div className={`w-full ${isStandalonePage ? 'max-w-4xl mx-auto' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
      <div 
        id="route-search-card"
        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl shadow-slate-950/70 backdrop-blur-xl relative"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            
            {/* FROM (SOURCE) */}
            <div className="w-full md:flex-1 relative">
              <label 
                htmlFor="input-search-from"
                className="block text-[11px] font-bold uppercase tracking-wider text-teal-400 mb-1.5"
              >
                FROM (SOURCE)
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-teal-400 pointer-events-none">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  id="input-search-from"
                  type="text"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  placeholder="e.g. Avadi, Ambattur..."
                  className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 rounded-xl pl-10 pr-3 py-3 text-sm text-white placeholder-slate-500 font-medium transition-colors"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="pt-0 md:pt-5 shrink-0">
              <button
                type="button"
                id="btn-swap-locations"
                onClick={handleSwap}
                title="Swap source and destination"
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-teal-300 border border-slate-700 transition-colors"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* TO (DESTINATION) */}
            <div className="w-full md:flex-1 relative">
              <label 
                htmlFor="input-search-to"
                className="block text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-1.5"
              >
                TO (DESTINATION)
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-cyan-400 pointer-events-none">
                  <Navigation className="w-4 h-4" />
                </div>
                <input
                  id="input-search-to"
                  type="text"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  placeholder="e.g. Broadway, T Nagar..."
                  className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 rounded-xl pl-10 pr-3 py-3 text-sm text-white placeholder-slate-500 font-medium transition-colors"
                />
              </div>
            </div>

            {/* Find Bus Button */}
            <div className="w-full md:w-auto pt-1 md:pt-5">
              <button
                type="submit"
                id="btn-submit-find-bus"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-slate-950 font-bold px-7 py-3 rounded-xl text-sm tracking-wide shadow-md shadow-teal-500/25 transition-all active:scale-[0.98]"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>Find Bus</span>
              </button>
            </div>

          </div>

          {/* Quick preset corridors */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3 text-teal-400" />
              Popular:
            </span>
            <button
              type="button"
              onClick={() => selectPreset('Avadi', 'Broadway')}
              className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            >
              Avadi → Broadway (70A, 26G)
            </button>
            <button
              type="button"
              onClick={() => selectPreset('Avadi', 'T Nagar')}
              className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            >
              Avadi → T Nagar (65)
            </button>
            <button
              type="button"
              onClick={() => selectPreset('Mandaveli', 'Tambaram')}
              className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            >
              Mandaveli → Tambaram (41D)
            </button>
          </div>
        </form>

        {/* Passenger Privacy Safe Footer */}
        <div 
          id="passenger-privacy-banner"
          className="mt-5 pt-4 border-t border-slate-800/80 flex items-start sm:items-center gap-3 bg-slate-950/40 -mx-5 -mb-5 sm:-mx-7 sm:-mb-7 p-4 sm:px-7 rounded-b-2xl"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 mt-0.5 sm:mt-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-teal-300 mr-2">Passenger Privacy Safe:</span>
            <span className="text-slate-400">
              Onboard YOLO cameras run edge inference and never transmit raw footage or passenger photos.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
