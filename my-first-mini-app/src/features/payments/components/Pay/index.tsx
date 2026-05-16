'use client';
import { Button } from '@/components/ui/button';
import { MiniKit } from '@worldcoin/minikit-js';
import { Tokens, tokenToDecimals } from '@worldcoin/minikit-js/commands';
import { useState } from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export const Pay = () => {
  const [buttonState, setButtonState] = useState<
    'pending' | 'success' | 'failed' | undefined
  >(undefined);

  const onClickPay = async () => {
    const address = (await MiniKit.getUserByUsername('alex')).walletAddress;
    setButtonState('pending');

    const res = await fetch('/api/initiate-payment', { method: 'POST' });
    const { id } = await res.json();

    const result = await MiniKit.pay({
      reference: id,
      to: address ?? '0x0000000000000000000000000000000000000000',
      tokens: [
        { symbol: Tokens.WLD, token_amount: tokenToDecimals(0.5, Tokens.WLD).toString() },
        { symbol: Tokens.USDC, token_amount: tokenToDecimals(0.1, Tokens.USDC).toString() },
      ],
      description: 'Test example payment for minikit',
    });

    if (result.data?.transactionId) {
      setButtonState('success');
    } else {
      setButtonState('failed');
      setTimeout(() => setButtonState(undefined), 3000);
    }
  };

  return (
    <div className="grid w-full gap-4">
      <p className="font-h3 text-on-surface">Pay</p>
      <Button
        onClick={onClickPay}
        disabled={buttonState === 'pending'}
        size="lg"
        variant="primary"
        className="w-full"
      >
        {buttonState === 'pending' ? <><Loader2 className="animate-spin" size={18} />Payment pending...</> :
         buttonState === 'success' ? <><CheckCircle size={18} />Payment successful</> :
         buttonState === 'failed' ? <><XCircle size={18} />Payment failed</> :
         'Pay'}
      </Button>
    </div>
  );
};
