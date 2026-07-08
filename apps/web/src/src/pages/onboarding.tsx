import { useState } from 'react';
import { useLocation } from 'wouter';
import { useStore } from '@/lib/store';
import { useCreateUser } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function Onboarding() {
  const [name, setName] = useState('');
  const [_, setLocation] = useLocation();
  const setUserId = useStore(state => state.setUserId);
  const createUser = useCreateUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createUser.mutate(
      { data: { name: name.trim() } },
      {
        onSuccess: (user) => {
          setUserId(user.id);
          toast.success(`Welcome to IndiLingo, ${user.name}!`);
          setLocation('/home');
        },
        onError: () => {
          toast.error("Failed to create profile. Please try again.");
        }
      }
    );
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-background relative overflow-hidden p-4">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="p-8 shadow-xl border-border/50 bg-white/80 backdrop-blur-xl">
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
              className="mx-auto bg-primary text-primary-foreground w-16 h-16 rounded-2xl rotate-3 shadow-md flex items-center justify-center mb-6"
            >
              <span className="font-serif text-4xl font-bold italic">अ</span>
            </motion.div>
            <h1 className="font-serif text-3xl font-bold text-foreground mb-3">Begin your journey</h1>
            <p className="text-muted-foreground">Discover the beauty of India's regional languages. Let's start with your name.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">What should we call you?</Label>
              <Input 
                id="name"
                placeholder="e.g. Ananya, Kabir" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 text-lg px-4 bg-white focus-visible:ring-primary/50"
                autoFocus
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-medium shadow-md group hover-elevate-2 transition-all active:scale-[0.98]"
              disabled={!name.trim() || createUser.isPending}
            >
              {createUser.isPending ? (
                "Creating profile..."
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5 text-accent-foreground opacity-70 group-hover:opacity-100 transition-opacity" />
                  Start Learning
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
