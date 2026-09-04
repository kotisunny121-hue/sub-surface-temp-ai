import React from 'react';
import { 
  DataMode 
} from '../types/ocean';
import { 
  Activity, 
  Database, 
  Layers, 
  BarChart3, 
  Cpu, 
  CheckCircle2, 
  GitBranch, 
  Calendar, 
  Info,
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
  dataMode,
  onToggleDataMode 
}) => {
  const handleNav = (pageId: string) => {
    if (onSelectPage) onSelectPage(pageId);
    if (onNavigate) onNavigate(pageId);
  };

  const navItems: { id: string; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'datasources', label: 'Data Feeds', icon: Database },
    { id: 'preprocessing', label: 'Pipeline', icon: Layers },
    { id: 'patterns', label: 'Patterns', icon: BarChart3 },
    { id: 'prediction', label: 'Predict', icon: Cpu },
    { id: 'validation', label: 'Validation', icon: CheckCircle2 },
    { id: 'architecture', label: 'ConvFormer', icon: GitBranch },
    { id: 'hackathon', label: 'Impact', icon: Calendar },
    { id: 'docs', label: 'API & Specs', icon: Info },
  ];

  // Map potential legacy aliases
  const isItemActive = (id: string) => {
    if (currentPage === id) return true;
    if (id === 'datasources' && currentPage === 'data-sources') return true;
    if (id === 'patterns' && currentPage === 'pattern-analysis') return true;
    if (id === 'hackathon' && currentPage === 'day-to-day') return true;
    if (id === 'docs' && currentPage === 'about') return true;
    return false;
  };

  return (
    <header className="bg-[#FDFCFB] border-b-2 border-[#1A1A1A] text-[#1A1A1A] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Geometric Title */}
          <div 
            id="brand-header"
            onClick={() => handleNav('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 bg-[#1A1A1A] text-white flex items-center justify-center font-black text-xs border border-[#1A1A1A] transition-transform group-hover:scale-95">
              <Waves className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm uppercase tracking-[0.15em] text-[#1A1A1A]">
                  SUB-SURFACE AI
                </span>
                <span className="bg-[#1A1A1A] text-white text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5">
                  SIH 2024–26
                </span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#444444]">
                BAY OF BENGAL // 0.25° CONVFORMER
              </div>
            </div>
          </div>

          {/* Navigation Links - Geometric Style */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.id);
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`px-3 py-2 text-[10px] uppercase tracking-[0.18em] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    active
                      ? 'bg-[#1A1A1A] text-white border-2 border-[#1A1A1A]'
                      : 'bg-transparent text-[#1A1A1A] border-2 border-transparent hover:border-[#1A1A1A] hover:bg-[#EBE9E4]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-[#1A1A1A]'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Model Status Module Pill */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 bg-[#F8F7F5] border-2 border-[#1A1A1A] px-3 py-1.5">
              <div className="w-2 h-2 bg-[#1A1A1A]" />
              <div className="flex flex-col text-right">
                <span className="text-[9px] uppercase tracking-[0.2em] font-black text-[#1A1A1A]">
                  PIPELINE // ACTIVE
                </span>
                <span className="text-[9px] font-mono text-[#555]">
                  {dataMode === 'real_plus_synthetic' ? '7 FEEDS (4 REAL + 3 DEMO)' : '4 REAL FEEDS (STRICT)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto py-2 border-t-2 border-[#1A1A1A] no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.id);
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`whitespace-nowrap px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold flex items-center gap-1 transition-all ${
                  active
                    ? 'bg-[#1A1A1A] text-white border-2 border-[#1A1A1A]'
                    : 'bg-[#F8F7F5] text-[#1A1A1A] border border-[#1A1A1A]'
                }`}
              >
                <Icon className="w-3 h-3" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

