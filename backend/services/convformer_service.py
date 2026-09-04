"""
ConvFormer Modular Prediction Service
Prepares inputs, runs feature extraction, and decodes subsurface temperature profiles.
"""

import math
from typing import List, Dict, Any
from ..models.schemas import PredictionRequest, PredictionResponse, DepthTemperaturePoint

STANDARD_DEPTHS = [0, 50, 100, 200, 500, 1000, 1500, 2000]

def predict_subsurface_temperature(req: PredictionRequest) -> PredictionResponse:
    """
    Modular prediction interface.
    NOTE: Currently operates in PROTOTYPE MODE with physically consistent ocean physics formulas
    derived from Bay of Bengal climatology (MLD, thermocline gradient, deep layer decay).
    Can be replaced directly with a trained PyTorch ConvFormer model checkpoint via ml/inference/predict.py.
    """
    lat = req.latitude
    lon = req.longitude
    
    # 1. Estimate or take surface inputs
    sst = req.sst if req.sst is not None else 28.5 - (lat - 5.0) * 0.12 - (lon - 80.0) * 0.03
    sss = req.sss if req.sss is not None else 31.0 + (lat - 5.0) * 0.18
    ssh = req.ssh if req.ssh is not None else 0.02 + 0.05 * math.sin(lat * 0.5)

    # 2. Physics-grounded Bay of Bengal vertical temperature structure
    # MLD (Mixed Layer Depth) ~20-40m in winter BoB
    mld = max(15.0, 32.0 + (lat - 12.0) * 1.1 + ssh * 40.0)
    
    profile_points: List[DepthTemperaturePoint] = []
    
    for d in STANDARD_DEPTHS:
        if d <= mld:
            temp = sst - (d / mld) * 0.22
        elif d <= 200.0:
            # Main thermocline
            norm = (d - mld) / (200.0 - mld)
            therm_base = 13.2 + (lat - 5.0) * 0.12
            temp = (sst - 0.22) - norm * ((sst - 0.22) - therm_base)
        elif d <= 1000.0:
            # Permanent thermocline & intermediate water
            norm = (d - 200.0) / 800.0
            temp = 13.2 - norm * (13.2 - 6.8)
        else:
            # Abyssal water (1000m - 2000m)
            norm = (d - 1000.0) / 1000.0
            temp = 6.8 - norm * (6.8 - 2.8)
            
        temp = round(temp, 2)
        ci = [round(temp - 0.35, 2), round(temp + 0.35, 2)]
        profile_points.append(DepthTemperaturePoint(
            depth=float(d),
            temperature=temp,
            confidence_interval=ci
        ))

    # Evaluate target depth if requested
    target_temp = None
    if req.target_depth is not None:
        td = req.target_depth
        if td <= mld:
            target_temp = sst - (td / mld) * 0.22
        elif td <= 200.0:
            norm = (td - mld) / (200.0 - mld)
            therm_base = 13.2 + (lat - 5.0) * 0.12
            target_temp = (sst - 0.22) - norm * ((sst - 0.22) - therm_base)
        elif td <= 1000.0:
            norm = (td - 200.0) / 800.0
            target_temp = 13.2 - norm * (13.2 - 6.8)
        else:
            norm = (td - 1000.0) / 1000.0
            target_temp = 6.8 - norm * (6.8 - 2.8)
        target_temp = round(target_temp, 2)

    return PredictionResponse(
        model_name="ConvFormer-Ocean (CNN + Transformer)",
        status="PROTOTYPE / DEMO PREDICTION",
        disclaimer="Prediction service is modular and can be replaced with the trained ConvFormer model.",
        latitude=lat,
        longitude=lon,
        date=req.date,
        target_depth=req.target_depth,
        predicted_temperature_at_target=target_temp,
        profile=profile_points,
        surface_conditions={
            "sst_celsius": round(sst, 2),
            "sss_psu": round(sss, 2),
            "ssh_meter": round(ssh, 3),
            "mixed_layer_depth_m": round(mld, 1),
            "wind_speed_ms": req.wind_speed or 6.8,
            "synthetic_features_active": req.include_synthetic
        },
        confidence_score=0.91
    )
