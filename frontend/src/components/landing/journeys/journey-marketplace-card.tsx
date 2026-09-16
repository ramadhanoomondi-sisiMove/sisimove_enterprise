// -----------------------------------------------------------------------------
// sisiMove — Journey Marketplace Card
// -----------------------------------------------------------------------------
//
// Top-level presentation component for a public Journey marketplace listing.
//
// A Journey is the primary supply object in the sisiMove marketplace.
//
// The marketplace card intentionally presents the Journey as a dense,
// horizontally scannable listing rather than as a detail-summary card.
//
// -----------------------------------------------------------------------------
// Responsive marketplace model
// -----------------------------------------------------------------------------
//
// The card is MOBILE-FIRST, but "mobile-first" does NOT mean stacking.
//
// The marketplace row remains horizontal at every viewport size:
//
//   DATE → PROVIDER → ROUTE → VEHICLE → PRICE → ACTIONS
//
// The row NEVER:
//
//   - stacks vertically;
//   - introduces horizontal page scrolling;
//   - requires a fixed desktop width;
//   - hides marketplace columns because the viewport is smaller.
//
// Instead, the complete composition contracts horizontally AND vertically.
//
// -----------------------------------------------------------------------------
// Proportional density
// -----------------------------------------------------------------------------
//
// Responsive behavior is treated as one visual system.
//
// As the available viewport contracts:
//
//   - section padding contracts;
//   - typography contracts through child presentation components;
//   - images contract through child presentation components;
//   - action controls contract through child presentation components;
//   - internal gaps contract;
//   - the overall card remains a single horizontal composition.
//
// The marketplace row itself always remains horizontal.
//
// -----------------------------------------------------------------------------
// Architecture boundary
// -----------------------------------------------------------------------------
//
// Journey remains the primary marketplace/domain object.
//
// Public Traveller and Trust information is read-side enrichment exposed
// through `journey.provider`.
//
// The Journey marketplace card does not:
//
// - fetch Journey data;
// - resolve cross-domain references;
// - determine booking eligibility;
// - calculate availability;
// - perform booking checks;
// - contain marketplace business rules;
// - create a second Journey model;
// - transform Journey domain concepts into unrelated concepts.
//
// The card consumes the already-composed PublicJourney read model.
//
// -----------------------------------------------------------------------------
// Marketplace presentation model
// -----------------------------------------------------------------------------
//
// The listing communicates:
//
//   WHEN
//     JourneyCardDate
//
//   WHO
//     JourneyCardProvider
//
//   WHERE
//     JourneyCardRoute
//
//   WHAT VEHICLE
//     JourneyCardVehicle
//
//   HOW MUCH / HOW MANY SEATS
//     JourneyCardPrice
//
//   WHAT CAN I DO
//     JourneyCardActions
//
// Each child owns only the presentation of its corresponding Journey slice.
//
// -----------------------------------------------------------------------------
// Booking boundary
// -----------------------------------------------------------------------------
//
// `bookHref` is the presentation-level signal supplied by the marketplace
// read boundary.
//
// This component does not determine whether a Journey is bookable.
//
// If `bookHref` is absent, JourneyCardActions does not render Book.
//
// -----------------------------------------------------------------------------
// Layout responsibility
// -----------------------------------------------------------------------------
//
// JourneyMarketplaceCard
//   ├── JourneyCardDate
//   ├── JourneyCardProvider
//   ├── JourneyCardRoute
//   ├── JourneyCardVehicle
//   ├── JourneyCardPrice
//   └── JourneyCardActions
//
// The card shell owns:
//
//   - horizontal section positioning;
//   - responsive section sizing;
//   - vertical separators;
//   - responsive density;
//   - the shared row height.
//
// Each child owns its own public Journey slice.
//
// -----------------------------------------------------------------------------
// Responsive section sizing
// -----------------------------------------------------------------------------
//
// Flex ratios preserve the relative importance of each marketplace section:
//
//   Date       0.8
//   Provider   1.4
//   Route      1.6
//   Vehicle    1.4
//   Price      0.9
//   Actions    1.1
//
// No section receives a fixed desktop width.
//
// -----------------------------------------------------------------------------
// Action positioning
// -----------------------------------------------------------------------------
//
// The action column is intentionally treated differently from the information
// columns.
//
// Information columns:
//
//   Date / Provider / Route / Vehicle / Price
//
// communicate marketplace information.
//
// The Actions column:
//
//   View / Book
//
// is an interaction zone.
//
// The wrapper therefore fills the shared row height and the child action
// component aligns its controls toward the bottom of that available space.
//
// No fixed card height is introduced.
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

import type { PublicJourney } from '@/features/journeys/models/public-journey';

import { Card } from '@/components/ui/card';

