import { useGetStatsOverview, useGetUnitProgress, getGetStatsOverviewQueryKey, getGetUnitProgressQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, Users, BookOpen, Star, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Stats() {
  const { data: stats, isLoading: statsLoading } = useGetStatsOverview({ query: { enabled: true, queryKey: getGetStatsOverviewQueryKey() } });
  const { data: units, isLoading: unitsLoading } = useGetUnitProgress({ query: { enabled: true, queryKey: getGetUnitProgressQueryKey() } });

  const isLoading = statsLoading || unitsLoading;

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-3xl mx-auto">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto">
      <header className="text-center space-y-4 pt-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto shadow-sm border-2 border-primary/20">
          <BarChart3 className="w-10 h-10 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Platform Stats</h1>
          <p className="text-muted-foreground font-medium mt-1">See how the Indori community is growing.</p>
        </div>
      </header>

      {/* Global Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-2 shadow-sm rounded-2xl bg-blue-50/50 border-blue-100">
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            <span className="text-sm font-bold text-blue-600/80">Learners</span>
            <span className="text-2xl font-display font-bold text-blue-700">{stats?.totalUsers}</span>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm rounded-2xl bg-green-50/50 border-green-100">
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <BookOpen className="w-6 h-6 text-green-500" />
            <span className="text-sm font-bold text-green-600/80">Completions</span>
            <span className="text-2xl font-display font-bold text-green-700">{stats?.totalCompletions}</span>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm rounded-2xl bg-yellow-50/50 border-yellow-100">
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            <span className="text-sm font-bold text-yellow-600/80">Avg XP</span>
            <span className="text-2xl font-display font-bold text-yellow-700">{stats?.avgXp}</span>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm rounded-2xl bg-orange-50/50 border-orange-100">
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <Target className="w-6 h-6 text-orange-500" />
            <span className="text-sm font-bold text-orange-600/80">Active Streaks</span>
            <span className="text-2xl font-display font-bold text-orange-700">{stats?.activeStreaks}</span>
          </CardContent>
        </Card>
      </div>

      {/* Unit Breakdown */}
      <div>
        <h2 className="text-xl font-display font-bold mb-4 px-1 text-foreground">Content Engagement</h2>
        <Card className="border-2 shadow-sm rounded-2xl">
          <CardContent className="p-6 space-y-6">
            {units?.sort((a,b) => a.unitNumber - b.unitNumber).map((unit) => {
              // Calculate completion rate based on available totalCompletions vs unit completions
              // For prototype, we'll just mock a percentage based on number of completed lessons
              const percent = unit.totalLessons > 0 
                ? Math.round((unit.completedLessons / unit.totalLessons) * 100) 
                : 0;

              return (
                <div key={unit.unitNumber} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-bold text-foreground">Unit {unit.unitNumber}: {unit.unit}</p>
                      <p className="text-xs text-muted-foreground font-medium">{unit.completedLessons} lessons completed across all users</p>
                    </div>
                    <span className="font-bold text-sm text-primary">{percent}%</span>
                  </div>
                  <Progress value={percent} className="h-3 bg-muted" />
                </div>
              );
            })}

            {(!units || units.length === 0) && (
              <p className="text-center text-muted-foreground font-medium py-4">No unit data available yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}