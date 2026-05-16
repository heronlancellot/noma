'use client';
import { walletAuth } from '@/auth/wallet';
import { Button } from '@/components/ui/button';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export const AuthButton = () => {
  const [isPending, setIsPending] = useState(false);
  const { isInstalled } = useMiniKit();

  const onClick = useCallback(async () => {
    if (!isInstalled || isPending) return;
    setIsPending(true);
    try {
      await walletAuth();
    } catch (error) {
      console.error('Wallet authentication button error', error);
    } finally {
      setIsPending(false);
    }
  }, [isInstalled, isPending]);

  useEffect(() => {
    const authenticate = async () => {
      if (isInstalled && !isPending) {
        setIsPending(true);
        try {
          await walletAuth();
        } catch (error) {
          console.error('Auto wallet authentication error', error);
        } finally {
          setIsPending(false);
        }
      }
    };
    authenticate();
  }, [isInstalled, isPending]);

  return (
    <Button
      onClick={onClick}
      disabled={isPending}
      size="xl"
      variant="primary"
      className="w-full"
    >
      {isPending ? (
        <>
          <Loader2 className="animate-spin" size={18} />
          Logging in...
        </>
      ) : (
        'Login with Wallet'
      )}
    </Button>
  );
};
