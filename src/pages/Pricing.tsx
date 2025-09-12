import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "Forever",
    description: "Get started with core features.",
    features: [
      "Basic strategy builder",
      "Community access",
      "Paper trading",
      "Limited backtests: 7/week",
    ],
    cta: "Get Started",
    highlight: false,
    trial: null,
  },
  {
    name: "Pro",
    price: "₹500/mo",
    period: "billed yearly",
    subtext: "₹6,000 per year",
    description: "Advanced tools for active traders.",
    features: [
      "Advanced indicators & metrics",
      "Priority backtesting queue",
      "Custom alerts",
      "Limited backtests: 50/week",
      "Special group chats",
      "EMI options available",
    ],
    cta: "Go Pro",
    highlight: true,
    trial: null,
  },
  {
    name: "Elite",
    price: "₹2,000/mo",
    period: "billed yearly",
    subtext: "14-day free trial. Full refund guarantee.",
    description: "Full power for professional-grade trading.",
    features: [
      "Premium data sources",
      "Dedicated support",
      "Limited backtests: 50/week",
      "Special group chats",
      "EMI options available",
    ],
    cta: "Start 14-day Trial",
    highlight: false,
    trial: "14 days, full money-back",
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <section className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3">Simple, transparent pricing</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose a plan that fits your trading journey. Upgrade anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border border-border bg-card text-card-foreground p-6 shadow-card ${
                  plan.highlight ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-3xl font-bold">{plan.price}</div>
                  <div className="text-muted-foreground text-sm">{plan.period}</div>
                  {plan.subtext && (
                    <div className="text-xs text-muted-foreground mt-1">{plan.subtext}</div>
                  )}
                  {plan.trial && (
                    <div className="mt-2 inline-block rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">
                      {plan.trial}
                    </div>
                  )}
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button variant={plan.highlight ? "trading" : "trading-outline"} className="w-full">
                  {plan.cta}
                </Button>

                {plan.name === "Elite" && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Free trial available only for Elite plan. Cancel within 14 days for a full refund.
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
