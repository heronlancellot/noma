'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { encodeFunctionData } from 'viem';
import { MiniKit } from '@worldcoin/minikit-js';
import { useWaitForTransactionReceipt } from '@worldcoin/minikit-react';
import { publicClient } from '@/lib/contractUtils';
import { NOMAD_EXPERIENCE_ADDRESS, NOMAD_EXPERIENCE_ABI } from '@/contracts/constants';

export function useJoinExperience(experienceId: string) {
  const router = useRouter();
  const [joinLoading, setJoinLoading] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError,
    error: transactionError,
  } = useWaitForTransactionReceipt({
    client: publicClient,
    appConfig: { app_id: process.env.NEXT_PUBLIC_WLD_CLIENT_ID as `app_${string}` },
    transactionId,
  });

  useEffect(() => {
    if (!transactionId || isConfirming) return;
    if (isConfirmed) {
      setJoinLoading(false);
      router.push(`/experience/${experienceId}/confirmation`);
    } else if (isError) {
      console.error('Transaction failed:', transactionError);
      setJoinLoading(false);
      setTransactionId('');
    }
  }, [isConfirmed, isConfirming, isError, transactionError, transactionId, router, experienceId]);

  const handleRequestJoin = async (price: string) => {
    try {
      setJoinLoading(true);
      setTransactionId('');
      const priceInUSD = parseFloat(price.replace('$', ''));
      const priceInWei = BigInt(Math.floor(priceInUSD * 1e18));
      const priceInHex = '0x' + priceInWei.toString(16);
      const data = encodeFunctionData({
        abi: NOMAD_EXPERIENCE_ABI,
        functionName: 'requestJoin',
        args: [Number(experienceId)],
      });
      const txResult = await MiniKit.sendTransaction({
        chainId: 480,
        transactions: [{ to: NOMAD_EXPERIENCE_ADDRESS, data, value: priceInHex }],
      });
      const finalPayload = txResult.data;
      if (finalPayload.status === 'success') {
        setTransactionId(finalPayload.userOpHash);
      } else {
        setJoinLoading(false);
      }
    } catch {
      setJoinLoading(false);
    }
  };

  return { joinLoading, isConfirming, handleRequestJoin };
}
