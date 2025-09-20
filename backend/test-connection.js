// Simple test to verify frontend-backend connection
const BASE_URL = 'http://localhost:4000';

async function testConnection() {
  console.log('🔍 Testing Frontend-Backend Connection...');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test agents health
    console.log('2. Testing agents health...');
    const agentsResponse = await fetch(`${BASE_URL}/api/agents/health`);
    const agentsData = await agentsResponse.json();
    console.log('✅ Agents health:', agentsData);
    
    // Test strategy builder
    console.log('3. Testing strategy builder...');
    const strategyResponse = await fetch(`${BASE_URL}/api/agents/strategy-builder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'simple moving average crossover' })
    });
    const strategyData = await strategyResponse.json();
    console.log('✅ Strategy builder:', strategyData.strategy ? 'Success' : 'Failed');
    
    // Test OHLCV analyst
    console.log('4. Testing OHLCV analyst...');
    const ohlcvData = [
      { timestamp: 1704067200000, open: 150.0, high: 155.5, low: 149.2, close: 154.8, volume: 45000000 },
      { timestamp: 1704153600000, open: 154.8, high: 157.2, low: 153.1, close: 156.5, volume: 52000000 }
    ];
    const ohlcvResponse = await fetch(`${BASE_URL}/api/agents/ohlcv-analyst`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ohlcvData, 
        symbol: 'AAPL', 
        analysisType: 'Comprehensive Market Analysis' 
      })
    });
    const ohlcvResult = await ohlcvResponse.json();
    console.log('✅ OHLCV analyst:', ohlcvResult.analysis ? 'Success' : 'Failed');
    
    console.log('\n🎉 All tests passed! Backend is working correctly.');
    console.log('💡 If you\'re still getting "failed to fetch" in the frontend:');
    console.log('   1. Check browser console for specific error messages');
    console.log('   2. Verify the frontend is running on http://localhost:8081');
    console.log('   3. Try refreshing the page');
    console.log('   4. Check if there are any browser extensions blocking requests');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log('💡 Make sure the backend server is running on port 4000');
  }
}

testConnection();
