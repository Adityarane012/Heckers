export type BacktestPayload = {
  symbol: string;
  start: string;
  end: string;
  strategy: { kind: 'smaCross' | 'rsiReversion' | 'macd' | 'breakout' | 'momentum'; params: Record<string, number> };
};
const env = (import.meta as any)?.env ?? {};
const BASE_URL = env.VITE_API_URL ?? env.VITE_APP_API_URL ?? env.VITE_BACKEND_URL ?? 'http://localhost:4000';

export async function runBacktestApi(payload: BacktestPayload) {
  const res = await fetch(`${BASE_URL}/api/backtest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function listStrategies() {
  const res = await fetch(`${BASE_URL}/api/strategies`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function saveStrategy(input: { id?: string; name: string; definition: { kind: 'smaCross' | 'rsiReversion'; params: Record<string, number> } }) {
  const res = await fetch(`${BASE_URL}/api/strategies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function paperCreate() {
  const res = await fetch(`${BASE_URL}/api/paper/create`, { method: 'POST' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function paperOrder(input: { accountId: string; symbol: string; side: 'buy' | 'sell'; qty: number; }) {
  const res = await fetch(`${BASE_URL}/api/paper/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function paperAccount(id: string) {
  const res = await fetch(`${BASE_URL}/api/paper/account/${id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}


