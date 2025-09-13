"""
Next Hour Price Up/Down Predictor API
A FastAPI-based service for predicting stock price movements using machine learning.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Union
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Price Predictor API",
    description="Predict next hour stock price movements using machine learning",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and scaler
model = None
scaler = None
model_loaded = False

class OHLCVData(BaseModel):
    """Single OHLCV data point"""
    open: float = Field(..., description="Opening price", gt=0)
    high: float = Field(..., description="Highest price", gt=0)
    low: float = Field(..., description="Lowest price", gt=0)
    close: float = Field(..., description="Closing price", gt=0)
    volume: float = Field(..., description="Trading volume", ge=0)

class PredictionRequest(BaseModel):
    """Request model for single or batch prediction"""
    data: Union[OHLCVData, List[OHLCVData]] = Field(..., description="OHLCV data for prediction")

class PredictionResponse(BaseModel):
    """Response model for predictions"""
    prediction: Union[int, List[int]] = Field(..., description="Prediction: 1 for up, 0 for down")
    probability: Union[float, List[float]] = Field(..., description="Confidence probability")
    confidence: Union[str, List[str]] = Field(..., description="Confidence level (High/Medium/Low)")
    error: Optional[str] = Field(None, description="Error message if any")

def validate_ohlcv_data(data: OHLCVData) -> bool:
    """Validate OHLCV data for logical consistency"""
    if data.high < data.low:
        return False
    if data.high < data.open or data.high < data.close:
        return False
    if data.low > data.open or data.low > data.close:
        return False
    return True

def create_features(ohlcv_data: List[OHLCVData]) -> np.ndarray:
    """Create features from OHLCV data for model prediction"""
    features = []
    
    for i, data in enumerate(ohlcv_data):
        # Basic price features
        price_range = data.high - data.low
        body_size = abs(data.close - data.open)
        upper_shadow = data.high - max(data.open, data.close)
        lower_shadow = min(data.open, data.close) - data.low
        
        # Price ratios
        body_ratio = body_size / price_range if price_range > 0 else 0
        upper_shadow_ratio = upper_shadow / price_range if price_range > 0 else 0
        lower_shadow_ratio = lower_shadow / price_range if price_range > 0 else 0
        
        # Volume features
        volume_ratio = data.volume / (data.high + data.low + data.close) if (data.high + data.low + data.close) > 0 else 0
        
        # Price momentum
        price_change = (data.close - data.open) / data.open if data.open > 0 else 0
        
        # Technical indicators (simplified)
        rsi_approx = 50 + (price_change * 10)  # Simplified RSI approximation
        rsi_approx = max(0, min(100, rsi_approx))
        
        feature_vector = [
            data.open,
            data.high,
            data.low,
            data.close,
            data.volume,
            price_range,
            body_size,
            upper_shadow,
            lower_shadow,
            body_ratio,
            upper_shadow_ratio,
            lower_shadow_ratio,
            volume_ratio,
            price_change,
            rsi_approx
        ]
        
        features.append(feature_vector)
    
    return np.array(features)

def load_or_create_model():
    """Load existing model or create a new one with demo data"""
    global model, scaler, model_loaded
    
    model_path = "price_predictor_model.pkl"
    scaler_path = "price_scaler.pkl"
    
    try:
        if os.path.exists(model_path) and os.path.exists(scaler_path):
            model = joblib.load(model_path)
            scaler = joblib.load(scaler_path)
            logger.info("Loaded existing model and scaler")
        else:
            logger.info("Creating new model with demo data")
            create_demo_model()
            
        model_loaded = True
        logger.info("Model loaded successfully")
        
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        create_demo_model()
        model_loaded = True

def create_demo_model():
    """Create a demo model with synthetic data"""
    global model, scaler
    
    # Generate synthetic training data
    np.random.seed(42)
    n_samples = 1000
    
    # Generate realistic OHLCV data
    base_prices = np.random.uniform(50, 200, n_samples)
    price_changes = np.random.normal(0, 0.02, n_samples)  # 2% volatility
    
    X = []
    y = []
    
    for i in range(n_samples):
        open_price = base_prices[i]
        close_price = open_price * (1 + price_changes[i])
        high_price = max(open_price, close_price) * (1 + abs(np.random.normal(0, 0.01)))
        low_price = min(open_price, close_price) * (1 - abs(np.random.normal(0, 0.01)))
        volume = np.random.uniform(1000, 100000)
        
        # Create features
        ohlcv = OHLCVData(
            open=open_price,
            high=high_price,
            low=low_price,
            close=close_price,
            volume=volume
        )
        
        features = create_features([ohlcv])[0]
        X.append(features)
        
        # Target: 1 if price goes up next hour, 0 if down
        y.append(1 if price_changes[i] > 0 else 0)
    
    X = np.array(X)
    y = np.array(y)
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Train model
    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        max_depth=10,
        min_samples_split=5
    )
    model.fit(X_scaled, y)
    
    # Save model and scaler
    joblib.dump(model, "price_predictor_model.pkl")
    joblib.dump(scaler, "price_scaler.pkl")
    
    logger.info("Demo model created and saved")

@app.on_event("startup")
async def startup_event():
    """Initialize model on startup"""
    load_or_create_model()

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Price Predictor API",
        "version": "1.0.0",
        "status": "running",
        "model_loaded": model_loaded,
        "endpoints": {
            "predict": "/predict",
            "health": "/health",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model_loaded,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_price_movement(request: PredictionRequest):
    """
    Predict next hour price movement (up/down) based on OHLCV data.
    
    Args:
        request: PredictionRequest containing OHLCV data
        
    Returns:
        PredictionResponse with prediction, probability, and confidence
    """
    try:
        if not model_loaded:
            raise HTTPException(status_code=503, detail="Model not loaded")
        
        # Handle single or batch prediction
        is_single = isinstance(request.data, OHLCVData)
        data_list = [request.data] if is_single else request.data
        
        # Validate data
        for data in data_list:
            if not validate_ohlcv_data(data):
                raise HTTPException(status_code=400, detail="Invalid OHLCV data: high < low or inconsistent values")
        
        # Create features
        features = create_features(data_list)
        
        # Scale features
        features_scaled = scaler.transform(features)
        
        # Make predictions
        predictions = model.predict(features_scaled)
        probabilities = model.predict_proba(features_scaled)
        
        # Calculate confidence levels
        confidences = []
        pred_probs = []
        
        for i, prob in enumerate(probabilities):
            max_prob = max(prob)
            pred_probs.append(max_prob)
            
            if max_prob >= 0.8:
                confidences.append("High")
            elif max_prob >= 0.6:
                confidences.append("Medium")
            else:
                confidences.append("Low")
        
        # Return appropriate format based on input
        if is_single:
            return PredictionResponse(
                prediction=predictions[0],
                probability=pred_probs[0],
                confidence=confidences[0]
            )
        else:
            return PredictionResponse(
                prediction=predictions.tolist(),
                probability=pred_probs,
                confidence=confidences
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/retrain")
async def retrain_model():
    """
    Retrain the model with fresh demo data.
    In production, this would use real market data.
    """
    try:
        global model_loaded
        model_loaded = False
        
        create_demo_model()
        
        return {
            "message": "Model retrained successfully",
            "timestamp": datetime.now().isoformat(),
            "model_loaded": model_loaded
        }
        
    except Exception as e:
        logger.error(f"Retrain error: {e}")
        raise HTTPException(status_code=500, detail=f"Retraining failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
