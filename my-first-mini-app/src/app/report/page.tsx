'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ReportFormData {
  experienceName: string;
  typeOfIssue: string;
  whatHappened: string;
  contactEmail: string;
}

const EXPERIENCES = ['Sunrise Ridge Trek', 'Morning Swell Session', 'Sunset Kayaking', 'Forest Yoga Retreat'];
const ISSUE_TYPES = ['Host Behavior', 'Location Inaccuracy', 'Safety Concern', 'App/Technical Bug', 'Other'];

const SadMascot = () => (
  <svg width="80" height="80" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="50" fill="#e8c4b0" />
    <circle cx="60" cy="60" r="38" fill="#d4a08a" />
    {/* Sad eyes */}
    <circle cx="46" cy="52" r="4" fill="#6b3a2a" />
    <circle cx="74" cy="52" r="4" fill="#6b3a2a" />
    {/* Sad brow */}
    <path d="M40 44 Q46 40 52 44" stroke="#6b3a2a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M68 44 Q74 40 80 44" stroke="#6b3a2a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* Sad mouth */}
    <path d="M48 72 Q60 65 72 72" stroke="#6b3a2a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* Tear */}
    <ellipse cx="44" cy="62" rx="2.5" ry="3.5" fill="#a0c4e8" opacity="0.8" />
  </svg>
);

const ChevronDown = () => (
  <svg width="16" height="16" fill="none" stroke="#5a5a6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

export default function ReportPage() {
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

  const inputStyle = (hasError: boolean) => ({
    width: '100%',
    padding: '12px 16px',
    borderRadius: 12,
    border: `1.5px solid ${hasError ? '#ef4444' : '#e5e7eb'}`,
    backgroundColor: '#fff',
    color: '#0d1f35',
    fontSize: 14,
    outline: 'none',
  });

  if (submitted) {
    return (
      <div style={{ backgroundColor: '#ecd5d3', minHeight: '100vh' }} className="flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-[22px] font-bold mb-2" style={{ color: '#0d1f35' }}>Report Submitted!</h2>
          <p className="text-[14px] mb-8" style={{ color: '#5a5a6e' }}>We'll review it and get back to you soon.</p>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 rounded-full font-bold text-[15px] text-white"
            style={{ backgroundColor: '#db5852' }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#ecd5d3', minHeight: '100vh' }}>
      {/* Back button */}
      <div className="px-4 pt-12 pb-2">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full"
          style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}
        >
          <svg width="20" height="20" fill="none" stroke="#0d1f35" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {/* Mascot + heading */}
      <div className="text-center px-6 mb-5">
        <div className="flex justify-center mb-4">
          <SadMascot />
        </div>
        <h1 className="text-[28px] font-bold mb-2" style={{ color: '#0d1f35' }}>Oh no!</h1>
        <p className="text-[14px] leading-relaxed" style={{ color: '#5a5a6e' }}>
          We&apos;re sorry things didn&apos;t go as planned. Let us know how we can help make it right.
        </p>
      </div>

      {/* Form card */}
      <div className="px-4 pb-12">
        <form onSubmit={handleSubmit}>
          <div className="rounded-2xl p-5 space-y-5" style={{ backgroundColor: '#fff', boxShadow: '0 2px 12px rgba(13,31,53,0.08)' }}>

            {/* Experience Name */}
            <div>
              <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#0d1f35' }}>
                Experience Name
              </label>
              <div className="relative">
                <select
                  value={formData.experienceName}
                  onChange={handleSelectChange('experienceName')}
                  className="w-full appearance-none pr-10 focus:outline-none"
                  style={{ ...inputStyle(!!errors.experienceName), color: formData.experienceName ? '#0d1f35' : '#9ca3af' }}
                >
                  <option value="">Select an experience</option>
                  {EXPERIENCES.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronDown /></div>
              </div>
              {errors.experienceName && <p className="mt-1 text-[12px]" style={{ color: '#ef4444' }}>{errors.experienceName}</p>}
            </div>

            {/* Type of Issue */}
            <div>
              <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#0d1f35' }}>
                Type of Issue
              </label>
              <div className="relative">
                <select
                  value={formData.typeOfIssue}
                  onChange={handleSelectChange('typeOfIssue')}
                  className="w-full appearance-none pr-10 focus:outline-none"
                  style={{ ...inputStyle(!!errors.typeOfIssue), color: formData.typeOfIssue ? '#0d1f35' : '#9ca3af' }}
                >
                  <option value="">Select a category</option>
                  {ISSUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronDown /></div>
              </div>
              {errors.typeOfIssue && <p className="mt-1 text-[12px]" style={{ color: '#ef4444' }}>{errors.typeOfIssue}</p>}
            </div>

            {/* What Happened */}
            <div>
              <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#0d1f35' }}>
                What Happened?
              </label>
              <textarea
                name="whatHappened"
                value={formData.whatHappened}
                onChange={handleInputChange}
                placeholder="Please provide details about your experience..."
                rows={4}
                className="w-full focus:outline-none resize-none"
                style={inputStyle(!!errors.whatHappened)}
              />
              {errors.whatHappened && <p className="mt-1 text-[12px]" style={{ color: '#ef4444' }}>{errors.whatHappened}</p>}
            </div>

            {/* Attach Evidence */}
            <div>
              <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#0d1f35' }}>
                Attach Evidence
              </label>
              <div className="flex gap-3">
                {/* Placeholder existing image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0" style={{ border: '1.5px solid #e5e7eb' }}>
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#f5ede9' }}>
                    <SadMascot />
                  </div>
                </div>
                {/* Add button */}
                <button
                  type="button"
                  className="w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1 flex-shrink-0"
                  style={{ border: '1.5px dashed #e5c5c0', backgroundColor: '#fdf5f4' }}
                >
                  <svg width="20" height="20" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span className="text-[10px] font-semibold uppercase" style={{ color: '#9ca3af' }}>Add</span>
                </button>
              </div>
              <p className="mt-2 text-[11px] italic" style={{ color: '#9ca3af' }}>You can upload multiple photos or videos</p>
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#0d1f35' }}>
                Contact E-mail
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                placeholder="hello@example.com"
                className="focus:outline-none"
                style={inputStyle(false)}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full font-bold text-[15px] flex items-center justify-center gap-2 transition-opacity"
              style={{ backgroundColor: '#db5852', color: '#fff', opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? 'Submitting...' : (
                <>Submit Report <SendIcon /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
