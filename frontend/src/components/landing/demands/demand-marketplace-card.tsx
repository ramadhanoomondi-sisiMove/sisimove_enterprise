// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Marketplace Card
// -----------------------------------------------------------------------------
//
// Horizontal marketplace listing for a public Journey Demand.
//
// A Journey Demand is the primary demand-side marketplace object in sisiMove.
//
// The card is intentionally a dense, horizontally scannable marketplace row.
// It is NOT a Journey Demand detail card.
//
// -----------------------------------------------------------------------------
// Responsive marketplace model
// -----------------------------------------------------------------------------
//
// The card remains HORIZONTAL at every viewport size.
//
// Mobile-first does NOT mean vertically stacking the marketplace sections.
//
// Instead, the complete row contracts as the available viewport width
// decreases:
//
//   Desktop
//
//   ┌──────┬──────────┬──────────┬────────────┬────────┐
//   │ DATE │ REQUESTER│ ROUTE    │ SUMMARY    │ ACTION │
//   └──────┴──────────┴──────────┴────────────┴────────┘
//
//   Tablet
//
//   ┌─────┬────────┬────────┬───────────┬───────┐
//   │DATE │REQUEST.│ ROUTE  │ SUMMARY   │ ACTION│
//   └─────┴────────┴────────┴───────────┴───────┘
//
//   Mobile
//
//   ┌────┬──────┬──────┬────────┬─────┐
//   │DATE│REQ.  │ROUTE │SUMMARY │ACT. │
//   └────┴──────┴──────┴────────┴─────┘
//
// The card therefore:
//
// - remains horizontal;
// - never becomes a vertically stacked card;
// - never requires horizontal page scrolling;
// - does not depend on fixed desktop widths;
// - allows each marketplace column to contract naturally.
//
// Flex ratios preserve the relative importance of each section.
//
// -----------------------------------------------------------------------------
// Proportional density
// -----------------------------------------------------------------------------
//
// The marketplace card is treated as one visual composition.
//
// Responsive density therefore contracts uniformly:
//
//   Mobile → smallest density
//   SM     → compact density
//   MD     → comfortable density
//   LG     → full density
//
// The card shell owns the OUTER responsive density:
//
//   Mobile   px-1   py-1
//   SM       px-1.5 py-1.5
//   MD       px-2   py-2
//   LG       px-3   py-2.5
//
// Individual child components own their internal presentation, but they must
// remain compatible with this density model.
//
// The parent deliberately does not compensate for individual children with
// large desktop-only padding.
//
// This prevents the marketplace row from becoming horizontally narrow while
// remaining unnecessarily tall.
//
// -----------------------------------------------------------------------------
// Marketplace presentation model
// -----------------------------------------------------------------------------
//
// The listing communicates:
//
//   WHEN
//     DemandCardDate
//
//   WHO
//     DemandCardRequester
//
//   WHERE
//     DemandCardRoute
//
//   WHAT IS NEEDED
//     DemandCardSummary
//
//   WHAT CAN I DO
//     DemandCardActions
//
// The card intentionally excludes detailed Demand information that belongs
// on the public Demand detail page.
//
// -----------------------------------------------------------------------------
// Architecture boundary
// -----------------------------------------------------------------------------
//
// Journey Demand remains the primary Demand-side marketplace/domain object.
//
// Requester Traveller and Trust information is public read-side enrichment
// exposed through `demand.requester`.
//
// Participants are already represented by the public Demand read model.
//
// This component does not:
//
// - fetch Demand data;
// - resolve public IDs;
// - build URLs;
// - determine join eligibility;
// - perform matching;
// - calculate Demand capacity;
// - mutate the Demand;
// - create a second Demand model;
// - introduce marketplace business rules.
//
// The marketplace/application boundary supplies the composed public Demand
// read model and navigation destinations.
//
// -----------------------------------------------------------------------------
// Navigation boundary
// -----------------------------------------------------------------------------
//
// `viewHref` and `joinHref` are presentation-level navigation destinations.
//
// This component does not decide whether a Demand can be joined.
//
// If `joinHref` is absent, DemandCardActions determines how the Join action
// should be presented.
//
// `viewDisabled` and `joinDisabled` are explicit presentation inputs and are
// simply forwarded to the action component.
//
// -----------------------------------------------------------------------------
// Layout responsibility
// -----------------------------------------------------------------------------
//
// DemandMarketplaceCard
//   ├── DemandCardDate
//   ├── DemandCardRequester
//   ├── DemandCardRoute
//   ├── DemandCardSummary
//   └── DemandCardActions
//
// This composition root owns:
//
// - horizontal positioning;
// - proportional marketplace column sizing;
// - section separators;
// - responsive density.
//
// Each child remains responsible for rendering its own public Demand slice.
//
// -----------------------------------------------------------------------------
// Responsive sizing
// -----------------------------------------------------------------------------
//
// Column ratios:
//
//   Date       0.8
//   Requester  1.4
//   Route      1.6
//   Summary    1.4
//   Actions    1.1
//
// Route receives the largest share because origin → destination is the most
// important discovery information for a Demand.
//
// Date is intentionally compact because DemandCardDate already communicates
// the flexible departure window.
//
// -----------------------------------------------------------------------------
// CSS token policy
// -----------------------------------------------------------------------------
//
// Only existing sisiMove design tokens are used.
//
// No generic/nonexistent tokens such as:
//
//   --primary
//   --primary-foreground
//   --ring
//   --background-secondary
//
// are introduced here.
//
// -----------------------------------------------------------------------------

import type { PublicJourneyDemand } from '@/features/journey-demands/models';

import { Card } from '@/components/ui/card';

