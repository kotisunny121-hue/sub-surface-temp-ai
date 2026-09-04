"""
FastAPI Server: AI-Based Subsurface Ocean Temperature Prediction
Bay of Bengal Target Domain - Smart India Hackathon
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.data_routes import router as data_router
from .routes.prediction_routes import router as prediction_router
from .routes.validation_routes import router as validation_router
from .preprocessing.pipeline import execute_preprocessing_pipeline

app = FastAPI(
    title="Subsurface Ocean Temperature Prediction API",
    description="Backend API for ConvFormer-based 0m-2000m ocean temperature forecasting in the Bay of Bengal",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(data_router, prefix="/api")
app.include_router(prediction_router, prefix="/api")
app.include_router(validation_router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Ocean Temperature Prediction API",
        "region": "Bay of Bengal (5°N - 22°N, 80°E - 100°E)",
        "model_architecture": "ConvFormer (CNN + Transformer Encoder + Depth Decoder)"
    }

@app.post("/api/preprocess")
def run_preprocessing():
    """
    Executes the 8-stage data preprocessing pipeline.
    """
    return execute_preprocessing_pipeline()

@app.get("/api/model-info")
def get_model_info():
    return {
        "model_name": "ConvFormer-Ocean",
        "status": "TRAINING / PROTOTYPE DEMO READY",
        "disclaimer": "Prediction service is modular and can be replaced with the trained ConvFormer model.",
        "input_features": [
            "OSTIA Sea Surface Temperature (SST)",
            "Multi-Observation Sea Surface Salinity (SSS)",
            "Global Ocean Sea Surface Height / SLA",
            "Optional: OSCAR Ocean Surface Currents [SYNTHETIC DEMO]",
            "Optional: ASCAT-C Wind Vectors [SYNTHETIC DEMO]",
            "Optional: CCMP 10m Winds [SYNTHETIC DEMO]"
        ],
        "target_variable": "Subsurface Temperature Profile (0m - 2000m)",
        "depth_levels": [0, 50, 100, 200, 500, 1000, 1500, 2000],
        "spatial_resolution": "0.25° × 0.25° grid",
        "ground_truth_validation": "ARGO Float CTD Profiles"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
