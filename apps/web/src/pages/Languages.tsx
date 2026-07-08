import { useLocation } from 'wouter';
import { useStore, store } from '@/store';
import { LANGUAGES } from '@/data/curriculum';
import { Flame, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Languages() {
  const [, setLocation] = useLocation();
  const state = useStore();

  const handleSelect = (langId: string) => {
    store.selectLanguage(langId);
    setLocation('/learn');
  };

  return (
    <div className="min-h-[100dvh] bg-background pb-8 flex flex-col">
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b-2 border-border px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-['Bricolage_Grotesque'] font-bold text-foreground">
            Welcome back, {state.user?.name?.split(' ')[0] || 'Friend'}
          </h1>
          <p className="text-sm font-medium text-muted-foreground">Pick a language to learn</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/20">
            <Flame size={18} className="fill-orange-500" /><span>{state.streak.current}</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
            <Star size={18} className="fill-amber-500" /><span>{state.xp}</span>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-4 md:p-6 mt-4 w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {LANGUAGES.map((lang, idx) => {
            const isSelected = state.selectedLanguageId === lang.id;
            const isAvailable = lang.available;
            return (
              <motion.button key={lang.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => isAvailable && handleSelect(lang.id)}
                disabled={!isAvailable}
                className={`relative flex flex-col items-center text-center p-6 rounded-[1.5rem] border-2 transition-all ${
                  isAvailable ? 'card-playful cursor-pointer hover:bg-muted/50' : 'bg-muted/30 border-border opacity-70 cursor-not-allowed'
                } ${isSelected ? 'border-primary ring-4 ring-primary/20 bg-primary/5' : 'border-border bg-card'}`}>
                {!isAvailable && (
                  <div className="absolute top-3 right-3 bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest z-10">
                    Soon
                  </div>
                )}
                <span className="text-6xl mb-4 filter drop-shadow-sm">{lang.flagEmoji}</span>
                <h3 className="font-bold text-xl text-foreground">{lang.name}</h3>
                <div className="script-devanagari text-2xl text-primary font-bold mt-1 mb-2">{lang.nativeName}</div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded-md">
                  {lang.scriptName}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
