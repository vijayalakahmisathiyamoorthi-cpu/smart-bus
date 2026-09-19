import React, { useState } from 'react';
import { BusData, CrowdStatus } from '../types';
import { CrowdBadge } from './CrowdBadge';
import { 
  Route, 
  Search, 
  Filter, 
  Clock, 
  ArrowRight, 
  LayoutList, 
  LayoutGrid, 
  MapPin,
  Users
} from 'lucide-react';

interface AllRoutesProps {
  buses: BusData[];
  onSelectBus: (bus: BusData) => void;
  onViewMap: (bus: BusData) => void;
}

export const AllRoutes: React.FC<AllRoutesProps> = ({
  buses,
  onSelectBus,
  onViewMap,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | CrowdStatus>('All');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const filteredBuses = buses.filter((bus) => {
    const matchesSearch =
      bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.via.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || bus.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Route className="w-6 h-6 text-teal-400" />
            <span>All Transit Routes</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
            Complete schedule, transit corridors and live passenger occupancy status
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'table'
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutList className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'cards'
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by bus number (e.g. 70A), source, destination or via..."
            className="w-full bg-slate-950/90 border border-slate-800 focus:border-teal-400 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-950/90 border border-slate-800 text-slate-200 text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:border-teal-400"
          >
            <option value="All">All Crowd Statuses</option>
            <option value="Less Crowded">Less Crowded</option>
            <option value="Crowded">Crowded</option>
            <option value="Overcrowded">Overcrowded</option>
          </select>
        </div>
      </div>

      {/* Content: Table View */}
      {viewMode === 'table' ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Bus Number</th>
                  <th className="py-3.5 px-4">From</th>
                  <th className="py-3.5 px-4">To</th>
                  <th className="py-3.5 px-4">Via Corridor</th>
                  <th className="py-3.5 px-4">ETA</th>
                  <th className="py-3.5 px-4">Crowd Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredBuses.map((bus) => (
                  <tr 
                    key={bus.id} 
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    onClick={() => onSelectBus(bus)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center font-black text-teal-300 text-xs">
                          {bus.busNumber}
                        </span>
                        <span className="font-bold text-white">BUS {bus.busNumber}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-200">
                      {bus.source}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-200">
                      {bus.destination}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-400 max-w-xs truncate">
                      {bus.via}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-teal-300">
                      {bus.eta}
                    </td>
                    <td className="py-4 px-4">
                      <CrowdBadge status={bus.status} standingCount={bus.standing_count} size="sm" />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBus(bus);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-teal-400 hover:text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 px-2.5 py-1 rounded-lg border border-teal-500/30 transition-colors"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBuses.map((bus) => (
            <div
              key={bus.id}
              onClick={() => onSelectBus(bus)}
              className="bg-slate-900/80 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-5 cursor-pointer transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center font-black text-teal-300 text-sm">
                    {bus.busNumber}
                  </span>
                  <div>
                    <h3 className="font-bold text-white text-base">BUS {bus.busNumber}</h3>
                    <p className="text-xs text-slate-400">{bus.route}</p>
                  </div>
                </div>
                <div className="text-xs font-mono font-bold text-teal-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                  {bus.eta}
                </div>
              </div>

              <div className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-500">Via:</span> {bus.via}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <CrowdBadge status={bus.status} standingCount={bus.standing_count} size="sm" />
                <span className="text-xs font-bold text-teal-400 flex items-center gap-1">
                  View →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredBuses.length === 0 && (
        <div className="py-12 text-center text-slate-400">
          No transit routes found matching "{searchTerm}".
        </div>
      )}

    </div>
  );
};
