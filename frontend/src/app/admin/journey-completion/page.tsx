
'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';

import {
  useAdminJourneyCompletions,
  useAdminJourneyCompletionMetrics,
} from '@/features/admin/journey-completion/hooks';

import type {
  AdminJourneyCompletion,
} from '@/features/admin/journey-completion/models';

import type {
  AdminJourneyCompletionActivityItem,
} from '@/features/admin/journey-completion/hooks';

import {
  JourneyCompletionPageContainer,
  JourneyCompletionControlCenterHeader,
  JourneyCompletionOverview,
  JourneyCompletionDirectory,
} from '@/components/admin/journey-completion';

export default function JourneyCompletionPage() {
  const router = useRouter();

  const {
    allCompletions,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminJourneyCompletions();

  const { metrics } =
    useAdminJourneyCompletionMetrics(allCompletions);

  // ---------------------------------------------------------------------------
  // Overview Activity
  // Derive only events supported by the completion list records.
  // Detailed confirmation and dispute events are loaded on the detail page.
  // ---------------------------------------------------------------------------

  const activity = useMemo<AdminJourneyCompletionActivityItem[]>(
    () => {
      const items: AdminJourneyCompletionActivityItem[] = [];

      for (const completion of allCompletions) {
        items.push({
          id: `${completion.publicId}-created`,
          type: 'COMPLETION_CREATED' as AdminJourneyCompletionActivityItem['type'],
          title: 'Completion record created',
          description: `Completion record created for journey ${completion.journeyPublicId}.`,
          status: completion.status,
          occurredAt: completion.createdAt,
          relatedPublicId: completion.publicId,
        });

        if (completion.completionRequestedAt) {
          items.push({
            id: `${completion.publicId}-requested`,
            type: 'COMPLETION_REQUESTED' as AdminJourneyCompletionActivityItem['type'],
            title: 'Completion requested',
            description: 'The journey completion process was requested.',
            status: completion.status,
            occurredAt: completion.completionRequestedAt,
            relatedPublicId: completion.publicId,
          });
        }

        if (completion.confirmedAt) {
          items.push({
            id: `${completion.publicId}-confirmed`,
            type: 'COMPLETION_CONFIRMED' as AdminJourneyCompletionActivityItem['type'],
            title: 'Completion confirmed',
            description: 'The journey completion was confirmed.',
            status: completion.status,
            occurredAt: completion.confirmedAt,
            relatedPublicId: completion.publicId,
          });
        }

        if (completion.disputedAt) {
          items.push({
            id: `${completion.publicId}-disputed`,
            type: 'COMPLETION_DISPUTED' as AdminJourneyCompletionActivityItem['type'],
            title: 'Completion disputed',
            description: 'A dispute was recorded against this completion.',
            status: completion.status,
            occurredAt: completion.disputedAt,
            relatedPublicId: completion.publicId,
          });
        }

        if (completion.cancelledAt) {
          items.push({
            id: `${completion.publicId}-cancelled`,
            type: 'COMPLETION_CANCELLED' as AdminJourneyCompletionActivityItem['type'],
            title: 'Completion cancelled',
            description: 'The journey completion was cancelled.',
            status: completion.status,
            occurredAt: completion.cancelledAt,
            relatedPublicId: completion.publicId,
          });
        }
      }

      return items.sort(
        (a, b) =>
          new Date(b.occurredAt).getTime() -
          new Date(a.occurredAt).getTime(),
      );
    },
    [allCompletions],
  );

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  const handleOpenCompletion = (
    completion: AdminJourneyCompletion,
  ) => {
    router.push(
      ADMIN_ROUTES.JOURNEY_COMPLETION_DETAIL(completion.publicId),
    );
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <JourneyCompletionPageContainer>
      <div className="space-y-6">
        <JourneyCompletionControlCenterHeader />

        {isError ? (
          <div
            role="alert"
            className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger-soft)] p-4"
          >
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Unable to load journey completion overview
            </h2>

            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              {error instanceof Error
                ? error.message
                : 'Something went wrong while retrieving journey completion records.'}
            </p>

            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isLoading}
              className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--background-subtle)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Try again
            </button>
          </div>
        ) : (
          <JourneyCompletionOverview
            metrics={metrics}
            activity={activity}
          />
        )}

        <JourneyCompletionDirectory
          onOpenCompletion={handleOpenCompletion}
        />
      </div>
    </JourneyCompletionPageContainer>
  );
}
