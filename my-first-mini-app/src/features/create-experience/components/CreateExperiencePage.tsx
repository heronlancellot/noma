'use client';

import { NOMAD_EXPERIENCE_ADDRESS, NOMAD_EXPERIENCE_ABI } from '@/contracts/constants';
import { MiniKit } from '@worldcoin/minikit-js';
import { useWaitForTransactionReceipt } from '@worldcoin/minikit-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createPublicClient, http, encodeFunctionData } from 'viem';
import { worldchain } from 'viem/chains';
import { useRouter } from 'next/navigation';

import { CreateFormData, ButtonState } from '@/features/create-experience/types';
import CreateExperienceStep1 from '@/features/create-experience/components/CreateExperienceStep1';
import CreateExperienceStep2 from '@/features/create-experience/components/CreateExperienceStep2';
import Step3Review from '@/features/create-experience/components/Step3Review';
import PublishConfirmation from '@/features/create-experience/components/PublishConfirmation';

export function CreateExperiencePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [buttonState, setButtonState] = useState<ButtonState>(undefined);
  const [transactionId, setTransactionId] = useState('');

  const { register, control, trigger, watch, getValues, setValue, setError, formState: { errors } } = useForm<CreateFormData>({
    defaultValues: {
      title: '', description: '', category: '', location: '',
      date: '', duration: '', maxGuests: '', price: '', coverImage: '',
      agreed: false,
    },
  });

  const client = useMemo(() => createPublicClient({
    chain: worldchain,
    transport: http('https://worldchain-mainnet.g.alchemy.com/public'),
  }), []);

  const { isLoading: isConfirming, isSuccess: isConfirmed, isError, error } = useWaitForTransactionReceipt({
    client,
    appConfig: { app_id: process.env.NEXT_PUBLIC_WLD_CLIENT_ID as `app_${string}` },
    transactionId,
  });

  useEffect(() => {
    if (transactionId && !isConfirming) {
      if (isConfirmed) {
        setButtonState('success');
        setStep(4);
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

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('coverImage', { message: 'Image must be under 5MB' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setValue('coverImage', reader.result as string);
    reader.readAsDataURL(file);
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

      const data = encodeFunctionData({
        abi: NOMAD_EXPERIENCE_ABI,
        functionName: 'createExperience',
        args: [
          formData.title, formData.description,
          formData.coverImage || '/image-default.png',
          startTimestamp, endTimestamp, formData.location,
          priceInWei, maxParticipants,
        ],
      });

      const _txResult = await MiniKit.sendTransaction({
        chainId: 480,
        transactions: [{ to: NOMAD_EXPERIENCE_ADDRESS, data }],
      });
      const finalPayload = _txResult.data;

      if (finalPayload.status === 'success') {
        setTransactionId(finalPayload.userOpHash);
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

  const [title, coverImage, location, duration, maxGuests, price, category, date, description] = watch([
    'title', 'coverImage', 'location', 'duration', 'maxGuests', 'price', 'category', 'date', 'description',
  ]);
  const formValues: CreateFormData = {
    title, coverImage, location, duration, maxGuests, price, category, date, description,
    agreed: false,
  };

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased flex flex-col max-w-[390px] mx-auto relative overflow-hidden">
      {step === 1 && (
        <CreateExperienceStep1
          register={register}
          control={control}
          errors={errors}
          onNext={handleNext}
          onClose={() => router.push('/')}
        />
      )}
      {step === 2 && (
        <CreateExperienceStep2
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
          onCoverUpload={handleCoverUpload}
          buttonState={buttonState}
        />
      )}
      {step === 4 && (
        <PublishConfirmation formData={formValues} />
      )}
    </div>
  );
}
