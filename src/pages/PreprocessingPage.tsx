import React, { useState } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  ArrowDown, 
  Filter, 
  Database, 
  Calendar, 
  Grid, 
  Scale, 
  Split, 
  RefreshCw,
  FileCheck
} from 'lucide-react';
import { PREPROCESSING_STAGES } from '../services/preprocessingService';

export const PreprocessingPage: React.FC = () => {
  const [selectedStageId, setSelectedStageId] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const selectedStage = PREPROCESSING_STAGES.find((s) => s.id === selectedStageId) || PREPROCESSING_STAGES[0];

  const handleRerun = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 700);
  };

  return (
    <div id="preprocessing-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge-real">STAGE 05 / 05 READY</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              BAY OF BENGAL 0.25° REGRIDDING
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-[#0284C7]" />
            Data Preprocessing & Grid Alignment Pipeline
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            End-to-end transformation of multi-source raw ocean observations into unified 0.25° × 0.25° ConvFormer tensors.
          </p>
        </div>

        <button
          onClick={handleRerun}
          disabled={isProcessing}
          className="btn-secondary px-4 py-2 text-xs font-semibold shadow-sm flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin text-[#0284C7]' : 'text-slate-500'}`} />
          {isProcessing ? 'Re-executing Pipeline...' : 'Re-run QC Pipeline'}
        </button>
      </div>

      {/* Pipeline Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-surface p-4 border border-[#E2E8F0] shadow-sm bg-white">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Raw Input Ingested</span>
          <div className="text-2xl font-black text-[#0F172A] mt-1">152,400</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Multi-source NetCDF & CSV</p>
        </div>
        <div className="card-surface p-4 border border-[#E2E8F0] shadow-sm bg-white">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">QC Acceptance Rate</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">98.31%</div>
          <p className="text-[11px] text-slate-500 mt-0.5">149,820 valid records</p>
        </div>
        <div className="card-surface p-4 border border-[#E2E8F0] shadow-sm bg-white">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">BoB 0.25° Active Cells</span>
          <div className="text-2xl font-black text-[#0284C7] mt-1">3,942</div>
          <p className="text-[11px] text-slate-500 mt-0.5">1,647 land masked</p>
        </div>
        <div className="card-surface p-4 border border-[#E2E8F0] shadow-sm bg-white">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Standardized Channels</span>
          <div className="text-2xl font-black text-[#1E3A8A] mt-1">6 Channels</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Z-score normalized</p>
        </div>
      </div>

      {/* Main Flow View: Step List on Left, Detailed Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Pipeline Steps (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Pipeline Execution Flow (Sequential)
          </h3>

          <div className="space-y-2.5">
            {PREPROCESSING_STAGES.map((stage, idx) => {
              const isSelected = stage.id === selectedStageId;
              const hasArrow = idx < PREPROCESSING_STAGES.length - 1;

              return (
                <div key={stage.id} className="space-y-1">
                  <div
                    onClick={() => setSelectedStageId(stage.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-50/70 border-cyan-400 shadow-sm ring-1 ring-cyan-400'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isSelected ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {stage.id}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">
                          {stage.title.split('. ')[1] || stage.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 pl-8 line-clamp-1">
                        {stage.description}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {stage.badge}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {stage.recordsOut.toLocaleString()} records
                      </span>
                    </div>
                  </div>

                  {hasArrow && (
                    <div className="flex justify-center py-0.5">
                      <ArrowDown className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Stage Deep Dive Inspector (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 sticky top-24">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                Stage {selectedStage.id} Inspector
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2">
                {selectedStage.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {selectedStage.description}
              </p>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Records In</span>
                <div className="text-sm font-bold text-slate-800">{selectedStage.recordsIn.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Records Out</span>
                <div className="text-sm font-bold text-emerald-700">{selectedStage.recordsOut.toLocaleString()}</div>
              </div>
              {selectedStage.rejectionOrMissingRate && (
                <div className="col-span-2 pt-1 border-t border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Filter Result</span>
                  <div className="text-xs font-bold text-amber-700">{selectedStage.rejectionOrMissingRate}</div>
                </div>
              )}
            </div>

            {/* Detailed Parameters */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Transformation Parameters
              </h4>
              <div className="divide-y divide-slate-100 text-xs">
                {selectedStage.details.map((d, i) => (
                  <div key={i} className="py-2 flex items-center justify-between">
                    <span className="text-slate-600">{d.label}:</span>
                    <span className="font-semibold text-slate-900 text-right max-w-[60%]">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                Backend Code Reference:
              </span>
              <p className="font-mono text-slate-700">
                backend/preprocessing/pipeline.py &bull; execute_preprocessing_pipeline()
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
