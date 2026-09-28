// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Card
// -----------------------------------------------------------------------------
//
// Presents one public Journey Demand marketplace projection.
//
// Responsibilities:
// - present one PublicJourneyDemand projection;
// - compose shared public Journey Demand presentation components;
// - expose optional View Demand and Join Demand actions;
// - provide a compact, responsive marketplace card.
//
// Non-responsibilities:
// - no data fetching;
// - no mutation handling;
// - no authorization decisions;
// - no filtering;
// - no sorting;
// - no collection ownership;
// - no lifecycle reconstruction;
// - no route construction;
// - no import of JourneyDemandList;
// - no import of JourneyDemandMarketplace.
//
// Component hierarchy:
//
//   JourneyDemandMarketplace
//            ↓
//   JourneyDemandList
//            ↓
//   JourneyDemandCard
//
// This component is intentionally a leaf presentation component.
//
// Public model boundary:
//
//   PublicJourneyDemand
//     ├── requester
//     ├── route
//     ├── schedule
//     ├── capacity
//     ├── pricing
//     └── demand
//
// All business facts come directly from that backend-provided projection.
// -----------------------------------------------------------------------------

'use client';

import { Card } from '@/components/ui';

import type {
  PublicJourneyDemand,
} from '@/features/journey-demand/models';

import { cn } from '@/foundation';

import {
  JourneyDemandActions,
  JourneyDemandDemandSummary,
  JourneyDemandDate,
  JourneyDemandRequesterSummary,
  JourneyDemandRoute,
  JourneyDemandScheduleSummary,
  JourneyDemandStatusBadge,
} from '../shared';

import { JourneyDemandPricingSummary } from '../pricing';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandCardProps {
  /**
   * Public Journey Demand projection supplied by the marketplace query.
   */
  readonly demand: PublicJourneyDemand;

  /**
   * Controls information density.
   *
   * Compact is appropriate for dense marketplace results.
   * Default provides slightly stronger visual hierarchy.
   */
  readonly emphasis?: 'compact' | 'default';

  /**
   * Optional additional classes.
   */
  readonly className?: string;

  /**
   * Opens the public Journey Demand detail surface.
   *
   * Navigation remains owned by the parent.
   */
  readonly onView?: () => void;

  /**
   * Joins the Journey Demand.
   *
   * The parent owns authorization, mutation handling, and capability checks.
   */
  readonly onJoin?: () => void;

  /**
   * Whether the Join Demand mutation is processing.
   */
  readonly isJoining?: boolean;

  /**
   * Allows the parent to disable the View action.
   */
  readonly viewDisabled?: boolean;

  /**
   * Allows the parent to disable the Join action.
   */
  readonly joinDisabled?: boolean;

  /**
   * Optional action labels.
   */
  readonly viewLabel?: string;
  readonly joinLabel?: string;
  readonly joiningLabel?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandCard({
  demand,
  emphasis = 'default',
  className,
  onView,
  onJoin,
  isJoining = false,
  viewDisabled = false,
  joinDisabled = false,
  viewLabel = 'View Demand',
  joinLabel = 'Join Demand',
  joiningLabel = 'Joining…',
}: JourneyDemandCardProps) {
  const isCompact = emphasis === 'compact';

  const waypointCount = demand.route.waypoints.length;

  return (
    <Card
      className={cn(
        'w-full',
        'overflow-hidden',
        'transition-shadow',
        'duration-200',
        'hover:shadow-[var(--shadow-md)]',
        className,
      )}
      padding={isCompact ? 'sm' : 'md'}
    >
      <article
        className={cn(
          'min-w-0',
          isCompact ? 'space-y-3' : 'space-y-4',
        )}
        aria-label={[
          'Journey demand',
          'from',
          demand.route.origin.name,
          'to',
          demand.route.destination.name,
        ].join(' ')}
      >
        {/* -----------------------------------------------------------------
            Header
            ----------------------------------------------------------------- */}

        <header
          className={cn(
            'flex',
            'min-w-0',
            'items-start',
            'justify-between',
            'gap-3',
          )}
        >
          <JourneyDemandDate
            schedule={demand.schedule}
            emphasis={emphasis}
          />

          <JourneyDemandStatusBadge
            status={demand.status}
          />
        </header>

        {/* -----------------------------------------------------------------
            Requester
            -----------------------------------------------------------------
            
            Public identity and trust evidence are already supplied by the
            requester projection. Nothing is reconstructed here.
            ----------------------------------------------------------------- */}

        <JourneyDemandRequesterSummary
          requester={demand.requester}
          emphasis="compact"
        />

        {/* -----------------------------------------------------------------
            Route
            ----------------------------------------------------------------- */}

        <div className="min-w-0">
          <JourneyDemandRoute
            route={demand.route}
            emphasis={emphasis}
          />

          {/* ---------------------------------------------------------------
              Waypoint evidence

              Waypoints are already part of the public route projection.
              The card presents their existence without assigning additional
              route semantics or reconstructing business state.
              --------------------------------------------------------------- */}

          {waypointCount > 0 && (
            <p
              className={cn(
                'mt-1.5',
                'text-[var(--foreground-muted)]',
                isCompact ? 'text-xs' : 'text-sm',
              )}
            >
              + {waypointCount}{' '}
              {waypointCount === 1 ? 'waypoint' : 'waypoints'}
            </p>
          )}
        </div>

        {/* -----------------------------------------------------------------
            Demand evidence
            -----------------------------------------------------------------
            
            Both values come directly from the public projection:
            - requested seats → capacity;
            - participant count → demand.

            No remaining-seat or matching-state calculation is performed.
            ----------------------------------------------------------------- */}

        <div
          className={cn(
            'flex',
            'min-w-0',
            'items-center',
            'justify-between',
            'gap-3',
          )}
        >
          <JourneyDemandDemandSummary
            capacity={demand.capacity}
            demand={demand.demand}
            emphasis="compact"
          />
        </div>

        {/* -----------------------------------------------------------------
            Schedule + pricing
            -----------------------------------------------------------------
            
            This is the card's primary decision-support row:
            when is the requester travelling, and what price preference
            have they expressed?
            ----------------------------------------------------------------- */}

        <div
          className={cn(
            'flex',
            'min-w-0',
            'flex-col',
            'gap-3',
            'border-t',
            'border-[var(--border-subtle)]',
            'pt-3',
            'sm:flex-row',
            'sm:items-end',
            'sm:justify-between',
            'sm:gap-4',
          )}
        >
          <div className="min-w-0">
            <JourneyDemandScheduleSummary
              schedule={demand.schedule}
              emphasis="compact"
              showArrival
            />
          </div>

          <div
            className={cn(
              'min-w-0',
              'sm:text-right',
            )}
          >
            <JourneyDemandPricingSummary
              pricing={demand.pricing}
              emphasis="compact"
            />
          </div>
        </div>

        {/* -----------------------------------------------------------------
            Actions
            -----------------------------------------------------------------
            
            The card only exposes callbacks. The parent remains responsible
            for navigation, authorization, capability checks, and mutation
            handling.
            ----------------------------------------------------------------- */}

        <JourneyDemandActions
          onView={onView}
          onJoin={onJoin}
          viewLabel={viewLabel}
          joinLabel={joinLabel}
          joiningLabel={joiningLabel}
          isJoining={isJoining}
          viewDisabled={viewDisabled}
          joinDisabled={joinDisabled}
          emphasis={isCompact ? 'compact' : 'default'}
        />
      </article>
    </Card>
  );
}

