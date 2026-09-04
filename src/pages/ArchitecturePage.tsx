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
      {/* Header - Geometric Balance Architecture */}
      <div className="border-b-2 border-[#1A1A1A] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-6 bg-[#1A1A1A] text-white flex items-center justify-center text-[10px] font-black font-mono">
              05
            </div>
            <div className="text-[10px] uppercase tracking-[0.4em] font-black text-[#1A1A1A]">
              SYSTEMS // MODEL SPECIFICATION
            </div>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#1A1A1A] flex items-center gap-2">
              ConvFormer Model Architecture
            </h1>
            <span className="bg-[#1A1A1A] text-white text-[10px] font-mono px-2 py-0.5 tracking-tighter uppercase font-bold">
              CNN + TRANSFORMER
            </span>
          </div>
          <p className="text-sm text-[#444] mt-2 font-medium max-w-2xl leading-relaxed">
            Hybrid Convolutional-Transformer Deep Learning network designed for 3D subsurface ocean temperature prediction.
          </p>
        </div>
      </div>

      {/* Visual Pipeline Flowchart */}
      <div className="bg-white border-2 border-[#1A1A1A] p-6 space-y-6">
        <div className="border-b-2 border-[#1A1A1A] pb-3 flex items-center justify-between">
          <div>
            <div className="text-[9px] uppercase tracking-[0.3em] font-mono text-[#555]">
              PIPELINE // STAGES 01–06
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-[#1A1A1A] mt-0.5">
              Complete End-to-End Processing Architecture
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-[#1A1A1A]">
            0.25° RES &bull; 0–2000M
          </span>
        </div>

        {/* Vertical Pipeline Cards with connecting arrows */}
        <div className="max-w-3xl mx-auto space-y-3">
          {/* Box 1: Input Data */}
          <div className="p-5 bg-[#1A1A1A] text-white space-y-3 border-2 border-[#1A1A1A]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black tracking-wider text-white uppercase flex items-center gap-2">
                <Database className="w-4 h-4 text-white" />
                1. MULTI-SENSOR OCEANIC INPUTS
              </span>
              <span className="text-[10px] bg-white text-[#1A1A1A] px-2 py-0.5 font-mono font-black uppercase">
                (N × 6 × H × W) on 0.25° Grid
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-white/90 pt-1">
              <div className="bg-white/10 p-2 border border-white/20">
                <strong className="text-white block text-[11px] uppercase">OSTIA SST</strong>
                Surface Temp
              </div>
              <div className="bg-white/10 p-2 border border-white/20">
                <strong className="text-white block text-[11px] uppercase">Multi-Obs SSS</strong>
                Salinity Layer
              </div>
              <div className="bg-white/10 p-2 border border-white/20">
                <strong className="text-white block text-[11px] uppercase">DUACS SSH/SLA</strong>
                Eddy Pumping
              </div>
              <div className="bg-white/10 p-2 border border-white/20">
                <strong className="text-white block text-[11px] uppercase">Winds & Currents</strong>
                <span className="text-[10px] text-white/60">Synthetic Optional</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center"><ArrowDown className="w-5 h-5 text-[#1A1A1A]" /></div>

          {/* Box 2: CNN Feature Extractor */}
          <div className="p-5 bg-white border-2 border-[#1A1A1A] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#1A1A1A] uppercase flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#1A1A1A]" />
                2. CNN FEATURE EXTRACTOR (Local Spatial Dynamics)
              </span>
              <span className="text-[10px] bg-[#1A1A1A] text-white px-2 py-0.5 font-mono font-bold uppercase">
                Conv2D / BatchNorm
              </span>
            </div>
            <p className="text-xs font-mono text-[#333] leading-relaxed">
              Extracts high-frequency local spatial structures: resolves mesoscale cyclonic and anticyclonic eddies (50–200 km), frontal boundaries, and coastal boundary currents.
            </p>
          </div>

          <div className="flex justify-center"><ArrowDown className="w-5 h-5 text-[#1A1A1A]" /></div>

          {/* Box 3: Patch Embedding */}
          <div className="p-5 bg-[#F8F7F5] border-2 border-[#1A1A1A] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#1A1A1A] uppercase flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#1A1A1A]" />
                3. PATCH EMBEDDING (Spatial Tokenization)
              </span>
              <span className="text-[10px] bg-[#1A1A1A] text-white px-2 py-0.5 font-mono font-bold uppercase">
                2D Positional Embeddings
              </span>
            </div>
            <p className="text-xs font-mono text-[#333] leading-relaxed">
              Flattens spatial channels into sequence tokens, appending learnable sinusoidal positional encodings corresponding to Bay of Bengal geographic coordinates.
            </p>
          </div>

          <div className="flex justify-center"><ArrowDown className="w-5 h-5 text-[#1A1A1A]" /></div>

          {/* Box 4: Transformer Encoder */}
          <div className="p-5 bg-white border-2 border-[#1A1A1A] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#1A1A1A] uppercase flex items-center gap-2">
                <Network className="w-4 h-4 text-[#1A1A1A]" />
                4. TRANSFORMER ENCODER (Global Teleconnections)
              </span>
              <span className="text-[10px] bg-[#1A1A1A] text-white px-2 py-0.5 font-mono font-bold uppercase">
                Multi-Head Self-Attention
              </span>
            </div>
            <p className="text-xs font-mono text-[#333] leading-relaxed">
              Captures long-range teleconnections across the entire Bay of Bengal basin—linking northern freshwater discharge plumes with southern equatorial wave dynamics.
            </p>
          </div>

          <div className="flex justify-center"><ArrowDown className="w-5 h-5 text-[#1A1A1A]" /></div>

          {/* Box 5: Global Representation & Depth Decoder */}
          <div className="p-5 bg-[#F8F7F5] border-2 border-[#1A1A1A] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#1A1A1A] uppercase flex items-center gap-2">
                <ArrowDown className="w-4 h-4 text-[#1A1A1A]" />
                5. DEPTH DECODER (Vertical Temperature Inversion)
              </span>
              <span className="text-[10px] bg-[#1A1A1A] text-white px-2 py-0.5 font-mono font-bold uppercase">
                MLP Projection
              </span>
            </div>
            <p className="text-xs font-mono text-[#333] leading-relaxed">
              Maps the latent representation into discrete physical water column temperatures across 8 standard depth levels (0m, 50m, 100m, 200m, 500m, 1000m, 1500m, 2000m).
            </p>
          </div>

          <div className="flex justify-center"><ArrowDown className="w-5 h-5 text-[#1A1A1A]" /></div>

          {/* Box 6: Subsurface Profile Output & ARGO Validation */}
          <div className="p-5 bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black tracking-wider text-white uppercase flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white" />
                6. PREDICTED PROFILE & ARGO FLOAT VALIDATION
              </span>
              <span className="text-[10px] bg-white text-[#1A1A1A] px-2 py-0.5 font-mono font-black uppercase">
                RMSE &bull; MAE &bull; R²
              </span>
            </div>
            <p className="text-xs font-mono text-white/90 leading-relaxed">
              Yields continuous vertical temperature stratification curves from surface to 2000m depth with direct validation against real INCOIS ARGO CTD profiles.
            </p>
          </div>
        </div>
      </div>

      {/* Code Viewer Section */}
      <div className="bg-white border-2 border-[#1A1A1A] overflow-hidden">
        {/* Code Header Tabs */}
        <div className="bg-[#1A1A1A] text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-white" />
            <span className="text-xs font-black uppercase tracking-wider">Implementation Codebase</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCodeTab('pytorch')}
              className={`px-3 py-1 text-xs font-mono uppercase font-bold transition-colors cursor-pointer ${
                codeTab === 'pytorch' ? 'bg-white text-[#1A1A1A]' : 'text-white/70 hover:text-white'
              }`}
            >
              convformer.py
            </button>
            <button
              onClick={() => setCodeTab('fastapi')}
              className={`px-3 py-1 text-xs font-mono uppercase font-bold transition-colors cursor-pointer ${
                codeTab === 'fastapi' ? 'bg-white text-[#1A1A1A]' : 'text-white/70 hover:text-white'
              }`}
            >
              prediction.py
            </button>
            <button
              onClick={() => setCodeTab('pipeline')}
              className={`px-3 py-1 text-xs font-mono uppercase font-bold transition-colors cursor-pointer ${
                codeTab === 'pipeline' ? 'bg-white text-[#1A1A1A]' : 'text-white/70 hover:text-white'
              }`}
            >
              pipeline.txt
            </button>

            <button
              onClick={() => copyCode(codeTab === 'pytorch' ? pytorchCode : codeTab === 'fastapi' ? fastapiCode : pipelineCode)}
              className="ml-2 p-1.5 bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/20"
              title="Copy Code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Code Block */}
        <pre className="p-5 bg-[#0F0F0F] text-[#E0E0E0] text-xs font-mono overflow-x-auto leading-relaxed max-h-96">
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
