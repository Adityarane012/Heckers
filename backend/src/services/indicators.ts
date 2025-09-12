export function sma(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = Array(values.length).fill(null);
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    if (i >= period - 1) out[i] = sum / period;
  }
  return out;
}

export function ema(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = Array(values.length).fill(null);
  const k = 2 / (period + 1);
  let prev: number | null = null;
  for (let i = 0; i < values.length; i++) {
    if (prev === null) {
      if (i >= period - 1) {
        const seed = values.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
        prev = seed;
        out[i] = seed;
      }
    } else {
      prev = values[i] * k + prev * (1 - k);
      out[i] = prev;
    }
  }
  return out;
}

export function rsi(values: number[], period = 14): (number | null)[] {
  const out: (number | null)[] = Array(values.length).fill(null);
  let gain = 0;
  let loss = 0;
  for (let i = 1; i < values.length; i++) {
    const change = values[i] - values[i - 1];
    if (i <= period) {
      if (change > 0) gain += change; else loss -= Math.min(change, 0);
      if (i === period) {
        const avgGain = gain / period;
        const avgLoss = loss / period;
        const rs = avgLoss === 0 ? 100 : avgGain / (avgLoss || 1e-12);
        out[i] = 100 - 100 / (1 + rs);
      }
    } else {
      const currGain = Math.max(change, 0);
      const currLoss = Math.max(-change, 0);
      gain = (gain * (period - 1) + currGain) / period;
      loss = (loss * (period - 1) + currLoss) / period;
      const rs = loss === 0 ? 100 : gain / (loss || 1e-12);
      out[i] = 100 - 100 / (1 + rs);
    }
  }
  return out;
}

export function macd(values: number[], fast = 12, slow = 26, signal = 9) {
  const fastE = ema(values, fast);
  const slowE = ema(values, slow);
  const macdLine: (number | null)[] = values.map((_, i) =>
    fastE[i] !== null && slowE[i] !== null ? (fastE[i]! - slowE[i]!) : null
  );
  const signalLine = ema(macdLine.map(v => v ?? 0), signal);
  const hist: (number | null)[] = values.map((_, i) =>
    macdLine[i] !== null && signalLine[i] !== null ? (macdLine[i]! - signalLine[i]!) : null
  );
  return { macdLine, signalLine, hist };
}

export function highest(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = Array(values.length).fill(null);
  for (let i = 0; i < values.length; i++) {
    if (i >= period - 1) {
      let h = -Infinity;
      for (let j = i - period + 1; j <= i; j++) h = Math.max(h, values[j]);
      out[i] = h;
    }
  }
  return out;
}

export function lowest(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = Array(values.length).fill(null);
  for (let i = 0; i < values.length; i++) {
    if (i >= period - 1) {
      let l = Infinity;
      for (let j = i - period + 1; j <= i; j++) l = Math.min(l, values[j]);
      out[i] = l;
    }
  }
  return out;
}

export function roc(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = Array(values.length).fill(null);
  for (let i = 0; i < values.length; i++) {
    if (i >= period) {
      const prev = values[i - period];
      out[i] = prev === 0 ? null : (values[i] - prev) / prev * 100;
    }
  }
  return out;
}


