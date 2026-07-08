import { useListLanguages } from '@workspace/api-client-react';
import { useStore } from '@/lib/store';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { data: languages, isLoading } = useListLanguages();
  const selectedLanguageId = useStore(state => state.selectedLanguageId);
  const setSelectedLanguageId = useStore(state => state.setSelectedLanguageId);
  const [_, setLocation] = useLocation();

  const handleSelectLanguage = (id: string) => {
    setSelectedLanguageId(id);
    setLocation('/learn');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-serif font-bold text-foreground">Choose a Language</h1>
        <p className="text-lg text-muted-foreground">Embark on a journey through India's rich linguistic heritage.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages?.map((language, i) => (
            <motion.div
              key={language.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card 
                className={`group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${selectedLanguageId === language.id ? 'border-primary shadow-md' : 'border-transparent hover:border-primary/30'}`}
                onClick={() => handleSelectLanguage(language.id)}
              >
                <div 
                  className="absolute top-0 left-0 w-full h-2" 
                  style={{ backgroundColor: language.colorTheme || 'hsl(var(--primary))' }}
                />
                <div className="p-6 pt-8 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold font-serif mb-1 group-hover:text-primary transition-colors">{language.name}</h3>
                      <p className="text-sm font-medium text-muted-foreground">{language.nativeName}</p>
                    </div>
                    <span className="text-4xl">{language.flagEmoji}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-1">
                    {language.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-md">
                      <Users className="w-3.5 h-3.5" />
                      <span>{language.totalLearners.toLocaleString()} learners</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
