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
    : activePrediction?.profile[0].temperature || 28.0;

  const prevT = prevPred.predictedTemperatureAtTarget !== undefined
    ? prevPred.predictedTemperatureAtTarget
    : prevPred.profile[0].temperature || 28.0;

  const diff = Number((currentT - prevT).toFixed(2));

  return (
    <div id="prediction-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header - Geometric Balance Architecture */}
      <div className="border-b-2 border-[#1A1A1A] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-6 bg-[#1A1A1A] text-white flex items-center justify-center text-[10px] font-black font-mono">
              02
            </div>
            <div className="text-[10px] uppercase tracking-[0.4em] font-black text-[#1A1A1A]">
              INTERFACE // INFERENCE STUDIO
            </div>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#1A1A1A] flex items-center gap-2">
              ConvFormer Prediction Studio
            </h1>
            <span className="bg-[#1A1A1A] text-white text-[10px] font-mono px-2 py-0.5 tracking-tighter uppercase font-bold">
              AI INFERENCE
            </span>
          </div>
          <p className="text-sm text-[#444] mt-2 font-medium max-w-2xl leading-relaxed">
            Specify spatial coordinates, observation date, surface boundary feeds, and target depth (0m to 2000m).
          </p>
        </div>

        <button
          id="btn-trigger-ai-prediction"
          type="button"
          onClick={handleRunPrediction}
          className="flex items-center gap-2.5 px-6 py-3 bg-[#1A1A1A] text-white hover:bg-black font-black text-xs uppercase tracking-[0.2em] border-2 border-[#1A1A1A] transition-all cursor-pointer shadow-none active:translate-y-0.5 self-start md:self-auto"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          RUN AI PREDICTION
        </button>
      </div>

      {/* Mandatory Disclaimer Box - Geometric Frame */}
      <div className="bg-[#F8F7F5] border-2 border-[#1A1A1A] p-4 text-xs text-[#1A1A1A] flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#1A1A1A] mt-0.5 flex-shrink-0" />
        <div className="font-mono text-[11px] leading-relaxed">
          <strong className="font-bold uppercase tracking-wider">PROTOTYPE PIPELINE SPECIFICATION:</strong> ConvFormer service is modular and pluggable. This inference engine calculates physically grounded Bay of Bengal stratification curves based on boundary inputs and conforms directly to the PyTorch model checkpoint in <code className="bg-[#EBE9E4] px-1 py-0.5 border border-[#1A1A1A]">ml/models/convformer.py</code>.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Controls Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-white border-2 border-[#1A1A1A] p-5 space-y-5">
          <div className="border-b-2 border-[#1A1A1A] pb-3">
            <div className="text-[9px] uppercase tracking-[0.3em] font-mono text-[#555]">
              PARAMETERS // SETTINGS
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2 mt-0.5">
              <Sliders className="w-4 h-4 text-[#1A1A1A]" />
              Input Environmental Controls
            </h3>
          </div>

          <div className="space-y-4">
            {/* Region & Coordinates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                  Latitude (°N) [5.0–22.0]
                </label>
                <input
                  type="number"
                  step="0.25"
                  min="5.0"
                  max="22.0"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value) || 14.0)}
                  className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-1.5 text-xs font-mono font-bold text-[#1A1A1A] focus:outline-none focus:bg-[#F8F7F5]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                  Longitude (°E) [80.0–100.0]
                </label>
                <input
                  type="number"
                  step="0.25"
                  min="80.0"
                  max="100.0"
                  value={lon}
                  onChange={(e) => setLon(parseFloat(e.target.value) || 88.0)}
                  className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-1.5 text-xs font-mono font-bold text-[#1A1A1A] focus:outline-none focus:bg-[#F8F7F5]"
                />
              </div>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                Observation Date (Jan 2020)
              </label>
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-1.5 text-xs font-mono font-bold text-[#1A1A1A] focus:outline-none focus:bg-[#F8F7F5] cursor-pointer"
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
            <div className="bg-[#F8F7F5] p-4 border-2 border-[#1A1A1A] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-wider text-[#1A1A1A] text-[10px]">Target Depth:</span>
                <span className="font-black text-[#1A1A1A] font-mono bg-white border border-[#1A1A1A] px-2 py-0.5">
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
                className="w-full accent-[#1A1A1A] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-[#666] font-bold uppercase">
                <span>0m (SST)</span>
                <span>200m</span>
                <span>1000m</span>
                <span>2000m</span>
              </div>
            </div>

            {/* Surface Variables Section */}
            <div className="space-y-3 pt-2 border-t-2 border-[#1A1A1A]">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]">
                Surface Ocean Variables
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-mono uppercase font-bold text-[#555] block mb-1">SST (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customSst}
                    onChange={(e) => setCustomSst(parseFloat(e.target.value) || 28.0)}
                    className="w-full bg-white border-2 border-[#1A1A1A] p-1.5 font-mono text-xs font-bold text-[#1A1A1A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase font-bold text-[#555] block mb-1">SSS (PSU)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customSss}
                    onChange={(e) => setCustomSss(parseFloat(e.target.value) || 32.0)}
                    className="w-full bg-white border-2 border-[#1A1A1A] p-1.5 font-mono text-xs font-bold text-[#1A1A1A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase font-bold text-[#555] block mb-1">SSH / SLA (m)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={customSsh}
                    onChange={(e) => setCustomSsh(parseFloat(e.target.value) || 0.0)}
                    className="w-full bg-white border-2 border-[#1A1A1A] p-1.5 font-mono text-xs font-bold text-[#1A1A1A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase font-bold text-[#555] block mb-1">Wind Speed (m/s)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customWind}
                    onChange={(e) => setCustomWind(parseFloat(e.target.value) || 7.0)}
                    className="w-full bg-white border-2 border-[#1A1A1A] p-1.5 font-mono text-xs font-bold text-[#1A1A1A] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRunPrediction}
              className="w-full py-3 bg-[#1A1A1A] hover:bg-black text-white font-black text-xs uppercase tracking-[0.2em] border-2 border-[#1A1A1A] flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              RUN AI PREDICTION
            </button>
          </div>
        </div>

        {/* Right Column: Prediction Results Dashboard (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Result Banner */}
          <div className="bg-white border-2 border-[#1A1A1A] p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#1A1A1A] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#555]">
                  PREDICTED TEMPERATURE AT {depth}M DEPTH
                </span>
                <div className="my-2 flex items-baseline gap-1">
                  <span className="text-5xl font-light tracking-tighter text-[#1A1A1A]">
                    {currentT.toFixed(2)}
                  </span>
                  <span className="text-base font-bold text-[#666]">°C</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="text-right">
                  <span className="text-[#555] text-[9px] uppercase font-bold tracking-wider block">24H VARIATION</span>
                  <div className="text-lg font-bold text-[#1A1A1A] mt-0.5">
                    {diff >= 0 ? `+${diff}` : diff} °C
                  </div>
                </div>

                <div className="text-right border-l-2 border-[#1A1A1A] pl-4">
                  <span className="text-[#555] text-[9px] uppercase font-bold tracking-wider block">CONFIDENCE</span>
                  <div className="text-lg font-bold text-[#1A1A1A] mt-0.5">
                    {((activePrediction?.confidenceScore || 0.92) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Vertical Profile Chart */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]">
                Predicted Subsurface Stratification Curve (0m – 2000m)
              </h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={activePrediction?.profile || []}
                    margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="2 2" stroke="#1A1A1A" strokeOpacity={0.15} />
                    <XAxis 
                      dataKey="temperature" 
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
                          const data = payload[0].payload;
                          return (
                            <div className="bg-[#1A1A1A] text-white text-xs p-3 font-mono border border-white/30">
                              <div className="font-bold text-[11px] uppercase tracking-wider mb-1">Depth: {data.depth} m</div>
                              <div>Temperature: <span className="font-bold text-emerald-300">{data.temperature} °C</span></div>
                              <div className="text-[#999] text-[10px] mt-1">
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
                      stroke="#1A1A1A" 
                      strokeWidth={2} 
                      dot={{ r: 3, fill: '#1A1A1A' }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Exact Depth Temperature Table */}
            <div className="border-2 border-[#1A1A1A] overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#1A1A1A] text-white font-mono uppercase tracking-wider text-[10px] border-b-2 border-[#1A1A1A]">
                  <tr>
                    <th className="p-2.5">Depth</th>
                    <th className="p-2.5">Predicted Temp</th>
                    <th className="p-2.5">95% Confidence</th>
                    <th className="p-2.5">Stratification</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#1A1A1A] font-mono">
                  {activePrediction?.profile.map((p) => {
                    const isTarget = p.depth === depth;
                    return (
                      <tr key={p.depth} className={isTarget ? 'bg-[#1A1A1A] text-white font-bold' : 'hover:bg-[#F8F7F5]'}>
                        <td className="p-2.5">{p.depth} m</td>
                        <td className="p-2.5 font-black">{p.temperature.toFixed(2)} °C</td>
                        <td className={`p-2.5 ${isTarget ? 'text-[#aaa]' : 'text-[#666]'}`}>[{p.confidenceLow} – {p.confidenceHigh}] °C</td>
                        <td className="p-2.5 uppercase text-[10px] tracking-wider">
                          {p.depth <= 50 ? 'Mixed Layer' : p.depth <= 200 ? 'Thermocline' : p.depth <= 1000 ? 'Intermediate' : 'Abyssal'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-[#555] pt-1">
              <span>LOCATION: {lat}°N, {lon}°E &bull; DATE: {date}</span>
              <span className="font-bold text-[#1A1A1A]">STATUS: {activePrediction?.status}</span>
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
