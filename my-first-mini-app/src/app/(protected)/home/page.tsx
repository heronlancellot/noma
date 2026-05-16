import { auth } from '@/auth';
import { Page } from '@/components/PageLayout';
import { Pay, Transaction } from '@/features/payments';
import { UserInfo, ViewPermissions } from '@/features/profile';
import { Verify } from '@/features/auth';
import Image from 'next/image';

export default async function Home() {
  const session = await auth();

  return (
    <>
      <Page.Header className="p-0">
        <div className="flex items-center justify-between px-5 h-16 bg-surface border-b border-outline-variant/30">
          <h1 className="font-h3 text-on-surface">Home</h1>
          <div className="flex items-center gap-2">
            <p className="font-body-sm font-semibold capitalize text-on-surface">
              {session?.user.username}
            </p>
            {session?.user.profilePictureUrl ? (
              <Image
                src={session.user.profilePictureUrl}
                alt={session.user.username || 'User'}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="font-quicksand-bold text-lg text-white">
                  {(session?.user.username || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </Page.Header>
      <Page.Main className="flex flex-col items-center justify-start gap-4 mb-16">
        <UserInfo />
        <Verify />
        <Pay />
        <Transaction />
        <ViewPermissions />
      </Page.Main>
    </>
  );
}
