#!/bin/bash

# AlgoMentor AI - Legacy Code Cleanup Script
# This script removes unnecessary files and legacy code that don't align
# with the new modular, multi-agent architecture.

echo "🧹 Starting AlgoMentor AI legacy cleanup..."

# Function to safely remove files/directories
remove_if_exists() {
    if [ -e "$1" ]; then
        echo "  Removing: $1"
        rm -rf "$1"
    fi
}

# Function to backup before removal
backup_and_remove() {
    if [ -e "$1" ]; then
        echo "  Backing up and removing: $1"
        mkdir -p backup/$(dirname "$1")
        cp -r "$1" "backup/$1"
        rm -rf "$1"
    fi
}

echo "📁 Creating backup directory..."
mkdir -p backup

echo "🗑️  Removing legacy files and directories..."

# Remove old backend structure (keep only new modular structure)
remove_if_exists "backend/dist"
remove_if_exists "backend/src/routes/agents.ts"
remove_if_exists "backend/src/routes/api.ts"
remove_if_exists "backend/src/routes/backtest.ts"
remove_if_exists "backend/src/routes/history.ts"
remove_if_exists "backend/src/routes/paper.ts"
remove_if_exists "backend/src/routes/strategies.ts"
remove_if_exists "backend/src/services/agents"
remove_if_exists "backend/src/services/backtester.ts"
remove_if_exists "backend/src/services/dataProvider.ts"
remove_if_exists "backend/src/services/indicators.ts"
remove_if_exists "backend/src/tests"
remove_if_exists "backend/demo-agents.js"
remove_if_exists "backend/test-connection.js"
remove_if_exists "backend/test-flexible-ohlcv.js"
remove_if_exists "backend/test-moving-average.js"
remove_if_exists "backend/test-server.js"

# Remove old frontend components that are being replaced
remove_if_exists "src/components/BacktestAnalyst.tsx"
remove_if_exists "src/components/BacktestingSection.tsx"
remove_if_exists "src/components/CommunitySection.tsx"
remove_if_exists "src/components/EducationalHelp.tsx"
remove_if_exists "src/components/FeaturesShowcase.tsx"
remove_if_exists "src/components/HeroSection.tsx"
remove_if_exists "src/components/OHLCVAnalyst.tsx"
remove_if_exists "src/components/PaperTradingPanel.tsx"
remove_if_exists "src/components/StrategyArchitect.tsx"
remove_if_exists "src/components/StrategyBuilder.tsx"
remove_if_exists "src/components/TradeCoach.tsx"

# Remove old hooks that are being replaced
remove_if_exists "src/hooks/useAgents.ts"

# Remove old pages that are being replaced
remove_if_exists "src/pages/Index.tsx"
remove_if_exists "src/pages/Pricing.tsx"

# Remove old lib files
remove_if_exists "src/lib/api.ts"

# Remove old assets
remove_if_exists "src/assets"

# Remove old documentation
remove_if_exists "AI_AGENTS_IMPLEMENTATION.md"

# Remove old package files
remove_if_exists "AlgoCode"

# Remove old lock files
remove_if_exists "bun.lockb"

# Remove old git files
remove_if_exists "et --hard fef7d4e"

# Remove old config files that are no longer needed
remove_if_exists "components.json"
remove_if_exists "postcss.config.js"
remove_if_exists "tailwind.config.ts"

# Remove old TypeScript configs
remove_if_exists "tsconfig.app.json"
remove_if_exists "tsconfig.node.json"

echo "📝 Updating package.json..."

