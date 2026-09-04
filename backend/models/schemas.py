"""
FastAPI Pydantic Schemas for Ocean Temperature Prediction Pipeline
Smart India Hackathon (SIH) - Bay of Bengal Target Domain
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class GridCoordinate(BaseModel):
    latitude: float = Field(..., ge=5.0, le=22.0, description="Latitude in Bay of Bengal (5.0 to 22.0 N)")
    longitude: float = Field(..., ge=80.0, le=100.0, description="Longitude in Bay of Bengal (80.0 to 100.0 E)")

class PredictionRequest(BaseModel):
    latitude: float = Field(..., ge=5.0, le=22.0)
    longitude: float = Field(..., ge=80.0, le=100.0)
    date: str = Field("2020-01-15", description="Observation date (YYYY-MM-DD)")
    target_depth: Optional[float] = Field(None, ge=0.0, le=2000.0, description="Target depth in meters (0-2000m)")
    sst: Optional[float] = Field(None, description="Sea Surface Temperature in °C (OSTIA)")
    sss: Optional[float] = Field(None, description="Sea Surface Salinity in PSU")
    ssh: Optional[float] = Field(None, description="Sea Surface Height / SLA in meters")
    wind_speed: Optional[float] = Field(None, description="Optional wind speed in m/s")
    include_synthetic: bool = Field(True, description="Whether optional synthetic OSCAR/ASCAT/CCMP are active")

class DepthTemperaturePoint(BaseModel):
    depth: float
    temperature: float
    confidence_interval: List[float]

class PredictionResponse(BaseModel):
    model_name: str = "ConvFormer-Ocean"
    status: str = "PROTOTYPE / DEMO PREDICTION"
    disclaimer: str = "Prediction service is modular and can be replaced with the trained ConvFormer model."
    latitude: float
    longitude: float
    date: str
    target_depth: Optional[float] = None
    predicted_temperature_at_target: Optional[float] = None
    profile: List[DepthTemperaturePoint]
    surface_conditions: Dict[str, Any]
    confidence_score: float

class PreprocessingStepInfo(BaseModel):
    stage: str
    status: str
    records_in: int
    records_out: int
    details: Dict[str, Any]

class PreprocessingResponse(BaseModel):
    pipeline_name: str = "Bay of Bengal 0.25° Preprocessing Pipeline"
    execution_status: str = "SUCCESS"
    steps: List[PreprocessingStepInfo]
    summary_stats: Dict[str, Any]

class ValidationMetric(BaseModel):
    metric_name: str
    value: float
    unit: str
    description: str

class ValidationResponse(BaseModel):
    status: str = "PROTOTYPE / DEMONSTRATION METRICS"
    disclaimer: str = "Metrics computed on prototype comparison set. Do not present as operational scientific validation."
    float_id: str
    sample_count: int
    rmse: float
    mae: float
    r2_score: float
    pearson_correlation: float
    depth_breakdown: List[Dict[str, Any]]
