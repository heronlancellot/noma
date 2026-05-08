'use client';

import { NOMAD_EXPERIENCE_ADDRESS, NOMAD_EXPERIENCE_ABI } from '@/contracts/constants';
import { MiniKit } from '@worldcoin/minikit-js';
import { useWaitForTransactionReceipt } from '@worldcoin/minikit-react';
import { useEffect, useState } from 'react';
import { createPublicClient, http } from 'viem';
import { worldchain } from 'viem/chains';
import { useRouter } from 'next/navigation';

import { CreateFormData, ButtonState, FormErrors, InputChange } from './_components/types';
import Step1Basics from './_components/Step1Basics';
import Step2Logistics from './_components/Step2Logistics';
import Step3Review from './_components/Step3Review';

export default function CreateExperiencePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [buttonState, setButtonState] = useState<ButtonState>(undefined);
  const [transactionId, setTransactionId] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState<CreateFormData>({
    title: '', description: '', category: '', location: '',
    date: '', duration: '', maxGuests: '', price: '', coverImage: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

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

  const handleChange = (e: InputChange) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof CreateFormData]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleDateChange = (value: string) => {
    setFormData(prev => ({ ...prev, date: value }));
    if (errors.date) setErrors(prev => ({ ...prev, date: undefined }));
  };

  const validateStep1 = () => {
    const e: FormErrors = {};
    if (!formData.title.trim()) e.title = 'Required';
    if (!formData.description.trim()) e.description = 'Required';
    if (!formData.category) e.category = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const validateStep2 = () => {
    const e: FormErrors = {};
    if (!formData.location.trim()) e.location = 'Required';
    if (!formData.date) e.date = 'Required';
    if (!formData.duration) e.duration = 'Required';
    if (!formData.maxGuests || Number(formData.maxGuests) <= 0) e.maxGuests = 'Required';
    if (!formData.price) e.price = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handlePublish = async () => {
    if (!agreed) return;
    setButtonState('pending');
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

  return (
    <div className="bg-background text-on-surface font-body-md antialiased min-h-screen flex flex-col max-w-[390px] mx-auto relative overflow-hidden">
      {step === 1 && (
        <Step1Basics
          formData={formData}
          errors={errors}
          onChange={handleChange}
          onNext={handleNext}
          onClose={() => router.push('/')}
        />
      )}
      {step === 2 && (
        <Step2Logistics
          formData={formData}
          errors={errors}
          onChange={handleChange}
          onDateChange={handleDateChange}
          onNext={handleNext}
          onBack={() => setStep(1)}
          onClose={() => router.push('/')}
        />
      )}
      {step === 3 && (
        <Step3Review
          formData={formData}
          agreed={agreed}
          onAgreedChange={setAgreed}
          onPublish={handlePublish}
          onBack={() => setStep(2)}
          buttonState={buttonState}
          onChange={handleChange}
        />
      )}
    </div>
  );
}
