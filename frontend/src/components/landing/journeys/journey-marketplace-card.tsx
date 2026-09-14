// -----------------------------------------------------------------------------
// sisiMove — Journey Marketplace Card
// -----------------------------------------------------------------------------
//
// Top-level presentation component for a public Journey marketplace card.
//
// The Journey is the primary supply object in the sisiMove marketplace.
// This component composes the Journey information into one scannable card:
//
//   Provider + Trust
//   Route
//   Journey Details
//   Marketplace Actions
//
// Availability is intentionally aligned with the actual PublicJourney model.
//
// PublicJourney currently exposes:
//
//   capacity.availableSeats
//
// It does not expose:
//
//   - isBookable
//   - bookingStatus
//   - journeyStatus
//   - isAvailable
//
// Therefore this component must not invent those concepts.
//
// The optional `bookHref` is the presentation-level signal that the parent
// marketplace composition wants to expose a booking destination. When it is
// omitted, the action component simply does not render the Book action.
//
// If the Journey has no available seats, the marketplace/application layer
// should omit `bookHref` rather than introducing booking business rules into
// this presentation component.
//
// This component deliberately does not:
// - fetch Journey data;
// - determine booking eligibility;
// - calculate availability;
// - perform booking checks;
// - resolve cross-domain references;
// - contain marketplace business logic.
//
// The parent marketplace/read boundary supplies:
//
//   - the complete PublicJourney read model;
//   - the public Journey detail URL;
//   - the optional booking URL.
//
// -----------------------------------------------------------------------------

import type { PublicJourney } from '@/features/journeys/models/public-journey';

import { Card } from '@/components/ui/card';

import { JourneyCardActions } from './journey-card-actions';
import { JourneyCardDetails } from './journey-card-details';
import { JourneyCardProvider } from './journey-card-provider';
import { JourneyCardRoute } from './journey-card-route';

export interface JourneyMarketplaceCardProps {
  journey: PublicJourney;

  /**
   * Public Journey detail destination.
   *
   * Every public Journey has a detail page, so viewing the Journey is always
   * represented by an enabled navigation action.
   */
  viewHref: string;

  /**
   * Optional booking destination.
   *
   * The parent supplies this only when the booking flow should be exposed.
   *
   * The card does not determine whether booking is allowed. In particular,
   * when `journey.capacity.availableSeats` is zero, the parent should omit
   * this value rather than relying on the card to enforce availability rules.
   */
  bookHref?: string;

  /**
   * Whether the provider's public profile should be linked.
   */
  linkProviderToProfile?: boolean;

  /**
   * Whether provider trust badges should be displayed.
   */
  showProviderTrustBadges?: boolean;

  className?: string;
}

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
        'flex h-full min-w-0 flex-col gap-5 p-5',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Provider                                                            */}
      {/* ------------------------------------------------------------------- */}

      <JourneyCardProvider
        provider={journey.provider}
        linkToProfile={linkProviderToProfile}
        showTrustBadges={showProviderTrustBadges}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Route                                                               */}
      {/* ------------------------------------------------------------------- */}

      <JourneyCardRoute route={journey.route} />

      {/* ------------------------------------------------------------------- */}
      {/* Journey details                                                     */}
      {/* ------------------------------------------------------------------- */}

      <JourneyCardDetails journey={journey} />

      {/* ------------------------------------------------------------------- */}
      {/* Marketplace actions                                                 */}
      {/* ------------------------------------------------------------------- */}

      <JourneyCardActions
        viewHref={viewHref}
        bookHref={bookHref}
        className="mt-auto pt-1"
      />
    </Card>
  );
}
