import dayjs from 'dayjs';
import fetch from 'node-fetch';

export type OHLCV = {
  timestamp: number; // ms epoch
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export async function fetchYahooDaily(symbol: string, start: string, end: string): Promise<OHLCV[]> {
  const startSec = Math.floor(dayjs(start).valueOf() / 1000);
  const endSec = Math.floor(dayjs(end).valueOf() / 1000);
  
  // Try different Yahoo Finance endpoints
  const urls = [
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?period1=${startSec}&period2=${endSec}&interval=1d&events=history&includeAdjustedClose=true`,
    `https://query1.finance.yahoo.com/v7/finance/download/${encodeURIComponent(symbol)}?period1=${startSec}&period2=${endSec}&interval=1d&events=history&includeAdjustedClose=true`,
    `https://query1.finance.yahoo.com/v10/finance/download/${encodeURIComponent(symbol)}?period1=${startSec}&period2=${endSec}&interval=1d&events=history&includeAdjustedClose=true`
  ];
  
  let lastError: Error | null = null;
  
  for (const url of urls) {
    try {
      console.log(`Trying URL: ${url}`);
      const resp = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (resp.ok) {
        const text = await resp.text();
        if (text.includes('Date,Open,High,Low,Close,Adj Close,Volume')) {
          return parseYahooCsv(text);
        } else if (text.includes('"chart"')) {
          // Handle JSON response format
          const data = JSON.parse(text);
          return parseYahooJson(data);
        }
      }
      lastError = new Error(`Yahoo fetch failed: ${resp.status} - ${resp.statusText}`);
    } catch (e) {
      lastError = e as Error;
      console.log(`URL failed: ${url}, error: ${e}`);
    }
  }
  
  throw lastError || new Error('All Yahoo Finance endpoints failed');
}

export function parseYahooCsv(csv: string): OHLCV[] {
  const lines = csv.trim().split(/\r?\n/);
  const out: OHLCV[] = [];
  for (let i = 1; i < lines.length; i++) {
    const [date, open, high, low, close, adjClose, volume] = lines[i].split(',');
    if (!date || date === 'null' || open === 'null') continue;
    const ts = dayjs(date).valueOf();
    out.push({
      timestamp: ts,
      open: Number(open),
      high: Number(high),
      low: Number(low),
      close: Number(adjClose ?? close),
      volume: Number(volume)
    });
  }
  return out.filter(r => Number.isFinite(r.close));
}

export function parseYahooJson(data: any): OHLCV[] {
  try {
    const chart = data.chart?.result?.[0];
    if (!chart) throw new Error('Invalid chart data');
    
    const timestamps = chart.timestamp || [];
    const quotes = chart.indicators?.quote?.[0] || {};
    const adjClose = chart.indicators?.adjclose?.[0]?.adjclose || [];
    
    const out: OHLCV[] = [];
    for (let i = 0; i < timestamps.length; i++) {
      const open = quotes.open?.[i];
      const high = quotes.high?.[i];
      const low = quotes.low?.[i];
      const close = quotes.close?.[i];
      const volume = quotes.volume?.[i];
      const adj = adjClose[i];
      
      if (open == null || high == null || low == null || close == null || volume == null) continue;
      
      out.push({
        timestamp: timestamps[i] * 1000, // Convert to milliseconds
        open: Number(open),
        high: Number(high),
        low: Number(low),
        close: Number(adj ?? close),
        volume: Number(volume)
      });
    }
    return out.filter(r => Number.isFinite(r.close));
  } catch (e) {
    console.error('JSON parsing error:', e);
    throw new Error('Failed to parse Yahoo Finance JSON response');
  }
}


