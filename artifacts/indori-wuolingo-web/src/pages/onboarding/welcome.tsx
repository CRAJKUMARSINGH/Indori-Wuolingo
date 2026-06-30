import { Link } from "wouter";
import { ArrowRight, CircleCheckBig, Flame, Mic, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const highlights = [
  { icon: Flame, label: "Build daily streaks" },
  { icon: Trophy, label: "Earn XP and badges" },
  { icon: Mic, label: "Practice speaking" },
  { icon: CircleCheckBig, label: "Track real progress" },
];

export default function OnboardingWelcome() {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-primary via-indigo-600 to-violet-700 px-4 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-5xl flex-col justify-between gap-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-white/85 transition hover:text-white">
            Back to app
          </Link>
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em]">
            Onboarding
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl border border-white/30 bg-white/10 text-4xl font-black shadow-lg">
              I
            </div>
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/70">
                Welcome to Indori Wuolingo
              </p>
              <h1 className="max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
                Start learning with the same onboarding flow your mobile app already has.
              </h1>
              <p className="max-w-2xl text-base font-medium text-white/80 sm:text-lg">
                Pick your language, set a daily goal, and save your learner profile directly in the deployed web app.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-4 shadow-sm backdrop-blur"
                >
                  <item.icon className="h-5 w-5 text-white" />
                  <span className="font-semibold">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/onboarding/language">
                <Button
                  size="lg"
                  className="w-full rounded-2xl bg-white px-8 text-base font-bold text-primary hover:bg-white/90 sm:w-auto"
                >
                  Get started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/learn">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-2xl border-white/25 bg-transparent px-8 text-base font-bold text-white hover:bg-white/10 hover:text-white sm:w-auto"
                >
                  Skip to lessons
                </Button>
              </Link>
            </div>
          </div>

          <Card className="border-white/15 bg-white/10 text-white shadow-xl backdrop-blur">
            <CardContent className="space-y-5 p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
                  What this adds
                </p>
                <h2 className="mt-2 text-2xl font-black">Your previously broken web links now have real screens.</h2>
              </div>
              <div className="space-y-3 text-sm font-medium text-white/80">
                <p>`/onboarding/welcome` is now a real web route.</p>
                <p>`/onboarding/language` captures learner name and target language.</p>
                <p>`/onboarding/goals` stores goal and proficiency settings locally for the web build.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-white/75">
                These onboarding preferences are stored in your browser, so they are safe to use on Netlify without changing the API-backed lesson flow.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