# Update package.json to reflect new structure
cat > package.json << 'EOF'
{
  "name": "algomentor-ai",
  "version": "1.0.0",
  "description": "Modular Multi-Agent Educational Trading Platform",
  "type": "module",
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "vite",
    "build": "npm run build:backend && npm run build:frontend",
    "build:backend": "cd backend && npm run build",
    "build:frontend": "vite build",
    "test": "npm run test:backend && npm run test:frontend",
    "test:backend": "cd backend && npm test",
    "test:frontend": "vitest",
    "test:e2e": "playwright test",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "clean": "rm -rf node_modules backend/node_modules dist backend/dist",
    "cleanup": "bash scripts/cleanup-legacy.sh",
    "setup": "npm install && cd backend && npm install",
    "start": "cd backend && npm start"
  },
  "dependencies": {
    "@google/genai": "^1.20.0",
    "@hookform/resolvers": "^3.10.0",
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-aspect-ratio": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-context-menu": "^2.2.15",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-hover-card": "^1.1.14",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-menubar": "^1.1.15",
    "@radix-ui/react-navigation-menu": "^1.2.13",
    "@radix-ui/react-popover": "^1.1.14",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-radio-group": "^1.3.7",
    "@radix-ui/react-scroll-area": "^1.2.9",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.5",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toast": "^1.2.14",
    "@radix-ui/react-toggle": "^1.1.9",
    "@radix-ui/react-toggle-group": "^1.1.10",
    "@radix-ui/react-tooltip": "^1.2.7",
    "@tanstack/react-query": "^5.83.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.6.0",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.462.0",
    "next-themes": "^0.3.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.61.1",
    "react-resizable-panels": "^2.1.9",
    "react-router-dom": "^6.30.1",
    "recharts": "^2.15.4",
    "sonner": "^1.7.4",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.9",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@eslint/js": "^9.32.0",
    "@tailwindcss/typography": "^0.5.16",
    "@types/node": "^22.16.5",
    "@types/react": "^18.3.23",
    "@types/react-dom": "^18.3.7",
    "@vitejs/plugin-react-swc": "^3.11.0",
    "autoprefixer": "^10.4.21",
    "concurrently": "^8.2.2",
    "eslint": "^9.32.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^15.15.0",
    "lovable-tagger": "^1.1.9",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.3",
    "typescript-eslint": "^8.38.0",
    "vite": "^5.4.19",
    "vitest": "^1.0.0"
  },
  "keywords": [
    "trading",
    "algorithmic-trading",
    "ai",
    "education",
    "backtesting",
    "strategy-development"
  ],
  "author": "AlgoMentor AI Team",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/AlgoMentor-AI.git"
  },
  "homepage": "https://algomentor-ai.com"
}
EOF

echo "📝 Updating backend package.json..."

# Update backend package.json
cat > backend/package.json << 'EOF'
{
  "name": "algomentor-ai-backend",
  "version": "1.0.0",
  "description": "AlgoMentor AI Backend API Server",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "clean": "rm -rf dist node_modules",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "axios": "^1.12.2",
    "cors": "^2.8.5",
    "dayjs": "^1.11.11",
    "dotenv": "^17.2.2",
    "express": "^4.19.2",
    "express-rate-limit": "^7.4.0",
    "morgan": "^1.10.0",
    "node-fetch": "^3.3.2",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jest": "^30.0.0",
    "@types/morgan": "^1.9.9",
    "@types/node": "^20.14.2",
    "@types/supertest": "^6.0.3",
    "jest": "^30.1.3",
    "supertest": "^7.1.4",
    "ts-jest": "^29.4.4",
    "ts-node": "^10.9.2",
    "ts-node-dev": "^2.0.0",
    "tsx": "^4.16.2",
    "typescript": "^5.4.5"
  },
  "jest": {
    "preset": "ts-jest/presets/default-esm",
    "extensionsToTreatAsEsm": [".ts"],
    "globals": {
      "ts-jest": {
        "useESM": true
      }
    },
    "testMatch": [
      "**/__tests__/**/*.ts",
      "**/?(*.)+(spec|test).ts"
    ],
    "collectCoverageFrom": [
      "src/**/*.ts",
      "!src/**/*.d.ts"
    ]
  }
}
EOF

echo "📝 Creating new TypeScript configuration..."

# Create new tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/agents/*": ["./agents/*"],
      "@/services/*": ["./services/*"],
      "@/components/*": ["./components/*"]
    }
  },
  "include": [
    "src",
    "agents",
    "services",
    "components"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "backend/dist"
  ]
}
EOF

echo "📝 Creating new Vite configuration..."

