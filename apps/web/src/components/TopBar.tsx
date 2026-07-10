import { Link } from 'wouter';
import type { Language } from '@/data/languages';

export function TopBar({ lang, streak, xp }: { lang: Language; streak: number; xp: number }) {
  return (
    <nav className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-[430px] mx-auto px-5 py-4 flex items-center justify-between">
        <Link to="/languages" className="flex items-center gap-2 bg-muted ring-1 ring-border px-3 py-1.5 rounded-full hover:bg-muted/80 transition-colors">
          <span className="text-xs font-semibold tracking-wider" style={{ fontFamily: lang.fontFamily }}>{lang.native}</span>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-muted-foreground">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5" title="Day streak">
            <div className="size-2.5 bg-yellow-500 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
            <span className="text-sm font-medium tabular-nums">{streak}</span>
          </div>
          <div className="flex items-center gap-1.5" title="XP">
            <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" className="text-primary">
              <path d="m12 2 2.6 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.4-1.1L12 2z" />
            </svg>
            <span className="text-sm font-medium tabular-nums">{xp}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
