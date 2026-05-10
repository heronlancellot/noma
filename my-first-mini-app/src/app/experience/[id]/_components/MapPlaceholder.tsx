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
            'repeating-linear-gradient(0deg, #251918 0px, #251918 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #251918 0px, #251918 1px, transparent 1px, transparent 40px)',
        }}
      />
      {/* Soft map-like tones */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-100 to-emerald-200 opacity-80" />

      {/* Pin */}
      <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
        <div className="bg-surface p-3.5 rounded-full shadow-lg text-primary scale-110">
          <svg width="32" height="32" fill="#a7322f" viewBox="0 0 24 24">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" fill="#fff" />
          </svg>
        </div>
      </div>

      {/* Location label */}
      <div className="absolute bottom-3 right-4">
        <span className="text-xs font-semibold text-emerald-700">{location}</span>
      </div>
    </div>
  );
}
