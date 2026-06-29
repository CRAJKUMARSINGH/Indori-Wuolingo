import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LANGUAGES, readOnboardingProfile, saveOnboardingProfile } from "@/lib/onboarding";
import { cn } from "@/lib/utils";

export default function OnboardingLanguage() {
  const [, navigate] = useLocation();
  const storedProfile = useMemo(() => readOnboardingProfile(), []);
  const [name, setName] = useState(storedProfile.name);
  const [targetLanguage, setTargetLanguage] = useState(storedProfile.targetLanguage);

  const canContinue = Boolean(name.trim()) && Boolean(targetLanguage);

  function handleContinue() {
    if (!canContinue) {
      return;
    }

    saveOnboardingProfile({
      ...storedProfile,
      name: name.trim(),
      targetLanguage,
    });
    navigate("/onboarding/goals");
  }

  return (
    <div className="min-h-[100dvh] bg-muted/30 px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/onboarding/welcome" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-8 rounded-full bg-primary" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-2 shadow-sm">
            <CardContent className="space-y-5 p-6">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  Step 1
                </p>
                <h1 className="text-3xl font-black tracking-tight">Who are you learning as?</h1>
                <p className="text-sm font-medium text-muted-foreground">
                  Save a display name and choose the language you want to focus on in the web build.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground" htmlFor="learner-name">
                  Your name
                </label>
                <Input
                  id="learner-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Priya"
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="rounded-2xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
                This step stores preferences only in the browser so the deployed app gets a working onboarding flow without changing existing API users.
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {LANGUAGES.map((language) => {
              const isSelected = targetLanguage === language.code;
              return (
                <button
                  key={language.code}
                  type="button"
                  disabled={Boolean(language.comingSoon)}
                  onClick={() => !language.comingSoon && setTargetLanguage(language.code)}
                  className={cn(
                    "w-full rounded-3xl border-2 bg-card p-5 text-left shadow-sm transition",
                    language.comingSoon
                      ? "cursor-not-allowed opacity-60"
                      : "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
                    isSelected && "border-primary bg-primary/5"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-black text-foreground">{language.name}</h2>
                        {language.comingSoon && (
                          <span className="rounded-full bg-muted px-2 py-1 text-xs font-bold uppercase text-muted-foreground">
                            Soon
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-primary">{language.script}</p>
                      <p className="text-sm font-medium text-muted-foreground">{language.speakers}</p>
                    </div>
                    {isSelected && !language.comingSoon ? (
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-5 w-5" />
                      </span>
                    ) : (
                      <span className="inline-flex h-9 w-9 rounded-full border border-border" />
                    )}
                  </div>
                </button>
              );
            })}

            <Button
              size="lg"
              className="mt-2 w-full rounded-2xl text-base font-bold"
              disabled={!canContinue}
              onClick={handleContinue}
            >
              Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
