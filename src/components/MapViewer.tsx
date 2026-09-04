import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ArgoFloat, DataMode } from '../types/ocean';
import { predictSubsurfaceTemperature } from '../services/predictionService';

interface Props {
  selectedLat: number;
  selectedLon: number;
  onSelectLocation: (lat: number, lon: number) => void;
  selectedDepth: number;
  selectedDate: string;
  dataMode: DataMode;
  argoFloats: ArgoFloat[];
  showOscar: boolean;
  showAscat: boolean;
  showCcmp: boolean;
  oscarData: any;
  ascatData: any;
  ccmpData: any;
}

// Color scale for ocean temperature (°C)
function getTempColor(t: number): string {
  if (t >= 29.0) return '#b91c1c'; // deep red
  if (t >= 28.0) return '#ea580c'; // orange red
  if (t >= 26.5) return '#f59e0b'; // amber
  if (t >= 24.0) return '#eab308'; // yellow
  if (t >= 20.0) return '#10b981'; // emerald
  if (t >= 15.0) return '#06b6d4'; // cyan
  if (t >= 10.0) return '#0284c7'; // ocean blue
  if (t >= 6.0) return '#1d4ed8';  // deep blue
  if (t >= 3.5) return '#312e81';  // indigo
  return '#1e1b4b'; // deep abyss
}

