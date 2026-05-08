'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getExperienceDetails } from '@/lib/contractUtils';

interface ExperienceData {
  id: string;
  title: string;
  location: string;
  startTime?: bigint;
  image: string;
}

function NomajinMascot() {
  return (
    <svg width="120" height="140" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <line
          key={i}
          x1={60 + Math.cos((angle * Math.PI) / 180) * 42}
          y1={55 + Math.sin((angle * Math.PI) / 180) * 42}
          x2={60 + Math.cos((angle * Math.PI) / 180) * 52}
          y2={55 + Math.sin((angle * Math.PI) / 180) * 52}
          stroke="#f5c000"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}
      {/* Body */}
      <circle cx="60" cy="55" r="36" fill="#f5c000" />
      {/* Left eye */}
      <circle cx="48" cy="48" r="5" fill="#0d1f35" />
      <circle cx="46" cy="46" r="1.5" fill="white" />
      {/* Right eye winking */}
      <path d="M68 46 Q74 43 80 46" stroke="#0d1f35" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Cheeks */}
      <circle cx="42" cy="56" r="7" fill="#f8b4b4" opacity="0.7" />
      <circle cx="78" cy="56" r="7" fill="#f8b4b4" opacity="0.7" />
      {/* Smile */}
      <path d="M48 65 Q60 76 72 65" stroke="#0d1f35" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Legs */}
      <rect x="44" y="88" width="14" height="28" rx="7" fill="#4a7fc1" />
      <rect x="62" y="88" width="14" height="28" rx="7" fill="#4a7fc1" />
    </svg>
  );
}

export default function ExperienceConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const [experience, setExperience] = useState<ExperienceData | null>(null);
  const [loading, setLoading] = useState(true);
  const experienceId = params.id as string;

  useEffect(() => {
    const fetch = async () => {
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
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [experienceId]);

  const formatDate = (ts?: bigint) => {
    if (!ts || ts === BigInt(0)) return 'TBD';
    const d = new Date(Number(ts) * 1000);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#fafaf8', minHeight: '100vh' }} className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#db5852' }} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fafaf8', minHeight: '100vh' }} className="flex flex-col items-center px-5 pt-16 pb-12">
      {/* Mascot */}
      <div className="mb-5">
        <NomajinMascot />
      </div>

      {/* Heading */}
      <h1 className="text-[24px] font-bold text-center mb-3 leading-tight" style={{ color: '#0d1f35' }}>
        Your spot is being<br />reserved! 🎉
      </h1>
      <p className="text-[14px] text-center mb-8 leading-relaxed" style={{ color: '#5a5a6e', maxWidth: 280 }}>
        The organizer will review your request shortly. Get ready for adventure!
      </p>

      {/* Experience preview card */}
      {experience && (
        <div
          className="w-full rounded-2xl overflow-hidden mb-6"
          style={{ backgroundColor: '#fff', border: '1.5px solid rgba(245,192,0,0.4)', boxShadow: '0 2px 12px rgba(13,31,53,0.08)' }}
        >
          <div className="flex items-center gap-3 p-4">
            {/* Thumbnail */}
            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={experience.image} alt={experience.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              {/* Pending badge */}
              <span
                className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 uppercase tracking-wide"
                style={{ backgroundColor: 'rgba(245,192,0,0.18)', color: '#b38d00' }}
              >
                Pending Approval
              </span>
              <h3 className="font-bold text-[14px] leading-tight truncate" style={{ color: '#0d1f35' }}>{experience.title}</h3>
              {experience.startTime && experience.startTime > BigInt(0) && (
                <div className="flex items-center gap-1 mt-1">
                  <svg width="11" height="11" fill="none" stroke="#5a5a6e" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span className="text-[11px]" style={{ color: '#5a5a6e' }}>{formatDate(experience.startTime)}</span>
                </div>
              )}
              {experience.location && (
                <div className="flex items-center gap-1 mt-0.5">
                  <svg width="11" height="11" fill="none" stroke="#5a5a6e" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="text-[11px] truncate" style={{ color: '#5a5a6e' }}>{experience.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Back to Home */}
      <button
        onClick={() => router.push('/')}
        className="w-full py-4 rounded-2xl font-bold text-[16px] text-white mb-4 transition-opacity active:opacity-80"
        style={{ backgroundColor: '#db5852' }}
      >
        Back to Home
      </button>

      {/* View details */}
      <button
        onClick={() => router.push(`/experience/${experienceId}`)}
        className="text-[14px] font-semibold"
        style={{ color: '#5a5a6e' }}
      >
        View Request Details
      </button>
    </div>
  );
}
