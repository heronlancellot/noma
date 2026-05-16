'use client';

import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="bg-surface-container-lowest p-6 rounded-3xl flex flex-col gap-5 shadow-lg">
      {/* Price */}
      <div className="flex gap-0.5 items-center">
        <span className="font-h3 text-secondary">{price}</span>
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
        <Button variant="outline" size="xl" onClick={onManage}>
          Manage Experience
        </Button>
      ) : (
        <Button
          variant="primary"
          size="xl"
          onClick={onJoin}
          disabled={isProcessing}
          className={isProcessing ? 'bg-outline cursor-not-allowed' : ''}
        >
          {isProcessing ? 'Processing...' : 'Join Experience'}
        </Button>
      )}

      <p className="text-center font-body-sm text-secondary/70">
        You won&apos;t be charged yet
      </p>
    </div>
  );
}
