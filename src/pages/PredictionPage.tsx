import React, { useState } from 'react';
import { 
  Cpu, 
  Play, 
  MapPin, 
  Calendar, 
  Sliders, 
  AlertCircle, 
  Download, 
  CheckCircle2, 
  TrendingUp, 
  Info,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { DataMode, PredictionOutput } from '../types/ocean';
import { predictSubsurfaceTemperature, STANDARD_DEPTHS } from '../services/predictionService';
import { PredictionModal } from '../components/PredictionModal';

interface Props {
  dataMode: DataMode;
  initialLat: number;
  initialLon: number;
  initialDate: string;
  initialDepth: number;
}

export const PredictionPage: React.FC<Props> = ({
  dataMode,
  initialLat,
  initialLon,
  initialDate,
  initialDepth
}) => {
  const [lat, setLat] = useState<number>(initialLat);
  const [lon, setLon] = useState<number>(initialLon);
  const [date, setDate] = useState<string>(initialDate);
  const [depth, setDepth] = useState<number>(initialDepth);

  // Surface boundary inputs (auto-filled or editable)
  const [customSst, setCustomSst] = useState<number>(28.2);
  const [customSss, setCustomSss] = useState<number>(32.5);
  const [customSsh, setCustomSsh] = useState<number>(0.04);
  const [customWind, setCustomWind] = useState<number>(7.2);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activePrediction, setActivePrediction] = useState<PredictionOutput | null>(() => 
    predictSubsurfaceTemperature({
      latitude: initialLat,
      longitude: initialLon,
      date: initialDate,
      targetDepth: initialDepth,
      sst: 28.2,
      sss: 32.5,
      ssh: 0.04,
      windSpeed: 7.2
    }, dataMode)
  );

  const handleRunPrediction = () => {
    const res = predictSubsurfaceTemperature({
      latitude: lat,
      longitude: lon,
      date: date,
      targetDepth: depth,
      sst: customSst,
      sss: customSss,
      ssh: customSsh,
      windSpeed: customWind
    }, dataMode);

    setActivePrediction(res);
    setIsModalOpen(true);
  };

  // Day-to-day difference calculation
  const dayNum = parseInt(date.split('-')[2] || '15', 10);
  const prevDate = dayNum > 1 ? `2020-01-${(dayNum - 1).toString().padStart(2, '0')}` : '2020-01-01';
  const prevPred = predictSubsurfaceTemperature({
    latitude: lat,
    longitude: lon,
    date: prevDate,
    targetDepth: depth
  }, dataMode);

  const currentT = activePrediction?.predictedTemperatureAtTarget !== undefined
    ? activePrediction.predictedTemperatureAtTarget
    : activePrediction?.profile?.[0]?.temperature ?? 28.0;

  const prevT = prevPred?.predictedTemperatureAtTarget !== undefined
    ? prevPred.predictedTemperatureAtTarget
    : prevPred?.profile?.[0]?.temperature ?? 28.0;

  const diff = Number(((currentT ?? 0) - (prevT ?? 0)).toFixed(2));

  return (
    <div id="prediction-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-real">0.25° ISOMETRIC INFERENCE</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              IN-SITU &amp; SATELLITE BLENDED
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2.5">
              ConvFormer Prediction Studio
            </h1>
            <span className="bg-sky-50 text-[#0284C7] border border-sky-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              AI Inference
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-2 font-medium max-w-2xl leading-relaxed">
            Specify spatial coordinates, observation date, surface boundary feeds, and target depth (0m to 2000m) to generate continuous vertical stratification profiles.
          </p>
        </div>

        <button
          id="btn-trigger-ai-prediction"
          type="button"
          onClick={handleRunPrediction}
          className="btn-primary-action px-6 py-3 text-xs tracking-wider cursor-pointer font-bold shadow-md flex items-center gap-2.5 self-start md:self-auto"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          RUN AI PREDICTION
        </button>
      </div>

      {/* Specification Disclaimer Box */}
      <div className="bg-sky-50/50 border border-sky-200 rounded-xl p-4 text-xs text-slate-700 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#0284C7] mt-0.5 flex-shrink-0" />
        <div className="text-xs leading-relaxed">
          <strong className="font-bold text-[#0F172A] uppercase tracking-wider">PHYSICAL PIPELINE SPECIFICATION:</strong> ConvFormer service is modular and pluggable. This inference engine calculates physically grounded Bay of Bengal stratification curves based on boundary inputs and conforms directly to the PyTorch model checkpoint in <code className="bg-white px-1.5 py-0.5 rounded border border-sky-200 text-[#0284C7] font-mono text-[11px]">ml/models/convformer.py</code>.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Controls Panel (5 Cols) */}
        <div className="lg:col-span-5 card-surface border border-[#E2E8F0] p-5 space-y-5 shadow-sm bg-white">
          <div className="border-b border-slate-200 pb-3">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
              PARAMETERS &bull; BOUNDARY CONDITIONS
            </span>
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2 mt-0.5">
              <Sliders className="w-4 h-4 text-[#0284C7]" />
              Input Environmental Controls
            </h3>
          </div>

          <div className="space-y-4">
            {/* Region & Coordinates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Latitude (°N) [5.0–22.0]
                </label>
                <input
                  type="number"
                  step="0.25"
                  min="5.0"
                  max="22.0"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value) || 14.0)}
                  className="input-standard w-full text-xs font-semibold py-1.5"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Longitude (°E) [80.0–100.0]
                </label>
                <input
                  type="number"
                  step="0.25"
                  min="80.0"
                  max="100.0"
                  value={lon}
                  onChange={(e) => setLon(parseFloat(e.target.value) || 88.0)}
                  className="input-standard w-full text-xs font-semibold py-1.5"
                />
              </div>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Observation Date (Jan 2020)
              </label>
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-standard w-full text-xs font-semibold py-1.5 cursor-pointer"
              >
                {Array.from({ length: 31 }, (_, i) => {
                  const d = (i + 1).toString().padStart(2, '0');
                  const dateStr = `2020-01-${d}`;
                  return (
                    <option key={dateStr} value={dateStr}>
                      {dateStr}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Depth Slider 0m to 2000m */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#0F172A] text-xs">Target Depth:</span>
                <span className="font-bold text-[#0284C7] bg-white border border-sky-200 rounded-md px-2.5 py-0.5">
                  {depth} METERS
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="25"
                value={depth}
                onChange={(e) => setDepth(parseInt(e.target.value, 10))}
                className="w-full accent-[#0284C7] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                <span>0m (SST)</span>
                <span>200m</span>
                <span>1000m</span>
                <span>2000m</span>
              </div>
            </div>

            {/* Surface Variables Section */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Surface Ocean Variables
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">SST (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customSst}
                    onChange={(e) => setCustomSst(parseFloat(e.target.value) || 28.0)}
                    className="input-standard w-full text-xs font-semibold py-1.5"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">SSS (PSU)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customSss}
                    onChange={(e) => setCustomSss(parseFloat(e.target.value) || 32.0)}
                    className="input-standard w-full text-xs font-semibold py-1.5"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">SSH / SLA (m)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={customSsh}
                    onChange={(e) => setCustomSsh(parseFloat(e.target.value) || 0.0)}
                    className="input-standard w-full text-xs font-semibold py-1.5"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Wind Speed (m/s)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customWind}
                    onChange={(e) => setCustomWind(parseFloat(e.target.value) || 7.0)}
                    className="input-standard w-full text-xs font-semibold py-1.5"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRunPrediction}
              className="btn-primary-action w-full py-3 text-xs tracking-wider cursor-pointer font-bold shadow-md flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              RUN AI PREDICTION
            </button>
          </div>
        </div>

        {/* Right Column: Prediction Results Dashboard (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Result Banner */}
          <div className="card-surface border border-[#E2E8F0] p-5 space-y-4 shadow-sm bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  PREDICTED TEMPERATURE AT {depth}M DEPTH
                </span>
                <div className="my-2 flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0F172A]">
                    {(currentT ?? 0).toFixed(2)}
                  </span>
                  <span className="text-lg font-bold text-slate-400">°C</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="text-right">
                  <span className="text-slate-500 text-[10px] uppercase font-semibold tracking-wider block">24H VARIATION</span>
                  <div className={`text-base font-black mt-0.5 ${diff > 0 ? 'text-amber-600' : 'text-[#0284C7]'}`}>
                    {diff >= 0 ? `+${diff}` : diff} °C
                  </div>
                </div>

                <div className="text-right border-l border-slate-200 pl-4">
                  <span className="text-slate-500 text-[10px] uppercase font-semibold tracking-wider block">CONFIDENCE</span>
                  <div className="text-base font-black text-emerald-700 mt-0.5">
                    {(((activePrediction?.confidenceScore || 0.92)) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Vertical Profile Chart */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Predicted Subsurface Stratification Curve (0m – 2000m)
              </h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={activePrediction?.profile || []}
                    margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis 
                      dataKey="temperature" 
                      type="number"
                      domain={[0, 32]}
                      stroke="#64748B"
                      label={{ value: 'Temperature (°C)', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#64748B' }}
                      tick={{ fontSize: 10, fill: '#64748B' }}
                    />
                    <YAxis 
                      dataKey="depth" 
                      reversed 
                      domain={[0, 2000]}
                      ticks={[0, 200, 500, 1000, 1500, 2000]}
                      stroke="#64748B"
                      label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#64748B' }}
                      tick={{ fontSize: 10, fill: '#64748B' }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white text-[#0F172A] text-xs p-3 rounded-lg border border-[#E2E8F0] shadow-md">
                              <div className="font-bold text-[11px] uppercase tracking-wider mb-1 text-slate-500">Depth: {data.depth} m</div>
                              <div className="text-sm">Temperature: <span className="font-bold text-[#0284C7]">{data.temperature} °C</span></div>
                              <div className="text-slate-400 text-[10px] mt-1">
                                Confidence: [{data.confidenceLow} – {data.confidenceHigh}] °C
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="#0284C7" 
                      strokeWidth={2.5} 
                      dot={{ r: 3.5, fill: '#0284C7' }} 
                      activeDot={{ r: 6, fill: '#2563EB' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Exact Depth Temperature Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Depth</th>
                    <th className="p-3">Predicted Temp</th>
                    <th className="p-3">95% Confidence</th>
                    <th className="p-3">Stratification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {activePrediction?.profile.map((p) => {
                    const isTarget = p.depth === depth;
                    return (
                      <tr key={p.depth} className={isTarget ? 'bg-sky-50/70 text-[#0284C7] font-bold' : 'hover:bg-slate-50 text-slate-700'}>
                        <td className="p-3">{p.depth} m</td>
                        <td className="p-3 font-bold text-[#0F172A]">{(p.temperature ?? 0).toFixed(2)} °C</td>
                        <td className={`p-3 ${isTarget ? 'text-sky-700' : 'text-slate-500'}`}>[{p.confidenceLow} – {p.confidenceHigh}] °C</td>
                        <td className="p-3 uppercase text-[10px] font-semibold tracking-wider">
                          {p.depth <= 50 ? 'Mixed Layer' : p.depth <= 200 ? 'Thermocline' : p.depth <= 1000 ? 'Intermediate' : 'Abyssal'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>LOCATION: {lat}°N, {lon}°E &bull; DATE: {date}</span>
              <span className="font-bold text-[#0284C7]">STATUS: {activePrediction?.status}</span>
            </div>
          </div>
        </div>
      </div>

      <PredictionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prediction={activePrediction}
      />
    </div>
  );
};
