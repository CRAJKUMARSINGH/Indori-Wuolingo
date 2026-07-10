import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { Navigation } from '@/components/Navigation';
import { setBaseUrl } from '@workspace/api-client-react';

// Point the API client at the deployed API server in production.
// Set VITE_API_URL in Netlify → Site settings → Environment variables.
// Leave unset in Replit dev (the monorepo proxy handles routing automatically).
if (import.meta.env.VITE_API_URL) {
  setBaseUrl(import.meta.env.VITE_API_URL as string);
}

// Pages
import { Onboarding } from '@/pages/Onboarding';
import { LanguageSelection } from '@/pages/LanguageSelection';
import { Learn } from '@/pages/Learn';
import { Lesson } from '@/pages/Lesson';
import { Leaderboard } from '@/pages/Leaderboard';
import { Review } from '@/pages/Review';
import { Profile } from '@/pages/Profile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function Layout() {
  const [location] = useLocation();
  const noNav = location === '/' || location === '/languages' || location.startsWith('/lesson/');

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background">
      <Navigation />
      <main className={`flex-1 w-full max-w-5xl mx-auto ${noNav ? '' : 'md:ml-64 pb-20 md:pb-0'}`}>
        <Switch>
          <Route path="/" component={Onboarding} />
          <Route path="/languages" component={LanguageSelection} />
          <Route path="/learn" component={Learn} />
          <Route path="/lesson/:lessonId" component={Lesson} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/review" component={Review} />
          <Route path="/profile" component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Layout />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
