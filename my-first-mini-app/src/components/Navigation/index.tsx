'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Marble } from '@worldcoin/mini-apps-ui-kit-react';

const IconCompass = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" fill="none" stroke={active ? '#db5852' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={active ? '#db5852' : 'none'} stroke={active ? '#db5852' : '#9ca3af'} />
  </svg>
);

const IconCalendar = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" fill="none" stroke={active ? '#db5852' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconPlus = () => (
  <svg width="26" height="26" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconBell = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" fill="none" stroke={active ? '#db5852' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconUser = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" fill="none" stroke={active ? '#db5852' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    if (pathname === '/') setActiveTab('home');
    else if (pathname.includes('/calendar')) setActiveTab('calendar');
    else if (pathname.includes('/create-experience')) setActiveTab('create');
    else if (pathname.includes('/profile')) setActiveTab('profile');
    else if (pathname.includes('/notifications')) setActiveTab('alerts');
  }, [pathname]);

  const NavItem = ({
    tabKey, icon, label, onClick,
  }: { tabKey: string; icon: React.ReactNode; label: string; onClick: () => void }) => {
    const isActive = activeTab === tabKey;
    return (
      <button
        onClick={onClick}
        className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors"
        aria-label={label}
      >
        {icon}
        <span
          className="text-[10px] font-semibold"
          style={{ color: isActive ? '#db5852' : '#9ca3af' }}
        >
          {label}
        </span>
        {isActive && (
          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: '#f5c000' }} />
        )}
      </button>
    );
  };

  // Suppress navigation on transactional flows
  if (pathname.startsWith('/create-experience')) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100"
      style={{ backgroundColor: 'rgba(255,255,255,0.97)', boxShadow: '0 -2px 16px rgba(13,31,53,0.07)' }}
    >
      <div className="flex items-end justify-around px-2 pt-2 pb-3 max-w-md mx-auto">
        <NavItem
          tabKey="home"
          label="Home"
          onClick={() => { setActiveTab('home'); router.push('/'); }}
          icon={<IconCompass active={activeTab === 'home'} />}
        />
        <NavItem
          tabKey="calendar"
          label="Calendar"
          onClick={() => { setActiveTab('calendar'); router.push('/calendar'); }}
          icon={<IconCalendar active={activeTab === 'calendar'} />}
        />

        {/* Create — floating circle */}
        <div className="flex flex-col items-center gap-0.5 flex-1">
          <button
            onClick={() => { setActiveTab('create'); router.push('/create-experience'); }}
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg -mt-5"
            style={{ backgroundColor: '#db5852' }}
            aria-label="Create"
          >
            <IconPlus />
          </button>
          <span
            className="text-[10px] font-semibold"
            style={{ color: activeTab === 'create' ? '#db5852' : '#9ca3af' }}
          >
            Create
          </span>
          {activeTab === 'create' && (
            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: '#f5c000' }} />
          )}
        </div>

        <NavItem
          tabKey="profile"
          label="Profile"
          onClick={() => { setActiveTab('profile'); router.push('/profile'); }}
          icon={
            session?.user?.profilePictureUrl ? (
              <Marble
                src={session.user.profilePictureUrl}
                className={`w-6 h-6 rounded-full ${activeTab === 'profile' ? 'ring-2 ring-[#db5852]' : ''}`}
              />
            ) : (
              <IconUser active={activeTab === 'profile'} />
            )
          }
        />
        <NavItem
          tabKey="alerts"
          label="Alerts"
          onClick={() => { setActiveTab('alerts'); router.push('/notifications'); }}
          icon={<IconBell active={activeTab === 'alerts'} />}
        />
      </div>
      <div className="h-safe-area-inset-bottom" />
    </nav>
  );
};
