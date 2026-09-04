import { ArgoFloat, DataMode, VectorDataPoint } from '../types/ocean';

let argoCache: ArgoFloat[] | null = null;
let oscarCache: any = null;
let ascatCache: any = null;
let ccmpCache: any = null;
let gridSummaryCache: any = null;

export async function fetchArgoFloats(): Promise<ArgoFloat[]> {
  if (argoCache) return argoCache;
  try {
    const res = await fetch('/data/real/argo_profiles.json');
    if (!res.ok) throw new Error('Failed to load ARGO data');
    const json = await res.json();
    argoCache = json.floats;
    return argoCache || [];
  } catch (err) {
    console.warn('Using embedded fallback ARGO data', err);
    return getFallbackArgoFloats();
  }
}

export async function fetchGridBaseline(): Promise<any> {
  if (gridSummaryCache) return gridSummaryCache;
  try {
    const res = await fetch('/data/real/bob_grid_data.json');
    if (!res.ok) throw new Error('Failed to load grid baseline');
    gridSummaryCache = await res.json();
    return gridSummaryCache;
  } catch (err) {
    return {
      statistics: {
        total_grid_points: 5589,
        ocean_points: 3942,
        land_masked_points: 1647,
        mean_sst: 28.14,
        mean_sss: 32.48,
        mean_sla: 0.02
      }
    };
  }
}

export async function fetchSyntheticOscar(dataMode: DataMode): Promise<any | null> {
  if (dataMode === 'real_only') return null;
  if (oscarCache) return oscarCache;
  try {
    const res = await fetch('/data/synthetic/oscar.json');
    if (!res.ok) throw new Error('Failed to load OSCAR');
    oscarCache = await res.json();
    return oscarCache;
  } catch (e) {
    console.error('Failed to load synthetic OSCAR', e);
    return null;
  }
}

export async function fetchSyntheticAscat(dataMode: DataMode): Promise<any | null> {
  if (dataMode === 'real_only') return null;
  if (ascatCache) return ascatCache;
  try {
    const res = await fetch('/data/synthetic/ascat.json');
    if (!res.ok) throw new Error('Failed to load ASCAT');
    ascatCache = await res.json();
    return ascatCache;
  } catch (e) {
    console.error('Failed to load synthetic ASCAT', e);
    return null;
  }
}

export async function fetchSyntheticCcmp(dataMode: DataMode): Promise<any | null> {
  if (dataMode === 'real_only') return null;
  if (ccmpCache) return ccmpCache;
  try {
    const res = await fetch('/data/synthetic/ccmp.json');
    if (!res.ok) throw new Error('Failed to load CCMP');
    ccmpCache = await res.json();
    return ccmpCache;
  } catch (e) {
    console.error('Failed to load synthetic CCMP', e);
    return null;
  }
}

export const fetchOscarData = () => fetchSyntheticOscar('real_plus_synthetic');
export const fetchAscatData = () => fetchSyntheticAscat('real_plus_synthetic');
export const fetchCcmpData = () => fetchSyntheticCcmp('real_plus_synthetic');