import { JourneyCardActions } from './journey-card-actions';
import { JourneyCardDate } from './journey-card-date';
import { JourneyCardPrice } from './journey-card-price';
import { JourneyCardProvider } from './journey-card-provider';
import { JourneyCardRoute } from './journey-card-route';
import { JourneyCardVehicle } from './journey-card-vehicle';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyMarketplaceCardProps {
  /**
   * Complete public Journey read model.
   *
   * Journey remains the primary marketplace object.
   */
  readonly journey: PublicJourney;

  /**
   * Public Journey detail destination.
   */
  readonly viewHref: string;

  /**
   * Optional booking destination.
   *
   * The parent/read boundary supplies this only when the booking flow should
   * be exposed.
   */
  readonly bookHref?: string;

  /**
   * Whether the provider's public Traveller profile should be linked.
   */
  readonly linkProviderToProfile?: boolean;

  /**
   * Whether provider trust badges should be displayed.
   */
  readonly showProviderTrustBadges?: boolean;

  /**
   * Optional additional classes supplied by the marketplace result stream.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Shared marketplace section classes
// -----------------------------------------------------------------------------
//
// Every marketplace column receives:
//
//   - min-width protection;
//   - responsive horizontal padding;
//   - responsive vertical padding.
//
// The parent owns this outer density.
//
// Child components therefore must not duplicate marketplace-level padding.
//
// -----------------------------------------------------------------------------

const SECTION_BASE = [
  'min-w-0',
  'border-[var(--border-subtle)]',

  // ---------------------------------------------------------------------------
  // Responsive horizontal density
  // ---------------------------------------------------------------------------

  'px-1',
  'sm:px-1.5',
  'md:px-2',
  'lg:px-3',

  // ---------------------------------------------------------------------------
  // Responsive vertical density
  // ---------------------------------------------------------------------------

  'py-1',
  'sm:py-1.5',
  'md:py-2',
  'lg:py-2.5',
].join(' ');

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyMarketplaceCard({
  journey,
  viewHref,
  bookHref,
  linkProviderToProfile = true,
  showProviderTrustBadges = true,
  className,
}: JourneyMarketplaceCardProps) {
  return (
    <Card
      className={[
        // -------------------------------------------------------------------
        // Card shell
        // -------------------------------------------------------------------
        //
        // The result stream determines the available width.
        //
        // The card consumes that width completely. It does not establish a
        // fixed minimum width and does not create horizontal page scrolling.
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
          // This remains horizontal at every viewport size.
          //
          // There is deliberately no `flex-col`.
          //
          'flex',
          'w-full',
          'min-w-0',
          'items-stretch',
        ].join(' ')}
      >
        {/* ----------------------------------------------------------------- */}
        {/* Date                                                              */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={[
            SECTION_BASE,
            'flex',
            'min-w-0',
            'flex-[0.8]',
          ].join(' ')}
        >
          <JourneyCardDate
            departureAt={journey.schedule.departureAt}
            className="w-full min-w-0"
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Provider                                                          */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={[
            SECTION_BASE,
            'flex',
            'min-w-0',
            'flex-[1.4]',
            'border-l',
          ].join(' ')}
        >
          <JourneyCardProvider
            provider={journey.provider}
            linkToProfile={linkProviderToProfile}
            showTrustBadges={showProviderTrustBadges}
            className="w-full min-w-0"
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Route                                                             */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={[
            SECTION_BASE,
            'flex',
            'min-w-0',
            'flex-[1.6]',
            'border-l',
          ].join(' ')}
        >
          <JourneyCardRoute
            route={journey.route}
            className="w-full min-w-0"
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Vehicle                                                           */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={[
            SECTION_BASE,
            'flex',
            'min-w-0',
            'flex-[1.4]',
            'border-l',
          ].join(' ')}
        >
          <JourneyCardVehicle
            make={journey.vehicle.make}
            model={journey.vehicle.model}
            year={journey.vehicle.year}
            color={journey.vehicle.color}
            asset={journey.vehicle.asset}
            className="w-full min-w-0"
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Price / Seats                                                     */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={[
            SECTION_BASE,
            'flex',
            'min-w-0',
            'flex-[0.9]',
            'border-l',
          ].join(' ')}
        >
          <JourneyCardPrice
            amount={journey.pricing.amount}
            currency={journey.pricing.currency}
            availableSeats={journey.capacity.availableSeats}
            bookedSeats={journey.capacity.bookedSeats}
            totalSeats={journey.capacity.totalSeats}
            className="w-full min-w-0"
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Actions                                                           */}
        {/* ----------------------------------------------------------------- */}
        {/*
         * The action section is itself a flex container so it can fill the
         * shared marketplace row height.
         *
         * JourneyCardActions then uses `justify-end` internally, which places
         * View / Book toward the bottom of the card.
         *
         * This is intentionally NOT a fixed-height solution.
         */}
        <div
          className={[
            SECTION_BASE,
            'flex',
            'min-w-0',
            'flex-[1.1]',
            'border-l',
          ].join(' ')}
        >
          <JourneyCardActions
            viewHref={viewHref}
            bookHref={bookHref}
            className="w-full min-w-0"
          />
        </div>
      </div>
    </Card>
  );
}