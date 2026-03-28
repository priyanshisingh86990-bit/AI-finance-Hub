import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { PageHeader, Card, Input, Select, Button } from "@/components/ui-custom";
import { formatINR } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Target, TrendingUp, ShieldAlert, PiggyBank } from "lucide-react";

const COLORS = ['#1e293b', '#10b981', '#f59e0b', '#8b5cf6'];

interface FirePlanResult {
  targetCorpus: number;
  monthlyInvestmentRequired: number;
  projections: Array<{ age: number; portfolioValue: number }>;
  assetAllocation: { equity: number; debt: number; gold: number; realEstate: number };
  insuranceGaps: string[];
  emergencyFundTarget: number;
  taxSavingSuggestions: string[];
  aiInsights: string;
}

function calcFirePlan(f: {
  age: number; retirementAge: number; monthlyIncome: number; monthlyExpenses: number;
  existingInvestments: number; existingEPF: number; riskProfile: string;
}): FirePlanResult {
  const years = f.retirementAge - f.age;
  const annualExpenses = f.monthlyExpenses * 12;
  const targetCorpus = Math.round(annualExpenses * 25);

  const cagr = f.riskProfile === "aggressive" ? 0.13 : f.riskProfile === "moderate" ? 0.11 : 0.08;
  const monthlyRate = cagr / 12;
  const n = years * 12;

  const futureExisting = (f.existingInvestments + f.existingEPF) * Math.pow(1 + cagr, years);
  const remaining = Math.max(0, targetCorpus - futureExisting);
  const monthlyInvestmentRequired = remaining > 0
    ? Math.round(remaining * monthlyRate / (Math.pow(1 + monthlyRate, n) - 1))
    : 0;

  const projections: Array<{ age: number; portfolioValue: number }> = [];
  let portfolio = f.existingInvestments + f.existingEPF;
  for (let y = 0; y <= years; y++) {
    projections.push({ age: f.age + y, portfolioValue: Math.round(portfolio) });
    portfolio = (portfolio + monthlyInvestmentRequired * 12) * (1 + cagr);
  }

  const alloc = f.riskProfile === "aggressive"
    ? { equity: 70, debt: 15, gold: 10, realEstate: 5 }
    : f.riskProfile === "moderate"
    ? { equity: 55, debt: 30, gold: 10, realEstate: 5 }
    : { equity: 35, debt: 45, gold: 15, realEstate: 5 };

  const lifeReqd = f.monthlyIncome * 12 * 15;
  const insuranceGaps: string[] = [];
  if (lifeReqd > 5000000) insuranceGaps.push(`Increase life cover to at least ${formatINR(lifeReqd)} (15× annual income)`);
  if (f.monthlyExpenses * 12 > 600000) insuranceGaps.push("Consider a top-up health insurance plan of ₹10L–₹20L");
  insuranceGaps.push("Review critical illness and accidental disability coverage");

  const emergencyFundTarget = f.monthlyExpenses * 6;

  const taxSavingSuggestions = [
    "Maximise Section 80C (₹1.5L) via ELSS SIPs",
    "Contribute to NPS Tier-I for extra ₹50,000 (Section 80CCD(1B))",
    "Claim HRA if you pay rent",
    "If in new regime, opt for NPS employer contribution via employer",
  ];

  const savingsRate = Math.round(((f.monthlyIncome - f.monthlyExpenses) / f.monthlyIncome) * 100);
  const aiInsights = `You need to accumulate ${formatINR(targetCorpus)} to retire at ${f.retirementAge}. `
    + `With your current savings rate of ~${savingsRate}% and a ${f.riskProfile} portfolio (${cagr * 100}% CAGR), `
    + `a monthly SIP of ${formatINR(monthlyInvestmentRequired)} will get you there. `
    + `Your existing corpus of ${formatINR(f.existingInvestments + f.existingEPF)} gives you a strong head start — `
    + `it alone will grow to ${formatINR(Math.round(futureExisting))} by retirement. `
    + `Stay consistent, avoid withdrawals from your SIPs, and revisit this plan every year.`;

  return { targetCorpus, monthlyInvestmentRequired, projections, assetAllocation: alloc, insuranceGaps, emergencyFundTarget, taxSavingSuggestions, aiInsights };
}

