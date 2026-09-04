import { DataMode, DepthTemperaturePoint, PredictionInputs, PredictionOutput } from '../types/ocean';
import { getDeterministicSurfaceConditions } from './oceanDataService';

export const STANDARD_DEPTHS = [0, 50, 100, 200, 500, 1000, 1500, 2000];

/**
 * Predicts subsurface temperature profile across 0m - 2000m depth.
 * Implements the modular predictSubsurfaceTemperature() API.
 * 
 * In this prototype, deterministic physical calculations based on Bay of Bengal
 * climatology, surface boundary forcing, and stratification curves are applied.
 * 
 * It is architected to cleanly swap with the PyTorch ConvFormer model checkpoint.
 */
export function predictSubsurfaceTemperature(
  inputs: PredictionInputs,
  dataMode: DataMode = 'real_plus_synthetic'
): PredictionOutput {
  const { latitude: lat, longitude: lon, date = '2020-01-15', targetDepth } = inputs;
  
  // Get or compute baseline surface conditions
  const baseline = getDeterministicSurfaceConditions(lat, lon, date);
  const sst = inputs.sst !== undefined ? inputs.sst : baseline.sst;
  const sss = inputs.sss !== undefined ? inputs.sss : baseline.sss;
  const ssh = inputs.ssh !== undefined ? inputs.ssh : baseline.ssh;
  const windSpeed = inputs.windSpeed !== undefined ? inputs.windSpeed : baseline.windSpeed;
  const currentSpeed = inputs.currentSpeed !== undefined ? inputs.currentSpeed : baseline.currentSpeed;

  // Mixed layer depth calculation (affected by wind mixing, surface temperature, and SLA)
  // Higher wind speed deepens mixed layer; positive SLA depresses thermocline
  const windMixingOffset = (windSpeed - 6.5) * 1.5;
  const eddyOffset = ssh * 45;
  const mld = Math.max(18, Math.min(60, 32 + (lat - 12) * 1.1 + eddyOffset + windMixingOffset));

  const calculateTempAtDepth = (d: number): number => {
    if (d <= mld) {
      // Upper quasi-isothermal layer
      return sst - (d / mld) * 0.22;
    } else if (d <= 200) {
      // Main thermocline layer with rapid temperature drop
      const norm = (d - mld) / (200 - mld);
      const thermBase = 13.2 + (lat - 5) * 0.12;
      return (sst - 0.22) - norm * ((sst - 0.22) - thermBase);
    } else if (d <= 1000) {
      // Permanent thermocline & intermediate Antarctic Intermediate Water / Red Sea Water influence
      const norm = (d - 200) / 800;
      return 13.2 - norm * (13.2 - 6.8);
    } else {
      // Deep Abyssal Bay of Bengal water
      const norm = (d - 1000) / 1000;
      return 6.8 - norm * (6.8 - 2.8);
    }
  };

  const profile: DepthTemperaturePoint[] = STANDARD_DEPTHS.map((depth) => {
    const rawT = calculateTempAtDepth(depth);
    const temp = Number(rawT.toFixed(2));
    const confidenceMargin = depth < 200 ? 0.35 : depth < 1000 ? 0.25 : 0.15;
    return {
      depth,
      temperature: temp,
      confidenceLow: Number((temp - confidenceMargin).toFixed(2)),
      confidenceHigh: Number((temp + confidenceMargin).toFixed(2))
    };
  });

  let targetTemp: number | undefined = undefined;
  if (targetDepth !== undefined) {
    targetTemp = Number(calculateTempAtDepth(targetDepth).toFixed(2));
  }

  return {
    modelName: 'ConvFormer-Ocean (CNN + Transformer)',
    status: 'PROTOTYPE / DEMO PREDICTION',
    disclaimer: 'Prediction service is modular and can be replaced with the trained ConvFormer model.',
    latitude: lat,
    longitude: lon,
    date,
    targetDepth,
    predictedTemperatureAtTarget: targetTemp,
    profile,
    surfaceConditions: {
      sst,
      sss,
      ssh,
      mld: Number(mld.toFixed(1)),
      windSpeed: dataMode === 'real_plus_synthetic' ? windSpeed : undefined,
      currentSpeed: dataMode === 'real_plus_synthetic' ? currentSpeed : undefined
    },
    confidenceScore: 0.92,
    timestamp: new Date().toISOString()
  };
}
