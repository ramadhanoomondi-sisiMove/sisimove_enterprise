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
// - construct API URLs;
// - decide marketplace routing.
//
// Navigation destinations are supplied by the parent.
//
// IMPORTANT:
//
// Journey Demand remains the primary marketplace object. Requester, Trust,
// and Traveller information are public read-side enrichment already composed
// into the PublicJourneyDemand contract.
//
// This component therefore passes the composed read model directly to its
// child presentation components. It does not reconstruct or remap the
// requester/trust relationship.
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
   *
   * This is the authoritative public read model for the card.
   */
  readonly demand: PublicJourneyDemand;

  /**
   * Destination for the public Demand detail page.
   *
   * The marketplace parent owns URL construction.
   */
  readonly viewHref: string;

  /**
   * Optional destination/action target for joining the Demand.
   *
   * The parent decides whether a join destination is appropriate. The card
   * does not infer authentication state, permissions, or Demand eligibility.
   *
   * When absent, DemandCardActions does not render a Join action.
   */
  readonly joinHref?: string;

  /**
   * Whether the requester should link to their public Traveller profile.
   *
   * Enabled by default for public marketplace discovery.
   */
  readonly linkRequesterToProfile?: boolean;

  /**
   * Whether public requester Trust badges should be displayed.
   *
   * Enabled by default because Trust is important marketplace context.
   */
  readonly showRequesterTrustBadges?: boolean;

  /**
   * Optional additional styling supplied by the marketplace list/grid.
   */
  readonly className?: string;
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
       * The requester establishes who is asking for the journey.
       *
       * PublicJourneyDemand already contains the composed Traveller + Trust
       * read models. DemandMarketplaceCard does not fetch or reconstruct
       * either of them.
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
       * The route is the central marketplace information: where this Demand
       * is looking to travel.
       */}
      <DemandCardRoute route={demand.route} />

      {/* ------------------------------------------------------------------- */}
      {/* Details                                                             */}
      {/* ------------------------------------------------------------------- */}
      {/*
       * Details provide the compact decision-making information around the
       * Demand:
       *
       * - requested travel window;
       * - requested capacity;
       * - remaining capacity;
       * - price expectation;
       * - public lifecycle status.
       *
       * DemandCardDetails receives the Demand read model directly so it does
       * not need to reconstruct state from individual props.
       */}
      <DemandCardDetails demand={demand} />

      {/* ------------------------------------------------------------------- */}
      {/* Actions                                                             */}
      {/* ------------------------------------------------------------------- */}
      {/*
       * Navigation is supplied by the marketplace parent.
       *
       * This component does not construct URLs and does not decide whether
       * the current visitor is authenticated or eligible to join.
       */}
      <DemandCardActions
        viewHref={viewHref}
        joinHref={joinHref}
        className="mt-auto pt-1"
      />
    </Card>
  );
}