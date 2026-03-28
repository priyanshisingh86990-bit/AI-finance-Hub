import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/auth-context";
import type { ComponentType } from "react";

// Pages
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Dashboard from "@/pages/dashboard";
import FirePlanner from "@/pages/fire-planner";
import HealthScore from "@/pages/health-score";
import TaxWizard from "@/pages/tax-wizard";
import LifeEvents from "@/pages/life-events";
import AiChat from "@/pages/ai-chat";
import Insights from "@/pages/insights";
import CouplePlanner from "@/pages/couple-planner";
import MFXray from "@/pages/mf-xray";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ component: Component }: { component: ComponentType }) {
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();

  if (!isAuthenticated) {
    return <Redirect to={`/login?next=${encodeURIComponent(location)}`} />;
  }
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/fire-planner">
        {() => <ProtectedRoute component={FirePlanner} />}
      </Route>
      <Route path="/health-score">
        {() => <ProtectedRoute component={HealthScore} />}
      </Route>
      <Route path="/tax-wizard">
        {() => <ProtectedRoute component={TaxWizard} />}
      </Route>
      <Route path="/life-events">
        {() => <ProtectedRoute component={LifeEvents} />}
      </Route>
      <Route path="/ai-chat">
        {() => <ProtectedRoute component={AiChat} />}
      </Route>
      <Route path="/insights">
        {() => <ProtectedRoute component={Insights} />}
      </Route>
      <Route path="/couple-planner">
        {() => <ProtectedRoute component={CouplePlanner} />}
      </Route>
      <Route path="/mf-xray">
        {() => <ProtectedRoute component={MFXray} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AppInner() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppInner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
