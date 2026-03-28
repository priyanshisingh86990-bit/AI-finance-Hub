import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Star, Target, HeartPulse,
  Receipt, CalendarDays, TrendingUp, Shield, Zap,
  BarChart3, MessageSquare, ChevronRight, Users, Award
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
};

const features = [
  {
    icon: HeartPulse,
    color: "from-rose-500 to-pink-600",
    glow: "shadow-rose-500/20",
    title: "Money Health Score",
    description: "Get a comprehensive 6-dimension financial wellness score — emergency fund, insurance, investments, debt, tax efficiency, and retirement readiness.",
    tag: "5 min assessment",
  },
  {
    icon: Target,
    color: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/20",
    title: "FIRE Path Planner",
    description: "Calculate your exact retirement corpus, SIP amounts per goal, optimal asset allocation, and month-by-month roadmap to financial independence.",
    tag: "Retirement planning",
  },
  {
    icon: Receipt,
    color: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/20",
    title: "Tax Wizard",
    description: "Compare old vs new tax regime with your real numbers. Discover every deduction you're missing and get investment suggestions ranked by risk.",
    tag: "FY 2024–25",
  },
  {
    icon: CalendarDays,
    color: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/20",
    title: "Life Event Advisor",
    description: "Marriage, new baby, bonus, inheritance, or job change — get AI-curated financial strategies tailored to your exact tax bracket and risk profile.",
    tag: "AI-powered",
  },
];

const steps = [
  { n: "01", title: "Create free account", desc: "Sign up in under 30 seconds — no credit card required." },
  { n: "02", title: "Share your financial snapshot", desc: "Answer a few questions about income, savings, and goals." },
  { n: "03", title: "Get your AI plan", desc: "Receive a personalised roadmap with specific numbers and actions." },
  { n: "04", title: "Track & chat anytime", desc: "Ask follow-up questions to your AI Mentor whenever you need guidance." },
];

const benefits = [
  { icon: Shield, title: "Privacy first", desc: "Your data never leaves our encrypted servers. We don't sell it." },
  { icon: Zap, title: "Instant answers", desc: "No waiting for an appointment. AI guidance in seconds, 24/7." },
  { icon: BarChart3, title: "India-specific advice", desc: "Built for Indian tax laws, SEBI rules, SIP, EPF, NPS, ELSS — not generic global advice." },
  { icon: TrendingUp, title: "Real numbers, not fluff", desc: "We give you exact rupee amounts — corpus needed, SIP required, tax saved." },
  { icon: Users, title: "Built for everyone", desc: "Whether you earn ₹3L or ₹1Cr per year, the advice scales with you." },
  { icon: Award, title: "Free forever basics", desc: "Core features are always free. No hidden charges, no upsell traps." },
];

