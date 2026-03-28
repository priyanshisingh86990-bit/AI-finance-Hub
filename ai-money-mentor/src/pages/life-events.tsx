import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { PageHeader, Card, Input, Select, Button } from "@/components/ui-custom";
import { formatINR } from "@/lib/utils";
import { Gift, Zap, Info, CalendarClock, Briefcase, Baby, Heart, Home } from "lucide-react";

const eventTypes = [
  { value: "bonus", label: "Large Bonus / Windfall", icon: Gift },
  { value: "marriage", label: "Getting Married", icon: Heart },
  { value: "new_baby", label: "New Baby", icon: Baby },
  { value: "property_purchase", label: "Buying a House", icon: Home },
  { value: "job_loss", label: "Job Loss", icon: Briefcase },
];

interface InvestmentStrategy {
  amount: number;
  instrument: string;
  allocation: number;
  rationale: string;
}

interface TimelinePhase {
  timeframe: string;
  actions: string[];
}

interface LifeEventResult {
  eventSummary: string;
  immediateActions: string[];
  taxImplications: string;
  insuranceReview: string;
  investmentStrategy: InvestmentStrategy[];
  timeline: TimelinePhase[];
}

function calcLifeEvent(f: {
  event: string; amount: number; monthlyIncome: number; monthlyExpenses: number;
  existingInvestments: number; riskProfile: string; age: number; additionalContext: string;
}): LifeEventResult {
  const annualIncome = f.monthlyIncome * 12;
  const emergencyTarget = f.monthlyExpenses * 6;

  const plans: Record<string, LifeEventResult> = {
    bonus: {
      eventSummary: `You've received a bonus of ${formatINR(f.amount)} — a fantastic opportunity to accelerate your financial goals. At age ${f.age} with an annual income of ${formatINR(annualIncome)}, this windfall can meaningfully move the needle on your FIRE timeline if deployed strategically.`,
      immediateActions: [
        "Park the full amount in a liquid fund immediately — don't let it sit in a savings account",
        `Set aside ${formatINR(Math.min(f.amount * 0.3, 150000))} for Section 80C investments before March 31st`,
        "Pay off any outstanding personal loans or credit card debt first",
        "Don't make any big purchase decisions for at least 30 days",
      ],
      taxImplications: "Bonuses are fully taxable as salary income in the year of receipt. However, if you invest in ELSS (80C), NPS (80CCD), or home loan repayment (24b), you can offset part of the tax. If your employer allows, negotiate structuring future bonuses as reimbursements.",
      insuranceReview: `With this windfall, increase your life cover term insurance to at least ${formatINR(annualIncome * 15)} (15× annual income). Also review your health insurance — top-up plans are cheap and effective.`,
      investmentStrategy: f.amount > 0 ? [
        { amount: Math.round(f.amount * 0.4), instrument: "ELSS SIP / Lump Sum", allocation: 40, rationale: "Tax-saving + wealth creation. 3-yr lock-in builds discipline." },
        { amount: Math.round(f.amount * 0.3), instrument: "Large Cap Index Fund", allocation: 30, rationale: "Core equity for long-term wealth, low cost, market returns." },
        { amount: Math.round(f.amount * 0.2), instrument: "Liquid Fund", allocation: 20, rationale: "Boosts emergency fund to 6 months — your financial safety net." },
        { amount: Math.round(f.amount * 0.1), instrument: "Gold / SGBs", allocation: 10, rationale: "Hedge against inflation and currency risk." },
      ] : [],
      timeline: [
        { timeframe: "Week 1", actions: ["Park in liquid fund", "Pay off high-interest debt", "Consult CA for tax structuring"] },
        { timeframe: "Month 1", actions: ["Invest 80C limit in ELSS", "Open NPS account if not done", "Increase SIP amount for remaining months of FY"] },
        { timeframe: "Month 2–3", actions: ["Deploy index fund allocation via STP from liquid fund", "Review asset allocation", "Update nominee details"] },
        { timeframe: "Year End", actions: ["File ITR showing all investments", "Review if FIRE target moved forward", "Plan next FY tax-saving strategy"] },
      ],
    },

    marriage: {
      eventSummary: `Marriage is one of the biggest financial life events — combining two incomes, two expense patterns, and two sets of goals. Proactive planning now will prevent money conflicts later and accelerate your combined wealth journey.`,
      immediateActions: [
        "Have an open money conversation with your partner — share incomes, debts, and goals",
        "Update nominee details on all insurance policies, EPF, and bank accounts",
        "Decide on a joint account structure (joint + individual accounts work best)",
        "Create a combined monthly budget before the wedding expenses hit",
      ],
      taxImplications: "Marriage allows you to claim HRA for a rented home. If your spouse doesn't have income, investments in their name (PPF, FDs) are clubbed with yours for tax — plan accordingly. Joint home loans allow both partners to claim 80C (principal) and 24b (interest) deductions independently.",
      insuranceReview: "Marriage is the #1 trigger to buy term life insurance. A ₹1Cr+ term plan is non-negotiable if you have dependants. Also add your spouse to your health insurance floater plan immediately.",
      investmentStrategy: [
        { amount: Math.round(f.monthlyIncome * 6), instrument: "Joint Emergency Fund (Liquid Fund)", allocation: 30, rationale: "6 months expenses for the combined household." },
        { amount: Math.round(f.monthlyIncome * 12), instrument: "Term Life Insurance (Annual Premium)", allocation: 5, rationale: "Protect each other financially — ₹1Cr+ cover each." },
        { amount: Math.round(f.monthlyIncome * 6), instrument: "ELSS for Tax Saving", allocation: 30, rationale: "Both partners should maximise 80C separately." },
        { amount: Math.round(f.monthlyIncome * 8), instrument: "Gold ETFs / SGBs", allocation: 20, rationale: "Traditional and inflation-proof — good for 3–5 year goals." },
      ],
      timeline: [
        { timeframe: "Before Wedding", actions: ["Joint financial audit", "Update nominee details", "Buy term insurance for both", "Open joint savings account"] },
        { timeframe: "Month 1–3", actions: ["Set combined budget", "Decide investment responsibilities", "Start joint SIP for home goal"] },
        { timeframe: "Month 4–12", actions: ["Review expense patterns", "Plan for home purchase if applicable", "Consolidate and optimise tax returns"] },
        { timeframe: "Year 1 onwards", actions: ["Annual financial review together", "Re-evaluate goals after 1 year", "Consider ELSS SIPs in spouse's name for tax efficiency"] },
      ],
    },

    new_baby: {
      eventSummary: `Congratulations! A new child changes everything financially — immediately increasing expenses while creating powerful long-term motivations to build wealth. Planning from day one can give your child a ₹50L+ head start by the time they turn 18.`,
      immediateActions: [
        "Add the baby to your health insurance plan within 30 days of birth (golden window — no waiting period)",
        "Create a will immediately and appoint a guardian",
        "Increase life insurance term cover to at least 20× annual income",
        "Open a Sukanya Samridhi Yojana account if a girl child (tax-free, 8%+ returns)",
      ],
      taxImplications: "You can claim ₹1,500 per child (max 2 children) in tax exemptions. Maternity/paternity medical bills are covered under Section 80D if paid via health insurance. Education expenses paid by employer are tax-free up to ₹100/month.",
      insuranceReview: "This is the most critical time to review insurance. Add child rider to existing policy, or buy a separate children's plan. A ₹2Cr term plan is the bare minimum when you have a child dependent. Health cover should now include a comprehensive family floater of ₹10L+.",
      investmentStrategy: [
        { amount: 5000, instrument: "SIP in Equity MF (Child Goal)", allocation: 40, rationale: "₹5K/month SIP for 18 years @12% = ₹55L for education/college." },
        { amount: 1500, instrument: "Sukanya Samridhi / PPF", allocation: 15, rationale: "Tax-free, government-backed, 8%+ return for girl child." },
        { amount: 3000, instrument: "Education-focused ULIP", allocation: 25, rationale: "Insurance + savings combo with guaranteed payout at age 18." },
        { amount: 2000, instrument: "Gold ETF (Birthday SGB)", allocation: 20, rationale: "Buy 1 gram gold SGB every birthday as long-term wealth gift." },
      ],
      timeline: [
        { timeframe: "0–30 Days", actions: ["Add to health insurance", "Open SSY if girl child", "Update Will & nominees"] },
        { timeframe: "Month 1–6", actions: ["Start ₹5K+ SIP for child education fund", "Buy additional term insurance", "Set up 18-year investment horizon plan"] },
        { timeframe: "Year 1–5", actions: ["Annual gold SGB purchase", "Step up SIP by 10% each year", "Track education inflation (10–12% p.a.)"] },
        { timeframe: "Year 5+ onwards", actions: ["Review corpus vs projected education cost", "Consider NPS for own retirement — don't compromise it for child's education", "Plan scholarship strategy"] },
      ],
    },

    property_purchase: {
      eventSummary: `Buying property worth ${formatINR(f.amount)} is one of the largest financial decisions of your life. Done right, it combines housing security with long-term asset building. Done wrong, it can derail your FIRE plan by decades.`,
      immediateActions: [
        "Ensure down payment is from savings — never use emergency fund or investments",
        "Get home loan pre-approval from 2–3 banks to negotiate the best rate",
        "Legal verification of property title, encumbrance certificate, and RERA registration",
        "Budget for total cost: registration (5–7%), stamp duty, GST, interior — not just the sticker price",
      ],
      taxImplications: "Home loan allows: Section 24(b) — ₹2L deduction on interest per year; Section 80C — ₹1.5L on principal repayment; First-time buyer bonus via Section 80EEA (if applicable). Long-term capital gains on property held >2 years taxed at 20% with indexation.",
      insuranceReview: "Mandatory: Home loan protection (reduces loan liability if you die). Also buy a home insurance policy for structure + contents — often as low as ₹2,000–3,000/year. Review and increase term insurance to cover the outstanding loan amount.",
      investmentStrategy: f.amount > 0 ? [
        { amount: Math.round(f.amount * 0.20), instrument: "Down Payment (Own savings)", allocation: 20, rationale: "Minimum 20% down to avoid PMI and keep EMI manageable." },
        { amount: Math.round(f.amount * 0.05), instrument: "Emergency Buffer (Liquid Fund)", allocation: 5, rationale: "6 months EMI buffer — never miss an EMI." },
        { amount: Math.round(f.amount * 0.03), instrument: "Registration & Stamp Duty", allocation: 3, rationale: "Cash reserve for upfront government fees and legal costs." },
        { amount: Math.round(f.amount * 0.02), instrument: "Home Insurance + Loan Protection", allocation: 2, rationale: "One-time premiums for comprehensive property protection." },
      ] : [],
      timeline: [
        { timeframe: "Month 1–2", actions: ["Legal due diligence", "Loan pre-approval", "Budget for all hidden costs"] },
        { timeframe: "Month 3 (Purchase)", actions: ["Sign agreement", "Pay down payment", "Register loan protection insurance"] },
        { timeframe: "First 6 Months", actions: ["Interior budget capped at 10% of property value", "Claim home loan tax deductions in ITR", "Maintain 6-month EMI buffer"] },
        { timeframe: "Ongoing", actions: ["Prepay 1 EMI extra every year to reduce tenure", "Review home loan rate vs market every 2 years", "Continue SIPs — don't stop investing because of EMI"] },
      ],
    },

    job_loss: {
      eventSummary: `Job loss is stressful, but with the right financial response in the first 30 days, you can protect your family and use this period strategically. Your priority order: protect cash, preserve health, activate network, upskill.`,
      immediateActions: [
        "Do NOT touch your investments — protect long-term compounding at all costs",
        `Calculate your monthly burn rate (${formatINR(f.monthlyExpenses)}) and map your emergency runway`,
        "Claim PF balance only as a last resort — it compounds tax-free till withdrawal",
        "Immediately cut discretionary expenses (dining out, subscriptions, shopping) by 50%",
      ],
      taxImplications: "Gratuity up to ₹20L is tax-free. PF withdrawal before 5 years of service is taxable. If you get severance, it may be partially exempt. File advance tax carefully this year as income will drop — excess tax paid = refund from IT department.",
      insuranceReview: "Your employer-sponsored group health insurance lapses on last working day. Immediately purchase an individual health plan (COBRA equivalent doesn't exist in India — must buy fresh policy). This is the single most urgent financial action when you lose a job.",
      investmentStrategy: [
        { amount: Math.round(f.monthlyExpenses * 3), instrument: "Emergency Liquid Fund Top-up", allocation: 60, rationale: "Extend emergency runway to 9–12 months from savings." },
        { amount: Math.round(f.monthlyExpenses * 1), instrument: "Individual Health Insurance (Annual)", allocation: 20, rationale: "Critical — buy immediately before any claim scenario arises." },
        { amount: Math.round(f.monthlyExpenses * 0.5), instrument: "Skill Upgrade (Online Courses)", allocation: 10, rationale: "ROI on upskilling is 10–100× in first job after reemployment." },
        { amount: Math.round(f.monthlyExpenses * 0.5), instrument: "Pause SIPs temporarily", allocation: 10, rationale: "Reduce (not stop) SIPs by 50% — full stop is better than redemption." },
      ],
      timeline: [
        { timeframe: "Week 1", actions: ["Buy individual health insurance", "Calculate exact monthly burn rate", "Activate emergency fund access"] },
        { timeframe: "Month 1", actions: ["File for PF claim (keep as buffer)", "Reduce SIPs but don't stop", "Update LinkedIn and reach out to network"] },
        { timeframe: "Month 2–3", actions: ["Renegotiate EMIs with bank if needed (moratorium)", "Take freelance/consulting work in your domain", "Target reemployment within 90 days"] },
        { timeframe: "After Reemployment", actions: ["Restore SIPs to previous + 10% increase", "Rebuild emergency fund first priority", "Don't take on any new debt for 6 months"] },
      ],
    },
  };

  return plans[f.event] ?? plans["bonus"];
}

