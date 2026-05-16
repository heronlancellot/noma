'use client';

import { useState } from 'react';
import { UseFormRegister, Control, FieldErrors, Controller } from 'react-hook-form';
import { CreateFormData } from '@/features/create-experience/types';
import { MapPin, Clock, Users, CreditCard, Calendar, ChevronDown } from 'lucide-react';
import { CreateExperienceHeader } from '@/features/create-experience/components/Header';
import { CreateExperienceFooter } from '@/features/create-experience/components/Footer';

/* ── data constants ────────────────────────────────────────────── */
const DURATIONS = ['1 hour', '2 hours', '3 hours', '4+ hours'];
const MONTHS = [
  { v: '01', l: 'Jan' }, { v: '02', l: 'Feb' }, { v: '03', l: 'Mar' },
  { v: '04', l: 'Apr' }, { v: '05', l: 'May' }, { v: '06', l: 'Jun' },
  { v: '07', l: 'Jul' }, { v: '08', l: 'Aug' }, { v: '09', l: 'Sep' },
  { v: '10', l: 'Oct' }, { v: '11', l: 'Nov' }, { v: '12', l: 'Dec' },
];
const MONTH_FULL: Record<string, string> = {
  '01':'January','02':'February','03':'March','04':'April','05':'May','06':'June',
  '07':'July','08':'August','09':'September','10':'October','11':'November','12':'December',
};
const currentYear = new Date().getFullYear();
const YEARS   = Array.from({ length: 3 }, (_, i) => String(currentYear + i));
const DAYS    = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const HOURS   = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

interface DateParts { day: string; month: string; year: string; hour: string; minute: string }

function parseDateParts(s: string): DateParts {
  if (!s?.includes('T')) return { day:'', month:'', year:'', hour:'', minute:'' };
  const [dp, tp] = s.split('T');
  const [y, mo, d] = dp.split('-');
  const [h, mi] = (tp || '').split(':');
  return { day: d||'', month: mo||'', year: y||'', hour: h||'', minute: (mi||'').slice(0,2) };
}

/* ── shared styles ─────────────────────────────────────────────── */
const CARD = 'bg-surface-container-lowest rounded-2xl border border-outline-variant/25 overflow-hidden';
const CARD_SHADOW = { boxShadow: '0 1px 6px rgba(37,25,24,0.07)' };
const LABEL_ROW = 'flex items-center gap-2.5 px-4 pt-4 pb-3';
const LABEL_TEXT = 'text-[13px] font-semibold text-on-surface-variant';
const DIVIDER = 'h-px bg-outline-variant/20 mx-4';
const INPUT_CLASS = 'w-full !px-4 !py-3.5 bg-transparent border-none text-[16px] text-on-surface placeholder:text-secondary/35 focus:ring-0 focus:outline-none';

const Err = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-[12px] text-error font-semibold px-4 pb-3 -mt-1">{msg}</p> : null;

/* ── InlineSelect ── */
function InlineSelect({
  value, onChange, emptyText, children, style,
}: {
  value: string;
  onChange: (v: string) => void;
  emptyText: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <span className="relative inline-block" style={style}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ position: 'absolute', inset: 0, opacity: 0.001, zIndex: 2, fontSize: '16px', width: '100%' }}
        className="cursor-pointer focus:outline-none border-none bg-transparent"
      >
        <option value="">{emptyText}</option>
        {children}
      </select>
      <span className={`text-[16px] ${value ? 'text-on-surface' : 'text-secondary/35'}`}>
        {value || emptyText}
      </span>
    </span>
  );
}

