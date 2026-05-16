import Image from 'next/image';
import { RefreshCw } from 'lucide-react';

interface ExperiencesErrorStateProps {
  onRetry: () => void;
  onGoBack: () => void;
}

export function ExperiencesErrorState({ onRetry, onGoBack }: ExperiencesErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-container-padding gap-6 text-center">
      <Image
        src="/nomajin-distressed.png"
        alt="NOMAJIN distressed"
        width={180}
        height={180}
        className="object-contain"
      />

      <div className="flex flex-col gap-2">
        <h2 className="font-h1 text-on-surface">
          Oh no! Something went wrong
        </h2>
        <p className="font-body-sm text-on-surface-variant max-w-[280px]">
          We couldn&apos;t load the experiences right now. Our little sun is feeling a bit dizzy. Let&apos;s try giving it another spin.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={onRetry}
          className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-4 rounded-full font-body-md font-bold active:opacity-80 transition-opacity"
        >
          <RefreshCw size={18} strokeWidth={2.5} />
          Try Again
        </button>
        <button
          onClick={onGoBack}
          className="w-full py-4 rounded-full font-body-md font-bold border border-outline text-on-surface active:opacity-80 transition-opacity"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
