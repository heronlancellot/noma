'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Compass, Calendar, Plus, Bell, User, type LucideIcon } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type NavVariant = 'default' | 'fab';

interface NavItemConfig {
  readonly key: string;
  readonly href: string;
  readonly label: string;
  readonly Icon: LucideIcon;
  readonly variant: NavVariant;
}

interface NavItemProps {
  item: NavItemConfig;
  isActive: boolean;
  onClick: () => void;
  iconOverride?: ReactNode;
}

// ── Config ────────────────────────────────────────────────────────────────────

const NAV_ITEMS: readonly NavItemConfig[] = [
  { key: 'home',     href: '/',                 label: 'Home',     Icon: Compass,  variant: 'default' },
  { key: 'calendar', href: '/calendar',          label: 'Calendar', Icon: Calendar, variant: 'default' },
  { key: 'create',   href: '/create-experience', label: 'Create',   Icon: Plus,     variant: 'fab'     },
  { key: 'profile',  href: '/profile',           label: 'Profile',  Icon: User,     variant: 'default' },
  { key: 'alerts',   href: '/notifications',     label: 'Alerts',   Icon: Bell,     variant: 'default' },
];

const HIDDEN_PATHS = ['/create-experience'];

// ── Utility ───────────────────────────────────────────────────────────────────

function getActiveTab(pathname: string): string {
  if (pathname === '/') return 'home';
  if (pathname.includes('/calendar')) return 'calendar';
  if (pathname.includes('/create-experience')) return 'create';
  if (pathname.includes('/profile')) return 'profile';
  if (pathname.includes('/notifications')) return 'alerts';
  return 'home';
}

// ── NavItem ───────────────────────────────────────────────────────────────────

function NavItem({ item, isActive, onClick, iconOverride }: NavItemProps) {
  const { Icon, label, variant } = item;
  const iconClass = isActive ? 'text-noma-btn' : 'text-foreground';
  const labelClass = isActive ? 'text-noma-btn' : 'text-on-surface-variant';

  if (variant === 'fab') {
    return (
      <div className="flex flex-col items-center flex-1 -mt-6">
        <button
          type="button"
          onClick={onClick}
          aria-label={label}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg bg-noma-btn"
        >
          <Icon size={26} className="text-on-primary" strokeWidth={2.5} />
        </button>
        <span className={`text-[10px] font-semibold mt-0.5 ${labelClass}`}>{label}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex flex-col items-center justify-center gap-0.5 flex-1"
    >
      {iconOverride ?? <Icon size={22} className={iconClass} />}
      <span className={`text-[10px] font-semibold ${labelClass}`}>{label}</span>
      {isActive && <span className="w-1 h-1 rounded-full bg-tertiary-container" />}
    </button>
  );
}

// ── Navigation ────────────────────────────────────────────────────────────────

export const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const activeTab = getActiveTab(pathname);

  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-outline-variant/30 bg-surface backdrop-blur-sm shadow-[0_-2px_16px_rgba(13,31,53,0.07)]">
      <div className="flex items-center justify-around w-full px-4 pt-2 pb-2">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.key;
          const iconOverride =
            item.key === 'profile' && session?.user?.profilePictureUrl ? (
              <Image
                src={session.user.profilePictureUrl}
                alt="Profile"
                width={24}
                height={24}
                className={`w-6 h-6 rounded-full object-cover ${isActive ? 'ring-2 ring-noma-btn' : ''}`}
              />
            ) : undefined;

          return (
            <NavItem
              key={item.key}
              item={item}
              isActive={isActive}
              onClick={() => router.push(item.href)}
              iconOverride={iconOverride}
            />
          );
        })}
      </div>
      <div className="h-safe-area-inset-bottom" />
    </nav>
  );
};
