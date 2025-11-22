'use client';

import { Marble, Button } from '@worldcoin/mini-apps-ui-kit-react';
import Image from 'next/image';
import { ProgressCircle } from '@/components/ProgressCircle';

const gallery = new Array(4).fill(0).map((_, i) => ({
  id: i + 1,
  title: 'Daily Activity',
  time: '3 Hours ago',
  image: '/globe.svg',
}));

export const Profile = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="relative h-44 w-full rounded-2xl overflow-hidden">
        <Image src="/window.svg" alt="cover" fill className="object-cover" />
        <div className="absolute top-4 right-4">
          <div className="w-8 h-8 rounded-lg bg-rose-500/90" />
        </div>
        <div className="absolute -bottom-8 left-6 flex items-center gap-3">
          <Marble src={undefined} className="w-16" />
          <div>
            <p className="text-xl font-semibold">Mikaele</p>
            <p className="text-sm text-gray-600">@Mika_sza</p>
          </div>
        </div>
      </div>
      <div className="h-8" />

      {/* Stats */}
      <div className="flex items-center gap-8">
        <div>
          <p className="text-xl font-semibold">10</p>
          <p className="text-sm text-gray-600">Experiences</p>
        </div>
        <div>
          <p className="text-xl font-semibold">30</p>
          <p className="text-sm text-gray-600">People Meet</p>
        </div>
      </div>
      <div className="border-t mt-2" />

      {/* NFT Gallery */}
      <div className="flex flex-col gap-3">
        <p className="text-lg font-semibold">NFT Gallery</p>
        <div className="grid grid-cols-2 gap-4">
          {gallery.map((g) => (
            <div key={g.id} className="rounded-xl overflow-hidden bg-white shadow">
              <img src={g.image} alt="nft" className="h-28 w-full object-cover" />
              <div className="p-3">
                <p className="text-sm font-semibold">{g.title}</p>
                <p className="text-xs text-gray-600">{g.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="flex flex-col gap-3">
        <p className="text-lg font-semibold">NOMA Mission</p>
        <div className="rounded-xl bg-white shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Meet 3 new people through NOMA</p>
            <p className="text-xs text-gray-600">Period: November 1st–30th, 2025</p>
          </div>
          <ProgressCircle value={33} />
        </div>
      </div>

      {/* Floating Action Button mimic */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2">
        <Button size="lg" variant="primary">+</Button>
      </div>
    </div>
  );
};