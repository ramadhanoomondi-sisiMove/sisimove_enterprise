// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Editor Header
// -----------------------------------------------------------------------------
//
// Authenticated/application Journey Demand editor header.
//
// This component consumes the generic JourneyDemand application model.
//
// UX PRINCIPLE:
// - The current lifecycle status is always visible.
// - The status is descriptive, not an authorization mechanism.
// - No lifecycle action is hidden or inferred from the status here.
//
// Architecture:
// - Presentation only.
// - Receives an already-loaded JourneyDemand.
// - Displays the backend-supplied application lifecycle status.
// - Does not fetch the demand.
// - Does not mutate the demand.
// - Does not determine editing permissions.
// - Does not infer lifecycle capabilities.
// - Does not hide lifecycle actions.
// - Does not own navigation.
// - Does not recreate backend lifecycle rules.
// - Does not convert JourneyDemand into PublicJourneyDemand.
//
// The owning editor/container remains responsible for:
// - authorization;
// - mutation orchestration;
// - navigation;
// - form behaviour.
//
// Lifecycle command validity remains the responsibility of the backend.
//
// -----------------------------------------------------------------------------

'use client';

import type { JourneyDemand } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

// =============================================================================
// Props
// =============================================================================

export interface JourneyDemandEditorHeaderProps {
  /**
   * Generic authenticated/application Journey Demand response.
   */
  readonly demand: JourneyDemand;

  /**
   * Optional editor heading.
   */
  readonly title?: string;

  /**
   * Optional supporting description.
   */
  readonly description?: string;

  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Presents the editor heading and the current application lifecycle status.
 *
 * The status is always displayed and is taken directly from the application
 * read model.
 *
 * No action availability is inferred from the status.
 */
export function JourneyDemandEditorHeader({
  demand,
  title = 'Edit travel need',
  description = 'Update the details of this travel need.',
  className,
}: JourneyDemandEditorHeaderProps) {
  return (
    <header
      className={cn(
        'min-w-0 border-b border-border pb-4',
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-foreground sm:text-xl">
            {title}
          </h1>

          {description ? (
            <p className="mt-1 max-w-2xl text-sm text-foreground-muted">
              {description}
            </p>
          ) : null}
        </div>

        <JourneyDemandEditorStatus status={demand.status} />
      </div>
    </header>
  );
}

// =============================================================================
// Status
// =============================================================================

interface JourneyDemandEditorStatusProps {
  readonly status: JourneyDemand['status'];
}

/**
 * Presents the complete application-level Journey Demand status.
 *
 * This status belongs to JourneyDemand and is intentionally displayed without
 * narrowing, filtering, or interpreting its lifecycle meaning.
 *
 * The value is descriptive UI state only.
 *
 * It does not:
 * - authorize a command;
// * - enable or disable a lifecycle action;
// * - hide a lifecycle action;
// * - determine whether editing is permitted;
// * - implement a lifecycle transition.
 */
function JourneyDemandEditorStatus({
  status,
}: JourneyDemandEditorStatusProps) {
  const formattedStatus = formatJourneyDemandStatus(status);

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full',
        'border border-border bg-background',
        'px-2.5 py-1',
        'text-xs font-medium text-foreground',
      )}
      aria-label={`Journey Demand status: ${formattedStatus}`}
    >
      {formattedStatus}
    </span>
  );
}

// =============================================================================
// Formatting
// =============================================================================

/**
 * Converts the backend enum representation into readable UI text.
 *
 * Display formatting only.
 *
 * The underlying lifecycle value is unchanged and is never interpreted as a
 * capability or permission.
 */
function formatJourneyDemandStatus(
  status: JourneyDemand['status'],
): string {
  return status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

