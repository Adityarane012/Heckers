// Test moving average crossover example
const BASE_URL = 'http://localhost:4000';

async function testMovingAverageExample() {
  console.log('🎯 Testing Moving Average Crossover Example...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/agents/strategy-builder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: 'Use moving average crossover with 10-day and 20-day periods' 
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Moving Average Crossover Success:');
      console.log('📝 Generated Strategy:');
      console.log(result.strategy);
    } else {
      console.log('❌ Error:', result.error);
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
}

testMovingAverageExample();
