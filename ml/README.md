# ConvFormer: Subsurface Ocean Temperature Prediction Architecture

**Target Domain:** Bay of Bengal (5.0°N – 22.0°N, 80.0°E – 100.0°E)  
**Input Channels (6):** SST, SSS, SSH/SLA, Surface Winds (u, v), Surface Current Speed  
**Target Depths (8):** 0m, 50m, 100m, 200m, 500m, 1000m, 1500m, 2000m  

### Architecture Stages
```
Input Features (N x H x W x C)
       ↓
CNN Encoder (Local Feature Extractor)
       ↓
Patch Embedding (Spatial Tokenization)
       ↓
Transformer Encoder (Basin-Wide Self-Attention)
       ↓
Global Ocean Latent Representation
       ↓
Depth Decoder (Multi-Layer Perceptron)
       ↓
Predicted Subsurface Temperature Profile (0m – 2000m)
```

### Model Status
- **Current Prototype Status:** Ready for training integration (`ml/models/convformer.py`).
- **Inference Mode:** Modular service interface (`backend/services/convformer_service.py` & `src/services/predictionService.ts`).
- **Ground Truth Validation:** Collocated ARGO Float CTD profiles across Bay of Bengal.
