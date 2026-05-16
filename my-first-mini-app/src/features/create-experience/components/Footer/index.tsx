import { ArrowRight, Rocket } from 'lucide-react';
import { ButtonState } from '@/features/create-experience/types';
import { Button } from '@/components/ui/button';

type Props =
  | { step: 1; onNext: () => void }
  | { step: 2; onNext: () => void; onBack: () => void }
  | { step: 3; onPublish: () => void; buttonState: ButtonState; agreed: boolean }

export function CreateExperienceFooter(props: Props) {
  const onNext = 'onNext' in props ? props.onNext : undefined;
  const onBack = 'onBack' in props ? props.onBack : undefined;
  const onPublish = 'onPublish' in props ? props.onPublish : undefined;
  const buttonState = 'buttonState' in props ? props.buttonState : undefined;
  const agreed = 'agreed' in props ? props.agreed : false;

  const Footer: Record<1 | 2 | 3, React.ReactElement> = {
    1: (
      <footer className="fixed bottom-0 w-full max-w-[390px] bg-surface/95 backdrop-blur-md px-container-padding py-6 border-t border-outline-variant/30 z-50">
        <Button variant="primary" size="xl" className="w-full" onClick={onNext}>
          Next Step
          <ArrowRight size={20} />
        </Button>
      </footer>
    ),
    2: (
      <footer className="fixed bottom-0 w-full max-w-[390px] bg-surface/95 backdrop-blur-md px-container-padding py-6 border-t border-outline-variant/30 z-50">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
          <Button variant="primary" onClick={onNext}>
            Next Step
            <ArrowRight size={20} />
          </Button>
        </div>
      </footer>
    ),
    3: (
      <footer className="fixed bottom-0 w-full max-w-[390px] bg-surface/95 backdrop-blur-md px-container-padding py-6 border-t border-outline-variant/30 z-50">
        <Button
          variant="primary"
          size="xl"
          className="w-full"
          onClick={onPublish}
          disabled={!agreed || buttonState === 'pending'}
        >
          {buttonState === 'pending' ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Publishing...
            </>
          ) : buttonState === 'success' ? (
            '🎉 Published!'
          ) : (
            <>
              Publish Experience!
              <Rocket size={20} />
            </>
          )}
        </Button>
      </footer>
    ),
  };

  return Footer[props.step];
}
