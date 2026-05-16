// src/features/experience-detail/components/ExperienceManagePage.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { encodeFunctionData } from 'viem';
import { MiniKit } from '@worldcoin/minikit-js';
import { useWaitForTransactionReceipt } from '@worldcoin/minikit-react';
import Image from 'next/image';
import { MapPin, QrCode, Check, X } from 'lucide-react';
import { Page } from '@/components/PageLayout';
import { TopBar } from '@worldcoin/mini-apps-ui-kit-react';
import { Navigation } from '@/components/Navigation';
import { publicClient, getJoinRequests, getParticipants } from '@/lib/contractUtils';
import { NOMAD_EXPERIENCE_ADDRESS, NOMAD_EXPERIENCE_ABI } from '@/contracts/constants';
import { useExperienceDetail } from '@/features/experience-detail/hooks';
import type { JoinRequest } from '@/features/experience-detail/types';

export function ExperienceManagePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const experienceId = params.id as string;

  const { experience, loading, error } = useExperienceDetail(experienceId);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [processingAddress, setProcessingAddress] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [fetchCount, setFetchCount] = useState(0);

  const isCreator = !!(
    experience &&
    session?.user &&
    ((session.user.walletAddress || session.user.id)?.toLowerCase() ===
      experience.creator.toLowerCase())
  );

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
    if (!experience || !isCreator) return;
    const id = parseInt(experienceId, 10);
    if (isNaN(id)) return;
    setRequestsLoading(true);
    Promise.all([getJoinRequests(id), getParticipants(id)])
      .then(([requests, participants]) => {
        setJoinRequests(
          requests.map((addr) => ({
            address: addr,
            status: (participants.includes(addr) ? 'approved' : 'pending') as JoinRequest['status'],
          }))
        );
      })
      .catch(() => { /* ignore */ })
      .finally(() => setRequestsLoading(false));
  }, [experience, isCreator, experienceId, fetchCount]);

  useEffect(() => {
    if (!transactionId || isConfirming) return;
    if (isConfirmed) {
      setProcessingAddress(null);
      setTransactionId('');
      setFetchCount((c) => c + 1);
    } else if (isError) {
      console.error('Transaction failed:', transactionError);
      setProcessingAddress(null);
      setTransactionId('');
    }
  }, [isConfirmed, isConfirming, isError, transactionError, transactionId]);

  const handleApprove = async (userAddress: string) => {
    try {
      setProcessingAddress(userAddress);
      setTransactionId('');
      const data = encodeFunctionData({
        abi: NOMAD_EXPERIENCE_ABI,
        functionName: 'approveJoin',
        args: [Number(experienceId), userAddress as `0x${string}`],
      });
      const txResult = await MiniKit.sendTransaction({
        chainId: 480,
        transactions: [{ to: NOMAD_EXPERIENCE_ADDRESS, data }],
      });
      const finalPayload = txResult.data;
      if (finalPayload.status === 'success') {
        setTransactionId(finalPayload.userOpHash);
      } else {
        setProcessingAddress(null);
      }
    } catch {
      setProcessingAddress(null);
    }
  };

  const handleReject = async (userAddress: string) => {
    try {
      setProcessingAddress(userAddress);
      setTransactionId('');
      const data = encodeFunctionData({
        abi: NOMAD_EXPERIENCE_ABI,
        functionName: 'rejectJoin',
        args: [Number(experienceId), userAddress as `0x${string}`],
      });
      const txResult = await MiniKit.sendTransaction({
        chainId: 480,
        transactions: [{ to: NOMAD_EXPERIENCE_ADDRESS, data }],
      });
      const rejectPayload = txResult.data;
      if (rejectPayload.status === 'success') {
        setTransactionId(rejectPayload.userOpHash);
      } else {
        setProcessingAddress(null);
      }
    } catch {
      setProcessingAddress(null);
    }
  };

  if (loading) {
    return (
      <Page>
        <Page.Main className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
            <p className="font-body-sm text-on-surface-variant">Loading...</p>
          </div>
        </Page.Main>
      </Page>
    );
  }

  if (error || !experience) {
    return (
      <Page>
        <Page.Header className="p-0">
          <TopBar title="Manage Experience" />
        </Page.Header>
        <Page.Main className="flex items-center justify-center">
          <div className="text-center">
            <p className="font-body-sm text-on-surface-variant font-semibold mb-2">Error</p>
            <p className="font-body-sm text-on-surface-variant">{error || 'Unable to load data'}</p>
          </div>
        </Page.Main>
      </Page>
    );
  }

  if (!isCreator) {
    return (
      <Page>
        <Page.Header className="p-0">
          <TopBar title="Manage Experience" />
        </Page.Header>
        <Page.Main className="flex items-center justify-center">
          <p className="font-body-sm text-on-surface-variant">You are not the creator of this experience</p>
        </Page.Main>
      </Page>
    );
  }

  const pendingRequests = joinRequests.filter((r) => r.status === 'pending');
  const approvedRequests = joinRequests.filter((r) => r.status === 'approved');

  return (
    <Page className="bg-surface">
      <Page.Header className="p-0">
        <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-outline-variant">
          <h1 className="font-h3 text-on-surface">Schedule</h1>
          <button
            onClick={() => router.push(`/experience/${experienceId}`)}
            className="p-2 hover:bg-surface-container rounded-lg transition-colors"
            aria-label="View QR Code"
          >
            <QrCode size={24} className="text-on-surface" strokeWidth={2} />
          </button>
        </div>
      </Page.Header>

      <Page.Main className="pb-28 bg-surface-container">
        {requestsLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        )}

        {!requestsLoading && pendingRequests.length > 0 && (
          <div className="px-4 py-6">
            <h2 className="font-h3 text-on-surface mb-4">Next Experiences</h2>
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.address} className="bg-surface rounded-2xl shadow-sm overflow-hidden">
                  <div className="relative w-full h-48">
                    <Image src={experience.images[0]} alt={experience.title} fill className="object-cover" />
                    <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1">
                      <span className="text-tertiary-fixed-dim text-sm">★</span>
                      <span className="text-on-surface text-sm font-semibold">{experience.rating}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-h3 text-on-surface mb-2">{experience.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-surface-container-highest" />
                      <span className="font-body-sm text-on-surface-variant">
                        Requested by {request.address.slice(0, 6)}...{request.address.slice(-4)}
                      </span>
                    </div>
                    <p className="font-body-sm text-on-surface-variant mb-4 line-clamp-2">{experience.description}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin size={16} className="text-on-surface" strokeWidth={2} />
                      <span className="font-body-sm text-on-surface">{experience.location}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(request.address)}
                        disabled={processingAddress === request.address}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-outline disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg font-body-sm font-semibold transition-colors"
                      >
                        {processingAddress === request.address ? (
                          <span>Processing...</span>
                        ) : (
                          <>
                            <Check size={20} strokeWidth={2.5} />
                            <span>Approve</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(request.address)}
                        disabled={processingAddress === request.address}
                        className="flex-1 flex items-center justify-center gap-2 bg-error hover:bg-error/90 active:bg-error/80 disabled:bg-outline disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg font-body-sm font-semibold transition-colors"
                      >
                        {processingAddress === request.address ? (
                          <span>Processing...</span>
                        ) : (
                          <>
                            <X size={20} strokeWidth={2.5} />
                            <span>Reject</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!requestsLoading && approvedRequests.length > 0 && (
          <div className="px-4 py-6">
            <h2 className="font-h3 text-on-surface mb-4">Approved Participants</h2>
            <div className="space-y-4">
              {approvedRequests.map((request) => (
                <div key={request.address} className="bg-surface rounded-2xl shadow-sm overflow-hidden">
                  <div className="relative w-full h-48">
                    <Image src={experience.images[0]} alt={experience.title} fill className="object-cover" />
                    <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1">
                      <span className="text-tertiary-fixed-dim text-sm">★</span>
                      <span className="text-on-surface text-sm font-semibold">{experience.rating}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-h3 text-on-surface mb-2">{experience.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-surface-container-highest" />
                      <span className="font-body-sm text-on-surface-variant">
                        Approved: {request.address.slice(0, 6)}...{request.address.slice(-4)}
                      </span>
                    </div>
                    <p className="font-body-sm text-on-surface-variant mb-4 line-clamp-2">{experience.description}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin size={16} className="text-on-surface" strokeWidth={2} />
                      <span className="font-body-sm text-on-surface">{experience.location}</span>
                    </div>
                    <button
                      disabled
                      className="w-full bg-secondary text-on-secondary px-4 py-2.5 rounded-lg font-body-sm font-semibold cursor-not-allowed"
                    >
                      Approved
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!requestsLoading && pendingRequests.length === 0 && approvedRequests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <p className="font-body-md text-on-surface-variant text-center">No join requests yet</p>
          </div>
        )}
      </Page.Main>

      <Navigation />
    </Page>
  );
}
