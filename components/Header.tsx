import React from 'react';
import { Bot, Terminal, Activity } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-dark-700 bg-dark-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-500 blur-lg opacity-20 animate-pulse"></div>
            <div className="bg-brand-500/10 p-2 rounded-lg border border-brand-500/20 relative">
              <Bot className="w-6 h-6 text-brand-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Code Migration Autopilot
            </h1>
            <p className="text-xs text-gray-400 font-mono tracking-wider">AUTONOMOUS MIGRATION AGENT</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
            <Terminal className="w-4 h-4" />
            <span>v2.1.0-beta</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
            <Activity className="w-4 h-4 text-brand-400 animate-pulse-fast" />
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-wide">System Online</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;