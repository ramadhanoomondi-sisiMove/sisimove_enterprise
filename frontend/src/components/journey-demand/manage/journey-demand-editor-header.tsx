// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Editor Header
// -----------------------------------------------------------------------------
//
// Authenticated/application Journey Demand editor header.
//
// This component consumes the generic JourneyDemand application/HTTP model.
//
// It is intentionally separate from the public Journey Demand presentation
// because the generic response exposes the complete backend lifecycle:
//
//     DRAFT
//     OPEN
//     MATCHED
//     CONVERTED
//     FULFILLED
//     CANCELLED
//     EXPIRED
//
// The public Journey Demand status projection intentionally exposes only the
// statuses that are publicly visible.
//
// Architecture rules:
// - Presentation only.
// - Receives an already-loaded JourneyDemand.
// - Does not fetch the demand.
// - Does not mutate the demand.
// - Does not determine editing permissions.
// - Does not infer lifecycle capabilities.
// - Does not own navigation.
// - Does not recreate backend lifecycle rules.
// - Does not convert JourneyDemand into PublicJourneyDemand.
//
// The owning editor/container supplies the loaded application model and owns
// authorization, mutation, navigation, and form behaviour.
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
 * Presents the heading and lifecycle context for a Journey Demand editor.
 *
 * Lifecycle status is displayed exactly as supplied by the backend.
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

        <JourneyDemandEditorStatus
          status={demand.status}
        />
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
 * We deliberately do not use JourneyDemandStatusBadge here because that
 * shared component is typed for PublicJourneyDemandStatus and therefore
 * cannot represent the complete JourneyDemandStatus contract.
 *
 * No lifecycle meaning is inferred here. The value comes directly from the
 * backend response.
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
 * This is display formatting only; it does not change or reinterpret the
 * lifecycle status.
 */
function formatJourneyDemandStatus(
  status: JourneyDemand['status'],
): string {
  return status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

