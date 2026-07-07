import React from 'react';
import { useLocation, Redirect } from 'wouter';
import { useListLanguages } from '@workspace/api-client-react';
import { useStore } from '@/store';

export function LanguageSelection() {
  const [, setLocation] = useLocation();
  const userId = useStore((state) => state.userId);
  const setSelectedLanguageId = useStore((state) => state.setSelectedLanguageId);
  const { data: languages, isLoading } = useListLanguages();

  if (!userId) {
    return <Redirect to="/" />;
  }

  const handleSelect = (id: number) => {
    setSelectedLanguageId(id);
    setLocation('/learn');
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-muted rounded-2xl"></div>
          <div className="text-xl font-bold text-muted-foreground">Loading languages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] py-12 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Choose a Language</h1>
          <p className="text-xl text-muted-foreground">Start your cultural journey today.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {languages?.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleSelect(lang.id)}
              className="group text-left card-playful overflow-hidden hover:-translate-y-1 transition-transform relative focus:outline-none focus:ring-4 focus:ring-primary/30"
              style={{ '--accent-hover': lang.colorHex } as React.CSSProperties}
            >
              <div 
                className="h-2 w-full transition-colors duration-300"
                style={{ backgroundColor: lang.colorHex }}
              />
              <div className="p-6">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform origin-left">
                  {lang.flagEmoji}
                </div>
                <h3 className="text-2xl font-black mb-1">{lang.name}</h3>
                <p className="text-lg font-medium text-muted-foreground mb-4">{lang.nativeName}</p>
                <div className="inline-block px-3 py-1 bg-muted rounded-lg text-sm font-bold text-muted-foreground border-2 border-border/10">
                  {lang.scriptName} Script
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
