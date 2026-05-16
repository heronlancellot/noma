import { MapPin } from 'lucide-react';

interface MapPlaceholderProps {
  location: string;
}

export function MapPlaceholder({ location }: MapPlaceholderProps) {
  return (
    <div className="h-[240px] w-full rounded-2xl bg-surface-container overflow-hidden relative mt-4 border border-outline-variant/20 shadow-sm">
      {/* Stylized map grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, var(--color-on-surface) 0px, var(--color-on-surface) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, var(--color-on-surface) 0px, var(--color-on-surface) 1px, transparent 1px, transparent 40px)',
        }}
      />
      {/* Soft map-like tones */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-highest opacity-80" />

      {/* Pin */}
      <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
        <div className="bg-surface p-3.5 rounded-full shadow-lg text-primary scale-110">
          <MapPin size={32} className="text-primary" strokeWidth={2} />
        </div>
      </div>

      {/* Location label */}
      <div className="absolute bottom-3 right-4">
        <span className="text-xs font-semibold text-secondary">{location}</span>
      </div>
    </div>
  );
}
