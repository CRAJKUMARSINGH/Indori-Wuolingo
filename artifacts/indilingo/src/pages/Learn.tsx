import React from 'react';
import { useLocation, Redirect } from 'wouter';
import { useGetUserLanguageUnits, getGetUserLanguageUnitsQueryKey } from '@workspace/api-client-react';
import { useStore } from '@/store';
import { BookOpen, Check, Lock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Learn() {
  const [, setLocation] = useLocation();
  const userId = useStore((state) => state.userId);
  const selectedLanguageId = useStore((state) => state.selectedLanguageId);

  const { data: units, isLoading } = useGetUserLanguageUnits(
    userId!, 
    selectedLanguageId!, 
    { query: { enabled: !!userId && !!selectedLanguageId, queryKey: getGetUserLanguageUnitsQueryKey(userId!, selectedLanguageId!) } }
  );

  if (!userId) return <Redirect to="/" />;
  if (!selectedLanguageId) return <Redirect to="/languages" />;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <div className="animate-pulse w-12 h-12 bg-primary/20 rounded-full" />
      </div>
    );
  }

  // To determine if a lesson is locked, we find the first uncompleted lesson overall
  let firstUncompletedFound = false;

  return (
    <div className="py-10 px-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black">Path</h1>
        <button 
          onClick={() => setLocation('/languages')}
          className="text-muted-foreground font-bold hover:text-foreground underline decoration-2 underline-offset-4"
        >
          Change Language
        </button>
      </div>

      <div className="flex flex-col gap-12">
        {units?.map((unit, unitIndex) => (
          <div key={unit.id} className="relative">
            <div className={cn(
              "p-6 rounded-[2rem] border-2 border-border shadow-playful-sm mb-8 text-white relative overflow-hidden",
              unit.unitType === 'script' ? "bg-primary" : "bg-secondary"
            )}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black mb-1">Unit {unitIndex + 1}: {unit.title}</h2>
                  <p className="text-white/80 font-medium">{unit.description}</p>
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-xl font-bold border-2 border-white/20 backdrop-blur-sm">
                  {unit.unitType.charAt(0).toUpperCase() + unit.unitType.slice(1)}
                </div>
              </div>
            </div>

            <div className="py-4 relative flex flex-col items-center zig-zag-path">
              {unit.lessons.map((lesson, lessonIndex) => {
                const isCompleted = lesson.completed;
                const isLocked = !isCompleted && firstUncompletedFound;
                const isCurrent = !isCompleted && !firstUncompletedFound;
                
                if (isCurrent) firstUncompletedFound = true;

                // Alternate left/right offset for zig-zag
                const offsetX = Math.sin(lessonIndex * 1.5) * 60;

                return (
                  <div 
                    key={lesson.id} 
                    className="relative my-4 flex items-center justify-center w-full"
                  >
                    <div 
                      className="relative z-10 transition-transform"
                      style={{ transform: `translateX(${offsetX}px)` }}
                    >
                      {isCurrent && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-2 rounded-xl border-2 border-border shadow-playful text-sm font-bold text-foreground whitespace-nowrap animate-bounce">
                          START
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-border rotate-45" />
                        </div>
                      )}
                      
                      <button
                        disabled={isLocked}
                        onClick={() => setLocation(`/lesson/${lesson.id}`)}
                        className={cn(
                          "w-20 h-20 rounded-full border-[3px] flex items-center justify-center text-3xl transition-all relative",
                          isCompleted ? "bg-primary border-primary-border shadow-playful-sm text-white" :
                          isCurrent ? "bg-accent border-accent-border shadow-playful text-foreground btn-playful w-24 h-24" :
                          "bg-muted border-muted-border text-muted-foreground"
                        )}
                      >
                        {isCompleted ? <Check className="w-10 h-10" strokeWidth={3} /> :
                         isLocked ? <Lock className="w-8 h-8" strokeWidth={2.5} /> :
                         <Star className="w-12 h-12 fill-current" strokeWidth={2} />}
                      </button>
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
