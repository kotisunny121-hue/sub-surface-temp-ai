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

  const currentTemp = prediction?.predictedTemperatureAtTarget !== undefined
    ? prediction.predictedTemperatureAtTarget
    : prediction?.profile?.[0]?.temperature ?? 28.5;

  const prevTemp = prevPrediction?.predictedTemperatureAtTarget !== undefined
    ? prevPrediction.predictedTemperatureAtTarget
    : prevPrediction?.profile?.[0]?.temperature ?? 28.5;

  const dayToDayChange = Number(((currentTemp ?? 0) - (prevTemp ?? 0)).toFixed(2));

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
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-real">0.25° ISOMETRIC GRID</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              BAY OF BENGAL DOMAIN (5°N–22°N, 80°E–100°E)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
              Subsurface Ocean Temperature
            </h1>
            <span className="bg-sky-50 text-[#0284C7] border border-sky-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              ConvFormer AI
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-2 font-medium max-w-2xl leading-relaxed">
            AI-powered 3D subsurface temperature reconstruction for the Bay of Bengal &bull; Multi-satellite fusion decoded into continuous 0m to 2000m vertical profiles.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            id="btn-run-prediction"
            type="button"
            onClick={() => setIsPipelineModalOpen(true)}
            className="btn-primary-action px-5 py-2.5 text-xs tracking-wider cursor-pointer font-bold shadow-md flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            RUN AI PREDICTION
          </button>
          <button
            id="btn-download-report"
            type="button"
            onClick={handleDownloadReport}
            className="btn-secondary px-4 py-2.5 text-xs font-semibold shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            EXPORT JSON
          </button>
        </div>
      </div>

      {/* Primary KPI & Status Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Metric 1: Predicted Temperature */}
        <div className="card-surface p-5 flex flex-col justify-between col-span-2 sm:col-span-1 border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
              PREDICTED TEMP
            </span>
            <span className="text-[11px] font-bold bg-sky-50 text-[#0284C7] border border-sky-200 px-2 py-0.5 rounded">
              {selectedDepth}M
            </span>
          </div>
          <div className="my-3 flex items-baseline gap-1">
            <span className="text-3xl font-black tracking-tight text-[#0F172A]">
              {(currentTemp ?? 0).toFixed(2)}
            </span>
            <span className="text-sm font-bold text-slate-400">°C</span>
          </div>
          <div>
            <div className="h-0.5 bg-[#0284C7] w-full mb-1.5 rounded-full" />
            <p className="text-[11px] font-mono text-slate-500">
              AT {(selectedLat ?? 14).toFixed(2)}°N, {(selectedLon ?? 88).toFixed(2)}°E
            </p>
          </div>
        </div>

        {/* Metric 2: Day-to-Day Change */}
        <div className="card-surface p-5 flex flex-col justify-between border border-[#E2E8F0] shadow-sm">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
            24H VARIATION
          </span>
          <div className="my-3 flex items-baseline gap-1">
            <span className={`text-3xl font-black tracking-tight ${dayToDayChange > 0 ? 'text-amber-600' : 'text-[#0284C7]'}`}>
              {dayToDayChange >= 0 ? `+${dayToDayChange}` : dayToDayChange}
            </span>
            <span className="text-sm font-bold text-slate-400">°C</span>
          </div>
          <div>
            <div className="h-0.5 bg-slate-200 w-full mb-1.5 rounded-full" />
            <p className="text-[11px] font-mono text-slate-500">
              VS {prevDayStr}
            </p>
          </div>
        </div>

        {/* Metric 3: Prediction Confidence */}
        <div className="card-surface p-5 flex flex-col justify-between border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
              CONFIDENCE
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="my-3 flex items-baseline gap-1">
            <span className="text-3xl font-black tracking-tight text-emerald-700">
              {(((prediction?.confidenceScore ?? 0.92)) * 100).toFixed(0)}%
            </span>
          </div>
          <div>
            <div className="h-0.5 bg-emerald-400 w-full mb-1.5 rounded-full" />
            <p className="text-[11px] font-mono text-slate-500">
              PHYSICAL BOUNDS
            </p>
          </div>
        </div>

        {/* Metric 4: RMSE */}
        <div className="card-surface p-5 flex flex-col justify-between border border-[#E2E8F0] shadow-sm">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
            ARGO RMSE
          </span>
          <div className="my-3 flex items-baseline gap-1">
            <span className="text-3xl font-black tracking-tight text-[#0F172A]">
              0.284
            </span>
            <span className="text-sm font-bold text-slate-400">°C</span>
          </div>
          <div>
            <div className="h-0.5 bg-slate-200 w-full mb-1.5 rounded-full" />
            <p className="text-[11px] font-mono text-slate-500">
              IN-SITU VERIFIED
            </p>
          </div>
        </div>

        {/* Metric 5: MAE */}
        <div className="card-surface p-5 flex flex-col justify-between border border-[#E2E8F0] shadow-sm">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
            ARGO MAE
          </span>
          <div className="my-3 flex items-baseline gap-1">
            <span className="text-3xl font-black tracking-tight text-[#0F172A]">
              0.218
            </span>
            <span className="text-sm font-bold text-slate-400">°C</span>
          </div>
          <div>
            <div className="h-0.5 bg-slate-200 w-full mb-1.5 rounded-full" />
            <p className="text-[11px] font-mono text-slate-500">
              MEAN ABS ERROR
            </p>
          </div>
        </div>

        {/* Metric 6: R² Score */}
        <div className="card-surface p-5 flex flex-col justify-between border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
              R² SCORE
            </span>
            <TrendingUp className="w-4 h-4 text-[#0284C7]" />
          </div>
          <div className="my-3 flex items-baseline gap-1">
            <span className="text-3xl font-black tracking-tight text-[#0284C7]">
              0.994
            </span>
          </div>
          <div>
            <div className="h-0.5 bg-[#0284C7] w-full mb-1.5 rounded-full" />
            <p className="text-[11px] font-mono text-slate-500">
              R = 0.997 (BOB)
            </p>
          </div>
        </div>
      </div>

      {/* Global Interactive Selector Ribbon */}
      <div className="card-surface border border-[#E2E8F0] p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        {/* Depth Level Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#0284C7]" />
            Depth Bin:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {STANDARD_DEPTHS.map((depth) => {
              const active = selectedDepth === depth;
              return (
                <button
                  key={depth}
                  id={`depth-btn-${depth}`}
                  type="button"
                  onClick={() => onSelectDepth(depth)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    active
                      ? 'bg-[#0284C7] text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
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
          <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-[#0284C7]" />
            Observation Date:
          </span>
          <select
            id="select-date"
            value={selectedDate}
            onChange={(e) => onSelectDate(e.target.value)}
            className="input-standard py-1 px-3 text-xs font-semibold cursor-pointer"
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
        <div className="flex items-center gap-2 text-xs font-semibold text-[#0F172A] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <MapPin className="w-4 h-4 text-[#0284C7]" />
          <span className="text-slate-500">Probe:</span>
          <span>{(selectedLat ?? 14).toFixed(2)}°N, {(selectedLon ?? 88).toFixed(2)}°E</span>
        </div>
      </div>

      {/* Main Content Area: Map & Temperature Profile Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Bay of Bengal Map (7 Cols) */}
        <div className="lg:col-span-7 card-surface border border-[#E2E8F0] p-5 space-y-4 shadow-sm bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                LAYER 01 &bull; 0.25° BASIN FIELD
              </div>
              <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2 mt-0.5">
                <Compass className="w-4 h-4 text-[#0284C7]" />
                Bay of Bengal Spatial Observation & Prediction Map
              </h2>
            </div>

            {/* Synthetic Vector Toggles */}
            {dataMode === 'real_plus_synthetic' ? (
              <div className="flex items-center gap-3 text-xs font-semibold">
                <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-700">
                  <input
                    type="checkbox"
                    checked={showOscar}
                    onChange={(e) => setShowOscar(e.target.checked)}
                    className="accent-[#0284C7] rounded"
                  />
                  <span>OSCAR</span>
                  <span className="badge-synthetic">DEMO</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-700">
                  <input
                    type="checkbox"
                    checked={showAscat}
                    onChange={(e) => setShowAscat(e.target.checked)}
                    className="accent-[#0284C7] rounded"
                  />
                  <span>ASCAT-C</span>
                  <span className="badge-synthetic">DEMO</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-700">
                  <input
                    type="checkbox"
                    checked={showCcmp}
                    onChange={(e) => setShowCcmp(e.target.checked)}
                    className="accent-[#0284C7] rounded"
                  />
                  <span>CCMP</span>
                  <span className="badge-synthetic">DEMO</span>
                </label>
              </div>
            ) : (
              <span className="badge-real">
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

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>Click any 0.25° cell on the map to inspect location</span>
            <span className="text-[#0284C7] font-medium">Pin [A]: In-situ ARGO Float CTD Profilers</span>
          </div>
        </div>

        {/* Right Column: Temperature-vs-Depth Vertical Profile Chart & Table (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Vertical Profile Chart */}
          <div className="card-surface border border-[#E2E8F0] p-5 space-y-4 shadow-sm bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                  LAYER 02 &bull; VERTICAL WATER COLUMN
                </div>
                <h3 className="text-sm font-bold text-[#0F172A] mt-0.5">
                  Subsurface Temperature Profile
                </h3>
              </div>
              <span className="text-[11px] font-semibold bg-sky-50 text-[#0284C7] border border-sky-200 px-2 py-0.5 rounded">
                0m – 2000m
              </span>
            </div>

            {/* Recharts Temperature vs Depth Profile */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={prediction.profile}
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
                              Confidence Bounds: [{data.confidenceLow} – {data.confidenceHigh}] °C
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

            {/* Mixed Layer Depth & Surface Indicators */}
            <div className="grid grid-cols-3 border border-slate-200 bg-slate-50/70 rounded-lg divide-x divide-slate-200 text-center">
              <div className="p-2.5">
                <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider block">Surface SST</span>
                <div className="font-bold text-sm text-[#0F172A] mt-0.5">{prediction?.surfaceConditions?.sst ?? 28.5} °C</div>
              </div>
              <div className="p-2.5">
                <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider block">Mixed Layer (MLD)</span>
                <div className="font-bold text-sm text-[#0F172A] mt-0.5">{prediction?.surfaceConditions?.mld ?? 32} m</div>
              </div>
              <div className="p-2.5">
                <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider block">2000m Abyss</span>
                <div className="font-bold text-sm text-[#0F172A] mt-0.5">
                  {prediction?.profile?.find(p => p.depth === 2000)?.temperature ?? 2.8} °C
                </div>
              </div>
            </div>
          </div>

          {/* Depth Table Breakdown */}
          <div className="card-surface border border-[#E2E8F0] p-5 space-y-3 shadow-sm bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#0F172A]">
                Discrete Depth Level Predictions
              </h4>
              <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
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
                    className={`p-2.5 rounded-lg flex items-center justify-between border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-sky-50 text-[#0284C7] border-sky-300 font-bold shadow-xs' 
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#0284C7]' : 'bg-slate-300'}`} />
                      <span>{p.depth} m</span>
                    </span>
                    <span className="font-bold">{(p.temperature ?? 0).toFixed(2)} °C</span>
                    <span className={`text-[10px] ${isSelected ? 'text-sky-700' : 'text-slate-400'}`}>
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
