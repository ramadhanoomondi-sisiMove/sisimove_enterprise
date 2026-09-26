// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Header
// -----------------------------------------------------------------------------
//
// Presentation component for the Journey Completion aggregate header.
//
// Responsibilities:
// - present Journey Completion identity;
// - present the current lifecycle status;
// - present backend-maintained confirmation progress;
// - present journey/provider references;
// - provide a compact reusable header surface.
//
// Non-responsibilities:
// - fetching completion data;
// - changing completion state;
// - determining authorization;
// - rendering lifecycle actions;
// - calculating lifecycle state.
//
// The backend remains authoritative for Journey Completion lifecycle state and
// confirmation counts.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { Card } from '@/components/ui';

import type {
  JourneyCompletion,
} from '@/features/journey-completion/models';

import {
  JourneyCompletionStatusBadge,
} from '../completion-status';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyCompletionHeaderProps {
  /**
   * API-facing Journey Completion aggregate representation.
   */
  completion: JourneyCompletion;

  /**
   * Optional presentation content rendered at the trailing edge.
   *
   * This allows a containing page to provide authorized actions without
   * making the header responsible for authorization or lifecycle decisions.
   */
  trailingContent?: ReactNode;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

/**
 * Render the Journey Completion aggregate header.
 */
export function JourneyCompletionHeader({
  completion,
  trailingContent,
}: JourneyCompletionHeaderProps) {
  return (
    <Card padding="md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* ----------------------------------------------------------------- */}
        {/* Identity / Status                                                 */}
        {/* ----------------------------------------------------------------- */}

        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-semibold text-[var(--foreground)]">
              Journey Completion
            </h1>

            <JourneyCompletionStatusBadge
              status={completion.status}
              size="sm"
            />
          </div>

          {/* --------------------------------------------------------------- */}
          {/* References                                                       */}
          {/* --------------------------------------------------------------- */}

          <div className="flex flex-col gap-1 text-sm text-[var(--foreground-secondary)] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
            <span className="min-w-0 truncate">
              Journey{' '}
              <span className="font-medium text-[var(--foreground)]">
                {completion.journeyPublicId}
              </span>
            </span>

            <span className="min-w-0 truncate">
              Provider{' '}
              <span className="font-medium text-[var(--foreground)]">
                {completion.providerPublicId}
              </span>
            </span>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Confirmation Progress / Trailing Content                          */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          <div className="text-sm text-[var(--foreground-secondary)]">
            <span className="font-medium text-[var(--foreground)]">
              {completion.confirmedCount}
            </span>
            {' / '}
            <span>{completion.requiredConfirmations}</span>
            {' confirmations'}
          </div>

          {trailingContent ? (
            <div className="flex items-center">
              {trailingContent}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}