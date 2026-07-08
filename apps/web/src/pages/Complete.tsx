import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useStore } from '@/store';
import { BADGES } from '@/data/curriculum';
import confetti from 'canvas-confetti';
import { Star, Trophy, Target, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Complete() {
  const [, setLocation] = useLocation();
  const state = useStore();
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('indilingo_last_result');
    if (raw) {
      const data = JSON.parse(raw);
      setResult(data);
      if (data.stars === 3) triggerConfetti();
    } else {
      setLocation('/learn');
    }
  }, [setLocation]);

  const triggerConfetti = () => {
    const end = Date.now() + 2 * 1000;
    const colors = ['#f97316', '#eab308', '#ec4899', '#3b82f6'];
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  if (!result) return null;

  const pct = Math.round((result.correctAnswers / result.totalAnswers) * 100);
  const newBadges = BADGES.filter(b => state.earnedBadgeIds.includes(b.id));

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col max-w-md w-full mx-auto relative overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8 relative z-10">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.6 }} className="flex gap-4">
          {[1, 2, 3].map((star) => (
            <motion.div key={star} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: star * 0.2 }}>
              <Star size={72} strokeWidth={2}
                className={star <= result.stars ? "fill-amber-400 text-amber-500 drop-shadow-md" : "fill-muted text-border"} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }} className="text-center">
          <h1 className="text-4xl font-['Bricolage_Grotesque'] font-bold text-foreground mb-2">
            {result.stars === 3 ? "Perfect!" : result.stars > 0 ? "Great job!" : "Keep trying!"}
          </h1>
          <p className="text-xl text-muted-foreground font-medium">Lesson Completed</p>
        </motion.div>

        <div className="w-full grid grid-cols-2 gap-4 mt-4">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1 }}
            className="bg-orange-50 border-2 border-orange-200 p-4 rounded-2xl flex flex-col items-center justify-center text-orange-600 gap-1">
            <Trophy size={32} />
            <span className="text-sm font-bold uppercase tracking-wider">XP Earned</span>
            <span className="text-3xl font-black">+{result.xpEarned}</span>
          </motion.div>
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.2 }}
            className="bg-blue-50 border-2 border-blue-200 p-4 rounded-2xl flex flex-col items-center justify-center text-blue-600 gap-1">
            <Target size={32} />
            <span className="text-sm font-bold uppercase tracking-wider">Accuracy</span>
            <span className="text-3xl font-black">{pct}%</span>
          </motion.div>
        </div>
      </div>

      <div className="p-6 bg-card border-t-2 border-border z-20">
        <button onClick={() => setLocation('/learn')}
          className="w-full btn-playful bg-primary text-primary-foreground py-4 text-xl flex items-center justify-center gap-2 mb-4">
          Continue Learning <ArrowRight size={20} />
        </button>
        <button onClick={() => setLocation('/leaderboard')}
          className="w-full font-bold text-primary py-2 hover:bg-primary/5 rounded-xl transition-colors">
          View Leaderboard
        </button>
      </div>
    </div>
  );
}