# Create new vite.config.ts
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/agents': path.resolve(__dirname, './agents'),
      '@/services': path.resolve(__dirname, './services'),
      '@/components': path.resolve(__dirname, './components'),
    },
  },
  server: {
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
EOF

echo "📝 Creating new Tailwind configuration..."

# Create new tailwind.config.ts
cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './agents/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
EOF

echo "📝 Creating new PostCSS configuration..."

# Create new postcss.config.js
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

echo "📝 Creating environment template..."

# Create .env.example
cat > .env.example << 'EOF'
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
EOF

echo "📝 Creating new main App component..."

# Create new App.tsx
cat > src/App.tsx << 'EOF'
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

// Import agent components
import StrategyBuilder from '@/components/agents/StrategyBuilder';
import BacktestAnalyst from '@/components/agents/BacktestAnalyst';
import TradeCoach from '@/components/agents/TradeCoach';
import NewsSentiment from '@/components/agents/NewsSentiment';
import Mentor from '@/components/agents/Mentor';

// Global query client for API state management
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Mentor />} />
              <Route path="/strategy-builder" element={<StrategyBuilder />} />
              <Route path="/backtest-analyst" element={<BacktestAnalyst />} />
              <Route path="/trade-coach" element={<TradeCoach />} />
              <Route path="/news-sentiment" element={<NewsSentiment />} />
              <Route path="/mentor" element={<Mentor />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
EOF

echo "📝 Creating new main.tsx..."

# Create new main.tsx
cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

echo "📝 Creating new index.css..."

# Create new index.css
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
EOF

echo "📝 Creating new index.html..."

# Create new index.html
cat > index.html << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AlgoMentor AI - Educational Trading Platform</title>
    <meta name="description" content="Learn algorithmic trading with AI-powered agents and comprehensive educational content." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

echo "📝 Creating deployment scripts..."

# Create deployment script
cat > scripts/deploy.sh << 'EOF'
#!/bin/bash

echo "🚀 Deploying AlgoMentor AI..."

# Build the application
echo "📦 Building application..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

echo "✅ Build completed successfully!"

# Add deployment steps here based on your hosting platform
echo "🌐 Ready for deployment!"
echo "   Frontend build: ./dist"
echo "   Backend build: ./backend/dist"
EOF

chmod +x scripts/deploy.sh

# Create test script
cat > scripts/test.sh << 'EOF'
#!/bin/bash

echo "🧪 Running AlgoMentor AI tests..."

# Run backend tests
echo "🔧 Testing backend..."
cd backend && npm test
if [ $? -ne 0 ]; then
    echo "❌ Backend tests failed."
    exit 1
fi

# Run frontend tests
echo "🎨 Testing frontend..."
cd .. && npm test
if [ $? -ne 0 ]; then
    echo "❌ Frontend tests failed."
    exit 1
fi

echo "✅ All tests passed!"
EOF

chmod +x scripts/test.sh

echo "📝 Creating documentation structure..."

# Create docs directory structure
mkdir -p docs/agents docs/api docs/deployment

# Create agent documentation
cat > docs/agents/README.md << 'EOF'
# AlgoMentor AI Agents Documentation

This directory contains detailed documentation for each AI agent in the AlgoMentor AI platform.

## Available Agents

- [Strategy Builder](./strategy-builder.md) - Convert natural language to trading strategies
- [Backtest Analyst](./backtest-analyst.md) - Analyze backtest results
- [Trade Coach](./trade-coach.md) - Personal trading coaching
- [News Sentiment](./news-sentiment.md) - News and sentiment analysis
- [Mentor](./mentor.md) - Master mentor agent

## Agent Architecture

Each agent follows a consistent architecture:

1. **Core Logic** (`index.ts`) - Main agent implementation
2. **Prompts** (`prompts.ts`) - AI prompt templates
3. **Types** (`types.ts`) - TypeScript interfaces
4. **Tests** (`tests/`) - Unit and integration tests

## Adding New Agents

To add a new agent:

1. Create agent directory in `agents/`
2. Implement the agent interface
3. Add prompts and types
4. Create UI components
5. Add tests
6. Update documentation
EOF

echo "✅ Legacy cleanup completed!"
echo ""
echo "📋 Summary of changes:"
echo "  ✅ Removed legacy backend files"
echo "  ✅ Removed legacy frontend components"
echo "  ✅ Updated package.json files"
echo "  ✅ Created new configuration files"
echo "  ✅ Created new App structure"
echo "  ✅ Created deployment scripts"
echo "  ✅ Created documentation structure"
echo ""
echo "🔄 Next steps:"
echo "  1. Run 'npm run setup' to install dependencies"
echo "  2. Copy .env.example to .env and configure API keys"
echo "  3. Run 'npm run dev' to start development servers"
echo "  4. Visit http://localhost:8081 to see the new platform"
echo ""
echo "📚 Documentation:"
echo "  - README_ALGOMENTOR_AI.md - Complete platform documentation"
echo "  - docs/ - Detailed agent and API documentation"
echo ""
echo "🎉 AlgoMentor AI is ready for development!"
