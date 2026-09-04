import { PreprocessingStage } from '../types/ocean';

export const PREPROCESSING_STAGES: PreprocessingStage[] = [
  {
    id: 1,
    title: '1. Data Ingestion & Format Parsing',
    badge: 'COMPLETED',
    recordsIn: 152400,
    recordsOut: 152400,
    description: 'Multi-source ingestion of NetCDF-4, CSV, and GRIB-2 formats across Bay of Bengal spatial bounds.',
    details: [
      { label: 'Real Datasets Ingested', value: 'OSTIA SST, Multi-Obs SSS, DUACS SSH/SLA, ARGO' },
      { label: 'Synthetic Demo Datasets', value: 'OSCAR, ASCAT-C, CCMP' },
      { label: 'Ingestion Engine', value: 'Python xarray, netCDF4, pandas' },
      { label: 'Byte Volume Processed', value: '1.42 GB' }
    ]
  },
  {
    id: 2,
    title: '2. Quality Control & Cleaning',
    badge: 'COMPLETED',
    recordsIn: 152400,
    recordsOut: 149820,
    rejectionOrMissingRate: '1.69% rejected',
    description: 'Enforcing WMO/IOC Argo Manual v3.4 quality control flags (Flags 1 & 2 accepted; 3 & 4 discarded).',
    details: [
      { label: 'Spike Test', value: 'Passed (|dT/dz| < 0.25 °C/m)' },
      { label: 'Pressure Inversion Check', value: '0 inversions detected' },
      { label: 'Sensor Drift Filter', value: 'Automated salinity drift flag applied' },
      { label: 'Valid Records Retained', value: '149,820 (98.31%)' }
    ]
  },
  {
    id: 3,
    title: '3. Missing Value Handling',
    badge: 'COMPLETED',
    recordsIn: 149820,
    recordsOut: 149820,
    rejectionOrMissingRate: '2,680 coastal/cloud gaps filled',
    description: 'Handling satellite infrared cloud blockage and coastal shallow-water missing data via spatial Kriging.',
    details: [
      { label: 'Interpolation Method', value: 'Bilinear + Spatio-temporal Kriging' },
      { label: 'Cloud-Cover Mask Gap Filling', value: '2,680 grid points reconstructed' },
      { label: 'Coastline Boundary Mask', value: 'GEBCO 15-arc-second bathymetry aligned' }
    ]
  },
  {
    id: 4,
    title: '4. Outlier Detection',
    badge: 'COMPLETED',
    recordsIn: 149820,
    recordsOut: 149488,
    rejectionOrMissingRate: '332 outliers removed',
    description: 'Z-score (threshold > 3.5σ) and Interquartile Range (IQR) filtering for unphysical extreme anomalies.',
    details: [
      { label: 'SST Physical Bounds', value: '15.0°C to 34.0°C' },
      { label: 'SSS Physical Bounds', value: '20.0 to 40.0 PSU' },
      { label: 'SSH Physical Bounds', value: '-1.5m to +1.5m' },
      { label: 'Anomalous Spikes Removed', value: '332' }
    ]
  },
  {
    id: 5,
    title: '5. Temporal Alignment',
    badge: 'COMPLETED',
    recordsIn: 149488,
    recordsOut: 149488,
    description: 'Synchronizing multi-source observation stamps to unified daily 00:00 UTC bins for January 2020.',
    details: [
      { label: 'Target Cadence', value: 'Daily (2020-01-01 to 2020-01-31)' },
      { label: 'High-Freq CCMP Alignment', value: 'Averaged into daily mean & diurnal slices' },
      { label: 'Temporal Matching Window', value: '±12 hours maximum offset' }
    ]
  },
  {
    id: 6,
    title: '6. Spatial Alignment (0.25° × 0.25° Grid)',
    badge: 'COMPLETED',
    recordsIn: 149488,
    recordsOut: 173259,
    description: 'Barycentric regridding to standard 0.25° × 0.25° Bay of Bengal mesh (5.0°N–22.0°N, 80.0°E–100.0°E).',
    details: [
      { label: 'Latitude Mesh', value: '5.0° to 22.0° N (69 points)' },
      { label: 'Longitude Mesh', value: '80.0° to 100.0° E (81 points)' },
      { label: 'Total Grid Cells', value: '5,589' },
      { label: 'Active Ocean Cells', value: '3,942' },
      { label: 'Land Masked Cells', value: '1,647' }
    ]
  },
  {
    id: 7,
    title: '7. Standardization & Normalization',
    badge: 'COMPLETED',
    recordsIn: 173259,
    recordsOut: 173259,
    description: 'Applying robust Z-score standardization: z = (x - μ) / σ for all input channels before ConvFormer.',
    details: [
      { label: 'SST Normalization', value: 'μ = 28.14°C, σ = 0.82°C' },
      { label: 'SSS Normalization', value: 'μ = 32.48 PSU, σ = 1.45 PSU' },
      { label: 'SSH Normalization', value: 'μ = 0.02 m, σ = 0.08 m' },
      { label: 'Surface Wind Norm', value: 'μ = 7.10 m/s, σ = 1.85 m/s' }
    ]
  },
  {
    id: 8,
    title: '8. Space-Time Stratified Split',
    badge: 'COMPLETED',
    recordsIn: 173259,
    recordsOut: 173259,
    description: 'Partitioning dataset to prevent spatial and temporal data leakage during model training.',
    details: [
      { label: 'Training Set', value: '70% (Spatial Subdomains A & B)' },
      { label: 'Validation Set', value: '15% (Independent ARGO Collocations)' },
      { label: 'Test Evaluation Set', value: '15% (Withheld temporal block)' }
    ]
  }
];
