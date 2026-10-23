
'use client';

/**
 * sisiMove — Admin Journeys Error
 *
 * Next.js App Router error boundary.
 *
 * Responsibilities:
 * - Display recoverable route errors.
 * - Provide a working retry action.
 * - Preserve the admin visual design.
 * - Avoid exposing internal error details to users.
 */

import { useEffect } from 'react';

import { JourneyErrorState } from '@/components/admin/journeys/shared';

interface AdminJourneysErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function AdminJourneysError({
  error,
  reset,
}: AdminJourneysErrorProps) {
  useEffect(() => {
    // Keep technical details out of the visible interface.
    console.error('[AdminJourneysError]', error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[var(--background-subtle)] px-4 py-12 sm:px-6">
      <div className="w-full max-w-xl rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
        <JourneyErrorState
          title="Journey Control Center unavailable"
          description="We couldn't load the journey management workspace. Please try again. If the problem continues, contact your system administrator."
          retryAction={{
            label: 'Try again',
            onClick: reset,
          }}
        />
      </div>
    </main>
  );
}
