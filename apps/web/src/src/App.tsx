import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { useStore } from '@/lib/store';
import { useEffect } from 'react';

// Pages
import Onboarding from '@/pages/onboarding';
import Home from '@/pages/home';
import Learn from '@/pages/learn';
import Lesson from '@/pages/lesson';
import Leaderboard from '@/pages/leaderboard';
import Review from '@/pages/review';
import Profile from '@/pages/profile';

// Components
import { Layout } from '@/components/layout';

const queryClient = new QueryClient();

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const userId = useStore((state) => state.userId);
  
  useEffect(() => {
    if (!userId && location !== '/') {
      setLocation('/');
    } else if (userId && location === '/') {
      setLocation('/home');
    }
  }, [userId, location, setLocation]);

  if (!userId && location !== '/') {
    return null;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Onboarding} />
      <Route path="/lesson/:lessonId" component={Lesson} />
      <Route>
        <Layout>
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/learn" component={Learn} />
            <Route path="/leaderboard" component={Leaderboard} />
            <Route path="/review" component={Review} />
            <Route path="/profile" component={Profile} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <AuthGuard>
            <Router />
          </AuthGuard>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
