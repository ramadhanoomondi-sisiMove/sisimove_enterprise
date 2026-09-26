// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Confirmation
// -----------------------------------------------------------------------------
//
// Presentation component for an individual Journey Completion confirmation.
//
// Responsibilities:
// - present one backend-provided confirmation;
// - display participant role and confirmation status;
// - display related member/booking references;
// - provide an optional trailing presentation slot.
//
// Non-responsibilities:
// - creating confirmations;
// - withdrawing confirmations;
// - determining authorization;
// - deriving lifecycle state;
// - making API requests.
//
// The backend remains authoritative for confirmation state.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { Card } from '@/components/ui';

import type {
  JourneyCompletionConfirmation as JourneyCompletionConfirmationModel,
} from '@/features/journey-completion/models';

import {
  JourneyCompletionConfirmationStatus,
} from '@/features/journey-completion/models/journey-completion-confirmation-status';

import {
  JourneyCompletionConfirmationStatusBadge,
} from './journey-completion-confirmation-status';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyCompletionConfirmationProps {
  /**
   * Backend-provided Journey Completion confirmation.
   */
  confirmation: JourneyCompletionConfirmationModel;

  /**
   * Optional content rendered at the trailing edge.
   *
   * This is intentionally presentation-only. Any action supplied here must
   * be authorized and orchestrated by the containing feature/page.
   */
  trailingContent?: ReactNode;

  /**
   * Optional additional class names.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Presentation Helpers
// -----------------------------------------------------------------------------

/**
 * Resolve the human-readable participant role.
 *
 * The backend confirmation role currently contains exactly:
 * - PROVIDER
 * - PASSENGER
 *
 * The default branch is intentionally unreachable for valid domain data.
 * Throwing here prevents an unknown backend value from silently rendering
 * incomplete UI if the backend enum evolves without the frontend being
 * updated.
 */
function getRoleLabel(
  role: JourneyCompletionConfirmationModel['role'],
): string {
  switch (role) {
    case 'PROVIDER':
      return 'Provider';

    case 'PASSENGER':
      return 'Passenger';

    default:
      throw new Error(
        `Unsupported Journey Completion confirmation role: ${String(role)}`,
      );
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

/**
 * Render an individual Journey Completion confirmation.
 */
export function JourneyCompletionConfirmation({
  confirmation,
  trailingContent,
  className,
}: JourneyCompletionConfirmationProps) {
  const isWithdrawn =
    confirmation.status ===
    JourneyCompletionConfirmationStatus.WITHDRAWN;

  return (
    <Card
      padding="md"
      className={className}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* ----------------------------------------------------------------- */}
        {/* Confirmation information                                          */}
        {/* ----------------------------------------------------------------- */}

        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              {getRoleLabel(confirmation.role)} confirmation
            </h2>

            <JourneyCompletionConfirmationStatusBadge
              status={confirmation.status}
            />
          </div>

          <dl className="grid gap-1 text-sm">
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-[var(--foreground-muted)]">
                Member
              </dt>

              <dd className="font-medium text-[var(--foreground)]">
                {confirmation.memberPublicId}
              </dd>
            </div>

            {confirmation.bookingPublicId && (
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-[var(--foreground-muted)]">
                  Booking
                </dt>

                <dd className="font-medium text-[var(--foreground)]">
                  {confirmation.bookingPublicId}
                </dd>
              </div>
            )}

            <div className="flex flex-wrap gap-x-2">
              <dt className="text-[var(--foreground-muted)]">
                Confirmed
              </dt>

              <dd>
                <time
                  dateTime={confirmation.confirmedAt}
                  className="text-[var(--foreground-secondary)]"
                >
                  {new Date(
                    confirmation.confirmedAt,
                  ).toLocaleString()}
                </time>
              </dd>
            </div>

            {isWithdrawn && confirmation.withdrawnAt && (
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-[var(--foreground-muted)]">
                  Withdrawn
                </dt>

                <dd>
                  <time
                    dateTime={confirmation.withdrawnAt}
                    className="text-[var(--foreground-secondary)]"
                  >
                    {new Date(
                      confirmation.withdrawnAt,
                    ).toLocaleString()}
                  </time>
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Optional trailing presentation                                    */}
        {/* ----------------------------------------------------------------- */}

        {trailingContent && (
          <div className="flex shrink-0 items-center">
            {trailingContent}
          </div>
        )}
      </div>
    </Card>
  );
}