import { Link, useLocation } from 'wouter';
import { Home, BookOpen, Trophy, RefreshCcw, UserCircle, LogOut } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarFooter } from '@/components/ui/sidebar';

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const setUserId = useStore(state => state.setUserId);
  const setSelectedLanguageId = useStore(state => state.setSelectedLanguageId);

  const handleLogout = () => {
    setUserId(null);
    setSelectedLanguageId(null);
  };

  const menuItems = [
    { icon: Home, label: 'Languages', path: '/home' },
    { icon: BookOpen, label: 'Learn', path: '/learn' },
    { icon: RefreshCcw, label: 'Review', path: '/review' },
    { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
    { icon: UserCircle, label: 'Profile', path: '/profile' },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-[100dvh] w-full bg-background selection:bg-primary/20">
        <Sidebar className="border-r-border/50 bg-sidebar/50 backdrop-blur-xl">
          <SidebarHeader className="p-6">
            <Link href="/home" className="flex items-center gap-3 no-underline active:scale-95 transition-transform">
              <div className="bg-primary text-primary-foreground p-2 rounded-xl rotate-3 shadow-sm">
                <span className="font-serif text-2xl font-bold italic">अ</span>
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-primary">IndiLingo</span>
            </Link>
          </SidebarHeader>
          
          <SidebarContent className="px-4">
            <SidebarGroup>
              <SidebarMenu className="gap-2">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location === item.path || location.startsWith(item.path + '/')}
                      className="rounded-xl h-12 text-base transition-all hover:bg-white hover:shadow-sm"
                      tooltip={item.label}
                    >
                      <Link href={item.path} className="flex items-center gap-3 px-3">
                        <item.icon className={`h-5 w-5 ${location === item.path ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4">
             <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-3 h-12 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
               <LogOut className="h-5 w-5" />
               <span className="font-medium">Sign Out</span>
             </Button>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 flex flex-col min-w-0 max-w-[1024px] mx-auto overflow-hidden relative">
          <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 md:py-12 no-scrollbar">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
