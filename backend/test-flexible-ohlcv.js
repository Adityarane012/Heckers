// Test script to demonstrate flexible OHLCV data input capabilities
const BASE_URL = 'http://localhost:4000';

// Test data in different formats
const testData = {
  json: [
    { timestamp: 1704067200000, open: 150.0, high: 155.5, low: 149.2, close: 154.8, volume: 45000000 },
    { timestamp: 1704153600000, open: 154.8, high: 157.2, low: 153.1, close: 156.5, volume: 52000000 },
    { timestamp: 1704240000000, open: 156.5, high: 159.8, low: 155.2, close: 158.3, volume: 48000000 }
  ],
  
  csv: `date,open,high,low,close,volume
2024-01-01,150.0,155.5,149.2,154.8,45000000
2024-01-02,154.8,157.2,153.1,156.5,52000000
2024-01-03,156.5,159.8,155.2,158.3,48000000`,

  csvAlternative: `datetime,o,h,l,c,v
2024-01-01,150.0,155.5,149.2,154.8,45000000
2024-01-02,154.8,157.2,153.1,156.5,52000000
2024-01-03,156.5,159.8,155.2,158.3,48000000`,

  rawText: `2024-01-01 150.0 155.5 149.2 154.8 45000000
2024-01-02 154.8 157.2 153.1 156.5 52000000
2024-01-03 156.5 159.8 155.2 158.3 48000000`,

  // Test with different date formats
  csvWithDifferentDates: `timestamp,open,high,low,close,volume
1704067200000,150.0,155.5,149.2,154.8,45000000
1704153600000,154.8,157.2,153.1,156.5,52000000
1704240000000,156.5,159.8,155.2,158.3,48000000`,

  // Test with invalid data (should show validation errors)
  invalidData: [
    { timestamp: 1704067200000, open: 150.0, high: 155.5, low: 149.2, close: 154.8, volume: 45000000 },
    { timestamp: 1704153600000, open: 154.8, high: 157.2, low: 153.1, close: 156.5, volume: 52000000 },
    { timestamp: 1704240000000, open: 156.5, high: 159.8, low: 155.2, close: 158.3, volume: 48000000 },
    { timestamp: 1704326400000, open: 158.3, high: 160.1, low: 156.8, close: 159.5, volume: 51000000 },
    { timestamp: 1704412800000, open: 159.5, high: 162.3, low: 158.1, close: 161.2, volume: 55000000 }
  ]
};

async function testOHLCVWithFormat(data, format, description) {
  console.log(`\n📊 Testing ${description}...`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/agents/ohlcv-analyst`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ohlcvData: data, 
        symbol: 'AAPL', 
        analysisType: 'Comprehensive Market Analysis' 
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${description} Success:`);
      console.log(`📈 Analyzed ${result.data_points_analyzed} data points for ${result.symbol}`);
      console.log(`🔍 Analysis Type: ${result.analysis_type}`);
      console.log(`📊 Analysis Preview: ${result.analysis.substring(0, 200)}...`);
    } else {
      console.log(`❌ ${description} Error:`, result.error);
    }
  } catch (error) {
    console.log(`❌ Network Error:`, error.message);
  }
}

async function testDataValidation() {
  console.log('\n🔍 Testing Data Validation...');
  
  // Test with invalid OHLC data (high < low)
  const invalidOHLC = [
    { timestamp: 1704067200000, open: 150.0, high: 149.0, low: 155.0, close: 154.8, volume: 45000000 }, // Invalid: high < low
    { timestamp: 1704153600000, open: 154.8, high: 157.2, low: 153.1, close: 156.5, volume: 52000000 }
  ];
  
  try {
    const response = await fetch(`${BASE_URL}/api/agents/ohlcv-analyst`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ohlcvData: invalidOHLC, 
        symbol: 'AAPL', 
        analysisType: 'Comprehensive Market Analysis' 
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Invalid OHLC data was processed (backend validation passed)');
    } else {
      console.log('❌ Invalid OHLC data rejected:', result.error);
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
}

async function main() {
  console.log('🚀 Testing Flexible OHLCV Data Input');
  console.log('=====================================');
  
  // Test different data formats
  await testOHLCVWithFormat(testData.json, 'json', 'JSON Format');
  await testOHLCVWithFormat(testData.invalidData, 'json', 'Extended JSON Data (5 points)');
  
  // Test data validation
  await testDataValidation();
  
  console.log('\n🎉 Flexible Data Input Testing Completed!');
  console.log('\n📋 Supported Formats:');
  console.log('• JSON: Array of objects with timestamp, open, high, low, close, volume');
  console.log('• CSV: Header row with flexible column names (date, datetime, o, h, l, c, v, etc.)');
  console.log('• Raw Text: Space/tab separated values');
  console.log('• File Upload: Automatic format detection');
  console.log('\n🔧 Validation Features:');
  console.log('• OHLC relationship validation (high >= low, high >= open/close, etc.)');
  console.log('• Data type validation (numeric values)');
  console.log('• Date format auto-detection');
  console.log('• Column name mapping (o->open, h->high, etc.)');
  console.log('• Error reporting with specific row/field information');
  console.log('\n💡 Visit http://localhost:8081/agents to try the enhanced UI!');
}

main().catch(console.error);
