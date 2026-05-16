'use client';

import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { User, Search, Check, Hourglass, Plus, Calendar } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getAllExperiencesAddresses,
  getUserApprovedExperiences,
  getUserRequestedExperiences,
  getExperienceDetails,
} from '@/lib/contractUtils';

interface Notification {
  id: string;
  type: 'approved' | 'pending' | 'created';
  title: string;
  experienceName: string;
  experienceId: number;
  timeLabel: string;
}



export function NotificationsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!session?.user) return;
      const userAddress = session.user.walletAddress || session.user.id;
      if (!userAddress) return;

      try {
        const notifs: Notification[] = [];

        // Fetch experiences created by user
        const allExperiences = await getAllExperiencesAddresses();
        const createdByUser = allExperiences.filter(
          (exp) => exp.creator.toLowerCase() === userAddress.toLowerCase()
        );

        for (const exp of createdByUser) {
          notifs.push({
            id: `created-${exp.id}`,
            type: 'created',
            title: 'Experience Published',
            experienceName: exp.title,
            experienceId: exp.id,
            timeLabel: formatTimestamp(exp.startTime),
          });
        }

        // Fetch approved experiences for user
        const approvedIds = await getUserApprovedExperiences(userAddress);
        for (const expId of approvedIds) {
          try {
            const details = await getExperienceDetails(expId);
            notifs.push({
              id: `approved-${expId}`,
              type: 'approved',
              title: 'Request Approved',
              experienceName: details.title,
              experienceId: expId,
              timeLabel: formatTimestamp(details.startTime),
            });
          } catch { /* skip */ }
        }

        // Fetch pending (requested but not approved) experiences
        const requestedIds = await getUserRequestedExperiences(userAddress);
        const pendingIds = requestedIds.filter(id => !approvedIds.includes(id));
        for (const expId of pendingIds) {
          try {
            const details = await getExperienceDetails(expId);
            notifs.push({
              id: `pending-${expId}`,
              type: 'pending',
              title: 'Pending Approval',
              experienceName: details.title,
              experienceId: expId,
              timeLabel: formatTimestamp(details.startTime),
            });
          } catch { /* skip */ }
        }

        setNotifications(notifs);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [session]);

  function formatTimestamp(ts: bigint) {
    if (!ts || ts === BigInt(0)) return '';
    const date = new Date(Number(ts) * 1000);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  const created = notifications.filter(n => n.type === 'created');
  const approved = notifications.filter(n => n.type === 'approved');
  const pending = notifications.filter(n => n.type === 'pending');

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-24 md:pb-0">
      {/* TopAppBar */}
      <header className="sticky top-0 z-50 shadow-sm bg-surface">
        <div className="flex justify-between items-center w-full px-5 h-16">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-surface-container flex items-center justify-center hover:bg-surface-container-low cursor-pointer transition-colors">
            <User size={18} strokeWidth={2} className="text-on-surface-variant" />
          </div>
          <span className="font-h2 text-on-surface">NOMA</span>
          <Button variant="ghost" size="icon-sm" aria-label="Search">
            <Search size={18} strokeWidth={2} className="text-primary" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-md mx-auto px-5 py-6 flex flex-col gap-4">
        <div className="mb-1">
          <h1 className="font-h1 text-on-surface">Activity</h1>
          <p className="font-body-sm text-secondary mt-1">Stay updated on your recent interactions.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 py-10 px-6 text-center shadow-sm">
            <p className="font-h3 text-on-surface mb-2">No activity yet</p>
            <p className="font-body-sm text-secondary">Create or join experiences to see your activity here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Created experiences */}
            {created.map(n => (
              <div
                key={n.id}
                role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') router.push(`/experience/${n.experienceId}`); }} onClick={() => router.push(`/experience/${n.experienceId}`)}
                className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-variant flex items-start gap-4 relative overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary-container rounded-l-2xl" />
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-tertiary-fixed/20 flex items-center justify-center shadow-sm">
                    <Plus size={20} strokeWidth={2.5} className="text-tertiary-container" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-label-caps text-tertiary-container">{n.title}</span>
                    {n.timeLabel && (
                      <span className="text-xs text-secondary whitespace-nowrap ml-2">{n.timeLabel}</span>
                    )}
                  </div>
                  <p className="font-body-sm text-on-surface leading-snug">
                    You published{' '}
                    <span className="font-semibold text-primary-container">{n.experienceName}</span>
                  </p>
                </div>
              </div>
            ))}

            {created.length > 0 && (approved.length > 0 || pending.length > 0) && (
              <div className="h-px bg-outline-variant/30 my-1" />
            )}

            {/* Approved notifications */}
            {approved.map(n => (
              <div
                key={n.id}
                role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') router.push(`/experience/${n.experienceId}`); }} onClick={() => router.push(`/experience/${n.experienceId}`)}
                className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-variant flex items-start gap-4 relative overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-2xl" />
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center shadow-sm">
                    <Calendar size={18} strokeWidth={2} className="text-on-surface-variant" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary rounded-full w-5 h-5 flex items-center justify-center border-2 border-surface-container-lowest shadow-sm">
                    <Check size={9} className="text-on-primary" strokeWidth={2.5} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-label-caps text-primary">{n.title}</span>
                    {n.timeLabel && (
                      <span className="text-xs text-secondary whitespace-nowrap ml-2">{n.timeLabel}</span>
                    )}
                  </div>
                  <p className="font-body-sm text-on-surface leading-snug">
                    Your request for{' '}
                    <span className="font-semibold text-primary-container">{n.experienceName}</span>
                    {' '}was approved
                  </p>
                </div>
              </div>
            ))}

            {approved.length > 0 && pending.length > 0 && (
              <div className="h-px bg-outline-variant/30 my-1" />
            )}

            {/* Pending notifications */}
            {pending.map(n => (
              <div
                key={n.id}
                role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') router.push(`/experience/${n.experienceId}`); }} onClick={() => router.push(`/experience/${n.experienceId}`)}
                className="bg-surface-container-low rounded-2xl p-4 flex items-start gap-4 border border-transparent hover:border-outline-variant/50 transition-colors cursor-pointer"
              >
                <div className="relative shrink-0 opacity-80">
                  <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center">
                    <Calendar size={18} strokeWidth={2} className="text-on-surface-variant" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-tertiary-container text-on-tertiary-container rounded-full w-5 h-5 flex items-center justify-center border-2 border-surface-container-low shadow-sm">
                    <Hourglass size={9} strokeWidth={2} className="text-on-tertiary-container" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-label-caps text-tertiary-container">{n.title}</span>
                    {n.timeLabel && (
                      <span className="text-xs text-secondary whitespace-nowrap ml-2">{n.timeLabel}</span>
                    )}
                  </div>
                  <p className="font-body-sm text-secondary leading-snug">
                    Waiting for approval on{' '}
                    <span className="font-bold text-on-surface-variant">{n.experienceName}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
}
