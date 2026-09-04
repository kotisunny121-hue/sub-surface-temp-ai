import React, { useState } from 'react';
import { 
  Play, 
  Download, 
  MapPin, 
  Calendar as CalendarIcon, 
  Layers, 
  TrendingUp, 
  CheckCircle2, 
  Eye, 
  Wind, 
  Compass, 
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
  AreaChart, 
  Area 
} from 'recharts';
import { MapViewer } from '../components/MapViewer';
import { PredictionModal } from '../components/PredictionModal';
import { ArgoFloat, DataMode, PredictionOutput } from '../types/ocean';
import { predictSubsurfaceTemperature, STANDARD_DEPTHS } from '../services/predictionService';

interface Props {
  selectedLat: number;
  selectedLon: number;
  onSelectLocation: (lat: number, lon: number) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  selectedDepth: number;
  onSelectDepth: (depth: number) => void;
  dataMode: DataMode;
  argoFloats: ArgoFloat[];
  oscarData: any;
  ascatData: any;
  ccmpData: any;
}

export const DashboardPage: React.FC<Props> = ({
  selectedLat,
  selectedLon,
  onSelectLocation,
  selectedDate,
  onSelectDate,
  selectedDepth,
  onSelectDepth,
  dataMode,
  argoFloats,
  oscarData,
  ascatData,
  ccmpData
}) => {
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);
  const [showOscar, setShowOscar] = useState(true);
  const [showAscat, setShowAscat] = useState(true);
  const [showCcmp, setShowCcmp] = useState(false);

  // Generate current prediction
  const prediction: PredictionOutput = predictSubsurfaceTemperature(
    {
      latitude: selectedLat,
      longitude: selectedLon,
      date: selectedDate,
      targetDepth: selectedDepth
    },
    dataMode
  );

  // Yesterday prediction for Day-to-Day comparison
  const dayNum = parseInt(selectedDate.split('-')[2] || '15', 10);
  const prevDayStr = dayNum > 1 
    ? `2020-01-${(dayNum - 1).toString().padStart(2, '0')}` 
    : '2020-01-01';

  const prevPrediction = predictSubsurfaceTemperature(
    {
      latitude: selectedLat,
      longitude: selectedLon,
      date: prevDayStr,
      targetDepth: selectedDepth
    },
    dataMode
  );

  const currentTemp = prediction.predictedTemperatureAtTarget !== undefined
    ? prediction.predictedTemperatureAtTarget
    : prediction.profile[0].temperature;

  const prevTemp = prevPrediction.predictedTemperatureAtTarget !== undefined
    ? prevPrediction.predictedTemperatureAtTarget
    : prevPrediction.profile[0].temperature;

  const dayToDayChange = Number((currentTemp - prevTemp).toFixed(2));

  // Download prediction report
  const handleDownloadReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(prediction, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `BoB_prediction_${selectedLat}N_${selectedLon}E_${selectedDate}_${selectedDepth}m.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="dashboard-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Section - Geometric Balance Architecture */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-[#1A1A1A] pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-6 bg-[#1A1A1A] text-white flex items-center justify-center text-[10px] font-black font-mono">
              01
            </div>
            <div className="text-[10px] uppercase tracking-[0.4em] font-black text-[#1A1A1A]">
              INTERFACE // GRID OBSERVATION
            </div>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#1A1A1A]">
              Subsurface Ocean Temperature
            </h1>
            <span className="bg-[#1A1A1A] text-white text-[10px] font-mono px-2 py-0.5 tracking-tighter uppercase font-bold">
              CONVFORMER
            </span>
          </div>
          <p className="text-sm text-[#444444] mt-2 font-medium max-w-2xl leading-relaxed">
            AI-powered subsurface prediction pipeline for the Bay of Bengal &bull; Spatial resolution: 0.25° isometric grid &bull; Depth: 0m to 2000m.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            id="btn-run-prediction"
            type="button"
            onClick={() => setIsPipelineModalOpen(true)}
            className="flex items-center gap-2.5 px-6 py-3 bg-[#1A1A1A] text-white hover:bg-black font-black text-xs uppercase tracking-[0.2em] border-2 border-[#1A1A1A] transition-all cursor-pointer shadow-none active:translate-y-0.5"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            RUN PREDICTION
          </button>
          <button
            id="btn-download-report"
            type="button"
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-3 bg-white text-[#1A1A1A] hover:bg-[#EBE9E4] font-black text-xs uppercase tracking-[0.2em] border-2 border-[#1A1A1A] transition-all cursor-pointer shadow-none"
          >
            <Download className="w-3.5 h-3.5 text-[#1A1A1A]" />
            EXPORT JSON
          </button>
        </div>
      </div>

      {/* Primary KPI & Status Row - Architectural Symmetry */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Metric 1: Predicted Temperature */}
        <div className="bg-white p-5 border-2 border-[#1A1A1A] flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#555]">
              PREDICTED TEMP
            </span>
            <span className="text-[10px] font-mono bg-[#1A1A1A] text-white px-1.5 py-0.5 font-bold">
              {selectedDepth}M
            </span>
          </div>
          <div className="my-3 flex items-baseline gap-1">
            <span className="text-4xl font-light tracking-tighter text-[#1A1A1A]">
              {currentTemp.toFixed(2)}
            </span>
            <span className="text-sm font-bold text-[#666]">°C</span>
          </div>
          <div>
            <div className="h-[2px] bg-[#1A1A1A] w-full mb-1.5" />
            <p className="text-[10px] font-mono uppercase text-[#666]">
              AT {selectedLat}°N, {selectedLon}°E
            </p>
          </div>
        </div>

        {/* Metric 2: Day-to-Day Change */}
        <div className="bg-[#F8F7F5] p-5 border-2 border-[#1A1A1A] flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#555]">
            24H VARIATION
          </span>
          <div className="my-3 flex items-baseline gap-1">
            <span className="text-4xl font-light tracking-tighter text-[#1A1A1A]">
              {dayToDayChange >= 0 ? `+${dayToDayChange}` : dayToDayChange}
            </span>
            <span className="text-sm font-bold text-[#666]">°C</span>
          </div>
          <div>
            <div className="h-1 border-t-2 border-dashed border-[#1A1A1A] w-full mb-1.5" />
            <p className="text-[10px] font-mono uppercase text-[#666]">
              VS {prevDayStr}
            </p>
          </div>
        </div>

        {/* Metric 3: Prediction Confidence */}
        <div className="bg-white p-5 border-2 border-[#1A1A1A] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#555]">
              CONFIDENCE
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1A1A1A]" />
          </div>
          <div className="my-3 flex items-baseline gap-1">
            <span className="text-4xl font-light tracking-tighter text-[#1A1A1A]">
              {(prediction.confidenceScore * 100).toFixed(0)}%
            </span>
          </div>
          <div>
            <div className="h-[2px] bg-[#1A1A1A] w-full mb-1.5" />
            <p className="text-[10px] font-mono uppercase text-[#666]">
              PHYSICAL BOUNDS
            </p>
          </div>
        </div>

        {/* Metric 4: RMSE */}
        <div className="bg-[#F8F7F5] p-5 border-2 border-[#1A1A1A] flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#555]">
            ARGO RMSE
          </span>
          <div className="my-3 flex items-baseline gap-1">
            <span className="text-4xl font-light tracking-tighter text-[#1A1A1A]">
              0.284
            </span>
            <span className="text-sm font-bold text-[#666]">°C</span>
          </div>
          <div>
            <div className="h-1 border-t-2 border-dashed border-[#1A1A1A] w-full mb-1.5" />
            <p className="text-[10px] font-mono uppercase text-[#666]">
              PROTOTYPE METRIC
            </p>
          </div>
        </div>

        {/* Metric 5: MAE */}
        <div className="bg-white p-5 border-2 border-[#1A1A1A] flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#555]">
            ARGO MAE
          </span>
          <div className="my-3 flex items-baseline gap-1">
            <span className="text-4xl font-light tracking-tighter text-[#1A1A1A]">
              0.218
            </span>
            <span className="text-sm font-bold text-[#666]">°C</span>
          </div>
          <div>
            <div className="h-[2px] bg-[#1A1A1A] w-full mb-1.5" />
            <p className="text-[10px] font-mono uppercase text-[#666]">
              PROTOTYPE METRIC
            </p>
          </div>
        </div>

        {/* Metric 6: R² Score */}
        <div className="bg-[#F8F7F5] p-5 border-2 border-[#1A1A1A] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#555]">
              R² / CORR
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-[#1A1A1A]" />
          </div>
          <div className="my-3 flex items-baseline gap-1">
            <span className="text-4xl font-light tracking-tighter text-[#1A1A1A]">
              0.994
            </span>
          </div>
          <div>
            <div className="h-1 border-t-2 border-dashed border-[#1A1A1A] w-full mb-1.5" />
            <p className="text-[10px] font-mono uppercase text-[#666]">
              R = 0.997 (BOB)
            </p>
          </div>
        </div>
      </div>

      {/* Global Interactive Selector Ribbon - Geometric Control Panel */}
      <div className="bg-[#F8F7F5] border-2 border-[#1A1A1A] p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Depth Level Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#1A1A1A] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#1A1A1A]" />
            DEPTH BINS:
          </span>
          <div className="flex flex-wrap items-center gap-1">
            {STANDARD_DEPTHS.map((depth) => {
              const active = selectedDepth === depth;
              return (
                <button
                  key={depth}
                  id={`depth-btn-${depth}`}
                  type="button"
                  onClick={() => onSelectDepth(depth)}
                  className={`px-3 py-1 text-xs font-mono font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#1A1A1A] text-white border-2 border-[#1A1A1A]'
                      : 'bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] hover:bg-[#EBE9E4]'
                  }`}
                >
                  {depth}m
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#1A1A1A] flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-[#1A1A1A]" />
            DATE (JAN 2020):
          </span>
          <select
            id="select-date"
            value={selectedDate}
            onChange={(e) => onSelectDate(e.target.value)}
            className="bg-white border-2 border-[#1A1A1A] px-3 py-1 text-xs font-mono font-bold text-[#1A1A1A] focus:outline-none focus:bg-[#F8F7F5] cursor-pointer"
          >
            {Array.from({ length: 31 }, (_, i) => {
              const d = (i + 1).toString().padStart(2, '0');
              const dateVal = `2020-01-${d}`;
              return (
                <option key={dateVal} value={dateVal}>
                  {dateVal}
                </option>
              );
            })}
          </select>
        </div>

        {/* Selected Coordinates */}
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1A1A1A] bg-white px-3 py-1 border-2 border-[#1A1A1A]">
          <MapPin className="w-3.5 h-3.5 text-[#1A1A1A]" />
          <span className="uppercase text-[10px] tracking-wider text-[#555]">COORD:</span>
          <span>{selectedLat.toFixed(2)}°N, {selectedLon.toFixed(2)}°E</span>
        </div>
      </div>

      {/* Main Content Area: Map & Temperature Profile Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Bay of Bengal Map (7 Cols) */}
        <div className="lg:col-span-7 bg-white border-2 border-[#1A1A1A] p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#1A1A1A] pb-3">
            <div>
              <div className="text-[9px] uppercase tracking-[0.3em] font-mono text-[#555]">
                LAYER // 001 SPATIAL FIELD
              </div>
              <h2 className="text-sm font-black uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2 mt-0.5">
                <Compass className="w-4 h-4 text-[#1A1A1A]" />
                Bay of Bengal Spatial Observation & Prediction Map
              </h2>
            </div>

            {/* Synthetic Vector Toggles */}
            {dataMode === 'real_plus_synthetic' ? (
              <div className="flex items-center gap-3 text-xs font-mono font-bold">
                <label className="flex items-center gap-1.5 cursor-pointer select-none text-[#1A1A1A]">
                  <input
                    type="checkbox"
                    checked={showOscar}
                    onChange={(e) => setShowOscar(e.target.checked)}
                    className="accent-[#1A1A1A]"
                  />
                  <span>OSCAR</span>
                  <span className="text-[9px] bg-[#1A1A1A] text-white px-1">DEMO</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer select-none text-[#1A1A1A]">
                  <input
                    type="checkbox"
                    checked={showAscat}
                    onChange={(e) => setShowAscat(e.target.checked)}
                    className="accent-[#1A1A1A]"
                  />
                  <span>ASCAT-C</span>
                  <span className="text-[9px] bg-[#1A1A1A] text-white px-1">DEMO</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer select-none text-[#1A1A1A]">
                  <input
                    type="checkbox"
                    checked={showCcmp}
                    onChange={(e) => setShowCcmp(e.target.checked)}
                    className="accent-[#1A1A1A]"
                  />
                  <span>CCMP</span>
                  <span className="text-[9px] bg-[#1A1A1A] text-white px-1">DEMO</span>
                </label>
              </div>
            ) : (
              <span className="text-[10px] font-mono uppercase bg-[#1A1A1A] text-white px-2 py-1 font-bold">
                STRICT REAL DATA ACTIVE
              </span>
            )}
          </div>

          {/* Leaflet Map */}
          <MapViewer
            selectedLat={selectedLat}
            selectedLon={selectedLon}
            onSelectLocation={onSelectLocation}
            selectedDepth={selectedDepth}
            selectedDate={selectedDate}
            dataMode={dataMode}
            argoFloats={argoFloats}
            showOscar={showOscar}
            showAscat={showAscat}
            showCcmp={showCcmp}
            oscarData={oscarData}
            ascatData={ascatData}
            ccmpData={ccmpData}
          />

          <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-[#555] pt-1 border-t border-[#1A1A1A]/20">
            <span>Click any 0.25° isometric cell to relocate probe coordinate</span>
            <span>Pin [A]: Real INCOIS ARGO Float profiles</span>
          </div>
        </div>

        {/* Right Column: Temperature-vs-Depth Vertical Profile Chart & Table (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Vertical Profile Chart */}
          <div className="bg-white border-2 border-[#1A1A1A] p-5 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
              <div>
                <div className="text-[9px] uppercase tracking-[0.3em] font-mono text-[#555]">
                  LAYER // 002 VERTICAL CTD
                </div>
                <h3 className="text-sm font-black uppercase tracking-wider text-[#1A1A1A] mt-0.5">
                  Subsurface Temperature Profile
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-[#1A1A1A] text-white px-2 py-0.5 font-bold uppercase tracking-wider">
                0M – 2000M
              </span>
            </div>

            {/* Recharts Temperature vs Depth Profile */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={prediction.profile}
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
                          <div className="bg-[#1A1A1A] text-white text-xs p-3 font-mono border border-white/30 shadow-none">
                            <div className="font-bold text-[11px] uppercase tracking-wider mb-1">Depth: {data.depth} m</div>
                            <div>Temperature: <span className="font-bold text-emerald-300">{data.temperature} °C</span></div>
                            <div className="text-[#999] text-[10px] mt-1">
                              Bounds: [{data.confidenceLow} – {data.confidenceHigh}] °C
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
                    activeDot={{ r: 5, fill: '#1A1A1A' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Mixed Layer Depth & Surface Indicators */}
            <div className="grid grid-cols-3 border-2 border-[#1A1A1A] bg-[#F8F7F5] divide-x-2 divide-[#1A1A1A] text-center">
              <div className="p-2.5">
                <span className="text-[9px] text-[#555] uppercase font-bold tracking-wider block">Surface SST</span>
                <div className="font-bold font-mono text-sm text-[#1A1A1A] mt-0.5">{prediction.surfaceConditions.sst} °C</div>
              </div>
              <div className="p-2.5">
                <span className="text-[9px] text-[#555] uppercase font-bold tracking-wider block">Mixed Layer (MLD)</span>
                <div className="font-bold font-mono text-sm text-[#1A1A1A] mt-0.5">{prediction.surfaceConditions.mld} m</div>
              </div>
              <div className="p-2.5">
                <span className="text-[9px] text-[#555] uppercase font-bold tracking-wider block">2000m Abyss</span>
                <div className="font-bold font-mono text-sm text-[#1A1A1A] mt-0.5">
                  {prediction.profile.find(p => p.depth === 2000)?.temperature} °C
                </div>
              </div>
            </div>
          </div>

          {/* Depth Table Breakdown - Geometric Grid */}
          <div className="bg-white border-2 border-[#1A1A1A] p-5 space-y-3">
            <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-[#1A1A1A]">
                Discrete Depth Level Predictions
              </h4>
              <span className="text-[9px] font-mono uppercase bg-[#EBE9E4] text-[#1A1A1A] px-2 py-0.5 font-bold">
                8 Standard Bins
              </span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
              {prediction.profile.map((p) => {
                const isSelected = p.depth === selectedDepth;
                return (
                  <div 
                    key={p.depth}
                    onClick={() => onSelectDepth(p.depth)}
                    className={`p-2 flex items-center justify-between border-2 transition-all cursor-pointer font-mono ${
                      isSelected 
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' 
                        : 'bg-[#F8F7F5] text-[#1A1A1A] border-[#1A1A1A]/30 hover:border-[#1A1A1A] hover:bg-[#EBE9E4]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 ${isSelected ? 'bg-white' : 'bg-[#1A1A1A]'}`} />
                      <span className="font-bold">{p.depth} m</span>
                    </span>
                    <span className="font-bold">{p.temperature.toFixed(2)} °C</span>
                    <span className={`text-[10px] ${isSelected ? 'text-[#aaa]' : 'text-[#666]'}`}>
                      [{p.confidenceLow} – {p.confidenceHigh}]
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Execution Pipeline Modal */}
      <PredictionModal
        isOpen={isPipelineModalOpen}
        onClose={() => setIsPipelineModalOpen(false)}
        prediction={prediction}
      />
    </div>
  );
};
