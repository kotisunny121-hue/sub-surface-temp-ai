"""
Validation routes: ARGO vs Predicted evaluation
"""

from fastapi import APIRouter, Query
from ..models.schemas import ValidationResponse
from ..validation.metrics import compute_argo_validation

router = APIRouter(prefix="/validate", tags=["Validation"])

@router.get("", response_model=ValidationResponse)
def get_validation_metrics(float_id: str = Query("2902695", description="ARGO WMO float ID")):
    """
    Returns comparison metrics between ARGO float observations and model predictions.
    """
    return compute_argo_validation(float_id=float_id)
