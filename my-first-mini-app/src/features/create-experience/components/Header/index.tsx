import { X, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props =
  | { step: 1; onClose: () => void }
  | { step: 2; onClose: () => void; onBack: () => void }
  | { step: 3; onBack: () => void }

export function CreateExperienceHeader(props: Props) {
  const onClose = 'onClose' in props ? props.onClose : undefined
  const onBack = 'onBack' in props ? props.onBack : undefined

  const Header: Record<1 | 2 | 3, React.ReactElement> = {
    1: (
      <header className="px-container-padding pt-12 pb-md sticky top-0 z-10 bg-surface">
        <div className="flex items-center justify-between mb-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close"
            className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface"
          >
            <X size={20} />
          </Button>
          <div className="font-label-caps text-secondary">CREATE</div>
          <div className="w-10" />
        </div>
        <div className="w-full bg-surface-variant rounded-full h-2 mb-md overflow-hidden">
          <div className="bg-primary h-2 rounded-full w-1/3 transition-all duration-500 ease-in-out" />
        </div>
        <h1 className="font-h1 text-on-surface mb-xs">Step 1: The Basics</h1>
        <p className="font-body-md text-on-surface-variant">
          Start by giving your experience a catchy name and a brief description.
        </p>
      </header>
    ),
    2: (
      <header className="px-container-padding pt-12 pb-md sticky top-0 z-10 bg-surface">
        <div className="flex items-center justify-between mb-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            aria-label="Go back"
            className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface"
          >
            <ChevronLeft size={20} />
          </Button>
          <div className="font-label-caps text-secondary">CREATE</div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close"
            className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface"
          >
            <X size={20} />
          </Button>
        </div>
        <div className="w-full bg-surface-variant rounded-full h-2 mb-md overflow-hidden">
          <div className="bg-primary h-2 rounded-full w-2/3 transition-all duration-500 ease-in-out" />
        </div>
        <h1 className="font-h1 text-on-surface mb-xs">Step 2: Details &amp; Logistics</h1>
        <p className="font-body-md text-on-surface-variant">
          Tell your guests when, where, and how much.
        </p>
      </header>
    ),
    3: (
      <header className="px-container-padding pt-12 pb-md sticky top-0 z-10 bg-surface">
        <div className="flex items-center justify-between mb-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            aria-label="Go back"
            className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface"
          >
            <ChevronLeft size={20} />
          </Button>
          <div className="font-label-caps text-secondary">CREATE</div>
          <div className="w-10" />
        </div>
        <div className="w-full bg-surface-variant rounded-full h-2 mb-md overflow-hidden">
          <div className="bg-primary h-2 rounded-full w-full transition-all duration-500 ease-in-out" />
        </div>
        <h1 className="font-h1 text-on-surface mb-xs">Review &amp; Publish</h1>
        <p className="font-body-md text-on-surface-variant">
          One last look before your experience goes live!
        </p>
      </header>
    ),
  }

  return Header[props.step]
}
