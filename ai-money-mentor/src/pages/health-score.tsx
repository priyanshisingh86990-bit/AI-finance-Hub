import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { PageHeader, Card, Input, Button } from "@/components/ui-custom";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { ShieldCheck, HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

interface HealthScoreResult {
  grade: string;
  overallScore: number;
  dimensions: { [key: string]: number };
  recommendations: string[];
  aiInsights: string;
}

function calcScore(score: number, max: number): number {
  return Math.min(100, Math.round((score / max) * 100));
}

function calcHealthScore(f: {
  monthlyIncome: number; monthlyExpenses: number; emergencyFundMonths: number;
  lifeInsuranceCover: number; healthInsuranceCover: number; monthlyEMI: number;
  totalDebt: number; taxFiledOnTime: boolean; hasWill: boolean;
  retirementSavingsMonthly: number; age: number;
}): HealthScoreResult {
  const savingsRate = (f.monthlyIncome - f.monthlyExpenses - f.monthlyEMI) / f.monthlyIncome;

  const emergencyScore = Math.min(100, Math.round((f.emergencyFundMonths / 6) * 100));

  const idealLifeCover = f.monthlyIncome * 12 * 10;
  const insuranceScore = Math.min(100, Math.round(
    ((Math.min(f.lifeInsuranceCover, idealLifeCover) / idealLifeCover) * 60) +
    ((f.healthInsuranceCover >= 500000 ? 1 : f.healthInsuranceCover / 500000) * 40)
  ));

  const sipScore = Math.min(100, Math.round((f.retirementSavingsMonthly / (f.monthlyIncome * 0.2)) * 100));

  const emiRatio = f.monthlyEMI / f.monthlyIncome;
  const debtScore = Math.round(emiRatio <= 0.1 ? 100 : emiRatio <= 0.2 ? 80 : emiRatio <= 0.35 ? 55 : emiRatio <= 0.5 ? 30 : 10);

  const taxScore = f.taxFiledOnTime ? 85 : 40;

  const retirementScore = Math.min(100, Math.round(
    (f.retirementSavingsMonthly / f.monthlyIncome) * 100 * 5 +
    (f.hasWill ? 20 : 0) +
    (f.age < 35 ? 10 : 0)
  ));

  const dimensions = {
    emergencyFund: emergencyScore,
    insurance: insuranceScore,
    investments: sipScore,
    debtManagement: debtScore,
    taxCompliance: taxScore,
    retirementReadiness: retirementScore,
  };

  const overallScore = Math.round(
    Object.values(dimensions).reduce((a, b) => a + b, 0) / Object.keys(dimensions).length
  );

  const grade =
    overallScore >= 85 ? "A+" :
    overallScore >= 75 ? "A" :
    overallScore >= 65 ? "B+" :
    overallScore >= 55 ? "B" :
    overallScore >= 45 ? "C" : "D";

  const recommendations: string[] = [];
  if (emergencyScore < 60) recommendations.push(`Build emergency fund to 6 months of expenses (₹${(f.monthlyExpenses * 6).toLocaleString("en-IN")})`);
  if (insuranceScore < 60) recommendations.push(`Increase life cover to ₹${(idealLifeCover / 100000).toFixed(0)}L (10× annual income)`);
  if (sipScore < 60) recommendations.push("Increase monthly SIP — aim for 20% of income towards investments");
  if (debtScore < 50) recommendations.push("High EMI burden detected. Consider prepaying high-interest debt first");
  if (!f.taxFiledOnTime) recommendations.push("File ITR on time to avoid penalties and claim refunds");
  if (!f.hasWill) recommendations.push("Draft a Will to ensure smooth asset transfer to nominees");
  if (recommendations.length === 0) recommendations.push("Excellent financial health! Continue your current habits and review annually.");

  const aiInsights = `Your overall financial health score is ${overallScore}/100 — Grade ${grade}. `
    + (overallScore >= 75
      ? "You're in great shape. Your strongest area is "
      : overallScore >= 55
      ? "There's room to improve. Focus on "
      : "Immediate attention needed in ")
    + Object.entries(dimensions).sort((a, b) => (overallScore >= 55 ? b[1] - a[1] : a[1] - b[1]))[0][0].replace(/([A-Z])/g, ' $1')
    + `. With consistent effort over the next 12 months, you can realistically reach a score of ${Math.min(100, overallScore + 15)}+.`;

  return { grade, overallScore, dimensions, recommendations, aiInsights };
}

export default function HealthScore() {
  const [formData, setFormData] = useState({
    monthlyIncome: 120000,
    monthlyExpenses: 60000,
    emergencyFundMonths: 3,
    lifeInsuranceCover: 5000000,
    healthInsuranceCover: 500000,
    monthlyEMI: 25000,
    totalDebt: 1500000,
    taxFiledOnTime: true,
    hasWill: false,
    retirementSavingsMonthly: 15000,
    age: 32,
  });

  const [result, setResult] = useState<HealthScoreResult | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setResult(null);
    setTimeout(() => {
      setResult(calcHealthScore(formData));
      setIsPending(false);
    }, 1400);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : Number(value)
    }));
  };

  return (
    <Layout>
      <PageHeader
        title="Money Health Score"
        description="A 360° checkup of your finances. Discover your blind spots and get actionable advice."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <HeartPulse className="text-destructive" /> Financial Vitals
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Monthly Income (₹)" name="monthlyIncome" type="number" value={formData.monthlyIncome} onChange={handleChange} />
                <Input label="Monthly Expenses (₹)" name="monthlyExpenses" type="number" value={formData.monthlyExpenses} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Total Debt (₹)" name="totalDebt" type="number" value={formData.totalDebt} onChange={handleChange} />
                <Input label="Monthly EMI (₹)" name="monthlyEMI" type="number" value={formData.monthlyEMI} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Life Cover (₹)" name="lifeInsuranceCover" type="number" value={formData.lifeInsuranceCover} onChange={handleChange} />
                <Input label="Health Cover (₹)" name="healthInsuranceCover" type="number" value={formData.healthInsuranceCover} onChange={handleChange} />
              </div>

              <Input label="Emergency Fund (Months)" name="emergencyFundMonths" type="number" value={formData.emergencyFundMonths} onChange={handleChange} />
              <Input label="Monthly Retirement Saving (₹)" name="retirementSavingsMonthly" type="number" value={formData.retirementSavingsMonthly} onChange={handleChange} />

              <div className="pt-2 space-y-3 border-t">
                <label className="flex items-center gap-3 p-3 border rounded-xl hover:bg-muted cursor-pointer transition-colors">
                  <input type="checkbox" name="taxFiledOnTime" checked={formData.taxFiledOnTime} onChange={handleChange} className="w-5 h-5 accent-primary rounded" />
                  <span className="font-medium">I file my taxes on time</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-xl hover:bg-muted cursor-pointer transition-colors">
                  <input type="checkbox" name="hasWill" checked={formData.hasWill} onChange={handleChange} className="w-5 h-5 accent-primary rounded" />
                  <span className="font-medium">I have a registered will</span>
                </label>
              </div>

              <Button type="submit" className="w-full" size="lg" isLoading={isPending}>
                Calculate My Score
              </Button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-7">
          {!result && !isPending && (
            <div className="h-full flex items-center justify-center p-8 bg-muted/30 rounded-3xl border-2 border-dashed border-border">
              <p className="text-lg text-muted-foreground">Fill your vitals to generate your health score.</p>
            </div>
          )}

          {isPending && (
            <div className="h-full flex flex-col items-center justify-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-muted-foreground font-medium animate-pulse">Analysing your financial health…</p>
            </div>
          )}

          {result && (
            <div className="animate-in fade-in duration-500 space-y-6">
              <Card className="p-8 relative overflow-hidden bg-gradient-to-br from-primary to-slate-900 text-white border-none shadow-2xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                  <div className="flex-1">
                    <h2 className="text-3xl font-display font-bold mb-2">Health Grade: {result.grade}</h2>
                    <p className="text-white/80 mb-6 max-w-md">
                      {result.overallScore >= 80 ? "Excellent shape! Keep optimising." :
                        result.overallScore >= 60 ? "Good, but there are clear areas for improvement." :
                          "Critical attention needed in your financial setup."}
                    </p>
                    <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                      <span className="text-sm uppercase tracking-wider font-semibold text-white/70">Overall Score</span>
                      <span className="text-2xl font-bold">{result.overallScore}/100</span>
                    </div>
                  </div>

                  <div className="w-48 h-48 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        cx="50%" cy="50%"
                        innerRadius="80%" outerRadius="100%"
                        barSize={15}
                        data={[{ name: 'Score', value: result.overallScore, fill: '#10b981' }]}
                        startAngle={180} endAngle={0}
                      >
                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                        <RadialBar background={{ fill: 'rgba(255,255,255,0.1)' }} dataKey="value" cornerRadius={10} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-16 text-center">
                      <span className="text-5xl font-display font-bold">{result.overallScore}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(result.dimensions).map(([key, value]) => (
                  <Card key={key} className="p-5 flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-sm capitalize text-muted-foreground">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className={cn(
                        "font-bold",
                        value >= 80 ? "text-success" : value >= 50 ? "text-warning" : "text-destructive"
                      )}>{value}/100</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          value >= 80 ? "bg-success" : value >= 50 ? "bg-warning" : "bg-destructive"
                        )}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="p-6 border-l-4 border-l-secondary">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <ShieldCheck className="text-secondary" /> Action Plan
                </h3>
                <ul className="space-y-3">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <div className="w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0 font-bold text-sm mt-0.5">{i + 1}</div>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </Card>

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
