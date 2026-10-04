// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Editor Header
// -----------------------------------------------------------------------------
//
// Authenticated/application Journey Demand editor header.
//
// This component consumes the generic JourneyDemand application model.
//
// Architecture:
// - Presentation only.
// - Receives an already-loaded JourneyDemand.
// - Displays the backend-supplied application lifecycle status.
// - Does not fetch the demand.
// - Does not mutate the demand.
// - Does not determine editing permissions.
// - Does not infer lifecycle capabilities.
// - Does not own navigation.
// - Does not recreate backend lifecycle rules.
// - Does not convert JourneyDemand into PublicJourneyDemand.
//
// The owning editor/container remains responsible for authorization,
// mutation, navigation, and form behaviour.
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
 * Presents the heading and current application lifecycle status for the
 * Journey Demand editor.
 *
 * The status is displayed exactly as supplied by the application read model.
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
 * This status type belongs to JourneyDemand and is intentionally not replaced
 * with the narrower public Journey Demand status contract.
 *
 * No lifecycle rules or capabilities are inferred from the value.
 */
function JourneyDemandEditorStatus({
  status,
}: JourneyDemandEditorStatusProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full',
        'border border-border bg-background',
        'px-2.5 py-1',
        'text-xs font-medium text-foreground',
      )}
      aria-label={`Journey Demand status: ${formatJourneyDemandStatus(status)}`}
    >
      {formatJourneyDemandStatus(status)}
    </span>
  );
}

// =============================================================================
// Formatting
// =============================================================================

/**
 * Converts the backend enum representation into readable UI text.
 *
 * Display formatting only. The underlying lifecycle value is unchanged.
 */
function formatJourneyDemandStatus(
  status: JourneyDemand['status'],
): string {
  return status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
