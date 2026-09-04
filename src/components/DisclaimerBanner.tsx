import React from 'react';
import { Database, ShieldCheck, Sparkles } from 'lucide-react';
import { DataMode } from '../types/ocean';

interface Props {
  dataMode: DataMode;
  onToggleDataMode: (mode: DataMode) => void;
}

export const DisclaimerBanner: React.FC<Props> = ({ dataMode, onToggleDataMode }) => {
  return (
    <div id="disclaimer-banner" className="bg-[#F1F5F9] text-[#0F172A] border-b border-[#E2E8F0] px-4 py-2.5 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="badge-real">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
            REAL OBSERVATION READY
          </span>
          <span className="text-[#334155] font-medium text-xs">
            <strong className="font-semibold text-[#0F172A]">Bay of Bengal Basin (5°N–22°N, 80°E–100°E):</strong> 0.25° × 0.25° Grid &bull; In-situ ARGO Ground Truth
          </span>
          <span className="hidden xl:inline text-slate-500 text-xs">
            | OSCAR, ASCAT-C, and CCMP feeds are labeled as synthetic demonstration layers.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-[#CBD5E1] rounded-lg p-0.5 shadow-sm">
            <span className="text-[11px] font-semibold text-[#475569] px-2.5 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#0284C7]" />
              Data Mode:
            </span>
            <button
              id="mode-real-plus-syn"
              type="button"
              onClick={() => onToggleDataMode('real_plus_synthetic')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                dataMode === 'real_plus_synthetic'
                  ? 'bg-[#0284C7] text-white shadow-sm'
                  : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              All 7 Feeds (Real + Demo)
            </button>
            <button
              id="mode-real-only"
              type="button"
              onClick={() => onToggleDataMode('real_only')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                dataMode === 'real_only'
                  ? 'bg-[#16A34A] text-white shadow-sm'
                  : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Strict Real Only (4 Feeds)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

