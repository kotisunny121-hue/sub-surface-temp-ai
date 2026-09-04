import React, { useState } from 'react';
import { 
  BookOpen, 
  Terminal, 
  Copy, 
  Check, 
  FileText, 
  Layers, 
  Cpu, 
  Database, 
  ExternalLink,
  BookMarked
} from 'lucide-react';

export const DocumentationPage: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const quickstartCmds = `# 1. Backend Environment & Setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install -r requirements.txt

# 2. Run FastAPI Backend (Serves /api/predict, /api/validate, /api/data)
python main.py

# 3. Frontend Setup (React 18 + Vite + Tailwind + Leaflet)
npm install
npm run dev`;

  const trainingCmds = `# Train ConvFormer on Bay of Bengal NetCDF & ARGO CTD datasets
python -m ml.training.train --epochs 50 --batch_size 16 --region bob --lr 0.0001 --device cuda`;

  const inferenceCmds = `# Run standalone batch inference on test Argo profiles
python ml/inference/predict.py --lat 14.5 --lon 88.5 --date 2020-01-15 --depth 100`;

  return (
    <div id="documentation-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header - Geometric Balance Architecture */}
      <div className="border-b-2 border-[#1A1A1A] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-6 bg-[#1A1A1A] text-white flex items-center justify-center text-[10px] font-black font-mono">
              07
            </div>
            <div className="text-[10px] uppercase tracking-[0.4em] font-black text-[#1A1A1A]">
              SPECIFICATION // REPRODUCIBILITY GUIDE
            </div>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#1A1A1A] flex items-center gap-2">
              System Documentation & Guide
            </h1>
            <span className="bg-[#1A1A1A] text-white text-[10px] font-mono px-2 py-0.5 tracking-tighter uppercase font-bold">
              OPEN ACCESS
            </span>
          </div>
          <p className="text-sm text-[#444] mt-2 font-medium max-w-2xl leading-relaxed">
            Full technical reproduction instructions, CLI scripts, training commands, API schemas, and official scientific citations.
          </p>
        </div>
      </div>

      {/* Grid: Quickstart & Training */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box 1: Quickstart Commands */}
        <div className="bg-white border-2 border-[#1A1A1A] overflow-hidden space-y-0">
          <div className="bg-[#1A1A1A] text-white p-3.5 flex items-center justify-between border-b-2 border-[#1A1A1A]">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-white" />
              <span className="text-xs font-black uppercase tracking-wider">Quickstart: Run Full-Stack System</span>
            </div>
            <button
              onClick={() => handleCopy(quickstartCmds, 'quickstart')}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/20"
              title="Copy Commands"
            >
              {copiedSection === 'quickstart' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <pre className="p-4 bg-[#0F0F0F] text-[#E0E0E0] text-xs font-mono overflow-x-auto leading-relaxed">
            <code>{quickstartCmds}</code>
          </pre>
        </div>

        {/* Box 2: ConvFormer Model Training */}
        <div className="bg-white border-2 border-[#1A1A1A] overflow-hidden space-y-0">
          <div className="bg-[#1A1A1A] text-white p-3.5 flex items-center justify-between border-b-2 border-[#1A1A1A]">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-white" />
              <span className="text-xs font-black uppercase tracking-wider">Model Training Command</span>
            </div>
            <button
              onClick={() => handleCopy(trainingCmds, 'training')}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/20"
              title="Copy Command"
            >
              {copiedSection === 'training' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <pre className="p-4 bg-[#0F0F0F] text-[#E0E0E0] text-xs font-mono overflow-x-auto leading-relaxed">
            <code>{trainingCmds}</code>
          </pre>
          <div className="p-4 bg-[#F8F7F5] border-t-2 border-[#1A1A1A] text-xs font-mono text-[#333]">
            <strong className="text-[#1A1A1A] uppercase">Training Details:</strong> Ingests collocated 0.25° grid NetCDF files and matches them with ARGO float CTD ground truth targets using AdamW optimizer with cosine annealing schedule.
          </div>
        </div>
      </div>

      {/* REST API Endpoints Specification */}
      <div className="bg-white border-2 border-[#1A1A1A] p-6 space-y-4">
        <div className="border-b-2 border-[#1A1A1A] pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#1A1A1A]" />
            <h3 className="text-base font-black uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#1A1A1A]" />
              07.2 // FASTAPI REST API REFERENCE
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#666] uppercase">OPENAPI 3.1</span>
        </div>

        <div className="divide-y-2 divide-[#1A1A1A]/10 text-xs font-mono">
          {/* Endpoint 1: Health */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-[#1A1A1A] text-white font-mono font-bold px-2 py-0.5 text-[10px]">
                  GET
                </span>
                <code className="text-[#1A1A1A] font-bold">/api/health</code>
              </div>
              <p className="text-[#555]">Check service health, environment status, and model readiness.</p>
            </div>
            <span className="text-[#444] text-[11px] bg-[#F8F7F5] px-2 py-1 border border-[#1A1A1A]/20">Returns: &#123; status: "healthy", region: "bay_of_bengal" &#125;</span>
          </div>

          {/* Endpoint 2: Predict */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-[#1A1A1A] text-white font-mono font-bold px-2 py-0.5 text-[10px]">
                  POST
                </span>
                <code className="text-[#1A1A1A] font-bold">/api/predict</code>
              </div>
              <p className="text-[#555]">Run ConvFormer inference for given coordinates, date, and depth horizons.</p>
            </div>
            <span className="text-[#444] text-[11px] bg-[#F8F7F5] px-2 py-1 border border-[#1A1A1A]/20">Payload: PredictionRequest</span>
          </div>

          {/* Endpoint 3: Validate */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-[#1A1A1A] text-white font-mono font-bold px-2 py-0.5 text-[10px]">
                  GET
                </span>
                <code className="text-[#1A1A1A] font-bold">/api/validate?wmo_id=2902695</code>
              </div>
              <p className="text-[#555]">Retrieve collocated ARGO profile, prediction residuals, RMSE, MAE, R², and correlation.</p>
            </div>
            <span className="text-[#444] text-[11px] bg-[#F8F7F5] px-2 py-1 border border-[#1A1A1A]/20">Returns: ValidationMetrics</span>
          </div>

          {/* Endpoint 4: Data Layers */}
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-[#1A1A1A] text-white font-mono font-bold px-2 py-0.5 text-[10px]">
                  GET
                </span>
                <code className="text-[#1A1A1A] font-bold">/api/data/argo-floats</code>
              </div>
              <p className="text-[#555]">List all real active INCOIS ARGO profiling floats in the Bay of Bengal domain.</p>
            </div>
            <span className="text-[#444] text-[11px] bg-[#F8F7F5] px-2 py-1 border border-[#1A1A1A]/20">Returns: List[ArgoFloat]</span>
          </div>
        </div>
      </div>

      {/* SCIENTIFIC DATA CITATIONS SECTION */}
      <div className="bg-white border-2 border-[#1A1A1A] p-6 space-y-4">
        <div className="border-b-2 border-[#1A1A1A] pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#1A1A1A]" />
            <h3 className="text-base font-black uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-[#1A1A1A]" />
              07.3 // SCIENTIFIC CITATIONS & DATA ATTRIBUTION
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#666] uppercase">PEER-REVIEWED</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 bg-[#F8F7F5] border-2 border-[#1A1A1A] space-y-1.5">
            <span className="font-black uppercase text-[#1A1A1A]">OSTIA SST (Sea Surface Temperature)</span>
            <p className="text-[#444] leading-relaxed">
              Donlon, C. J., et al. (2012). The Operational Sea Surface Temperature and Sea Ice Analysis (OSTIA) system. <em>Remote Sensing of Environment</em>, 116, 140-158. UK Met Office & Copernicus Marine Environment Monitoring Service (CMEMS).
            </p>
          </div>

          <div className="p-4 bg-[#F8F7F5] border-2 border-[#1A1A1A] space-y-1.5">
            <span className="font-black uppercase text-[#1A1A1A]">Multi-Observation SSS (Sea Surface Salinity)</span>
            <p className="text-[#444] leading-relaxed">
              Droghei, R., et al. (2016). A new global monthly sea surface salinity optimal interpolation product based on SMOS and in-situ observations. Copernicus Marine Service (CMEMS MULTIOBS_GLO_PHY_REP_015_002).
            </p>
          </div>

          <div className="p-4 bg-[#F8F7F5] border-2 border-[#1A1A1A] space-y-1.5">
            <span className="font-black uppercase text-[#1A1A1A]">DUACS SSH / SLA (Altimeter Sea Level Anomaly)</span>
            <p className="text-[#444] leading-relaxed">
              Pujol, M.-I., et al. (2016). DUACS DT2014: the new multi-mission altimeter data set reprocessed over 20 years. <em>Ocean Science</em>, 12(5), 1067-1090. E.U. Copernicus Marine Service (SEALEVEL_GLO_PHY_L4_MY_008_047).
            </p>
          </div>

          <div className="p-4 bg-[#F8F7F5] border-2 border-[#1A1A1A] space-y-1.5">
            <span className="font-black uppercase text-[#1A1A1A]">ARGO Float In-Situ Observations</span>
            <p className="text-[#444] leading-relaxed">
              Argo (2020). Argo float data and metadata from Global Data Assembly Centre (GDAC). SEANOE. Indian National Centre for Ocean Information Services (INCOIS), MoES, Hyderabad, India.
            </p>
          </div>

          <div className="p-4 bg-[#F8F7F5] border-2 border-[#1A1A1A] space-y-1.5 md:col-span-2">
            <span className="font-black uppercase text-[#1A1A1A]">Synthetic Demonstration Datasets (OSCAR, ASCAT-C, CCMP)</span>
            <p className="text-[#444] leading-relaxed">
              Generated demonstration datasets for pipeline testing. In operational deployment, OSCAR is sourced from NASA JPL Physical Oceanography DAAC, ASCAT-C from EUMETSAT, and CCMP from Remote Sensing Systems (RSS).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
