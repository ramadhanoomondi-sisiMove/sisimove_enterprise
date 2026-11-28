
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Journey Completion Activity Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Retrieve completion confirmations.
 * - Retrieve completion disputes.
 * - Combine their recorded lifecycle events.
 * - Support completion lifecycle events from the directory overview.
 * - Sort activity chronologically.
 *
 * Architecture:
 * - API access remains in the API layer.
 * - TanStack Query manages server data and caching.
 * - Activity is derived from existing records.
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
  // Completion lifecycle events
  | 'COMPLETION_CREATED'
  | 'COMPLETION_REQUESTED'
  | 'COMPLETION_CONFIRMED'
  | 'COMPLETION_DISPUTED'
  | 'COMPLETION_CANCELLED'

  // Confirmation events
  | 'CONFIRMATION_CONFIRMED'
  | 'CONFIRMATION_WITHDRAWN'

  // Dispute events
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

  const confirmations = Array.isArray(data?.confirmations)
    ? data.confirmations
    : [];

  const disputes = Array.isArray(data?.disputes)
    ? data.disputes
    : [];

  // ---------------------------------------------------------------------------
  // Confirmation Events
  // ---------------------------------------------------------------------------

  for (const confirmation of confirmations) {
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

  for (const dispute of disputes) {
    if (dispute.openedAt) {
      activity.push({
        id: `${dispute.publicId}-opened`,
        type: 'DISPUTE_OPENED',
        title: 'Dispute opened',
        description: dispute.description ?? dispute.reason,
        status: dispute.status,
        occurredAt: dispute.openedAt,
        relatedPublicId: dispute.publicId,
      });
    }

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
      const [confirmationsResponse, disputesResponse] =
        await Promise.all([
          adminJourneyCompletionApi.getConfirmations(publicId),
          adminJourneyCompletionApi.getDisputes(publicId),
        ]);

      return {
        confirmations: Array.isArray(confirmationsResponse)
          ? confirmationsResponse
          : [],

        disputes: Array.isArray(disputesResponse)
          ? disputesResponse
          : [],
      };
    },

    enabled: publicId.length > 0,
  });

// -----------------------------------------------------------------------------
// Confirmation and Dispute Data
// -----------------------------------------------------------------------------

const confirmations = useMemo(
  () =>
    Array.isArray(query.data?.confirmations)
      ? query.data.confirmations
      : [],
  [query.data],
);

const disputes = useMemo(
  () =>
    Array.isArray(query.data?.disputes)
      ? query.data.disputes
      : [],
  [query.data],
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