const testimonials = [
  {
    name: "Priya Nair",
    role: "Software Engineer, Bangalore",
    avatar: "P",
    color: "from-emerald-400 to-teal-500",
    quote: "I always assumed financial planning was for rich people. Money Mentor showed me I could retire at 47 by investing just ₹18,000/month. Game changer.",
    stars: 5,
  },
  {
    name: "Arjun Mehta",
    role: "Marketing Manager, Mumbai",
    avatar: "A",
    color: "from-violet-400 to-purple-500",
    quote: "The Tax Wizard alone saved me ₹64,000 in taxes last year. I had no idea I was missing Section 80CCD and HRA deductions. Incredibly eye-opening.",
    stars: 5,
  },
  {
    name: "Kavitha Reddy",
    role: "Doctor, Hyderabad",
    avatar: "K",
    color: "from-amber-400 to-orange-500",
    quote: "When I got my first big bonus, I had no idea what to do. The Life Event Advisor gave me a clear, step-by-step plan in minutes. Absolutely brilliant.",
    stars: 5,
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050d1a] text-white overflow-x-hidden">

      {/* ─── NAV ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050d1a]/90 backdrop-blur-xl border-b border-white/8">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <span className="text-white font-bold">₹</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Money Mentor</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="text-sm text-gray-200 hover:text-white transition px-4 py-2 rounded-lg hover:bg-white/8">Login</button>
            </Link>
            <Link href="/signup">
              <button className="text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold px-4 py-2 rounded-lg transition-all shadow-lg shadow-emerald-500/20">
                Get started free
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center text-center pt-24 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-emerald-500/8 blur-[130px]" />
          <div className="absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/8 blur-[100px]" />
          <div className="absolute bottom-10 left-1/4 w-[350px] h-[350px] rounded-full bg-violet-500/8 blur-[100px]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-60" />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 backdrop-blur">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI-Powered · India-Specific · Always Free
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white"
          >
            Your AI-Powered<br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Financial Guide
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            95% of Indians don't have a financial plan. Financial advisors charge ₹25,000+ per year.
            We give you the same quality guidance — free, instant, and tailored to your numbers.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/signup">
              <button className="group flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5">
                Get started — it's free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/login">
              <button className="flex items-center gap-2 bg-white/8 hover:bg-white/12 border border-white/15 text-white font-medium px-8 py-4 rounded-xl text-base transition-all hover:-translate-y-0.5">
                Sign in
                <ChevronRight size={16} />
              </button>
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400"
          >
            {["2,400+ users", "₹4.2Cr+ tax saved", "Free forever", "No credit card"].map((label) => (
              <div key={label} className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-4 block">About</span>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-6 text-white">
              Built to make financial planning
              <span className="block text-emerald-400">accessible to every Indian</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-5">
              Traditional financial advisors serve only high-net-worth individuals. We built AI Money Mentor to close that gap — bringing expert-level guidance to every salaried professional, freelancer, and small business owner in India.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Our AI understands Indian tax laws (Section 80C, HRA, NPS), SEBI-regulated instruments, EPF/PPF structures, and the nuances of both old and new tax regimes — so the advice you get is genuinely relevant to your life.
            </p>
            <Link href="/signup">
              <button className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold transition group">
                Start your financial journey <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { value: "₹0", label: "Cost to start" },
              { value: "5 min", label: "To get your health score" },
              { value: "6", label: "Dimensions analysed" },
              { value: "24/7", label: "AI mentor available" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/6 border border-white/10 rounded-2xl p-6 text-center backdrop-blur hover:bg-white/8 transition">
                <div className="text-3xl font-extrabold text-emerald-400 mb-2">{value}</div>
                <div className="text-gray-300 text-sm font-medium">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-4 block">Features</span>
            <h2 className="text-4xl lg:text-5xl font-bold mb-5 text-white">
              Everything you need to<br />master your money
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Four powerful AI tools. One unified platform. Zero jargon.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.5}
                className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/8 hover:border-white/15 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 shadow-lg ${f.glow}`}>
                  <f.icon size={26} className="text-white" />
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">{f.tag}</span>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-gray-300 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-teal-500/5 blur-[120px]" />
        </div>
        <div className="max-w-5xl mx-auto relative">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-4 block">How it works</span>
            <h2 className="text-4xl lg:text-5xl font-bold mb-5 text-white">
              Your financial plan in<br />four simple steps
            </h2>
            <p className="text-gray-300 text-lg max-w-xl mx-auto">No jargon. No advisor meetings. Just clear, actionable steps.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.5}
                className="relative"
              >
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full hover:bg-white/8 transition">
                  <div className="text-5xl font-black text-white/15 mb-4 font-mono leading-none">{s.n}</div>
                  <h3 className="text-white font-bold text-lg mb-2 leading-snug">{s.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-3 text-gray-500 z-10">
                    <ChevronRight size={20} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mt-12">
            <Link href="/signup">
              <button className="group inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-xl shadow-emerald-500/20 hover:-translate-y-0.5">
                Get my free plan
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── BENEFITS ─── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-4 block">Why us</span>
            <h2 className="text-4xl lg:text-5xl font-bold mb-5 text-white">
              Built different.<br />Priced for everyone.
            </h2>
            <p className="text-gray-300 text-lg max-w-xl mx-auto leading-relaxed">
              What makes Money Mentor different from other financial apps — and from a human advisor.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.3}
                className="flex gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/8 transition"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
                  <b.icon size={19} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1.5 text-base">{b.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" className="py-24 px-6 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-4 block">Testimonials</span>
            <h2 className="text-4xl lg:text-5xl font-bold mb-5 text-white">Trusted by real people</h2>
            <p className="text-gray-300 text-lg max-w-xl mx-auto">Hear from users who transformed their financial lives.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.4}
                className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/8 transition hover:-translate-y-1 duration-300 flex flex-col"
              >
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} size={15} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-200 leading-relaxed mb-6 text-[15px] flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="relative bg-gradient-to-br from-emerald-950/70 to-teal-950/70 border border-emerald-500/25 rounded-3xl p-12 text-center overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-emerald-500/12 blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-teal-500/12 blur-[80px]" />
            </div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold px-4 py-1.5 rounded-full mb-8">
                <MessageSquare size={12} />
                AI Mentor chat included
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-5 text-white">
                Start for free today.<br />No excuses.
              </h2>
              <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                Create your account in 30 seconds. No credit card needed. Your personalised financial plan is waiting.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <button className="group flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold px-10 py-4 rounded-xl text-base transition-all shadow-2xl shadow-emerald-500/30 hover:-translate-y-0.5">
                    Create free account
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/login">
                  <button className="text-gray-300 hover:text-white transition font-medium px-6 py-4 flex items-center gap-1">
                    Already have an account?
                    <span className="text-emerald-400 ml-1 font-semibold">Sign in →</span>
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/8 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">₹</span>
            </div>
            <span className="font-bold text-white">Money Mentor</span>
          </div>
          <p className="text-gray-400 text-sm text-center">
            Educational tool only. Not SEBI-registered. Not professional financial advice.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/signup" className="hover:text-white transition-colors">Sign up</Link>
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <span className="text-gray-500">© 2025 Money Mentor</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
