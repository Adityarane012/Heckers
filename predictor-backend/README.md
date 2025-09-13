# Price Predictor API

A FastAPI-based service for predicting next hour stock price movements using machine learning.

## Features

- **REST API** with FastAPI framework
- **Machine Learning Model** using RandomForestClassifier
- **Data Validation** with Pydantic models
- **Error Handling** with graceful fallbacks
- **CORS Support** for frontend integration
- **Auto Model Creation** with demo data if no model exists

## Setup

### Prerequisites

- Python 3.8+
- pip

### Installation

1. Navigate to the predictor-backend directory:
```bash
cd predictor-backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

### Running the API

```bash
# Development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or run directly
python main.py
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### GET /
Root endpoint with API information.

### GET /health
Health check endpoint.

### POST /predict
Predict next hour price movement.

**Request Body:**
```json
{
  "data": {
    "open": 100.0,
    "high": 105.0,
    "low": 98.0,
    "close": 103.0,
    "volume": 10000
  }
}
```

**Response:**
```json
{
  "prediction": 1,
  "probability": 0.75,
  "confidence": "High",
  "error": null
}
```

### POST /retrain
Retrain the model with fresh demo data.

## Sample cURL Commands

### Single Prediction
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "open": 100.0,
      "high": 105.0,
      "low": 98.0,
      "close": 103.0,
      "volume": 10000
    }
  }'
```

### Batch Prediction
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {
        "open": 100.0,
        "high": 105.0,
        "low": 98.0,
        "close": 103.0,
        "volume": 10000
      },
      {
        "open": 103.0,
        "high": 108.0,
        "low": 101.0,
        "close": 106.0,
        "volume": 12000
      }
    ]
  }'
```

### Health Check
```bash
curl -X GET "http://localhost:8000/health"
```

### Retrain Model
```bash
curl -X POST "http://localhost:8000/retrain"
```

## Model Details

The model uses a RandomForestClassifier with the following features:
- Basic OHLCV data (Open, High, Low, Close, Volume)
- Price range and body size
- Shadow ratios (upper/lower)
- Volume ratios
- Price momentum
- Simplified RSI approximation

## Error Handling

The API handles various error scenarios:
- Invalid OHLCV data (high < low, inconsistent values)
- Model loading failures
- Prediction errors
- Network issues

All errors return appropriate HTTP status codes and error messages.

## Development

### Adding New Features

1. Update the Pydantic models in `main.py`
2. Modify the `create_features()` function for new features
3. Update the model training in `create_demo_model()`
4. Test with the interactive docs at `/docs`

### Model Persistence

The model and scaler are automatically saved as:
- `price_predictor_model.pkl`
- `price_scaler.pkl`

These files are created on first run and reused on subsequent starts.
