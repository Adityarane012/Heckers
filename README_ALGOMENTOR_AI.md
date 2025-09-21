# AlgoMentor AI - Modular Multi-Agent Educational Trading Platform

## 🎯 Overview

AlgoMentor AI is a comprehensive, modular trading platform that combines AI-powered agents with educational content to help traders learn, develop, and optimize algorithmic trading strategies. The platform features a multi-agent architecture where specialized AI agents work together to provide end-to-end trading education and strategy development.

## 🏗️ Architecture

### Repository Structure

```
AlgoMentor-AI/
├── agents/                          # All AI agent logic
│   ├── strategy-builder/            # Strategy creation agent
│   │   ├── index.ts                # Main agent implementation
│   │   ├── prompts.ts              # AI prompt templates
│   │   ├── types.ts                # Agent-specific types
│   │   └── tests/                  # Unit tests
│   ├── backtest-analyst/            # Backtest analysis agent
│   │   ├── index.ts
│   │   ├── prompts.ts
│   │   ├── types.ts
│   │   └── tests/
│   ├── trade-coach/                 # Personal trading coach
│   ├── news-sentiment/              # News and sentiment analysis
│   ├── mentor/                      # Master mentor agent
│   └── shared/                      # Shared agent utilities
│       ├── types.ts                 # Common types
│       ├── errors.ts                # Error handling
│       └── validation.ts            # Input validation
├── services/                        # Core services and integrations
│   ├── ai/                          # AI service clients
│   │   ├── gemini-client.ts         # Gemini AI client
│   │   └── index.ts
│   ├── data/                        # Data providers
│   │   ├── market-data.ts
│   │   ├── news-api.ts
│   │   └── index.ts
│   ├── ml/                          # ML inference engine
│   │   ├── random-forest.ts
│   │   ├── lstm-model.ts
│   │   └── index.ts
│   ├── simulation/                  # Trading simulation
│   │   ├── backtester.ts
│   │   ├── paper-trading.ts
│   │   └── index.ts
│   └── shared/                      # Shared service utilities
│       ├── logger.ts
│       ├── progress-tracker.ts
│       └── error-handler.ts
├── components/                      # React UI components
│   ├── agents/                      # Agent-specific UI
│   │   ├── StrategyBuilder/
│   │   ├── BacktestAnalyst/
│   │   ├── TradeCoach/
│   │   ├── NewsSentiment/
│   │   └── Mentor/
│   ├── shared/                      # Shared UI components
│   │   ├── ProgressIndicator.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── StreamingResponse.tsx
│   └── ui/                          # Base UI components
├── backend/                         # Backend API server
│   ├── src/
│   │   ├── routes/                  # API endpoints
│   │   ├── middleware/              # Express middleware
│   │   └── index.ts                 # Server entry point
│   └── tests/                       # Backend tests
├── public/                          # Static assets
├── src/                            # Frontend entry point
├── tests/                          # Global tests
├── docs/                           # Documentation
└── scripts/                        # Build and deployment scripts
```

## 🤖 AI Agents

### 1. Strategy Builder Agent
**Purpose**: Convert natural language trading ideas into structured strategy configurations

**Features**:
- Natural language processing for trading strategy descriptions
- Generates AlgoMentor AI-compatible JSON configurations
- Supports multiple strategy types (SMA Cross, RSI Reversion, MACD, Breakout, Momentum)
- Includes parameter suggestions and rationale
- Educational explanations and learning content

**API Endpoint**: `POST /api/agents/strategy-builder`

**Usage Example**:
```typescript
const response = await fetch('/api/agents/strategy-builder', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: "Buy when RSI drops below 30 and sell when it goes above 70",
    options: { includeEducationalContent: true }
  })
});
```

### 2. Backtest Analyst Agent
**Purpose**: Analyze backtest results and provide actionable insights

**Features**:
- Comprehensive performance analysis
- Risk assessment and drawdown evaluation
- Identification of win/loss patterns
- Market condition suitability analysis
- Specific improvement recommendations
- Institutional-grade analysis

**API Endpoint**: `POST /api/agents/backtest-analyst`

### 3. Trade Coach Agent
**Purpose**: Provide personalized coaching based on trading history

**Features**:
- Analysis of trading patterns and behaviors
- Risk management assessment
- Emotional discipline indicators
- Personalized improvement recommendations
- Support for various timeframes
- Motivational guidance and actionable feedback

**API Endpoint**: `POST /api/agents/trade-coach`

### 4. News Sentiment Agent
**Purpose**: Analyze news and market sentiment for trading decisions

**Features**:
- Real-time news aggregation
- Sentiment analysis using AI
- Market impact assessment
- Trading signal generation
- Educational content about news trading

**API Endpoint**: `POST /api/agents/news-sentiment`

### 5. Mentor Agent
**Purpose**: Master agent that orchestrates other agents and provides overall guidance

**Features**:
- Agent orchestration and coordination
- Learning progress tracking
- Lesson recommendations
- Overall platform guidance
- Cross-agent insights and recommendations

**API Endpoint**: `POST /api/agents/mentor`

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- Git
- Gemini API key (for AI agents)

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/AlgoMentor-AI.git
cd AlgoMentor-AI
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
echo "PORT=4000" >> .env
echo "NODE_ENV=development" >> .env

