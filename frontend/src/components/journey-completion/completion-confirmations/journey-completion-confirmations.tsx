// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Confirmations
// -----------------------------------------------------------------------------
//
// Presentation component for displaying Journey Completion confirmations.
//
// Responsibilities:
// - render the confirmations belonging to a Journey Completion;
// - present confirmation role and lifecycle status;
// - use shared sisiMove UI primitives;
// - communicate an empty confirmation collection clearly.
//
// Non-responsibilities:
// - fetching confirmations;
// - creating or withdrawing confirmations;
// - determining whether a confirmation is valid;
// - determining whether completion may transition;
// - authorization;
// - deriving completion state.
//
// The backend remains authoritative for confirmation lifecycle state.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import {
  Badge,
  Card,
  EmptyState,
} from '@/components/ui';

import type {
  JourneyCompletionConfirmation,
} from '@/features/journey-completion/models';

import {
  JourneyCompletionConfirmationRole,
} from '@/features/journey-completion/models/journey-completion-confirmation-role';

import {
  JourneyCompletionConfirmationStatus,
} from '@/features/journey-completion/models/journey-completion-confirmation-status';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyCompletionConfirmationsProps {
  /**
   * Confirmations returned by the backend for the Journey Completion.
   */
  confirmations: readonly JourneyCompletionConfirmation[];

  /**
   * Optional heading displayed above the confirmation list.
   */
  title?: string;

  /**
   * Optional supporting description.
   */
  description?: string;

  /**
   * Optional content rendered after the section heading.
   */
  headerAction?: ReactNode;

  /**
   * Optional additional class names.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Presentation Helpers
// -----------------------------------------------------------------------------

function getRoleLabel(
  role: JourneyCompletionConfirmationRole,
): string {
  switch (role) {
    case JourneyCompletionConfirmationRole.PROVIDER:
      return 'Provider';

    case JourneyCompletionConfirmationRole.PASSENGER:
      return 'Passenger';
  }
}

function getStatusLabel(
  status: JourneyCompletionConfirmationStatus,
): string {
  switch (status) {
    case JourneyCompletionConfirmationStatus.CONFIRMED:
      return 'Confirmed';

    case JourneyCompletionConfirmationStatus.WITHDRAWN:
      return 'Withdrawn';
  }
}

function getStatusVariant(
  status: JourneyCompletionConfirmationStatus,
): 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'outline' {
  switch (status) {
    case JourneyCompletionConfirmationStatus.CONFIRMED:
      return 'success';

    case JourneyCompletionConfirmationStatus.WITHDRAWN:
      return 'warning';
  }
}

// -----------------------------------------------------------------------------
// Confirmation Item
// -----------------------------------------------------------------------------

interface ConfirmationItemProps {
  confirmation: JourneyCompletionConfirmation;
}

function JourneyCompletionConfirmationItem({
  confirmation,
}: ConfirmationItemProps) {
  return (
    <li className="border-t border-[var(--border-subtle)] first:border-t-0">
      <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-[var(--foreground)]">
              {getRoleLabel(confirmation.role)}
            </span>

            <Badge
              size="sm"
              variant={getStatusVariant(confirmation.status)}
            >
              {getStatusLabel(confirmation.status)}
            </Badge>
          </div>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Confirmation by member {confirmation.memberPublicId}
          </p>

          {confirmation.bookingPublicId && (
            <p className="mt-1 text-xs text-[var(--foreground-subtle)]">
              Booking {confirmation.bookingPublicId}
            </p>
          )}
        </div>

        <time
          dateTime={confirmation.confirmedAt}
          className="shrink-0 text-xs text-[var(--foreground-muted)]"
        >
          {new Date(confirmation.confirmedAt).toLocaleString()}
        </time>
      </div>
    </li>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

/**
 * Render Journey Completion confirmations.
 */
export function JourneyCompletionConfirmations({
  confirmations,
  title = 'Confirmations',
  description = 'Confirmation activity recorded for this journey completion.',
  headerAction,
  className,
}: JourneyCompletionConfirmationsProps) {
  return (
    <section
      aria-labelledby="journey-completion-confirmations-title"
      className={className}
    >
      <Card padding="md">
        <div className="flex flex-col gap-4">
          <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2
                id="journey-completion-confirmations-title"
                className="text-base font-semibold text-[var(--foreground)]"
              >
                {title}
              </h2>

              {description && (
                <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                  {description}
                </p>
              )}
            </div>

            {headerAction && (
              <div className="shrink-0">
                {headerAction}
              </div>
            )}
          </header>

          {confirmations.length === 0 ? (
            <EmptyState
              title="No confirmations yet"
              description="No completion confirmations have been recorded."
            />
          ) : (
            <ul aria-label="Journey completion confirmations">
              {confirmations.map((confirmation) => (
                <JourneyCompletionConfirmationItem
                  key={confirmation.publicId}
                  confirmation={confirmation}
                />
              ))}
            </ul>
          )}
        </div>
      </Card>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JourneyCompletionConfirmations;