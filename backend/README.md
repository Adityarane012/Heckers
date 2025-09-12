Quant Forge Backend

A lightweight TypeScript Express API for strategy backtesting and market data to support the website frontend.

Features
- /health for uptime checks
- /api/history: Yahoo daily candles (up to 5 years)
- /api/backtest: SMA cross or RSI reversion strategies with metrics (CAGR, Sharpe, MDD, win rate)
- /api/strategies: In-memory CRUD for saved strategies
- Safeguards: validation, rate limiting

Getting Started

Requirements: Node.js 18+

```bash
cd backend
npm install
npm run dev
```

Server runs on http://localhost:4000.

Endpoints
- GET /health
- GET /api/history?symbol=TSLA&start=2020-01-01&end=2024-01-01
- POST /api/backtest
```json
{
  "symbol": "AAPL",
  "start": "2020-01-01",
  "end": "2024-01-01",
  "strategy": { "kind": "smaCross", "params": { "fast": 10, "slow": 30 } }
}
```
- GET /api/strategies
- POST /api/strategies
- DELETE /api/strategies/:id

Notes
- Uses Yahoo CSV download; for production, replace with a paid feed.
- This API is stateless except in-memory strategies; add a database if needed.