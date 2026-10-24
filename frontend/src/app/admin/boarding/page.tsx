
'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import {
  BoardingControlCenterHeader,
  BoardingPageContainer,
} from '@/components/admin/boardings/layout';

import { BoardingOverviewDashboard } from '@/components/admin/boardings/overview/BoardingOverviewDashboard';
import { BoardingDirectory } from '@/components/admin/boardings/directory/BoardingDirectory';

import {
  useAdminBoardings,
  type AdminBoarding,
  type AdminBoardingMetrics,
  AdminBoardingStatus,
  AdminBoardingParticipantStatus,
} from '@/features/admin/boardings';

export default function AdminBoardingsPage() {
  const router = useRouter();
  const boardingsQuery = useAdminBoardings();

const boardings = useMemo(
  () => boardingsQuery.data ?? [],
  [boardingsQuery.data],
);
  const metrics = useMemo<AdminBoardingMetrics>(() => {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const isToday = (value?: string | null) => {
      if (!value) return false;

      const date = new Date(value);
      const timestamp = date.getTime();

      return (
        !Number.isNaN(timestamp) &&
        timestamp >= todayStart.getTime() &&
        timestamp < tomorrowStart.getTime()
      );
    };

    const statusCounts: AdminBoardingMetrics['statusCounts'] = {
      [AdminBoardingStatus.NOT_STARTED]: 0,
      [AdminBoardingStatus.BOARDING]: 0,
      [AdminBoardingStatus.STARTED]: 0,
      [AdminBoardingStatus.CANCELLED]: 0,
    };

    const participantStatusCounts: AdminBoardingMetrics['participantStatusCounts'] =
      {
        [AdminBoardingParticipantStatus.EXPECTED]: 0,
        [AdminBoardingParticipantStatus.BOARDED]: 0,
        [AdminBoardingParticipantStatus.WITHDRAWN]: 0,
        [AdminBoardingParticipantStatus.NO_SHOW]: 0,
        [AdminBoardingParticipantStatus.REMOVED]: 0,
      };

    let totalParticipants = 0;
    let totalEvents = 0;

    for (const boarding of boardings) {
      statusCounts[boarding.status] += 1;

      totalParticipants += boarding.participants.length;
      totalEvents += boarding.events.length;

      for (const participant of boarding.participants) {
        participantStatusCounts[participant.status] += 1;
      }
    }

    return {
      totalBoardings: boardings.length,
      totalParticipants,
      totalEvents,
      boardingsCreatedToday: boardings.filter(
        (boarding) => isToday(boarding.createdAt),
      ).length,
      boardingsStartedToday: boardings.filter(
        (boarding) => isToday(boarding.journeyStartedAt),
      ).length,
      boardingsCancelledToday: boardings.filter(
        (boarding) => isToday(boarding.cancelledAt),
      ).length,
      statusCounts,
      participantStatusCounts,
      lastUpdatedAt: boardingsQuery.dataUpdatedAt
        ? new Date(boardingsQuery.dataUpdatedAt).toISOString()
        : null,
    };
  }, [boardings, boardingsQuery.dataUpdatedAt]);

const handleViewBoarding = useCallback(
  (boarding: AdminBoarding) => {
    router.push(
      `/admin/boarding/${encodeURIComponent(boarding.publicId)}`,
    );
  },
  [router],
);

  return (
    <BoardingPageContainer>
      <BoardingControlCenterHeader
        title="Boarding Control Center"
        description="Monitor boarding activity, review participant status, and inspect individual journey boardings."
      />

      <BoardingOverviewDashboard metrics={metrics} />

      <BoardingDirectory onViewBoarding={handleViewBoarding} />
    </BoardingPageContainer>
  );
}
