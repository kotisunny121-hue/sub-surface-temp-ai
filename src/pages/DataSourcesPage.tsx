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
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-real">CATALOG &bull; DATA INGESTION</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              MULTI-SENSOR OCEAN PIPELINE
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2.5">
              Ocean Observation Data Sources
            </h1>
            <span className="bg-sky-50 text-[#0284C7] border border-sky-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Multi-Sensor
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-2 font-medium max-w-2xl leading-relaxed">
            Complete inventory of multi-satellite feeds, in-situ CTD arrays, and optional synthetic atmospheric-oceanic forcings.
          </p>
        </div>

        {/* Real / Synthetic Mode Switch */}
        <div className="flex items-center gap-2.5 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-[#0F172A] px-1">Active Mode:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleDataMode('real_plus_synthetic')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                dataMode === 'real_plus_synthetic'
                  ? 'bg-[#0284C7] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Real + Synthetic Demo
            </button>
            <button
              onClick={() => onToggleDataMode('real_only')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                dataMode === 'real_only'
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Real Only (Strict)
            </button>
          </div>
        </div>
      </div>

      {/* Transparency Banner */}
      <div className="bg-sky-50/60 border border-sky-200 rounded-xl p-4 text-xs text-sky-950 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#0284C7] mt-0.5 flex-shrink-0" />
        <div className="space-y-1 text-xs leading-relaxed">
          <p className="font-bold uppercase tracking-wider text-[#0284C7]">
            DATASET TRANSPARENCY & PROTOCOL SPECIFICATION
          </p>
          <p className="text-slate-700">
            OSTIA SST, Multi-Observation SSS, DUACS SSH/SLA, and ARGO Float CTD casts are <strong>PROVIDED REAL DATASETS</strong>. 
            OSCAR (Surface Currents), ASCAT-C (Winds), and CCMP (10m Winds) shown in this prototype are synthetic demonstration datasets because the operational NASA/RSS datasets have not yet been downloaded. They are included only to demonstrate the complete multi-source ocean-data pipeline and can be replaced seamlessly.
          </p>
        </div>
      </div>

      {/* SECTION 1: REAL OBSERVATIONAL DATASETS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h2 className="text-base font-bold uppercase tracking-wider text-[#0F172A]">
              01 // Real Observational Datasets
            </h2>
          </div>
          <span className="badge-real">
            PROVIDED REAL DATA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Real 1: OSTIA SST */}
          <div className="card-surface border border-[#E2E8F0] p-5 space-y-3 shadow-sm bg-white">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#0284C7] border border-sky-100 flex items-center justify-center">
                  <Satellite className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">OSTIA Sea Surface Temperature (SST)</h3>
                  <p className="text-xs text-slate-500">UK Met Office / Copernicus Marine (CMEMS)</p>
                </div>
              </div>
              <span className="badge-real">
                REAL
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-1.5 pt-1">
              <div><strong className="text-[#0F172A]">ROLE:</strong> Surface thermal boundary condition determining upper-ocean heat content.</div>
              <div><strong className="text-[#0F172A]">VARIABLES:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">analysed_sst</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">analysis_error</code></div>
              <div><strong className="text-[#0F172A]">GRID:</strong> NetCDF-4, 0.05° regridded to 0.25° × 0.25° daily</div>
              <div><strong className="text-[#0F172A]">RANGE:</strong> 25.8°C to 29.6°C across Bay of Bengal (Jan 2020)</div>
            </div>
          </div>

          {/* Real 2: Multi-Observation SSS */}
          <div className="card-surface border border-[#E2E8F0] p-5 space-y-3 shadow-sm bg-white">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#0284C7] border border-sky-100 flex items-center justify-center">
                  <Waves className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">Multi-Observation Salinity (SSS)</h3>
                  <p className="text-xs text-slate-500">Copernicus Marine / SMOS + SMAP + In-situ</p>
                </div>
              </div>
              <span className="badge-real">
                REAL
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-1.5 pt-1">
              <div><strong className="text-[#0F172A]">ROLE:</strong> Establishes the Bay of Bengal low-salinity freshwater barrier layer & pycnocline stratification.</div>
              <div><strong className="text-[#0F172A]">VARIABLES:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">sos</code> (Sea Surface Salinity in PSU)</div>
              <div><strong className="text-[#0F172A]">GRID:</strong> NetCDF-4, 0.25° × 0.25° daily</div>
              <div><strong className="text-[#0F172A]">RANGE:</strong> 28.2 PSU (North runoff) to 34.6 PSU (Equatorial south)</div>
            </div>
          </div>

          {/* Real 3: DUACS Global Ocean SSH / SLA */}
          <div className="card-surface border border-[#E2E8F0] p-5 space-y-3 shadow-sm bg-white">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#0284C7] border border-sky-100 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">Sea Surface Height / SLA</h3>
                  <p className="text-xs text-slate-500">DUACS Multi-Mission Altimeter (Jason-3, Sentinel-3, SARAL)</p>
                </div>
              </div>
              <span className="badge-real">
                REAL
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-1.5 pt-1">
              <div><strong className="text-[#0F172A]">ROLE:</strong> Altimetry reveals mesoscale cyclonic (upwelling) and anticyclonic (downwelling) thermocline pumping.</div>
              <div><strong className="text-[#0F172A]">VARIABLES:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">sla</code> (m), <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">adt</code> (Absolute Dynamic Topography)</div>
              <div><strong className="text-[#0F172A]">GRID:</strong> NetCDF-4, 0.25° daily</div>
              <div><strong className="text-[#0F172A]">RANGE:</strong> -0.18 m to +0.22 m</div>
            </div>
          </div>

          {/* Real 4: ARGO Float Subsurface Observations */}
          <div className="card-surface border border-[#E2E8F0] p-5 space-y-3 shadow-sm bg-white">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">ARGO Float CTD Subsurface Profiles</h3>
                  <p className="text-xs text-slate-500">INCOIS / Indian Argo Project / International Argo GDAC</p>
                </div>
              </div>
              <span className="badge-real">
                GROUND TRUTH
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-1.5 pt-1">
              <div><strong className="text-[#0F172A]">ROLE:</strong> Physical subsurface observations (0m to 2000m) for model training and validation.</div>
              <div><strong className="text-[#0F172A]">VARIABLES:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">TEMP</code> (°C), <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">PSAL</code> (PSU), <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">DEPTH</code> (m)</div>
              <div><strong className="text-[#0F172A]">COVERAGE:</strong> Real active floats in BoB (e.g. WMO 2902695, 2902742, 2902810)</div>
              <div><strong className="text-[#0F172A]">VERTICAL LEVELS:</strong> High-resolution CTD profiles to 2000 meters depth</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: IN-SITU OBSERVATIONS & AUXILIARY DATA */}
      <div className="space-y-4">
        <div className="border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
            <h2 className="text-base font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
              <Ship className="w-4 h-4 text-[#0284C7]" />
              02 // In-Situ & Auxiliary Data Sources
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-surface border border-[#E2E8F0] p-5 space-y-2 shadow-sm bg-white">
            <h4 className="font-bold text-xs text-[#0F172A]">Research Ships (ORV Sagar Kanya, Sagar Nidhi)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              MoES ship-based deep CTD casts, XBT transects, and underway surface meteorological systems providing high-precision validation anchor points.
            </p>
          </div>
          <div className="card-surface border border-[#E2E8F0] p-5 space-y-2 shadow-sm bg-white">
            <h4 className="font-bold text-xs text-[#0F172A]">Moored Ocean Buoys (RAMA & OMNI)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              INCOIS/MoES deep-sea moored buoys (BD08, BD09, BD10, BD11) measuring continuous time-series of subsurface temperature at 10m to 500m.
            </p>
          </div>
          <div className="card-surface border border-[#E2E8F0] p-5 space-y-2 shadow-sm bg-white">
            <h4 className="font-bold text-xs text-[#0F172A]">Auxiliary Reanalysis & Bathymetry</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              GEBCO 15-arc-second bathymetry grid providing seafloor depth mask, ERA5 atmospheric reanalysis, and tidal harmonic components.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: OPTIONAL SYNTHETIC DEMONSTRATION DATASETS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h2 className="text-base font-bold uppercase tracking-wider text-[#0F172A]">
              03 // Optional Synthetic Demonstration Datasets
            </h2>
          </div>
          <span className="badge-synthetic">
            SYNTHETIC DEMO ONLY
          </span>
        </div>

        <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs leading-relaxed">
            <strong className="font-bold uppercase tracking-wider text-amber-800">NOTICE:</strong> The three datasets below are mathematically generated for the Bay of Bengal January 2020 domain to demonstrate the multi-source software pipeline. They are <strong>NOT real NASA or operational observations</strong> and are disabled when <em>Real Only Mode</em> is active.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Synthetic 1: OSCAR */}
          <div className={`card-surface border p-5 space-y-3 transition-opacity bg-white shadow-sm ${
            dataMode === 'real_only' ? 'opacity-35 border-dashed border-slate-300' : 'border-[#E2E8F0]'
          }`}>
            <div className="flex items-start justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">OSCAR Ocean Currents</h3>
                <span className="badge-synthetic mt-1">
                  SYNTHETIC DEMO
                </span>
              </div>
              <Waves className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-xs text-slate-600 space-y-1.5 pt-1">
              <div><strong className="text-[#0F172A]">VARIABLES:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">u</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">v</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">current_speed</code></div>
              <div><strong className="text-[#0F172A]">DOMAIN:</strong> 5°N–22°N, 80°E–100°E (0.25° grid)</div>
              <div><strong className="text-[#0F172A]">FORMULA:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">speed = sqrt(u² + v²)</code></div>
              <div><strong className="text-[#0F172A]">ROLE:</strong> Surface geostrophic and Ekman transport advection</div>
            </div>
          </div>

          {/* Synthetic 2: ASCAT-C */}
          <div className={`card-surface border p-5 space-y-3 transition-opacity bg-white shadow-sm ${
            dataMode === 'real_only' ? 'opacity-35 border-dashed border-slate-300' : 'border-[#E2E8F0]'
          }`}>
            <div className="flex items-start justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">ASCAT-C Surface Winds</h3>
                <span className="badge-synthetic mt-1">
                  SYNTHETIC DEMO
                </span>
              </div>
              <Wind className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-xs text-slate-600 space-y-1.5 pt-1">
              <div><strong className="text-[#0F172A]">VARIABLES:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">wind_speed</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">u_wind</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">v_wind</code></div>
              <div><strong className="text-[#0F172A]">REGIME:</strong> Northeast winter monsoon (direction ~45°)</div>
              <div><strong className="text-[#0F172A]">CADENCE:</strong> Daily 0.25° grid</div>
              <div><strong className="text-[#0F172A]">ROLE:</strong> Wind-stress induced surface turbulence & MLD deepening</div>
            </div>
          </div>

          {/* Synthetic 3: CCMP */}
          <div className={`card-surface border p-5 space-y-3 transition-opacity bg-white shadow-sm ${
            dataMode === 'real_only' ? 'opacity-35 border-dashed border-slate-300' : 'border-[#E2E8F0]'
          }`}>
            <div className="flex items-start justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">CCMP 10m Winds</h3>
                <span className="badge-synthetic mt-1">
                  SYNTHETIC DEMO
                </span>
              </div>
              <Wind className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-xs text-slate-600 space-y-1.5 pt-1">
              <div><strong className="text-[#0F172A]">VARIABLES:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">uwnd</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">vwnd</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">ws</code></div>
              <div><strong className="text-[#0F172A]">CADENCE:</strong> 6-hourly (00:00, 06:00, 12:00, 18:00 UTC)</div>
              <div><strong className="text-[#0F172A]">FORMULA:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">ws = sqrt(uwnd² + vwnd²)</code></div>
              <div><strong className="text-[#0F172A]">ROLE:</strong> High-frequency diurnal atmospheric forcing</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
