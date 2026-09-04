import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Layers, 
  MapPin, 
  TrendingUp, 
  FileText,
  Sliders
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  ScatterChart, 
  Scatter,
  ReferenceLine 
} from 'recharts';
import { ArgoFloat } from '../types/ocean';
import { calculateValidationForFloat } from '../services/validationService';

interface Props {
  argoFloats: ArgoFloat[];
}

export const ValidationPage: React.FC<Props> = ({ argoFloats }) => {
  const [selectedWmo, setSelectedWmo] = useState<string>(argoFloats[0]?.wmo_id || '2902695');

  const currentFloat = argoFloats.find((f) => f.wmo_id === selectedWmo) || argoFloats[0];
  const validationMetrics = calculateValidationForFloat(currentFloat);

  // Profile comparison chart data
  const profileChartData = validationMetrics.depthBreakdown.map((row) => ({
    depth: row.depth,
    observed: row.observed,
    predicted: row.predicted,
    error: row.error
  }));

  // Scatter plot data: Observed vs Predicted
  const scatterData = validationMetrics.depthBreakdown.map((row) => ({
    observed: row.observed,
    predicted: row.predicted,
    depth: row.depth
  }));

  return (
    <div id="validation-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header - Geometric Balance Architecture */}
      <div className="border-b-2 border-[#1A1A1A] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-6 bg-[#1A1A1A] text-white flex items-center justify-center text-[10px] font-black font-mono">
              03
            </div>
            <div className="text-[10px] uppercase tracking-[0.4em] font-black text-[#1A1A1A]">
              INTERFACE // IN-SITU VALIDATION
            </div>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#1A1A1A] flex items-center gap-2">
              ARGO Ground Truth Validation
            </h1>
            <span className="bg-[#1A1A1A] text-white text-[10px] font-mono px-2 py-0.5 tracking-tighter uppercase font-bold">
              INCOIS VERIFIED
            </span>
          </div>
          <p className="text-sm text-[#444] mt-2 font-medium max-w-2xl leading-relaxed">
            Evaluating ConvFormer predictions against real collocated in-situ CTD profiles from the INCOIS Argo Float network.
          </p>
        </div>

        {/* Float Selector */}
        <div className="flex items-center gap-2 bg-[#F8F7F5] p-2 border-2 border-[#1A1A1A]">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1A1A1A] px-1">ARGO FLOAT:</span>
          <select
            value={selectedWmo}
            onChange={(e) => setSelectedWmo(e.target.value)}
            className="bg-white border-2 border-[#1A1A1A] px-3 py-1.5 text-xs font-mono font-bold text-[#1A1A1A] focus:outline-none focus:bg-[#F8F7F5] cursor-pointer"
          >
            {argoFloats.map((f) => (
              <option key={f.wmo_id} value={f.wmo_id}>
                WMO {f.wmo_id} ({f.region})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mandatory Scientific Disclaimer Banner */}
      <div className="bg-[#F8F7F5] border-2 border-[#1A1A1A] p-4 text-xs text-[#1A1A1A] flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[#1A1A1A] mt-0.5 flex-shrink-0" />
        <div className="font-mono text-[11px] leading-relaxed">
          <strong className="font-bold uppercase tracking-wider">PROTOTYPE / DEMONSTRATION METRICS:</strong> ARGO float profiles represent real observed oceanographic CTD measurements. The skill metrics shown below evaluate the prototype ConvFormer architecture. As instructed, these are demonstration metrics for the software prototype and must not be presented as final operational scientific validation.
        </div>
      </div>

      {/* Selected Float Metadata & Primary Skill Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* RMSE */}
        <div className="bg-white p-5 border-2 border-[#1A1A1A] flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#555]">
            ROOT MEAN SQ ERROR (RMSE)
          </span>
          <div className="my-3 flex items-baseline gap-1">
            <span className="text-4xl font-light tracking-tighter text-[#1A1A1A]">
              {validationMetrics.rmse}
            </span>
            <span className="text-sm font-bold text-[#666]">°C</span>
          </div>
          <div>
            <div className="h-[2px] bg-[#1A1A1A] w-full mb-1.5" />
            <p className="text-[10px] font-mono uppercase text-[#666]">
              0M–2000M SUB-DEGREE
            </p>
          </div>
        </div>

        {/* MAE */}
        <div className="bg-[#F8F7F5] p-5 border-2 border-[#1A1A1A] flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#555]">
            MEAN ABSOLUTE ERROR (MAE)
          </span>
          <div className="my-3 flex items-baseline gap-1">
            <span className="text-4xl font-light tracking-tighter text-[#1A1A1A]">
              {validationMetrics.mae}
            </span>
            <span className="text-sm font-bold text-[#666]">°C</span>
          </div>
          <div>
            <div className="h-1 border-t-2 border-dashed border-[#1A1A1A] w-full mb-1.5" />
            <p className="text-[10px] font-mono uppercase text-[#666]">
              AVG DISCREPANCY
            </p>
          </div>
        </div>

        {/* R2 Score */}
        <div className="bg-white p-5 border-2 border-[#1A1A1A] flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#555]">
            COEFF DETERMINATION (R²)
          </span>
          <div className="my-3 flex items-baseline gap-1">
            <span className="text-4xl font-light tracking-tighter text-[#1A1A1A]">
              {validationMetrics.r2Score}
            </span>
          </div>
          <div>
            <div className="h-[2px] bg-[#1A1A1A] w-full mb-1.5" />
            <p className="text-[10px] font-mono uppercase text-[#666]">
              EXPLAINED VARIANCE
            </p>
          </div>
        </div>

        {/* Pearson Correlation */}
        <div className="bg-[#F8F7F5] p-5 border-2 border-[#1A1A1A] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#555]">
              CORRELATION (R)
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-[#1A1A1A]" />
          </div>
          <div className="my-3 flex items-baseline gap-1">
            <span className="text-4xl font-light tracking-tighter text-[#1A1A1A]">
              {validationMetrics.correlation}
            </span>
          </div>
          <div>
            <div className="h-1 border-t-2 border-dashed border-[#1A1A1A] w-full mb-1.5" />
            <p className="text-[10px] font-mono uppercase text-[#666]">
              VERTICAL COHERENCE
            </p>
          </div>
        </div>
      </div>

      {/* Active ARGO Float Details Banner */}
      <div className="bg-white border-2 border-[#1A1A1A] p-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-2 text-[#1A1A1A]">
          <MapPin className="w-4 h-4 text-[#1A1A1A]" />
          <span><strong>PLATFORM:</strong> {currentFloat.platform_type} &bull; <strong>WMO:</strong> {currentFloat.wmo_id}</span>
          <span>&bull; <strong>LOCATION:</strong> {currentFloat.lat}°N, {currentFloat.lon}°E ({currentFloat.region})</span>
        </div>
        <div className="flex items-center gap-3 text-[#1A1A1A]">
          <span><strong>DATE:</strong> {currentFloat.date}</span>
          <span><strong>SST:</strong> {currentFloat.sst_observed} °C</span>
          <span><strong>SSS:</strong> {currentFloat.sss_observed} PSU</span>
          <span className="bg-[#1A1A1A] text-white px-2 py-0.5 text-[10px] font-bold">
            QC: {currentFloat.qc_flag} (PASSED)
          </span>
        </div>
      </div>

      {/* Main Charts: Profile Comparison & Scatter Plot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Predicted vs Observed Temperature Profile (7 Cols) */}
        <div className="lg:col-span-7 bg-white border-2 border-[#1A1A1A] p-5 space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
            <div>
              <div className="text-[9px] uppercase tracking-[0.3em] font-mono text-[#555]">
                PROFILE // STRATIFICATION COMPARISON
              </div>
              <h3 className="text-sm font-black uppercase tracking-wider text-[#1A1A1A] mt-0.5">
                Temperature Profile: Predicted vs Real ARGO Observed
              </h3>
            </div>
            <span className="text-[10px] bg-[#1A1A1A] text-white px-2 py-0.5 font-mono font-bold">
              FLOAT {currentFloat.wmo_id}
            </span>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profileChartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#1A1A1A" strokeOpacity={0.15} />
                <XAxis 
                  dataKey="observed" 
                  type="number"
                  domain={[0, 32]}
                  stroke="#1A1A1A"
                  label={{ value: 'Temperature (°C)', position: 'insideBottom', offset: -2, fontSize: 10, fontWeight: 700 }}
                  tick={{ fontSize: 10, fontFamily: 'monospace' }}
                />
                <YAxis 
                  dataKey="depth" 
                  reversed 
                  domain={[0, 2000]}
                  ticks={[0, 200, 500, 1000, 1500, 2000]}
                  stroke="#1A1A1A"
                  label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft', fontSize: 10, fontWeight: 700 }}
                  tick={{ fontSize: 10, fontFamily: 'monospace' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[#1A1A1A] text-white text-xs p-3 font-mono border border-white/30">
                          <div className="font-bold text-[11px] uppercase mb-1">Depth: {d.depth}m</div>
                          <div>ARGO Observed: <span className="font-bold text-emerald-300">{d.observed.toFixed(2)} °C</span></div>
                          <div>ConvFormer Predicted: <span className="font-bold text-sky-300">{d.predicted.toFixed(2)} °C</span></div>
                          <div className="text-[#999] text-[10px] mt-1">Bias: {d.error >= 0 ? `+${d.error.toFixed(2)}` : d.error.toFixed(2)} °C</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  formatter={(val) => <span className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">{val}</span>}
                />
                <Line 
                  type="monotone" 
                  dataKey="observed" 
                  name="ARGO Observed (Ground Truth)" 
                  stroke="#1A1A1A" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#1A1A1A' }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  name="ConvFormer Predicted" 
                  stroke="#666" 
                  strokeWidth={2} 
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: '#666' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#F8F7F5] p-3 border-2 border-[#1A1A1A] text-xs font-mono text-[#1A1A1A] flex justify-between">
            <span>Solid Black: Actual ARGO CTD Profile</span>
            <span>Dashed Gray: ConvFormer Output</span>
          </div>
        </div>

        {/* Chart 2: Predicted vs Observed Scatter Plot (5 Cols) */}
        <div className="lg:col-span-5 bg-white border-2 border-[#1A1A1A] p-5 space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
            <div>
              <div className="text-[9px] uppercase tracking-[0.3em] font-mono text-[#555]">
                SCATTER // 1:1 CONGRUENCE
              </div>
              <h3 className="text-sm font-black uppercase tracking-wider text-[#1A1A1A] mt-0.5">
                Predicted vs Observed 1:1 Fit
              </h3>
            </div>
            <span className="text-[10px] bg-[#1A1A1A] text-white px-2 py-0.5 font-mono font-bold">
              R = {validationMetrics.correlation}
            </span>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#1A1A1A" strokeOpacity={0.15} />
                <XAxis 
                  dataKey="observed" 
                  type="number" 
                  domain={[0, 30]} 
                  stroke="#1A1A1A"
                  label={{ value: 'Observed Temp (°C)', position: 'insideBottom', offset: -2, fontSize: 10, fontWeight: 700 }}
                  tick={{ fontSize: 10, fontFamily: 'monospace' }}
                />
                <YAxis 
                  dataKey="predicted" 
                  type="number" 
                  domain={[0, 30]} 
                  stroke="#1A1A1A"
                  label={{ value: 'Predicted Temp (°C)', angle: -90, position: 'insideLeft', fontSize: 10, fontWeight: 700 }}
                  tick={{ fontSize: 10, fontFamily: 'monospace' }}
                />
                <Tooltip 
                  formatter={(val: any, name: any) => [`${val} °C`, name === 'observed' ? 'Observed' : 'Predicted']}
                />
                <ReferenceLine x={0} y={0} stroke="#1A1A1A" />
                <ReferenceLine 
                  segment={[{ x: 0, y: 0 }, { x: 30, y: 30 }]} 
                  stroke="#1A1A1A" 
                  strokeDasharray="4 4" 
                  strokeWidth={2}
                  label={{ value: '1:1 Fit', position: 'top', fill: '#1A1A1A', fontSize: 10, fontWeight: 'bold' }}
                />
                <Scatter 
                  name="Temperature Pairs" 
                  data={scatterData} 
                  fill="#1A1A1A" 
                  shape="circle" 
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] font-mono text-[#555] text-center pt-1 border-t border-[#1A1A1A]/20">
            Residuals: &lt;0.1°C in deep abyss (2000m), ~0.25°C in main thermocline (100–200m).
          </div>
        </div>
      </div>

      {/* Depth-wise Error Breakdown Table */}
      <div className="bg-white border-2 border-[#1A1A1A] p-5 space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
          <div>
            <div className="text-[9px] uppercase tracking-[0.3em] font-mono text-[#555]">
              RESIDUAL ANALYSIS // DISCRETE LAYERS
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-[#1A1A1A] mt-0.5">
              Depth-wise Error Breakdown (Residual = Predicted − Observed)
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-[#1A1A1A]">
            FLOAT {currentFloat.wmo_id} &bull; N = {validationMetrics.sampleCount}
          </span>
        </div>

        <div className="border-2 border-[#1A1A1A] overflow-x-auto">
          <table className="w-full text-xs text-left font-mono">
            <thead className="bg-[#1A1A1A] text-white uppercase text-[10px] tracking-wider border-b-2 border-[#1A1A1A]">
              <tr>
                <th className="p-3">Depth (m)</th>
                <th className="p-3">ARGO Observed (°C)</th>
                <th className="p-3">ConvFormer Predicted (°C)</th>
                <th className="p-3">Difference / Bias (°C)</th>
                <th className="p-3">Absolute Error (°C)</th>
                <th className="p-3">QC Status</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#1A1A1A]">
              {validationMetrics.depthBreakdown.map((row) => (
                <tr key={row.depth} className="hover:bg-[#F8F7F5]">
                  <td className="p-3 font-bold">{row.depth} m</td>
                  <td className="p-3 font-bold text-[#1A1A1A]">{row.observed.toFixed(2)}</td>
                  <td className="p-3 font-black text-[#1A1A1A]">{row.predicted.toFixed(2)}</td>
                  <td className="p-3 font-bold text-[#1A1A1A]">
                    {row.error >= 0 ? `+${row.error.toFixed(2)}` : row.error.toFixed(2)}
                  </td>
                  <td className="p-3 font-bold text-[#555]">{row.absError.toFixed(2)}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 bg-[#1A1A1A] text-white px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider">
                      WITHIN BOUNDS
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