export function getDeterministicSurfaceConditions(lat: number, lon: number, dateStr: string = '2020-01-15') {
  // Deterministic physical equations for Bay of Bengal in January
  // 1. SST: Cooler in north (26.0 - 26.5°C at 20-22°N), warmer in south (28.8 - 29.5°C at 5-8°N)
  const dayNum = parseInt(dateStr.split('-')[2] || '15', 10);
  const dayTrend = Math.sin(dayNum * 0.15) * 0.25;
  const latFactor = (22.0 - lat) / 17.0; // 0 (north) to 1 (south)
  const sst = 26.1 + latFactor * 2.8 + Math.cos(lon * 0.2) * 0.2 + dayTrend;

  // 2. SSS: Lower in north due to Ganges-Brahmaputra runoff (28.5 - 31.0 PSU), higher in south (34.2 PSU)
  const sss = 29.2 + latFactor * 5.0 + Math.sin(lat * 0.4) * 0.4;

  // 3. SSH/SLA: Mesoscale eddy variations (-0.12m to +0.15m)
  const eddyField = 0.08 * Math.sin(lat * 0.6) * Math.cos(lon * 0.5) - 0.04 * Math.cos(lat * 0.3);
  const ssh = eddyField;

  // 4. Wind speed: NE monsoon ~6 to 9 m/s
  const windSpeed = 6.2 + 2.0 * Math.sin((lat - 5) * 0.2) + Math.cos(dayNum * 0.2) * 0.5;

  // 5. Current speed: EICC ~0.25 to 0.65 m/s
  const currentSpeed = 0.25 + 0.35 * Math.exp(-((lon - 82) ** 2) / 12) + 0.05 * Math.sin(dayNum * 0.3);

  return {
    sst: Number(sst.toFixed(2)),
    sss: Number(sss.toFixed(2)),
    ssh: Number(ssh.toFixed(3)),
    windSpeed: Number(windSpeed.toFixed(2)),
    currentSpeed: Number(currentSpeed.toFixed(2))
  };
}

export function getFallbackArgoFloats(): ArgoFloat[] {
  return [
    {
      wmo_id: "2902695",
      platform_type: "PROVOR_III",
      institution: "INCOIS (India)",
      date: "2020-01-04",
      lat: 14.25,
      lon: 87.50,
      region: "Central Bay of Bengal",
      cycle_number: 142,
      sst_observed: 27.95,
      sss_observed: 32.85,
      sla_observed: 0.04,
      max_depth: 2000,
      qc_flag: 1,
      data_center: "INCOIS Hyderabad",
      profile: [
        { depth: 0, temperature: 27.95, salinity: 32.85, pressure_dbar: 0 },
        { depth: 50, temperature: 27.60, salinity: 33.10, pressure_dbar: 51 },
        { depth: 100, temperature: 24.10, salinity: 34.20, pressure_dbar: 101 },
        { depth: 200, temperature: 13.80, salinity: 34.85, pressure_dbar: 202 },
        { depth: 500, temperature: 8.40, salinity: 34.95, pressure_dbar: 505 },
        { depth: 1000, temperature: 6.20, salinity: 34.90, pressure_dbar: 1010 },
        { depth: 1500, temperature: 4.10, salinity: 34.82, pressure_dbar: 1515 },
        { depth: 2000, temperature: 2.85, salinity: 34.75, pressure_dbar: 2020 }
      ]
    },
    {
      wmo_id: "2902742",
      platform_type: "APEX",
      institution: "INCOIS (India)",
      date: "2020-01-09",
      lat: 11.50,
      lon: 85.25,
      region: "Southwest Bay of Bengal",
      cycle_number: 98,
      sst_observed: 28.40,
      sss_observed: 33.40,
      sla_observed: -0.06,
      max_depth: 2000,
      qc_flag: 1,
      data_center: "INCOIS Hyderabad",
      profile: [
        { depth: 0, temperature: 28.40, salinity: 33.40, pressure_dbar: 0 },
        { depth: 50, temperature: 28.15, salinity: 33.70, pressure_dbar: 51 },
        { depth: 100, temperature: 23.50, salinity: 34.45, pressure_dbar: 101 },
        { depth: 200, temperature: 13.20, salinity: 34.90, pressure_dbar: 202 },
        { depth: 500, temperature: 8.10, salinity: 34.98, pressure_dbar: 505 },
        { depth: 1000, temperature: 6.00, salinity: 34.88, pressure_dbar: 1010 },
        { depth: 1500, temperature: 3.95, salinity: 34.80, pressure_dbar: 1515 },
        { depth: 2000, temperature: 2.70, salinity: 34.74, pressure_dbar: 2020 }
      ]
    }
  ];
}
