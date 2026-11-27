'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';

import {
  useAdminJourneyCompletions,
  useAdminJourneyCompletionMetrics,
  buildAdminJourneyCompletionActivity,
} from '@/features/admin/journey-completion/hooks';

import type {
  AdminJourneyCompletion,
} from '@/features/admin/journey-completion/models';

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

  const activity = useMemo(
    () =>
      allCompletions
        .flatMap((completion) =>
          buildAdminJourneyCompletionActivity({
            confirmations: completion.confirmations,
            disputes: completion.disputes,
          }),
        )
        .sort(
          (a, b) =>
            new Date(b.occurredAt).getTime() -
            new Date(a.occurredAt).getTime(),
        ),
    [allCompletions],
  );

  const handleOpenCompletion = (
    completion: AdminJourneyCompletion,
  ) => {
    router.push(
      ADMIN_ROUTES.JOURNEY_COMPLETION_DETAIL(completion.publicId),
    );
  };

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