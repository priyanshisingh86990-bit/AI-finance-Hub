import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Target, 
  HeartPulse, 
  Receipt, 
  CalendarDays, 
  MessageSquare,
  Menu,
  X,
  LogOut,
  BarChart2,
  Heart,
  ScanSearch,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/auth-context";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/fire-planner", icon: Target, label: "FIRE Planner" },
  { href: "/health-score", icon: HeartPulse, label: "Health Score" },
  { href: "/tax-wizard", icon: Receipt, label: "Tax Wizard" },
  { href: "/life-events", icon: CalendarDays, label: "Life Events" },
  { href: "/ai-chat", icon: MessageSquare, label: "AI Mentor Chat" },
  { href: "/insights", icon: BarChart2, label: "Insights" },
  { href: "/couple-planner", icon: Heart, label: "Couple Planner" },
  { href: "/mf-xray", icon: ScanSearch, label: "MF X-Ray" },
];

export function Sidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={toggle}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-primary text-white rounded-xl shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggle}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out flex flex-col",
        "lg:translate-x-0 lg:static lg:h-screen lg:shrink-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shadow-lg shadow-secondary/20">
            <img 
              src={`${import.meta.env.BASE_URL}images/logo-icon.png`} 
              alt="Logo" 
              className="w-6 h-6 object-contain brightness-0 invert" 
              onError={(e) => e.currentTarget.style.display = 'none'}
            />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl leading-none text-primary">Money Mentor</h1>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">AI Powered</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/10" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-secondary" : ""
                )} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-sidebar-border space-y-4">
          {/* User info + logout */}
          {user && (
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="shrink-0 p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}

          <div className="bg-gradient-to-br from-primary to-primary/90 rounded-2xl p-5 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <h3 className="font-display font-bold mb-1 relative z-10">Need Help?</h3>
            <p className="text-xs text-white/70 mb-4 relative z-10">Ask the AI Mentor anything about your finances.</p>
            <Link href="/ai-chat" className="block w-full text-center bg-white text-primary text-sm font-bold py-2.5 rounded-lg hover:bg-secondary hover:text-white transition-colors relative z-10 shadow-sm">
              Start Chat
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
