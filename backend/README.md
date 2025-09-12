# AlgoCode Backend

## Data Sources

The backtesting system now supports multiple data sources with automatic fallback:

1. **Yahoo Finance** (Primary - Free, but unreliable)
2. **Alpha Vantage** (Secondary - Free tier: 5 calls/minute, 500 calls/day)
3. **Polygon.io** (Tertiary - Free tier: 5 calls/minute)
4. **Mock Data** (Fallback - Generated realistic data)

## Setup API Keys (Optional but Recommended)

For better reliability, you can add free API keys:

### 1. Alpha Vantage (Recommended)
1. Go to https://www.alphavantage.co/support/#api-key
2. Sign up for a free account
3. Copy your API key
4. Create a `.env` file in the backend directory:
   ```
   ALPHA_VANTAGE_API_KEY=your_key_here
   ```

### 2. Polygon.io (Alternative)
1. Go to https://polygon.io/
2. Sign up for a free account
3. Copy your API key
4. Add to your `.env` file:
   ```
   POLYGON_API_KEY=your_key_here
   ```

## Running the Backend

```bash
cd backend
npm install
npm run dev
```

The backend will run on http://localhost:4000

## How It Works

1. When you request data for a symbol, the system tries data sources in order
2. If Yahoo Finance fails, it tries Alpha Vantage
3. If Alpha Vantage fails, it tries Polygon.io
4. If all external sources fail, it generates realistic mock data
5. This ensures the backtesting always works, even with unreliable data sources

## Supported Symbols

- **USA**: AAPL, MSFT, GOOGL, etc.
- **NSE (India)**: TCS.NS, RELIANCE.NS, INFY.NS, etc.
- **BSE (India)**: 500325.BO, 532540.BO, etc.

The system automatically maps NSE/BSE symbols to the correct Yahoo Finance format.