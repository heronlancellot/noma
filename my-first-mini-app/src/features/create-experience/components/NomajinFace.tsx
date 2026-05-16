'use client';

import Image from 'next/image';

interface Props {
  size?: number;
}

export default function NomajinFace({ size = 36 }: Props) {
  return (
    <Image
      src="/nomajin-happy.png"
      width={size}
      height={size}
      alt="NOMAJIN"
      className="object-contain"
    />
  );
}
