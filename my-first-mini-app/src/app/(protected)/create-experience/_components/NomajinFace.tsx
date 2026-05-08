'use client';

interface Props {
  size?: number;
}

export default function NomajinFace({ size = 36 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="28" fill="#f5c000" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={50 + 30 * Math.cos(rad)}
            y1={50 + 30 * Math.sin(rad)}
            x2={50 + 40 * Math.cos(rad)}
            y2={50 + 40 * Math.sin(rad)}
            stroke="#f5c000"
            strokeWidth="5"
            strokeLinecap="round"
          />
        );
      })}
      <circle cx="42" cy="46" r="3.5" fill="#0d1f35" />
      <circle cx="58" cy="46" r="3.5" fill="#0d1f35" />
      <path d="M38.5 46 Q42 43 45.5 46" stroke="#0d1f35" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M43 55 Q50 61 57 55" stroke="#0d1f35" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="37" cy="54" r="5" fill="#db5852" opacity="0.3" />
      <circle cx="63" cy="54" r="5" fill="#db5852" opacity="0.3" />
    </svg>
  );
}
