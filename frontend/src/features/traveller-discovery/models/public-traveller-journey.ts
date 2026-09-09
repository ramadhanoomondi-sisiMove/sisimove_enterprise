// -----------------------------------------------------------------------------
// Public Traveller Journey
// -----------------------------------------------------------------------------
//
// Public representation of a Journey displayed as traveller activity.
//
// This model is NOT the Journey domain entity and must never mirror the
// persistence model.
//
// It contains only public decision-support information:
//
// - route
// - schedule
// - vehicle summary
// - price
// - seat availability
//
// Private information such as exact pickup coordinates, booking information,
// provider identity IDs, registration numbers, financial information, and
// internal lifecycle metadata must never be exposed here.
//
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------

import type { PublicTravellerVehicle } from './public-traveller-vehicle';


// -----------------------------------------------------------------------------
// Public Traveller Journey Route
// -----------------------------------------------------------------------------

/**
 * Public route summary for a traveller journey.
 *
 * This represents the route information approved for anonymous public
 * discovery. It does not expose private pickup or drop-off locations.
 */
export interface PublicTravellerJourneyRoute {
  /**
   * Publicly displayable origin name.
   */
  origin: string;

  /**
   * Publicly displayable destination name.
   */
  destination: string;
}


// -----------------------------------------------------------------------------
// Public Traveller Journey Schedule
// -----------------------------------------------------------------------------

/**
 * Public journey schedule.
 *
 * All timestamps are represented as ISO-8601 strings and must be interpreted
 * using the supplied IANA timezone.
 */
export interface PublicTravellerJourneySchedule {
  /**
   * ISO-8601 departure date/time.
   */
  departureAt: string;

  /**
   * ISO-8601 expected arrival date/time.
   *
   * Null when no public expected arrival time is available.
   */
  arrivalAt: string | null;

  /**
   * IANA timezone identifier used when presenting the schedule.
   *
   * Example:
   *
   * Africa/Nairobi
   */
  timezone: string;
}


// -----------------------------------------------------------------------------
// Public Traveller Journey Pricing
// -----------------------------------------------------------------------------

/**
 * Public journey price.
 *
 * The amount uses integer minor units, consistent with the SisiMove public
 * Journey pricing contract.
 *
 * Example:
 *
 * - 150000 minor units
 * - KES
 *
 * The frontend must use the appropriate currency formatter when displaying
 * this value and must not perform financial calculations based on an
 * assumed currency exponent.
 */
export interface PublicTravellerJourneyPricing {
  /**
   * Price for one seat in integer minor units.
   */
  amount: number;

  /**
   * ISO 4217 currency code.
   *
   * Example:
   *
   * KES
   */
  currency: string;
}


// -----------------------------------------------------------------------------
// Public Traveller Journey Availability
// -----------------------------------------------------------------------------

/**
 * Public seat-availability summary.
 *
 * Availability is a server-authoritative read-model projection.
 * The frontend must display the supplied values and must not derive
 * availability by independently inspecting bookings or other data.
 */
export interface PublicTravellerJourneyAvailability {
  /**
   * Total number of seats made available for the journey.
   */
  totalSeats: number;

  /**
   * Number of seats currently available for booking.
   */
  availableSeats: number;
}


// -----------------------------------------------------------------------------
// Public Traveller Journey
// -----------------------------------------------------------------------------

/**
 * Public journey representation displayed as traveller activity.
 *
 * This is a public read-model contract, not a Journey domain entity.
 *
 * The object contains only information required by anonymous users to
 * evaluate a publicly discoverable journey.
 */
export interface PublicTravellerJourney {
  /**
   * Opaque public journey identifier.
   *
   * This must never be an internal database identifier.
   */
  publicId: string;

  /**
   * Public route summary.
   */
  route: PublicTravellerJourneyRoute;

  /**
   * Public journey schedule.
   */
  schedule: PublicTravellerJourneySchedule;

  /**
   * Public vehicle summary.
   *
   * Null when no vehicle information is currently eligible for public
   * display.
   */
  vehicle: PublicTravellerVehicle | null;

  /**
   * Public seat-availability summary.
   *
   * The backend public projection is authoritative.
   */
  availability: PublicTravellerJourneyAvailability;

  /**
   * Public price per seat.
   */
  pricing: PublicTravellerJourneyPricing;
}