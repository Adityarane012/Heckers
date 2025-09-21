# AlgoCode - AI-Powered Trading Platform

A comprehensive full-stack trading platform featuring algorithmic strategy building, backtesting, and AI-powered trading agents.

## 🚀 Features

### Core Trading Features
- **Strategy Builder**: Drag-and-drop interface for creating trading algorithms
- **Backtesting Engine**: Historical performance testing with real market data
- **Paper Trading**: Risk-free trading simulation

### 🤖 AI Agents (Powered by Gemini AI)
- **Strategy Architect**: Convert natural language trading ideas into structured strategy configurations
- **Backtest Analyst**: AI-powered analysis of backtest results with actionable insights and recommendations
- **Trade Coach**: Personalized coaching based on trading history with behavioral analysis and improvement suggestions

### Technical Features
- **Multi-Exchange Support**: USA (NASDAQ/NYSE), NSE (India), BSE (India)
- **Real-time Data**: Yahoo Finance integration with fallback systems
- **Responsive Design**: Modern, accessible UI with dark/light themes

## 🏗️ Architecture

```
AlgoCode/
├── backend/                 # Node.js/TypeScript backend
│   ├── src/
│   │   ├── routes/         # API endpoints (including AI agents)
│   │   ├── services/       # Business logic & AI agents
│   │   │   └── agents/     # Gemini AI agent services
│   │   └── index.ts        # Server entry point
│   └── package.json
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

# Create .env file with your Gemini API key
echo "GEMINI_API_KEY=your_api_key_here" > .env

npm run dev
```
Backend runs on: http://localhost:4000

**Note**: To use AI agents, you need a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey). Add it to your `.env` file as shown above.

### 3. Frontend Setup (React)
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


### AI Agents
1. Navigate to `/agents` or click "AI Agents" in the navigation
2. **Strategy Architect**: Describe your trading idea in plain English to generate structured strategy configurations
3. **Backtest Analyst**: Upload backtest results to get AI-powered performance analysis and recommendations
4. **Trade Coach**: Review your trading history for personalized coaching and behavioral insights

## 📊 API Endpoints

### Main Backend (Node.js)
- `GET /health` - Health check
- `POST /api/backtest` - Run backtest
- `GET /api/strategies` - List strategies
- `POST /api/strategies` - Save strategy

### AI Agents (Gemini-powered)
- `GET /api/agents/health` - Agent health check
- `POST /api/agents/strategy-builder` - Natural language to strategy config
- `POST /api/agents/backtest-analyst` - AI backtest analysis
- `POST /api/agents/trade-coach` - Personalized trading coaching


## 🔧 Configuration

### Environment Variables
Create `.env` files in respective directories:

**Backend (.env)**
```
PORT=4000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
```


## 🧪 Testing

### Backend API
```bash
curl -X POST http://localhost:4000/api/backtest \
  -H "Content-Type: application/json" \
  -d '{"symbol":"AAPL","start":"2023-01-01","end":"2024-01-01","strategy":{"kind":"smaCross","params":{"fast":10,"slow":30}}}'
```


### AI Agents
```bash
# Strategy Architect
curl -X POST http://localhost:4000/api/agents/strategy-builder \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Buy when RSI drops below 30 and sell when it goes above 70"}'

# Backtest Analyst
curl -X POST http://localhost:4000/api/agents/backtest-analyst \
  -H "Content-Type: application/json" \
  -d '{"stats":{"totalTrades":100,"winRate":0.65,"totalReturn":0.15,"maxDrawdown":-0.08}}'

# Trade Coach
curl -X POST http://localhost:4000/api/agents/trade-coach \
  -H "Content-Type: application/json" \
  -d '{"trades":[{"symbol":"AAPL","side":"buy","quantity":100,"price":150,"timestamp":"2024-01-15T10:30:00Z","pnl":500}]}'
```

## 🎨 UI Components

The frontend uses:
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **Recharts** for data visualization
- **Lucide React** for icons

## 🤖 Machine Learning


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


## 📝 Development

### Adding New Features
1. **Backend**: Add routes in `backend/src/routes/`
2. **Frontend**: Create components in `src/components/`

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


**Frontend build errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`
- Verify all dependencies are installed

**Data fetching issues:**
- Check network connectivity
- Verify API endpoints are running
- Check browser console for CORS errors

## 📈 Roadmap

- [x] AI-powered trading agents (Strategy Architect, Backtest Analyst, Trade Coach)
- [ ] Real-time data streaming
- [ ] Advanced ML models (LSTM, Transformer)
- [ ] Portfolio management
- [ ] Social trading features
- [ ] Mobile app
- [ ] Advanced charting
- [ ] Risk management tools
- [ ] Performance analytics dashboard
- [ ] Additional AI agents (Risk Manager, Market Sentiment Analyzer)
- [ ] Voice-to-strategy conversion
- [ ] Automated strategy optimization