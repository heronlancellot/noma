'use client';

import { NOMAD_EXPERIENCE_ADDRESS, NOMAD_EXPERIENCE_ABI } from '@/contracts/constants';
import { Button } from '@/components/ui/button';
import { MiniKit } from '@worldcoin/minikit-js';
import { useWaitForTransactionReceipt } from '@worldcoin/minikit-react';
import { useEffect, useState } from 'react';
import { createPublicClient, http, encodeFunctionData } from 'viem';
import { worldchain } from 'viem/chains';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export const TransactionMock = () => {
  const myContractToken = NOMAD_EXPERIENCE_ADDRESS;
  const [buttonState, setButtonState] = useState<
    'pending' | 'success' | 'failed' | undefined
  >(undefined);
  const [whichButton, setWhichButton] = useState<'getToken' | 'usePermit2'>('getToken');
  const [transactionId, setTransactionId] = useState<string>('');

  const client = createPublicClient({
    chain: worldchain,
    transport: http('https://worldchain-mainnet.g.alchemy.com/public'),
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed, isError, error } =
    useWaitForTransactionReceipt({
      client,
      appConfig: { app_id: process.env.NEXT_PUBLIC_WLD_CLIENT_ID as `app_${string}` },
      transactionId,
    });

  useEffect(() => {
    if (transactionId && !isConfirming) {
      if (isConfirmed) {
        setButtonState('success');
        setTimeout(() => setButtonState(undefined), 3000);
      } else if (isError) {
        console.error('Transaction failed:', error);
        setButtonState('failed');
        setTimeout(() => setButtonState(undefined), 3000);
      }
    }
  }, [isConfirmed, isConfirming, isError, error, transactionId]);

  const onClickGetToken = async () => {
    setTransactionId('');
    setWhichButton('getToken');
    setButtonState('pending');
    try {
      const data = encodeFunctionData({
        abi: NOMAD_EXPERIENCE_ABI,
        functionName: 'join',
        args: [],
      });
      const _txResult = await MiniKit.sendTransaction({
        chainId: 480,
        transactions: [{ to: myContractToken, data }],
      });
      const finalPayload = _txResult.data;
      if (finalPayload.status === 'success') {
        setTransactionId(finalPayload.userOpHash);
      } else {
        setButtonState('failed');
        setTimeout(() => setButtonState(undefined), 3000);
      }
    } catch (err) {
      console.error('Error sending transaction:', err);
      setButtonState('failed');
      setTimeout(() => setButtonState(undefined), 3000);
    }
  };

  const onClickUsePermit2 = async () => {
    setTransactionId('');
    setWhichButton('usePermit2');
    setButtonState('pending');
    const address = (await MiniKit.getUserByUsername('alex')).walletAddress;

    try {
      const permit2Data = encodeFunctionData({
        abi: NOMAD_EXPERIENCE_ABI,
        functionName: 'join',
        args: [],
      });
      const _txResult = await MiniKit.sendTransaction({
        chainId: 480,
        transactions: [{ to: myContractToken, data: permit2Data }],
      });
      const permit2Payload = _txResult.data;
      if (permit2Payload.status === 'success') {
        setTransactionId(permit2Payload.userOpHash);
      } else {
        setButtonState('failed');
      }
    } catch (err) {
      console.error('Error sending transaction:', err);
      setButtonState('failed');
    }
  };

  const getContent = (which: 'getToken' | 'usePermit2', label: string) => {
    if (whichButton !== which || !buttonState) return label;
    if (buttonState === 'pending') return <><Loader2 className="animate-spin" size={18} />Pending...</>;
    if (buttonState === 'success') return <><CheckCircle size={18} />Success</>;
    if (buttonState === 'failed') return <><XCircle size={18} />Failed</>;
    return label;
  };

  return (
    <div className="grid w-full gap-4">
      <p className="font-h3 text-on-surface">Transaction</p>
      <Button
        onClick={onClickGetToken}
        disabled={buttonState === 'pending'}
        size="lg"
        variant="primary"
        className="w-full"
      >
        {getContent('getToken', 'Get Token')}
      </Button>
      <Button
        onClick={onClickUsePermit2}
        disabled={buttonState === 'pending'}
        size="lg"
        variant="outline"
        className="w-full"
      >
        {getContent('usePermit2', 'Use Permit2')}
      </Button>
    </div>
  );
};
