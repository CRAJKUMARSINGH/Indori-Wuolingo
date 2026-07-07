import React from 'react';
import { useGetLeaderboard } from '@workspace/api-client-react';
import { useStore } from '@/store';
import { Trophy, Flame, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Leaderboard() {
  const userId = useStore((state) => state.userId);
  const { data: leaderboard, isLoading } = useGetLeaderboard();

  if (isLoading) {
    return <div className="p-8 animate-pulse text-xl font-bold">Loading leaderboard...</div>;
  }

  const top3 = leaderboard?.slice(0, 3) || [];
  const rest = leaderboard?.slice(3) || [];

  // Order for podium: 2nd, 1st, 3rd
  const podiumOrder = [
    top3[1], // Silver
    top3[0], // Gold
    top3[2], // Bronze
  ];

  const heights = ['h-32', 'h-48', 'h-24'];
  const colors = [
    'bg-slate-300 border-slate-400 text-slate-700', // Silver
    'bg-accent border-accent-border text-accent-foreground', // Gold
    'bg-amber-600 border-amber-700 text-amber-100', // Bronze
  ];

  return (
    <div className="py-10 px-4 max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black mb-2 flex items-center justify-center gap-3">
          <Trophy className="w-10 h-10 text-accent" strokeWidth={2.5} />
          Leaderboard
        </h1>
        <p className="text-muted-foreground font-medium text-lg">Top learners this week</p>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-2 md:gap-4 mb-12 h-64 mt-10">
        {podiumOrder.map((entry, idx) => {
          if (!entry) return <div key={idx} className="w-24 md:w-32 flex-1" />;
          
          const isUser = entry.userId === userId;
          
          return (
            <div key={entry.userId} className="flex flex-col items-center flex-1 w-24 md:w-32 relative">
              {idx === 1 && <div className="absolute -top-12 text-accent animate-bounce"><Trophy size={36} fill="currentColor" /></div>}
              
              <div className="flex flex-col items-center mb-3">
                <div className="font-bold text-center truncate w-full px-1">{entry.name}</div>
                <div className="text-sm text-primary font-black">{entry.xp} XP</div>
              </div>
              
              <div className={cn(
                "w-full rounded-t-2xl border-2 border-b-0 flex justify-center pt-4 text-3xl font-black shadow-[inset_0_-8px_0_0_rgba(0,0,0,0.1)]",
                heights[idx],
                colors[idx]
              )}>
                {idx === 1 ? '1' : idx === 0 ? '2' : '3'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rest of the list */}
      <div className="flex flex-col gap-3">
        {rest.map((entry) => {
          const isUser = entry.userId === userId;
          
          return (
            <div 
              key={entry.userId}
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all",
                isUser ? "bg-primary/10 border-primary text-primary" : "bg-card border-border hover:bg-muted/50"
              )}
            >
              <div className="w-8 font-black text-xl text-muted-foreground text-center">
                {entry.rank}
              </div>
              
              <div className="w-12 h-12 rounded-full bg-muted border-2 border-border flex items-center justify-center font-bold text-lg">
                {entry.name.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1">
                <div className="font-bold text-lg">{entry.name}</div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 font-bold text-muted-foreground">
                  <Flame className="w-5 h-5 text-secondary" strokeWidth={2.5} />
                  {entry.streak}
                </div>
                <div className="font-black text-primary w-16 text-right">
                  {entry.xp} XP
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
