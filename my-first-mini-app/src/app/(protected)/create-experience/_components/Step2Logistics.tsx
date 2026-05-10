'use client';

import { useState } from 'react';
import { UseFormRegister, Control, FieldErrors, Controller } from 'react-hook-form';
import { CreateFormData } from './types';
import { IconBack, IconClose, IconLocation, IconClock, IconGroup, IconPayments } from './icons';

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
const INPUT_CLASS = 'w-full px-4 py-3.5 bg-transparent border-none text-[16px] text-on-surface placeholder:text-secondary/35 focus:ring-0 focus:outline-none';

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

function CalendarIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke={filled ? 'var(--color-primary)' : 'var(--color-on-surface-variant)'}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
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
        <CalendarIcon filled={Boolean(dateReady)} />
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="var(--color-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
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

export default function Step2Logistics({ register, control, errors, onNext, onBack, onClose }: Props) {
  return (
    <>
      {/* ── Header ── */}
      <header className="flex justify-between items-center px-4 h-14 bg-surface sticky top-0 z-10"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <button onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full text-secondary hover:bg-surface-container-low transition-colors">
          <IconBack />
        </button>
        <span className="font-h3 text-on-surface">Create</span>
        <button onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-full text-secondary hover:bg-surface-container-low transition-colors">
          <IconClose />
        </button>
      </header>

      {/* ── Progress bar ── */}
      <div className="h-1 w-full bg-outline-variant/20 shrink-0">
        <div className="h-full bg-primary rounded-r-full" style={{ width: '66%' }} />
      </div>

      {/* ── Scroll area ── */}
      <main className="flex-grow overflow-y-auto px-4 pt-6 pb-36 flex flex-col gap-4">

        <div className="mb-2">
          <p className="text-[12px] font-bold text-primary mb-2 tracking-wide">STEP 2 OF 3</p>
          <h1 className="font-h1 text-on-surface leading-tight">Details &amp; Logistics</h1>
          <p className="text-[14px] text-secondary mt-1.5">Tell your guests when, where, and how much.</p>
        </div>

        {/* ── Location ── */}
        <div className={CARD} style={CARD_SHADOW}>
          <div className={LABEL_ROW}>
            <span className="text-on-surface-variant"><IconLocation /></span>
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
              <span className="text-on-surface-variant"><IconClock /></span>
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
                    className={`w-full px-4 py-3.5 bg-transparent border-none text-[16px] appearance-none cursor-pointer focus:outline-none pr-9 ${
                      field.value ? 'text-on-surface' : 'text-secondary/35'
                    }`}
                  >
                    <option value="" disabled>Select...</option>
                    {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                )}
              />
              <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-secondary"
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
            <Err msg={errors.duration?.message} />
          </div>

          <div className={CARD} style={CARD_SHADOW}>
            <div className={LABEL_ROW}>
              <span className="text-on-surface-variant"><IconGroup /></span>
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
            <span className="text-on-surface-variant"><IconPayments /></span>
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

      {/* ── Footer ── */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto bg-surface px-6 pt-4 pb-6 flex items-center justify-between z-50"
        style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <button type="button" onClick={onBack}
          className="text-[15px] font-semibold text-secondary hover:text-on-surface transition-colors py-2">
          Back
        </button>
        <button type="button" onClick={onNext}
          className="bg-primary text-on-primary text-[15px] font-bold px-8 py-3.5 rounded-full active:scale-95 transition-transform"
          style={{ boxShadow: '0 4px 14px rgba(167,50,47,0.30)' }}>
          Next Step
        </button>
      </footer>
    </>
  );
}
