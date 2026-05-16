'use client';

import { useState } from 'react';
import { Control, FieldErrors, Controller, useWatch } from 'react-hook-form';
import { CreateFormData, ButtonState } from '@/features/create-experience/types';
import Image from 'next/image';
import { ImageIcon, MapPin, Clock, X } from 'lucide-react';
import { CreateExperienceHeader } from '@/features/create-experience/components/Header';
import { CreateExperienceFooter } from '@/features/create-experience/components/Footer';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import NomajinFace from '@/features/create-experience/components/NomajinFace';

interface Props {
  formData: CreateFormData;
  control: Control<CreateFormData>;
  errors: FieldErrors<CreateFormData>;
  onPublish: () => void;
  onBack: () => void;
  onCoverUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  buttonState: ButtonState;
}

export default function Step3Review({ formData, control, errors, onPublish, onBack, onCoverUpload, buttonState }: Props) {
  const agreed = useWatch({ control, name: 'agreed' });
  const [showTerms, setShowTerms] = useState(false);

  return (
    <>
      <CreateExperienceHeader step={3} onBack={onBack} />

      {/* Terms & Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40" onClick={() => setShowTerms(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Terms and Conditions"
            className="bg-surface w-full max-w-[390px] rounded-t-3xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300"
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-outline-variant/50" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4 pt-2">
              <h2 className="font-h2 text-on-surface">Terms &amp; Conditions</h2>
              <Button variant="ghost" size="icon-sm" onClick={() => setShowTerms(false)}>
                <X size={20} className="text-on-surface-variant" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 pb-8 text-on-surface-variant">
              <div className="flex flex-col gap-5">
                <section>
                  <h3 className="font-h3 text-on-surface mb-2">1. Experience Creation</h3>
                  <p className="font-body-sm leading-relaxed">
                    By creating an experience on NOMA, you agree to provide accurate information about your offering,
                    including description, location, pricing, and availability. You are responsible for delivering the
                    experience as described.
                  </p>
                </section>

                <section>
                  <h3 className="font-h3 text-on-surface mb-2">2. Community Guidelines</h3>
                  <p className="font-body-sm leading-relaxed">
                    All experiences must comply with local laws and regulations. Experiences involving illegal activities,
                    discrimination, or unsafe conditions are strictly prohibited. NOMA reserves the right to remove
                    any experience that violates these guidelines.
                  </p>
                </section>

                <section>
                  <h3 className="font-h3 text-on-surface mb-2">3. Payments &amp; Fees</h3>
                  <p className="font-body-sm leading-relaxed">
                    Payments are processed on-chain via World Chain. Hosts receive payment after the experience is
                    completed and confirmed. NOMA may charge a service fee on each transaction.
                  </p>
                </section>

                <section>
                  <h3 className="font-h3 text-on-surface mb-2">4. Cancellation Policy</h3>
                  <p className="font-body-sm leading-relaxed">
                    Hosts may cancel an experience before it starts. Guests who have already joined will be notified
                    and refunded. Repeated cancellations may affect your host reputation.
                  </p>
                </section>

                <section>
                  <h3 className="font-h3 text-on-surface mb-2">5. Liability</h3>
                  <p className="font-body-sm leading-relaxed">
                    NOMA acts as a platform connecting hosts and guests. The host is solely responsible for the safety
                    and quality of the experience. Participants join at their own risk.
                  </p>
                </section>

                <section>
                  <h3 className="font-h3 text-on-surface mb-2">6. Privacy</h3>
                  <p className="font-body-sm leading-relaxed">
                    Your wallet address and public profile information are visible to other users. NOMA uses World ID
                    for identity verification and does not store personal identification documents.
                  </p>
                </section>
              </div>
            </div>

            {/* Close button */}
            <div className="px-5 pb-6 pt-3 border-t border-outline-variant/20">
              <Button variant="primary" size="xl" onClick={() => setShowTerms(false)}>
                I Understand
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto px-container-padding py-lg pb-32 flex flex-col gap-stack-gap">

        {/* Experience Preview */}
        <div>
          <h3 className="font-h3 text-on-surface mb-3">Experience Preview</h3>
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-card">
            <div className="relative w-full h-44">
              <Image
                src={formData.coverImage || '/image-default.png'}
                alt="Cover"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              {formData.category && (
                <span className="absolute top-3 left-3 bg-tertiary-fixed text-on-tertiary-container text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  {formData.category}
                </span>
              )}
            </div>

            <div className="px-4 pt-3.5 pb-4 flex flex-col gap-2">
              <div className="flex justify-between items-start gap-2">
                <span className="font-h3 text-on-surface leading-snug flex-1">
                  {formData.title || 'Your Experience Title'}
                </span>
                <span className="font-h3 text-primary shrink-0">
                  {formData.price ? `$${formData.price}` : '—'}
                </span>
              </div>

              {formData.location && (
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <MapPin size={14} />
                  <span className="font-body-sm">{formData.location}</span>
                </div>
              )}

              {(formData.duration || formData.maxGuests) && (
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <Clock size={14} />
                  <span className="font-body-sm">
                    {[formData.duration, formData.maxGuests && `Up to ${formData.maxGuests} people`]
                      .filter(Boolean).join(' • ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cover Photo upload */}
        <div>
          <h3 className="font-h3 text-on-surface mb-3">Cover Photo</h3>
          <label
            htmlFor="cover-upload"
            className="block border-2 border-dashed border-primary/25 rounded-2xl py-10 flex flex-col items-center justify-center text-center bg-primary/[0.04] cursor-pointer"
          >
            <Input
              id="cover-upload"
              type="file"
              accept="image/jpeg,image/png"
              className="sr-only"
              onChange={onCoverUpload}
            />
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-3 shadow-sm">
              <ImageIcon size={20} className="text-on-primary" />
            </div>
            <p className="font-body-md font-semibold text-on-surface mb-1">
              {formData.coverImage ? 'Tap to change cover photo' : 'Tap to add cover photo'}
            </p>
            <p className="font-body-sm text-on-surface-variant">JPEG or PNG, max 5MB</p>
          </label>
          {errors.coverImage && (
            <p className="text-xs text-error font-semibold mt-1 px-1">{errors.coverImage.message}</p>
          )}
        </div>

        {/* Nomajin celebration */}
        <div className="flex flex-col items-center text-center p-6 bg-secondary-container/20 rounded-2xl border border-secondary-container/40">
          <div className="mb-3">
            <NomajinFace size={56} />
          </div>
          <p className="font-body-md text-on-surface leading-relaxed">
            You&apos;re almost there! NOMAJIN is ready to welcome your new adventure.
          </p>
        </div>

        {/* Terms */}
        <Controller
          name="agreed"
          control={control}
          rules={{ required: 'You must agree to the terms to publish' }}
          render={({ field: { onChange, value } }) => (
            <div className="flex flex-col gap-1">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={value}
                  onCheckedChange={onChange}
                  className="mt-0.5 shrink-0"
                />
                <label htmlFor="terms" className="font-body-sm text-on-surface-variant leading-relaxed cursor-pointer">
                  I agree to the{' '}
                  <Button variant="link" size="sm" className="inline p-0 h-auto text-sm" onClick={() => setShowTerms(true)}>
                    Terms &amp; Conditions
                  </Button>{' '}
                  and confirm that this experience complies with community guidelines.
                </label>
              </div>
              {errors.agreed && (
                <p className="text-xs text-error font-semibold ml-8">{errors.agreed.message}</p>
              )}
            </div>
          )}
        />
      </main>

      <CreateExperienceFooter step={3} onPublish={onPublish} buttonState={buttonState} agreed={agreed} />
    </>
  );
}
