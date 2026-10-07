// -----------------------------------------------------------------------------
// Path: src/features/verification/components/request/verification-request-status.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Verification Request Status
//
// Responsibility
// --------------
// Presents the lifecycle state and basic metadata of one verification
// request.
//
// This component is presentation-only.
//
// It does NOT:
// - fetch verification data
// - fetch Asset data
// - submit requests
// - cancel requests
// - modify Asset state
// - perform authorization
// - navigate
//
// Asset boundary
// --------------
// VerificationRequest contains only assetPublicId. This component therefore
// does not construct or fabricate an Asset object.
//
// If authenticated Asset metadata/content is required, the consuming workflow
// should resolve the Asset through the Assets capability and then use the
// reusable Asset components from:
//
//     @/components/assets
//
// -----------------------------------------------------------------------------

import type { VerificationRequest } from '@/features/verification/models/verification-request';

import { VerificationStatusBadge } from '../shared/verification-status-badge';

export interface VerificationRequestStatusProps {
  readonly request: VerificationRequest;
  readonly className?: string;
}

const REQUEST_TYPE_LABELS: Record<
  VerificationRequest['type'],
  string
> = {
  PROFILE_PHOTO: 'Profile photo',
  GOVERNMENT_ID: 'Government ID',
  DRIVER_LICENSE: 'Driver license',
};

const REQUEST_STATUS_LABELS: Record<
  VerificationRequest['status'],
  string
> = {
  PENDING: 'Pending review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
};

function formatDate(value: string | null): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

/**
 * Verification request statuses intentionally have their own lifecycle.
 *
 * VerificationStatusBadge represents Verification aggregate status:
 *     PENDING | VERIFIED | REJECTED | EXPIRED | REVOKED
 *
 * VerificationRequest has:
 *     PENDING | APPROVED | REJECTED | CANCELLED
 *
 * Therefore APPROVED/CANCELLED are mapped to the closest visual lifecycle
 * representation rather than pretending that they are Verification statuses.
 */
function getBadgeStatus(
  status: VerificationRequest['status'],
): 'PENDING' | 'VERIFIED' | 'REJECTED' | 'REVOKED' {
  switch (status) {
    case 'PENDING':
      return 'PENDING';

    case 'APPROVED':
      return 'VERIFIED';

    case 'REJECTED':
      return 'REJECTED';

    case 'CANCELLED':
      return 'REVOKED';
  }
}

export function VerificationRequestStatus({
  request,
  className,
}: VerificationRequestStatusProps) {
  const typeLabel = REQUEST_TYPE_LABELS[request.type];
  const statusLabel = REQUEST_STATUS_LABELS[request.status];

  return (
    <article
      aria-labelledby={`verification-request-${request.publicId}`}
      className={[
        'rounded-[var(--radius-lg)]',
        'border',
        'border-[var(--border)]',
        'bg-[var(--surface)]',
        'p-4',
        'shadow-[var(--shadow-sm)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3
            id={`verification-request-${request.publicId}`}
            className="text-sm font-semibold text-[var(--foreground)]"
          >
            {typeLabel}
          </h3>

          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            {statusLabel}
          </p>
        </div>

        <VerificationStatusBadge
          status={getBadgeStatus(request.status)}
        />
      </div>

      <dl className="mt-4 grid gap-3 border-t border-[var(--border-subtle)] pt-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-medium text-[var(--foreground-muted)]">
            Submitted
          </dt>

          <dd className="mt-1 text-sm text-[var(--foreground)]">
            {formatDate(request.submittedAt)}
          </dd>
        </div>

        <div>
          <dt className="text-xs font-medium text-[var(--foreground-muted)]">
            Reviewed
          </dt>

          <dd className="mt-1 text-sm text-[var(--foreground)]">
            {formatDate(request.reviewedAt)}
          </dd>
        </div>

        <div>
          <dt className="text-xs font-medium text-[var(--foreground-muted)]">
            Document
          </dt>

          <dd className="mt-1 truncate text-sm font-medium text-[var(--foreground)]">
            {request.assetPublicId}
          </dd>
        </div>
      </dl>

      {request.rejectionReason ? (
        <div
          role="alert"
          className={[
            'mt-4',
            'rounded-[var(--radius-md)]',
            'border',
            'border-[var(--danger)]',
            'bg-[var(--danger-soft)]',
            'p-3',
          ].join(' ')}
        >
          <p className="text-xs font-semibold text-[var(--danger)]">
            Review reason
          </p>

          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            {request.rejectionReason}
          </p>
        </div>
      ) : null}
    </article>
  );
}

export default VerificationRequestStatus;

