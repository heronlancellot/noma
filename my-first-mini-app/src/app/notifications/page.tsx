'use client';

import { Navigation } from '@/components/Navigation';

interface Notification {
  id: string;
  type: 'approved' | 'pending';
  hostName: string;
  experienceName?: string;
  timeAgo: string;
  avatar?: string;
  initials?: string;
  body?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'approved',
    hostName: 'Anna Mendez',
    experienceName: 'Abuela Secret Empanada',
    timeAgo: '5m ago',
  },
  {
    id: '2',
    type: 'approved',
    hostName: 'John Fisher',
    experienceName: 'Sunset Tango',
    timeAgo: '30m ago',
  },
  {
    id: '3',
    type: 'pending',
    hostName: 'José Gimenez',
    initials: 'JG',
    timeAgo: '45m ago',
    body: "We've received your request and your approval is pending.",
  },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase();
}

export default function NotificationsPage() {
  const approved = MOCK_NOTIFICATIONS.filter(n => n.type === 'approved');
  const pending = MOCK_NOTIFICATIONS.filter(n => n.type === 'pending');

  return (
    <div className="bg-background text-on-background min-h-screen pb-24 md:pb-0">
      {/* TopAppBar */}
      <header className="sticky top-0 z-50 shadow-sm bg-surface">
        <div className="flex justify-between items-center w-full px-5 h-16">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-surface-container flex items-center justify-center hover:bg-surface-container-low cursor-pointer transition-colors">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-on-surface-variant">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 className="font-h2 text-on-surface">NOMA</h1>
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors text-primary">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-md mx-auto px-5 py-6 flex flex-col gap-4">
        {/* Page Title */}
        <header className="mb-1">
          <h2 className="font-h1 text-on-background">Activity</h2>
          <p className="font-body-sm text-secondary mt-1">Stay updated on your recent interactions.</p>
        </header>

        <div className="flex flex-col gap-3">
          {/* Approved notifications */}
          {approved.map(n => (
            <div
              key={n.id}
              className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-variant flex items-start gap-4 relative overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Left accent line */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-2xl" />

              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center shadow-sm">
                  <span className="text-sm font-bold text-on-surface-variant">
                    {getInitials(n.hostName)}
                  </span>
                </div>
                {/* Check badge */}
                <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary rounded-full w-5 h-5 flex items-center justify-center border-2 border-surface-container-lowest shadow-sm">
                  <svg width="9" height="9" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-label-caps text-primary">Request Approved</span>
                  <span className="font-body-sm text-secondary text-xs whitespace-nowrap ml-2">{n.timeAgo}</span>
                </div>
                <p className="font-body-sm text-on-background leading-snug">
                  <span className="font-bold text-on-surface-variant">{n.hostName}</span>
                  {' '}approved your request for:{' '}
                  <span className="font-semibold text-primary-container">{n.experienceName}</span>
                </p>
              </div>
            </div>
          ))}

          {/* Divider */}
          <div className="h-px bg-outline-variant/30 my-1" />

          {/* Pending notifications */}
          {pending.map(n => (
            <div
              key={n.id}
              className="bg-surface-container-low rounded-2xl p-4 flex items-start gap-4 border border-transparent hover:border-outline-variant/50 transition-colors"
            >
              {/* Avatar — initials */}
              <div className="relative shrink-0 opacity-80">
                <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center">
                  <span className="font-h3 text-on-surface-variant">
                    {n.initials ?? getInitials(n.hostName)}
                  </span>
                </div>
                {/* Hourglass badge */}
                <div className="absolute -bottom-1 -right-1 bg-tertiary-container text-on-tertiary-container rounded-full w-5 h-5 flex items-center justify-center border-2 border-surface-container-low shadow-sm">
                  <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                    <path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-label-caps text-tertiary-container">Pending Approval</span>
                  <span className="font-body-sm text-secondary text-xs whitespace-nowrap ml-2">{n.timeAgo}</span>
                </div>
                <p className="font-body-sm text-secondary leading-snug">
                  <span className="font-bold text-on-surface-variant">{n.hostName}:</span>{' '}
                  {n.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Navigation />
    </div>
  );
}
