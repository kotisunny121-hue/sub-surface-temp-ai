import React from 'react';
import { 
  Trophy, 
  Target, 
  Flame, 
  CloudRain, 
  Fish, 
  Waves, 
  Compass, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const HackathonPage: React.FC = () => {
  return (
    <div id="hackathon-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header - Geometric Balance Architecture */}
      <div className="border-b-2 border-[#1A1A1A] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-6 bg-[#1A1A1A] text-white flex items-center justify-center text-[10px] font-black font-mono">
              06
            </div>
            <div className="text-[10px] uppercase tracking-[0.4em] font-black text-[#1A1A1A]">
              MANDATE // SIH PROBLEM STATEMENT
            </div>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#1A1A1A] flex items-center gap-2">
              Smart India Hackathon & INCOIS Mission
            </h1>
            <span className="bg-[#1A1A1A] text-white text-[10px] font-mono px-2 py-0.5 tracking-tighter uppercase font-bold">
              MoES // INCOIS
            </span>
          </div>
          <p className="text-sm text-[#444] mt-2 font-medium max-w-2xl leading-relaxed">
            Ministry of Earth Sciences (MoES) & Indian National Centre for Ocean Information Services (INCOIS) Challenge
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F8F7F5] px-3 py-2 border-2 border-[#1A1A1A] text-xs font-mono font-bold text-[#1A1A1A]">
          <ShieldCheck className="w-4 h-4 text-[#1A1A1A]" />
          SWAPPABLE ML ENGINE &bull; PROTOTYPE READY
        </div>
      </div>

      {/* Problem Statement & Mission Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Problem Statement */}
        <div className="bg-white border-2 border-[#1A1A1A] p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-[#1A1A1A]/20 pb-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#1A1A1A]">
              <Target className="w-4 h-4 text-[#1A1A1A]" />
              THE PROBLEM STATEMENT
            </div>
            <span className="text-[10px] font-mono font-bold bg-[#1A1A1A] text-white px-2 py-0.5 uppercase">
              CHALLENGE
            </span>
          </div>
          <h2 className="text-lg font-black uppercase tracking-tight text-[#1A1A1A]">
            Reconstructing 3D Subsurface Ocean Thermal Structure from 2D Satellite Observations
          </h2>
          <p className="text-xs font-mono text-[#444] leading-relaxed">
            Satellites continuously observe surface ocean parameters (SST, SSS, SSH, surface winds) across vast basins at high spatial and temporal resolutions. However, electromagnetic radiation cannot penetrate seawater, leaving the vast subsurface ocean (0m to 2000m) hidden.
          </p>
          <p className="text-xs font-mono text-[#444] leading-relaxed">
            Traditional physics-based ocean general circulation models (OGCMs) require massive supercomputing power and hours to run. This project builds an AI-driven, deep-learning pipeline (<strong>ConvFormer</strong>) that bridges the 2D surface to 3D subsurface gap in real time.
          </p>
        </div>

        {/* Card 2: Core Objectives */}
        <div className="bg-white border-2 border-[#1A1A1A] p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-[#1A1A1A]/20 pb-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#1A1A1A]">
              <Sparkles className="w-4 h-4 text-[#1A1A1A]" />
              CORE PROJECT OBJECTIVES
            </div>
            <span className="text-[10px] font-mono font-bold bg-[#1A1A1A] text-white px-2 py-0.5 uppercase">
              TARGETS
            </span>
          </div>
          <div className="space-y-3 text-xs font-mono text-[#333] pt-1">
            <div className="flex items-start gap-2.5">
              <span className="w-4 h-4 bg-[#1A1A1A] text-white flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">
                1
              </span>
              <span><strong className="text-[#1A1A1A]">Basin-Wide Coverage:</strong> 0.25° × 0.25° grid across the Bay of Bengal (5.0°N–22.0°N, 80.0°E–100.0°E).</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-4 h-4 bg-[#1A1A1A] text-white flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">
                2
              </span>
              <span><strong className="text-[#1A1A1A]">Deep Water Profiling:</strong> Continuous vertical reconstruction across 8 standard depth levels from 0m to 2000m abyss.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-4 h-4 bg-[#1A1A1A] text-white flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">
                3
              </span>
              <span><strong className="text-[#1A1A1A]">Ground-Truth Validation:</strong> Benchmark against INCOIS ARGO profiling floats to guarantee physical consistency.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-4 h-4 bg-[#1A1A1A] text-white flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">
                4
              </span>
              <span><strong className="text-[#1A1A1A]">Modular Production Architecture:</strong> End-to-end FastAPI + React system with swappable PyTorch inference backend.</span>
            </div>
          </div>
        </div>
      </div>

      {/* WHY SUBSURFACE TEMPERATURE PREDICTION IS CRITICAL (5 Key Pillars) */}
      <div className="space-y-4">
        <div className="border-b-2 border-[#1A1A1A] pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#1A1A1A]" />
            <h2 className="text-base font-black uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2">
              <Waves className="w-4 h-4 text-[#1A1A1A]" />
              06.2 // CRITICAL OPERATIONAL & SCIENTIFIC IMPACT
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#666] uppercase">
            5 DOMAIN VECTORS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Impact 1: Cyclone Intensification */}
          <div className="bg-white border-2 border-[#1A1A1A] p-5 space-y-2.5">
            <div className="w-8 h-8 bg-[#1A1A1A] text-white flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-tight text-[#1A1A1A]">
              Tropical Cyclone Rapid Intensification
            </h3>
            <p className="text-xs font-mono text-[#444] leading-relaxed">
              Surface SST alone fails to predict sudden cyclone explosive intensification. Tropical Cyclone Heat Potential (TCHP)—the integrated heat content above the 26°C isotherm—is the true engine. Deep warm layers prevent cold-water upwelling, fueling super-cyclones like Fani, Amphan, and Mocha.
            </p>
          </div>

          {/* Impact 2: Monsoon Forecasting */}
          <div className="bg-white border-2 border-[#1A1A1A] p-5 space-y-2.5">
            <div className="w-8 h-8 bg-[#1A1A1A] text-white flex items-center justify-center">
              <CloudRain className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-tight text-[#1A1A1A]">
              Indian Summer Monsoon Forecasting
            </h3>
            <p className="text-xs font-mono text-[#444] leading-relaxed">
              Thermal stratification and freshwater barrier layers in the northern Bay of Bengal trap solar heat in a shallow mixed layer. This triggers intra-seasonal monsoon oscillations (MISO) and active-break spells vital for Indian agriculture and food security.
            </p>
          </div>

          {/* Impact 3: Fisheries & Marine Biology */}
          <div className="bg-white border-2 border-[#1A1A1A] p-5 space-y-2.5">
            <div className="w-8 h-8 bg-[#1A1A1A] text-white flex items-center justify-center">
              <Fish className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-tight text-[#1A1A1A]">
              Potential Fishing Zones (PFZ) & Ecosystems
            </h3>
            <p className="text-xs font-mono text-[#444] leading-relaxed">
              Pelagic fish species (tuna, mackerel) aggregate along thermocline boundaries and upwelling eddy edges. Precise 3D temperature profiling assists INCOIS PFZ advisory services for coastal fishermen.
            </p>
          </div>

          {/* Impact 4: Ocean Heat Content (OHC) */}
          <div className="bg-white border-2 border-[#1A1A1A] p-5 space-y-2.5">
            <div className="w-8 h-8 bg-[#1A1A1A] text-white flex items-center justify-center">
              <Waves className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-tight text-[#1A1A1A]">
              Ocean Heat Content (OHC) & Climate
            </h3>
            <p className="text-xs font-mono text-[#444] leading-relaxed">
              Over 90% of excess planetary heat is absorbed into the subsurface ocean. Monitoring the 0–2000m thermal inventory tracks thermal expansion, steric sea-level rise along India's 7,500 km coastline, and marine heatwaves.
            </p>
          </div>

          {/* Impact 5: Indian Ocean Dipole (IOD) */}
          <div className="bg-white border-2 border-[#1A1A1A] p-5 space-y-2.5">
            <div className="w-8 h-8 bg-[#1A1A1A] text-white flex items-center justify-center">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-tight text-[#1A1A1A]">
              Indian Ocean Dipole & Equatorial Waves
            </h3>
            <p className="text-xs font-mono text-[#444] leading-relaxed">
              Equatorial Kelvin waves travel along the equator and reflect around the Bay of Bengal rim as coastal Kelvin waves, modulating thermocline depth and driving basin-wide climate anomalies.
            </p>
          </div>

          {/* INCOIS Alignment Box */}
          <div className="bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] p-5 space-y-2.5">
            <span className="text-[10px] font-mono tracking-widest text-white/70 uppercase">
              OPERATIONAL INTEGRATION
            </span>
            <h3 className="text-sm font-black uppercase tracking-tight text-white">
              INCOIS Mission Alignment
            </h3>
            <p className="text-xs font-mono text-white/80 leading-relaxed">
              Engineered to augment INCOIS Ocean State Forecast (OSF) systems, assimilating into automated early warning dashboards with sub-second neural inference.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
