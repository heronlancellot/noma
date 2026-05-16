'use client';

import { ChevronDown } from 'lucide-react';

interface BookingCardProps {
  price: string;
  selectedDate: string;
  onDateChange: (date: string) => void;
  isCreator: boolean;
  joinLoading: boolean;
  isConfirming: boolean;
  onJoin: () => void;
  onManage: () => void;
}

export function BookingCard({
  price, selectedDate, onDateChange,
  isCreator, joinLoading, isConfirming, onJoin, onManage,
}: BookingCardProps) {
  const isProcessing = joinLoading || isConfirming;

  return (
    <div
      className="bg-surface-container-lowest p-6 rounded-3xl flex flex-col gap-5"
      style={{ boxShadow: '0 4px 24px rgba(37,25,24,0.10)' }}
    >
      {/* Price */}
      <div className="flex gap-0.5 items-center">
        <span className="text-xl text-secondary font-bold leading-tight tracking-tight">{price}</span>
        <span className="font-body-md text-secondary font-medium">{" "} /person</span>
      </div>

      {/* Date + Guests selectors */}
      <div className="flex flex-col gap-3">
        <label className="border border-outline-variant/30 rounded-2xl p-4 flex justify-between items-center cursor-pointer active:opacity-80 transition-opacity bg-surface-container-low">
          <div className="flex flex-col gap-0.5">
            <span className="font-label-caps text-on-surface font-bold">Date</span>
            <span className="font-body-sm text-secondary font-medium">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
              })}
            </span>
          </div>
          <ChevronDown size={20} strokeWidth={2} className="text-secondary" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="sr-only"
          />
        </label>

        <div className="border border-outline-variant/30 rounded-2xl p-4 flex justify-between items-center cursor-pointer active:opacity-80 transition-opacity bg-surface-container-low">
          <div className="flex flex-col gap-0.5">
            <span className="font-label-caps text-on-surface font-bold">Guests</span>
            <span className="font-body-sm text-secondary font-medium">2 adults</span>
          </div>
          <ChevronDown size={20} strokeWidth={2} className="text-secondary" />
        </div>
      </div>

      {/* CTA button */}
      {isCreator ? (
        <button
          onClick={onManage}
          className="w-full bg-secondary text-on-secondary py-4 rounded-full text-lg font-bold shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
        >
          Manage Experience
        </button>
      ) : (
        <button
          onClick={onJoin}
          disabled={isProcessing}
          className={`w-full !py-4 rounded-full text-lg font-bold !text-white shadow-md transition-all active:scale-[0.98] ${
            isProcessing ? 'bg-outline cursor-not-allowed' : 'bg-noma-btn'
          }`}
          style={!isProcessing ? { boxShadow: '0 4px 16px rgba(167,50,47,0.35)' } : undefined}
        >
          {isProcessing ? 'Processing...' : 'Join Experience'}
        </button>
      )}

      <p className="text-center font-body-sm text-secondary/70">
        You won&apos;t be charged yet
      </p>
    </div>
  );
}
