import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { PageHeader, Card, Input, Select, Button } from "@/components/ui-custom";
import { formatINR } from "@/lib/utils";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { TrendingUp, AlertTriangle, ShieldCheck, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#f43f5e"];

interface MFResult {
  equity: number;
  debt: number;
  liquid: number;
  gold: number;
  equityAmount: number;
  debtAmount: number;
  liquidAmount: number;
  goldAmount: number;
  returnMin: number;
  returnMax: number;
  returnMid: number;
  corpus10yr: number;
  risk: "low" | "medium" | "high";
  suggestions: string[];
  warnings: string[];
  funds: Array<{ category: string; example: string; allocation: number; reason: string }>;
}

function calcMFXray(f: { amount: number; risk: string; horizon: number }): MFResult {
  const alloc =
    f.risk === "low"
      ? { equity: 20, debt: 55, liquid: 20, gold: 5 }
      : f.risk === "medium"
      ? { equity: 50, debt: 35, liquid: 10, gold: 5 }
      : { equity: 75, debt: 15, liquid: 5, gold: 5 };

  const equityAmount = Math.round((f.amount * alloc.equity) / 100);
  const debtAmount = Math.round((f.amount * alloc.debt) / 100);
  const liquidAmount = Math.round((f.amount * alloc.liquid) / 100);
  const goldAmount = Math.round((f.amount * alloc.gold) / 100);

  const [returnMin, returnMax] =
    f.risk === "low" ? [6, 9] : f.risk === "medium" ? [10, 13] : [13, 18];
  const returnMid = (returnMin + returnMax) / 2;
  const corpus10yr = Math.round(f.amount * Math.pow(1 + returnMid / 100, f.horizon));

  const funds =
    f.risk === "low"
      ? [
          { category: "Debt MF", example: "ICICI Pru Savings Fund", allocation: 35, reason: "Stable, low-risk returns above FD" },
          { category: "Hybrid / Balanced Advantage", example: "HDFC Balanced Advantage Fund", allocation: 20, reason: "Dynamic equity-debt mix" },
          { category: "Liquid Fund", example: "Axis Liquid Fund", allocation: 20, reason: "Park emergency fund with instant redemption" },
          { category: "Large Cap Index", example: "Nifty 50 Index Fund", allocation: 20, reason: "Low-cost equity exposure" },
          { category: "Gold ETF / SGB", example: "Nippon India Gold ETF", allocation: 5, reason: "Inflation hedge" },
        ]
      : f.risk === "medium"
      ? [
          { category: "Large Cap Index", example: "UTI Nifty 50 Index", allocation: 25, reason: "Core equity — market returns, low cost" },
          { category: "Flexi Cap Fund", example: "Parag Parikh Flexi Cap", allocation: 25, reason: "Diversified across market caps" },
          { category: "Debt — Short Duration", example: "Kotak Short Duration Fund", allocation: 25, reason: "Stable interest income" },
          { category: "Mid Cap Fund", example: "Axis Midcap Fund", allocation: 15, reason: "Higher growth potential" },
          { category: "Gold ETF / SGB", example: "SBI Gold ETF", allocation: 5, reason: "Portfolio hedge" },
        ]
      : [
          { category: "Small Cap Fund", example: "Quant Small Cap Fund", allocation: 25, reason: "High growth — hold 7+ years" },
          { category: "Mid Cap Fund", example: "Nippon India Mid Cap", allocation: 25, reason: "Strong long-term outperformer" },
          { category: "Large Cap Index", example: "Nifty 50 Index Fund", allocation: 25, reason: "Core stability anchor" },
          { category: "International Fund", example: "Mirae Asset NYSE FANG+", allocation: 15, reason: "Global diversification" },
          { category: "Sectoral / Thematic", example: "ICICI Pru Technology Fund", allocation: 10, reason: "High-conviction sector bets" },
        ];

  const suggestions: string[] = [
    `With a ${f.horizon}-year horizon and ${f.risk} risk, target ${alloc.equity}% in equity for optimal long-term growth.`,
    "Rebalance your portfolio every 12 months — when equity drifts >5% from target, bring it back.",
    "Use SIPs instead of lump sum to average out market volatility (rupee cost averaging).",
  ];

  const warnings: string[] = [];
  if (f.risk === "high" && f.horizon < 5) warnings.push("High-risk portfolio with less than 5 years is dangerous. Markets can be down 30–50% in short term.");
  if (f.risk === "low" && f.horizon > 10) warnings.push("For a 10+ year horizon, conservative allocation may underperform inflation significantly. Consider adding equity.");
  if (alloc.equity > 70 && f.amount > 5000000) warnings.push("Large equity-heavy portfolio — ensure you have 6–12 months expenses in liquid/debt as buffer.");

  return { equity: alloc.equity, debt: alloc.debt, liquid: alloc.liquid, gold: alloc.gold, equityAmount, debtAmount, liquidAmount, goldAmount, returnMin, returnMax, returnMid, corpus10yr, risk: f.risk as MFResult["risk"], suggestions, warnings, funds };
}

export default function MFXray() {
  const [formData, setFormData] = useState({ amount: 1000000, risk: "medium", horizon: 10 });
  const [result, setResult] = useState<MFResult | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "risk" ? value : Number(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setResult(null);
    setTimeout(() => {
      setResult(calcMFXray(formData));
      setIsPending(false);
    }, 1200);
  };

  return (
    <Layout>
      <PageHeader
        title="MF Portfolio X-Ray"
        description="Get a complete asset allocation blueprint and suggested fund list based on your risk profile."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Form ── */}
        <div className="lg:col-span-4">
          <Card className="p-6 sticky top-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Layers size={20} className="text-primary" /> Your Portfolio
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Total Investment Amount (₹)"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
              />
              <Select
                label="Risk Appetite"
                name="risk"
                value={formData.risk}
                onChange={handleChange}
                options={[
                  { value: "low", label: "Low — Preserve capital" },
                  { value: "medium", label: "Medium — Balanced growth" },
                  { value: "high", label: "High — Aggressive growth" },
                ]}
              />
              <Input
                label="Investment Horizon (years)"
                name="horizon"
                type="number"
                value={formData.horizon}
                onChange={handleChange}
              />
              <Button type="submit" className="w-full mt-2" isLoading={isPending}>
                Run X-Ray Analysis
              </Button>
            </form>
          </Card>
        </div>

        {/* ── Results ── */}
        <div className="lg:col-span-8 space-y-6">
          {!result && !isPending && (
            <Card className="p-12 text-center border-dashed border-2 min-h-[400px] flex flex-col items-center justify-center">
              <Layers size={48} className="text-muted-foreground mb-4 opacity-40" />
              <h3 className="text-xl font-bold mb-2">Ready to X-Ray your portfolio?</h3>
              <p className="text-muted-foreground">Enter your investment amount and risk level to get a complete asset allocation blueprint.</p>
            </Card>
          )}

          {isPending && (
            <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              <p className="text-muted-foreground animate-pulse font-medium">Analysing portfolio allocation…</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Warnings */}
              {result.warnings.length > 0 && (
                <Card className="p-5 border-l-4 border-l-warning bg-warning/5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-warning shrink-0 mt-0.5" size={20} />
                    <div className="space-y-1">
                      {result.warnings.map((w, i) => (
                        <p key={i} className="text-sm text-foreground font-medium">{w}</p>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              {/* KPI cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Equity", pct: result.equity, amount: result.equityAmount, color: "text-violet-600" },
                  { label: "Debt", pct: result.debt, amount: result.debtAmount, color: "text-emerald-600" },
                  { label: "Liquid", pct: result.liquid, amount: result.liquidAmount, color: "text-amber-600" },
                  { label: "Gold", pct: result.gold, amount: result.goldAmount, color: "text-rose-500" },
                ].map((item) => (
                  <Card key={item.label} className="p-4 text-center overflow-hidden">
                    <div className={`text-2xl font-extrabold ${item.color} mb-0.5`}>{item.pct}%</div>
                    <div className="text-sm font-semibold mb-1">{item.label}</div>
                    <div className="text-xs text-muted-foreground break-words">{formatINR(item.amount)}</div>
                  </Card>
                ))}
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4">Asset Allocation</h3>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Equity", value: result.equity },
                            { name: "Debt", value: result.debt },
                            { name: "Liquid", value: result.liquid },
                            { name: "Gold", value: result.gold },
                          ]}
                          dataKey="value" nameKey="name" cx="50%" cy="50%"
                          innerRadius={55} outerRadius={80} paddingAngle={4}
                        >
                          {COLORS.map((color, i) => <Cell key={i} fill={color} />)}
                        </Pie>
                        <Tooltip formatter={(v: number) => `${v}%`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-1">Expected Returns</h3>
                  <p className="text-sm text-muted-foreground mb-4">Based on {formData.risk} risk profile</p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-xl">
                      <span className="text-sm font-medium text-muted-foreground">Return Range</span>
                      <span className="font-bold text-lg">{result.returnMin}% – {result.returnMax}% CAGR</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-xl">
                      <span className="text-sm font-medium text-muted-foreground">Expected ({result.returnMid}% CAGR)</span>
                      <span className="font-bold text-lg text-success">{formatINR(result.corpus10yr)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-xl">
                      <span className="text-sm font-medium text-muted-foreground">Horizon</span>
                      <span className="font-bold">{formData.horizon} years</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-xl">
                      <span className="text-sm font-medium text-muted-foreground">Investment</span>
                      <span className="font-bold">{formatINR(formData.amount)}</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Fund suggestions */}
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <TrendingUp className="text-secondary" size={20} /> Suggested Funds
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg">Category</th>
                        <th className="px-4 py-3">Example Fund</th>
                        <th className="px-4 py-3">Allocation</th>
                        <th className="px-4 py-3 rounded-tr-lg">Why</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.funds.map((f, i) => (
                        <tr key={i} className="border-b last:border-0 border-border">
                          <td className="px-4 py-3 font-semibold text-foreground">{f.category}</td>
                          <td className="px-4 py-3 text-muted-foreground">{f.example}</td>
                          <td className="px-4 py-3 font-bold text-primary">{f.allocation}%</td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{f.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-4 italic">For illustration only. Consult a SEBI-registered advisor before investing.</p>
              </Card>

              {/* Suggestions */}
              <Card className="p-6 border-l-4 border-l-secondary">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <ShieldCheck className="text-secondary" /> Diversification Insights
                </h3>
                <ul className="space-y-3">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">{i + 1}</div>
                      <span className="text-muted-foreground text-sm leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
