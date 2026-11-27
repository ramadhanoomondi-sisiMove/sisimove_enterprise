
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Journey Completion Activity Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Retrieve completion confirmations.
 * - Retrieve completion disputes.
 * - Combine their recorded lifecycle events.
 * - Sort activity chronologically.
 *
 * Architecture:
 * - API access remains in the API layer.
 * - TanStack Query manages server data and caching.
 * - Activity is derived from existing confirmation and dispute records.
 * - No separate backend activity endpoint is assumed.
 * -----------------------------------------------------------------------------
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { adminJourneyCompletionApi } from '../api';

import type {
  AdminJourneyCompletionConfirmation,
  AdminJourneyCompletionDispute,
} from '../models';

import { adminJourneyCompletionKeys } from './useAdminJourneyCompletions';

// -----------------------------------------------------------------------------
// Activity Types
// -----------------------------------------------------------------------------

export type AdminJourneyCompletionActivityType =
  | 'CONFIRMATION_CONFIRMED'
  | 'CONFIRMATION_WITHDRAWN'
  | 'DISPUTE_OPENED'
  | 'DISPUTE_RESOLVED'
  | 'DISPUTE_REJECTED'
  | 'DISPUTE_WITHDRAWN';

export interface AdminJourneyCompletionActivityItem {
  id: string;
  type: AdminJourneyCompletionActivityType;
  title: string;
  description?: string;
  status: string;
  occurredAt: string;
  relatedPublicId: string;
}

// -----------------------------------------------------------------------------
// Activity Data
// -----------------------------------------------------------------------------

interface AdminJourneyCompletionActivityData {
  confirmations: AdminJourneyCompletionConfirmation[];
  disputes: AdminJourneyCompletionDispute[];
}

// -----------------------------------------------------------------------------
// Activity Builder
// -----------------------------------------------------------------------------

export function buildAdminJourneyCompletionActivity(
  data: AdminJourneyCompletionActivityData,
): AdminJourneyCompletionActivityItem[] {
  const activity: AdminJourneyCompletionActivityItem[] = [];

  // ---------------------------------------------------------------------------
  // Confirmation Events
  // ---------------------------------------------------------------------------

  for (const confirmation of data.confirmations) {
    if (confirmation.confirmedAt) {
      activity.push({
        id: `${confirmation.publicId}-confirmed`,
        type: 'CONFIRMATION_CONFIRMED',
        title: 'Completion confirmed',
        description: `Confirmation recorded by ${confirmation.role.toLowerCase()}.`,
        status: confirmation.status,
        occurredAt: confirmation.confirmedAt,
        relatedPublicId: confirmation.publicId,
      });
    }

    if (confirmation.withdrawnAt) {
      activity.push({
        id: `${confirmation.publicId}-withdrawn`,
        type: 'CONFIRMATION_WITHDRAWN',
        title: 'Confirmation withdrawn',
        description: 'A previously recorded confirmation was withdrawn.',
        status: confirmation.status,
        occurredAt: confirmation.withdrawnAt,
        relatedPublicId: confirmation.publicId,
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Dispute Events
  // ---------------------------------------------------------------------------

  for (const dispute of data.disputes) {
    activity.push({
      id: `${dispute.publicId}-opened`,
      type: 'DISPUTE_OPENED',
      title: 'Dispute opened',
      description: dispute.description ?? dispute.reason,
      status: dispute.status,
      occurredAt: dispute.openedAt,
      relatedPublicId: dispute.publicId,
    });

    if (dispute.resolvedAt) {
      activity.push({
        id: `${dispute.publicId}-resolved`,
        type: 'DISPUTE_RESOLVED',
        title: 'Dispute resolved',
        description: dispute.resolutionSummary,
        status: dispute.status,
        occurredAt: dispute.resolvedAt,
        relatedPublicId: dispute.publicId,
      });
    }

    if (dispute.rejectedAt) {
      activity.push({
        id: `${dispute.publicId}-rejected`,
        type: 'DISPUTE_REJECTED',
        title: 'Dispute rejected',
        description: dispute.resolutionSummary,
        status: dispute.status,
        occurredAt: dispute.rejectedAt,
        relatedPublicId: dispute.publicId,
      });
    }

    if (dispute.withdrawnAt) {
      activity.push({
        id: `${dispute.publicId}-withdrawn`,
        type: 'DISPUTE_WITHDRAWN',
        title: 'Dispute withdrawn',
        description: dispute.description,
        status: dispute.status,
        occurredAt: dispute.withdrawnAt,
        relatedPublicId: dispute.publicId,
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Chronological Ordering
  // ---------------------------------------------------------------------------

  return activity.sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() -
      new Date(a.occurredAt).getTime(),
  );
}

// -----------------------------------------------------------------------------
// Query Hook
// -----------------------------------------------------------------------------

export function useAdminJourneyCompletionActivity(
  completionPublicId: string | undefined,
) {
  const publicId = completionPublicId?.trim() ?? '';

  const query = useQuery({
    queryKey: publicId
      ? adminJourneyCompletionKeys.activity(publicId)
      : [
          ...adminJourneyCompletionKeys.all,
          'activity',
          'missing-public-id',
        ],

    queryFn: async (): Promise<AdminJourneyCompletionActivityData> => {
      const [confirmations, disputes] = await Promise.all([
        adminJourneyCompletionApi.getConfirmations(publicId),
        adminJourneyCompletionApi.getDisputes(publicId),
      ]);

      return {
        confirmations,
        disputes,
      };
    },

    enabled: publicId.length > 0,
  });

  // ---------------------------------------------------------------------------
  // Stable Data References
  // ---------------------------------------------------------------------------

  const confirmations = useMemo(
    () => query.data?.confirmations ?? [],
    [query.data?.confirmations],
  );

  const disputes = useMemo(
    () => query.data?.disputes ?? [],
    [query.data?.disputes],
  );

  // ---------------------------------------------------------------------------
  // Derived Activity
  // ---------------------------------------------------------------------------

  const activity = useMemo(
    () =>
      buildAdminJourneyCompletionActivity({
        confirmations,
        disputes,
      }),
    [confirmations, disputes],
  );

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    activity,
    confirmations,
    disputes,

    query,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
