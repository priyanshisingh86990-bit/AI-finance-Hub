import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";

const perks = [
  "AI-powered FIRE retirement planner",
  "Money Health Score in 5 minutes",
  "Old vs New tax regime comparison",
  "Life event financial advisor",
];

export default function Signup() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await signup(name, email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050d1a] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left – value prop */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <Link href="/" className="inline-flex items-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <span className="text-white font-bold text-lg">₹</span>
            </div>
            <span className="text-white font-bold text-xl">Money Mentor</span>
          </Link>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Start your journey to<br />
            <span className="text-emerald-400">financial freedom</span>
          </h2>
          <p className="text-gray-400 mb-8 text-lg leading-relaxed">
            Join thousands of Indians who are taking control of their finances with AI-powered guidance.
          </p>
          <ul className="space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex items-center gap-3">
            <div className="flex -space-x-2">
              {["R","P","A","M"].map((l, i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-[#050d1a] bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                  {l}
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-sm"><span className="text-white font-semibold">2,400+</span> users already saving smarter</p>
          </div>
        </motion.div>

        {/* Right – form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">₹</span>
              </div>
              <span className="text-white font-bold text-xl">Money Mentor</span>
            </Link>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
            <p className="text-gray-400 text-sm mb-6">Free forever. No credit card required.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Rahul Sharma"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="rahul@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Min. 6 characters"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Create free account <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <p className="text-center text-gray-400 text-sm mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