export const MapViewer: React.FC<Props> = ({
  selectedLat,
  selectedLon,
  onSelectLocation,
  selectedDepth,
  selectedDate,
  dataMode,
  argoFloats,
  showOscar,
  showAscat,
  showCcmp,
  oscarData,
  ascatData,
  ccmpData
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const gridLayerRef = useRef<L.LayerGroup | null>(null);
  const argoLayerRef = useRef<L.LayerGroup | null>(null);
  const vectorLayerRef = useRef<L.LayerGroup | null>(null);
  const selectionMarkerRef = useRef<L.Marker | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [14.5, 89.5], // Center of Bay of Bengal
      zoom: 5,
      minZoom: 4,
      maxZoom: 9
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Bay of Bengal Region boundary
    const bounds: L.LatLngBoundsExpression = [[5.0, 80.0], [22.0, 100.0]];
    L.rectangle(bounds, {
      color: '#1A1A1A',
      weight: 2,
      dashArray: '4, 4',
      fill: false
    }).addTo(map).bindTooltip('Bay of Bengal Target Domain (5°N–22°N, 80°E–100°E)', {
      sticky: true,
      className: 'text-xs font-mono font-bold'
    });

    // Layer groups
    gridLayerRef.current = L.layerGroup().addTo(map);
    argoLayerRef.current = L.layerGroup().addTo(map);
    vectorLayerRef.current = L.layerGroup().addTo(map);

    // Click handler on map to select location
    map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = Math.max(5.0, Math.min(22.0, Number(e.latlng.lat.toFixed(2))));
      const lon = Math.max(80.0, Math.min(100.0, Number(e.latlng.lng.toFixed(2))));
      onSelectLocation(lat, lon);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update selection marker when lat/lon changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectionMarkerRef.current) {
      selectionMarkerRef.current.remove();
    }

    const customIcon = L.divIcon({
      className: 'custom-selected-pin',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full bg-red-500/30 animate-ping absolute"></div>
          <div class="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg border-2 border-white text-xs font-bold">
            ★
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const marker = L.marker([selectedLat, selectedLon], { icon: customIcon })
      .addTo(map)
      .bindTooltip(
        `Selected Point: ${selectedLat}°N, ${selectedLon}°E<br/>Click map to relocate`,
        { permanent: false, direction: 'top', className: 'text-xs font-medium' }
      );

    selectionMarkerRef.current = marker;
  }, [selectedLat, selectedLon]);

  // Render temperature grid cells according to depth
  useEffect(() => {
    if (!gridLayerRef.current) return;
    gridLayerRef.current.clearLayers();

    // Render 1.0° sample grid cells covering Bay of Bengal
    for (let lat = 5.5; lat <= 21.5; lat += 1.0) {
      for (let lon = 81.0; lon <= 98.0; lon += 1.0) {
        // Exclude approximate landmass
        if (lat > 8.0 && lon < 80.5) continue;
        if (lat > 13.0 && lon < 80.5) continue;
        if (lat > 16.0 && lon < 82.2) continue;
        if (lat > 19.5 && lon < 86.0) continue;
        if (lat > 21.0 && lon < 88.0) continue;
        if (lat > 15.0 && lon > 97.0) continue;
        if (lat > 10.0 && lon > 98.2) continue;
        if (lat >= 6.0 && lat <= 9.8 && lon >= 79.8 && lon <= 81.8) continue;

        // Calculate predicted temperature for this cell at current depth
        const pred = predictSubsurfaceTemperature(
          { latitude: lat, longitude: lon, date: selectedDate, targetDepth: selectedDepth },
          dataMode
        );
        const temp = pred.predictedTemperatureAtTarget !== undefined ? pred.predictedTemperatureAtTarget : pred.profile[0].temperature;
        const color = getTempColor(temp);

        const bounds: L.LatLngBoundsExpression = [
          [lat - 0.48, lon - 0.48],
          [lat + 0.48, lon + 0.48]
        ];

        const rect = L.rectangle(bounds, {
          color: color,
          weight: 1,
          opacity: 0.35,
          fillColor: color,
          fillOpacity: 0.55
        });

        rect.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          onSelectLocation(lat, lon);
        });

        rect.bindTooltip(
          `<div>
            <div class="font-bold text-xs">Grid: ${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E</div>
            <div class="text-xs">Depth: <span class="font-bold">${selectedDepth}m</span></div>
            <div class="text-xs">Temp: <span class="font-bold" style="color:${color}">${temp.toFixed(2)} °C</span></div>
            <div class="text-[10px] text-slate-500 mt-1">Click cell to analyze profile</div>
          </div>`,
          { sticky: true }
        );

        gridLayerRef.current.addLayer(rect);
      }
    }
  }, [selectedDepth, selectedDate, dataMode, onSelectLocation]);

  // Render ARGO Floats (Real Observations)
  useEffect(() => {
    if (!argoLayerRef.current) return;
    argoLayerRef.current.clearLayers();

    argoFloats.forEach((f) => {
      const argoIcon = L.divIcon({
        className: 'argo-float-pin',
        html: `
          <div class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white shadow-md text-[10px] font-bold">
            A
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([f.lat, f.lon], { icon: argoIcon });
      marker.bindPopup(`
        <div class="p-1 space-y-1 text-xs">
          <div class="font-bold text-emerald-800 flex items-center gap-1">
            <span>ARGO Float WMO ${f.wmo_id}</span>
            <span class="bg-emerald-100 text-emerald-900 text-[9px] px-1 rounded">REAL DATA</span>
          </div>
          <div><strong>Location:</strong> ${f.lat}°N, ${f.lon}°E (${f.region})</div>
          <div><strong>Date:</strong> ${f.date} &bull; Cycle #${f.cycle_number}</div>
          <div><strong>Surface Temp (CTD):</strong> ${f.sst_observed} °C</div>
          <div><strong>Salinity:</strong> ${f.sss_observed} PSU</div>
          <div class="text-[10px] text-slate-500 pt-1 border-t">Ground truth CTD profile to 2000m</div>
        </div>
      `);

      marker.on('click', () => {
        onSelectLocation(f.lat, f.lon);
      });

      argoLayerRef.current?.addLayer(marker);
    });
  }, [argoFloats, onSelectLocation]);

  // Render Synthetic Vector Overlays (OSCAR, ASCAT, CCMP)
  useEffect(() => {
    if (!vectorLayerRef.current) return;
    vectorLayerRef.current.clearLayers();

    if (dataMode === 'real_only') return;

    // 1. OSCAR Surface Currents
    if (showOscar && oscarData && oscarData.daily_data && oscarData.daily_data[selectedDate]) {
      const vectors = oscarData.daily_data[selectedDate].vectors || [];
      vectors.forEach((v: any) => {
        const arrowHtml = `
          <div style="transform: rotate(${v.dir}deg);" class="flex flex-col items-center justify-center">
            <div style="width: 2px; height: 16px; background-color: #0284c7;"></div>
            <div style="width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 6px solid #0284c7;"></div>
          </div>
        `;

        const icon = L.divIcon({
          className: 'oscar-vector',
          html: arrowHtml,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const m = L.marker([v.lat, v.lon], { icon });
        m.bindTooltip(`
          <div class="text-xs">
            <span class="font-bold text-cyan-800">OSCAR Surface Current [SYNTHETIC DEMO]</span><br/>
            Speed: <strong>${v.speed} m/s</strong> &bull; Dir: ${v.dir}°<br/>
            u: ${v.u} m/s, v: ${v.v} m/s
          </div>
        `, { sticky: true });
        vectorLayerRef.current?.addLayer(m);
      });
    }

    // 2. ASCAT-C Winds
    if (showAscat && ascatData && ascatData.daily_data && ascatData.daily_data[selectedDate]) {
      const vectors = ascatData.daily_data[selectedDate].vectors || [];
      vectors.forEach((v: any) => {
        const arrowHtml = `
          <div style="transform: rotate(${v.wind_direction}deg);" class="flex flex-col items-center justify-center">
            <div style="width: 2px; height: 18px; background-color: #f97316;"></div>
            <div style="width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 6px solid #f97316;"></div>
          </div>
        `;

        const icon = L.divIcon({
          className: 'ascat-vector',
          html: arrowHtml,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const m = L.marker([v.lat, v.lon], { icon });
        m.bindTooltip(`
          <div class="text-xs">
            <span class="font-bold text-orange-800">ASCAT-C Wind [SYNTHETIC DEMO]</span><br/>
            Speed: <strong>${v.wind_speed} m/s</strong> &bull; Dir: ${v.wind_direction}° (NE Monsoon)
          </div>
        `, { sticky: true });
        vectorLayerRef.current?.addLayer(m);
      });
    }

    // 3. CCMP 10m Winds
    if (showCcmp && ccmpData && ccmpData.daily_data && ccmpData.daily_data[selectedDate]) {
      const slot = ccmpData.daily_data[selectedDate]['12:00'];
      if (slot && slot.vectors) {
        slot.vectors.forEach((v: any) => {
          const arrowHtml = `
            <div style="transform: rotate(${v.dir}deg);" class="flex flex-col items-center justify-center">
              <div style="width: 2px; height: 18px; background-color: #8b5cf6;"></div>
              <div style="width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 6px solid #8b5cf6;"></div>
            </div>
          `;

          const icon = L.divIcon({
            className: 'ccmp-vector',
            html: arrowHtml,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });

          const m = L.marker([v.lat, v.lon], { icon });
          m.bindTooltip(`
            <div class="text-xs">
              <span class="font-bold text-purple-800">CCMP 10m Wind (12:00 UTC) [SYNTHETIC DEMO]</span><br/>
              Speed: <strong>${v.ws} m/s</strong> &bull; Dir: ${v.dir}°
            </div>
          `, { sticky: true });
          vectorLayerRef.current?.addLayer(m);
        });
      }
    }
  }, [showOscar, showAscat, showCcmp, oscarData, ascatData, ccmpData, selectedDate, dataMode]);

  return (
    <div className="relative w-full h-[520px] overflow-hidden border-2 border-[#1A1A1A]">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Geometric Legend & Map Controls Overlay */}
      <div className="absolute top-3 right-3 z-10 bg-white border-2 border-[#1A1A1A] p-3 text-xs space-y-2 max-w-[220px]">
        <div className="font-bold font-mono text-[#1A1A1A] border-b-2 border-[#1A1A1A] pb-1.5 flex justify-between items-center">
          <span className="uppercase text-[10px] tracking-wider">DEPTH: {selectedDepth}M</span>
          <span className="text-[9px] bg-[#1A1A1A] text-white px-1 py-0.5">0.25° GRID</span>
        </div>

        {/* Temperature Gradient Bar */}
        <div>
          <div className="flex justify-between text-[9px] font-mono text-[#444] mb-1 font-semibold">
            <span>&lt;4°C ABYSS</span>
            <span>&gt;29°C WARM</span>
          </div>
          <div className="h-2 w-full bg-gradient-to-r from-indigo-950 via-blue-600 via-emerald-500 via-amber-400 to-red-600 border border-[#1A1A1A]"></div>
        </div>

        {/* Map Marker Legend */}
        <div className="space-y-1.5 pt-1 text-[10px] font-mono">
          <div className="flex items-center gap-2 text-[#1A1A1A]">
            <span className="w-3.5 h-3.5 bg-red-600 text-white flex items-center justify-center text-[8px] font-bold border border-[#1A1A1A]">★</span>
            <span className="font-bold">PROBE COORDINATE</span>
          </div>
          <div className="flex items-center gap-2 text-[#1A1A1A]">
            <span className="w-3.5 h-3.5 bg-emerald-600 text-white flex items-center justify-center text-[8px] font-bold border border-[#1A1A1A]">A</span>
            <span className="font-bold">ARGO CTD (REAL)</span>
          </div>
        </div>

        {/* Active Vector Indicators */}
        {dataMode === 'real_plus_synthetic' && (
          <div className="pt-2 border-t-2 border-[#1A1A1A] space-y-1 text-[9px] font-mono font-bold">
            {showOscar && (
              <div className="flex items-center gap-1.5 text-sky-900">
                <span className="w-2 h-1 bg-sky-700"></span>
                <span>OSCAR CURRENTS [DEMO]</span>
              </div>
            )}
            {showAscat && (
              <div className="flex items-center gap-1.5 text-orange-900">
                <span className="w-2 h-1 bg-orange-700"></span>
                <span>ASCAT-C WINDS [DEMO]</span>
              </div>
            )}
            {showCcmp && (
              <div className="flex items-center gap-1.5 text-purple-900">
                <span className="w-2 h-1 bg-purple-700"></span>
                <span>CCMP 10M WINDS [DEMO]</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Hint - Geometric Style */}
      <div className="absolute bottom-3 left-3 z-10 bg-[#1A1A1A] text-white text-[10px] font-mono tracking-wider px-3 py-1.5 border border-white/30 pointer-events-none uppercase">
        Click any coordinate cell or ocean location to reposition sensor probe
      </div>
    </div>
  );
};

