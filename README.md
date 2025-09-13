# AlgoCode - AI-Powered Trading Platform

A comprehensive full-stack trading platform featuring algorithmic strategy building, backtesting, and AI-powered price prediction.

## 🚀 Features

### Core Trading Features
- **Strategy Builder**: Drag-and-drop interface for creating trading algorithms
- **Backtesting Engine**: Historical performance testing with real market data
- **Paper Trading**: Risk-free trading simulation
- **Price Predictor**: AI-powered next hour price movement prediction

### Technical Features
- **Multi-Exchange Support**: USA (NASDAQ/NYSE), NSE (India), BSE (India)
- **Real-time Data**: Yahoo Finance integration with fallback systems
- **Machine Learning**: RandomForest-based price prediction
- **Responsive Design**: Modern, accessible UI with dark/light themes

## 🏗️ Architecture

```
AlgoCode/
├── backend/                 # Node.js/TypeScript backend
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   └── index.ts        # Server entry point
│   └── package.json
├── predictor-backend/       # Python FastAPI price predictor
│   ├── main.py             # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── README.md           # Predictor-specific docs
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── pages/             # Page components
│   ├── lib/               # Utilities and API clients
│   └── main.tsx           # App entry point
└── README.md              # This file
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ and pip
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Adityarane012/AlgoCode.git
cd AlgoCode
```

### 2. Backend Setup (Node.js)
```bash
cd backend
npm install
npm run dev
```
Backend runs on: http://localhost:4000

### 3. Price Predictor Setup (Python)
```bash
cd predictor-backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```
Predictor API runs on: http://localhost:8001

### 4. Frontend Setup (React)
```bash
# From project root
npm install
npm run dev
```
Frontend runs on: http://localhost:8081

## 🎯 Usage

### Strategy Building
1. Navigate to the "Build Your Strategy" section
2. Drag components from the library to the canvas
3. Configure parameters for indicators
4. Test your strategy with historical data

### Backtesting
1. Go to "Validate Your Strategy" section
2. Select exchange (USA/NSE/BSE)
3. Enter symbol (e.g., AAPL, TCS, RELIANCE)
4. Set date range and initial capital
5. Choose strategy and parameters
6. Click "Run Backtest" to see results

### Price Prediction (Hybrid Input)
1. Scroll to "Next Hour Price Predictor"
2. Choose input method:
   - **Manual Tab**: Enter OHLCV data directly
   - **Symbol Tab**: Enter stock symbol (e.g., AAPL, RELIANCE.NS, TCS.BO)
3. Click "Predict Next Hour" for AI prediction
4. View confidence levels, probability, and features used

## 📊 API Endpoints

### Main Backend (Node.js)
- `GET /health` - Health check
- `POST /api/backtest` - Run backtest
- `GET /api/strategies` - List strategies
- `POST /api/strategies` - Save strategy

### Price Predictor (Python)
- `GET /` - API information
- `GET /health` - Health check
- `POST /predict` - Predict price movement
- `POST /retrain` - Retrain model

## 🔧 Configuration

### Environment Variables
Create `.env` files in respective directories:

**Backend (.env)**
```
PORT=4000
NODE_ENV=development
```

**Predictor Backend (.env)**
```
# Optional: Add API keys for better data sources
ALPHA_VANTAGE_API_KEY=your_key_here
POLYGON_API_KEY=your_key_here
```

## 🧪 Testing

### Backend API
```bash
curl -X POST http://localhost:4000/api/backtest \
  -H "Content-Type: application/json" \
  -d '{"symbol":"AAPL","start":"2023-01-01","end":"2024-01-01","strategy":{"kind":"smaCross","params":{"fast":10,"slow":30}}}'
```

### Price Predictor (Manual OHLCV)
```bash
curl -X POST http://localhost:8001/predict \
  -H "Content-Type: application/json" \
  -d '{"ohlcv_data":{"open":100,"high":105,"low":98,"close":103,"volume":10000}}'
```

### Price Predictor (Symbol-based)
```bash
curl -X POST http://localhost:8001/predict \
  -H "Content-Type: application/json" \
  -d '{"symbol":"AAPL","timezone":"America/New_York"}'
```

## 🎨 UI Components

The frontend uses:
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **Recharts** for data visualization
- **Lucide React** for icons

## 🤖 Machine Learning

### Price Predictor Model
- **Algorithm**: RandomForestClassifier
- **Features**: OHLCV data, price ratios, volume metrics, technical indicators
- **Training**: Synthetic data with realistic market patterns
- **Output**: Binary prediction (up/down) with confidence levels

### Data Sources
1. **Yahoo Finance** (Primary)
2. **Alpha Vantage** (Secondary, requires API key)
3. **Polygon.io** (Tertiary, requires API key)
4. **Mock Data** (Fallback)

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku)
```bash
cd backend
npm run build
# Deploy with Node.js runtime
```

### Predictor (Railway/Heroku)
```bash
cd predictor-backend
# Deploy with Python runtime
```

## 📝 Development

### Adding New Features
1. **Backend**: Add routes in `backend/src/routes/`
2. **Frontend**: Create components in `src/components/`
3. **Predictor**: Extend `main.py` with new endpoints

### Code Style
- **TypeScript**: Strict mode enabled
- **Python**: PEP 8 compliance
- **React**: Functional components with hooks
- **API**: RESTful design with proper error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This software is for educational and research purposes only. Trading involves substantial risk of loss and is not suitable for all investors. Past performance does not guarantee future results. Always consult with a qualified financial advisor before making investment decisions.

## 🆘 Support

For issues and questions:
1. Check the documentation in each component's README
2. Review the API documentation at `/docs` endpoints
3. Open an issue on GitHub
4. Check the troubleshooting section below

## 🔧 Troubleshooting

### Common Issues

**Backend not starting:**
- Check if port 4000 is available
- Verify Node.js version (18+)
- Run `npm install` in backend directory

**Predictor API not responding:**
- Check if port 8001 is available
- Verify Python version (3.8+)
- Install requirements: `pip install -r requirements.txt`
- Test with: `curl http://localhost:8001/health`

**Frontend build errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`
- Verify all dependencies are installed

**Data fetching issues:**
- Check network connectivity
- Verify API endpoints are running
- Check browser console for CORS errors

## 📈 Roadmap

- [ ] Real-time data streaming
- [ ] Advanced ML models (LSTM, Transformer)
- [ ] Portfolio management
- [ ] Social trading features
- [ ] Mobile app
- [ ] Advanced charting
- [ ] Risk management tools
- [ ] Performance analytics dashboard