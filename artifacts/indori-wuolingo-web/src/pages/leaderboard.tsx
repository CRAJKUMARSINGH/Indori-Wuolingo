import { useGetLeaderboard, getGetLeaderboardQueryKey } from "@workspace/api-client-react";
import { Trophy, Flame } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useGetLeaderboard({ query: { enabled: true, queryKey: getGetLeaderboardQueryKey() } });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="space-y-4">
          {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto">
      <header className="text-center space-y-4 pt-4">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto shadow-sm border-2 border-yellow-200">
          <Trophy className="w-10 h-10 text-yellow-500 fill-yellow-500" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Top Indoris</h1>
          <p className="text-muted-foreground font-medium mt-1">See who's leading the pack bhiya!</p>
        </div>
      </header>

      <Card className="border-2 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {leaderboard?.map((entry, index) => (
              <div 
                key={entry.userId} 
                className={`p-4 flex items-center gap-4 transition-colors hover:bg-muted/50 ${entry.userId === 1 ? 'bg-primary/5' : ''}`}
              >
                <div className="w-10 text-center">
                  {index === 0 ? (
                    <span className="text-3xl">🥇</span>
                  ) : index === 1 ? (
                    <span className="text-3xl">🥈</span>
                  ) : index === 2 ? (
                    <span className="text-3xl">🥉</span>
                  ) : (
                    <span className="font-display font-bold text-lg text-muted-foreground">{index + 1}</span>
                  )}
                </div>
                
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl border-2 border-primary/20 shrink-0">
                  {entry.displayName.charAt(0)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground truncate">{entry.displayName}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-sm font-medium text-muted-foreground">{entry.xp} XP</span>
                    {entry.userId === 1 && (
                      <span className="px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-md uppercase tracking-wider">You</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 shrink-0 bg-orange-100 px-3 py-1.5 rounded-full border border-orange-200">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <span className="font-bold text-orange-700 text-sm">{entry.streak}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}