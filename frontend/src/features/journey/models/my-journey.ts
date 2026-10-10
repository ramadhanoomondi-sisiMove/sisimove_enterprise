
// -----------------------------------------------------------------------------
// sisiMove — My Journey Model
// -----------------------------------------------------------------------------
//
// Authenticated provider-facing Journey projection.
//
// This is intentionally NOT a mirror of JourneyEntity or JourneyAggregate.
//
// The authenticated "my journeys" boundary exposes the Journey information
// required by the owning traveller to inspect and manage their journeys,
// while keeping persistence identifiers and aggregate implementation details
// outside the frontend.
//
// Unlike PublicJourney, this model includes Journey lifecycle state and
// lifecycle timestamps because those are relevant to authenticated Journey
// management.
//
// It does NOT include:
// - internal database IDs;
// - providerPublicId;
// - aggregate version;
// - domain events;
// - repository state;
// - domain behavior.
//
// -----------------------------------------------------------------------------

import type { JourneyStatus } from "./journey-status";
import type { JourneyRoute } from "./journey-route";
import type { JourneySchedule } from "./journey-schedule";
import type { JourneyVehicle } from "./journey-vehicle";
import type { JourneyCapacity } from "./journey-capacity";
import type { JourneyPricing } from "./journey-pricing";
import type { JourneyPreferences } from "./journey-preferences";
import type { JourneyAsset } from "./journey-asset";

import type { JourneyBooking } from "@/features/journey-booking";
import type { JourneyBoarding } from "@/features/journey-boarding/models";

// -----------------------------------------------------------------------------
// My Journey
// -----------------------------------------------------------------------------

export interface MyJourney {
  /**
   * Stable public identifier of the Journey.
   *
   * Used by authenticated Journey management routes and mutation endpoints.
   */
  readonly publicId: string;

  /**
   * Number of unread incoming messages associated with this Journey.
   *
   * Supplied by the backend's authenticated My Journeys response.
   * The frontend consumes this value rather than calculating unread messages
   * from conversation or message data.
   */
  readonly unreadMessagesCount: number;

  /**
   * Current Journey lifecycle status.
   */
  readonly status: JourneyStatus;

  /**
   * Timestamp at which the Journey was published.
   */
  readonly publishedAt: string | null;

  /**
   * Timestamp at which the Journey started.
   */
  readonly startedAt: string | null;

  /**
   * Timestamp at which completion was requested.
   */
  readonly completionRequestedAt: string | null;

  /**
   * Timestamp at which the Journey was completed.
   */
  readonly completedAt: string | null;

  /**
   * Timestamp at which the Journey was cancelled.
   */
  readonly cancelledAt: string | null;

  /**
   * Timestamp at which the Journey expired.
   */
  readonly expiredAt: string | null;

  /**
   * Journey route projection.
   *
   * Nullable because a Journey can exist as a progressively assembled Draft
   * before the required components have been attached.
   */
  readonly route: JourneyRoute | null;

  /**
   * Journey schedule.
   */
  readonly schedule: JourneySchedule | null;

  /**
   * Journey vehicle.
   */
  readonly vehicle: JourneyVehicle | null;

  /**
   * Journey passenger capacity.
   */
  readonly capacity: JourneyCapacity | null;

  /**
   * Journey pricing.
   */
  readonly pricing: JourneyPricing | null;

  /**
   * Optional Journey preferences.
   */
  readonly preferences: JourneyPreferences | null;

  /**
   * Journey-owned asset associations.
   */
  readonly assets: readonly JourneyAsset[];

  /**
   * Bookings associated with this Journey.
   */
  readonly bookings: readonly JourneyBooking[];

  /**
   * Boarding information, including participants and historical events.
   *
   * Null when no boarding aggregate exists for this Journey.
   */
  readonly boarding: JourneyBoarding | null;

  /**
   * Creation timestamp.
   */
  readonly createdAt: string;

  /**
   * Last update timestamp.
   */
  readonly updatedAt: string;
}
