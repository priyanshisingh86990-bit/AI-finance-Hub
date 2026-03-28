import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { PageHeader, Card, Input, Button } from "@/components/ui-custom";
import { formatINR } from "@/lib/utils";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const PIE_COLORS = ["#f43f5e", "#f59e0b", "#6366f1", "#14b8a6"];

interface InsightsResult {
  totalExpenses: number;
  savings: number;
  savingsRate: number;
  expenseRatio: number;
  pieData: Array<{ name: string; value: number }>;
  barData: Array<{ category: string; amount: number }>;
  suggestions: string[];
  status: "overspending" | "good" | "okay";
}

function calcInsights(f: {
  income: number; food: number; rent: number; travel: number; others: number;
}): InsightsResult {
  const totalExpenses = f.food + f.rent + f.travel + f.others;
  const savings = Math.max(0, f.income - totalExpenses);
  const savingsRate = f.income > 0 ? (savings / f.income) * 100 : 0;
  const expenseRatio = f.income > 0 ? (totalExpenses / f.income) * 100 : 0;

  const pieData = [
    { name: "Food", value: f.food },
    { name: "Rent", value: f.rent },
    { name: "Travel", value: f.travel },
    { name: "Others", value: f.others },
  ].filter((d) => d.value > 0);

  const barData = [
    { category: "Food", amount: f.food },
    { category: "Rent", amount: f.rent },
    { category: "Travel", amount: f.travel },
    { category: "Others", amount: f.others },
    { category: "Savings", amount: savings },
  ].filter((d) => d.amount > 0);

  const suggestions: string[] = [];
  if (f.food / f.income > 0.3)
    suggestions.push("Food expenses exceed 30% of income. Meal-prepping and cooking at home can cut this by 40%.");
  if (f.rent / f.income > 0.4)
    suggestions.push("Rent is above 40% of income — the recommended ceiling is 30%. Consider splitting costs or relocating.");
  if (f.travel / f.income > 0.15)
    suggestions.push("Travel spend is high. Switching to a monthly pass or carpooling could save ₹2,000–5,000/month.");
  if (savingsRate < 10)
    suggestions.push("Your savings rate is below 10%. Even automating ₹2,000/month into a liquid fund builds a powerful habit.");
  if (savingsRate >= 30)
    suggestions.push("Great savings rate! Put your surplus into SIPs — even ₹5,000/month grows to ₹1Cr in 20 years at 12% CAGR.");
  if (suggestions.length === 0)
    suggestions.push("Your spending pattern looks balanced. Consider stepping up SIP contributions by 10% this year.");

  const status: InsightsResult["status"] =
    expenseRatio > 70 ? "overspending" : savingsRate >= 30 ? "good" : "okay";

  return { totalExpenses, savings, savingsRate, expenseRatio, pieData, barData, suggestions, status };
}

export default function Insights() {
  const [formData, setFormData] = useState({
    income: 120000,
    food: 15000,
    rent: 30000,
    travel: 8000,
    others: 12000,
  });
  const [result, setResult] = useState<InsightsResult | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: Number(e.target.value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setResult(null);
    setTimeout(() => {
      setResult(calcInsights(formData));
      setIsPending(false);
    }, 1000);
  };

  return (
    <Layout>
      <PageHeader
        title="Financial Insights"
        description="Break down your monthly spending and discover where your money is really going."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Form ── */}
        <div className="lg:col-span-4">
          <Card className="p-6 sticky top-8">
            <h3 className="text-xl font-bold mb-6">Monthly Breakdown</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Monthly Income (₹)" name="income" type="number" value={formData.income} onChange={handleChange} required />
              <div className="border-t pt-4">
                <p className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Expenses</p>
                <div className="space-y-3">
                  <Input label="Food & Groceries (₹)" name="food" type="number" value={formData.food} onChange={handleChange} />
                  <Input label="Rent / EMI (₹)" name="rent" type="number" value={formData.rent} onChange={handleChange} />
                  <Input label="Travel & Commute (₹)" name="travel" type="number" value={formData.travel} onChange={handleChange} />
                  <Input label="Others (₹)" name="others" type="number" value={formData.others} onChange={handleChange} />
                </div>
              </div>
              <Button type="submit" className="w-full mt-2" isLoading={isPending}>
                Analyse My Spending
              </Button>
            </form>
          </Card>
        </div>

        {/* ── Results ── */}
        <div className="lg:col-span-8 space-y-6">
          {!result && !isPending && (
            <Card className="p-12 text-center border-dashed border-2 min-h-[400px] flex flex-col items-center justify-center">
              <TrendingUp size={48} className="text-muted-foreground mb-4 opacity-40" />
              <h3 className="text-xl font-bold mb-2">Ready for your spending analysis?</h3>
              <p className="text-muted-foreground">Enter your income and expense details to see where every rupee goes.</p>
            </Card>
          )}

          {isPending && (
            <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              <p className="text-muted-foreground animate-pulse font-medium">Analysing your spending…</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Status banner */}
              <Card className={cn(
                "p-5 flex items-center gap-4 border-l-4",
                result.status === "overspending" ? "border-l-destructive bg-destructive/5" :
                result.status === "good" ? "border-l-success bg-success/5" :
                "border-l-warning bg-warning/5"
              )}>
                {result.status === "overspending" ? (
                  <AlertTriangle className="text-destructive shrink-0" size={24} />
                ) : result.status === "good" ? (
                  <CheckCircle2 className="text-success shrink-0" size={24} />
                ) : (
                  <TrendingUp className="text-warning shrink-0" size={24} />
                )}
                <div>
                  <p className="font-bold text-foreground">
                    {result.status === "overspending"
                      ? "You are overspending — expenses exceed 70% of income"
                      : result.status === "good"
                      ? "Good financial discipline — savings rate above 30%!"
                      : "You're doing okay — room to improve savings"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Expenses: {result.expenseRatio.toFixed(1)}% of income · Savings rate: {result.savingsRate.toFixed(1)}%
                  </p>
                </div>
              </Card>

              {/* KPI cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Monthly Income</p>
                  <p className="text-2xl font-bold text-foreground">{formatINR(formData.income)}</p>
                </Card>
                <Card className="p-5 border-l-4 border-l-destructive">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Total Expenses</p>
                  <p className="text-2xl font-bold text-destructive">{formatINR(result.totalExpenses)}</p>
                </Card>
                <Card className="p-5 border-l-4 border-l-success">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Monthly Savings</p>
                  <p className="text-2xl font-bold text-success">{formatINR(result.savings)}</p>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4">Expense Distribution</h3>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={result.pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} paddingAngle={3}>
                          {result.pieData.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number) => formatINR(v)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4">Spending Overview</h3>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={result.barData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="category" fontSize={11} tickLine={false} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} fontSize={11} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip formatter={(v: number) => formatINR(v)} />
                        <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              {/* Smart suggestions */}
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Lightbulb className="text-amber-500" size={20} /> Smart Suggestions
                </h3>
                <ul className="space-y-3">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">{i + 1}</div>
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
