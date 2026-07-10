import React from 'react';
import { useLocation, Redirect } from 'wouter';
import { useStore } from '@/store';
import { Check, Lock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppShell } from '@/components/AppShell';
import { TopBar } from '@/components/TopBar';
import { getLanguage, UNITS, type UnitKey } from '@/data/languages';
import { useProgress, unitProgressPct } from '@/lib/progress';
import { LESSONS_PER_UNIT } from '@/lib/lessons';

export function Learn() {
  const [, setLocation] = useLocation();
  const userId = useStore((state) => state.userId);
  const { state, hydrated, setLanguage } = useProgress();
  const lang = getLanguage(state.currentLang);

  if (!userId) return <Redirect to="/" />;

  const unitStatus = (unit: UnitKey, i: number) => {
    const done = state.progress[lang.code]?.[unit] ?? 0;
    if (done >= LESSONS_PER_UNIT) return "done" as const;
    const prev = i === 0 ? "done" : (state.progress[lang.code]?.[UNITS[i - 1].key as UnitKey] ?? 0) >= LESSONS_PER_UNIT ? "done" : "locked";
    return prev === "done" ? "active" : "locked";
  };

  const currentUnitIdx = UNITS.findIndex((u, i) => unitStatus(u.key as UnitKey, i) === "active");
  const currentUnit = UNITS[currentUnitIdx >= 0 ? currentUnitIdx : UNITS.length - 1];
  const currentPct = unitProgressPct(state, lang.code, currentUnit.key as UnitKey, LESSONS_PER_UNIT);
  const totalLessons = UNITS.length * LESSONS_PER_UNIT;
  const completedInLang = UNITS.reduce(
    (n, u) => n + Math.min(LESSONS_PER_UNIT, state.progress[lang.code]?.[u.key as UnitKey] ?? 0),
    0,
  );
  const lessonsInLang = UNITS.length * LESSONS_PER_UNIT;

  return (
    <AppShell>
      <TopBar lang={lang} streak={hydrated ? state.streak : 0} xp={hydrated ? state.xp : 0} />

      <section className="px-5 pt-8 pb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 block">
          Unit {currentUnitIdx + 1} of {UNITS.length} · {lang.name}
        </span>
        <h1 className="text-3xl font-display font-medium leading-tight mb-3">
          {currentUnit.title}
        </h1>
        <p className="text-base text-muted-foreground mb-6">{currentUnit.subtitle}</p>
        <p className="text-xs text-muted-foreground mb-4 tabular-nums">
          {completedInLang} / {lessonsInLang} lessons in {lang.name} ·
          {" "}{totalLessons.toLocaleString()} across all languages
        </p>
        <div className="bg-muted h-2 rounded-full overflow-hidden ring-1 ring-border mb-4">
          <div
            className="bg-primary h-full rounded-full transition-all duration-1000"
            style={{ width: `${currentPct}%` }}
          />
        </div>
        <button
          onClick={() => setLocation(`/lesson/${currentUnit.key}`)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-2xl font-medium tracking-wide hover:bg-primary/90 transition-colors"
        >
          Continue lesson
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0-6.75-6.75M19.5 12l-6.75 6.75" />
          </svg>
        </button>
      </section>

      <div className="relative flex flex-col items-center gap-14 py-6 px-5">
        <div className="absolute top-0 bottom-0 w-px bg-border/20 -z-10" />
        {UNITS.map((u, i) => {
          const status = unitStatus(u.key as UnitKey, i);
          const glyph = lang.aksharas[i % lang.aksharas.length]?.char ?? "अ";
          const align = i % 2 === 0 ? "left" : "right";
          const done = status === "done";
          const active = status === "active";
          const size = active ? "size-24 text-3xl" : "size-20 text-2xl";
          const bg = done ? "bg-primary text-primary-foreground" : active ? "bg-secondary text-secondary-foreground shadow-xl shadow-secondary/20" : "bg-muted text-muted-foreground";
          const opacity = status === "locked" ? "opacity-50" : "";

          const NodeInner = (
            <div className={`relative ${opacity}`}>
              <div className={`${size} rounded-full ${bg} flex items-center justify-center ring-8 ring-background font-serif`}>
                <span style={{ fontFamily: lang.fontFamily }}>{glyph}</span>
                {done && (
                  <div className="absolute -bottom-1 -right-1 size-6 bg-yellow-500 rounded-full flex items-center justify-center ring-2 ring-background">
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="var(--background)" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                )}
              </div>
              <div className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap ${align === "left" ? "left-24 text-left" : "right-24 text-right"}`}>
                {active && (
                  <span className="block text-[10px] font-semibold text-secondary uppercase tracking-widest mb-1">
                    In progress
                  </span>
                )}
                <span className={`block text-base font-display font-medium leading-tight ${status === "locked" ? "text-muted-foreground" : ""}`}>
                  {u.title}
                </span>
              </div>
            </div>
          );

          return status === "locked" ? (
            <div key={u.key}>{NodeInner}</div>
          ) : (
            <button key={u.key} onClick={() => setLocation(`/lesson/${u.key}`)} className="block">
              {NodeInner}
            </button>
          );
        })}
      </div>

      <section className="px-5 mt-12">
        <div className="bg-card rounded-[24px] p-6 ring-1 ring-border flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-display font-medium mb-1">Daily greeting</h3>
              <p className="text-sm text-muted-foreground">Today's phrase in {lang.name}</p>
            </div>
            <div className="bg-secondary/10 p-2 rounded-xl">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </div>
          </div>
          <div className="text-center py-6 bg-muted/50 rounded-[16px] ring-1 ring-border">
            <div className="text-4xl mb-2 font-display" style={{ fontFamily: lang.fontFamily }}>
              {lang.greeting}
            </div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Hello</div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
