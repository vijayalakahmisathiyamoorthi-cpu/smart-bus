import React from 'react';
import { BusData } from '../types';
import { CrowdBadge } from './CrowdBadge';
import { 
  Clock, 
  MapPin, 
  Gauge, 
  ArrowRight, 
  Users, 
  Navigation2,
  Radio
} from 'lucide-react';

interface BusCardProps {
  bus: BusData;
  onSelect: (bus: BusData) => void;
  onViewMap?: (bus: BusData) => void;
}

export const BusCard: React.FC<BusCardProps> = ({ bus, onSelect, onViewMap }) => {
  // Border accent based on crowd status
  let borderHover = 'hover:border-teal-500/50';
  let badgeAccent = 'from-teal-500/20 to-cyan-500/10 text-teal-300 border-teal-500/30';
  
  if (bus.status === 'Crowded') {
    borderHover = 'hover:border-amber-500/50';
    badgeAccent = 'from-amber-500/20 to-orange-500/10 text-amber-300 border-amber-500/30';
  } else if (bus.status === 'Overcrowded') {
    borderHover = 'hover:border-rose-500/50';
    badgeAccent = 'from-rose-500/20 to-red-500/10 text-rose-300 border-rose-500/30';
  } else if (bus.status === 'Less Crowded') {
    borderHover = 'hover:border-emerald-500/50';
    badgeAccent = 'from-emerald-500/20 to-teal-500/10 text-emerald-300 border-emerald-500/30';
  }

  return (
    <div
      id={`bus-card-${bus.busNumber}`}
      className={`group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 transition-all duration-200 shadow-lg shadow-slate-950/60 backdrop-blur-md flex flex-col justify-between ${borderHover}`}
    >
      {/* Top Header: Bus Number, ETA & Live Crowd Badge */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div 
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${badgeAccent} border flex items-center justify-center font-black text-xl tracking-tight shrink-0 shadow-sm`}
            >
              {bus.busNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase text-slate-400">
                  MTC EXPRESS
                </span>
                <span className="flex items-center gap-1 text-[10px] text-teal-400 font-mono">
                  <Radio className="w-2.5 h-2.5 animate-pulse" />
                  LIVE
                </span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                BUS {bus.busNumber}
              </h3>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1 text-xs font-bold text-teal-300 bg-slate-950/90 px-2.5 py-1 rounded-lg border border-slate-800">
              <Clock className="w-3 h-3 text-teal-400" />
              <span>ETA {bus.eta}</span>
            </div>
          </div>
        </div>

        {/* Prominent Crowd Status & Standing Count */}
        <div className="flex flex-wrap items-center justify-between gap-2 my-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <div className="flex items-center gap-2">
            <CrowdBadge status={bus.status} size="sm" />
          </div>
          {typeof bus.standing_count === 'number' && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 font-mono bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800">
              <Users className="w-3.5 h-3.5 text-teal-400" />
              <span>{bus.standing_count} standing</span>
            </div>
          )}
        </div>

        {/* Route Info */}
        <div className="space-y-2 my-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Navigation2 className="w-4 h-4 text-teal-400 shrink-0 rotate-45" />
            <span className="truncate">{bus.route}</span>
          </div>

          <div className="text-xs text-slate-400 pl-6 space-y-1">
            <p className="truncate">
              <span className="text-slate-500 font-medium">Via: </span>
              {bus.via}
            </p>
            <p className="truncate flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="text-slate-500">Location:</span> {bus.currentLocation}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Metrics & Action */}
      <div className="pt-3 border-t border-slate-800/80 mt-2 space-y-3">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <Gauge className="w-3 h-3 text-cyan-400" />
            <span>Speed: <strong className="text-slate-200">{bus.speed}</strong></span>
          </span>
          <span>Updated: <strong className="text-slate-300">{bus.lastUpdated}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id={`btn-view-details-${bus.busNumber}`}
            onClick={() => onSelect(bus)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-slate-200 text-xs font-bold py-2.5 px-3 rounded-xl border border-slate-700/80 hover:border-teal-400 transition-all active:scale-[0.99]"
          >
            <span>View Details →</span>
          </button>
          
          {onViewMap && (
            <button
              id={`btn-card-map-${bus.busNumber}`}
              onClick={(e) => {
                e.stopPropagation();
                onViewMap(bus);
              }}
              title="Track on Live Map"
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-teal-400 border border-slate-800 hover:border-teal-500/40 transition-colors"
            >
              <MapPin className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
