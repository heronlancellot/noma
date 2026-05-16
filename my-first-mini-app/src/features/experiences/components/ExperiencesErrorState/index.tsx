import Image from 'next/image';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <Button
          variant="primary"
          size="xl"
          onClick={onRetry}
        >
          <RefreshCw size={18} strokeWidth={2.5} />
          Try Again
        </Button>
        <Button
          variant="outline"
          size="xl"
          onClick={onGoBack}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
}
