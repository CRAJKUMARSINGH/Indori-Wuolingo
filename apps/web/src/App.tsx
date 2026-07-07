import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';
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

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return 'Something went wrong. Please try again.';
}

// Surface every query/mutation failure that a component does not handle
// itself, so network/server errors are never silently swallowed.
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast({
        title: 'Failed to load data',
        description: toErrorMessage(error),
        variant: 'destructive',
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      // Skip mutations that provide their own onError so we don't double-report.
      if (mutation.options.onError) return;
      toast({
        title: 'Action failed',
        description: toErrorMessage(error),
        variant: 'destructive',
      });
    },
  }),
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
