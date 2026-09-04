/**
 * TypeScript definitions for Ocean Temperature Prediction Pipeline
 */

export type DataMode = 'real_plus_synthetic' | 'real_only';

export type NavigationPage = 
  | 'dashboard'
  | 'data-sources'
  | 'preprocessing'
  | 'pattern-analysis'
  | 'prediction'
  | 'validation'
  | 'architecture'
  | 'day-to-day'
  | 'about';

export interface DepthTemperaturePoint {
  depth: number;
  temperature: number;
  confidenceLow?: number;
  confidenceHigh?: number;
}

export interface ArgoProfilePoint {
  depth: number;
  temperature: number;
  salinity: number;
  pressure_dbar: number;
}

export interface ArgoFloat {
  wmo_id: string;
  platform_type: string;
  institution: string;
  date: string;
  lat: number;
  lon: number;
  region: string;
  cycle_number: number;
  sst_observed: number;
  sss_observed: number;
  sla_observed: number;
  max_depth: number;
  qc_flag: number;
  data_center: string;
  profile: ArgoProfilePoint[];
}

export interface PredictionInputs {
  latitude: number;
  longitude: number;
  date: string;
  targetDepth?: number;
  sst?: number;
  sss?: number;
  ssh?: number;
  windSpeed?: number;
  currentSpeed?: number;
}

export interface PredictionOutput {
  modelName: string;
  status: 'PROTOTYPE / DEMO PREDICTION';
  disclaimer: string;
  latitude: number;
  longitude: number;
  date: string;
  targetDepth?: number;
  predictedTemperatureAtTarget?: number;
  profile: DepthTemperaturePoint[];
  surfaceConditions: {
    sst: number;
    sss: number;
    ssh: number;
    mld: number;
    windSpeed?: number;
    currentSpeed?: number;
  };
  confidenceScore: number;
  timestamp: string;
}

export interface ValidationMetricSet {
  status: 'PROTOTYPE / DEMONSTRATION METRICS';
  disclaimer: string;
  floatId: string;
  sampleCount: number;
  rmse: number;
  mae: number;
  r2Score: number;
  correlation: number;
  depthBreakdown: {
    depth: number;
    observed: number;
    predicted: number;
    error: number;
    absError: number;
  }[];
}

export interface VectorDataPoint {
  lat: number;
  lon: number;
  u?: number;
  v?: number;
  speed?: number;
  dir?: number;
  wind_speed?: number;
  wind_direction?: number;
  uwnd?: number;
  vwnd?: number;
  ws?: number;
}

export interface PreprocessingStage {
  id: number;
  title: string;
  badge: 'COMPLETED' | 'IN PROGRESS';
  recordsIn: number;
  recordsOut: number;
  rejectionOrMissingRate?: string;
  description: string;
  details: { label: string; value: string | number }[];
}
