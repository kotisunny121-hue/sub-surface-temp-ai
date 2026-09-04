"""
Inference runner for ConvFormer model.
Provides predict_profile() to produce 0m-2000m temperatures from input tensors.
"""

import torch
import numpy as np
from typing import Dict, Any, List
from ..models.convformer import ConvFormer

DEPTH_LEVELS = [0, 50, 100, 200, 500, 1000, 1500, 2000]

def load_convformer_checkpoint(checkpoint_path: str = None) -> ConvFormer:
    model = ConvFormer(in_channels=6, embed_dim=128, transformer_depth=4, num_depths=8)
    model.eval()
    if checkpoint_path:
        print(f"Loading weights from {checkpoint_path}")
        state = torch.load(checkpoint_path, map_location="cpu")
        model.load_state_dict(state)
    return model

def run_inference(input_tensor: np.ndarray, model: ConvFormer = None) -> Dict[str, Any]:
    """
    input_tensor: shape (1, 6, H, W) normalized surface features
    Returns predicted temperature array across standard depth levels
    """
    if model is None:
        model = load_convformer_checkpoint()
        
    with torch.no_grad():
        x = torch.from_numpy(input_tensor).float()
        output = model(x).squeeze(0).numpy()
        
    return {
        "depth_levels": DEPTH_LEVELS,
        "predicted_temperatures": output.tolist(),
        "model_architecture": "ConvFormer"
    }
