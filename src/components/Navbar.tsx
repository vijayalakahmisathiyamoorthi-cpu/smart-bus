import React, { useState } from 'react';
import { NavPage } from '../types';
import { ConnectionState } from '../hooks/useBusStatus';
import { 
  Bus, 
  MapPin, 
  Route, 
  Search, 
  Mic, 
  Bell, 
  ShieldCheck, 
  Menu, 
  X, 
  Radio, 
  Cpu, 
  SlidersHorizontal,
  Activity
} from 'lucide-react';

interface NavbarProps {
  currentPage: NavPage;
  onSelectPage: (page: NavPage) => void;
  connectionStatus: ConnectionState;
  onOpenBus70A: () => void;
  unreadAlertCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onSelectPage,
  connectionStatus,
  onOpenBus70A,
  unreadAlertCount = 2,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: NavPage; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Bus },
    { id: 'live-map', label: 'Live Map', icon: MapPin },
    { id: 'all-routes', label: 'All Routes', icon: Route },
    { id: 'find-bus', label: 'Find Bus', icon: Search },
    { id: 'ai-voice', label: 'AI Voice', icon: Mic },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'admin', label: 'Admin', icon: SlidersHorizontal },
  ];

  const handleNavClick = (page: NavPage) => {
    onSelectPage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Left: Brand Logo & Title */}
          <div 
            id="brand-header"
            onClick={() => onSelectPage('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-slate-950 shadow-md shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-all duration-300">
              <Bus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                  Smart <span className="text-teal-400">Bus</span>
                </span>
                <span className="hidden xl:inline-flex text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-teal-950/80 border border-teal-500/30 text-teal-300">
                  Chennai Hub
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-400 font-medium tracking-normal truncate max-w-[280px] lg:max-w-sm">
                Real-Time Crowd Detection & Multilingual Voice Assistant
              </p>
            </div>
          </div>

          {/* Center: Desktop Navigation items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="Primary Navigation">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 ${
                    isActive
                      ? 'text-teal-300 bg-teal-500/15 border border-teal-500/30 shadow-sm shadow-teal-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.id === 'alerts' && unreadAlertCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {unreadAlertCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Side: Status Badges & Admin */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Theme Badge */}
            <div className="hidden 2xl:flex items-center gap-1 text-[11px] font-mono text-slate-400 px-2 py-1 rounded-md bg-slate-900 border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <span>Cyber Navy</span>
            </div>

            {/* LIVE API CONNECTION INDICATOR */}
            <div
              id="connection-badge"
              title={connectionStatus === 'LIVE' ? 'FastAPI & YOLO connected (polling every 2s)' : 'Waiting for live data from backend...'}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                connectionStatus === 'LIVE'
                  ? 'bg-teal-950/80 border-teal-500/50 text-teal-300 shadow-sm shadow-teal-500/20'
                  : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                <span className={`w-2 h-2 rounded-full ${connectionStatus === 'LIVE' ? 'bg-teal-400 animate-ping' : 'bg-rose-400'}`} />
                <span>{connectionStatus === 'LIVE' ? '● LIVE' : '● OFFLINE'}</span>
              </div>
              <div className="h-3 w-px bg-slate-700 hidden sm:block" />
              <span className="text-[11px] font-medium hidden sm:inline text-slate-300">
                {connectionStatus === 'LIVE' ? 'YOLO + FastAPI Connected' : 'Waiting for live data...'}
              </span>
            </div>

            {/* YOLO badge */}
            <button
              id="btn-yolo-diagnostics"
              onClick={() => onSelectPage('diagnostics')}
              className={`hidden sm:flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-1 rounded-md border transition-colors ${
                currentPage === 'diagnostics'
                  ? 'bg-teal-500 text-slate-950 border-teal-400'
                  : 'bg-slate-900 text-cyan-300 border-cyan-500/30 hover:bg-slate-800'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>YOLO</span>
            </button>

            {/* Admin button */}
            <button
              id="btn-admin-panel"
              onClick={() => onSelectPage('admin')}
              className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                currentPage === 'admin'
                  ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white hover:border-slate-600'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 py-3 px-1 space-y-1 bg-slate-950/95 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3 py-1.5 mb-2 text-xs font-medium text-slate-400 border-b border-slate-800/80">
              Chennai Real-Time Transit Corridors
            </div>
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.id === 'alerts' && unreadAlertCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold">
                      {unreadAlertCount}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between px-3 text-xs text-slate-400">
              <button 
                onClick={() => { onSelectPage('diagnostics'); setMobileMenuOpen(false); }}
                className="flex items-center gap-1.5 text-cyan-400 hover:underline py-1"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>YOLO Edge Diagnostics</span>
              </button>
              <span className="text-[10px] font-mono text-slate-500">v2.4 SIH</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
