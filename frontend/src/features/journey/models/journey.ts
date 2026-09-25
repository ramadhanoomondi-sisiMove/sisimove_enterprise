// -----------------------------------------------------------------------------
// sisiMove — Journey Model
// -----------------------------------------------------------------------------
//
// Frontend representation of the Journey aggregate and its composed Journey
// components.
//
// This model intentionally contains only externally consumable Journey data.
// It does not mirror the Prisma persistence model and does not expose internal
// database identifiers.
//
// IMPORTANT:
//
// Public marketplace responses must be mapped through the public Journey
// mapper before reaching UI components. In particular, `providerPublicId`
// belongs only to authenticated management representations and must never be
// rendered as part of the public marketplace contract.
//
// Component resources remain independently addressable through their public
// identifiers.
//
// -----------------------------------------------------------------------------

import type { JourneyAsset } from './journey-asset';
import type { JourneyCapacity } from './journey-capacity';
import type { JourneyCorridor } from './journey-corridor';
import type { JourneyPreferences } from './journey-preferences';
import type { JourneyPricing } from './journey-pricing';
import type { JourneySchedule } from './journey-schedule';
import type { JourneyStatus } from './journey-status';
import type { JourneyVehicle } from './journey-vehicle';

/**
 * Journey aggregate representation used by authenticated Journey management
 * surfaces.
 */
export interface Journey {
  /**
   * Public identifier of the Journey.
   */
  publicId: string;

  /**
   * Public identifier of the authenticated Journey provider.
   *
   * This field is management-only and must not be exposed through public
   * marketplace presentation models.
   */
  providerPublicId: string;

  /**
   * Current lifecycle status of the Journey.
   */
  status: JourneyStatus;

  /**
   * Timestamp at which the Journey was published, when available.
   */
  publishedAt?: string | null;

  /**
   * Timestamp at which the Journey started, when available.
   */
  startedAt?: string | null;

  /**
   * Timestamp at which completion was requested, when available.
   */
  completionRequestedAt?: string | null;

  /**
   * Timestamp at which the Journey was completed, when available.
   */
  completedAt?: string | null;

  /**
   * Timestamp at which the Journey was cancelled, when available.
   */
  cancelledAt?: string | null;

  /**
   * Timestamp at which the Journey expired, when available.
   */
  expiredAt?: string | null;

  /**
   * Aggregate version returned by the API, when available.
   */
  version?: number;

  /**
   * Geographic corridor attached to the Journey.
   */
  corridor?: JourneyCorridor | null;

  /**
   * Schedule attached to the Journey.
   */
  schedule?: JourneySchedule | null;

  /**
   * Vehicle attached to the Journey.
   */
  vehicle?: JourneyVehicle | null;

  /**
   * Passenger capacity attached to the Journey.
   */
  capacity?: JourneyCapacity | null;

  /**
   * Pricing attached to the Journey.
   */
  pricing?: JourneyPricing | null;

  /**
   * Journey environment and travel policies.
   */
  preferences?: JourneyPreferences | null;

  /**
   * Assets attached to the Journey.
   */
  assets: JourneyAsset[];

  /**
   * Creation timestamp returned by the API, when available.
   */
  createdAt?: string;

  /**
   * Last update timestamp returned by the API, when available.
   */
  updatedAt?: string;
}