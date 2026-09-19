import React from 'react';
import { Bus, ShieldCheck, Cpu, Radio, Heart } from 'lucide-react';
import { NavPage } from '../types';

interface FooterProps {
  onSelectPage: (page: NavPage) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectPage }) => {
  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/90 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 text-white font-extrabold text-lg">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-slate-950 font-black">
                <Bus className="w-4 h-4" />
              </div>
              <span>Smart <span className="text-teal-400">Bus</span></span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Real-Time Bus Crowd Detection & Multilingual Voice Assistant for Chennai Corridors.
              Empowering commuters to check onboard occupancy before boarding.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-teal-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero Raw Footage Transmission • 100% Privacy Compliant</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider font-mono">
              Transit Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectPage('home')} className="hover:text-teal-300 transition-colors">
                  Home Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onSelectPage('live-map')} className="hover:text-teal-300 transition-colors">
                  Chennai Live Map
                </button>
              </li>
              <li>
                <button onClick={() => onSelectPage('find-bus')} className="hover:text-teal-300 transition-colors">
                  Find Bus by Corridor
                </button>
              </li>
              <li>
                <button onClick={() => onSelectPage('all-routes')} className="hover:text-teal-300 transition-colors">
                  All Routes Schedule
                </button>
              </li>
              <li>
                <button onClick={() => onSelectPage('ai-voice')} className="hover:text-teal-300 transition-colors">
                  Multilingual AI Voice
                </button>
              </li>
            </ul>
          </div>

          {/* Tech & SIH Stack */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider font-mono">
              Edge AI Architecture
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-cyan-400" />
                <span>YOLOv8 Edge Computer Vision</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-teal-400" />
                <span>FastAPI 2.0s Telemetry Poll</span>
              </li>
              <li className="pt-2 text-[11px] text-slate-500 font-mono">
                Smart India Hackathon (SIH) Prototype
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
          <div>
            &copy; {new Date().getFullYear()} Smart Bus Chennai Transit System. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onSelectPage('diagnostics')} className="text-teal-400 hover:underline">
              AI Diagnostics
            </button>
            <span>•</span>
            <button onClick={() => onSelectPage('admin')} className="text-teal-400 hover:underline">
              Admin Telemetry
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
