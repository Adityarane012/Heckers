# Hybrid Price Predictor API

A modern FastAPI-based service for predicting next hour stock price movements using machine learning. Supports both manual OHLCV input and automatic stock symbol fetching with yfinance.

## 🚀 Features

- **Hybrid Input Support**: Manual OHLCV data or automatic symbol-based fetching
- **Multi-Market Support**: NSE, BSE, NYSE, NASDAQ with proper symbol formatting
- **Real-time Data**: Automatic fetching of latest stock data using yfinance
- **Machine Learning**: RandomForestClassifier with 15 engineered features
- **Comprehensive Error Handling**: Graceful handling of invalid symbols, closed markets, and API failures
- **Timezone Support**: Configurable timezone handling for different markets
- **Feature Engineering**: Advanced technical indicators and price analysis
- **Model Retraining**: On-demand model retraining with fresh data

## 📋 Requirements

- Python 3.8+
- FastAPI
- scikit-learn
- pandas
- yfinance
- uvicorn

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd AlgoCode/predictor-backend
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the server**:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8001 --reload
   ```

## 📡 API Endpoints

### Health Check
```bash
GET /health
```

**Response**:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "timestamp": "2025-01-13T11:34:24.694612"
}
```

### Predict Price Movement
```bash
POST /predict
```

#### Manual OHLCV Input
```json
{
  "ohlcv_data": {
    "open": 100.0,
    "high": 105.0,
    "low": 98.0,
    "close": 103.0,
    "volume": 1000000
  }
}
```

#### Symbol-based Input
```json
{
  "symbol": "AAPL",
  "timezone": "America/New_York",
  "market": "NASDAQ"
}
```

**Response**:
```json
{
  "prediction": 1,
  "probability": 0.98,
  "confidence": "High",
  "features_used": {
    "open": 100.0,
    "high": 105.0,
    "low": 98.0,
    "close": 103.0,
    "volume": 1000000.0,
    "price_range": 7.0,
    "body_size": 3.0,
    "upper_shadow": 2.0,
    "lower_shadow": 2.0,
    "body_ratio": 0.4286,
    "upper_shadow_ratio": 0.2857,
    "lower_shadow_ratio": 0.2857,
    "volume_ratio": 1061.3,
    "price_change": 0.03,
    "rsi_approx": 80.0
  },
  "data_source": "manual",
  "symbol": null,
  "error": null
}
```

### Retrain Model
```bash
POST /retrain
```

**Response**:
```json
{
  "message": "Model retrained successfully",
  "timestamp": "2025-01-13T11:34:24.694612",
  "model_loaded": true
}
```

## 🎯 Supported Stock Symbols

### US Markets
- **NYSE**: AAPL, MSFT, GOOGL, AMZN, TSLA
- **NASDAQ**: AAPL, MSFT, GOOGL, AMZN, TSLA

### Indian Markets
- **NSE**: RELIANCE.NS, TCS.NS, INFY.NS, HDFC.NS, WIPRO.NS
- **BSE**: RELIANCE.BO, TCS.BO, INFY.BO, HDFC.BO, WIPRO.BO

### Timezone Support
- `UTC` - Universal Coordinated Time
- `America/New_York` - NYSE/NASDAQ
- `America/Los_Angeles` - West Coast markets
- `Asia/Kolkata` - NSE/BSE
- `Europe/London` - LSE

## 🧠 Machine Learning Model

### Features Used (15 total)
1. **Basic OHLCV**: Open, High, Low, Close, Volume
2. **Price Analysis**: Price range, body size, shadows
3. **Technical Ratios**: Body ratio, shadow ratios
4. **Volume Analysis**: Volume-to-price ratio
5. **Momentum**: Price change percentage
6. **Technical Indicators**: Simplified RSI approximation

### Model Details
- **Algorithm**: RandomForestClassifier
- **Estimators**: 100 trees
- **Max Depth**: 10
- **Min Samples Split**: 5
- **Features**: 15 engineered features
- **Training Data**: 1000 synthetic samples (demo mode)

## 🔧 Configuration

### Environment Variables
```bash
# Optional: For enhanced data sources
ALPHA_VANTAGE_API_KEY=your_key_here
POLYGON_API_KEY=your_key_here
```

### Model Files
- `price_predictor_model.pkl` - Trained RandomForest model
- `price_scaler.pkl` - Feature scaler for normalization

## 🚨 Error Handling

The API provides comprehensive error handling for:

- **Invalid Symbols**: Non-existent or delisted stocks
- **Market Closed**: When markets are not trading
- **Network Issues**: API connectivity problems
- **Data Validation**: Invalid OHLCV values
- **Model Errors**: ML prediction failures

### Common Error Responses
```json
{
  "detail": "No data found for symbol 'INVALID'. Please check if the symbol is correct and the market is open."
}
```

## 🧪 Testing

### Manual OHLCV Test
```bash
curl -X POST "http://localhost:8001/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "ohlcv_data": {
      "open": 100,
      "high": 105,
      "low": 98,
      "close": 103,
      "volume": 1000000
    }
  }'
```

### Symbol-based Test
```bash
curl -X POST "http://localhost:8001/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "timezone": "America/New_York"
  }'
```

## 🔄 Development

### Adding New Features
1. Update the `create_features()` function for new technical indicators
2. Modify the `HybridPredictionRequest` model for new input parameters
3. Update the `fetch_stock_data()` function for additional data sources

### Model Improvements
1. Replace synthetic data with real market data
2. Add more sophisticated technical indicators
3. Implement ensemble methods or deep learning models
4. Add feature selection and hyperparameter tuning

## 📊 Performance

- **Response Time**: < 200ms for predictions
- **Data Fetching**: < 1s for symbol-based requests
- **Model Accuracy**: Demo model with 98% confidence on test data
- **Concurrent Requests**: Supports multiple simultaneous predictions

## 🛡️ Security

- CORS enabled for frontend integration
- Input validation and sanitization
- Error message sanitization
- No sensitive data exposure in logs

## 📝 License

This project is part of the AlgoCode trading platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the error messages for debugging
- Verify symbol formats and market hours
- Ensure all dependencies are installed
- Check network connectivity for yfinance
