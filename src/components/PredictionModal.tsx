import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  Cpu, 
  Database, 
  Layers, 
  Network, 
  ArrowDown, 
  X, 
  Check, 
  Activity,
  AlertCircle
} from 'lucide-react';
import { PredictionOutput } from '../types/ocean';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  prediction: PredictionOutput | null;
  onComplete?: () => void;
}

const STAGES = [
  { id: 1, name: 'DATA COLLECTION', desc: 'Fetching OSTIA SST, SSS, SSH & Atmospheric boundary feeds', icon: Database },
  { id: 2, name: 'PREPROCESSING', desc: 'Bilinear 0.25° regridding, QC flags check & Z-score normalization', icon: Layers },
  { id: 3, name: 'FEATURE EXTRACTION', desc: 'CNN multi-scale kernel convolutions for local eddies & coastal gradients', icon: Cpu },
  { id: 4, name: 'CONVFORMER', desc: 'Patch embedding + Multi-Head Self-Attention for basin-wide teleconnections', icon: Network },
  { id: 5, name: 'DEPTH DECODER', desc: 'Decoding latent ocean tokens to 8 discrete subsurface vertical levels (0-2000m)', icon: ArrowDown },
  { id: 6, name: 'PREDICTION', desc: 'Synthesizing subsurface vertical temperature profile for Bay of Bengal', icon: Activity },
  { id: 7, name: 'VALIDATION', desc: 'Collocating with nearest ARGO float trajectory for baseline verification', icon: CheckCircle2 }
];

export const PredictionModal: React.FC<Props> = ({ isOpen, onClose, prediction }) => {
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStage(1);
      setIsFinished(false);
      return;
    }

    let stage = 1;
    const interval = setInterval(() => {
      stage += 1;
      if (stage <= STAGES.length) {
        setCurrentStage(stage);
      } else {
        setIsFinished(true);
        clearInterval(interval);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/80 backdrop-blur-none p-4">
      <div 
        id="prediction-pipeline-modal"
        className="bg-white border-4 border-[#1A1A1A] w-full max-w-2xl overflow-hidden shadow-none"
      >
        {/* Header */}
        <div className="bg-[#1A1A1A] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#1A1A1A]">
          <div>
            <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#999]">EXECUTION // STAGE PIPELINE</div>
            <h3 className="text-base font-black uppercase tracking-wider flex items-center gap-2 mt-0.5">
              <Cpu className="w-5 h-5 text-white" />
              ConvFormer Inference Execution Pipeline
            </h3>
            <p className="text-xs text-[#aaa] font-mono mt-1">
              BAY OF BENGAL (LAT: {prediction?.latitude}°N, LON: {prediction?.longitude}°E) &bull; DATE: {prediction?.date}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white hover:bg-white/20 transition-colors border border-white/20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {!isFinished ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider border-b-2 border-[#1A1A1A] pb-2">
                <span>Executing Pipeline Stages</span>
                <span className="bg-[#1A1A1A] text-white px-2 py-0.5 text-[10px]">STAGE {currentStage} / {STAGES.length}</span>
              </div>

              {/* Pipeline List */}
              <div className="space-y-2.5">
                {STAGES.map((s) => {
                  const Icon = s.icon;
                  const isDone = currentStage > s.id;
                  const isCurrent = currentStage === s.id;

                  return (
                    <div
                      key={s.id}
                      className={`flex items-start gap-3.5 p-3 border-2 transition-all ${
                        isDone
                          ? 'bg-[#F8F7F5] border-[#1A1A1A] text-[#1A1A1A]'
                          : isCurrent
                          ? 'bg-white border-[#1A1A1A] text-[#1A1A1A] shadow-none ring-2 ring-[#1A1A1A]'
                          : 'bg-[#FDFCFB] border-[#1A1A1A]/30 text-[#888]'
                      }`}
                    >
                      <div className="mt-0.5">
                        {isDone ? (
                          <div className="w-5 h-5 bg-[#1A1A1A] text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-5 h-5 bg-[#1A1A1A] text-white flex items-center justify-center">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 border border-[#1A1A1A] bg-white text-[#1A1A1A] flex items-center justify-center text-[10px] font-mono font-bold">
                            {s.id}
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-tight">
                            {s.name}
                          </span>
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 border border-[#1A1A1A] uppercase">
                            {isDone ? 'COMPLETE' : isCurrent ? 'PROCESSING...' : 'QUEUED'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#555] mt-1 font-mono">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Finished Banner */}
              <div className="bg-[#F8F7F5] border-2 border-[#1A1A1A] p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1A1A1A] text-white flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-[#1A1A1A]">
                    Prediction Pipeline Completed Successfully
                  </h4>
                  <p className="text-xs text-[#555] font-mono mt-0.5">
                    ConvFormer synthesized full 0m–2000m subsurface temperature field.
                  </p>
                </div>
              </div>

              {/* Prototype Notice */}
              <div className="bg-white border-2 border-[#1A1A1A] p-3 text-xs text-[#1A1A1A] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#1A1A1A] mt-0.5 flex-shrink-0" />
                <div className="font-mono text-[11px]">
                  <span className="font-bold">PROTOTYPE PIPELINE:</span> Inference executed using modular BoB stratification physics. Directly swappable with trained ConvFormer checkpoint in <code className="bg-[#EBE9E4] px-1 py-0.5 border border-[#1A1A1A]">ml/models/convformer.py</code>.
                </div>
              </div>

              {/* Mini-table of results */}
              <div className="border-2 border-[#1A1A1A] overflow-hidden">
                <div className="bg-[#1A1A1A] text-white px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-wider flex justify-between">
                  <span>Depth Level</span>
                  <span>Predicted Temp (°C)</span>
                  <span>Confidence Range</span>
                </div>
                <div className="divide-y-2 divide-[#1A1A1A] max-h-48 overflow-y-auto">
                  {prediction?.profile.map((p) => (
                    <div key={p.depth} className="px-4 py-2 text-xs flex justify-between font-mono hover:bg-[#F8F7F5]">
                      <span className="font-bold text-[#1A1A1A]">{p.depth} m</span>
                      <span className="font-black text-[#1A1A1A]">{p.temperature.toFixed(2)} °C</span>
                      <span className="text-[#666] text-[11px]">
                        [{p.confidenceLow} – {p.confidenceHigh}] °C
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#F8F7F5] px-6 py-4 border-t-2 border-[#1A1A1A] flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">
            MODEL // CONVFORMER (CNN + ATTENTION)
          </span>
          <button
            id="close-pipeline-modal"
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-[#1A1A1A] text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-black transition-all border-2 border-[#1A1A1A] cursor-pointer"
          >
            {isFinished ? 'VIEW FULL ANALYSIS' : 'CLOSE'}
          </button>
        </div>
      </div>
    </div>
  );
};
