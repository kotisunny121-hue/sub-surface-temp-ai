import React from 'react';
import { 
  Database, 
  Satellite, 
  Waves, 
  Ship, 
  Wind, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Info, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { DataMode } from '../types/ocean';

interface Props {
  dataMode: DataMode;
  onToggleDataMode: (mode: DataMode) => void;
}

export const DataSourcesPage: React.FC<Props> = ({ dataMode, onToggleDataMode }) => {
  return (
    <div id="data-sources-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header - Geometric Balance Architecture */}
      <div className="border-b-2 border-[#1A1A1A] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-6 bg-[#1A1A1A] text-white flex items-center justify-center text-[10px] font-black font-mono">
              04
            </div>
            <div className="text-[10px] uppercase tracking-[0.4em] font-black text-[#1A1A1A]">
              CATALOG // OCEAN DATA PIPELINE
            </div>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#1A1A1A] flex items-center gap-2">
              Ocean Observation Data Sources
            </h1>
            <span className="bg-[#1A1A1A] text-white text-[10px] font-mono px-2 py-0.5 tracking-tighter uppercase font-bold">
              MULTI-SENSOR
            </span>
          </div>
          <p className="text-sm text-[#444] mt-2 font-medium max-w-2xl leading-relaxed">
            Complete inventory of multi-satellite feeds, in-situ CTD arrays, and optional synthetic atmospheric-oceanic forcings.
          </p>
        </div>

        {/* Real / Synthetic Mode Switch */}
        <div className="flex items-center gap-3 bg-[#F8F7F5] p-2 border-2 border-[#1A1A1A]">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1A1A1A] px-1">ACTIVE MODE:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleDataMode('real_plus_synthetic')}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                dataMode === 'real_plus_synthetic'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-white text-[#555] hover:text-[#1A1A1A] border border-[#1A1A1A]/30'
              }`}
            >
              Real + Synthetic Demo
            </button>
            <button
              onClick={() => onToggleDataMode('real_only')}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                dataMode === 'real_only'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-white text-[#555] hover:text-[#1A1A1A] border border-[#1A1A1A]/30'
              }`}
            >
              Real Only (Strict)
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Scientific Transparency Banner */}
      <div className="bg-[#F8F7F5] border-2 border-[#1A1A1A] p-4 text-xs text-[#1A1A1A] flex items-start gap-3">
        <Info className="w-5 h-5 text-[#1A1A1A] mt-0.5 flex-shrink-0" />
        <div className="space-y-1 font-mono text-[11px] leading-relaxed">
          <p className="font-bold uppercase tracking-wider">
            DATASET TRANSPARENCY & SMART INDIA HACKATHON PROTOCOL
          </p>
          <p className="text-[#333]">
            OSTIA SST, Multi-Observation SSS, DUACS SSH/SLA, and ARGO Float CTD casts are <strong>PROVIDED REAL DATASETS</strong>. 
            OSCAR (Surface Currents), ASCAT-C (Winds), and CCMP (10m Winds) shown in this prototype are synthetic demonstration datasets because the operational NASA/RSS datasets have not yet been downloaded. They are included only to demonstrate the complete multi-source ocean-data pipeline and can be replaced seamlessly.
          </p>
        </div>
      </div>

      {/* SECTION 1: REAL OBSERVATIONAL DATASETS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#1A1A1A]" />
            <h2 className="text-base font-black uppercase tracking-wider text-[#1A1A1A]">
              04.1 // REAL OBSERVATIONAL DATASETS
            </h2>
          </div>
          <span className="bg-[#1A1A1A] text-white text-[10px] font-mono px-2 py-0.5 tracking-tighter uppercase font-bold">
            PROVIDED REAL DATA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Real 1: OSTIA SST */}
          <div className="bg-white border-2 border-[#1A1A1A] p-5 space-y-3">
            <div className="flex items-start justify-between border-b border-[#1A1A1A]/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#1A1A1A] text-white flex items-center justify-center">
                  <Satellite className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight text-[#1A1A1A]">OSTIA Sea Surface Temperature (SST)</h3>
                  <p className="text-[11px] font-mono text-[#555]">UK Met Office / Copernicus Marine (CMEMS)</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-[#1A1A1A] text-white px-2 py-0.5 uppercase">
                REAL
              </span>
            </div>

            <div className="text-xs font-mono text-[#333] space-y-1.5 pt-1">
              <div><strong className="text-[#1A1A1A]">ROLE:</strong> Surface thermal boundary condition determining upper-ocean heat content.</div>
              <div><strong className="text-[#1A1A1A]">VARIABLES:</strong> <code className="bg-[#F8F7F5] border border-[#1A1A1A]/30 px-1 py-0.5">analysed_sst</code>, <code className="bg-[#F8F7F5] border border-[#1A1A1A]/30 px-1 py-0.5">analysis_error</code></div>
              <div><strong className="text-[#1A1A1A]">GRID:</strong> NetCDF-4, 0.05° regridded to 0.25° × 0.25° daily</div>
              <div><strong className="text-[#1A1A1A]">RANGE:</strong> 25.8°C to 29.6°C across Bay of Bengal (Jan 2020)</div>
            </div>
          </div>

          {/* Real 2: Multi-Observation SSS */}
          <div className="bg-white border-2 border-[#1A1A1A] p-5 space-y-3">
            <div className="flex items-start justify-between border-b border-[#1A1A1A]/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#1A1A1A] text-white flex items-center justify-center">
                  <Waves className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight text-[#1A1A1A]">Multi-Observation Salinity (SSS)</h3>
                  <p className="text-[11px] font-mono text-[#555]">Copernicus Marine / SMOS + SMAP + In-situ</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-[#1A1A1A] text-white px-2 py-0.5 uppercase">
                REAL
              </span>
            </div>

            <div className="text-xs font-mono text-[#333] space-y-1.5 pt-1">
              <div><strong className="text-[#1A1A1A]">ROLE:</strong> Establishes the Bay of Bengal low-salinity freshwater barrier layer & pycnocline stratification.</div>
              <div><strong className="text-[#1A1A1A]">VARIABLES:</strong> <code className="bg-[#F8F7F5] border border-[#1A1A1A]/30 px-1 py-0.5">sos</code> (Sea Surface Salinity in PSU)</div>
              <div><strong className="text-[#1A1A1A]">GRID:</strong> NetCDF-4, 0.25° × 0.25° daily</div>
              <div><strong className="text-[#1A1A1A]">RANGE:</strong> 28.2 PSU (North runoff) to 34.6 PSU (Equatorial south)</div>
            </div>
          </div>

          {/* Real 3: DUACS Global Ocean SSH / SLA */}
          <div className="bg-white border-2 border-[#1A1A1A] p-5 space-y-3">
            <div className="flex items-start justify-between border-b border-[#1A1A1A]/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#1A1A1A] text-white flex items-center justify-center">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight text-[#1A1A1A]">Sea Surface Height / SLA</h3>
                  <p className="text-[11px] font-mono text-[#555]">DUACS Multi-Mission Altimeter (Jason-3, Sentinel-3, SARAL)</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-[#1A1A1A] text-white px-2 py-0.5 uppercase">
                REAL
              </span>
            </div>

            <div className="text-xs font-mono text-[#333] space-y-1.5 pt-1">
              <div><strong className="text-[#1A1A1A]">ROLE:</strong> Altimetry reveals mesoscale cyclonic (upwelling) and anticyclonic (downwelling) thermocline pumping.</div>
              <div><strong className="text-[#1A1A1A]">VARIABLES:</strong> <code className="bg-[#F8F7F5] border border-[#1A1A1A]/30 px-1 py-0.5">sla</code> (m), <code className="bg-[#F8F7F5] border border-[#1A1A1A]/30 px-1 py-0.5">adt</code> (Absolute Dynamic Topography)</div>
              <div><strong className="text-[#1A1A1A]">GRID:</strong> NetCDF-4, 0.25° daily</div>
              <div><strong className="text-[#1A1A1A]">RANGE:</strong> -0.18 m to +0.22 m</div>
            </div>
          </div>

          {/* Real 4: ARGO Float Subsurface Observations */}
          <div className="bg-white border-2 border-[#1A1A1A] p-5 space-y-3">
            <div className="flex items-start justify-between border-b border-[#1A1A1A]/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#1A1A1A] text-white flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight text-[#1A1A1A]">ARGO Float CTD Subsurface Profiles</h3>
                  <p className="text-[11px] font-mono text-[#555]">INCOIS / Indian Argo Project / International Argo GDAC</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-[#1A1A1A] text-white px-2 py-0.5 uppercase">
                GROUND TRUTH
              </span>
            </div>

            <div className="text-xs font-mono text-[#333] space-y-1.5 pt-1">
              <div><strong className="text-[#1A1A1A]">ROLE:</strong> Physical subsurface observations (0m to 2000m) for model training and validation.</div>
              <div><strong className="text-[#1A1A1A]">VARIABLES:</strong> <code className="bg-[#F8F7F5] border border-[#1A1A1A]/30 px-1 py-0.5">TEMP</code> (°C), <code className="bg-[#F8F7F5] border border-[#1A1A1A]/30 px-1 py-0.5">PSAL</code> (PSU), <code className="bg-[#F8F7F5] border border-[#1A1A1A]/30 px-1 py-0.5">DEPTH</code> (m)</div>
              <div><strong className="text-[#1A1A1A]">COVERAGE:</strong> Real active floats in BoB (e.g. WMO 2902695, 2902742, 2902810)</div>
              <div><strong className="text-[#1A1A1A]">VERTICAL LEVELS:</strong> High-resolution CTD profiles to 2000 meters depth</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: IN-SITU OBSERVATIONS & AUXILIARY DATA */}
      <div className="space-y-4">
        <div className="border-b-2 border-[#1A1A1A] pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#1A1A1A]" />
            <h2 className="text-base font-black uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2">
              <Ship className="w-4 h-4 text-[#1A1A1A]" />
              04.2 // IN-SITU & AUXILIARY DATA SOURCES
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border-2 border-[#1A1A1A] p-5 space-y-2">
            <h4 className="font-black uppercase tracking-wide text-xs text-[#1A1A1A]">Research Ships (ORV Sagar Kanya, Sagar Nidhi)</h4>
            <p className="text-xs font-mono text-[#444] leading-relaxed">
              MoES ship-based deep CTD casts, XBT transects, and underway surface meteorological systems providing high-precision validation anchor points.
            </p>
          </div>
          <div className="bg-white border-2 border-[#1A1A1A] p-5 space-y-2">
            <h4 className="font-black uppercase tracking-wide text-xs text-[#1A1A1A]">Moored Ocean Buoys (RAMA & OMNI)</h4>
            <p className="text-xs font-mono text-[#444] leading-relaxed">
              INCOIS/MoES deep-sea moored buoys (BD08, BD09, BD10, BD11) measuring continuous time-series of subsurface temperature at 10m to 500m.
            </p>
          </div>
          <div className="bg-white border-2 border-[#1A1A1A] p-5 space-y-2">
            <h4 className="font-black uppercase tracking-wide text-xs text-[#1A1A1A]">Auxiliary Reanalysis & Bathymetry</h4>
            <p className="text-xs font-mono text-[#444] leading-relaxed">
              GEBCO 15-arc-second bathymetry grid providing seafloor depth mask, ERA5 atmospheric reanalysis, and tidal harmonic components.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: OPTIONAL SYNTHETIC DEMONSTRATION DATASETS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#1A1A1A]" />
            <h2 className="text-base font-black uppercase tracking-wider text-[#1A1A1A]">
              04.3 // OPTIONAL SYNTHETIC DEMONSTRATION DATASETS
            </h2>
          </div>
          <span className="bg-[#1A1A1A] text-white text-[10px] font-mono px-2 py-0.5 tracking-tighter uppercase font-bold">
            SYNTHETIC DEMO ONLY
          </span>
        </div>

        <div className="bg-[#F8F7F5] border-2 border-[#1A1A1A] p-4 text-xs text-[#1A1A1A] flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#1A1A1A] mt-0.5 flex-shrink-0" />
          <div className="font-mono text-[11px] leading-relaxed">
            <strong className="font-bold uppercase tracking-wider">NOTICE:</strong> The three datasets below are mathematically generated for the Bay of Bengal January 2020 domain to demonstrate the multi-source software pipeline. They are <strong>NOT real NASA or operational observations</strong> and are disabled when <em>Real Only Mode</em> is active.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Synthetic 1: OSCAR */}
          <div className={`bg-white border-2 p-5 space-y-3 transition-opacity ${
            dataMode === 'real_only' ? 'opacity-30 border-dashed border-[#1A1A1A]' : 'border-[#1A1A1A]'
          }`}>
            <div className="flex items-start justify-between border-b border-[#1A1A1A]/20 pb-2">
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-[#1A1A1A]">OSCAR Ocean Currents</h3>
                <span className="bg-[#1A1A1A] text-white text-[9px] font-mono font-bold px-1.5 py-0.5 uppercase">
                  SYNTHETIC DEMO
                </span>
              </div>
              <Waves className="w-5 h-5 text-[#1A1A1A]" />
            </div>
            <div className="text-xs font-mono text-[#333] space-y-1.5 pt-1">
              <div><strong className="text-[#1A1A1A]">VARIABLES:</strong> <code className="bg-[#F8F7F5] px-1 py-0.5 border border-[#1A1A1A]/20">u</code>, <code className="bg-[#F8F7F5] px-1 py-0.5 border border-[#1A1A1A]/20">v</code>, <code className="bg-[#F8F7F5] px-1 py-0.5 border border-[#1A1A1A]/20">current_speed</code></div>
              <div><strong className="text-[#1A1A1A]">DOMAIN:</strong> 5°N–22°N, 80°E–100°E (0.25° grid)</div>
              <div><strong className="text-[#1A1A1A]">FORMULA:</strong> <code className="bg-[#F8F7F5] px-1 py-0.5 border border-[#1A1A1A]/20">speed = sqrt(u² + v²)</code></div>
              <div><strong className="text-[#1A1A1A]">ROLE:</strong> Surface geostrophic and Ekman transport advection</div>
            </div>
          </div>

          {/* Synthetic 2: ASCAT-C */}
          <div className={`bg-white border-2 p-5 space-y-3 transition-opacity ${
            dataMode === 'real_only' ? 'opacity-30 border-dashed border-[#1A1A1A]' : 'border-[#1A1A1A]'
          }`}>
            <div className="flex items-start justify-between border-b border-[#1A1A1A]/20 pb-2">
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-[#1A1A1A]">ASCAT-C Surface Winds</h3>
                <span className="bg-[#1A1A1A] text-white text-[9px] font-mono font-bold px-1.5 py-0.5 uppercase">
                  SYNTHETIC DEMO
                </span>
              </div>
              <Wind className="w-5 h-5 text-[#1A1A1A]" />
            </div>
            <div className="text-xs font-mono text-[#333] space-y-1.5 pt-1">
              <div><strong className="text-[#1A1A1A]">VARIABLES:</strong> <code className="bg-[#F8F7F5] px-1 py-0.5 border border-[#1A1A1A]/20">wind_speed</code>, <code className="bg-[#F8F7F5] px-1 py-0.5 border border-[#1A1A1A]/20">u_wind</code>, <code className="bg-[#F8F7F5] px-1 py-0.5 border border-[#1A1A1A]/20">v_wind</code></div>
              <div><strong className="text-[#1A1A1A]">REGIME:</strong> Northeast winter monsoon (direction ~45°)</div>
              <div><strong className="text-[#1A1A1A]">CADENCE:</strong> Daily 0.25° grid</div>
              <div><strong className="text-[#1A1A1A]">ROLE:</strong> Wind-stress induced surface turbulence & MLD deepening</div>
            </div>
          </div>

          {/* Synthetic 3: CCMP */}
          <div className={`bg-white border-2 p-5 space-y-3 transition-opacity ${
            dataMode === 'real_only' ? 'opacity-30 border-dashed border-[#1A1A1A]' : 'border-[#1A1A1A]'
          }`}>
            <div className="flex items-start justify-between border-b border-[#1A1A1A]/20 pb-2">
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-[#1A1A1A]">CCMP 10m Winds</h3>
                <span className="bg-[#1A1A1A] text-white text-[9px] font-mono font-bold px-1.5 py-0.5 uppercase">
                  SYNTHETIC DEMO
                </span>
              </div>
              <Wind className="w-5 h-5 text-[#1A1A1A]" />
            </div>
            <div className="text-xs font-mono text-[#333] space-y-1.5 pt-1">
              <div><strong className="text-[#1A1A1A]">VARIABLES:</strong> <code className="bg-[#F8F7F5] px-1 py-0.5 border border-[#1A1A1A]/20">uwnd</code>, <code className="bg-[#F8F7F5] px-1 py-0.5 border border-[#1A1A1A]/20">vwnd</code>, <code className="bg-[#F8F7F5] px-1 py-0.5 border border-[#1A1A1A]/20">ws</code></div>
              <div><strong className="text-[#1A1A1A]">CADENCE:</strong> 6-hourly (00:00, 06:00, 12:00, 18:00 UTC)</div>
              <div><strong className="text-[#1A1A1A]">FORMULA:</strong> <code className="bg-[#F8F7F5] px-1 py-0.5 border border-[#1A1A1A]/20">ws = sqrt(uwnd² + vwnd²)</code></div>
              <div><strong className="text-[#1A1A1A]">ROLE:</strong> High-frequency diurnal atmospheric forcing</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
