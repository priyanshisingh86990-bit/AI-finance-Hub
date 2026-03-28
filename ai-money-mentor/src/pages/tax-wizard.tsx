import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { PageHeader, Card, Input, Select, Button } from "@/components/ui-custom";
import { formatINR } from "@/lib/utils";
import { CheckCircle2, AlertCircle, TrendingDown, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

interface MissingDeduction {
  section: string;
  description: string;
  maxLimit: number;
  currentUsed: number;
  potentialSaving: number;
}

interface TaxResult {
  recommendedRegime: "old" | "new";
  savings: number;
  oldRegimeTax: number;
  newRegimeTax: number;
  oldRegimeDeductions: number;
  missingDeductions: MissingDeduction[];
  aiInsights: string;
}

function applyOldSlabs(taxableIncome: number, age: number): number {
  const basic = age >= 80 ? 500000 : age >= 60 ? 300000 : 250000;
  if (taxableIncome <= basic) return 0;
  let tax = 0;
  const bands = [
    { from: basic, to: 500000, rate: 0.05 },
    { from: 500000, to: 1000000, rate: 0.20 },
    { from: 1000000, to: Infinity, rate: 0.30 },
  ];
  for (const b of bands) {
    if (taxableIncome > b.from) {
      tax += Math.min(taxableIncome, b.to) * b.rate - b.from * b.rate;
    }
  }
  return Math.round(tax * 1.04);
}

function applyNewSlabs(taxableIncome: number): number {
  const slabs = [
    { from: 0, to: 300000, rate: 0 },
    { from: 300000, to: 700000, rate: 0.05 },
    { from: 700000, to: 1000000, rate: 0.10 },
    { from: 1000000, to: 1200000, rate: 0.15 },
    { from: 1200000, to: 1500000, rate: 0.20 },
    { from: 1500000, to: Infinity, rate: 0.30 },
  ];
  let tax = 0;
  for (const s of slabs) {
    if (taxableIncome > s.from) {
      tax += (Math.min(taxableIncome, s.to) - s.from) * s.rate;
    }
  }
  return Math.round(tax * 1.04);
}

function calcHRA(basicSalary: number, hraReceived: number, rentPaid: number, isMetro: boolean): number {
  const rentMinusPercent = Math.max(0, rentPaid - (isMetro ? 0.5 : 0.4) * basicSalary);
  return Math.min(hraReceived, rentMinusPercent, isMetro ? 0.5 * basicSalary : 0.4 * basicSalary);
}

function calcTax(f: {
  annualIncome: number; basicSalary: number; hraReceived: number; rentPaid: number;
  cityType: string; section80C: number; section80D: number; section80CCD: number;
  homeLoanInterest: number; otherDeductions: number; age: number;
}): TaxResult {
  const stdDeductionOld = 50000;
  const stdDeductionNew = 75000;
  const isMetro = f.cityType === "metro";

  const hraExemption = calcHRA(f.basicSalary, f.hraReceived, f.rentPaid, isMetro);
  const grossAfterHRA = f.annualIncome - hraExemption;

  const deductions80C = Math.min(f.section80C, 150000);
  const deductions80D = Math.min(f.section80D, 25000);
  const deductions80CCD = Math.min(f.section80CCD, 50000);
  const homeLoanDeduction = Math.min(f.homeLoanInterest, 200000);

  const totalOldDeductions = stdDeductionOld + deductions80C + deductions80D + deductions80CCD + homeLoanDeduction + f.otherDeductions;
  const oldRegimeDeductions = totalOldDeductions + hraExemption;
  const oldTaxableIncome = Math.max(0, f.annualIncome - oldRegimeDeductions);
  const oldRegimeTax = applyOldSlabs(oldTaxableIncome, f.age);

  const newTaxableIncome = Math.max(0, f.annualIncome - stdDeductionNew);
  const newRegimeTax = applyNewSlabs(newTaxableIncome);

  const recommendedRegime: "old" | "new" = oldRegimeTax <= newRegimeTax ? "old" : "new";
  const savings = Math.abs(oldRegimeTax - newRegimeTax);

  const missingDeductions: MissingDeduction[] = [];

  const bracket = f.annualIncome > 1000000 ? 0.30 : f.annualIncome > 500000 ? 0.20 : 0.05;

  if (f.section80C < 150000) {
    missingDeductions.push({
      section: "80C", description: "EPF, ELSS, PPF, LIC, ULIP",
      maxLimit: 150000, currentUsed: f.section80C,
      potentialSaving: Math.round((150000 - f.section80C) * bracket),
    });
  }
  if (f.section80D < 25000) {
    missingDeductions.push({
      section: "80D", description: "Health Insurance Premium",
      maxLimit: 25000, currentUsed: f.section80D,
      potentialSaving: Math.round((25000 - f.section80D) * bracket),
    });
  }
  if (f.section80CCD < 50000) {
    missingDeductions.push({
      section: "80CCD(1B)", description: "NPS additional contribution",
      maxLimit: 50000, currentUsed: f.section80CCD,
      potentialSaving: Math.round((50000 - f.section80CCD) * bracket),
    });
  }
  if (f.homeLoanInterest === 0) {
    missingDeductions.push({
      section: "24(b)", description: "Home Loan Interest (if applicable)",
      maxLimit: 200000, currentUsed: 0,
      potentialSaving: Math.round(200000 * bracket),
    });
  }

  const betterRegime = recommendedRegime === "old" ? "Old Tax Regime" : "New Tax Regime";
  const aiInsights =
    `Based on your income of ${formatINR(f.annualIncome)}, the ${betterRegime} saves you ${formatINR(savings)} more in taxes. `
    + (recommendedRegime === "old"
      ? `Your deductions of ${formatINR(oldRegimeDeductions)} outweigh the simplified new slab benefit. `
      + `Maximise 80C (₹1.5L), NPS 80CCD(1B) (₹50K), and 80D (₹25K) before March 31st.`
      : `Even with all deductions, the new regime's lower slab rates work better for your income bracket. `
      + `Consider moving investments into corpus-building (NPS Tier-1, EPF top-up) instead of traditional tax-saving instruments.`);

  return { recommendedRegime, savings, oldRegimeTax, newRegimeTax, oldRegimeDeductions, missingDeductions, aiInsights };
}

export default function TaxWizard() {
  const [formData, setFormData] = useState({
    annualIncome: 1800000,
    basicSalary: 900000,
    hraReceived: 450000,
    rentPaid: 360000,
    cityType: "metro",
    section80C: 150000,
    section80D: 25000,
    section80CCD: 50000,
    homeLoanInterest: 0,
    otherDeductions: 0,
    age: 30,
  });

  const [result, setResult] = useState<TaxResult | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setResult(null);
    setTimeout(() => {
      setResult(calcTax(formData));
      setIsPending(false);
    }, 1200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "cityType" ? value : Number(value)
    }));
  };

  return (
    <Layout>
      <PageHeader
        title="Tax Wizard"
        description="Stop leaving money on the table. Compare regimes and discover hidden deductions."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <Card className="p-6 sticky top-8">
            <h3 className="text-xl font-bold mb-6">Income & Deductions</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Annual CTC (₹)" name="annualIncome" type="number" value={formData.annualIncome} onChange={handleChange} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Basic Salary (₹)" name="basicSalary" type="number" value={formData.basicSalary} onChange={handleChange} required />
                <Input label="Your Age" name="age" type="number" value={formData.age} onChange={handleChange} required />
              </div>

              <div className="p-4 bg-muted/50 rounded-xl space-y-4">
                <h4 className="font-semibold text-sm text-foreground">HRA Details</h4>
                <Input label="HRA Received (₹)" name="hraReceived" type="number" value={formData.hraReceived} onChange={handleChange} />
                <Input label="Annual Rent Paid (₹)" name="rentPaid" type="number" value={formData.rentPaid} onChange={handleChange} />
                <Select
                  label="City Type"
                  name="cityType"
                  value={formData.cityType}
                  onChange={handleChange}
                  options={[
                    { value: "metro", label: "Metro (50%)" },
                    { value: "non-metro", label: "Non-Metro (40%)" }
                  ]}
                />
              </div>

              <div className="p-4 bg-muted/50 rounded-xl space-y-4">
                <h4 className="font-semibold text-sm text-foreground">Current Investments</h4>
                <Input label="80C (EPF, ELSS, PPF)" name="section80C" type="number" value={formData.section80C} onChange={handleChange} />
                <Input label="80D (Health Ins.)" name="section80D" type="number" value={formData.section80D} onChange={handleChange} />
                <Input label="80CCD(1B) (NPS)" name="section80CCD" type="number" value={formData.section80CCD} onChange={handleChange} />
                <Input label="Home Loan Interest" name="homeLoanInterest" type="number" value={formData.homeLoanInterest} onChange={handleChange} />
              </div>

              <Button type="submit" className="w-full mt-2" size="lg" isLoading={isPending}>
                Analyze Tax Regimes
              </Button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-8">
          {!result && !isPending && (
            <div className="h-full flex items-center justify-center p-8 bg-muted/30 rounded-3xl border-2 border-dashed border-border min-h-[500px]">
              <div className="text-center">
                <Receipt className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-lg text-muted-foreground">Enter your salary details to see the magic.</p>
              </div>
            </div>
          )}

          {isPending && (
            <div className="h-full flex flex-col items-center justify-center min-h-[500px] gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-muted-foreground font-medium animate-pulse">Crunching the tax numbers…</p>
            </div>
          )}

          {result && (
            <div className="animate-in fade-in duration-500 space-y-6">
              <Card className="p-8 text-center bg-gradient-to-b from-card to-muted/30">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-success/10 text-success font-bold text-sm mb-4">
                  <CheckCircle2 size={16} /> Recommended
                </div>
                <h2 className="text-4xl font-display font-bold text-primary mb-2">
                  {result.recommendedRegime === 'new' ? 'New Tax Regime' : 'Old Tax Regime'}
                </h2>
                <p className="text-lg text-muted-foreground">
                  You save <span className="font-bold text-foreground">{formatINR(result.savings)}</span> by choosing this regime.
                </p>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className={cn(
                  "p-6 border-2 transition-all",
                  result.recommendedRegime === 'old' ? "border-primary shadow-lg" : "border-border/50 opacity-80"
                )}>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold">Old Regime</h3>
                      <p className="text-sm text-muted-foreground mt-1">With deductions</p>
                    </div>
                    {result.recommendedRegime === 'old' && <CheckCircle2 className="text-primary" />}
                  </div>
                  <div className="text-3xl font-display font-bold mb-2">{formatINR(result.oldRegimeTax)}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <TrendingDown size={14} /> Total Deductions: {formatINR(result.oldRegimeDeductions)}
                  </div>
                </Card>

                <Card className={cn(
                  "p-6 border-2 transition-all",
                  result.recommendedRegime === 'new' ? "border-primary shadow-lg" : "border-border/50 opacity-80"
                )}>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold">New Regime</h3>
                      <p className="text-sm text-muted-foreground mt-1">Zero deductions</p>
                    </div>
                    {result.recommendedRegime === 'new' && <CheckCircle2 className="text-primary" />}
                  </div>
                  <div className="text-3xl font-display font-bold mb-2">{formatINR(result.newRegimeTax)}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <TrendingDown size={14} /> Standard Deduction only
                  </div>
                </Card>
              </div>

              {result.missingDeductions.length > 0 && (
                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <AlertCircle className="text-warning" /> Missed Opportunities (Old Regime)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 rounded-tl-lg">Section</th>
                          <th className="px-4 py-3">Max Limit</th>
                          <th className="px-4 py-3">You Used</th>
                          <th className="px-4 py-3 rounded-tr-lg">Potential Saving*</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.missingDeductions.map((ded, i) => (
                          <tr key={i} className="border-b last:border-0 border-border">
                            <td className="px-4 py-4 font-medium text-foreground">{ded.section} <span className="block text-xs text-muted-foreground font-normal">{ded.description}</span></td>
                            <td className="px-4 py-4">{formatINR(ded.maxLimit)}</td>
                            <td className="px-4 py-4 text-warning font-semibold">{formatINR(ded.currentUsed)}</td>
                            <td className="px-4 py-4 text-success font-bold">{formatINR(ded.potentialSaving)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 italic">*Estimated tax saving if you maximise this section in your tax bracket.</p>
                </Card>
              )}

              <Card className="p-6 bg-slate-50 border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">AI INSIGHT</span>
                  <h3 className="font-bold text-lg">Tax Strategy</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{result.aiInsights}</p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
