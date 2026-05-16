'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { Marble } from '@worldcoin/mini-apps-ui-kit-react';
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
      <div className="flex flex-col items-center gap-0.5 flex-1">
        <button
          type="button"
          onClick={onClick}
          aria-label={label}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg -mt-5 bg-noma-btn"
        >
          <Icon size={26} className="text-white" strokeWidth={2.5} />
        </button>
        <span className={`text-xs font-semibold ${labelClass}`}>{label}</span>
        {isActive && <span className="w-1 h-1 rounded-full bg-brand-gold" />}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors"
    >
      {iconOverride ?? <Icon size={22} className={iconClass} />}
      <span className={`text-xs font-semibold ${labelClass}`}>{label}</span>
      {isActive && <span className="w-1 h-1 rounded-full bg-brand-gold" />}
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-outline-variant/30 bg-surface-container-lowest/95 backdrop-blur-sm shadow-[0_-2px_16px_rgba(13,31,53,0.07)]">
      <div className="flex items-end justify-around px-2 pt-2 pb-3 max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.key;
          const iconOverride =
            item.key === 'profile' && session?.user?.profilePictureUrl ? (
              <Marble
                src={session.user.profilePictureUrl}
                className={`w-6 h-6 rounded-full ${isActive ? 'ring-2 ring-noma-btn' : ''}`}
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
