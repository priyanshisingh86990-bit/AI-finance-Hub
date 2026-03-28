import { Layout } from "@/components/layout/layout";
import { Card } from "@/components/ui-custom";
import { Link } from "wouter";
import { Target, HeartPulse, Receipt, CalendarDays, MessageSquare, ArrowRight, TrendingUp } from "lucide-react";

const tools = [
  {
    title: "FIRE Planner",
    description: "Calculate your retirement number and SIPs required to achieve financial independence.",
    icon: Target,
    href: "/fire-planner",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    title: "Health Score",
    description: "Assess your financial wellbeing across 6 dimensions to find critical gaps.",
    icon: HeartPulse,
    href: "/health-score",
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    title: "Tax Wizard",
    description: "Compare old vs new regime and discover optimized deductions for your salary.",
    icon: Receipt,
    href: "/tax-wizard",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    title: "Life Events",
    description: "Get AI guidance for major money moves like marriage, new baby, or buying property.",
    icon: CalendarDays,
    href: "/life-events",
    color: "bg-amber-500/10 text-amber-600",
  },
];

export default function Dashboard() {
  return (
    <Layout>
      <div className="relative mb-12 rounded-3xl overflow-hidden bg-primary px-8 py-12 md:py-16 text-white shadow-2xl">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-mesh.png`} 
            alt="Background mesh" 
            className="w-full h-full object-cover"
            onError={(e) => e.currentTarget.style.display = 'none'}
          />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white">
            Take Control of Your Financial Future
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-xl">
            Your personal AI money mentor. Plan for retirement, optimize your taxes, and navigate major life events with confidence.
          </p>
          <Link href="/ai-chat" className="inline-flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-secondary/25 hover:-translate-y-1 transition-all">
            <MessageSquare size={20} />
            Ask AI Mentor
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold">Financial Tools</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <Link key={tool.title} href={tool.href}>
            <Card className="p-6 cursor-pointer hover:shadow-xl hover:border-primary/20 transition-all duration-300 group h-full flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tool.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <tool.icon size={28} />
                </div>
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                  <ArrowRight size={16} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{tool.title}</h3>
              <p className="text-muted-foreground flex-1">{tool.description}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <Card className="p-8 bg-gradient-to-br from-background to-muted border-none shadow-inner">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-display font-bold mb-2 flex items-center gap-2">
                <TrendingUp className="text-secondary" /> Daily Market Insight
              </h3>
              <p className="text-muted-foreground">
                Did you know? Compounding is the 8th wonder of the world. Starting a ₹10,000 SIP 5 years early can result in nearly double the final corpus over a 25-year period due to the power of compounding.
              </p>
            </div>
            <Link href="/fire-planner" className="shrink-0 bg-white border border-border px-6 py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all text-primary">
              Start a SIP Plan
            </Link>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
