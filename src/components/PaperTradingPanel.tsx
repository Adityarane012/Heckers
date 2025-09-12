import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { paperCreate, paperOrder, paperAccount } from "@/lib/api";

export function PaperTradingPanel() {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [cash, setCash] = useState<number>(0);
  const [symbol, setSymbol] = useState("AAPL");
  const [qty, setQty] = useState(1);
  const [positions, setPositions] = useState<Record<string, { qty: number; avg: number }>>({});

  const refresh = async (id: string) => {
    const acct = await paperAccount(id);
    setCash(acct.cash);
    setPositions(acct.positions || {});
  };

  useEffect(() => {
    if (accountId) refresh(accountId).catch(() => {});
  }, [accountId]);

  return (
    <section className="py-10">
      <div className="container mx-auto px-6">
        <Card className="card-trading">
          <CardHeader>
            <CardTitle>Paper Trading</CardTitle>
            <CardDescription>Create an account and simulate orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!accountId ? (
              <Button onClick={async () => {
                const { id } = await paperCreate();
                setAccountId(id);
              }}>Create Paper Account</Button>
            ) : (
              <div className="space-y-3">
                <div className="text-sm">Account: {accountId}</div>
                <div className="text-sm">Cash: ${cash.toFixed(2)}</div>
                <div className="grid grid-cols-3 gap-2">
                  <Input value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())} />
                  <Input value={qty} onChange={e => setQty(Number(e.target.value || 0))} type="number" />
                  <div className="flex gap-2">
                    <Button onClick={async () => { if (!accountId) return; await paperOrder({ accountId, symbol, side: 'buy', qty }); await refresh(accountId); }}>Buy</Button>
                    <Button variant="destructive" onClick={async () => { if (!accountId) return; await paperOrder({ accountId, symbol, side: 'sell', qty }); await refresh(accountId); }}>Sell</Button>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="font-semibold">Positions</div>
                  {Object.keys(positions).length === 0 ? (
                    <div className="text-muted-foreground">No positions</div>
                  ) : (
                    <ul className="list-disc pl-4">
                      {Object.entries(positions).map(([s, p]) => (
                        <li key={s}>{s}: {p.qty} @ ${p.avg.toFixed(2)}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}