import { DemandCardActions } from './demand-card-actions';
import { DemandCardDate } from './demand-card-date';
import { DemandCardRequester } from './demand-card-requester';
import { DemandCardRoute } from './demand-card-route';
import { DemandCardSummary } from './demand-card-summary';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface DemandMarketplaceCardProps {
  /**
   * Public Journey Demand read model.
   *
   * Journey Demand remains the primary marketplace/domain object.
   */
  readonly demand: PublicJourneyDemand;

  /**
   * URL to the public Demand detail page.
   *
   * URL construction belongs to the marketplace/application boundary.
   */
  readonly viewHref: string;

  /**
   * Optional URL for joining the Demand.
   *
   * This component does not determine join eligibility.
   */
  readonly joinHref?: string;

  /**
   * Whether the requester's public Traveller profile should be linked.
   */
  readonly linkToRequesterProfile?: boolean;

  /**
   * Whether requester trust badges should be displayed.
   */
  readonly showTrustBadges?: boolean;

  /**
   * Whether View navigation is disabled.
   */
  readonly viewDisabled?: boolean;

  /**
   * Whether Join navigation is disabled.
   */
  readonly joinDisabled?: boolean;

  /**
   * Optional presentation class supplied by the marketplace result stream.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Responsive marketplace section density
// -----------------------------------------------------------------------------
//
// Every marketplace column uses the same outer density.
//
// This is intentionally centralized.
//
// We do not want:
//
//   Date       → compact
//   Requester  → medium
//   Route      → large
//   Summary    → medium
//   Actions    → desktop-sized
//
// The marketplace row is one visual composition, so its outer spacing
// contracts uniformly.
//
// -----------------------------------------------------------------------------

const MARKETPLACE_SECTION = [
  'flex',
  'min-w-0',

  // ---------------------------------------------------------------------------
  // Horizontal density
  // ---------------------------------------------------------------------------
  //
  // The available width contracts naturally through the flex ratios. Padding
  // contracts with it so horizontal whitespace does not consume a
  // disproportionate amount of the mobile card.
  //
  'px-1',
  'sm:px-1.5',
  'md:px-2',
  'lg:px-3',

  // ---------------------------------------------------------------------------
  // Vertical density
  // ---------------------------------------------------------------------------
  //
  // This is deliberately tighter than the previous py-2 → py-4 progression.
  //
  // The marketplace is a dense discovery surface. Detail-page-level vertical
  // spacing belongs on the Demand detail page.
  //
  'py-1',
  'sm:py-1.5',
  'md:py-2',
  'lg:py-2.5',
].join(' ');

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function DemandMarketplaceCard({
  demand,
  viewHref,
  joinHref,
  linkToRequesterProfile = true,
  showTrustBadges = true,
  viewDisabled = false,
  joinDisabled = false,
  className,
}: DemandMarketplaceCardProps) {
  return (
    <Card
      className={[
        // -------------------------------------------------------------------
        // Card shell
        // -------------------------------------------------------------------
        //
        // The marketplace result stream determines the available width.
        //
        // The card consumes that width without establishing a fixed minimum
        // width and without introducing horizontal scrolling.
        //
        'w-full',
        'min-w-0',
        'overflow-hidden',
        'p-0',

        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={[
          // -----------------------------------------------------------------
          // Marketplace row
          // -----------------------------------------------------------------
          //
          // IMPORTANT:
          //
          // This remains horizontal at ALL viewport sizes.
          //
          // There is intentionally no `flex-col`.
          //
          'flex',
          'w-full',
          'min-w-0',
          'items-stretch',
        ].join(' ')}
      >
        {/* ----------------------------------------------------------------- */}
        {/* Requested schedule                                                */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={[
            MARKETPLACE_SECTION,

            // Date remains the narrowest information column.
            'flex-[0.8]',
          ].join(' ')}
        >
          <DemandCardDate
            schedule={demand.schedule}
            className="w-full min-w-0"
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Requester                                                         */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={[
            MARKETPLACE_SECTION,

            // Requester communicates WHO is looking for travel.
            'flex-[1.4]',

            'border-l',
            'border-[var(--border-subtle)]',
          ].join(' ')}
        >
          <DemandCardRequester
            requester={demand.requester}
            linkToProfile={linkToRequesterProfile}
            showTrustBadges={showTrustBadges}
            className="w-full min-w-0"
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Requested route                                                   */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={[
            MARKETPLACE_SECTION,

            // Route receives the largest proportional share because
            // origin → destination is the primary discovery information.
            'flex-[1.6]',

            'border-l',
            'border-[var(--border-subtle)]',
          ].join(' ')}
        >
          <DemandCardRoute
            route={demand.route}
            className="w-full min-w-0"
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Demand summary                                                    */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={[
            MARKETPLACE_SECTION,

            // Summary communicates the compact demand-side commercial and
            // capacity context.
            'flex-[1.4]',

            'border-l',
            'border-[var(--border-subtle)]',
          ].join(' ')}
        >
          <DemandCardSummary
            capacity={demand.capacity}
            pricing={demand.pricing}
            participants={demand.participants}
            status={demand.status}
            className="w-full min-w-0"
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Actions                                                           */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={[
            MARKETPLACE_SECTION,

            // Actions remain visible as part of the same horizontal row.
            'flex-[1.1]',

            'border-l',
            'border-[var(--border-subtle)]',
          ].join(' ')}
        >
          <DemandCardActions
            viewHref={viewHref}
            joinHref={joinHref}
            viewDisabled={viewDisabled}
            joinDisabled={joinDisabled}
            className="w-full min-w-0"
          />
        </div>
      </div>
    </Card>
  );
}