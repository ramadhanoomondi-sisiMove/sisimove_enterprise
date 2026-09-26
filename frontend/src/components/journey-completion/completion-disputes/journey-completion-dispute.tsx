// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Dispute
// -----------------------------------------------------------------------------
//
// Presentation component for a single journey-completion dispute.
//
// Responsibilities:
// - present the supplied dispute projection;
// - display dispute status, reason, actor, description, and lifecycle
//   timestamps.
//
// Non-responsibilities:
// - fetching the dispute;
// - opening, withdrawing, resolving, or rejecting the dispute;
// - authorization;
// - lifecycle decisions;
// - mutation or local model updates.
//
// -----------------------------------------------------------------------------

import { Badge } from '@/components/ui';

import type {
  JourneyCompletionDispute as JourneyCompletionDisputeModel,
} from '@/features/journey-completion/models';

import {
  JourneyCompletionDisputeStatus,
} from '@/features/journey-completion/models';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCompletionDisputeProps {
  /**
   * Journey-completion dispute projection to render.
   */
  dispute: JourneyCompletionDisputeModel;
}

// -----------------------------------------------------------------------------
// Formatting helpers
// -----------------------------------------------------------------------------

function getStatusLabel(
  status: JourneyCompletionDisputeStatus,
): string {
  switch (status) {
    case JourneyCompletionDisputeStatus.OPEN:
      return 'Open';

    case JourneyCompletionDisputeStatus.UNDER_REVIEW:
      return 'Under review';

    case JourneyCompletionDisputeStatus.RESOLVED:
      return 'Resolved';

    case JourneyCompletionDisputeStatus.REJECTED:
      return 'Rejected';

    case JourneyCompletionDisputeStatus.WITHDRAWN:
      return 'Withdrawn';

    default:
      throw new Error(
        `Unsupported Journey Completion dispute status: ${String(status)}`,
      );
  }
}

function getStatusVariant(
  status: JourneyCompletionDisputeStatus,
): 'default' | 'success' | 'warning' | 'danger' {
  switch (status) {
    case JourneyCompletionDisputeStatus.OPEN:
    case JourneyCompletionDisputeStatus.UNDER_REVIEW:
      return 'warning';

    case JourneyCompletionDisputeStatus.RESOLVED:
      return 'success';

    case JourneyCompletionDisputeStatus.REJECTED:
      return 'danger';

    case JourneyCompletionDisputeStatus.WITHDRAWN:
      return 'default';

    default:
      throw new Error(
        `Unsupported Journey Completion dispute status: ${String(status)}`,
      );
  }
}

function getReasonLabel(reason: string): string {
  switch (reason) {
    case 'JOURNEY_NOT_COMPLETED':
      return 'Journey not completed';

    case 'JOURNEY_CANCELLED':
      return 'Journey cancelled';

    case 'PASSENGER_DID_NOT_TRAVEL':
      return 'Passenger did not travel';

    case 'PROVIDER_DID_NOT_COMPLETE_JOURNEY':
      return 'Provider did not complete journey';

    case 'BOOKING_DISPUTE':
      return 'Booking dispute';

    case 'OTHER':
      return 'Other';

    default:
      return reason;
  }
}

function formatDateTime(value?: string): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyCompletionDispute({
  dispute,
}: JourneyCompletionDisputeProps) {
  const statusLabel = getStatusLabel(dispute.status);
  const statusVariant = getStatusVariant(dispute.status);
  const reasonLabel = getReasonLabel(dispute.reason);

  const openedAt = formatDateTime(dispute.openedAt);
  const resolvedAt = formatDateTime(dispute.resolvedAt);
  const rejectedAt = formatDateTime(dispute.rejectedAt);
  const withdrawnAt = formatDateTime(dispute.withdrawnAt);

  return (
    <article className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-4">
      <div className="flex flex-col gap-3">
        {/* ----------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              {reasonLabel}
            </h3>

            <p className="mt-1 text-xs text-[var(--foreground-secondary)]">
              Dispute {dispute.publicId}
            </p>
          </div>

          <Badge variant={statusVariant}>
            {statusLabel}
          </Badge>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Core details                                                      */}
        {/* ----------------------------------------------------------------- */}

        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-[var(--foreground-secondary)]">
              Raised by
            </dt>
            <dd className="mt-1 break-all font-medium text-[var(--foreground)]">
              {dispute.raisedByPublicId}
            </dd>
          </div>

          <div>
            <dt className="text-xs text-[var(--foreground-secondary)]">
              Reason
            </dt>
            <dd className="mt-1 font-medium text-[var(--foreground)]">
              {reasonLabel}
            </dd>
          </div>
        </dl>

        {/* ----------------------------------------------------------------- */}
        {/* Description                                                       */}
        {/* ----------------------------------------------------------------- */}

        {dispute.description && (
          <div>
            <p className="text-xs text-[var(--foreground-secondary)]">
              Description
            </p>

            <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--foreground)]">
              {dispute.description}
            </p>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Resolution                                                        */}
        {/* ----------------------------------------------------------------- */}

        {dispute.resolutionSummary && (
          <div>
            <p className="text-xs text-[var(--foreground-secondary)]">
              Resolution
            </p>

            <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--foreground)]">
              {dispute.resolutionSummary}
            </p>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Lifecycle timestamps                                               */}
        {/* ----------------------------------------------------------------- */}

        <dl className="grid gap-3 border-t border-[var(--border-subtle)] pt-3 text-sm sm:grid-cols-2">
          {openedAt && (
            <div>
              <dt className="text-xs text-[var(--foreground-secondary)]">
                Opened
              </dt>
              <dd className="mt-1 text-[var(--foreground)]">
                {openedAt}
              </dd>
            </div>
          )}

          {resolvedAt && (
            <div>
              <dt className="text-xs text-[var(--foreground-secondary)]">
                Resolved
              </dt>
              <dd className="mt-1 text-[var(--foreground)]">
                {resolvedAt}
              </dd>
            </div>
          )}

          {rejectedAt && (
            <div>
              <dt className="text-xs text-[var(--foreground-secondary)]">
                Rejected
              </dt>
              <dd className="mt-1 text-[var(--foreground)]">
                {rejectedAt}
              </dd>
            </div>
          )}

          {withdrawnAt && (
            <div>
              <dt className="text-xs text-[var(--foreground-secondary)]">
                Withdrawn
              </dt>
              <dd className="mt-1 text-[var(--foreground)]">
                {withdrawnAt}
              </dd>
            </div>
          )}
        </dl>

        {/* ----------------------------------------------------------------- */}
        {/* Resolution actor                                                  */}
        {/* ----------------------------------------------------------------- */}

        {dispute.resolvedByPublicId && (
          <div className="border-t border-[var(--border-subtle)] pt-3">
            <p className="text-xs text-[var(--foreground-secondary)]">
              Resolved by
            </p>

            <p className="mt-1 break-all text-sm font-medium text-[var(--foreground)]">
              {dispute.resolvedByPublicId}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}