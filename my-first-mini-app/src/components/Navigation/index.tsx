'use client';

import { TabItem, Tabs } from '@worldcoin/mini-apps-ui-kit-react';
import { Bank, Home, User } from 'iconoir-react';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * This component uses the UI Kit to navigate between pages
 * Bottom navigation is the most common navigation pattern in Mini Apps
 * We require mobile first design patterns for mini apps
 * Read More: https://docs.world.org/mini-apps/design/app-guidelines#mobile-first
 */

export const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState('home');

  useEffect(() => {
    if (pathname?.includes('/profile')) setValue('profile');
    else setValue('home');
  }, [pathname]);

  const handleChange = (val: string) => {
    setValue(val);
    if (val === 'home') router.push('/(protected)/home');
    if (val === 'wallet') router.push('/(protected)/home'); // placeholder
    if (val === 'profile') router.push('/(protected)/profile');
  };

  return (
    <Tabs value={value} onValueChange={handleChange}>
      <TabItem value="home" icon={<Home />} label="Home" />
      <TabItem value="wallet" icon={<Bank />} label="Wallet" />
      <TabItem value="profile" icon={<User />} label="Profile" />
    </Tabs>
  );
};
