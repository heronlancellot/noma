'use client';
import { CheckCircle2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export const UserInfo = () => {
  const session = useSession();
  const avatarUrl = session?.data?.user?.profilePictureUrl;
  const username = session?.data?.user?.username;

  return (
    <div className="flex flex-row items-center justify-start gap-4 rounded-2xl w-full border border-outline-variant/30 p-4 bg-surface-container-lowest shadow-sm">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={username || 'User'}
          width={56}
          height={56}
          className="w-14 h-14 rounded-full object-cover"
        />
      ) : (
        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
          <span className="font-quicksand-bold text-xl text-white">
            {(username || 'U').charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <div className="flex flex-row items-center justify-center">
        <span className="font-h3 text-on-surface capitalize">
          {username}
        </span>
        {avatarUrl && (
          <div className="ml-1.5 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
            <CheckCircle2 size={14} className="text-white" />
          </div>
        )}
      </div>
    </div>
  );
};
