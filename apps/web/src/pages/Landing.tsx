import { useState, useEffect, Fragment } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Star, Trophy, Globe, Zap, Shield, BookOpen, Play, Check, X, Sparkles } from 'lucide-react';
import { useStore } from '@/store';
import { LANGUAGES } from '@/data/curriculum';

// A rotating cast of scripts for the hero device mockup — pulled straight from the real curriculum.
const SHOWCASE_CARDS = [
  { lang: 'Hindi', native: 'नमस्ते', translit: 'Namaste', meaning: 'Hello', color: '#C15B2B' },
  { lang: 'Tamil', native: 'வணக்கம்', translit: 'Vanakkam', meaning: 'Hello', color: '#0E7C7B' },
  { lang: 'Bengali', native: 'ধন্যবাদ', translit: 'Dhonnobad', meaning: 'Thank you', color: '#8E44AD' },
  { lang: 'Punjabi', native: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', translit: 'Sat Sri Akal', meaning: 'Hello', color: '#D4A017' },
  { lang: 'Telugu', native: 'నమస్కారం', translit: 'Namaskaram', meaning: 'Hello', color: '#76448A' },
  { lang: 'Urdu', native: 'شکریہ', translit: 'Shukriya', meaning: 'Thank you', color: '#1B5E4F' },
];

const COMPARISON_ROWS = [
  { feature: 'Rare & regional Indian scripts (Kashmiri, Sindhi, Odia, Assamese...)', indilingo: true, generic: false },
  { feature: 'Native-script lessons, not just romanization', indilingo: true, generic: 'partial' },
  { feature: 'Price', indilingo: 'Free, forever', generic: 'Paywalled after a few lessons' },
  { feature: 'Ads or upsell interruptions', indilingo: false, generic: true },
  { feature: 'Account required to start learning', indilingo: false, generic: true },
  { feature: 'Built specifically for the Indian diaspora', indilingo: true, generic: false },
];

function ComparisonCell({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="w-5 h-5 text-emerald-600 mx-auto" strokeWidth={3} />;
  if (value === false) return <X className="w-5 h-5 text-muted-foreground/50 mx-auto" strokeWidth={3} />;
  return <span className="text-sm font-semibold text-muted-foreground">{value}</span>;
}

export default function Landing() {
  const [, setLocation] = useLocation();
  const state = useStore();
  const hasUser = !!state.user;
  const [scrolled, setScrolled] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCardIndex(i => (i + 1) % SHOWCASE_CARDS.length), 2600);
    return () => clearInterval(interval);
  }, []);

  const primaryCTA = hasUser ? "Continue Learning" : "Start Learning Free";
  const primaryPath = hasUser ? "/learn" : "/onboarding";

  const availableLanguages = LANGUAGES.filter(l => l.available);
  const comingSoonLanguages = LANGUAGES.filter(l => !l.available);
  const sortedLanguages = [...availableLanguages, ...comingSoonLanguages];
  const marqueeScripts = [...availableLanguages, ...availableLanguages];

  const sectionReveal = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.6 }
  };

  const activeCard = SHOWCASE_CARDS[cardIndex];

  return (
    <div className="min-h-[100dvh] bg-background font-sans overflow-x-hidden">
      {/* NAV */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="font-['Bricolage_Grotesque'] text-2xl md:text-3xl font-extrabold tracking-tight">
            <span className="text-foreground">Indi</span><span className="text-primary">Lingo</span>
          </div>
          <button onClick={() => setLocation(hasUser ? "/learn" : "/onboarding")} className="btn-playful bg-primary text-primary-foreground px-5 py-2.5 text-sm md:text-base">
            {hasUser ? "Continue Learning" : "Sign Up Free"}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-[100dvh] flex items-center pt-28 pb-16 overflow-hidden">
        <div className="absolute top-[5%] right-[-10%] md:right-[5%] w-72 md:w-[28rem] h-72 md:h-[28rem] bg-primary/20 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-[5%] left-[-10%] md:left-[5%] w-72 md:w-96 h-72 md:h-96 bg-secondary/25 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          {/* Copy column */}
          <div className="text-center lg:text-left">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 inline-flex items-center gap-2">
              <span className="px-5 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm md:text-base tracking-wide border border-primary/20 inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> 15 Indian Languages · Zero Cost
              </span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[44px] md:text-[68px] leading-[1.08] font-['Bricolage_Grotesque'] font-extrabold text-foreground mb-8">
              Your heritage, <br /> in your voice.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground font-medium mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              While other apps stop at Hindi, we teach all 15 major Indian languages — Tamil, Bengali, Punjabi, Kashmiri, Sindhi and more — in their real scripts, not just Latin letters. No ads, no paywall, no account required.
            </motion.p>
            <div className="flex flex-col items-center lg:items-start gap-4">
              <button onClick={() => setLocation(primaryPath)} className="btn-playful bg-primary text-primary-foreground px-10 py-5 text-xl md:text-2xl">
                {primaryCTA}
              </button>
              <span className="text-sm text-muted-foreground font-medium">No account needed. Just your curiosity.</span>
            </div>

            {/* Trust stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              {[
                { value: '15', label: 'Languages' },
                { value: '124', label: 'Lessons' },
                { value: '$0', label: 'Forever' },
              ].map((s) => (
                <div key={s.label} className="text-center lg:text-left">
                  <div className="text-3xl md:text-4xl font-['Bricolage_Grotesque'] font-extrabold text-primary">{s.value}</div>
                  <div className="text-xs md:text-sm text-muted-foreground font-semibold uppercase tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Device mockup column */}
          <div className="relative mx-auto w-full max-w-[320px] lg:max-w-[360px]">
            {/* floating badges */}
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-6 -left-8 z-20 card-playful px-4 py-2.5 font-bold text-sm text-foreground bg-card shadow-md flex items-center gap-2 rotate-[-6deg]">
              <Flame className="w-4 h-4 text-orange-500" /> 7-day streak
            </motion.div>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -right-6 z-20 card-playful px-4 py-2.5 font-bold text-sm text-foreground bg-card shadow-md flex items-center gap-2 rotate-[5deg]">
              <Shield className="w-4 h-4 text-red-500" /> No account needed
            </motion.div>

            {/* phone frame */}
            <div className="relative rounded-[2.5rem] border-[6px] border-foreground/90 bg-foreground/90 shadow-2xl overflow-hidden aspect-[9/17]">
              <div className="absolute inset-[3px] rounded-[2.1rem] bg-background overflow-hidden flex flex-col">
                <div className="h-6 flex items-center justify-center shrink-0">
                  <div className="w-16 h-1.5 rounded-full bg-foreground/20" />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6 relative">
                  <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Translate this
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.div key={activeCard.lang} initial={{ opacity: 0, y: 16, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -16, scale: 0.95 }} transition={{ duration: 0.4 }}
                      className="w-full flex flex-col items-center gap-4">
                      <div className="text-xs font-bold uppercase tracking-widest" style={{ color: activeCard.color }}>{activeCard.lang}</div>
                      <div className="text-5xl font-bold text-foreground script-devanagari text-center leading-tight">{activeCard.native}</div>
                      <div className="text-muted-foreground font-semibold text-sm">{activeCard.translit}</div>
                      <div className="mt-2 w-full card-playful bg-card px-4 py-3 text-center font-bold text-foreground">
                        {activeCard.meaning}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  <div className="flex gap-1.5 mt-2">
                    {SHOWCASE_CARDS.map((_, i) => (
                      <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === cardIndex ? 'w-5 bg-primary' : 'w-1.5 bg-muted'}`} />
                    ))}
                  </div>
                </div>
                <div className="p-4 shrink-0">
                  <div className="btn-playful bg-primary text-primary-foreground w-full py-3 text-center text-sm font-bold">Check</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCRIPT MARQUEE */}
      <section className="bg-foreground py-8 overflow-hidden" aria-label={`Languages available: ${availableLanguages.map(l => l.name).join(', ')}`}>
        <div className="flex w-max animate-marquee" aria-hidden="true">
          {marqueeScripts.map((lang, i) => (
            <div key={`${lang.id}-${i}`} className="flex items-center gap-3 px-8 shrink-0">
              <span className="text-2xl">{lang.flagEmoji}</span>
              <span className={`text-2xl text-background font-semibold ${lang.scriptName.includes('Devanagari') ? 'script-devanagari' : ''}`}>{lang.nativeName}</span>
              <span className="text-background/30 text-xl">•</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-24 md:py-32 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 {...sectionReveal} className="text-3xl md:text-5xl font-['Bricolage_Grotesque'] font-bold text-center text-foreground mb-16 md:mb-24 max-w-3xl mx-auto leading-tight">
            Everything you need to fall in love with a language
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: Flame, title: "Daily Streaks", desc: "Build a habit with daily goals and streak rewards.", color: "text-orange-500", bg: "bg-orange-100" },
              { icon: Star, title: "XP & Levels", desc: "Earn experience points and level up as you learn.", color: "text-yellow-500", bg: "bg-yellow-100" },
              { icon: Trophy, title: "Leaderboards", desc: "Compete with learners worldwide on the weekly board.", color: "text-blue-500", bg: "bg-blue-100" },
              { icon: Globe, title: "15 Languages", desc: "From Hindi to Sindhi — all Indian scripts supported.", color: "text-green-500", bg: "bg-green-100" },
              { icon: Zap, title: "Bite-size Lessons", desc: "5-minute lessons that fit into any schedule.", color: "text-purple-500", bg: "bg-purple-100" },
              { icon: Shield, title: "No Sign-Up Required", desc: "Jump straight into lessons — your progress saves right in your browser.", color: "text-red-500", bg: "bg-red-100" },
            ].map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }} className="card-playful p-8 flex flex-col gap-6 bg-background h-full">
                <div className={`w-14 h-14 rounded-2xl border-2 shadow-sm flex items-center justify-center ${feature.color} ${feature.bg} border-border/50`}>
                  <feature.icon size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed text-lg">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="bg-white py-24 md:py-32 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2 {...sectionReveal} className="text-3xl md:text-5xl font-['Bricolage_Grotesque'] font-bold text-center text-foreground mb-4">
            Not another generic language app
          </motion.h2>
          <motion.p {...sectionReveal} className="text-center text-muted-foreground text-lg font-medium mb-16 max-w-2xl mx-auto">
            Most apps treat Indian languages as an afterthought. We built IndiLingo around them.
          </motion.p>
          <motion.div {...sectionReveal} className="card-playful bg-background overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_auto] md:grid-cols-[1fr_140px_140px]">
              <div className="p-4 md:p-5 font-bold text-muted-foreground text-sm uppercase tracking-wide border-b-2 border-border">Feature</div>
              <div className="p-4 md:p-5 font-['Bricolage_Grotesque'] font-extrabold text-primary text-center border-b-2 border-border text-sm md:text-base">IndiLingo</div>
              <div className="p-4 md:p-5 font-bold text-muted-foreground text-center border-b-2 border-border text-sm md:text-base">Typical Apps</div>
              {COMPARISON_ROWS.map((row, i) => (
                <Fragment key={i}>
                  <div className={`p-4 md:p-5 font-semibold text-foreground text-sm md:text-base ${i < COMPARISON_ROWS.length - 1 ? 'border-b border-border/60' : ''}`}>{row.feature}</div>
                  <div className={`p-4 md:p-5 flex items-center justify-center ${i < COMPARISON_ROWS.length - 1 ? 'border-b border-border/60' : ''}`}><ComparisonCell value={row.indilingo} /></div>
                  <div className={`p-4 md:p-5 flex items-center justify-center ${i < COMPARISON_ROWS.length - 1 ? 'border-b border-border/60' : ''}`}><ComparisonCell value={row.generic} /></div>
                </Fragment>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* LANGUAGES SHOWCASE */}
      <section className="bg-muted/40 py-24 md:py-32 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 {...sectionReveal} className="text-3xl md:text-5xl font-['Bricolage_Grotesque'] font-bold text-center text-foreground mb-16 md:mb-24">
            Start with any language
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-5">
            {sortedLanguages.map((lang, i) => {
              const isDevanagari = lang.scriptName.includes('Devanagari');
              return (
                <motion.div key={lang.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.4, delay: i * 0.04 }}
                  className={`relative overflow-hidden card-playful w-full sm:w-[calc(50%-10px)] md:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)] p-6 flex flex-col gap-2 bg-card ${!lang.available ? 'opacity-70 grayscale-[0.3]' : ''}`}
                  style={{ borderLeft: lang.available ? `6px solid ${lang.colorHex}` : undefined }}>
                  {!lang.available && (
                    <div className="absolute top-4 right-4 px-2.5 py-1 bg-muted/80 text-muted-foreground text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-sm">
                      Coming Soon
                    </div>
                  )}
                  <div className="text-[3rem] leading-none mb-2">{lang.flagEmoji}</div>
                  <div className="font-bold text-xl text-foreground">{lang.name}</div>
                  <div className={`text-2xl text-foreground/80 ${isDevanagari ? 'script-devanagari' : ''}`}>{lang.nativeName}</div>
                  <div className="text-sm text-muted-foreground font-semibold uppercase tracking-widest mt-2">{lang.scriptName}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-24 md:py-32 px-4 md:px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.h2 {...sectionReveal} className="text-3xl md:text-5xl font-['Bricolage_Grotesque'] font-bold text-center text-foreground mb-20 md:mb-32">
            How IndiLingo works
          </motion.h2>
          <div className="relative flex flex-col md:flex-row gap-16 md:gap-8 justify-between">
            <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-0.5 border-t-4 border-dashed border-muted z-0" />
            {[
              { num: 1, icon: BookOpen, title: "Pick your language", desc: "Choose from 15 Indian languages — from the common to the rare." },
              { num: 2, icon: Play, title: "Play through lessons", desc: "Answer questions, arrange words, and train your ear — 5 minutes a day." },
              { num: 3, icon: Trophy, title: "Climb the board", desc: "Earn XP, unlock badges, and track your streak as you rise up the leaderboard." }
            ].map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative z-10 flex flex-col items-center text-center flex-1">
                <div className="w-32 h-32 rounded-[2.5rem] bg-card border-[3px] shadow-md flex items-center justify-center text-5xl font-['Bricolage_Grotesque'] font-black text-primary mb-8 rotate-[-4deg] hover:rotate-0 transition-transform duration-300">
                  {step.num}
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <step.icon size={24} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{step.title}</h3>
                <p className="text-muted-foreground font-medium px-4 text-lg leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="bg-gradient-to-r from-primary/90 to-accent py-24 md:py-32 px-4 md:px-6 text-center relative overflow-hidden">
        <motion.div {...sectionReveal} className="max-w-4xl mx-auto flex flex-col items-center gap-10 relative z-10">
          <h2 className="text-5xl md:text-7xl font-['Bricolage_Grotesque'] font-extrabold text-white leading-tight">Ready to start?</h2>
          <p className="text-xl md:text-3xl text-white/90 font-medium max-w-2xl">Join thousands of learners reconnecting with India's languages.</p>
          <button onClick={() => setLocation(primaryPath)} className="btn-playful bg-white text-primary px-12 py-6 text-2xl mt-6 border-none shadow-[0_6px_0_rgba(0,0,0,0.15)] hover:-translate-y-1 active:translate-y-2 active:shadow-none">
            {primaryCTA}
          </button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="bg-background py-10 px-4 md:px-8 border-t-2 border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-base text-muted-foreground font-medium">
          <div className="font-['Bricolage_Grotesque'] text-2xl font-extrabold tracking-tight flex items-center gap-1">
            <span className="text-foreground">Indi</span><span className="text-primary">Lingo</span>
          </div>
          <div>15 Indian languages. Free forever.</div>
          <div>Built with love for the diaspora.</div>
        </div>
      </footer>
    </div>
  );
}
