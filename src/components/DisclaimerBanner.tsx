import React from 'react';
import { Database } from 'lucide-react';
import { DataMode } from '../types/ocean';

interface Props {
  dataMode: DataMode;
  onToggleDataMode: (mode: DataMode) => void;
}

export const DisclaimerBanner: React.FC<Props> = ({ dataMode, onToggleDataMode }) => {
  return (
    <div id="disclaimer-banner" className="bg-[#EBE9E4] text-[#1A1A1A] border-b-2 border-[#1A1A1A] px-4 py-2.5 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 bg-[#1A1A1A] text-white px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest font-black">
            NOTICE // SIH PROTOCOL
          </span>
          <span className="text-[#1A1A1A] font-medium text-[11px]">
            <strong className="font-bold">GRID DOMAIN:</strong> Bay of Bengal (5°N–22°N, 80°E–100°E) &bull; 0.25° Resolution &bull; In-situ ARGO Verification
          </span>
          <span className="hidden xl:inline text-[#555] text-[11px]">
            | OSCAR, ASCAT-C, and CCMP feeds are labeled synthetic demonstration layers.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#FDFCFB] border-2 border-[#1A1A1A] p-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] px-2 flex items-center gap-1">
              <Database className="w-3 h-3 text-[#1A1A1A]" />
              MODE:
            </span>
            <button
              id="mode-real-plus-syn"
              type="button"
              onClick={() => onToggleDataMode('real_plus_synthetic')}
              className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
                dataMode === 'real_plus_synthetic'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-transparent text-[#1A1A1A] hover:bg-[#EBE9E4]'
              }`}
            >
              REAL + DEMO
            </button>
            <button
              id="mode-real-only"
              type="button"
              onClick={() => onToggleDataMode('real_only')}
              className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
                dataMode === 'real_only'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-transparent text-[#1A1A1A] hover:bg-[#EBE9E4]'
              }`}
            >
              REAL ONLY (STRICT)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

