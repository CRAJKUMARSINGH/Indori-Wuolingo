import { useListLessons, useListProgress, useGetMe, getListLessonsQueryKey, getListProgressQueryKey, getGetMeQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Star, Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function Learn() {
  const { data: lessons, isLoading: lessonsLoading } = useListLessons({ query: { enabled: true, queryKey: getListLessonsQueryKey() } });
  const { data: me, isLoading: userLoading } = useGetMe({ query: { enabled: true, queryKey: getGetMeQueryKey() } });
  const { data: progress, isLoading: progressLoading } = useListProgress({ userId: me?.userId }, { query: { enabled: true, queryKey: getListProgressQueryKey({ userId: me?.userId }) } });

  const isLoading = lessonsLoading || progressLoading;

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto space-y-8 py-8">
        <Skeleton className="h-24 w-full rounded-3xl" />
        <div className="flex flex-col items-center gap-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="w-20 h-20 rounded-full" />)}
        </div>
      </div>
    );
  }

  // Group lessons by unit
  const units = lessons?.reduce((acc, lesson) => {
    if (!acc[lesson.unitNumber]) {
      acc[lesson.unitNumber] = {
        title: lesson.unit,
        number: lesson.unitNumber,
        lessons: []
      };
    }
    acc[lesson.unitNumber].lessons.push(lesson);
    return acc;
  }, {} as Record<number, { title: string, number: number, lessons: typeof lessons }>) || {};

  const progressMap = progress?.reduce((acc, p) => {
    acc[p.lessonId] = p;
    return acc;
  }, {} as Record<number, typeof progress[0]>) || {};

  let highestUnlockedOrder = 0;
  lessons?.forEach(lesson => {
    const p = progressMap[lesson.id];
    if (p?.completed && lesson.order > highestUnlockedOrder) {
      highestUnlockedOrder = lesson.order;
    }
  });
  // Next lesson is unlocked
  highestUnlockedOrder += 1;
  // Fallback if none completed
  if (highestUnlockedOrder === 1 && !progress?.length) {
    highestUnlockedOrder = 1;
  }

  return (
    <div className="max-w-lg mx-auto pb-12 animate-in fade-in duration-500">
      <div className="space-y-12">
        {Object.values(units).map((unit) => (
          <div key={unit.number} className="space-y-6">
            <div className="bg-primary text-primary-foreground rounded-3xl p-6 shadow-sm border-2 border-b-4 border-primary-border relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-xl font-bold opacity-90 mb-1">Unit {unit.number}</h2>
                <h3 className="text-2xl font-display font-bold">{unit.title}</h3>
              </div>
            </div>

            <div className="flex flex-col items-center py-4 relative">
              {/* Connection line behind nodes */}
              <div className="absolute top-0 bottom-0 w-4 bg-muted rounded-full -z-10" />

              {unit.lessons.sort((a,b) => a.order - b.order).map((lesson, idx) => {
                const isCompleted = progressMap[lesson.id]?.completed;
                const isUnlocked = lesson.order <= highestUnlockedOrder;
                const isCurrent = lesson.order === highestUnlockedOrder;
                
                // create a wavy path
                const xOffset = Math.sin(idx * 1.5) * 40;

                return (
                  <div 
                    key={lesson.id} 
                    className="relative w-full flex justify-center py-4"
                  >
                    <div 
                      className="relative z-10"
                      style={{ transform: `translateX(${xOffset}px)` }}
                    >
                      {isUnlocked ? (
                        <Link href={`/lesson/${lesson.id}`}>
                          <div className={cn(
                            "relative group flex items-center justify-center w-20 h-20 rounded-full border-b-[6px] transition-all cursor-pointer",
                            isCompleted 
                              ? "bg-secondary border-secondary-border" 
                              : isCurrent
                                ? "bg-primary border-primary-border ring-4 ring-primary/30 ring-offset-2"
                                : "bg-card border-card-border"
                          )}>
                            {isCompleted ? (
                              <Check className="w-10 h-10 text-white" strokeWidth={3} />
                            ) : (
                              <Star className={cn("w-10 h-10", isCurrent ? "text-white" : "text-primary")} strokeWidth={isCurrent ? 2 : 2.5} fill={isCurrent ? "white" : "none"} />
                            )}
                            
                            {/* Floating tooltip */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-sm font-bold py-2 px-4 rounded-xl shadow-lg border-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                              {lesson.title}
                              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-popover" />
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted border-b-[6px] border-muted-border cursor-not-allowed">
                          <Lock className="w-8 h-8 text-muted-foreground" strokeWidth={2.5} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}