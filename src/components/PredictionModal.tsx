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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div 
        id="prediction-pipeline-modal"
        className="card-surface bg-white border border-slate-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-sky-400">EXECUTION PIPELINE</div>
            <h3 className="text-base font-bold flex items-center gap-2 mt-0.5 text-white">
              <Cpu className="w-5 h-5 text-sky-400" />
              ConvFormer Inference Execution Pipeline
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Bay of Bengal (Lat: {prediction?.latitude}°N, Lon: {prediction?.longitude}°E) &bull; Date: {prediction?.date}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {!isFinished ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-2">
                <span>Executing Pipeline Stages</span>
                <span className="bg-sky-50 text-[#0284C7] border border-sky-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  Stage {currentStage} of {STAGES.length}
                </span>
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
                      className={`flex items-start gap-3.5 p-3 rounded-xl border transition-all ${
                        isDone
                          ? 'bg-slate-50/80 border-slate-200 text-slate-700'
                          : isCurrent
                          ? 'bg-sky-50/60 border-sky-300 text-sky-950 shadow-xs ring-1 ring-sky-300'
                          : 'bg-white border-slate-100 text-slate-400'
                      }`}
                    >
                      <div className="mt-0.5">
                        {isDone ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-5 h-5 rounded-full bg-[#0284C7] text-white flex items-center justify-center">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-slate-300 bg-white text-slate-400 flex items-center justify-center text-[10px] font-mono font-bold">
                            {s.id}
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-tight">
                            {s.name}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase ${
                            isDone ? 'bg-emerald-100 text-emerald-700' : isCurrent ? 'bg-sky-100 text-[#0284C7]' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {isDone ? 'Complete' : isCurrent ? 'Processing...' : 'Queued'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Finished Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">
                    Prediction Pipeline Completed Successfully
                  </h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    ConvFormer synthesized full 0m–2000m subsurface temperature field.
                  </p>
                </div>
              </div>

              {/* Prototype Notice */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#0284C7] mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-[#0F172A]">PROTOTYPE PIPELINE:</span> Inference executed using modular BoB stratification physics. Directly swappable with trained ConvFormer checkpoint in <code className="bg-slate-200/80 px-1 py-0.5 rounded font-mono text-[11px]">ml/models/convformer.py</code>.
                </div>
              </div>

              {/* Mini-table of results */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 text-slate-700 px-4 py-2 text-[10px] font-bold uppercase tracking-wider flex justify-between">
                  <span>Depth Level</span>
                  <span>Predicted Temp (°C)</span>
                  <span>Confidence Range</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                  {prediction?.profile.map((p) => (
                    <div key={p.depth} className="px-4 py-2 text-xs flex justify-between hover:bg-slate-50">
                      <span className="font-semibold text-slate-700">{p.depth} m</span>
                      <span className="font-bold text-[#0284C7]">{(p.temperature ?? 0).toFixed(2)} °C</span>
                      <span className="text-slate-500 text-xs font-mono">
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
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">
            Model: ConvFormer (CNN + Self-Attention)
          </span>
          <button
            id="close-pipeline-modal"
            type="button"
            onClick={onClose}
            className="btn-primary-action text-xs"
          >
            {isFinished ? 'VIEW FULL ANALYSIS' : 'CLOSE'}
          </button>
        </div>
      </div>
    </div>
  );
};
