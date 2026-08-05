import React from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  Cpu, 
  Radar, 
  Send, 
  BarChart3, 
  MapPin, 
  Activity,
  X 
} from 'lucide-react';
import { SidebarView } from '../types';
import { motion } from 'motion/react';

interface SidebarProps {
  currentView: SidebarView;
  onViewChange: (view: SidebarView) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

interface MenuItem {
  name: SidebarView;
  icon: React.ComponentType<any>;
  badge?: number;
}

export default function Sidebar({ currentView, onViewChange, isOpen = false, onClose }: SidebarProps) {
  const menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Enquiry Inbox', icon: Inbox, badge: 5 },
    { name: 'AI Spec Collector', icon: Cpu, badge: 7 },
    { name: 'Lead Finder', icon: Radar, badge: 4 },
    { name: 'Outreach & Nurture', icon: Send },
    { name: 'Meetings & Analytics', icon: BarChart3 },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div 
        id="sidebar"
        className={`fixed inset-y-0 left-0 w-72 bg-brand-navy text-white flex flex-col h-screen select-none z-50 border-r border-slate-800 transition-transform duration-300 ease-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:flex lg:h-full`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex flex-col justify-start">
            <div className="flex items-center gap-3">
              <span className="font-display text-2xl font-bold tracking-tight text-white flex items-center gap-1.5">
                PRIMA <span className="text-brand-green font-normal text-xs px-2 py-0.5 border border-brand-green/30 bg-brand-green/10 rounded uppercase tracking-wider">CEMS</span>
              </span>
            </div>
            <p className="text-brand-slate text-[11px] font-mono uppercase tracking-widest mt-1">
              Sales Command
            </p>
          </div>
          
          {onClose && (
            <button 
              onClick={onClose}
              className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg text-brand-slate hover:text-white transition-colors cursor-pointer"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="text-[10px] font-mono font-semibold text-brand-slate uppercase tracking-widest px-3 mb-2">
            Operations Center
          </p>
          {menuItems.map((item) => {
            const isActive = currentView === item.name;
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                id={`nav-item-${item.name.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => {
                  onViewChange(item.name);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group text-left relative ${
                  isActive 
                    ? 'bg-white/5 text-white' 
                    : 'text-brand-slate hover:bg-white/2 hover:text-white'
                }`}
              >
                {/* Sliding 3px green indicator bar for active item */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-2 bottom-2 w-[3px] bg-brand-green rounded-r"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                <div className="flex items-center gap-3 relative z-10">
                  <Icon 
                    className={`w-4 h-4 transition-colors duration-200 ${
                      isActive ? 'text-brand-green' : 'text-brand-slate group-hover:text-white'
                    }`} 
                  />
                  <span className="font-sans text-[13px] tracking-wide">{item.name}</span>
                </div>

                {item.badge !== undefined && (
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                    isActive 
                      ? 'bg-brand-green text-brand-navy' 
                      : 'bg-slate-800 text-brand-slate group-hover:bg-slate-700 group-hover:text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Brand Footer Metadata */}
        <div className="p-6 border-t border-slate-800/60 bg-slate-950/20 text-[12px] font-sans">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
              </span>
              <span className="font-mono text-[11px] tracking-wider text-white">LIVE SERVER</span>
            </div>
            <span className="text-[10px] text-brand-slate font-mono">v3.5.2</span>
          </div>

          <div className="space-y-1 text-brand-slate font-sans text-[11px]">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-brand-green" />
              <span>Vadodara, Gujarat (Est. 1992)</span>
            </div>
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest text-center pt-2 border-t border-slate-800/40 mt-2">
              Detect. Monitor. Analyse.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
