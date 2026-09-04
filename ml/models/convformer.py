"""
ConvFormer: Hybrid CNN-Transformer Architecture for Subsurface Ocean Temperature Prediction
Designed for Bay of Bengal (0.25° × 0.25° grid, 0m - 2000m depth profiles)
"""

import math
import torch
import torch.nn as nn
import torch.nn.functional as F

class CNNFeatureExtractor(nn.Module):
    """
    Extracts local multi-scale spatial ocean patterns (eddies, fronts, coastal boundary currents).
    Input: (B, in_channels, H, W)
    Output: (B, cnn_dim, H', W')
    """
    def __init__(self, in_channels=6, cnn_dim=64):
        super().__init__()
        self.stem = nn.Sequential(
            nn.Conv2d(in_channels, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.GELU(),
            nn.Conv2d(32, cnn_dim, kernel_size=3, padding=1),
            nn.BatchNorm2d(cnn_dim),
            nn.GELU(),
        )
        self.res_block = nn.Sequential(
            nn.Conv2d(cnn_dim, cnn_dim, kernel_size=3, padding=1),
            nn.BatchNorm2d(cnn_dim),
            nn.GELU(),
            nn.Conv2d(cnn_dim, cnn_dim, kernel_size=3, padding=1),
            nn.BatchNorm2d(cnn_dim),
        )
        self.downsample = nn.MaxPool2d(kernel_size=2, stride=2)

    def forward(self, x):
        x = self.stem(x)
        res = self.res_block(x)
        x = F.gelu(x + res)
        x = self.downsample(x)
        return x

class PatchEmbedding(nn.Module):
    """
    Flattens spatial features into patch tokens with learnable 2D positional encoding.
    """
    def __init__(self, cnn_dim=64, embed_dim=128):
        super().__init__()
        self.proj = nn.Conv2d(cnn_dim, embed_dim, kernel_size=1)
        
    def forward(self, x):
        # x: (B, cnn_dim, H', W')
        x = self.proj(x) # (B, embed_dim, H', W')
        B, C, H, W = x.shape
        x = x.flatten(2).transpose(1, 2) # (B, num_patches, embed_dim)
        return x

class TransformerEncoder(nn.Module):
    """
    Multi-Head Self-Attention layers modeling basin-wide ocean teleconnections.
    """
    def __init__(self, embed_dim=128, depth=4, num_heads=8, mlp_ratio=4.0, dropout=0.1):
        super().__init__()
        self.layers = nn.ModuleList([
            nn.TransformerEncoderLayer(
                d_model=embed_dim,
                nhead=num_heads,
                dim_feedforward=int(embed_dim * mlp_ratio),
                dropout=dropout,
                activation="gelu",
                batch_first=True,
                norm_first=True
            )
            for _ in range(depth)
        ])
        self.norm = nn.LayerNorm(embed_dim)

    def forward(self, x):
        for layer in self.layers:
            x = layer(x)
        return self.norm(x)

class DepthDecoder(nn.Module):
    """
    Decodes global latent ocean features into discrete subsurface temperature levels (0m - 2000m).
    """
    def __init__(self, embed_dim=128, num_depth_levels=8):
        super().__init__()
        self.decoder = nn.Sequential(
            nn.Linear(embed_dim, 256),
            nn.GELU(),
            nn.Dropout(0.1),
            nn.Linear(256, 128),
            nn.GELU(),
            nn.Linear(128, num_depth_levels)
        )

    def forward(self, global_feature):
        # global_feature: (B, embed_dim)
        return self.decoder(global_feature)

class ConvFormer(nn.Module):
    """
    Complete ConvFormer Model:
    Satellite & Surface Ocean Features -> CNN Encoder -> Patch Embedding ->
    Transformer Encoder -> Global Pooling -> Depth Decoder -> Subsurface Temperature Profile (0m - 2000m).
    """
    def __init__(self, in_channels=6, embed_dim=128, transformer_depth=4, num_depths=8):
        super().__init__()
        self.cnn_extractor = CNNFeatureExtractor(in_channels=in_channels, cnn_dim=64)
        self.patch_embed = PatchEmbedding(cnn_dim=64, embed_dim=embed_dim)
        self.transformer = TransformerEncoder(embed_dim=embed_dim, depth=transformer_depth)
        self.depth_decoder = DepthDecoder(embed_dim=embed_dim, num_depth_levels=num_depths)

    def forward(self, x):
        # 1. CNN Feature Extraction (Local features)
        feat = self.cnn_extractor(x)
        # 2. Patch Embedding
        tokens = self.patch_embed(feat)
        # 3. Transformer Encoder (Global ocean context)
        encoded = self.transformer(tokens)
        # 4. Global Average Pooling across spatial patches
        global_repr = encoded.mean(dim=1)
        # 5. Depth Decoder
        subsurface_profile = self.depth_decoder(global_repr)
        return subsurface_profile
