"""
Prediction routes: ConvFormer inference and temperature map endpoints
"""

from fastapi import APIRouter
from ..models.schemas import PredictionRequest, PredictionResponse
from ..services.convformer_service import predict_subsurface_temperature

router = APIRouter(prefix="/predict", tags=["Prediction"])

@router.post("", response_model=PredictionResponse)
def run_prediction(request: PredictionRequest):
    """
    Executes modular subsurface temperature prediction for coordinates in Bay of Bengal.
    Returns predicted temperature profile from 0m to 2000m.
    """
    return predict_subsurface_temperature(request)
