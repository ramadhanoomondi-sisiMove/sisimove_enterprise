
 // -----------------------------------------------------------------------------
// sisiMove — Admin Member Verification Panel
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display aggregate verification status and level.
// - Display accepted verification indicators and relevant timestamps.
// - Display evidence requests and their individual review statuses.
// - Distinguish loading, error, empty and populated states.
// - Never infer aggregate verification from an approved evidence request.
//
// Non-responsibilities:
// - Fetching verification records.
// - Approving or rejecting verification requests.
// - Defining backend verification contracts.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import type {
  MemberVerification,
  MemberVerificationRequest,
} from '@/features/admin/members/models/member-verification.model';

import {
  MemberVerificationBadge,
  type MemberVerificationStatus,
} from '@/components/admin/members/primitives/member-verification-badge';

import { MemberDataSection } from '@/components/admin/members/primitives/member-data-section';
import { Button } from '@/components/ui/button';
import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MemberVerificationPanelProps {
  readonly verification: MemberVerification | null;
  readonly isLoading?: boolean;
  readonly error?: string | null;
  readonly onRetry?: () => void;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatTimestamp(value?: string | null): string {
  if (!value?.trim()) return 'Not recorded';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Unavailable';

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatLabel(value?: string | null): string {
  if (!value?.trim()) return 'Not specified';

  return value
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatBoolean(value: boolean): string {
  return value ? 'Verified' : 'Not verified';
}

// -----------------------------------------------------------------------------
// Verification Indicator
// -----------------------------------------------------------------------------

interface VerificationIndicatorProps {
  readonly label: string;
  readonly verified: boolean;
  readonly verifiedAt?: string;
}

function VerificationIndicator({
  label,
  verified,
  verifiedAt,
}: VerificationIndicatorProps): ReactNode {
  return (
    <div className="flex min-w-0 items-start justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--foreground)]">
          {label}
        </p>

        {verifiedAt ? (
          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            Verified on {formatTimestamp(verifiedAt)}
          </p>
        ) : null}
      </div>

      <span
        className={cn(
          'shrink-0 rounded-[var(--radius-full)] px-2 py-1 text-xs font-medium',
          verified
            ? 'bg-[var(--success-soft)] text-[var(--success)]'
            : 'bg-[var(--background-muted)] text-[var(--foreground-secondary)]',
        )}
      >
        {formatBoolean(verified)}
      </span>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Evidence Request Card
// -----------------------------------------------------------------------------

interface VerificationRequestCardProps {
  readonly request: MemberVerificationRequest;
}

function VerificationRequestCard({
  request,
}: VerificationRequestCardProps): ReactNode {
  const requestStatus = request.status.trim().toUpperCase();
  const isRejected = requestStatus === 'REJECTED';

  return (
    <article className="min-w-0 rounded-[var(--radius-lg)] border border-[var(--border)] p-4">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h4 className="break-words text-sm font-semibold text-[var(--foreground)]">
            {formatLabel(request.type)}
          </h4>

          <p className="mt-1 break-all font-mono text-xs text-[var(--foreground-muted)]">
            Request ID: {request.publicId}
          </p>
        </div>

        <MemberVerificationBadge
          status={request.status as MemberVerificationStatus}
          size="sm"
        />
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
        <div className="min-w-0">
          <dt className="text-xs font-medium text-[var(--foreground-muted)]">
            Submitted
          </dt>
          <dd className="mt-1 text-sm text-[var(--foreground)]">
            {formatTimestamp(request.submittedAt)}
          </dd>
        </div>

        <div className="min-w-0">
          <dt className="text-xs font-medium text-[var(--foreground-muted)]">
            Reviewed
          </dt>
          <dd className="mt-1 text-sm text-[var(--foreground)]">
            {formatTimestamp(request.reviewedAt)}
          </dd>
        </div>

        {request.reviewedByPublicId ? (
          <div className="min-w-0">
            <dt className="text-xs font-medium text-[var(--foreground-muted)]">
              Reviewer ID
            </dt>
            <dd className="mt-1 break-all font-mono text-xs text-[var(--foreground)]">
              {request.reviewedByPublicId}
            </dd>
          </div>
        ) : null}

        {request.assetPublicId ? (
          <div className="min-w-0">
            <dt className="text-xs font-medium text-[var(--foreground-muted)]">
              Evidence asset ID
            </dt>
            <dd className="mt-1 break-all font-mono text-xs text-[var(--foreground)]">
              {request.assetPublicId}
            </dd>
          </div>
        ) : null}
      </dl>

      {isRejected && request.rejectionReason?.trim() ? (
        <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--danger)]/20 bg-[var(--danger-soft)] p-3">
          <p className="text-xs font-semibold text-[var(--danger)]">
            Rejection reason
          </p>

          <p className="mt-1 whitespace-pre-line break-words text-sm text-[var(--foreground)]">
            {request.rejectionReason.trim()}
          </p>
        </div>
      ) : null}
    </article>
  );
}

// -----------------------------------------------------------------------------
// Loading State
// -----------------------------------------------------------------------------

function VerificationLoadingState(): ReactNode {
  return (
    <div
      className="space-y-3"
      role="status"
      aria-label="Loading verification details"
    >
      <div className="animate-pulse rounded-[var(--radius-lg)] border border-[var(--border-subtle)] p-4">
        <div className="h-5 w-40 rounded bg-[var(--background-muted)]" />
        <div className="mt-3 h-4 w-28 rounded bg-[var(--background-muted)]" />
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-16 rounded bg-[var(--background-muted)]"
            />
          ))}
        </div>
      </div>

      <span className="sr-only">Loading verification details…</span>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MemberVerificationPanel({
  verification,
  isLoading = false,
  error,
  onRetry,
  className,
}: MemberVerificationPanelProps): ReactNode {
  return (
    <MemberDataSection
      title="Verification"
      description="Aggregate verification status, accepted verification indicators, and evidence review history."
      className={className}
    >
      {isLoading ? (
        <VerificationLoadingState />
      ) : error ? (
        <div
          role="alert"
          className="rounded-[var(--radius-lg)] border border-[var(--danger)]/25 bg-[var(--danger-soft)] p-4"
        >
          <p className="text-sm font-medium text-[var(--foreground)]">
            Verification details could not be loaded.
          </p>

          <p className="mt-1 break-words text-sm text-[var(--foreground-secondary)]">
            {error}
          </p>

          {onRetry ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-3"
            >
              Try again
            </Button>
          ) : null}
        </div>
      ) : !verification ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] px-4 py-8 text-center">
          <p className="text-sm font-medium text-[var(--foreground)]">
            No verification record available
          </p>

          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            No verification aggregate was returned for this member. This does
            not establish whether the member has submitted evidence elsewhere.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Aggregate status */}
          <section className="rounded-[var(--radius-lg)] border border-[var(--border)] p-4">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium text-[var(--foreground-muted)]">
                  Overall verification status
                </p>

                <div className="mt-2">
                  <MemberVerificationBadge
                    status={verification.status as MemberVerificationStatus}
                    size="sm"
                  />
                </div>

                <p className="mt-3 text-sm text-[var(--foreground-secondary)]">
                  Verification level:{' '}
                  <span className="font-medium text-[var(--foreground)]">
                    {formatLabel(verification.level)}
                  </span>
                </p>
              </div>

              <div className="min-w-0 text-sm sm:text-right">
                <p className="text-xs font-medium text-[var(--foreground-muted)]">
                  Verification ID
                </p>
                <p className="mt-1 break-all font-mono text-xs text-[var(--foreground-secondary)]">
                  {verification.publicId}
                </p>
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-1 gap-4 border-t border-[var(--border-subtle)] pt-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-[var(--foreground-muted)]">
                  Verified at
                </dt>
                <dd className="mt-1 text-sm text-[var(--foreground)]">
                  {formatTimestamp(
                    verification.verifiedAt ??
                      verification.memberVerifiedAt,
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium text-[var(--foreground-muted)]">
                  Verification expires
                </dt>
                <dd className="mt-1 text-sm text-[var(--foreground)]">
                  {formatTimestamp(verification.expiresAt)}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium text-[var(--foreground-muted)]">
                  Last reviewed
                </dt>
                <dd className="mt-1 text-sm text-[var(--foreground)]">
                  {formatTimestamp(verification.lastReviewedAt)}
                </dd>
              </div>

              {verification.reviewedByPublicId ? (
                <div>
                  <dt className="text-xs font-medium text-[var(--foreground-muted)]">
                    Reviewer ID
                  </dt>
                  <dd className="mt-1 break-all font-mono text-xs text-[var(--foreground)]">
                    {verification.reviewedByPublicId}
                  </dd>
                </div>
              ) : null}
            </dl>

            {verification.rejectionReason?.trim() ? (
              <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--danger)]/20 bg-[var(--danger-soft)] p-3">
                <p className="text-xs font-semibold text-[var(--danger)]">
                  Aggregate rejection reason
                </p>
                <p className="mt-1 whitespace-pre-line break-words text-sm text-[var(--foreground)]">
                  {verification.rejectionReason.trim()}
                </p>
              </div>
            ) : null}
          </section>

          {/* Accepted verification indicators */}
          <section>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Verification checks
            </h3>

            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              These indicators reflect the values returned by the Verification
              aggregate.
            </p>

            <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
              <VerificationIndicator
                label="Profile photo"
                verified={verification.profilePhotoVerified}
                verifiedAt={verification.profilePhotoVerifiedAt}
              />

              <VerificationIndicator
                label="Government ID"
                verified={verification.governmentIdVerified}
                verifiedAt={verification.governmentIdVerifiedAt}
              />

              <VerificationIndicator
                label="Driver’s licence"
                verified={verification.driverLicenseVerified}
                verifiedAt={verification.driverLicenseVerifiedAt}
              />
            </div>
          </section>

          {/* Submitted evidence requests */}
          <section>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Evidence requests
              </h3>

              <span className="text-xs text-[var(--foreground-muted)]">
                {verification.requests.length}{' '}
                {verification.requests.length === 1 ? 'request' : 'requests'}
              </span>
            </div>

            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              Each request has its own review status. An approved request does
              not by itself establish aggregate verification.
            </p>

            {verification.requests.length === 0 ? (
              <div className="mt-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] px-4 py-6 text-center">
                <p className="text-sm text-[var(--foreground-secondary)]">
                  No evidence requests are recorded on this verification
                  aggregate.
                </p>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                {verification.requests.map((request) => (
                  <VerificationRequestCard
                    key={request.publicId}
                    request={request}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </MemberDataSection>
  );
}

export default MemberVerificationPanel;
