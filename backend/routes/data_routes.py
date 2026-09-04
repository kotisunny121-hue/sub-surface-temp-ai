"""
Data routes: Data sources inventory, gridded data, and day analysis
"""

from fastapi import APIRouter, Query
from typing import Dict, Any, Optional

router = APIRouter(prefix="/data", tags=["Data Sources"])

@router.get("/sources")
def get_data_sources(mode: str = Query("real_plus_synthetic", description="real_only or real_plus_synthetic")):
    """
    Returns inventory of data sources strictly categorizing Real Data vs Synthetic Demo Data.
    """
    sources = {
        "data_mode": mode,
        "region": "Bay of Bengal (5.0°N to 22.0°N, 80.0°E to 100.0°E)",
        "spatial_grid": "0.25° × 0.25°",
        "temporal_window": "January 2020 (2020-01-01 to 2020-01-31)",
        "real_sources": [
            {
                "name": "OSTIA Sea Surface Temperature (SST)",
                "provider": "UK Met Office / Copernicus Marine (CMEMS)",
                "format": "NetCDF-4 / GRIB",
                "variables": ["analysed_sst", "analysis_error"],
                "units": "°C",
                "status": "REAL OBSERVATION",
                "role": "Surface thermal boundary condition"
            },
            {
                "name": "Multi-Observation Sea Surface Salinity (SSS)",
                "provider": "Copernicus Marine (SMOS + SMAP + In-situ)",
                "format": "NetCDF-4",
                "variables": ["sos"],
                "units": "PSU",
                "status": "REAL OBSERVATION",
                "role": "Upper ocean freshwater barrier layer & stratification"
            },
            {
                "name": "Global Ocean Sea Surface Height / SLA",
                "provider": "DUACS / CMEMS Multi-satellite Altimetry",
                "format": "NetCDF-4",
                "variables": ["sla", "adt", "ugos", "vgos"],
                "units": "meters / m/s",
                "status": "REAL OBSERVATION",
                "role": "Mesoscale eddy dynamics & vertical thermocline displacement"
            },
            {
                "name": "ARGO Float Subsurface Observations",
                "provider": "INCOIS / Indian Argo Project / GDAC",
                "format": "NetCDF / CSV",
                "variables": ["temperature", "salinity", "pressure", "depth"],
                "units": "°C, PSU, dbar, m",
                "status": "REAL OBSERVATION",
                "role": "Ground truth profiles (0m to 2000m) for model training and validation"
            }
        ],
        "synthetic_sources": []
    }

    if mode == "real_plus_synthetic":
        sources["synthetic_sources"] = [
            {
                "name": "OSCAR Ocean Surface Currents",
                "badge": "SYNTHETIC DEMO",
                "disclaimer": "Simulated demonstration data. NOT NASA observations.",
                "variables": ["u", "v", "current_speed", "current_direction"],
                "units": "m/s, degrees",
                "cadence": "Daily 0.25° grid",
                "role": "Horizontal surface advection feature"
            },
            {
                "name": "ASCAT-C Ocean Surface Wind Vectors",
                "badge": "SYNTHETIC DEMO",
                "disclaimer": "Simulated demonstration data. NOT operational EUMETSAT.",
                "variables": ["wind_speed", "wind_direction", "u_wind", "v_wind"],
                "units": "m/s, degrees",
                "cadence": "Daily 0.25° grid",
                "role": "Wind stress & surface mixing feature"
            },
            {
                "name": "CCMP 10m Surface Winds",
                "badge": "SYNTHETIC DEMO",
                "disclaimer": "Simulated demonstration data. NOT RSS product.",
                "variables": ["uwnd", "vwnd", "ws"],
                "units": "m/s",
                "cadence": "6-Hourly (00, 06, 12, 18 UTC)",
                "role": "High-frequency diurnal atmospheric forcing"
            }
        ]
        
    return sources
