import React from 'react';
import { Bus, Clock, MapPin, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { CrowdBadge } from './CrowdBadge';
import { BusData } from '../types';

interface HeroSectionProps {
  bus70A?: BusData;
  onViewLiveMap: () => void;
  onViewBusDetails: (busNumber: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  bus70A,
  onViewLiveMap,
  onViewBusDetails,
}) => {
  const etaText = bus70A?.eta || '5 minutes away';
  const status = bus70A?.status || 'Crowded';
  const standing = bus70A?.standing_count ?? 11;

  return (
    <section className="relative overflow-hidden pt-4 pb-8 sm:py-10">
      {/* Background ambient gradient glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-5">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs sm:text-sm font-semibold tracking-wide">
              <Zap className="w-3.5 h-3.5 text-teal-400" />
              <span>AI-Powered Real-Time Transit</span>
            </div>

            {/* Main Hero Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Know Bus Crowds <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400">
                Before You Board
              </span>
            </h1>

            {/* Supporting text */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
              Check real-time crowd levels before boarding your bus.
            </p>

            {/* Key feature pills */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                <span>2-Second Real-Time Sync</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Passenger Video Upload</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Chennai MTC Corridors</span>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Live Alert Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div 
              id="hero-live-alert-card"
              className="w-full max-w-md bg-slate-900/90 border border-teal-500/30 rounded-2xl p-5 sm:p-6 shadow-xl shadow-slate-950/60 backdrop-blur-xl relative overflow-hidden transition-all hover:border-teal-500/50"
            >
              {/* Subtle top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-amber-400 to-cyan-400" />

              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 font-black text-lg">
                    70A
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-teal-400 font-bold">
                        Live Alert Card
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    </div>
                    <h2 className="text-base font-bold text-white">BUS 70A</h2>
                  </div>
                </div>

                <CrowdBadge status={status} standingCount={standing} size="sm" />
              </div>

              {/* Status information */}
              <div className="space-y-2.5 my-4 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Arrival:
                  </span>
                  <span className="font-semibold text-amber-300">
                    Bus 70A is {etaText}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300 border-t border-slate-800/60 pt-2">
                  <span className="text-slate-400">Route:</span>
                  <span className="font-medium text-white">Avadi → Broadway</span>
                </div>

                <div className="flex items-center justify-between text-slate-300 border-t border-slate-800/60 pt-2">
                  <span className="text-slate-400">Live Crowd:</span>
                  <span className="font-semibold text-amber-400">
                    Crowd: {status}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  id="btn-view-live-map"
                  onClick={onViewLiveMap}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm tracking-wide transition-all shadow-md shadow-teal-500/25 active:scale-[0.98]"
                >
                  <span>View on Live Map</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="btn-view-70a-details"
                  onClick={() => onViewBusDetails('70A')}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  Details
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
