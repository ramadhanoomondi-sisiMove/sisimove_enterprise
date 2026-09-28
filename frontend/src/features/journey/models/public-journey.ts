// -----------------------------------------------------------------------------
// sisiMove — Public Journey Model
// -----------------------------------------------------------------------------
//
// Public marketplace projection of a Journey.
//
// This is intentionally NOT a mirror of the Journey aggregate/entity.
//
// The public Journey boundary composes:
// - Journey-owned public journey data;
// - public Traveller Profile data;
// - public Trust data.
//
// Internal Journey identifiers, providerPublicId, lifecycle timestamps,
// aggregate version, persistence identifiers, and other operational fields
// are intentionally excluded.
//
// This model represents the HTTP/read contract consumed by:
// - public Journey marketplace;
// - public Journey detail;
// - Journey cards;
// - Journey discovery surfaces.
//
// It does not contain mutation-specific fields or domain behavior.
// -----------------------------------------------------------------------------

import type { JourneyProvider } from "./journey-provider";
import type { JourneyRoute } from "./journey-route";
import type { JourneySchedule } from "./journey-schedule";
import type { JourneyVehicle } from "./journey-vehicle";
import type { JourneyCapacity } from "./journey-capacity";
import type { JourneyPricing } from "./journey-pricing";
import type { JourneyPreferences } from "./journey-preferences";
import type { JourneyAsset } from "./journey-asset";

// -----------------------------------------------------------------------------
// Public Journey
// -----------------------------------------------------------------------------

export interface PublicJourney {
  /**
   * Stable public identifier of the Journey.
   *
   * This is the identifier used by the public Journey route:
   *
   *     /journeys/[publicId]
   */
  readonly publicId: string;

  /**
   * Public provider projection.
   *
   * Contains the public traveller profile and public trust information.
   */
  readonly provider: JourneyProvider;

  /**
   * Journey route projection.
   */
  readonly route: JourneyRoute;

  /**
   * Journey travel schedule.
   */
  readonly schedule: JourneySchedule;

  /**
   * Vehicle associated with the Journey.
   */
  readonly vehicle: JourneyVehicle;

  /**
   * Journey passenger capacity.
   */
  readonly capacity: JourneyCapacity;

  /**
   * Journey pricing.
   */
  readonly pricing: JourneyPricing;

  /**
   * Optional Journey preferences.
   *
   * A Journey may be publicly available without a preferences component.
   */
  readonly preferences: JourneyPreferences | null;

  /**
   * Public Journey-owned asset associations.
   */
  readonly assets: readonly JourneyAsset[];
}