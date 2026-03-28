import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ children, className, ...props }: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("bg-card rounded-2xl border border-border shadow-sm", className)} {...props}>
      {children}
    </div>
  );
}

export function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  className, 
  isLoading,
  ...props 
}: ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: "primary" | "secondary" | "outline" | "ghost",
  size?: "sm" | "md" | "lg",
  isLoading?: boolean
}) {
  const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5",
    secondary: "bg-secondary text-secondary-foreground shadow-md shadow-secondary/20 hover:shadow-lg hover:-translate-y-0.5",
    outline: "border-2 border-border bg-transparent hover:border-primary hover:bg-primary/5 text-foreground",
    ghost: "bg-transparent hover:bg-muted text-foreground"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-5 py-2.5 text-base rounded-xl",
    lg: "px-8 py-3.5 text-lg rounded-xl"
  };

  return (
    <button 
      className={cn(baseClasses, variants[variant], sizes[size], className)} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : children}
    </button>
  );
}

export function Input({ className, label, error, ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string, error?: string }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-semibold text-foreground/80">{label}</label>}
      <input 
        className={cn(
          "w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground transition-all duration-200",
          "focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10",
          "placeholder:text-muted-foreground/50",
          error && "border-destructive focus:border-destructive focus:ring-destructive/10",
          className
        )} 
        {...props} 
      />
      {error && <span className="text-xs text-destructive font-medium">{error}</span>}
    </div>
  );
}

export function Select({ className, label, options, error, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label?: string, error?: string, options: {value: string, label: string}[] }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-semibold text-foreground/80">{label}</label>}
      <select 
        className={cn(
          "w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground transition-all duration-200 appearance-none",
          "focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10",
          error && "border-destructive focus:border-destructive focus:ring-destructive/10",
          className
        )} 
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="text-xs text-destructive font-medium">{error}</span>}
    </div>
  );
}

export function PageHeader({ title, description }: { title: string, description: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground tracking-tight">{title}</h1>
      <p className="mt-2 text-muted-foreground text-lg">{description}</p>
    </div>
  );
}
