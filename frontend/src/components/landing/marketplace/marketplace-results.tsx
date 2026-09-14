// -----------------------------------------------------------------------------
// sisiMove — Marketplace Results
// -----------------------------------------------------------------------------
//
// Presentation component for the public marketplace result collection.
//
// The marketplace is composed from two independent feature domains:
//
// - Journey
// - Journey Demand
//
// PublicMarketplaceItem is therefore a discriminated union. This component
// uses the item's `type` to select the appropriate presentation component:
//
// - JOURNEY → JourneyMarketplaceCard
// - DEMAND  → DemandMarketplaceCard
//
// Responsibilities:
//
// - render marketplace items;
// - select the correct card from the item discriminator;
// - receive presentation URLs from the parent;
// - preserve the independence of Journey and Journey Demand.
//
// This component does not:
//
// - fetch marketplace data;
// - filter or sort results;
// - construct URLs;
// - determine booking eligibility;
// - determine whether a Demand can be joined;
// - manage pagination;
// - contain marketplace business rules.
//
// The parent marketplace/application layer owns those concerns and supplies
// the resulting URLs and presentation configuration.
//
// -----------------------------------------------------------------------------
//
// Immutability
// -----------------------------------------------------------------------------
//
// The Public Marketplace hook exposes its composed result collection as:
//
//     readonly PublicMarketplaceItem[]
//
// MarketplaceResults therefore accepts the same readonly collection.
//
// The presentation layer has no reason to mutate marketplace items. Keeping
// the collection readonly preserves the immutable read-model contract from the
// marketplace composition boundary through to the result renderer.
// -----------------------------------------------------------------------------

import type { PublicMarketplaceItem } from '@/features/public-marketplace/models/public-marketplace-item';

import { DemandMarketplaceCard } from '@/components/landing/demands';
import { JourneyMarketplaceCard } from '@/components/landing/journeys';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface MarketplaceResultsProps {
  /**
   * Marketplace items to render.
   *
   * The collection may contain journeys, demands, or both depending on the
   * current marketplace query.
   *
   * The collection is intentionally readonly because this presentation
   * component never mutates the supplied marketplace read models.
   */
  items: readonly PublicMarketplaceItem[];

  /**
   * Resolves the public Journey detail URL.
   *
   * URL construction remains outside this presentation component.
   */
  getJourneyViewHref: (publicId: string) => string;

  /**
   * Optionally resolves the Journey booking URL.
   *
   * Returning undefined means the parent has determined that the Journey
   * should not expose a booking action.
   */
  getJourneyBookHref?: (
    publicId: string,
  ) => string | undefined;

  /**
   * Resolves the public Journey Demand detail URL.
   */
  getDemandViewHref: (publicId: string) => string;

  /**
   * Optionally resolves the Journey Demand participation URL.
   *
   * Returning undefined means the parent has determined that the Demand
   * should not expose a Join action.
   */
  getDemandJoinHref?: (
    publicId: string,
  ) => string | undefined;

  /**
   * Whether Journey provider profiles should be linked.
   */
  linkJourneyProviderToProfile?: boolean;

  /**
   * Whether Journey provider trust badges should be displayed.
   */
  showJourneyProviderTrustBadges?: boolean;

  /**
   * Whether Demand requester profiles should be linked.
   */
  linkDemandRequesterToProfile?: boolean;

  /**
   * Whether Demand requester trust badges should be displayed.
   */
  showDemandRequesterTrustBadges?: boolean;

  /**
   * Optional additional CSS classes.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Marketplace Results
// -----------------------------------------------------------------------------

export function MarketplaceResults({
  items,
  getJourneyViewHref,
  getJourneyBookHref,
  getDemandViewHref,
  getDemandJoinHref,
  linkJourneyProviderToProfile = true,
  showJourneyProviderTrustBadges = true,
  linkDemandRequesterToProfile = true,
  showDemandRequesterTrustBadges = true,
  className,
}: MarketplaceResultsProps) {
  return (
    <div
      className={[
        'grid',
        'min-w-0',
        'gap-5',
        'sm:grid-cols-2',
        'xl:grid-cols-3',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {items.map((item) => {
        switch (item.type) {
          // -----------------------------------------------------------------
          // Journey
          // -----------------------------------------------------------------

          case 'JOURNEY': {
            const journey = item.journey;

            return (
              <JourneyMarketplaceCard
                key={`journey-${journey.publicId}`}
                journey={journey}
                viewHref={getJourneyViewHref(
                  journey.publicId,
                )}
                bookHref={getJourneyBookHref?.(
                  journey.publicId,
                )}
                linkProviderToProfile={
                  linkJourneyProviderToProfile
                }
                showProviderTrustBadges={
                  showJourneyProviderTrustBadges
                }
              />
            );
          }

          // -----------------------------------------------------------------
          // Journey Demand
          // -----------------------------------------------------------------

          case 'DEMAND': {
            const demand = item.demand;

            return (
              <DemandMarketplaceCard
                key={`demand-${demand.publicId}`}
                demand={demand}
                viewHref={getDemandViewHref(
                  demand.publicId,
                )}
                joinHref={getDemandJoinHref?.(
                  demand.publicId,
                )}
                linkRequesterToProfile={
                  linkDemandRequesterToProfile
                }
                showRequesterTrustBadges={
                  showDemandRequesterTrustBadges
                }
              />
            );
          }

          // -----------------------------------------------------------------
          // Defensive fallback
          // -----------------------------------------------------------------

          default:
            return null;
        }
      })}
    </div>
  );
}
