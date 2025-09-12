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
  const url = `https://query1.finance.yahoo.com/v7/finance/download/${encodeURIComponent(symbol)}?period1=${startSec}&period2=${endSec}&interval=1d&events=history&includeAdjustedClose=true`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Yahoo fetch failed: ${resp.status}`);
  const text = await resp.text();
  return parseYahooCsv(text);
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