npm run dev
```

### 3. Frontend Setup
```bash
# From project root
npm install
npm run dev
```

## 🚀 Usage

### Strategy Building
1. Navigate to the Strategy Builder agent
2. Describe your trading idea in natural language
3. Review the generated strategy configuration
4. Learn from the educational explanations
5. Test the strategy with backtesting

### Backtest Analysis
1. Run a backtest on your strategy
2. Use the Backtest Analyst agent for comprehensive analysis
3. Review performance metrics and risk assessment
4. Get optimization suggestions
5. Learn from the educational insights

### Trading Coaching
1. Upload your trading history
2. Get personalized coaching from the Trade Coach agent
3. Review behavioral patterns and improvements
4. Track your progress over time
5. Receive motivational guidance

## 📊 API Documentation

### Base URL
```
http://localhost:4000/api
```

### Authentication
Currently, the API uses session-based authentication. API keys may be required for certain endpoints.

### Error Handling
All API responses follow a consistent format:

**Success Response**:
```json
{
  "success": true,
  "data": { ... },
  "explanation": "Educational explanation",
  "educationalSummary": "Learning summary",
  "agentId": "strategy-builder",
  "powered_by": "AlgoMentor AI",
  "metadata": {
    "processingTime": 1500,
    "timestamp": 1640995200000
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Prompt is required and must be a non-empty string",
    "suggestedFix": "Please provide a valid trading strategy description",
    "timestamp": 1640995200000
  },
  "agentId": "strategy-builder",
  "powered_by": "AlgoMentor AI"
}
```

### Progress Tracking
For long-running operations, the API provides progress updates:

```json
{
  "status": "in_progress",
  "progress": 50,
  "message": "Generating strategy configuration...",
  "partialResults": { ... },
  "errors": []
}
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

### Frontend Tests
```bash
npm test                   # Run all tests
npm run test:watch        # Watch mode
npm run test:e2e          # End-to-end tests
```

### Agent Tests
```bash
# Test individual agents
npm run test:agents:strategy-builder
npm run test:agents:backtest-analyst
npm run test:agents:trade-coach
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**:
```bash
# Server Configuration
PORT=4000
NODE_ENV=development

# AI Services
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
GEMINI_TIMEOUT=30000

# Data Sources
NEWS_API_KEY=your_news_api_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here

# Frontend
FRONTEND_URL=http://localhost:8081
```

### Agent Configuration
Each agent can be configured through the agent configuration system:

```typescript
const agentConfig = {
  id: 'strategy-builder',
  name: 'Strategy Builder Agent',
  enabled: true,
  timeout: 30000,
  retryAttempts: 3,
  options: {
    includeEducationalContent: true,
    generateAlternatives: true,
  }
};
```

## 🚀 Deployment

### Production Build
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
npm run build
```

### Docker Deployment
```bash
# Build and run with Docker
docker-compose up --build
```

### Environment-Specific Configuration
- **Development**: Full logging, hot reload, mock data fallbacks
- **Staging**: Limited logging, production-like settings
- **Production**: Minimal logging, optimized performance, error monitoring

## 📈 Performance & Monitoring

### Health Checks
- **Overall Health**: `GET /health`
- **Agent Health**: `GET /api/agents/health`
- **Individual Agent**: `GET /api/agents/health/:agentId`

### Metrics
- Response times
- Error rates
- Agent performance
- User engagement
- Educational progress

### Logging
- Structured logging with timestamps
- Error tracking and reporting
- Performance monitoring
- User activity tracking

## 🔒 Security

### API Security
- Rate limiting (100 requests per 15 minutes per IP)
- Input validation and sanitization
- CORS configuration
- Request ID tracking

### Data Protection
- No sensitive data logging
- Secure API key handling
- Input validation
- Error message sanitization

## 🤝 Contributing

### Adding New Agents
1. Create agent directory in `agents/`
2. Implement agent interface
3. Add prompts and types
4. Create UI components
5. Add tests
6. Update documentation

### Code Style
- **TypeScript**: Strict mode enabled
- **React**: Functional components with hooks
- **API**: RESTful design with proper error handling
- **Testing**: Comprehensive unit and integration tests

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Update documentation
6. Submit a pull request

## 📚 Educational Philosophy

AlgoMentor AI is designed with education at its core:

### Learning-First Approach
- Every agent provides educational explanations
- Progress tracking and lesson recommendations
- Adaptive learning based on user level
- Real-world application examples

### Multi-Agent Learning
- Different agents teach different concepts
- Cross-agent insights and connections
- Comprehensive understanding of trading
- Practical application of knowledge

### Progressive Complexity
- Beginner-friendly explanations
- Advanced concepts for experienced users
- Gradual skill building
- Mastery-based progression

## 🆘 Support & Troubleshooting

### Common Issues

**Backend not starting**:
- Check if port 4000 is available
- Verify Node.js version (18+)
- Ensure all dependencies are installed
- Check environment variables

**AI agents not responding**:
- Verify Gemini API key is set
- Check API quota and billing
- Review error logs for specific issues
- Test with mock responses

**Frontend build errors**:
- Clear node_modules and reinstall
- Check TypeScript errors
- Verify all dependencies are compatible
- Review build configuration

### Getting Help
1. Check the documentation in each component
2. Review error logs and health checks
3. Open an issue on GitHub
4. Contact the development team

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This software is for educational and research purposes only. Trading involves substantial risk of loss and is not suitable for all investors. Past performance does not guarantee future results. Always consult with a qualified financial advisor before making investment decisions.

## 🎉 Acknowledgments

- Google Gemini AI for providing the AI capabilities
- The open-source community for various libraries and tools
- Trading education community for insights and feedback
- Beta testers and early adopters

---

**AlgoMentor AI** - Empowering traders through AI-driven education and strategy development.
