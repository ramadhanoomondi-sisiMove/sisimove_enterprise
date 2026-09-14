// -----------------------------------------------------------------------------
// sisiMove — Public Journey
// -----------------------------------------------------------------------------
//
// Primary public read model for the Journey marketplace.
//
// IMPORTANT:
//
// This is NOT a frontend mirror of the Prisma Journey model.
//
// The backend Journey aggregate is responsible for:
// - persistence
// - Journey lifecycle
// - Journey-domain relationships
// - business rules
// - state transitions
//
// PublicJourney is a marketplace read model.
//
// It contains the information a visitor needs to understand and discover a
// published Journey:
//
// - who is providing it
// - why that traveller can be trusted
// - where the Journey goes
// - when it departs
// - what vehicle is being used
// - how many seats remain
// - what the Journey costs
// - what traveller preferences apply
// - which public assets are available
//
// -----------------------------------------------------------------------------
//
// Public composition:
//
// PublicJourney
// ├── provider
// │   ├── traveller
// │   └── trust
// ├── route
// ├── schedule
// ├── vehicle
// ├── capacity
// ├── pricing
// ├── preferences
// └── assets
//
// -----------------------------------------------------------------------------
//
// Deliberately excluded:
//
// - Journey.id
// - provider Identity.publicId
// - internal child-entity IDs
// - booking information
// - passenger identities
// - financial settlement information
// - internal lifecycle timestamps
// - moderation information
// - internal Asset storage information
// - Trust events
// - internal operational metadata
// -----------------------------------------------------------------------------

import type { PublicJourneyAsset } from "./public-journey-asset";
import type { PublicJourneyCapacity } from "./public-journey-capacity";
import type { PublicJourneyPreferences } from "./public-journey-preferences";
import type { PublicJourneyPricing } from "./public-journey-pricing";
import type { PublicJourneyProvider } from "./public-journey-provider";
import type { PublicJourneyRoute } from "./public-journey-route";
import type { PublicJourneySchedule } from "./public-journey-schedule";
import type { PublicJourneyVehicle } from "./public-journey-vehicle";

export interface PublicJourney {
  /**
   * Stable public identifier used by public Journey URLs.
   *
   * Example:
   *
   * /journeys/{publicId}
   */
  publicId: string;

  /**
   * Public traveller identity together with public trust information.
   */
  provider: PublicJourneyProvider;

  /**
   * Origin, destination, and intermediate waypoints.
   */
  route: PublicJourneyRoute;

  /**
   * Departure and optional arrival information.
   */
  schedule: PublicJourneySchedule;

  /**
   * Vehicle associated with this Journey.
   */
  vehicle: PublicJourneyVehicle;

  /**
   * Current passenger-seat availability.
   */
  capacity: PublicJourneyCapacity;

  /**
   * Public price per seat.
   */
  pricing: PublicJourneyPricing;

  /**
   * Conditions and preferences associated with the Journey.
   */
  preferences: PublicJourneyPreferences;

  /**
   * Public Journey media and assets.
   */
  assets: PublicJourneyAsset[];
}