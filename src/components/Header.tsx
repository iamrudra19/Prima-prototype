import { Search, Bell, ShieldAlert, Cpu, HelpCircle, User, Menu } from 'lucide-react';
import { SidebarView } from '../types';

interface HeaderProps {
  currentView: SidebarView;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  userEmail: string;
  onMenuToggle?: () => void;
}

export default function Header({ currentView, searchQuery, onSearchChange, userEmail, onMenuToggle }: HeaderProps) {
  return (
    <header 
      id="app-header"
      className="h-16 border-b border-brand-border bg-white px-4 md:px-8 flex items-center justify-between select-none relative z-10 shrink-0"
    >
      {/* Menu Hamburger & View Title & Live Pulse */}
      <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg text-brand-navy transition-colors cursor-pointer mr-1 shrink-0"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        
        <h1 className="font-display text-base md:text-xl font-bold text-brand-navy tracking-tight truncate shrink-0">
          {currentView}
        </h1>
        
        <div className="h-4 w-px bg-brand-border hidden xs:block shrink-0" />
        
        <div className="hidden sm:flex items-center gap-1.5 bg-brand-green/10 px-2 py-0.5 rounded border border-brand-green/20 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
          </span>
          <span className="text-[10px] font-mono text-brand-green font-bold uppercase tracking-wider">
            HQ Command Active
          </span>
        </div>
      </div>

      {/* Global Instrument Panel Utilities */}
      <div className="flex items-center gap-2 md:gap-6 ml-2 overflow-hidden">
        {/* Search */}
        <div className="relative w-28 xs:w-40 sm:w-60 md:w-80">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-brand-slate">
            <Search className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </span>
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="w-full bg-brand-bg text-brand-navy text-[11px] md:text-xs rounded-lg pl-8 md:pl-9 pr-2 md:pr-4 py-1.5 md:py-2 border border-brand-border focus:border-brand-green focus:outline-none transition-all duration-150 font-sans"
          />
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
          <button 
            id="btn-alert-feed"
            title="System Alert Monitor"
            className="p-1.5 md:p-2 text-brand-slate hover:text-brand-red bg-brand-bg rounded-lg border border-brand-border transition-colors duration-150 relative cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-brand-red rounded-full" />
          </button>
          
          <button 
            id="btn-ai-status"
            title="AI Extraction Node"
            className="p-1.5 md:p-2 text-brand-slate hover:text-brand-green bg-brand-bg rounded-lg border border-brand-border transition-colors duration-150 cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>

        {/* Operator Profile */}
        <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-3 border-l border-brand-border shrink-0">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-semibold text-brand-navy font-sans">
              Rudra V.
            </span>
            <span className="text-[10px] font-mono text-brand-slate truncate max-w-[120px]">
              {userEmail || 'operator@prima'}
            </span>
          </div>
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-brand-navy text-white flex items-center justify-center font-display text-[10px] md:text-xs font-bold ring-2 ring-brand-green/30 shrink-0">
            RV
          </div>
        </div>
      </div>
    </header>
  );
}
