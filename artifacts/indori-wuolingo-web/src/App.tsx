import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Shell } from "@/components/layout/shell";
import Home from "@/pages/home";
import Learn from "@/pages/learn";
import Lesson from "@/pages/lesson";
import Leaderboard from "@/pages/leaderboard";
import Profile from "@/pages/profile";
import Stats from "@/pages/stats";
import OnboardingWelcome from "@/pages/onboarding/welcome";
import OnboardingLanguage from "@/pages/onboarding/language";
import OnboardingGoals from "@/pages/onboarding/goals";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/">
        <Shell><Home /></Shell>
      </Route>
      <Route path="/learn">
        <Shell><Learn /></Shell>
      </Route>
      <Route path="/onboarding/welcome" component={OnboardingWelcome} />
      <Route path="/onboarding/language" component={OnboardingLanguage} />
      <Route path="/onboarding/goals" component={OnboardingGoals} />
      <Route path="/lesson/:id" component={Lesson} />
      <Route path="/leaderboard">
        <Shell><Leaderboard /></Shell>
      </Route>
      <Route path="/profile">
        <Shell><Profile /></Shell>
      </Route>
      <Route path="/stats">
        <Shell><Stats /></Shell>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
