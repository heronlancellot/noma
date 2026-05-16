'use client';

import { useState, useEffect } from 'react';
import { formatUnits } from 'viem';
import { getExperienceDetails } from '@/lib/contractUtils';
import type { ExperienceDetailData } from '../types';

export function useExperienceDetail(experienceId: string) {
  const [experience, setExperience] = useState<ExperienceDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        setError(null);
        const id = parseInt(experienceId, 10);
        if (isNaN(id)) {
          setError('Invalid experience ID');
          setLoading(false);
          return;
        }
        const data = await getExperienceDetails(id);
        setExperience({
          id: data.id.toString(),
          title: data.title,
          description: data.description,
          price: `$${formatUnits(data.price, 18)}`,
          location: data.location,
          rating: 4.8,
          ratingCount: Number(data.participantCount),
          images: data.coverImage ? [data.coverImage] : ['/image-default.png'],
          creator: data.creator,
          organizer: {
            name: data.creator.slice(0, 6) + '...' + data.creator.slice(-4),
            peopleMet: Number(data.participantCount),
          },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load experience');
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, [experienceId]);

  return { experience, loading, error };
}
