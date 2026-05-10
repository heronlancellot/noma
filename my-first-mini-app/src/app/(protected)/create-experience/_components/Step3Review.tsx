'use client';

import { Control, FieldErrors, Controller, useWatch } from 'react-hook-form';
import { CreateFormData, ButtonState } from './types';
import { IconBack, IconPhoto, IconRocket } from './icons';

interface Props {
  formData: CreateFormData;
  control: Control<CreateFormData>;
  errors: FieldErrors<CreateFormData>;
  onPublish: () => void;
  onBack: () => void;
  buttonState: ButtonState;
}

export default function Step3Review({ formData, control, errors, onPublish, onBack, buttonState }: Props) {
  const agreed = useWatch({ control, name: 'agreed' });

  return (
    <>
      {/* ── Header ── */}
      <header className="flex items-center w-full px-container-padding h-16 bg-surface shadow-sm sticky top-0 z-50 gap-2">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors text-secondary shrink-0"
        >
          <IconBack />
        </button>
        <span className="font-h3 text-on-surface">Step 3: Review</span>
      </header>

      {/* ── Progress bar ── */}
      <div className="w-full bg-surface-variant h-2 shrink-0">
        <div className="bg-primary h-2 w-full transition-all duration-500" />
      </div>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto px-container-padding py-lg pb-32 flex flex-col gap-stack-gap">
        {/* Step labels */}
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-semibold tracking-widest uppercase text-secondary">Step 3 of 3</span>
          <span className="text-[11px] font-semibold tracking-widest uppercase text-primary">100% Complete</span>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h2 className="font-h2 text-on-surface mb-1">Review &amp; Publish</h2>
          <p className="text-[16px] text-on-surface-variant">One last look before your experience goes live!</p>
        </div>

        {/* ── Experience Preview ── */}
        <div>
          <h3 className="font-h3 text-on-surface mb-3">Experience Preview</h3>

          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden"
            style={{ boxShadow: '0 4px 20px rgba(37,25,24,0.12)' }}>

            {/* Cover image */}
            <div className="relative w-full h-44">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formData.coverImage || '/image-default.png'}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              {formData.category && (
                <span className="absolute top-3 left-3 bg-tertiary-fixed text-on-tertiary-container text-[12px] font-semibold px-3 py-1 rounded-full shadow-sm">
                  {formData.category}
                </span>
              )}
            </div>

            {/* Details */}
            <div className="px-4 pt-3.5 pb-4 flex flex-col gap-2">
              <div className="flex justify-between items-start gap-2">
                <span className="font-h3 text-on-surface leading-snug flex-1">
                  {formData.title || 'Your Experience Title'}
                </span>
                <span className="font-bold text-primary text-[18px] shrink-0">
                  {formData.price ? `$${formData.price}` : '—'}
                </span>
              </div>

              {formData.location && (
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span className="text-[13px]">{formData.location}</span>
                </div>
              )}

              {(formData.duration || formData.maxGuests) && (
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span className="text-[13px]">
                    {[formData.duration, formData.maxGuests && `Up to ${formData.maxGuests} people`]
                      .filter(Boolean).join(' • ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Cover Photo upload ── */}
        <div>
          <h3 className="text-[17px] font-semibold text-on-surface mb-3">Cover Photo</h3>
          <div className="border-2 border-dashed border-primary/25 rounded-2xl py-10 flex flex-col items-center justify-center text-center bg-primary/[0.04] cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-3 shadow-sm">
              <IconPhoto className="text-white" />
            </div>
            <p className="text-[15px] font-semibold text-on-surface mb-1">
              {formData.coverImage ? 'Tap to change cover photo' : 'Tap to add cover photo'}
            </p>
            <p className="text-[13px] text-on-surface-variant">JPEG or PNG, max 5MB</p>
          </div>
        </div>

        {/* ── Nomajin celebration ── */}
        <div className="flex flex-col items-center text-center p-6 bg-secondary-container/20 rounded-2xl border border-secondary-container/40">
          <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center mb-3">
            <IconRocket className="text-secondary" />
          </div>
          <p className="text-[15px] text-on-surface leading-relaxed">
            You&apos;re almost there! NOMAJIN is ready to welcome your new adventure.
          </p>
        </div>

        {/* ── Terms ── */}
        <Controller
          name="agreed"
          control={control}
          rules={{ required: 'You must agree to the terms to publish' }}
          render={({ field: { onChange, value } }) => (
            <div className="flex flex-col gap-1">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={value}
                  onChange={e => onChange(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded border-outline-variant accent-[#a7322f] shrink-0 cursor-pointer"
                />
                <label htmlFor="terms" className="text-[13px] text-on-surface-variant leading-relaxed cursor-pointer">
                  I agree to the{' '}
                  <span className="text-primary font-semibold underline decoration-primary/30">
                    Terms &amp; Conditions
                  </span>{' '}
                  and confirm that this experience complies with community guidelines.
                </label>
              </div>
              {errors.agreed && (
                <p className="text-[12px] text-error font-semibold ml-8">{errors.agreed.message}</p>
              )}
            </div>
          )}
        />
      </main>

      {/* ── Publish button ── */}
      <div className="fixed bottom-0 w-full max-w-[390px] bg-surface/95 backdrop-blur-md border-t border-outline-variant/30 px-container-padding py-md z-50">
        <button
          onClick={onPublish}
          disabled={!agreed || buttonState === 'pending'}
          className={[
            'w-full text-[16px] font-semibold py-4 rounded-full flex items-center justify-center gap-2 transition-all active:scale-[0.98]',
            agreed
              ? 'bg-primary text-on-primary shadow-sm hover:opacity-90'
              : 'bg-surface-container-highest text-secondary cursor-not-allowed',
            buttonState === 'pending' ? 'opacity-70' : '',
          ].join(' ')}
        >
          {buttonState === 'pending' ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Publishing...
            </>
          ) : buttonState === 'success' ? (
            '🎉 Published!'
          ) : (
            <>
              Publish Experience!
              <IconRocket />
            </>
          )}
        </button>
      </div>
    </>
  );
}
