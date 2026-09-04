import React, { useState } from 'react';
import { 
  GitBranch, 
  ArrowDown, 
  Cpu, 
  Network, 
  Layers, 
  Database, 
  CheckCircle2, 
  Code, 
  Copy, 
  Check, 
  Info,
  Waves
} from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const [codeTab, setCodeTab] = useState<'pytorch' | 'fastapi' | 'pipeline'>('pytorch');
  const [copied, setCopied] = useState<boolean>(false);

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pytorchCode = `import torch
import torch.nn as nn
import torch.nn.functional as F

class ConvFormer(nn.Module):
    """
    Hybrid CNN-Transformer for Subsurface Ocean Temperature Prediction
    Target Region: Bay of Bengal (0.25° grid, 0m - 2000m profiles)
    """
    def __init__(self, in_channels=6, embed_dim=128, transformer_depth=4, num_depths=8):
        super().__init__()
        # 1. CNN Feature Extractor (Local Spatial Dynamics)
        self.cnn_extractor = nn.Sequential(
            nn.Conv2d(in_channels, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.GELU(),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.GELU(),
            nn.MaxPool2d(kernel_size=2, stride=2)
        )
        # 2. Patch Embedding
        self.patch_proj = nn.Conv2d(64, embed_dim, kernel_size=1)
        
        # 3. Transformer Encoder (Global Ocean Teleconnections)
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=embed_dim, nhead=8, dim_feedforward=512,
            activation="gelu", batch_first=True
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=transformer_depth)
        
        # 4. Depth Decoder (0m - 2000m Subsurface Temperature Profile)
        self.depth_decoder = nn.Sequential(
            nn.Linear(embed_dim, 256),
            nn.GELU(),
            nn.Linear(256, 128),
            nn.GELU(),
            nn.Linear(128, num_depths)
        )

    def forward(self, x):
        # x: (B, 6, H, W) -> [SST, SSS, SSH, Wind_u, Wind_v, Current_speed]
        feat = self.cnn_extractor(x)
        tokens = self.patch_proj(feat).flatten(2).transpose(1, 2)
        encoded = self.transformer(tokens)
        global_ocean_repr = encoded.mean(dim=1)
        subsurface_profile = self.depth_decoder(global_ocean_repr)
        return subsurface_profile # (B, 8) at [0, 50, 100, 200, 500, 1000, 1500, 2000m]`;

  const fastapiCode = `from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Optional

router = APIRouter(prefix="/predict", tags=["ConvFormer Prediction"])

class PredictionRequest(BaseModel):
    latitude: float = Field(..., ge=5.0, le=22.0)
    longitude: float = Field(..., ge=80.0, le=100.0)
    date: str = "2020-01-15"
    target_depth: Optional[float] = None
    sst: Optional[float] = None
    sss: Optional[float] = None
    ssh: Optional[float] = None

@router.post("")
def predict_subsurface_temperature(req: PredictionRequest):
    """
    Modular prediction endpoint. Swappable with PyTorch ConvFormer checkpoint.
    """
    profile = convformer_inference_engine(req)
    return {
        "model_name": "ConvFormer-Ocean",
        "status": "PROTOTYPE / DEMO PREDICTION",
        "disclaimer": "Prediction service is modular and can be replaced with the trained ConvFormer model.",
        "latitude": req.latitude,
        "longitude": req.longitude,
        "date": req.date,
        "profile": profile
    }`;

  const pipelineCode = `# End-to-End Execution Pipeline
1. INGESTION: Read OSTIA NetCDF (.nc), SSS, SLA and ARGO CTD profiles
2. PREPROCESSING:
   - xarray regrid to 0.25° × 0.25° mesh
   - Z-score normalization: z = (x - μ) / σ
   - Optional: Stack OSCAR currents & ASCAT winds [SYNTHETIC DEMO]
3. INFERENCE:
   - Pass 6-channel tensor to ConvFormer
   - Output 8-point vertical profile (0m to 2000m)
4. VALIDATION:
   - Collocate with nearest ARGO float trajectory
   - Calculate RMSE, MAE, R², Pearson Correlation
5. DASHBOARD:
   - Stream JSON to React Leaflet UI & Recharts charts`;

  return (
    <div id="architecture-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-real">NEURAL NETWORK SPECIFICATION</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              DEEP LEARNING ARCHITECTURE
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2.5">
              ConvFormer Model Architecture
            </h1>
            <span className="bg-sky-50 text-[#0284C7] border border-sky-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              CNN + Transformer
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-2 font-medium max-w-2xl leading-relaxed">
            Hybrid Convolutional-Transformer Deep Learning network designed for 3D subsurface ocean temperature prediction in the Bay of Bengal.
          </p>
        </div>
      </div>

      {/* Visual Pipeline Flowchart */}
      <div className="card-surface border border-[#E2E8F0] p-6 space-y-6 shadow-sm bg-white">
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
              PIPELINE WORKFLOW &bull; STAGES 01–06
            </div>
            <h3 className="text-sm font-bold text-[#0F172A] mt-0.5">
              Complete End-to-End Processing Architecture
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            0.25° RES &bull; 0–2000M
          </span>
        </div>

        {/* Vertical Pipeline Cards with connecting arrows */}
        <div className="max-w-3xl mx-auto space-y-3">
          {/* Box 1: Input Data */}
          <div className="p-5 bg-gradient-to-r from-[#0F172A] to-[#1E3A8A] text-white rounded-xl shadow-sm space-y-3 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider text-white uppercase flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-400" />
                1. Multi-Sensor Oceanic Inputs
              </span>
              <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded font-mono font-bold uppercase">
                (N × 6 × H × W) on 0.25° Grid
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-white/90 pt-1">
              <div className="bg-white/10 p-2 rounded-lg border border-white/10">
                <strong className="text-white block text-[11px] uppercase font-sans">OSTIA SST</strong>
                Surface Temp
              </div>
              <div className="bg-white/10 p-2 rounded-lg border border-white/10">
                <strong className="text-white block text-[11px] uppercase font-sans">Multi-Obs SSS</strong>
                Salinity Layer
              </div>
              <div className="bg-white/10 p-2 rounded-lg border border-white/10">
                <strong className="text-white block text-[11px] uppercase font-sans">DUACS SSH/SLA</strong>
                Eddy Pumping
              </div>
              <div className="bg-white/10 p-2 rounded-lg border border-white/10">
                <strong className="text-white block text-[11px] uppercase font-sans">Winds & Currents</strong>
                <span className="text-[10px] text-sky-200">Synthetic Optional</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-[#0284C7]" /></div>

          {/* Box 2: CNN Feature Extractor */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F172A] uppercase flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#0284C7]" />
                2. CNN Feature Extractor (Local Spatial Dynamics)
              </span>
              <span className="text-[10px] bg-sky-50 text-[#0284C7] border border-sky-200 px-2 py-0.5 rounded font-mono font-semibold uppercase">
                Conv2D / BatchNorm
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Extracts high-frequency local spatial structures: resolves mesoscale cyclonic and anticyclonic eddies (50–200 km), frontal boundaries, and coastal boundary currents.
            </p>
          </div>

          <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-[#0284C7]" /></div>

          {/* Box 3: Patch Embedding */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F172A] uppercase flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0284C7]" />
                3. Patch Embedding (Spatial Tokenization)
              </span>
              <span className="text-[10px] bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-mono font-semibold uppercase">
                2D Positional Embeddings
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Flattens spatial channels into sequence tokens, appending learnable sinusoidal positional encodings corresponding to Bay of Bengal geographic coordinates.
            </p>
          </div>

          <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-[#0284C7]" /></div>

          {/* Box 4: Transformer Encoder */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F172A] uppercase flex items-center gap-2">
                <Network className="w-4 h-4 text-[#0284C7]" />
                4. Transformer Encoder (Global Teleconnections)
              </span>
              <span className="text-[10px] bg-sky-50 text-[#0284C7] border border-sky-200 px-2 py-0.5 rounded font-mono font-semibold uppercase">
                Multi-Head Self-Attention
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Captures long-range teleconnections across the entire Bay of Bengal basin—linking northern freshwater discharge plumes with southern equatorial wave dynamics.
            </p>
          </div>

          <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-[#0284C7]" /></div>

          {/* Box 5: Global Representation & Depth Decoder */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F172A] uppercase flex items-center gap-2">
                <ArrowDown className="w-4 h-4 text-[#0284C7]" />
                5. Depth Decoder (Vertical Temperature Inversion)
              </span>
              <span className="text-[10px] bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-mono font-semibold uppercase">
                MLP Projection
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Maps the latent representation into discrete physical water column temperatures across 8 standard depth levels (0m, 50m, 100m, 200m, 500m, 1000m, 1500m, 2000m).
            </p>
          </div>

          <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-[#0284C7]" /></div>

          {/* Box 6: Subsurface Profile Output & ARGO Validation */}
          <div className="p-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-xl shadow-sm space-y-2 border border-emerald-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider text-white uppercase flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                6. Predicted Profile & ARGO Float Validation
              </span>
              <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded font-mono font-bold uppercase">
                RMSE &bull; MAE &bull; R²
              </span>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Yields continuous vertical temperature stratification curves from surface to 2000m depth with direct validation against real INCOIS ARGO CTD profiles.
            </p>
          </div>
        </div>
      </div>

      {/* Code Viewer Section */}
      <div className="card-surface border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm bg-white">
        {/* Code Header Tabs */}
        <div className="bg-[#0F172A] text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Implementation Codebase</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCodeTab('pytorch')}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
                codeTab === 'pytorch' ? 'bg-[#0284C7] text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              convformer.py
            </button>
            <button
              onClick={() => setCodeTab('fastapi')}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
                codeTab === 'fastapi' ? 'bg-[#0284C7] text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              prediction.py
            </button>
            <button
              onClick={() => setCodeTab('pipeline')}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
                codeTab === 'pipeline' ? 'bg-[#0284C7] text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              pipeline.txt
            </button>

            <button
              onClick={() => copyCode(codeTab === 'pytorch' ? pytorchCode : codeTab === 'fastapi' ? fastapiCode : pipelineCode)}
              className="ml-2 p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 transition-colors cursor-pointer border border-slate-700"
              title="Copy Code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Code Block */}
        <pre className="p-5 bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed max-h-96">
          <code>
            {codeTab === 'pytorch' && pytorchCode}
            {codeTab === 'fastapi' && fastapiCode}
            {codeTab === 'pipeline' && pipelineCode}
          </code>
        </pre>
      </div>
    </div>
  );
};
