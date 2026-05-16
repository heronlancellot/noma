'use client';

import { UseFormRegister, Control, FieldErrors, Controller } from 'react-hook-form';
import { CreateFormData } from '@/features/create-experience/types';
import { MapPin, Clock, Users, CreditCard, Calendar, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CreateExperienceHeader } from '@/features/create-experience/components/Header';
import { CreateExperienceFooter } from '@/features/create-experience/components/Footer';

/* ── data constants ────────────────────────────────────────────── */
const DURATIONS = ['1 hour', '2 hours', '3 hours', '4+ hours'];

/* ── shared styles ─────────────────────────────────────────────── */
const CARD = 'bg-surface-container-lowest rounded-2xl border border-outline-variant/25 px-4 py-4';
const LABEL = 'font-body-sm font-semibold text-primary-container mb-2';
const INPUT_ROW = 'flex items-center gap-2.5';
const INPUT_BASE = 'flex-1 bg-transparent border-none font-body-md text-on-surface placeholder:text-secondary/35 focus:ring-0 focus:outline-none h-auto p-0 rounded-none shadow-none';

const Err = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-xs text-error font-semibold mt-1">{msg}</p> : null;

/* ── DatePickerInput ── */
function DatePickerInput({ value, onChange, hasError }: { value: string; onChange: (v: string) => void; hasError?: boolean }) {
  return (
    <div className={`${CARD} ${hasError ? 'border-error' : ''}`}>
      <p className={LABEL}>Date &amp; Time</p>
      <div className={INPUT_ROW}>
        <Calendar size={18} className="text-on-surface-variant flex-shrink-0" />
        <Input
          type="datetime-local"
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`${INPUT_BASE} ${!value ? 'text-secondary/35' : ''}`}
          placeholder="mm/dd/yyyy, --:-- --"
        />
      </div>
    </div>
  );
}

/* ── Props ── */
interface Props {
  register: UseFormRegister<CreateFormData>;
  control: Control<CreateFormData>;
  errors: FieldErrors<CreateFormData>;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
}

export default function CreateExperienceStep2({ register, control, errors, onNext, onBack, onClose }: Props) {
  return (
    <>
      <CreateExperienceHeader step={2} onClose={onClose} onBack={onBack} />

      <main className="flex-grow overflow-y-auto px-4 pt-6 pb-36 flex flex-col gap-4">

        {/* ── Location ── */}
        <div className={CARD}>
          <p className={LABEL}>Location</p>
          <div className={INPUT_ROW}>
            <MapPin size={18} className="text-on-surface-variant flex-shrink-0" />
            <Input
              type="text"
              {...register('location', { required: 'Required' })}
              placeholder="Search places..."
              className={INPUT_BASE}
            />
          </div>
          <Err msg={errors.location?.message} />
        </div>

        {/* ── Date & Time ── */}
        <Controller
          name="date"
          control={control}
          rules={{ required: 'Required' }}
          render={({ field: { onChange, value } }) => (
            <DatePickerInput value={value} onChange={onChange} hasError={!!errors.date} />
          )}
        />
        {errors.date && <p className="text-xs text-error font-semibold -mt-3 px-1">{errors.date.message}</p>}

        {/* ── Duration + Max Guests ── */}
        <div className="grid grid-cols-2 gap-3">
          <div className={CARD}>
            <p className={LABEL}>Duration</p>
            <div className={`${INPUT_ROW} relative`}>
              <Clock size={18} className="text-on-surface-variant flex-shrink-0" />
              <Controller
                name="duration"
                control={control}
                rules={{ required: 'Required' }}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`${INPUT_BASE} appearance-none cursor-pointer pr-6 ${
                      !field.value ? 'text-secondary/35' : ''
                    }`}
                  >
                    <option value="" disabled>Select...</option>
                    {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                )}
              />
              <ChevronDown size={14} className="pointer-events-none absolute right-0 text-secondary" />
            </div>
            <Err msg={errors.duration?.message} />
          </div>

          <div className={CARD}>
            <p className={LABEL}>Max Guests</p>
            <div className={INPUT_ROW}>
              <Users size={18} className="text-on-surface-variant flex-shrink-0" />
              <Input
                type="number"
                {...register('maxGuests', { required: 'Required', min: { value: 1, message: 'Required' } })}
                placeholder="e.g. 10"
                min="1"
                className={INPUT_BASE}
              />
            </div>
            <Err msg={errors.maxGuests?.message} />
          </div>
        </div>

        {/* ── Price ── */}
        <div className={CARD}>
          <p className={LABEL}>Price per Person</p>
          <div className={INPUT_ROW}>
            <CreditCard size={18} className="text-on-surface-variant flex-shrink-0" />
            <span className="font-body-md text-on-surface">$</span>
            <Input
              type="number"
              {...register('price', { required: 'Required' })}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={INPUT_BASE}
            />
          </div>
          <Err msg={errors.price?.message} />
        </div>

      </main>

      <CreateExperienceFooter step={2} onNext={onNext} onBack={onBack} />
    </>
  );
}
