'use client';

// -----------------------------------------------------------------------------
// Path: src/components/verification/request/verification-request-list.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Verification Request List
//
// Responsibility
// --------------
// Displays the authenticated user's verification requests.
//
// This component owns:
// - loading the request collection
// - presentation ordering
// - loading / error / empty states
// - reloading the collection after a successful cancellation
//
// VerificationRequestActions owns the cancellation mutation itself.
//
// Important
// ---------
// `VerificationRequest` already contains `verificationPublicId`, so the list
// must not pass that identifier separately to VerificationRequestActions.
// Keeping one source of truth avoids unnecessary prop duplication.
// -----------------------------------------------------------------------------

import { useCallback, useMemo } from 'react';

import { Button } from '@/components/ui';
import { useVerificationRequests } from '@/features/verification/hooks/use-verification-requests';
import type { VerificationRequest } from '@/features/verification/models/verification-request';

import { VerificationRequestActions } from './verification-request-actions';
import { VerificationRequestStatus } from './verification-request-status';

export interface VerificationRequestListProps {
  readonly verificationPublicId: string | null;
  readonly className?: string;
}

function sortRequests(
  requests: readonly VerificationRequest[],
): VerificationRequest[] {
  return [...requests].sort(
    (left, right) =>
      new Date(right.submittedAt).getTime() -
      new Date(left.submittedAt).getTime(),
  );
}

export function VerificationRequestList({
  verificationPublicId,
  className,
}: VerificationRequestListProps) {
  const {
    requests,
    isLoading,
    error,
    reload,
  } = useVerificationRequests(verificationPublicId);

  const sortedRequests = useMemo(
    () => sortRequests(requests),
    [requests],
  );

  /**
   * Cancellation is owned by VerificationRequestActions.
   *
   * The list only needs the success signal so it can reload the authoritative
   * request collection from the backend.
   */
  const handleCancelled = useCallback(() => {
    void reload();
  }, [reload]);

  if (!verificationPublicId) {
    return null;
  }

  return (
    <section
      aria-labelledby="verification-request-list-title"
      className={className}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2
            id="verification-request-list-title"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Verification requests
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            Track the documents and verification requests you have submitted.
          </p>
        </div>

        {!isLoading && sortedRequests.length > 0 && (
          <span className="shrink-0 text-sm text-[var(--foreground-muted)]">
            {sortedRequests.length}{' '}
            {sortedRequests.length === 1 ? 'request' : 'requests'}
          </span>
        )}
      </div>

      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]"
        >
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--brand)]"
            />

            <p className="text-sm text-[var(--foreground-secondary)]">
              Loading verification requests…
            </p>
          </div>
        </div>
      )}

      {!isLoading && error && (
        <div
          role="alert"
          className="rounded-[var(--radius-lg)] border border-[var(--danger)] bg-[var(--danger-soft)] p-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[var(--danger)]">
                Unable to load verification requests
              </h3>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                {error.message}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void reload();
              }}
            >
              Try again
            </Button>
          </div>
        </div>
      )}

      {!isLoading && !error && sortedRequests.length === 0 && (
        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-[var(--shadow-sm)]">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            No verification requests yet
          </h3>

          <p className="mx-auto mt-1 max-w-md text-sm text-[var(--foreground-secondary)]">
            Verification requests you submit will appear here so you can track
            their progress.
          </p>
        </div>
      )}

      {!isLoading && !error && sortedRequests.length > 0 && (
        <div className="space-y-3">
          {sortedRequests.map((request) => (
            <article
              key={request.publicId}
              className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]"
            >
              <div className="flex flex-col gap-4">
                <VerificationRequestStatus request={request} />

                <div className="border-t border-[var(--border-subtle)] pt-3">
                  <VerificationRequestActions
                    request={request}
                    onCancelled={handleCancelled}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
