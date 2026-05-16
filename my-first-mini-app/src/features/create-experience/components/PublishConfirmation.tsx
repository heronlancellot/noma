'use client';

import { useRouter } from 'next/navigation';
import { Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import { CreateFormData } from '@/features/create-experience/types';

interface Props {
  formData: CreateFormData;
  experienceId?: string;
}

export default function PublishConfirmation({ formData, experienceId }: Props) {
  const router = useRouter();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'TBD';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-surface min-h-screen flex flex-col items-center px-5 pt-16 pb-12">
      {/* Mascot */}
      <div className="mb-5">
        <Image src="/nomajin-thumbsup.png" alt="NOMAJIN" width={96} height={96} />
      </div>

      <h1 className="font-h2 text-foreground text-center mb-3 leading-tight">
        Your experience is<br />published! 🎉
      </h1>
      <p className="font-body-sm text-secondary text-center mb-8 leading-relaxed max-w-[280px]">
        Your experience is now live and ready for guests to discover. Get ready to host!
      </p>

      {/* Experience card */}
      <div
        className="w-full rounded-2xl overflow-hidden mb-6 bg-surface border border-tertiary-fixed-dim/40"
        style={{ boxShadow: '0 2px 12px rgba(13,31,53,0.08)' }}
      >
        <div className="flex items-center gap-3 p-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src={formData.coverImage || '/image-default.png'}
              alt={formData.title}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="inline-block font-label-caps font-bold px-2 py-0.5 rounded-full mb-1 bg-primary/10 text-primary">
              Published
            </span>
            <h3 className="font-body-md font-bold text-foreground leading-tight truncate">
              {formData.title}
            </h3>
            {formData.date && (
              <div className="flex items-center gap-1 mt-1">
                <Calendar size={11} strokeWidth={2} className="text-secondary" />
                <span className="text-xs text-secondary">{formatDate(formData.date)}</span>
              </div>
            )}
            {formData.location && (
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={11} strokeWidth={2} className="text-secondary" />
                <span className="text-xs text-secondary truncate">{formData.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => router.push('/')}
        className="w-full py-4 rounded-2xl font-body-md font-bold text-white mb-4 transition-opacity active:opacity-80 bg-noma-btn"
      >
        Back to Home
      </button>

      {experienceId && (
        <button
          onClick={() => router.push(`/experience/${experienceId}`)}
          className="font-body-sm font-semibold text-secondary"
        >
          View Experience Details
        </button>
      )}
    </div>
  );
}
