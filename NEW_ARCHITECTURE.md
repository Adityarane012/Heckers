# AlgoMentor AI - New Modular Architecture

## Repository Structure

```
AlgoMentor-AI/
├── agents/                          # All AI agent logic
│   ├── strategy-builder/            # Strategy creation agent
│   │   ├── index.ts
│   │   ├── prompts.ts
│   │   ├── types.ts
│   │   └── tests/
│   ├── backtest-analyst/            # Backtest analysis agent
│   │   ├── index.ts
│   │   ├── prompts.ts
│   │   ├── types.ts
│   │   └── tests/
│   ├── trade-coach/                 # Personal trading coach
│   │   ├── index.ts
│   │   ├── prompts.ts
│   │   ├── types.ts
│   │   └── tests/
│   ├── news-sentiment/              # News and sentiment analysis
│   │   ├── index.ts
│   │   ├── prompts.ts
│   │   ├── types.ts
│   │   └── tests/
│   ├── mentor/                      # Master mentor agent
│   │   ├── index.ts
│   │   ├── prompts.ts
│   │   ├── types.ts
│   │   └── tests/
│   └── shared/                      # Shared agent utilities
│       ├── types.ts
│       ├── errors.ts
│       └── validation.ts
├── services/                        # Core services and integrations
│   ├── ai/                          # AI service clients
│   │   ├── gemini-client.ts
│   │   ├── openai-client.ts
│   │   └── index.ts
│   ├── data/                        # Data providers
│   │   ├── market-data.ts
│   │   ├── news-api.ts
│   │   ├── yahoo-finance.ts
│   │   └── index.ts
│   ├── ml/                          # ML inference engine
│   │   ├── random-forest.ts
│   │   ├── lstm-model.ts
│   │   ├── reinforcement-learning.ts
│   │   └── index.ts
│   ├── simulation/                  # Trading simulation
│   │   ├── backtester.ts
│   │   ├── paper-trading.ts
│   │   ├── indicators.ts
│   │   └── index.ts
│   └── shared/                      # Shared service utilities
│       ├── logger.ts
│       ├── progress-tracker.ts
│       └── error-handler.ts
├── components/                      # React UI components
│   ├── agents/                      # Agent-specific UI
│   │   ├── StrategyBuilder/
│   │   │   ├── index.tsx
│   │   │   ├── StrategyForm.tsx
│   │   │   ├── StrategyDisplay.tsx
│   │   │   └── types.ts
│   │   ├── BacktestAnalyst/
│   │   │   ├── index.tsx
│   │   │   ├── AnalysisDisplay.tsx
│   │   │   ├── MetricsChart.tsx
│   │   │   └── types.ts
│   │   ├── TradeCoach/
│   │   │   ├── index.tsx
│   │   │   ├── CoachingDisplay.tsx
│   │   │   ├── ProgressTracker.tsx
│   │   │   └── types.ts
│   │   ├── NewsSentiment/
│   │   │   ├── index.tsx
│   │   │   ├── NewsFeed.tsx
│   │   │   ├── SentimentChart.tsx
│   │   │   └── types.ts
│   │   └── Mentor/
│   │       ├── index.tsx
│   │       ├── Dashboard.tsx
│   │       ├── LessonProgress.tsx
│   │       └── types.ts
│   ├── shared/                      # Shared UI components
│   │   ├── ProgressIndicator.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── StreamingResponse.tsx
│   │   └── AgentCard.tsx
│   └── ui/                          # Base UI components (shadcn/ui)
│       ├── button.tsx
│       ├── card.tsx
│       └── ...
├── backend/                         # Backend API server
│   ├── src/
│   │   ├── routes/
│   │   │   ├── agents.ts
│   │   │   ├── backtest.ts
│   │   │   ├── health.ts
│   │   │   └── index.ts
│   │   ├── middleware/
│   │   │   ├── error-handler.ts
│   │   │   ├── progress-tracker.ts
│   │   │   └── validation.ts
│   │   ├── types/
│   │   │   ├── api.ts
│   │   │   └── agents.ts
│   │   └── index.ts
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── fixtures/
│   ├── package.json
│   └── tsconfig.json
├── public/                          # Static assets
├── src/                            # Frontend entry point
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tests/                          # Global tests
│   ├── e2e/
│   └── fixtures/
├── docs/                           # Documentation
│   ├── agents/
│   ├── api/
│   └── deployment/
├── scripts/                        # Build and deployment scripts
│   ├── build.sh
│   ├── deploy.sh
│   └── test.sh
├── .env.example
├── package.json
├── README.md
└── tsconfig.json
```

## Key Features

### 1. Modular Agent System
- Each agent is a self-contained module
- Clear separation of concerns
- Independent testing and deployment
- Shared utilities and types

### 2. Comprehensive Error Handling
- Progress tracking (50% and 100% completion)
- Detailed error messages with suggested fixes
- Graceful degradation and fallbacks
- Comprehensive logging

### 3. Streaming Responses
- Real-time progress updates
- Streaming AI responses
- User feedback during processing
- Cancellable operations

### 4. Educational Focus
- Each agent provides educational explanations
- Learning progress tracking
- Lesson-based curriculum
- Mentor agent for guidance

### 5. Multi-Agent Orchestration
- Mentor agent coordinates other agents
- Agent communication and data sharing
- Unified dashboard view
- Cross-agent insights

## Migration Plan

1. **Phase 1**: Create new directory structure
2. **Phase 2**: Move and refactor existing agents
3. **Phase 3**: Implement new agents (news-sentiment, mentor)
4. **Phase 4**: Add comprehensive error handling
5. **Phase 5**: Implement streaming responses
6. **Phase 6**: Add testing and documentation
7. **Phase 7**: Clean up legacy files
