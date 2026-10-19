
'use client';

// -----------------------------------------------------------------------------
// Path: src/components/verification/onboarding/verification-status.tsx
//
// sisiMove — Verification Status
// Responsibility: Present the current Verification aggregate state.
// The backend remains authoritative for verification status and level.
// -----------------------------------------------------------------------------

import type { Verification } from '@/features/verification/models/verification';

import { VerificationLevelBadge } from '../shared/verification-level-badge';
import { VerificationStatusBadge } from '../shared/verification-status-badge';

export interface VerificationStatusProps {
  readonly verification: Verification;
}

function formatDate(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function getStatusDescription(
  status: Verification['status'],
  level: Verification['level'],
): string {
  switch (status) {
    case 'PENDING':
      return level === 'NONE'
        ? 'Your verification is pending. You are not verified yet.'
        : 'Your verification status is pending.';

    case 'VERIFIED':
      return level === 'NONE'
        ? 'Your verification status is marked as verified, but no verification level is assigned. Please contact support.'
        : 'Your identity verification is complete.';

    case 'REJECTED':
      return 'Your verification was rejected. Please review the feedback and next steps.';

    case 'EXPIRED':
      return 'Your verification has expired and may need to be renewed.';

    case 'REVOKED':
      return 'Your verification is no longer active.';
  }
}

export function VerificationStatus({
  verification,
}: VerificationStatusProps) {
  const verifiedDate = formatDate(verification.verifiedAt);
  const expiryDate = formatDate(verification.expiresAt);

  return (
    <section
      aria-labelledby="verification-status-title"
      className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2
              id="verification-status-title"
              className="text-base font-semibold text-[var(--foreground)]"
            >
              Verification status
            </h2>

            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              {getStatusDescription(
                verification.status,
                verification.level,
              )}
            </p>

            {verification.status === 'REJECTED' &&
              verification.rejectionReason?.trim() && (
                <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
                  <span className="font-medium text-[var(--foreground)]">
                    Reason:
                  </span>{' '}
                  {verification.rejectionReason}
                </p>
              )}
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <VerificationStatusBadge status={verification.status} />
            <VerificationLevelBadge level={verification.level} />
          </div>
        </div>

        <dl className="grid gap-3 border-t border-[var(--border-subtle)] pt-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Verification level
            </dt>

            <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">
              {verification.level === 'NONE'
                ? 'Not verified'
                : verification.level === 'MEMBER'
                  ? 'Member'
                  : 'Driver'}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Status
            </dt>

            <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">
              {verification.status}
            </dd>
          </div>

          {verifiedDate && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Verified
              </dt>

              <dd className="mt-1 text-sm text-[var(--foreground-secondary)]">
                {verifiedDate}
              </dd>
            </div>
          )}

          {expiryDate && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Expires
              </dt>

              <dd className="mt-1 text-sm text-[var(--foreground-secondary)]">
                {expiryDate}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  );
}

export default VerificationStatus;
