import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { PageHeader, Card, Input, Button } from "@/components/ui-custom";
import { formatINR } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Heart, Users, PiggyBank, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

const COLORS = ["#10b981", "#6366f1", "#f59e0b"];

interface CouplePlanResult {
  combinedIncome: number;
  combinedExpenses: number;
  totalSavings: number;
  savingsRate: number;
  needs: number;
  investments: number;
  savings50: number;
  p1Contribution: number;
  p2Contribution: number;
  suggestions: string[];
  allocationData: Array<{ name: string; value: number }>;
  comparisonData: Array<{ label: string; partner1: number; partner2: number }>;
}

function calcCouple(f: {
  p1Income: number; p1Expenses: number;
  p2Income: number; p2Expenses: number;
}): CouplePlanResult {
  const combinedIncome = f.p1Income + f.p2Income;
  const combinedExpenses = f.p1Expenses + f.p2Expenses;
  const totalSavings = Math.max(0, combinedIncome - combinedExpenses);
  const savingsRate = combinedIncome > 0 ? (totalSavings / combinedIncome) * 100 : 0;

  const needs = Math.round(combinedIncome * 0.5);
  const investments = Math.round(combinedIncome * 0.3);
  const savings50 = Math.round(combinedIncome * 0.2);

  const p1Share = combinedIncome > 0 ? f.p1Income / combinedIncome : 0.5;
  const p2Share = 1 - p1Share;
  const p1Contribution = Math.round(combinedExpenses * p1Share);
  const p2Contribution = Math.round(combinedExpenses * p2Share);

  const suggestions: string[] = [];
  if (Math.abs(p1Share - p2Share) > 0.2) {
    const higher = f.p1Income > f.p2Income ? "Partner 1" : "Partner 2";
    suggestions.push(
      `${higher} earns significantly more. Consider proportional expense splitting — higher earner covers a larger share of shared costs.`
    );
  }
  suggestions.push(
    `Build a joint emergency fund of ${formatINR((f.p1Expenses + f.p2Expenses) * 6)} (6 months of combined expenses).`
  );
  if (savingsRate < 20) {
    suggestions.push("Combined savings rate is below 20%. Automate savings on the 1st of every month before spending.");
  }
  if (totalSavings > 0) {
    suggestions.push(
      `Start a joint SIP of ${formatINR(Math.round(totalSavings * 0.5))} in a balanced fund for shared goals (home, travel, children).`
    );
  }

  const allocationData = [
    { name: "Needs (50%)", value: needs },
    { name: "Investments (30%)", value: investments },
    { name: "Savings (20%)", value: savings50 },
  ];

  const comparisonData = [
    { label: "Income", partner1: f.p1Income, partner2: f.p2Income },
    { label: "Expenses", partner1: f.p1Expenses, partner2: f.p2Expenses },
    { label: "Net Surplus", partner1: Math.max(0, f.p1Income - f.p1Expenses), partner2: Math.max(0, f.p2Income - f.p2Expenses) },
  ];

  return { combinedIncome, combinedExpenses, totalSavings, savingsRate, needs, investments, savings50, p1Contribution, p2Contribution, suggestions, allocationData, comparisonData };
}