export default function FirePlanner() {
  const [formData, setFormData] = useState({
    age: 30,
    retirementAge: 55,
    monthlyIncome: 150000,
    monthlyExpenses: 80000,
    existingInvestments: 1500000,
    existingEPF: 500000,
    riskProfile: "aggressive",
  });

  const [result, setResult] = useState<FirePlanResult | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setResult(null);
    setTimeout(() => {
      setResult(calcFirePlan(formData));
      setIsPending(false);
    }, 1400);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "riskProfile" ? value : Number(value)
    }));
  };

  return (
    <Layout>
      <PageHeader
        title="FIRE Path Planner"
        description="Discover your Financial Independence, Retire Early (FIRE) number and the exact SIPs needed to get there."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <Card className="p-6 sticky top-8">
            <h3 className="text-xl font-bold mb-6">Your Details</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Current Age" name="age" type="number" value={formData.age} onChange={handleChange} required />
                <Input label="Target Retirement Age" name="retirementAge" type="number" value={formData.retirementAge} onChange={handleChange} required />
              </div>
              <Input label="Monthly Income (₹)" name="monthlyIncome" type="number" value={formData.monthlyIncome} onChange={handleChange} required />
              <Input label="Monthly Expenses (₹)" name="monthlyExpenses" type="number" value={formData.monthlyExpenses} onChange={handleChange} required />
              <Input label="Current Investments (₹)" name="existingInvestments" type="number" value={formData.existingInvestments} onChange={handleChange} required />
              <Input label="Current EPF Balance (₹)" name="existingEPF" type="number" value={formData.existingEPF} onChange={handleChange} />
              <Select
                label="Risk Profile"
                name="riskProfile"
                value={formData.riskProfile}
                onChange={handleChange}
                options={[
                  { value: "conservative", label: "Conservative (FDs, Debt)" },
                  { value: "moderate", label: "Moderate (Balanced)" },
                  { value: "aggressive", label: "Aggressive (High Equity)" }
                ]}
              />
              <Button type="submit" className="w-full mt-4" isLoading={isPending}>
                Generate My FIRE Plan
              </Button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-8">
          {!result && !isPending && (
            <Card className="p-12 text-center flex flex-col items-center justify-center min-h-[400px] border-dashed border-2">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <Target size={40} className="text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Ready to plan your future?</h3>
              <p className="text-muted-foreground max-w-md">Fill in your details on the left and we'll calculate your exact path to financial freedom.</p>
            </Card>
          )}

          {isPending && (
            <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-muted-foreground font-medium animate-pulse">Calculating your FIRE plan…</p>
            </div>
          )}

          {result && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6 bg-primary text-white border-none shadow-xl shadow-primary/20">
                  <div className="flex items-center gap-3 mb-2 opacity-80">
                    <Target size={20} />
                    <span className="font-semibold">Target FIRE Corpus</span>
                  </div>
                  <div className="text-4xl font-display font-bold">{formatINR(result.targetCorpus)}</div>
                </Card>
                <Card className="p-6 bg-secondary text-white border-none shadow-xl shadow-secondary/20">
                  <div className="flex items-center gap-3 mb-2 opacity-80">
                    <TrendingUp size={20} />
                    <span className="font-semibold">Required Monthly SIP</span>
                  </div>
                  <div className="text-4xl font-display font-bold">{formatINR(result.monthlyInvestmentRequired)}</div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-6">Portfolio Projection</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={result.projections} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="age" tickFormatter={(v) => `Age ${v}`} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                        <YAxis tickFormatter={(v) => `₹${(v / 10000000).toFixed(1)}Cr`} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip formatter={(value: number) => formatINR(value)} labelFormatter={(label) => `Age: ${label}`} />
                        <Area type="monotone" dataKey="portfolioValue" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorPv)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-2">Ideal Asset Allocation</h3>
                  <div className="h-[250px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Equity', value: result.assetAllocation.equity },
                            { name: 'Debt', value: result.assetAllocation.debt },
                            { name: 'Gold', value: result.assetAllocation.gold },
                            { name: 'Real Estate', value: result.assetAllocation.realEstate },
                          ]}
                          innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                        >
                          {COLORS.map((color, index) => <Cell key={`cell-${index}`} fill={color} />)}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                      <span className="text-3xl font-bold">{result.assetAllocation.equity}%</span>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Equity</span>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 border-l-4 border-l-warning bg-warning/5">
                  <div className="flex items-start gap-3 mb-4">
                    <ShieldAlert className="text-warning shrink-0" />
                    <h3 className="font-bold text-lg">Insurance Gaps</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-foreground/80 list-disc pl-9">
                    {result.insuranceGaps.map((gap, i) => <li key={i}>{gap}</li>)}
                  </ul>
                </Card>

                <Card className="p-6 border-l-4 border-l-success bg-success/5">
                  <div className="flex items-start gap-3 mb-4">
                    <PiggyBank className="text-success shrink-0" />
                    <h3 className="font-bold text-lg">Tax & Emergency</h3>
                  </div>
                  <div className="space-y-4 text-sm text-foreground/80">
                    <div>
                      <span className="font-semibold block mb-1">Emergency Fund Target:</span>
                      <span className="text-xl font-bold text-foreground">{formatINR(result.emergencyFundTarget)}</span>
                    </div>
                    <ul className="list-disc pl-5">
                      {result.taxSavingSuggestions.map((sug, i) => <li key={i}>{sug}</li>)}
                    </ul>
                  </div>
                </Card>
              </div>

              <Card className="p-6 bg-slate-50 border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">AI INSIGHT</span>
                  <h3 className="font-bold text-lg">Mentor's Note</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{result.aiInsights}</p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
