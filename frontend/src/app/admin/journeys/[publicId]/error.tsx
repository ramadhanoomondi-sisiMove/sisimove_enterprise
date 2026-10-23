
'use client';

/**
 * sisiMove — Admin Journey Detail Error
 *
 * Next.js App Router error boundary for an individual journey.
 */

import { useEffect } from 'react';

import { JourneyErrorState } from '@/components/admin/journeys/shared';

interface AdminJourneyDetailErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function AdminJourneyDetailError({
  error,
  reset,
}: AdminJourneyDetailErrorProps) {
  useEffect(() => {
    console.error('[AdminJourneyDetailError]', error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[var(--background-subtle)] px-4 py-12 sm:px-6">
      <div className="w-full max-w-xl rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
        <JourneyErrorState
          title="Unable to load journey details"
          description="The journey workspace encountered an unexpected error. Retry the request to continue. If the problem persists, contact your system administrator."
          retryAction={{
            label: 'Try again',
            onClick: reset,
          }}
        />
      </div>
    </main>
  );
}
