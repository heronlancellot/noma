'use client';

import { MiniKit } from '@worldcoin/minikit-js';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { useEffect, useState } from 'react';

export const ViewPermissions = () => {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const { isInstalled } = useMiniKit();

  useEffect(() => {
    const fetchPermissions = async () => {
      if (isInstalled) {
        try {
          const permissions = await MiniKit.getPermissions();
          if (permissions?.data?.status === 'success') {
            setPermissions((permissions?.data as { permissions?: Record<string, boolean> })?.permissions || {});
          }
        } catch (error) {
          console.error('Failed to fetch permissions:', error);
        }
      }
    };
    fetchPermissions();
  }, [isInstalled]);

  return (
    <div className="grid w-full gap-4">
      <p className="font-h3 text-on-surface">Permissions</p>
      {permissions &&
        Object.entries(permissions).map(([permission, value]) => (
          <div
            key={permission}
            className="flex items-center justify-between rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm"
          >
            <div>
              <p className="font-body-md font-semibold text-on-surface">{permission}</p>
              <p className="font-body-sm text-secondary">Enabled: {String(value)}</p>
            </div>
          </div>
        ))}
    </div>
  );
};
