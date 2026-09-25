// -----------------------------------------------------------------------------
// sisiMove — Journey Management
// Journey List
// -----------------------------------------------------------------------------
//
// Compact management list for authenticated Journey surfaces.
//
// Primary consumers:
// - /my-journeys
// - Journey management surfaces
//
// Responsibilities:
// - Render a collection of Journey management cards.
// - Keep Journey ordering supplied by the query/application layer.
// - Provide a consistent empty state when no Journeys exist.
// - Delegate individual Journey presentation to JourneyCard.
//
// Architectural boundaries:
// - Does NOT fetch Journeys.
// - Does NOT sort or filter Journeys.
// - Does NOT resolve TravellerProfile.
// - Does NOT resolve TrustProfile.
// - Does NOT perform Journey mutations.
// - Does NOT own application routing conventions.
//
// The consuming page supplies the Journey management URL through
// getJourneyHref(). This keeps routing outside the reusable management
// component.
//
// Design boundaries:
// - Mobile-first.
// - One Journey per row.
// - Compact vertical rhythm.
// - Uses only frozen sisiMove design tokens through shared UI primitives.
// -----------------------------------------------------------------------------

import {
  EmptyState,
} from '@/components/ui';

import type {
  Journey,
} from '@/features/journey/models';

import {
  JourneyCard,
} from './journey-card';


// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyListProps {
  /**
   * Journeys to render.
   *
   * Ordering is intentionally preserved exactly as supplied by the caller.
   * The feature/query layer owns ordering decisions.
   */
  journeys: Journey[];

  /**
   * Resolves the authenticated management destination for a Journey.
   *
   * Routing conventions remain outside this reusable component.
   */
  getJourneyHref: (journey: Journey) => string;

  /**
   * Optional additional classes for the list container.
   */
  className?: string;

  /**
   * Optional title used by the empty state.
   *
   * Defaults to "No journeys yet".
   */
  emptyTitle?: string;

  /**
   * Optional description used by the empty state.
   *
   * Defaults to a concise management-oriented message.
   */
  emptyDescription?: string;
}


// -----------------------------------------------------------------------------
// Journey List
// -----------------------------------------------------------------------------

export function JourneyList({
  journeys,
  getJourneyHref,
  className,
  emptyTitle = 'No journeys yet',
  emptyDescription = 'Journeys you create will appear here.',
}: JourneyListProps) {
  // ---------------------------------------------------------------------------
  // Empty state
  // ---------------------------------------------------------------------------
  //
  // The list intentionally does not provide a "Create Journey" action.
  //
  // The consuming page owns that action because it owns the creation route and
  // the surrounding page-level workflow.
  //
  if (journeys.length === 0) {
    return (
      <div className={className}>
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Journey collection
  // ---------------------------------------------------------------------------
  //
  // A single-column list is intentional.
  //
  // Journey cards contain several pieces of operational information and should
  // remain readable on narrow screens rather than being compressed into a
  // multi-column dashboard layout.
  //
  return (
    <div
      className={[
        'grid',
        'grid-cols-1',
        'gap-3',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Journeys"
    >
      {journeys.map((journey) => (
        <JourneyCard
          key={journey.publicId}
          journey={journey}
          href={getJourneyHref(journey)}
        />
      ))}
    </div>
  );
}