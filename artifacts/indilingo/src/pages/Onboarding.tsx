import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useCreateUser } from '@workspace/api-client-react';
import { useStore } from '@/store';

export function Onboarding() {
  const [, setLocation] = useLocation();
  const setUserId = useStore((state) => state.setUserId);
  const [name, setName] = useState('');
  
  const createUser = useCreateUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createUser.mutate({ data: { name: name.trim() } }, {
      onSuccess: (user) => {
        setUserId(user.id);
        setLocation('/languages');
      }
    });
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-6 relative overflow-hidden bg-[#FEF6E0]">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px]" />
      
      <div className="max-w-md w-full z-10">
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-primary text-white rounded-3xl mx-auto mb-6 flex items-center justify-center font-display font-black text-5xl shadow-playful border-[3px] border-border transform -rotate-6">
            IL
          </div>
          <h1 className="text-5xl font-black text-foreground mb-4">
            Learn Indian Languages.
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Connect with your roots. The fun way.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card p-8 rounded-[2rem] border-[3px] border-border shadow-playful flex flex-col gap-6">
          <div>
            <label htmlFor="name" className="block font-display font-bold text-lg mb-2 text-foreground">
              What should we call you?
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full text-xl p-4 rounded-xl border-2 border-border bg-background focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground font-medium"
              autoFocus
              maxLength={30}
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || createUser.isPending}
            className="w-full btn-playful bg-primary text-white text-xl py-4 flex items-center justify-center border-border"
          >
            {createUser.isPending ? 'Starting...' : 'Start Learning'}
          </button>
        </form>
      </div>
    </div>
  );
}
