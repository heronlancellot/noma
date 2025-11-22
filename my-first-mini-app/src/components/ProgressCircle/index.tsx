import React from 'react';

interface ProgressCircleProps {
  size?: number; // px
  stroke?: number; // px
  value: number; // 0-100
  label?: string;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  size = 120,
  stroke = 10,
  value,
  label,
}) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, value));
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ width: size, height: size }} className="relative">
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#eee"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e35d5b"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">{Math.round(progress)}%</p>
          {label && <p className="text-xs text-gray-500">{label}</p>}
        </div>
      </div>
    </div>
  );
};