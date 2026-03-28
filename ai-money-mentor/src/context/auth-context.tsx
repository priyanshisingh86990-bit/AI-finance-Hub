import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem("ai_money_mentor_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("ai_money_mentor_user");
      }
    }
  }, []);

  const login = async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const stored = localStorage.getItem(`user_${email}`);
    if (!stored) throw new Error("No account found. Please sign up first.");
    const userData = JSON.parse(stored);
    setUser(userData);
    localStorage.setItem("ai_money_mentor_user", JSON.stringify(userData));
    navigate("/dashboard");
  };

  const signup = async (name: string, email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const userData = { name, email };
    localStorage.setItem(`user_${email}`, JSON.stringify(userData));
    setUser(userData);
    localStorage.setItem("ai_money_mentor_user", JSON.stringify(userData));
    navigate("/dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ai_money_mentor_user");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
