'use client';
import { Button } from '@/components/ui/button';
import { MiniKit } from '@worldcoin/minikit-js';
import { useState } from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

enum VerificationLevel {
  Device = 'device',
  Orb = 'orb',
}

interface MiniKitWithVerify {
  verify(options: {
    action: string;
    verification_level: VerificationLevel;
  }): Promise<{ finalPayload: { status: string; error_code?: string } }>;
}
const MiniKitVerify = MiniKit as unknown as MiniKitWithVerify;

export const Verify = () => {
  const [buttonState, setButtonState] = useState<
    'pending' | 'success' | 'failed' | undefined
  >(undefined);
  const [whichVerification, setWhichVerification] = useState<VerificationLevel>(
    VerificationLevel.Device,
  );

  const onClickVerify = async (verificationLevel: VerificationLevel) => {
    setButtonState('pending');
    setWhichVerification(verificationLevel);
    const result = await MiniKitVerify.verify({
      action: 'test-action',
      verification_level: verificationLevel,
    });
    const response = await fetch('/api/verify-proof', {
      method: 'POST',
      body: JSON.stringify({
        payload: result.finalPayload,
        action: 'test-action',
      }),
    });

    const data = await response.json();
    if (data.verifyRes.success) {
      setButtonState('success');
    } else {
      setButtonState('failed');
      setTimeout(() => setButtonState(undefined), 2000);
    }
  };

  const getButtonContent = (level: VerificationLevel, label: string) => {
    if (whichVerification !== level || !buttonState) return label;
    if (buttonState === 'pending') return <><Loader2 className="animate-spin" size={18} />Verifying...</>;
    if (buttonState === 'success') return <><CheckCircle size={18} />Verified</>;
    if (buttonState === 'failed') return <><XCircle size={18} />Failed</>;
    return label;
  };

  return (
    <div className="grid w-full gap-4">
      <p className="font-h3 text-on-surface">Verify</p>
      <Button
        onClick={() => onClickVerify(VerificationLevel.Device)}
        disabled={buttonState === 'pending'}
        size="lg"
        variant="outline"
        className="w-full"
      >
        {getButtonContent(VerificationLevel.Device, 'Verify (Device)')}
      </Button>
      <Button
        onClick={() => onClickVerify(VerificationLevel.Orb)}
        disabled={buttonState === 'pending'}
        size="lg"
        variant="primary"
        className="w-full"
      >
        {getButtonContent(VerificationLevel.Orb, 'Verify (Orb)')}
      </Button>
    </div>
  );
};
