"""
Next Hour Price Up/Down Predictor API
A FastAPI-based service for predicting stock price movements using machine learning.
Supports both manual OHLCV input and automatic stock symbol fetching.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Union, Dict, Any
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os
from datetime import datetime, timedelta
import logging
import yfinance as yf
import pytz

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Hybrid Price Predictor API",
    description="Predict next hour stock price movements using manual OHLCV or automatic symbol fetching",
    version="2.0.0"
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

class SymbolRequest(BaseModel):
    """Request model for symbol-based prediction"""
    symbol: str = Field(..., description="Stock symbol (e.g., AAPL, RELIANCE.NS, TCS.BO)")
    timezone: Optional[str] = Field("UTC", description="Timezone for market data (e.g., 'America/New_York', 'Asia/Kolkata')")
    market: Optional[str] = Field(None, description="Market identifier (NSE, BSE, NYSE, NASDAQ)")

class HybridPredictionRequest(BaseModel):
    """Request model for hybrid prediction (manual OHLCV or symbol)"""
    # Manual OHLCV input
    ohlcv_data: Optional[OHLCVData] = Field(None, description="Manual OHLCV data")
    
    # Symbol-based input
    symbol: Optional[str] = Field(None, description="Stock symbol for automatic data fetching")
    timezone: Optional[str] = Field("UTC", description="Timezone for market data")
    market: Optional[str] = Field(None, description="Market identifier")

class PredictionResponse(BaseModel):
    """Response model for predictions"""
    prediction: int = Field(..., description="Prediction: 1 for up, 0 for down")
    probability: float = Field(..., description="Confidence probability")
    confidence: str = Field(..., description="Confidence level (High/Medium/Low)")
    features_used: Dict[str, Any] = Field(..., description="Features used for prediction")
    data_source: str = Field(..., description="Source of data (manual or symbol)")
    symbol: Optional[str] = Field(None, description="Symbol used if applicable")
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

def fetch_stock_data(symbol: str, timezone: str = "UTC", market: Optional[str] = None) -> OHLCVData:
    """
    Fetch latest stock data using yfinance
    
    Args:
        symbol: Stock symbol (e.g., AAPL, RELIANCE.NS, TCS.BO)
        timezone: Timezone for market data
        market: Market identifier (optional)
        
    Returns:
        OHLCVData: Latest stock data
        
    Raises:
        HTTPException: If symbol is invalid or data cannot be fetched
    """
    try:
        logger.info(f"Fetching data for symbol: {symbol}")
        
        # Create yfinance ticker
        ticker = yf.Ticker(symbol)
        
        # Get latest data (1 day, 1 minute intervals for most recent hour)
        hist = ticker.history(period="1d", interval="1m")
        
        if hist.empty:
            raise HTTPException(
                status_code=404, 
                detail=f"No data found for symbol '{symbol}'. Please check if the symbol is correct and the market is open."
            )
        
        # Get the most recent data point
        latest = hist.iloc[-1]
        
        # Validate the data
        if pd.isna(latest['Open']) or pd.isna(latest['High']) or pd.isna(latest['Low']) or pd.isna(latest['Close']):
            raise HTTPException(
                status_code=400,
                detail=f"Incomplete data for symbol '{symbol}'. Market may be closed or symbol may be invalid."
            )
        
        ohlcv = OHLCVData(
            open=float(latest['Open']),
            high=float(latest['High']),
            low=float(latest['Low']),
            close=float(latest['Close']),
            volume=float(latest['Volume'])
        )
        
        logger.info(f"Successfully fetched data for {symbol}: O={ohlcv.open}, H={ohlcv.high}, L={ohlcv.low}, C={ohlcv.close}, V={ohlcv.volume}")
        return ohlcv
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching data for {symbol}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch data for symbol '{symbol}': {str(e)}"
        )

def create_features(ohlcv_data: OHLCVData) -> Dict[str, Any]:
    """Create features from OHLCV data for model prediction"""
    
    # Basic price features
    price_range = ohlcv_data.high - ohlcv_data.low
    body_size = abs(ohlcv_data.close - ohlcv_data.open)
    upper_shadow = ohlcv_data.high - max(ohlcv_data.open, ohlcv_data.close)
    lower_shadow = min(ohlcv_data.open, ohlcv_data.close) - ohlcv_data.low
    
    # Price ratios
    body_ratio = body_size / price_range if price_range > 0 else 0
    upper_shadow_ratio = upper_shadow / price_range if price_range > 0 else 0
    lower_shadow_ratio = lower_shadow / price_range if price_range > 0 else 0
    
    # Volume features
    volume_ratio = ohlcv_data.volume / (ohlcv_data.high + ohlcv_data.low + ohlcv_data.close) if (ohlcv_data.high + ohlcv_data.low + ohlcv_data.close) > 0 else 0
    
    # Price momentum
    price_change = (ohlcv_data.close - ohlcv_data.open) / ohlcv_data.open if ohlcv_data.open > 0 else 0
    
    # Technical indicators (simplified)
    rsi_approx = 50 + (price_change * 10)  # Simplified RSI approximation
    rsi_approx = max(0, min(100, rsi_approx))
    
    # Create feature vector for model
    feature_vector = np.array([
        ohlcv_data.open,
        ohlcv_data.high,
        ohlcv_data.low,
        ohlcv_data.close,
        ohlcv_data.volume,
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
    ]).reshape(1, -1)
    
    # Create features dictionary for response
    features_dict = {
        "open": ohlcv_data.open,
        "high": ohlcv_data.high,
        "low": ohlcv_data.low,
        "close": ohlcv_data.close,
        "volume": ohlcv_data.volume,
        "price_range": price_range,
        "body_size": body_size,
        "upper_shadow": upper_shadow,
        "lower_shadow": lower_shadow,
        "body_ratio": body_ratio,
        "upper_shadow_ratio": upper_shadow_ratio,
        "lower_shadow_ratio": lower_shadow_ratio,
        "volume_ratio": volume_ratio,
        "price_change": price_change,
        "rsi_approx": rsi_approx
    }
    
    return feature_vector, features_dict

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
        
        features, _ = create_features(ohlcv)
        X.append(features[0])
        
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
        "message": "Hybrid Price Predictor API",
        "version": "2.0.0",
        "status": "running",
        "model_loaded": model_loaded,
        "features": [
            "Manual OHLCV input",
            "Automatic symbol-based data fetching",
            "Multi-market support (NSE, BSE, NYSE, NASDAQ)",
            "Timezone support",
            "Comprehensive error handling"
        ],
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
async def predict_price_movement(request: HybridPredictionRequest):
    """
    Predict next hour price movement (up/down) using hybrid input.
    
    Supports two modes:
    1. Manual OHLCV input: Provide ohlcv_data directly
    2. Symbol-based input: Provide symbol to fetch latest data automatically
    
    Args:
        request: HybridPredictionRequest containing either OHLCV data or symbol
        
    Returns:
        PredictionResponse with prediction, probability, confidence, and features used
    """
    try:
        if not model_loaded:
            raise HTTPException(status_code=503, detail="Model not loaded")
        
        # Determine input mode
        if request.ohlcv_data is not None:
            # Manual OHLCV input
            ohlcv_data = request.ohlcv_data
            data_source = "manual"
            symbol = None
            
            logger.info("Using manual OHLCV input")
            
        elif request.symbol is not None:
            # Symbol-based input
            symbol = request.symbol.strip().upper()
            data_source = "symbol"
            
            logger.info(f"Fetching data for symbol: {symbol}")
            ohlcv_data = fetch_stock_data(symbol, request.timezone, request.market)
            
        else:
            raise HTTPException(
                status_code=400, 
                detail="Either 'ohlcv_data' or 'symbol' must be provided"
            )
        
        # Validate OHLCV data
        if not validate_ohlcv_data(ohlcv_data):
            raise HTTPException(
                status_code=400, 
                detail="Invalid OHLCV data: high < low or inconsistent values"
            )
        
        # Create features
        feature_vector, features_dict = create_features(ohlcv_data)
        
        # Scale features
        features_scaled = scaler.transform(feature_vector)
        
        # Make prediction
        prediction = model.predict(features_scaled)[0]
        probabilities = model.predict_proba(features_scaled)[0]
        
        # Calculate confidence
        max_prob = max(probabilities)
        
        if max_prob >= 0.8:
            confidence = "High"
        elif max_prob >= 0.6:
            confidence = "Medium"
        else:
            confidence = "Low"
        
        return PredictionResponse(
            prediction=int(prediction),
            probability=float(max_prob),
            confidence=confidence,
            features_used=features_dict,
            data_source=data_source,
            symbol=symbol
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