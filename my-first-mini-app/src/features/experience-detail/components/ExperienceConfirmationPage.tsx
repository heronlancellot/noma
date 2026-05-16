'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import { getExperienceDetails } from '@/lib/contractUtils';
import type { ExperienceConfirmationData } from '@/features/experience-detail/types';

export function ExperienceConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const [experience, setExperience] = useState<ExperienceConfirmationData | null>(null);
  const [loading, setLoading] = useState(true);
  const experienceId = params.id as string;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = parseInt(experienceId, 10);
        if (isNaN(id)) return;
        const data = await getExperienceDetails(id);
        setExperience({
          id: data.id.toString(),
          title: data.title,
          location: data.location,
          startTime: data.startTime,
          image: data.coverImage || '/image-default.png',
        });
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [experienceId]);

  const formatDate = (ts?: bigint) => {
    if (!ts || ts === BigInt(0)) return 'TBD';
    return new Date(Number(ts) * 1000).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen flex flex-col items-center px-5 pt-16 pb-12">
      {/* Mascot */}
      <div className="mb-5">
        <Image src="/nomajin-happy.png" alt="NOMAJIN" width={96} height={96} />
      </div>

      <h1 className="font-h2 text-foreground text-center mb-3 leading-tight">
        Your spot is being<br />reserved! 🎉
      </h1>
      <p className="font-body-sm text-secondary text-center mb-8 leading-relaxed max-w-[280px]">
        The organizer will review your request shortly. Get ready for adventure!
      </p>

      {experience && (
        <div
          className="w-full rounded-2xl overflow-hidden mb-6 bg-surface border border-tertiary-fixed-dim/40"
          style={{ boxShadow: '0 2px 12px rgba(13,31,53,0.08)' }}
        >
          <div className="flex items-center gap-3 p-4">
            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={experience.image}
                alt={experience.title}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-block font-label-caps font-bold px-2 py-0.5 rounded-full mb-1 bg-tertiary-fixed/20 text-tertiary-container">
                Pending Approval
              </span>
              <h3 className="font-body-md font-bold text-foreground leading-tight truncate">{experience.title}</h3>
              {experience.startTime && experience.startTime > BigInt(0) && (
                <div className="flex items-center gap-1 mt-1">
                  <Calendar size={11} strokeWidth={2} className="text-secondary" />
                  <span className="text-xs text-secondary">{formatDate(experience.startTime)}</span>
                </div>
              )}
              {experience.location && (
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={11} strokeWidth={2} className="text-secondary" />
                  <span className="text-xs text-secondary truncate">{experience.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => router.push('/')}
        className="w-full py-4 rounded-2xl font-body-md font-bold text-white mb-4 transition-opacity active:opacity-80 bg-noma-btn"
      >
        Back to Home
      </button>

      <button
        onClick={() => router.push(`/experience/${experienceId}`)}
        className="font-body-sm font-semibold text-secondary"
      >
        View Request Details
      </button>
    </div>
  );
}