/* ── DatePickerInput — controlled via RHF Controller ── */
function DatePickerInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [dp, setDp] = useState<DateParts>(() => parseDateParts(value));

  const setPart = (field: keyof DateParts, newValue: string) => {
    const next = { ...dp, [field]: newValue };
    setDp(next);
    if (next.year && next.month && next.day && next.hour && next.minute) {
      onChange(`${next.year}-${next.month}-${next.day}T${next.hour}:${next.minute}`);
    }
  };

  const dateReady = dp.year && dp.month && dp.day;
  const h24  = parseInt(dp.hour || '0');
  const ampm = h24 >= 12 ? 'PM' : 'AM';
  const h12  = h24 % 12 || 12;

  return (
    <>
      <div className={LABEL_ROW}>
        <Calendar
          size={17}
          stroke={dateReady ? 'var(--color-primary)' : 'var(--color-on-surface-variant)'}
        />
        <span className={`${LABEL_TEXT} ${dateReady ? 'text-primary' : ''}`}>Date &amp; Time</span>
      </div>
      <div className={DIVIDER} />

      <div className="px-4 py-3.5 flex items-center gap-1 flex-wrap">
        <InlineSelect value={dp.day} onChange={v => setPart('day', v)} emptyText="dd" style={{ minWidth: 26 }}>
          {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
        </InlineSelect>

        <span className="text-secondary/35 text-[16px]">/</span>

        <InlineSelect value={dp.month} onChange={v => setPart('month', v)} emptyText="mmm" style={{ minWidth: 36 }}>
          {MONTHS.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
        </InlineSelect>

        <span className="text-secondary/35 text-[16px]">/</span>

        <InlineSelect value={dp.year} onChange={v => setPart('year', v)} emptyText="yyyy" style={{ minWidth: 44 }}>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </InlineSelect>

        <span className="text-secondary/25 text-[16px] mx-1">,</span>

        <InlineSelect value={dp.hour} onChange={v => setPart('hour', v)} emptyText="--" style={{ minWidth: 24 }}>
          {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
        </InlineSelect>

        <span className="text-secondary/35 text-[16px]">:</span>

        <InlineSelect value={dp.minute} onChange={v => setPart('minute', v)} emptyText="--" style={{ minWidth: 24 }}>
          {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
        </InlineSelect>

        <div className="ml-auto">
          <Calendar size={16} className="text-secondary" />
        </div>
      </div>

      {dateReady && (
        <>
          <div className={DIVIDER} />
          <p className="px-4 py-2.5 text-[13px] font-semibold text-primary">
            {MONTH_FULL[dp.month]} {parseInt(dp.day)}, {dp.year}
            {dp.hour && dp.minute && ` · ${h12}:${dp.minute} ${ampm}`}
          </p>
        </>
      )}
    </>
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

      {/* ── Scroll area ── */}
      <main className="flex-grow overflow-y-auto px-4 pt-6 pb-36 flex flex-col gap-4">

        {/* ── Location ── */}
        <div className={CARD} style={CARD_SHADOW}>
          <div className={LABEL_ROW}>
            <span className="text-on-surface-variant"><MapPin size={24} /></span>
            <span className={LABEL_TEXT}>Location</span>
          </div>
          <div className={DIVIDER} />
          <input
            type="text"
            {...register('location', { required: 'Required' })}
            placeholder="Search places..."
            className={INPUT_CLASS}
          />
          <Err msg={errors.location?.message} />
        </div>

        {/* ── Date & Time ── */}
        <div className={`${CARD} ${errors.date ? 'border-error' : ''}`} style={CARD_SHADOW}>
          <Controller
            name="date"
            control={control}
            rules={{ required: 'Required' }}
            render={({ field: { onChange, value } }) => (
              <DatePickerInput value={value} onChange={onChange} />
            )}
          />
          <Err msg={errors.date?.message} />
        </div>

        {/* ── Duration + Max Guests ── */}
        <div className="grid grid-cols-2 gap-3">
          <div className={CARD} style={CARD_SHADOW}>
            <div className={LABEL_ROW}>
              <span className="text-on-surface-variant"><Clock size={24} /></span>
              <span className={LABEL_TEXT}>Duration</span>
            </div>
            <div className={DIVIDER} />
            <div className="relative px-1">
              <Controller
                name="duration"
                control={control}
                rules={{ required: 'Required' }}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`w-full !px-4 !py-3.5 bg-transparent border-none text-[16px] appearance-none cursor-pointer focus:outline-none pr-9 ${
                      field.value ? 'text-on-surface' : 'text-secondary/35'
                    }`}
                  >
                    <option value="" disabled>Select...</option>
                    {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                )}
              />
              <ChevronDown size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-secondary" />
            </div>
            <Err msg={errors.duration?.message} />
          </div>

          <div className={CARD} style={CARD_SHADOW}>
            <div className={LABEL_ROW}>
              <span className="text-on-surface-variant"><Users size={24} /></span>
              <span className={LABEL_TEXT}>Max Guests</span>
            </div>
            <div className={DIVIDER} />
            <input
              type="number"
              {...register('maxGuests', { required: 'Required', min: { value: 1, message: 'Required' } })}
              placeholder="e.g. 10"
              min="1"
              className={INPUT_CLASS}
            />
            <Err msg={errors.maxGuests?.message} />
          </div>
        </div>

        {/* ── Price ── */}
        <div className={CARD} style={CARD_SHADOW}>
          <div className={LABEL_ROW}>
            <span className="text-on-surface-variant"><CreditCard size={24} /></span>
            <span className={LABEL_TEXT}>Price per Person</span>
          </div>
          <div className={DIVIDER} />
          <div className="flex items-center px-4 py-3.5">
            <span className="text-[16px] text-on-surface mr-2">$</span>
            <input
              type="number"
              {...register('price', { required: 'Required' })}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="flex-1 bg-transparent border-none text-[16px] text-on-surface placeholder:text-secondary/35 focus:ring-0 focus:outline-none"
            />
          </div>
          <Err msg={errors.price?.message} />
        </div>

      </main>

      <CreateExperienceFooter step={2} onNext={onNext} onBack={onBack} />
    </>
  );
}
