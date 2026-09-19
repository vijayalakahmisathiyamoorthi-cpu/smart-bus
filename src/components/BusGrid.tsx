import React, { useState } from 'react';
import { BusData, CrowdStatus } from '../types';
import { BusCard } from './BusCard';
import { Bus, Filter, Radio } from 'lucide-react';

interface BusGridProps {
  buses: BusData[];
  onSelectBus: (bus: BusData) => void;
  onViewMap?: (bus: BusData) => void;
  filteredRouteNotice?: string | null;
  onClearFilter?: () => void;
}

export const BusGrid: React.FC<BusGridProps> = ({
  buses,
  onSelectBus,
  onViewMap,
  filteredRouteNotice,
  onClearFilter,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | CrowdStatus>('All');

  const filterOptions: Array<{ id: 'All' | CrowdStatus; label: string; count: number }> = [
    { id: 'All', label: 'All Buses', count: buses.length },
    {
      id: 'Less Crowded',
      label: 'Less Crowded',
      count: buses.filter((b) => b.status === 'Less Crowded').length,
    },
    {
      id: 'Crowded',
      label: 'Crowded',
      count: buses.filter((b) => b.status === 'Crowded').length,
    },
    {
      id: 'Overcrowded',
      label: 'Overcrowded',
      count: buses.filter((b) => b.status === 'Overcrowded').length,
    },
  ];

  const displayedBuses = buses.filter((bus) => {
    if (selectedFilter === 'All') return true;
    return bus.status === selectedFilter;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Live Buses
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              {buses.length} active
            </span>
          </div>
          <p className="text-sm text-slate-400 font-medium">
            Real-time crowd status
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {filterOptions.map((opt) => {
            const isActive = selectedFilter === opt.id;
            let activeStyles = 'bg-teal-500 text-slate-950 font-bold border-teal-400 shadow-sm shadow-teal-500/20';
            if (isActive && opt.id === 'Crowded') {
              activeStyles = 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm shadow-amber-500/20';
            } else if (isActive && opt.id === 'Overcrowded') {
              activeStyles = 'bg-rose-500 text-white font-bold border-rose-400 shadow-sm shadow-rose-500/20';
            } else if (isActive && opt.id === 'Less Crowded') {
              activeStyles = 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-sm shadow-emerald-500/20';
            }

            return (
              <button
                key={opt.id}
                id={`filter-${opt.id.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedFilter(opt.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs tracking-wide border transition-all ${
                  isActive
                    ? activeStyles
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                    isActive ? 'bg-black/20 text-current' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {opt.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter notification if filtered by route */}
      {filteredRouteNotice && (
        <div className="mb-6 p-3.5 rounded-xl bg-teal-950/40 border border-teal-500/30 flex items-center justify-between text-xs text-teal-200">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-teal-400" />
            <span>{filteredRouteNotice}</span>
          </div>
          {onClearFilter && (
            <button
              onClick={onClearFilter}
              className="text-xs font-bold text-teal-300 hover:underline ml-2"
            >
              Show all buses
            </button>
          )}
        </div>
      )}

      {/* Grid of Buses */}
      {displayedBuses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {displayedBuses.map((bus) => (
            <BusCard
              key={bus.id}
              bus={bus}
              onSelect={onSelectBus}
              onViewMap={onViewMap}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8">
          <Bus className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-200 mb-1">No buses match the filter</h3>
          <p className="text-xs text-slate-400 mb-4">
            Try choosing a different crowd category or clearing your search.
          </p>
          <button
            onClick={() => {
              setSelectedFilter('All');
              if (onClearFilter) onClearFilter();
            }}
            className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 text-xs font-bold hover:bg-teal-400 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
