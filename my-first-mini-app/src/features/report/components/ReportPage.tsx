'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, ChevronDown, Send, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ReportFormData {
  experienceName: string;
  typeOfIssue: string;
  whatHappened: string;
  contactEmail: string;
}

const EXPERIENCES = ['Sunrise Ridge Trek', 'Morning Swell Session', 'Sunset Kayaking', 'Forest Yoga Retreat'];
const ISSUE_TYPES = ['Host Behavior', 'Location Inaccuracy', 'Safety Concern', 'App/Technical Bug', 'Other'];

const SadMascot = () => (
  <Image src="/nomajin-sad.png" width={80} height={80} alt="NOMAJIN triste" className="object-contain" />
);

export function ReportPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ReportFormData>({
    experienceName: '',
    typeOfIssue: '',
    whatHappened: '',
    contactEmail: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ReportFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSelectChange = (field: keyof ReportFormData) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ReportFormData]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ReportFormData, string>> = {};
    if (!formData.experienceName) newErrors.experienceName = 'Required';
    if (!formData.typeOfIssue) newErrors.typeOfIssue = 'Required';
    if (!formData.whatHappened.trim()) newErrors.whatHappened = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface-container flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="font-h2 text-foreground mb-2">Report Submitted!</h2>
          <p className="font-body-sm text-secondary mb-8">We&apos;ll review it and get back to you soon.</p>
          <Button variant="primary" size="lg" onClick={() => router.push('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container">
      {/* Back button */}
      <div className="px-4 pt-12 pb-2">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()} className="bg-black/8">
          <ChevronLeft size={20} strokeWidth={2.5} />
        </Button>
      </div>

      {/* Mascot + heading */}
      <div className="text-center px-6 mb-5">
        <div className="flex justify-center mb-4">
          <SadMascot />
        </div>
        <h1 className="font-h1 text-foreground mb-2">Oh no!</h1>
        <p className="font-body-sm text-secondary leading-relaxed">
          We&apos;re sorry things didn&apos;t go as planned. Let us know how we can help make it right.
        </p>
      </div>

      {/* Form card */}
      <div className="px-4 pb-12">
        <form onSubmit={handleSubmit}>
          <div className="bg-surface-container-lowest rounded-2xl p-5 space-y-5 shadow-sm">

            {/* Experience Name */}
            <div>
              <Label className="font-label-caps text-foreground mb-1.5">
                Experience Name
              </Label>
              <div className="relative">
                <select
                  value={formData.experienceName}
                  onChange={handleSelectChange('experienceName')}
                  className={`w-full appearance-none pr-10 px-4 py-3 rounded-xl border-[1.5px] bg-surface-container-lowest text-foreground font-body-sm focus:outline-none ${
                    errors.experienceName ? 'border-error' : 'border-outline-variant'
                  } ${!formData.experienceName ? 'text-outline' : ''}`}
                >
                  <option value="">Select an experience</option>
                  {EXPERIENCES.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown size={16} strokeWidth={2} className="text-secondary" />
                </div>
              </div>
              {errors.experienceName && <p className="mt-1 text-xs text-error">{errors.experienceName}</p>}
            </div>

            {/* Type of Issue */}
            <div>
              <Label className="font-label-caps text-foreground mb-1.5">
                Type of Issue
              </Label>
              <div className="relative">
                <select
                  value={formData.typeOfIssue}
                  onChange={handleSelectChange('typeOfIssue')}
                  className={`w-full appearance-none pr-10 px-4 py-3 rounded-xl border-[1.5px] bg-surface-container-lowest text-foreground font-body-sm focus:outline-none ${
                    errors.typeOfIssue ? 'border-error' : 'border-outline-variant'
                  } ${!formData.typeOfIssue ? 'text-outline' : ''}`}
                >
                  <option value="">Select a category</option>
                  {ISSUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown size={16} strokeWidth={2} className="text-secondary" />
                </div>
              </div>
              {errors.typeOfIssue && <p className="mt-1 text-xs text-error">{errors.typeOfIssue}</p>}
            </div>

            {/* What Happened */}
            <div>
              <Label className="font-label-caps text-foreground mb-1.5">
                What Happened?
              </Label>
              <Textarea
                name="whatHappened"
                value={formData.whatHappened}
                onChange={handleInputChange}
                placeholder="Please provide details about your experience..."
                rows={4}
                className={`resize-none rounded-xl border-[1.5px] ${
                  errors.whatHappened ? 'border-error' : 'border-outline-variant'
                }`}
              />
              {errors.whatHappened && <p className="mt-1 text-xs text-error">{errors.whatHappened}</p>}
            </div>

            {/* Attach Evidence */}
            <div>
              <Label className="font-label-caps text-foreground mb-1.5">
                Attach Evidence
              </Label>
              <div className="flex gap-3">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-[1.5px] border-outline-variant">
                  <div className="w-full h-full flex items-center justify-center bg-surface-container-low">
                    <SadMascot />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1 flex-shrink-0 border-dashed border-[1.5px] border-outline-variant bg-surface"
                >
                  <Plus size={20} strokeWidth={2} className="text-outline" />
                  <span className="text-xs font-semibold uppercase text-outline">Add</span>
                </Button>
              </div>
              <p className="mt-2 text-xs italic text-outline">You can upload multiple photos or videos</p>
            </div>

            {/* Contact Email */}
            <div>
              <Label className="font-label-caps text-foreground mb-1.5">
                Contact E-mail
              </Label>
              <Input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                placeholder="hello@example.com"
                className="rounded-xl border-[1.5px] border-outline-variant"
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="xl"
              disabled={isSubmitting}
              className="rounded-full"
            >
              {isSubmitting ? 'Submitting...' : (
                <>Submit Report <Send size={16} strokeWidth={2} /></>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
