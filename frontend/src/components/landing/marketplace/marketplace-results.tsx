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
// uses the item's `type` discriminator to select the appropriate presentation
// component:
//
// - JOURNEY → JourneyMarketplaceCard
// - DEMAND  → DemandMarketplaceCard
//
// -----------------------------------------------------------------------------
// RESULT LAYOUT
// -----------------------------------------------------------------------------
//
// Each marketplace item occupies one complete horizontal result row.
//
// The collection is rendered as a single vertical stream:
//
//     Journey 1
//     Journey 2
//     Demand 1
//     Journey 3
//     Demand 2
//
// This component deliberately does not use a multi-column grid. A grid would
// cause multiple marketplace items to appear beside one another, which is not
// the intended marketplace browsing experience.
//
// The individual JourneyMarketplaceCard and DemandMarketplaceCard components
// are responsible for the internal presentation of one marketplace item.
//
// This component is responsible only for stacking those items vertically and
// selecting the correct feature-domain presentation component.
// -----------------------------------------------------------------------------
//
// RESPONSIBILITIES
// -----------------------------------------------------------------------------
//
// This component:
//
// - renders marketplace items;
// - selects the correct card from the item discriminator;
// - preserves the order supplied by the parent;
// - receives presentation URLs from the parent;
// - renders Journey and Journey Demand in one marketplace stream;
// - preserves the independence of Journey and Journey Demand.
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
// -----------------------------------------------------------------------------
//
// IMMUTABILITY
// -----------------------------------------------------------------------------
//
// The marketplace collection is a public read-model collection.
//
// MarketplaceResults therefore accepts:
//
//     readonly PublicMarketplaceItem[]
//
// The presentation layer never mutates marketplace items. Keeping the
// collection readonly preserves the immutable read-model contract from the
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
   * The collection may contain Journeys, Demands, or both depending on the
   * current marketplace query.
   *
   * The collection is intentionally readonly because this presentation
   * component never mutates the supplied marketplace read models.
   */
  readonly items: readonly PublicMarketplaceItem[];

  /**
   * Resolves the public Journey detail URL.
   *
   * URL construction remains outside this presentation component.
   */
  readonly getJourneyViewHref: (
    publicId: string,
  ) => string;

  /**
   * Optionally resolves the Journey booking URL.
   *
   * Returning undefined means the parent has determined that the Journey
   * should not expose a booking action.
   */
  readonly getJourneyBookHref?: (
    publicId: string,
  ) => string | undefined;

  /**
   * Resolves the public Journey Demand detail URL.
   */
  readonly getDemandViewHref: (
    publicId: string,
  ) => string;

  /**
   * Optionally resolves the Journey Demand participation URL.
   *
   * Returning undefined means the parent has determined that the Demand
   * should not expose a Join action.
   */
  readonly getDemandJoinHref?: (
    publicId: string,
  ) => string | undefined;

  /**
   * Whether Journey provider profiles should be linked.
   */
  readonly linkJourneyProviderToProfile?: boolean;

  /**
   * Whether Journey provider trust information/badges should be displayed.
   */
  readonly showJourneyProviderTrustBadges?: boolean;

  /**
   * Whether Journey Demand requester profiles should be linked.
   */
  readonly linkDemandRequesterToProfile?: boolean;

  /**
   * Whether Journey Demand requester trust information/badges should be
   * displayed.
   */
  readonly showDemandRequesterTrustBadges?: boolean;

  /**
   * Optional additional CSS classes.
   */
  readonly className?: string;
}


// -----------------------------------------------------------------------------
// Exhaustiveness helper
// -----------------------------------------------------------------------------
//
// PublicMarketplaceItem is a discriminated union.
//
// Keeping this helper here means that adding another marketplace item type
// requires this renderer to be updated.
//
// This is preferable to silently returning `null`, because an unhandled
// marketplace type should become a compile-time architecture signal.
// -----------------------------------------------------------------------------

function assertNever(
  value: never,
): never {
  throw new Error(
    `Unsupported marketplace item type: ${String(value)}`,
  );
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
        // -------------------------------------------------------------------
        // Result stream
        // -------------------------------------------------------------------
        //
        // The marketplace collection is intentionally a vertical stream.
        //
        // Each child card owns its own horizontal responsive layout.
        //
        // `min-w-0` is important because the child cards contain route,
        // traveller, vehicle, pricing and action content that must be allowed
        // to shrink with the available viewport.
        //
        'flex',
        'min-w-0',
        'flex-col',
        'gap-4',

        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {items.map((item) => {
        // -------------------------------------------------------------------
        // Journey
        // -------------------------------------------------------------------

        switch (item.type) {
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
                linkToRequesterProfile={
                  linkDemandRequesterToProfile
                }
                showTrustBadges={
                  showDemandRequesterTrustBadges
                }
              />
            );
          }

          // -----------------------------------------------------------------
          // Defensive / exhaustive branch
          // -----------------------------------------------------------------
          //
          // If PublicMarketplaceItem gains another discriminator, TypeScript
          // will report an error here because `item.type` will no longer be
          // narrowed to `never`.
          //
          // This prevents a newly introduced marketplace feature from being
          // silently omitted from the public marketplace.
          // -----------------------------------------------------------------

          default:
            return assertNever(item);
        }
      })}
    </div>
  );
}