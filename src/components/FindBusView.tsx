import React, { useState } from 'react';
import { BusData } from '../types';
import { RouteSearch } from './RouteSearch';
import { CrowdBadge } from './CrowdBadge';
import { 
  Bus, 
  Search, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Users, 
  CheckCircle2, 
  HelpCircle,
  Navigation
} from 'lucide-react';

interface FindBusViewProps {
  buses: BusData[];
  onSelectBus: (bus: BusData) => void;
  onViewMap: (bus: BusData) => void;
}

export const FindBusView: React.FC<FindBusViewProps> = ({
  buses,
  onSelectBus,
  onViewMap,
}) => {
  const [fromQuery, setFromQuery] = useState('Avadi');
  const [toQuery, setToQuery] = useState('Broadway');
  const [hasSearched, setHasSearched] = useState(true);

  const handleSearch = (from: string, to: string) => {
    setFromQuery(from);
    setToQuery(to);
    setHasSearched(true);
  };

  // Match buses where:
  // (bus source/via/stops match 'from') AND (bus destination/via/stops match 'to')
  const matchedBuses = buses.filter((bus) => {
    if (!fromQuery && !toQuery) return true;

    const f = fromQuery.toLowerCase().trim();
    const t = toQuery.toLowerCase().trim();

    const matchesFrom = !f || 
      bus.source.toLowerCase().includes(f) ||
      bus.via.toLowerCase().includes(f) ||
      bus.stops.some((s) => s.name.toLowerCase().includes(f));

    const matchesTo = !t ||
      bus.destination.toLowerCase().includes(t) ||
      bus.via.toLowerCase().includes(t) ||
      bus.stops.some((s) => s.name.toLowerCase().includes(t));

    return matchesFrom && matchesTo;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
          <Navigation className="w-3.5 h-3.5 text-teal-400" />
          <span>Point-to-Point Chennai Transit Search</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Find Your Bus & Check Crowd Level
        </h1>
        <p className="text-sm text-slate-400 font-medium">
          Enter your boarding stop and destination to instantly check arrival times and real-time onboard occupancy.
        </p>
      </div>

      {/* Search Bar Component */}
      <RouteSearch
        onSearch={handleSearch}
        initialFrom={fromQuery}
        initialTo={toQuery}
        isStandalonePage={true}
      />

      {/* Search Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Bus className="w-5 h-5 text-teal-400" />
            <span>Matching Buses ({matchedBuses.length})</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Route: {fromQuery || 'Any'} → {toQuery || 'Any'}
          </span>
        </div>

        {matchedBuses.length > 0 ? (
          <div className="space-y-3.5">
            {matchedBuses.map((bus) => (
              <div
                key={bus.id}
                id={`find-bus-result-${bus.busNumber}`}
                className="bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-5 sm:p-6 transition-all shadow-md shadow-slate-950/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Bus identity & Route */}
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/10 border border-teal-500/40 flex items-center justify-center text-teal-300 font-black text-lg shrink-0">
                    {bus.busNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-extrabold text-white text-base">
                        BUS {bus.busNumber}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        • {bus.route}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-500">Via:</span>
                      <span>{bus.via}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      <span>Current: <strong className="text-slate-300">{bus.currentLocation}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right: ETA, Crowd Status & Action */}
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <div className="text-right">
                    <div className="flex items-center gap-1 font-mono text-xs font-bold text-teal-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                      <Clock className="w-3 h-3 text-teal-400" />
                      <span>ETA {bus.eta}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CrowdBadge status={bus.status} standingCount={bus.standing_count} size="sm" />
                  </div>

                  <button
                    onClick={() => onSelectBus(bus)}
                    className="inline-flex items-center gap-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-sm"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-3">
            <HelpCircle className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-200">No direct buses found on this corridor</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              We couldn't find a direct bus between "{fromQuery}" and "{toQuery}". Try searching for major junctions like Avadi, Ambattur, or Broadway.
            </p>
            <button
              onClick={() => handleSearch('Avadi', 'Broadway')}
              className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 text-xs font-bold hover:bg-teal-400"
            >
              Reset to Avadi → Broadway
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
