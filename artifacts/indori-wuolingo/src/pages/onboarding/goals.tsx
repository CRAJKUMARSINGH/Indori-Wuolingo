import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Rocket, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GOALS,
  PROFICIENCY_LEVELS,
  readOnboardingProfile,
  saveOnboardingProfile,
} from "@/lib/onboarding";
import { cn } from "@/lib/utils";

export default function OnboardingGoals() {
  const [, navigate] = useLocation();
  const storedProfile = useMemo(() => readOnboardingProfile(), []);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(storedProfile.dailyGoalMinutes);
  const [proficiency, setProficiency] = useState(storedProfile.proficiency);

  function handleFinish() {
    saveOnboardingProfile({
      ...storedProfile,
      dailyGoalMinutes,
      proficiency,
      completedAt: new Date().toISOString(),
    });
    navigate("/learn");
  }

  return (
    <div className="min-h-[100dvh] bg-background px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/onboarding/language" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span className="h-2.5 w-8 rounded-full bg-primary" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Step 2
              </p>
              <h1 className="text-3xl font-black tracking-tight">
                Set a daily pace for {storedProfile.name || "your"} journey.
              </h1>
              <p className="max-w-2xl text-sm font-medium text-muted-foreground">
                Choose a realistic daily goal and tell the web app how familiar you already are with the language.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {GOALS.map((goal) => {
                const isSelected = dailyGoalMinutes === goal.minutes;
                return (
                  <button
                    key={goal.minutes}
                    type="button"
                    onClick={() => setDailyGoalMinutes(goal.minutes)}
                    className={cn(
                      "rounded-3xl border-2 bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                      isSelected ? "border-primary bg-primary/5" : "border-border"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <Target className={cn("h-6 w-6", isSelected ? "text-primary" : "text-muted-foreground")} />
                      <span className={cn("text-sm font-bold", isSelected ? "text-primary" : "text-muted-foreground")}>
                        {goal.minutes} min
                      </span>
                    </div>
                    <h2 className="mt-4 text-xl font-black text-foreground">{goal.label}</h2>
                    <p className="mt-1 text-sm font-medium text-muted-foreground">{goal.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-black text-foreground">Your current level</h2>
              {PROFICIENCY_LEVELS.map((level) => {
                const isSelected = proficiency === level.level;
                return (
                  <button
                    key={level.level}
                    type="button"
                    onClick={() => setProficiency(level.level)}
                    className={cn(
                      "flex w-full items-start justify-between rounded-3xl border-2 bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                      isSelected ? "border-primary bg-primary/5" : "border-border"
                    )}
                  >
                    <div>
                      <h3 className="text-lg font-black text-foreground">{level.label}</h3>
                      <p className="mt-1 text-sm font-medium text-muted-foreground">{level.description}</p>
                    </div>
                    <span
                      className={cn(
                        "mt-1 inline-flex h-5 w-5 rounded-full border-2",
                        isSelected ? "border-primary bg-primary" : "border-border"
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <Card className="border-2 shadow-sm">
            <CardContent className="space-y-5 p-6">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  Summary
                </p>
                <h2 className="text-2xl font-black">Ready to launch your learning setup.</h2>
              </div>

              <div className="space-y-3 rounded-3xl border border-border bg-muted/40 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">Learner</span>
                  <span className="font-bold text-foreground">{storedProfile.name || "Learner"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">Language</span>
                  <span className="font-bold capitalize text-foreground">{storedProfile.targetLanguage}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">Daily goal</span>
                  <span className="font-bold text-foreground">{dailyGoalMinutes} min/day</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">Level</span>
                  <span className="font-bold text-foreground">
                    {PROFICIENCY_LEVELS.find((level) => level.level === proficiency)?.label}
                  </span>
                </div>
              </div>

              <p className="text-sm font-medium text-muted-foreground">
                Finishing onboarding stores these preferences in local storage and sends you to the lesson map.
              </p>

              <Button size="lg" className="w-full rounded-2xl text-base font-bold" onClick={handleFinish}>
                Start learning
                <Rocket className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
