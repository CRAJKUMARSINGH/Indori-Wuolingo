import { useGetLeaderboard } from '@workspace/api-client-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useGetLeaderboard();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-slate-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <span className="font-bold text-muted-foreground w-6 text-center">{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "bg-yellow-50 border-yellow-200";
      case 2: return "bg-slate-50 border-slate-200";
      case 3: return "bg-amber-50 border-amber-200";
      default: return "bg-card border-border";
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2 mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-secondary/10 rounded-full mb-2">
          <Trophy className="w-8 h-8 text-secondary" />
        </div>
        <h1 className="text-4xl font-serif font-bold text-foreground">Leaderboard</h1>
        <p className="text-lg text-muted-foreground">Compete with learners across the globe.</p>
      </div>

      <Card className="overflow-hidden bg-white/50 backdrop-blur-sm border-border shadow-sm">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : leaderboard?.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No learners on the leaderboard yet. Be the first!
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {leaderboard?.map((entry, index) => (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 flex items-center gap-4 transition-colors hover:bg-muted/30 ${index < 3 ? getRankColor(entry.rank) : ''}`}
              >
                <div className="flex items-center justify-center w-12 font-serif text-lg">
                  {getRankIcon(entry.rank)}
                </div>
                
                <Avatar className={`h-12 w-12 border-2 ${index === 0 ? 'border-yellow-400' : index === 1 ? 'border-slate-300' : index === 2 ? 'border-amber-500' : 'border-transparent'}`}>
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {entry.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold text-base truncate ${index < 3 ? 'text-foreground' : 'text-foreground/80'}`}>
                    {entry.name}
                  </h3>
                </div>
                
                <div className="text-right">
                  <span className="font-mono font-bold text-lg text-primary">{entry.xp}</span>
                  <span className="text-xs text-muted-foreground ml-1">XP</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
