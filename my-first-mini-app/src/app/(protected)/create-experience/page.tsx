'use client';

import { NOMAD_EXPERIENCE_ADDRESS, NOMAD_EXPERIENCE_ABI } from '@/contracts/constants';
import { MiniKit } from '@worldcoin/minikit-js';
import { useWaitForTransactionReceipt } from '@worldcoin/minikit-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createPublicClient, http } from 'viem';
import { worldchain } from 'viem/chains';
import { useRouter } from 'next/navigation';

import { CreateFormData, ButtonState } from './_components/types';
import Step1Basics from './_components/Step1Basics';
import Step2Logistics from './_components/Step2Logistics';
import Step3Review from './_components/Step3Review';

export default function CreateExperiencePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [buttonState, setButtonState] = useState<ButtonState>(undefined);
  const [transactionId, setTransactionId] = useState('');

  const { register, control, trigger, watch, getValues, formState: { errors } } = useForm<CreateFormData>({
    defaultValues: {
      title: '', description: '', category: '', location: '',
      date: '', duration: '', maxGuests: '', price: '', coverImage: '',
      agreed: false,
    },
  });

  const client = createPublicClient({
    chain: worldchain,
    transport: http('https://worldchain-mainnet.g.alchemy.com/public'),
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed, isError, error } = useWaitForTransactionReceipt({
    client,
    appConfig: { app_id: process.env.NEXT_PUBLIC_WLD_CLIENT_ID as `app_${string}` },
    transactionId,
  });

  useEffect(() => {
    if (transactionId && !isConfirming) {
      if (isConfirmed) {
        setButtonState('success');
        setTimeout(() => router.push('/'), 2000);
      } else if (isError) {
        console.error('Transaction failed:', error);
        setButtonState('failed');
        setTimeout(() => { setButtonState(undefined); setTransactionId(''); }, 3000);
      }
    }
  }, [isConfirmed, isConfirming, isError, error, transactionId, router]);

  const handleNext = async () => {
    if (step === 1) {
      const valid = await trigger(['title', 'description', 'category']);
      if (valid) setStep(2);
    } else if (step === 2) {
      const valid = await trigger(['location', 'date', 'duration', 'maxGuests', 'price']);
      if (valid) setStep(3);
    }
  };

  const handlePublish = async () => {
    const valid = await trigger(['agreed']);
    if (!valid) return;

    setButtonState('pending');
    const formData = getValues();

    try {
      const startTimestamp = BigInt(Math.floor(new Date(formData.date).getTime() / 1000));
      const durationHours = parseInt(formData.duration) || 2;
      const endTimestamp = startTimestamp + BigInt(durationHours * 3600);
      const priceInWei = BigInt(Math.floor(Number(formData.price) * 10 ** 18));
      const maxParticipants = BigInt(formData.maxGuests || '10');

      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [{
          address: NOMAD_EXPERIENCE_ADDRESS,
          abi: NOMAD_EXPERIENCE_ABI,
          functionName: 'createExperience',
          args: [
            formData.title, formData.description,
            formData.coverImage || '/image-default.png',
            startTimestamp, endTimestamp, formData.location,
            priceInWei, maxParticipants,
          ],
        }],
      });

      if (finalPayload.status === 'success') {
        setTransactionId(finalPayload.transaction_id);
      } else {
        setButtonState('failed');
        setTimeout(() => setButtonState(undefined), 3000);
      }
    } catch (err) {
      console.error('Error:', err);
      setButtonState('failed');
      setTimeout(() => setButtonState(undefined), 3000);
    }
  };

  const formValues = watch();

  return (
    <div className="bg-background text-on-surface font-body-md antialiased min-h-screen flex flex-col max-w-[390px] mx-auto relative overflow-hidden">
      {step === 1 && (
        <Step1Basics
          register={register}
          control={control}
          errors={errors}
          onNext={handleNext}
          onClose={() => router.push('/')}
        />
      )}
      {step === 2 && (
        <Step2Logistics
          register={register}
          control={control}
          errors={errors}
          onNext={handleNext}
          onBack={() => setStep(1)}
          onClose={() => router.push('/')}
        />
      )}
      {step === 3 && (
        <Step3Review
          formData={formValues}
          control={control}
          errors={errors}
          onPublish={handlePublish}
          onBack={() => setStep(2)}
          buttonState={buttonState}
        />
      )}
    </div>
  );
}
