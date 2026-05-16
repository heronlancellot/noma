'use client';

import { UseFormRegister, Control, FieldErrors, Controller } from 'react-hook-form';
import { CreateFormData } from '@/features/create-experience/types';
import { ChevronsUpDown } from 'lucide-react';
import NomajinFace from './NomajinFace';
import { CreateExperienceHeader } from '@/features/create-experience/components/Header';
import { CreateExperienceFooter } from '@/features/create-experience/components/Footer';
import { Textarea } from '@/components/ui/textarea';
import { FormError } from '@/components/ui/form-error';

const CATEGORIES = ['Wellness & Health', 'Outdoor Adventure', 'Art & Culture', 'Food & Drink', 'Social', 'Other'];

interface Props {
  register: UseFormRegister<CreateFormData>;
  control: Control<CreateFormData>;
  errors: FieldErrors<CreateFormData>;
  onNext: () => void;
  onClose: () => void;
}

export default function CreateExperienceStep1({ register, control, errors, onNext, onClose }: Props) {

  return (
    <>
      <CreateExperienceHeader step={1} onClose={onClose} />

      <main className="flex-1 px-container-padding pb-32 overflow-y-auto">
        <form className="flex flex-col gap-md mt-md">
          {/* Title */}
          <div className="flex flex-col gap-sm">
            <label className="font-body-md font-bold text-on-surface ml-1" htmlFor="exp-title">Title</label>
            <input
              id="exp-title"
              type="text"
              {...register('title', { required: 'Required' })}
              placeholder="e.g., Sunset Yoga on the Beach"
              className={`w-full bg-surface-container-lowest border border-outline-variant rounded-lg !p-3 font-body-md text-on-surface placeholder:text-secondary-fixed-dim focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${errors.title ? 'border-error' : ''}`}
            />
            <FormError msg={errors.title?.message} />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-sm">
            <label className="font-body-md font-bold text-on-surface ml-1" htmlFor="exp-desc">Description</label>
            <Textarea
              id="exp-desc"
              rows={4}
              {...register('description', { required: 'Required' })}
              placeholder="Describe what makes your experience unique..."
              className={`w-full bg-surface-container-lowest border border-outline-variant  rounded-lg !p-3  font-body-md text-on-surface placeholder:text-secondary-fixed-dim focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none ${errors.description ? 'border-error' : ''}`}
            />
            <FormError msg={errors.description?.message} />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-sm">
            <label className="font-body-md font-bold text-on-surface ml-1" htmlFor="exp-cat">Category</label>
            <div className="relative">
              <Controller
                name="category"
                control={control}
                rules={{ required: 'Required' }}
                render={({ field }) => (
                  <select
                    {...field}
                    id="exp-cat"
                    className={`w-full bg-surface-container-lowest border border-outline-variant rounded-lg !p-3 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none pr-10 ${errors.category ? 'border-error' : ''} ${!field.value ? 'text-secondary-fixed-dim' : ''}`}
                  >
                    <option value="" disabled>Select a category</option>
                    {CATEGORIES.map(c => (
                      <option key={c} value={c} className="text-on-surface">{c}</option>
                    ))}
                  </select>
                )}
              />
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-on-surface-variant">
                <ChevronsUpDown size={20} />
              </div>
            </div>
            <FormError msg={errors.category?.message} />
          </div>

          {/* Nomajin tip card */}
          <div className="mt-sm bg-secondary-container rounded-2xl p-4 flex gap-md items-start shadow-sm relative overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-surface-container-lowest shrink-0 overflow-hidden shadow-sm flex items-center justify-center border-2 border-primary-container z-10">
              <NomajinFace size={34} />
            </div>
            <div className="flex-1 z-10">
              <h3 className="font-h3 text-on-secondary-container mb-1">Nomajin says:</h3>
              <p className="font-body-sm text-on-secondary-container opacity-90">
                Keep your title short and descriptive! People love knowing exactly what they&apos;re signing up for.
              </p>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl z-0" />
          </div>
        </form>
      </main>

      <CreateExperienceFooter onNext={onNext} step={1}/>
    </>
  );
}
