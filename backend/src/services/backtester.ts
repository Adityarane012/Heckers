import { OHLCV } from './dataProvider.js';
import { sma, rsi, macd, highest, lowest, roc } from './indicators.js';

export type Signal = 'buy' | 'sell' | 'hold';

export type StrategyDefinition = {
  kind: 'smaCross' | 'rsiReversion' | 'macd' | 'breakout' | 'momentum';
  params: Record<string, number>;
};

export type Trade = {
  entryTime: number;
  exitTime: number;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  returnPct: number;
};

export type BacktestResult = {
  equityCurve: number[];
  returns: number[]; // daily returns
  trades: Trade[];
  metrics: {
    cagrPct: number;
    sharpe: number;
    maxDrawdownPct: number;
    drawdownSeriesPct: number[];
    winRatePct: number;
    numTrades: number;
    profitFactor: number;
    totalReturnPct: number;
  };
};

export function generateSignals(data: OHLCV[], strategy: StrategyDefinition): Signal[] {
  const closes = data.map(d => d.close);
  const signals: Signal[] = Array(data.length).fill('hold');
  if (strategy.kind === 'smaCross') {
    const fast = strategy.params.fast ?? 10;
    const slow = strategy.params.slow ?? 30;
    const fastArr = sma(closes, fast);
    const slowArr = sma(closes, slow);
    for (let i = 1; i < data.length; i++) {
      const fPrev = fastArr[i - 1]; const sPrev = slowArr[i - 1];
      const f = fastArr[i]; const s = slowArr[i];
      if (fPrev !== null && sPrev !== null && f !== null && s !== null) {
        if (fPrev <= sPrev && f > s) signals[i] = 'buy';
        else if (fPrev >= sPrev && f < s) signals[i] = 'sell';
      }
    }
  } else if (strategy.kind === 'rsiReversion') {
    const period = strategy.params.period ?? 14;
    const buyLevel = strategy.params.buyLevel ?? 30;
    const sellLevel = strategy.params.sellLevel ?? 70;
    const r = rsi(closes, period);
    for (let i = 1; i < data.length; i++) {
      const v = r[i];
      if (v !== null) {
        if (v < buyLevel) signals[i] = 'buy';
        else if (v > sellLevel) signals[i] = 'sell';
      }
    }
  }
  else if (strategy.kind === 'macd') {
    const f = strategy.params.fast ?? 12;
    const s = strategy.params.slow ?? 26;
    const sig = strategy.params.signal ?? 9;
    const m = macd(closes, f, s, sig);
    for (let i = 1; i < data.length; i++) {
      const prevDiff = (m.macdLine[i - 1] ?? 0) - (m.signalLine[i - 1] ?? 0);
      const diff = (m.macdLine[i] ?? 0) - (m.signalLine[i] ?? 0);
      if (prevDiff <= 0 && diff > 0) signals[i] = 'buy';
      else if (prevDiff >= 0 && diff < 0) signals[i] = 'sell';
    }
  }
  else if (strategy.kind === 'breakout') {
    const lookback = strategy.params.lookback ?? 20;
    const highs = highest(closes, lookback);
    const lows = lowest(closes, lookback);
    for (let i = 1; i < data.length; i++) {
      const h = highs[i - 1];
      const l = lows[i - 1];
      if (h !== null && l !== null) {
        if (closes[i] > h) signals[i] = 'buy';
        else if (closes[i] < l) signals[i] = 'sell';
      }
    }
  }
  else if (strategy.kind === 'momentum') {
    const period = strategy.params.period ?? 63; // ~3 months
    const r = roc(closes, period);
    for (let i = 1; i < data.length; i++) {
      const v = r[i];
      const p = r[i - 1];
      if (v !== null && p !== null) {
        if (p <= 0 && v > 0) signals[i] = 'buy';
        else if (p >= 0 && v < 0) signals[i] = 'sell';
      }
    }
  }
  return signals;
}

export function runBacktest(data: OHLCV[], strategy: StrategyDefinition): BacktestResult {
  if (data.length < 20) throw new Error('Not enough data');
  const signals = generateSignals(data, strategy);
  let position: 'long' | 'flat' = 'flat';
  let entryPrice = 0;
  const trades: Trade[] = [];
  const equityCurve: number[] = [];
  const returns: number[] = [];
  let equity = 1;

  for (let i = 1; i < data.length; i++) {
    const pricePrev = data[i - 1].close;
    const price = data[i].close;

    // Mark-to-market
    if (position === 'long') {
      const r = (price - pricePrev) / pricePrev;
      equity *= (1 + r);
      returns.push(r);
    } else {
      returns.push(0);
    }
    equityCurve.push(equity);

    // Signals
    if (signals[i] === 'buy' && position === 'flat') {
      position = 'long';
      entryPrice = price;
    } else if (signals[i] === 'sell' && position === 'long') {
      position = 'flat';
      const exitPrice = price;
      const pnl = exitPrice - entryPrice;
      const ret = pnl / entryPrice;
      trades.push({ entryTime: data[i - 1].timestamp, exitTime: data[i].timestamp, entryPrice, exitPrice, pnl, returnPct: ret * 100 });
    }
  }

  const metrics = computeMetrics(equityCurve, returns, trades, data);
  return { equityCurve, returns, trades, metrics };
}

function computeMetrics(equityCurve: number[], returns: number[], trades: Trade[], data: OHLCV[]) {
  const lastEquity = equityCurve[equityCurve.length - 1] || 1;
  const years = Math.max(1 / 365, (data[data.length - 1].timestamp - data[0].timestamp) / (365 * 24 * 3600 * 1000));
  const cagr = Math.pow(lastEquity, 1 / years) - 1;

  const avg = average(returns);
  const std = stdev(returns);
  const sharpe = std === 0 ? 0 : (avg * Math.sqrt(252)) / std;

  let peak = -Infinity;
  let maxDD = 0;
  const ddSeries: number[] = [];
  for (const v of equityCurve) {
    peak = Math.max(peak, v);
    const dd = (peak - v) / peak;
    if (isFinite(dd)) maxDD = Math.max(maxDD, dd);
    ddSeries.push((isFinite(dd) ? dd : 0) * 100);
  }

  const wins = trades.filter(t => t.returnPct > 0).length;
  const winRate = trades.length ? wins / trades.length : 0;

  let grossProfit = 0;
  let grossLoss = 0;
  for (const t of trades) {
    if (t.pnl >= 0) grossProfit += t.pnl; else grossLoss += -t.pnl;
  }
  const profitFactor = grossLoss === 0 ? (grossProfit > 0 ? Infinity : 0) : grossProfit / grossLoss;

  return {
    cagrPct: cagr * 100,
    sharpe,
    maxDrawdownPct: maxDD * 100,
    drawdownSeriesPct: ddSeries,
    winRatePct: winRate * 100,
    numTrades: trades.length,
    profitFactor,
    totalReturnPct: (lastEquity - 1) * 100
  };
}

function average(a: number[]) {
  if (a.length === 0) return 0;
  return a.reduce((x, y) => x + y, 0) / a.length;
}

function stdev(a: number[]) {
  if (a.length < 2) return 0;
  const mu = average(a);
  const v = average(a.map(x => (x - mu) ** 2));
  return Math.sqrt(v);
}