export default function LifeEvents() {
  const [formData, setFormData] = useState({
    event: "bonus",
    amount: 500000,
    monthlyIncome: 150000,
    monthlyExpenses: 70000,
    existingInvestments: 1000000,
    riskProfile: "moderate",
    age: 28,
    additionalContext: "",
  });

  const [result, setResult] = useState<LifeEventResult | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setResult(null);
    setTimeout(() => {
      setResult(calcLifeEvent(formData));
      setIsPending(false);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['event', 'riskProfile', 'additionalContext'].includes(name) ? value : Number(value)
    }));
  };

  return (
    <Layout>
      <PageHeader
        title="Life Event Advisor"
        description="Major life change? Get a structured financial playbook before making big moves."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <Card className="p-6 sticky top-8">
            <h3 className="text-xl font-bold mb-6">The Event</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="What's happening?"
                name="event"
                value={formData.event}
                onChange={handleChange}
                options={eventTypes}
              />

              {(formData.event === 'bonus' || formData.event === 'inheritance' || formData.event === 'property_purchase') && (
                <Input label="Amount involved (₹)" name="amount" type="number" value={formData.amount} onChange={handleChange} required />
              )}

              <div className="pt-4 pb-2 border-b border-border">
                <h4 className="font-semibold text-sm text-muted-foreground mb-4">Your Context</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Input label="Age" name="age" type="number" value={formData.age} onChange={handleChange} />
                  <Select
                    label="Risk Profile"
                    name="riskProfile"
                    value={formData.riskProfile}
                    onChange={handleChange}
                    options={[
                      { value: "conservative", label: "Safe" },
                      { value: "moderate", label: "Balanced" },
                      { value: "aggressive", label: "Aggressive" }
                    ]}
                  />
                </div>
                <Input label="Monthly Income (₹)" name="monthlyIncome" type="number" value={formData.monthlyIncome} onChange={handleChange} />
                <div className="mt-4">
                  <label className="text-sm font-semibold text-foreground/80 mb-1.5 block">Additional Context (Optional)</label>
                  <textarea
                    name="additionalContext"
                    value={formData.additionalContext}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:outline-none focus:border-primary resize-none h-24"
                    placeholder="e.g. Planning to buy a car soon too..."
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" isLoading={isPending}>
                Generate Playbook
              </Button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-8">
          {!result && !isPending && (
            <div className="h-full flex items-center justify-center p-8 bg-muted/30 rounded-3xl border-2 border-dashed border-border min-h-[600px]">
              <div className="text-center max-w-sm">
                <Zap className="w-16 h-16 mx-auto text-amber-400 mb-4 opacity-80" />
                <p className="text-lg text-muted-foreground">Select a life event to get a tailored step-by-step financial plan.</p>
              </div>
            </div>
          )}

          {isPending && (
            <div className="h-full flex flex-col items-center justify-center min-h-[600px] gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-muted-foreground font-medium animate-pulse">Building your personalised playbook…</p>
            </div>
          )}

          {result && (
            <div className="animate-in fade-in duration-500 space-y-6">
              <Card className="p-8 bg-primary text-white">
                <h2 className="text-2xl font-display font-bold mb-4">Strategic Summary</h2>
                <p className="text-lg text-white/90 leading-relaxed">{result.eventSummary}</p>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Zap className="text-amber-500" /> Immediate Actions (Next 7 Days)
                  </h3>
                  <ul className="space-y-3">
                    {result.immediateActions.map((action, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                        <span className="text-muted-foreground">{action}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Info className="text-blue-500" /> Tax & Insurance Impact
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <span className="font-semibold block text-sm mb-1 text-foreground">Tax Implications:</span>
                      <p className="text-sm text-muted-foreground">{result.taxImplications}</p>
                    </div>
                    <div>
                      <span className="font-semibold block text-sm mb-1 text-foreground">Insurance Review:</span>
                      <p className="text-sm text-muted-foreground">{result.insuranceReview}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {result.investmentStrategy.length > 0 && (
                <Card className="p-6 overflow-hidden">
                  <h3 className="font-bold text-lg mb-4 text-center">Suggested Capital Deployment</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.investmentStrategy.map((strat, i) => (
                      <div key={i} className="p-4 rounded-xl bg-muted/50 border border-border overflow-hidden">
                        <div className="text-lg font-bold text-primary mb-1 break-words leading-tight">
                          {formatINR(strat.amount)}
                          <span className="text-xs font-normal text-muted-foreground ml-1">({strat.allocation}%)</span>
                        </div>
                        <div className="text-sm font-semibold mb-1.5 break-words">{strat.instrument}</div>
                        <div className="text-xs text-muted-foreground leading-relaxed break-words">{strat.rationale}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-background to-slate-50">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <CalendarClock className="text-primary" /> Execution Timeline
                </h3>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                  {result.timeline.map((phase, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-secondary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-sm font-bold">
                        {i + 1}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border bg-card shadow-sm">
                        <div className="font-bold text-primary mb-2">{phase.timeframe}</div>
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                          {phase.actions.map((act, j) => <li key={j}>{act}</li>)}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
