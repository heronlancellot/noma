'use client';

import { Button } from '@/components/ui/button';

interface OrganizerCardProps {
  name: string;
  peopleMet: number;
  avatarBgColor: string;
  initial: string;
  onViewProfile: () => void;
  onMessage: (e: React.MouseEvent) => void;
}

export function OrganizerCard({
  name, peopleMet, avatarBgColor, initial, onViewProfile, onMessage,
}: OrganizerCardProps) {
  return (
    <div
      className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 flex items-center justify-between cursor-pointer active:opacity-80 transition-opacity"
      onClick={onViewProfile}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewProfile();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary-container p-[2px] flex-shrink-0 flex items-center justify-center"
          style={{ backgroundColor: avatarBgColor }}
        >
          <span className="text-xl font-bold text-white">{initial}</span>
        </div>

        <div>
          <h3 className="font-h3 text-on-surface">{name}</h3>
          <p className="font-body-sm text-secondary">
            Experience Host<br />
            ({peopleMet} joined)
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onMessage(e);
        }}
      >
        Message
      </Button>
    </div>
  );
}
