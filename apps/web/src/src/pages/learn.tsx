import { useListUnitsForLanguage, useListLanguages, getListUnitsForLanguageQueryKey } from '@workspace/api-client-react';
import { useStore } from '@/lib/store';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Lock, Play, Star, BookType } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Learn() {
  const userId = useStore(state => state.userId);
  const selectedLanguageId = useStore(state => state.selectedLanguageId);
  const [_, setLocation] = useLocation();

  const { data: units, isLoading: isLoadingUnits } = useListUnitsForLanguage(
    selectedLanguageId || '', 
    userId || '', 
    { query: { enabled: !!selectedLanguageId && !!userId, queryKey: getListUnitsForLanguageQueryKey(selectedLanguageId || '', userId || '') } }
  );

  const { data: languages } = useListLanguages();
  
  if (!selectedLanguageId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center text-4xl shadow-sm mb-4">
          ?
        </div>
        <h2 className="text-3xl font-serif font-bold text-foreground">No Language Selected</h2>
        <p className="text-muted-foreground max-w-md">Please choose a language to start learning.</p>
        <Button onClick={() => setLocation('/home')} size="lg" className="mt-4">
          Browse Languages
        </Button>
      </div>
    );
  }

  const selectedLanguage = languages?.find(l => l.id === selectedLanguageId);

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4 mb-12">
        {selectedLanguage && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 text-primary rounded-full font-medium mb-2 border border-primary/20">
            <span className="text-2xl">{selectedLanguage.flagEmoji}</span>
            Learning {selectedLanguage.name}
          </motion.div>
        )}
        <h1 className="text-4xl font-serif font-bold text-foreground">Your Path</h1>
      </div>

      {isLoadingUnits ? (
        <div className="space-y-12">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <div className="flex flex-col items-center gap-4 py-8">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-16 w-16 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : units?.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground text-lg">No content available for this language yet.</p>
        </Card>
      ) : (
        <div className="space-y-16">
          {units?.map((unit, unitIdx) => (
            <div key={unit.id} className="relative">
              {/* Unit Header */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`p-6 rounded-2xl border-2 shadow-sm sticky top-4 z-20 ${
                  unit.order === 1 
                    ? 'bg-secondary text-secondary-foreground border-secondary-border' 
                    : 'bg-primary text-primary-foreground border-primary-border'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-serif font-bold mb-1">Unit {unit.order}: {unit.title}</h2>
                    <p className="opacity-90">{unit.description}</p>
                    {unit.order === 1 && (
                      <div className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium bg-black/10 px-3 py-1 rounded-full">
                        <BookType className="w-4 h-4" />
                        Learn to Read & Write
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Path Path */}
              <div className="py-12 relative flex flex-col items-center">
                {/* Connecting Line */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 bg-muted rounded-full z-0" />

                {unit.lessons.map((lesson, lessonIdx) => {
                  const isLocked = !lesson.completed && lessonIdx > 0 && !unit.lessons[lessonIdx - 1].completed;
                  const isCurrent = !lesson.completed && (lessonIdx === 0 || unit.lessons[lessonIdx - 1].completed);
                  
                  // Zig-zag offset
                  const offset = lessonIdx % 2 === 0 ? 'translate-x-[-60px]' : 'translate-x-[60px]';

                  return (
                    <motion.div 
                      key={lesson.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      className={`relative z-10 my-6 ${offset}`}
                    >
                      {isLocked ? (
                        <div className="w-20 h-20 rounded-full bg-muted border-4 border-muted-foreground/20 flex flex-col items-center justify-center text-muted-foreground shadow-sm">
                          <Lock className="w-8 h-8" />
                        </div>
                      ) : (
                        <Link href={`/lesson/${lesson.id}`}>
                          <div className="relative group cursor-pointer">
                            {isCurrent && (
                              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-foreground font-bold px-4 py-2 rounded-xl shadow-lg border border-border whitespace-nowrap animate-bounce z-20">
                                START
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white" />
                              </div>
                            )}
                            
                            <div className={`
                              w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg border-4 transition-transform active:scale-95 group-hover:scale-105
                              ${lesson.completed 
                                ? unit.order === 1 ? 'bg-secondary border-secondary-foreground/20 text-secondary-foreground' : 'bg-primary border-primary-foreground/20 text-primary-foreground' 
                                : unit.order === 1 ? 'bg-secondary/20 border-secondary text-secondary' : 'bg-primary/20 border-primary text-primary'
                              }
                            `}>
                              {lesson.completed ? (
                                <CheckCircle2 className="w-10 h-10" />
                              ) : (
                                <Play className="w-8 h-8 ml-1" />
                              )}
                            </div>

                            {/* Stars if completed */}
                            {lesson.completed && (
                              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-0.5 bg-background border border-border px-2 py-0.5 rounded-full shadow-sm">
                                {[...Array(3)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-3 h-3 ${i < lesson.stars ? 'fill-yellow-400 text-yellow-500' : 'text-muted fill-muted'}`} 
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </Link>
                      )}
                      
                      {/* Lesson title tooltip-ish label */}
                      <div className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-medium text-sm text-foreground/80 bg-background/80 px-2 py-1 rounded-md backdrop-blur-sm
                        ${lessonIdx % 2 === 0 ? 'left-[100px]' : 'right-[100px]'}
                      ">
                        {lesson.title}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
