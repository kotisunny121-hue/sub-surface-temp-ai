# SYNTHETIC DEMO DATA SPECIFICATION

**PROJECT:** AI-Based Subsurface Ocean Temperature Prediction (Smart India Hackathon Prototype)  
**TARGET REGION:** Bay of Bengal (5.0°N – 22.0°N, 80.0°E – 100.0°E)  
**STATUS:** SYNTHETIC DEMO DATA ONLY — DO NOT USE AS SCIENTIFIC GROUND TRUTH

---

### IMPORTANT SCIENTIFIC DISCLAIMER
- **These datasets (OSCAR, ASCAT-C, CCMP) are synthetic demonstration files.**
- They are created **only to demonstrate the end-to-end multi-source ocean software pipeline** and prototype visualization capabilities within this web prototype.
- They are **NOT** NASA/PO.DAAC, NOAA, or ESA measured satellite observations.
- They must **NOT** be used as scientific ground truth or for operational oceanographic/meteorological forecasting.
- They must **NOT** be used to claim scientific model accuracy or compute validated skill scores.
- Real observational datasets (such as NASA/PO.DAAC OSCAR NetCDF, EUMETSAT/KNMI ASCAT-C NetCDF, and RSS CCMP v3.0 10m Wind NetCDF) can later replace these files through the modular data service layer without changing the application architecture or frontend components.

---

### DATASET BREAKDOWN

| Dataset | Type | Variables | Grid / Cadence | Status |
|---|---|---|---|---|
| **OSTIA SST** | Real Satellite/Reanalysis | Sea Surface Temperature (°C) | 0.25° Daily | Primary Real Input |
| **Multi-Obs SSS** | Real Satellite/In-Situ | Sea Surface Salinity (PSU) | 0.25° Daily | Primary Real Input |
| **Global Ocean SSH/SLA** | Real Altimetry | Sea Level Anomaly (m), Absolute Dynamic Topography | 0.25° Daily | Primary Real Input |
| **ARGO Floats** | Real In-Situ Profiles | Temperature, Salinity, Pressure/Depth (0–2000m) | Real Float Trajectories | Primary Ground Truth for Validation |
| **OSCAR** | Synthetic Demo | Surface Current vectors `u`, `v` (m/s), `current_speed`, `current_direction` | 0.25° Daily (Jan 2020) | [SYNTHETIC DEMO] |
| **ASCAT-C** | Synthetic Demo | Wind Speed (m/s), Wind Direction (°), `u_wind`, `v_wind` | 0.25° Daily (Jan 2020) | [SYNTHETIC DEMO] |
| **CCMP** | Synthetic Demo | 10m Winds `uwnd`, `vwnd` (m/s), `ws` = sqrt(uwnd² + vwnd²) | 0.25° 6-Hourly (00, 06, 12, 18 UTC) | [SYNTHETIC DEMO] |

---

### REPLACEMENT INSTRUCTIONS
To swap synthetic JSON files with real production NetCDF data:
1. Process raw NetCDF (.nc) files using the backend python scripts in `backend/preprocessing/`
2. Update the environment or application config:
   ```ts
   DATA_MODE = "real_only" // or configure backend ingest URLs
   ```
3. The frontend data service layer seamlessly reads from the updated API endpoints without UI modifications.
