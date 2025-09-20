// Simple test to verify server connectivity
const fetch = require('node-fetch');

async function testServer() {
  try {
    console.log('Testing server connection...');
    
    // Test basic health endpoint
    const healthResponse = await fetch('http://localhost:4000/health');
    if (healthResponse.ok) {
      console.log('✅ Basic health endpoint working');
    } else {
      console.log('❌ Health endpoint failed:', healthResponse.status);
    }
    
    // Test agents health endpoint
    const agentsResponse = await fetch('http://localhost:4000/api/agents/health');
    if (agentsResponse.ok) {
      const data = await agentsResponse.json();
      console.log('✅ Agents endpoint working:', data);
    } else {
      console.log('❌ Agents endpoint failed:', agentsResponse.status);
    }
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
  }
}

testServer();
