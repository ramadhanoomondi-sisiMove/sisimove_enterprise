// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Marketplace Card
// -----------------------------------------------------------------------------
//
// Public marketplace card for a Journey Demand.
//
// The Demand is the primary data object for this presentation component. The
// card composes the focused Demand card sections:
//
//     DemandMarketplaceCard
//     ├── DemandCardRequester
//     ├── DemandCardRoute
//     ├── DemandCardDetails
//     └── DemandCardActions
//
// This component owns the marketplace card shell and composition only.
//
// It deliberately does not:
// - fetch Demand data;
// - fetch requester, trust, or route data;
// - resolve Identity references;
// - determine whether a Demand can be joined;
// - perform joining or booking mutations;
// - contain Demand lifecycle logic;
// - construct API URLs.
//
// Navigation destinations are supplied to DemandCardActions by the parent.
//
// -----------------------------------------------------------------------------

import type { PublicJourneyDemand } from '@/features/journey-demands/models/public-journey-demand';

import { Card } from '@/components/ui/card';

import { DemandCardRequester } from './demand-card-requester';
import { DemandCardRoute } from './demand-card-route';
import { DemandCardDetails } from './demand-card-details';
import { DemandCardActions } from './demand-card-actions';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface DemandMarketplaceCardProps {
  /**
   * Public Journey Demand represented by the marketplace card.
   */
  demand: PublicJourneyDemand;

  /**
   * Destination for the public Demand detail page.
   */
  viewHref: string;

  /**
   * Optional destination for joining the Demand.
   *
   * When absent, the Join action is not rendered.
   */
  joinHref?: string;

  /**
   * Whether the requester should link to their public traveller profile.
   *
   * Enabled by default for public marketplace discovery.
   */
  linkRequesterToProfile?: boolean;

  /**
   * Whether public requester trust badges should be displayed.
   *
   * Enabled by default because trust is important marketplace context.
   */
  showRequesterTrustBadges?: boolean;

  /**
   * Optional additional styling supplied by the marketplace list/grid.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function DemandMarketplaceCard({
  demand,
  viewHref,
  joinHref,
  linkRequesterToProfile = true,
  showRequesterTrustBadges = true,
  className,
}: DemandMarketplaceCardProps) {
  return (
    <Card
      className={[
        'flex',
        'h-full',
        'min-w-0',
        'flex-col',
        'gap-5',
        'p-5',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Requester                                                           */}
      {/* ------------------------------------------------------------------- */}
      {/*
        The requester establishes who is asking for the journey. Traveller
        identity and trust presentation remain owned by the shared components
        used by DemandCardRequester.
      */}

      <DemandCardRequester
        requester={demand.requester}
        linkToProfile={linkRequesterToProfile}
        showTrustBadges={showRequesterTrustBadges}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Route                                                               */}
      {/* ------------------------------------------------------------------- */}
      {/*
        The route is the central marketplace information: where this
        traveller wants to travel.
      */}

      <DemandCardRoute route={demand.route} />

      {/* ------------------------------------------------------------------- */}
      {/* Details                                                             */}
      {/* ------------------------------------------------------------------- */}
      {/*
        Details provide the compact decision-making information around the
        Demand: departure window, capacity, pricing, and lifecycle status.
      */}

      <DemandCardDetails demand={demand} />

      {/* ------------------------------------------------------------------- */}
      {/* Actions                                                             */}
      {/* ------------------------------------------------------------------- */}
      {/*
        Navigation is supplied by the parent rather than constructed here.
        This keeps marketplace routing outside the presentation component.
      */}

      <DemandCardActions
        viewHref={viewHref}
        joinHref={joinHref}
        className="mt-auto pt-1"
      />
    </Card>
  );
}

