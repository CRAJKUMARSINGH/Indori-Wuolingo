import React from 'react';
import { Redirect } from 'wouter';
import { useStore } from '@/store';
import { Flame, Star, Award, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppShell } from '@/components/AppShell';
import { TopBar } from '@/components/TopBar';
import { getLanguage, LANGUAGES } from '@/data/languages';
import { useProgress } from '@/lib/progress';
import { LESSONS_PER_UNIT } from '@/lib/lessons';

export function Profile() {
  const userId = useStore((state) => state.userId);
  const { state, hydrated, reset } = useProgress();
  const lang = getLanguage(state.currentLang);

  if (!userId) return <Redirect to="/" />;

  if (!hydrated) {
    return <div className="p-8 text-xl font-bold animate-pulse text-center">Loading profile...</div>;
  }

  // Calculate language progress
  const languageProgress = LANGUAGES.map((language) => {
    const langProgress = state.progress[language.code];
    const totalUnits = 6; // script, numerals, words, phrases, grammar, conversation
    const totalLessons = totalUnits * LESSONS_PER_UNIT;
    const completedLessons = Object.values(langProgress || {}).reduce((sum, lessons) => sum + lessons, 0);
    const percentage = Math.round((completedLessons / totalLessons) * 100) || 0;
    
    return {
      language,
      completedLessons,
      totalLessons,
      percentage,
    };
  }).filter(lp => lp.completedLessons > 0);

  // Mock achievements based on progress
  const achievements = [
    { id: 1, name: "First Steps", description: "Complete your first lesson", unlocked: state.xp > 0 },
    { id: 2, name: "Week Warrior", description: "Maintain a 7-day streak", unlocked: state.streak >= 7 },
    { id: 3, name: "Century Club", description: "Earn 100 XP", unlocked: state.xp >= 100 },
    { id: 4, name: "Script Master", description: "Complete script unit", unlocked: languageProgress.some(lp => lp.completedLessons >= LESSONS_PER_UNIT) },
    { id: 5, name: "Polyglot", description: "Start 2 languages", unlocked: languageProgress.length >= 2 },
    { id: 6, name: "Dedicated", description: "Maintain a 30-day streak", unlocked: state.streak >= 30 },
  ];

  return (
    <AppShell>
      <TopBar lang={lang} streak={state.streak} xp={state.xp} />
      
      <div className="py-10 px-4 max-w-4xl mx-auto space-y-10">
        
        {/* Header Info */}
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          <div className="w-32 h-32 bg-primary text-primary-foreground rounded-[2.5rem] flex items-center justify-center text-5xl font-black shadow-playful border-[3px] border-border rotate-3">
            {lang.native.charAt(0)}
          </div>
          <div className="flex-1 space-y-2">
            <h1 className="text-4xl font-display font-black">{lang.name} Learner</h1>
            <p className="text-muted-foreground font-medium text-lg">
              Learning {lang.native}
            </p>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card-playful p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
              <Flame size={28} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">{state.streak}</div>
              <div className="text-sm font-bold text-muted-foreground">Day Streak</div>
            </div>
          </div>
          <div className="card-playful p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
              <Star size={28} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">{state.xp}</div>
              <div className="text-sm font-bold text-muted-foreground">Total XP</div>
            </div>
          </div>
        </div>

        {/* Language Progress */}
        <div>
          <h2 className="text-2xl font-display font-black mb-6">Languages</h2>
          <div className="space-y-4">
            {languageProgress.length === 0 ? (
              <div className="text-muted-foreground font-medium p-4 border-2 border-dashed rounded-2xl">
                No languages started yet. Start learning!
              </div>
            ) : (
              languageProgress.map((lp) => (
                <div key={lp.language.code} className="card-playful p-6 flex flex-col md:flex-row items-center gap-6">
                  <div className="text-6xl" style={{ fontFamily: lp.language.fontFamily }}>
                    {lp.language.native}
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <h3 className="text-xl font-bold">{lp.language.name}</h3>
                        <div className="text-sm text-muted-foreground">{lp.language.native}</div>
                      </div>
                      <div className="font-black text-primary">{lp.percentage}%</div>
                    </div>
                    <div className="w-full h-4 bg-muted rounded-full overflow-hidden border-2 border-border/10">
                      <div 
                        className="h-full bg-primary transition-all duration-1000" 
                        style={{ width: `${lp.percentage}%` }}
                      />
                    </div>
                    <div className="mt-2 text-sm font-bold text-muted-foreground text-right">
                      {lp.completedLessons} / {lp.totalLessons} lessons
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Achievements / Badges */}
        <div>
          <h2 className="text-2xl font-display font-black mb-6 flex items-center gap-2">
            <Award className="text-accent" /> Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={cn(
                  "p-6 rounded-3xl border-2 flex flex-col items-center text-center transition-all",
                  achievement.unlocked 
                    ? "bg-card border-border shadow-playful-sm" 
                    : "bg-muted/30 border-muted text-muted-foreground opacity-70 grayscale"
                )}
              >
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center mb-4 text-white border-4 border-white shadow-sm",
                  achievement.unlocked ? "bg-accent" : "bg-muted-foreground"
                )}>
                  <Shield size={32} />
                </div>
                <h4 className="font-black text-lg mb-1">{achievement.name}</h4>
                <p className="text-sm font-medium">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <div className="pt-8 border-t border-border">
          <button
            onClick={() => {
              if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
                reset();
              }
            }}
            className="text-destructive font-medium hover:underline"
          >
            Reset All Progress
          </button>
        </div>

      </div>
    </AppShell>
  );
}
