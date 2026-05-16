'use client';

import { AuthButton } from '@/features/auth/components/AuthButton';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export const LoginPage = () => {
  return (
    <div className="min-h-screen noma-splash-gradient flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="w-full flex justify-end p-6">
        <Button variant="ghost" size="icon" aria-label="Settings" className="bg-black/20 backdrop-blur-sm text-white/90 hover:bg-black/30">
          <Settings size={20} />
        </Button>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-10 -mt-10">
        {/* NOMAJIN mascot */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          <video
            src="/video/nomajin02.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>

        {/* Tagline */}
        <div className="text-center drop-shadow-md">
          <h1 className="font-h1 text-white">Go outside</h1>
          <span className="font-h1 text-white block">Meet safely</span>
          <span className="font-h1 text-white relative inline-block pb-3">
            Trust the journey
            <svg
              className="absolute -bottom-1 left-0 w-full"
              fill="none"
              viewBox="0 0 200 10"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 8C50 2 150 2 198 8"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="3"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Action area */}
      <div className="w-full px-8 pb-16 pt-8 flex flex-col items-center gap-6">
        <div className="w-full max-w-[280px]">
          <AuthButton />
        </div>
        <p className="text-white/80 text-xs text-center px-4">
          By connecting, you agree to NOMA&apos;s Terms of Service and Privacy Policy.
        </p>
      </div>

      {/* NOMA badge */}
      <div className="absolute bottom-6 left-6 w-10 h-10 rounded-full bg-noma-btn flex items-center justify-center border-2 border-foreground shadow-md">
        <span className="font-h3 text-on-primary font-bold leading-none">N</span>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-surface-container-lowest rounded-full border border-foreground" />
      </div>
    </div>
  );
};