export default function CouplePlanner() {
  const [formData, setFormData] = useState({
    p1Income: 120000,
    p1Expenses: 60000,
    p2Income: 80000,
    p2Expenses: 45000,
  });
  const [result, setResult] = useState<CouplePlanResult | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: Number(e.target.value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setResult(null);
    setTimeout(() => {
      setResult(calcCouple(formData));
      setIsPending(false);
    }, 1100);
  };

  return (
    <Layout>
      <PageHeader
        title="Couple Finance Planner"
        description="Plan your finances together. Understand combined income, shared expenses, and joint goals."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Form ── */}
        <div className="lg:col-span-4">
          <Card className="p-6 sticky top-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Heart size={20} className="text-rose-500" /> Your Details
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Partner 1 */}
              <div className="p-4 bg-muted/50 rounded-xl space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">1</div>
                  <span className="font-semibold text-sm">Partner 1</span>
                </div>
                <Input label="Monthly Income (₹)" name="p1Income" type="number" value={formData.p1Income} onChange={handleChange} />
                <Input label="Monthly Expenses (₹)" name="p1Expenses" type="number" value={formData.p1Expenses} onChange={handleChange} />
              </div>

              {/* Partner 2 */}
              <div className="p-4 bg-muted/50 rounded-xl space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold">2</div>
                  <span className="font-semibold text-sm">Partner 2</span>
                </div>
                <Input label="Monthly Income (₹)" name="p2Income" type="number" value={formData.p2Income} onChange={handleChange} />
                <Input label="Monthly Expenses (₹)" name="p2Expenses" type="number" value={formData.p2Expenses} onChange={handleChange} />
              </div>

              <Button type="submit" className="w-full" isLoading={isPending}>
                Plan Together
              </Button>
            </form>
          </Card>
        </div>

        {/* ── Results ── */}
        <div className="lg:col-span-8 space-y-6">
          {!result && !isPending && (
            <Card className="p-12 text-center border-dashed border-2 min-h-[400px] flex flex-col items-center justify-center">
              <Users size={48} className="text-muted-foreground mb-4 opacity-40" />
              <h3 className="text-xl font-bold mb-2">Plan your finances as a team</h3>
              <p className="text-muted-foreground">Enter both partners' income and expenses to get a joint financial plan.</p>
            </Card>
          )}

          {isPending && (
            <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              <p className="text-muted-foreground animate-pulse font-medium">Building your joint plan…</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-5 bg-primary text-white border-none">
                  <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1">Combined Income</p>
                  <p className="text-2xl font-bold">{formatINR(result.combinedIncome)}</p>
                  <p className="text-xs opacity-60 mt-1">per month</p>
                </Card>
                <Card className="p-5 border-l-4 border-l-destructive">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Combined Expenses</p>
                  <p className="text-2xl font-bold text-foreground">{formatINR(result.combinedExpenses)}</p>
                </Card>
                <Card className="p-5 border-l-4 border-l-success">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Monthly Savings</p>
                  <p className="text-2xl font-bold text-success">{formatINR(result.totalSavings)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Rate: {result.savingsRate.toFixed(1)}%</p>
                </Card>
              </div>

              {/* 50/30/20 allocation */}
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-1">Suggested Allocation (50/30/20 Rule)</h3>
                <p className="text-sm text-muted-foreground mb-5">Based on your combined income of {formatINR(result.combinedIncome)}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "Needs", pct: "50%", amount: result.needs, color: "bg-emerald-500", desc: "Rent, food, utilities, EMIs" },
                    { label: "Investments", pct: "30%", amount: result.investments, color: "bg-violet-500", desc: "Mutual funds, NPS, stocks" },
                    { label: "Savings", pct: "20%", amount: result.savings50, color: "bg-amber-500", desc: "Emergency fund, goals" },
                  ].map((item) => (
                    <div key={item.label} className="p-4 rounded-xl bg-muted/50 border border-border">
                      <div className={`w-3 h-3 rounded-full ${item.color} mb-2`} />
                      <div className="text-lg font-bold">{item.pct}</div>
                      <div className="text-sm font-semibold mb-0.5">{item.label}</div>
                      <div className="text-base font-bold text-foreground">{formatINR(item.amount)}</div>
                      <div className="text-xs text-muted-foreground mt-1">{item.desc}</div>
                    </div>
                  ))}
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={result.allocationData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} paddingAngle={4}>
                        {result.allocationData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => formatINR(v)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Partner comparison */}
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-2">Partner Comparison</h3>
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Partner 1</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-violet-500 inline-block" /> Partner 2</span>
                </div>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={result.comparisonData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="label" fontSize={12} tickLine={false} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} fontSize={11} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip formatter={(v: number) => formatINR(v)} />
                      <Bar dataKey="partner1" name="Partner 1" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="partner2" name="Partner 2" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Proportional contribution */}
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <PiggyBank className="text-secondary" /> Proportional Expense Split
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Based on income ratio — Partner 1: {((formData.p1Income / result.combinedIncome) * 100).toFixed(0)}%, Partner 2: {((formData.p2Income / result.combinedIncome) * 100).toFixed(0)}%
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Partner 1 Contribution", amount: result.p1Contribution, color: "border-l-emerald-500" },
                    { label: "Partner 2 Contribution", amount: result.p2Contribution, color: "border-l-violet-500" },
                  ].map((item) => (
                    <div key={item.label} className={`p-4 rounded-xl border border-border border-l-4 ${item.color} bg-muted/30`}>
                      <div className="text-xs text-muted-foreground font-semibold mb-1">{item.label}</div>
                      <div className="text-xl font-bold">{formatINR(item.amount)}</div>
                      <div className="text-xs text-muted-foreground">of shared expenses</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Suggestions */}
              <Card className="p-6 border-l-4 border-l-secondary">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <TrendingUp className="text-secondary" /> Joint Finance Suggestions
                </h3>
                <ul className="space-y-3">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
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
