'use client';

import { Control, FieldErrors, Controller, useWatch } from 'react-hook-form';
import { CreateFormData, ButtonState } from '@/features/create-experience/types';
import { ImageIcon, MapPin, Clock } from 'lucide-react';
import { CreateExperienceHeader } from '@/features/create-experience/components/Header';
import { CreateExperienceFooter } from '@/features/create-experience/components/Footer';
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

  return (
    <>
      <CreateExperienceHeader step={3} onBack={onBack} />

      <main className="flex-1 overflow-y-auto px-container-padding py-lg pb-32 flex flex-col gap-stack-gap">

        {/* Experience Preview */}
        <div>
          <h3 className="font-h3 text-on-surface mb-3">Experience Preview</h3>
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-card">
            <div className="relative w-full h-44">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formData.coverImage || '/image-default.png'}
                alt="Cover"
                className="w-full h-full object-cover"
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
                  <span className="text-sm">{formData.location}</span>
                </div>
              )}

              {(formData.duration || formData.maxGuests) && (
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <Clock size={14} />
                  <span className="text-sm">
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
            <p className="text-sm text-on-surface-variant">JPEG or PNG, max 5MB</p>
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
                <label htmlFor="terms" className="text-sm text-on-surface-variant leading-relaxed cursor-pointer">
                  I agree to the{' '}
                  <span className="text-primary font-semibold underline decoration-primary/30">
                    Terms &amp; Conditions
                  </span>{' '}
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
