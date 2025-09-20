#!/usr/bin/env node

/**
 * Demo script to test AI Agents functionality
 * Run with: node demo-agents.js
 * 
 * Make sure to:
 * 1. Set GEMINI_API_KEY in your .env file
 * 2. Start the backend server (npm run dev)
 */

const BASE_URL = 'http://localhost:4000';

async function testStrategyArchitect() {
  console.log('\n🎯 Testing Strategy Architect...');
  
  const prompt = "Buy when RSI drops below 30 and sell when it goes above 70 with a stop loss at 5%";
  
  try {
    const response = await fetch(`${BASE_URL}/api/agents/strategy-builder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Strategy Architect Success:');
      console.log('📝 Generated Strategy:');
      console.log(result.strategy);
      console.log(`🔍 Parsed: ${result.parsed ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ Strategy Architect Error:', result.error);
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
}

async function testBacktestAnalyst() {
  console.log('\n📊 Testing Backtest Analyst...');
  
  const stats = {
    totalTrades: 150,
    winRate: 0.62,
    totalReturn: 0.18,
    maxDrawdown: -0.12,
    profitFactor: 1.45,
    sharpeRatio: 1.23,
    winningTrades: 93,
    losingTrades: 57,
    averageWin: 245.50,
    averageLoss: -180.25
  };
  
  try {
    const response = await fetch(`${BASE_URL}/api/agents/backtest-analyst`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stats })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Backtest Analyst Success:');
      console.log('📈 Analysis Summary:');
      console.log(result.summary);
    } else {
      console.log('❌ Backtest Analyst Error:', result.error);
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
}

async function testTradeCoach() {
  console.log('\n🎓 Testing Trade Coach...');
  
  const trades = [
    {
      symbol: 'AAPL',
      side: 'buy',
      quantity: 100,
      price: 150.00,
      timestamp: '2024-01-15T10:30:00Z',
      pnl: 500,
      strategy: 'SMA Cross'
    },
    {
      symbol: 'GOOGL',
      side: 'sell',
      quantity: 50,
      price: 2800.00,
      timestamp: '2024-01-16T14:20:00Z',
      pnl: -200,
      strategy: 'RSI Reversion'
    },
    {
      symbol: 'MSFT',
      side: 'buy',
      quantity: 200,
      price: 380.00,
      timestamp: '2024-01-17T09:15:00Z',
      pnl: 750,
      strategy: 'Breakout'
    },
    {
      symbol: 'TSLA',
      side: 'sell',
      quantity: 75,
      price: 220.00,
      timestamp: '2024-01-18T15:45:00Z',
      pnl: -150,
      strategy: 'Momentum'
    }
  ];
  
  try {
    const response = await fetch(`${BASE_URL}/api/agents/trade-coach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trades })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Trade Coach Success:');
      console.log(`📚 Analyzed ${result.trades_analyzed} trades`);
      console.log('🎯 Coaching Advice:');
      console.log(result.advice);
    } else {
      console.log('❌ Trade Coach Error:', result.error);
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
}

// Test OHLCV Analyst Agent
async function testOHLCVAnalyst() {
  console.log('\n📊 Testing OHLCV Analyst...');
  
  const mockOHLCVData = [
    { timestamp: 1704067200000, open: 150.0, high: 155.5, low: 149.2, close: 154.8, volume: 45000000 },
    { timestamp: 1704153600000, open: 154.8, high: 157.2, low: 153.1, close: 156.5, volume: 52000000 },
    { timestamp: 1704240000000, open: 156.5, high: 159.8, low: 155.2, close: 158.3, volume: 48000000 },
    { timestamp: 1704326400000, open: 158.3, high: 160.1, low: 156.8, close: 159.5, volume: 51000000 },
    { timestamp: 1704412800000, open: 159.5, high: 162.3, low: 158.1, close: 161.2, volume: 55000000 }
  ];
  
  try {
    const response = await fetch(`${BASE_URL}/api/agents/ohlcv-analyst`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ohlcvData: mockOHLCVData, 
        symbol: 'AAPL', 
        analysisType: 'Comprehensive Market Analysis' 
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ OHLCV Analyst Success:');
      console.log(`📈 Analyzed ${result.data_points_analyzed} data points for ${result.symbol}`);
      console.log(`🔍 Analysis Type: ${result.analysis_type}`);
      console.log('📊 Market Analysis:');
      console.log(result.analysis);
    } else {
      console.log('❌ OHLCV Analyst Error:', result.error);
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
}

async function testAgentsHealth() {
  console.log('🏥 Testing Agents Health...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/agents/health`);
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Agents Health Check:');
      console.log(`📊 Status: ${result.status}`);
      console.log(`🤖 Available Agents: ${result.agents.join(', ')}`);
      console.log(`🔑 Gemini Configured: ${result.gemini_configured ? 'Yes' : 'No'}`);
      console.log(`⚡ Powered by: ${result.powered_by}`);
      
      return result.gemini_configured;
    } else {
      console.log('❌ Health Check Failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
    console.log('💡 Make sure the backend server is running on port 4000');
    return false;
  }
}

async function main() {
  console.log('🚀 AlgoCode AI Agents Demo');
  console.log('================================');
  
  const isHealthy = await testAgentsHealth();
  
  if (!isHealthy) {
    console.log('\n⚠️  Gemini API key not configured or agents not healthy');
    console.log('📝 To fix this:');
    console.log('   1. Get a Gemini API key from https://makersuite.google.com/app/apikey');
    console.log('   2. Add it to backend/.env as GEMINI_API_KEY=your_key_here');
    console.log('   3. Restart the backend server');
    return;
  }
  
  // Test all agents
  await testStrategyArchitect();
  await testOHLCVAnalyst();
  await testBacktestAnalyst();
  await testTradeCoach();
  
  console.log('\n🎉 Demo completed!');
  console.log('💡 Visit http://localhost:8081/agents to try the UI');
}

// Run the demo
main().catch(console.error);
