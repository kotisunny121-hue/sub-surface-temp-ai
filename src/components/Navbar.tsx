import React from 'react';
import { 
  DataMode 
} from '../types/ocean';
import { 
  LayoutGrid,
  MapPin, 
  Database, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  GitBranch, 
  Trophy, 
  BookOpen,
  Waves
} from 'lucide-react';

interface Props {
  currentPage: string;
  onSelectPage?: (page: string) => void;
  onNavigate?: (page: string) => void;
  dataMode: DataMode;
  onToggleDataMode?: (mode: DataMode) => void;
}

export const Navbar: React.FC<Props> = ({ 
  currentPage, 
  onSelectPage, 
  onNavigate, 
  dataMode 
}) => {
  const handleNav = (pageId: string) => {
    if (onSelectPage) onSelectPage(pageId);
    if (onNavigate) onNavigate(pageId);
  };

  const navItems: { id: string; label: string; icon: React.ElementType }[] = [
    { id: 'grid', label: '6-Panel Grid', icon: LayoutGrid },
    { id: 'dashboard', label: 'Map & Depth', icon: MapPin },
    { id: 'datasources', label: 'Data Sources', icon: Database },
    { id: 'preprocessing', label: 'Pipeline', icon: Layers },
    { id: 'prediction', label: 'Predict Console', icon: Cpu },
    { id: 'validation', label: 'ARGO Validation', icon: CheckCircle2 },
    { id: 'architecture', label: 'ConvFormer Model', icon: GitBranch },
    { id: 'hackathon', label: 'SIH & Impact', icon: Trophy },
    { id: 'docs', label: 'API & Specs', icon: BookOpen },
  ];

  // Map potential legacy aliases
  const isItemActive = (id: string) => {
    if (currentPage === id) return true;
    if (id === 'datasources' && currentPage === 'data-sources') return true;
    if (id === 'hackathon' && currentPage === 'day-to-day') return true;
    if (id === 'docs' && currentPage === 'about') return true;
    return false;
  };

  return (
    <header className="bg-white border-b border-[#E2E8F0] text-[#0F172A] sticky top-0 z-40 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo & Title */}
          <div 
            id="brand-header"
            onClick={() => handleNav('grid')}
            className="flex items-center gap-3 cursor-pointer group select-none py-2"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0284C7] to-[#1E3A8A] text-white flex items-center justify-center font-bold text-sm shadow-sm transition-transform group-hover:scale-95">
              <Waves className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-[#0F172A] flex items-center gap-1.5">
                  ConvFormer <span className="text-[#0284C7] font-semibold text-sm">3D Ocean AI</span>
                </span>
                <span className="bg-blue-50 text-[#0284C7] border border-blue-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  SIH &bull; INCOIS
                </span>
              </div>
              <div className="text-[11px] font-medium text-slate-500">
                Subsurface Temperature Reconstruction &bull; Bay of Bengal (0.25°)
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links - Horizontal with ocean-blue bottom indicator */}
          <nav className="hidden lg:flex items-center space-x-1 h-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.id);
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`relative h-18 px-3.5 flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'text-[#0284C7]'
                      : 'text-[#334155] hover:text-[#0F172A] hover:bg-slate-50/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#0284C7]' : 'text-slate-400'}`} />
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0284C7] rounded-t-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Model Status Indicator */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-[#E2E8F0] px-3 py-1.5 rounded-lg shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0284C7]"></span>
              </span>
              <div className="text-left leading-tight">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#0F172A]">
                  AI Inference Engine
                </div>
                <div className="text-[10px] font-medium text-slate-500">
                  {dataMode === 'real_plus_synthetic' ? '7 Active Feeds' : '4 Real Feeds'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2.5 border-t border-[#E2E8F0] no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.id);
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`whitespace-nowrap px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                  active
                    ? 'bg-sky-50 text-[#0284C7] border border-sky-200'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

