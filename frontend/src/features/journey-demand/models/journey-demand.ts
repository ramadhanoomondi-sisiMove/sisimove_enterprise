// -----------------------------------------------------------------------------
// sisiMove — Journey Demand
// -----------------------------------------------------------------------------
//
// Primary frontend/API representation of the JourneyDemand aggregate.
//
// This model intentionally represents public/API-facing data rather than the
// Prisma persistence model.
//
// Internal database identifiers are not exposed.
//
// Cross-domain references remain opaque public IDs:
//
//     requesterPublicId
//     matchedJourneyPublicId
//
// Aggregate components are represented as nested optional/null components.
//
// -----------------------------------------------------------------------------

import type { JourneyDemandCapacity } from './journey-demand-capacity';
import type { JourneyDemandCorridor } from './journey-demand-corridor';
import type { JourneyDemandParticipant } from './journey-demand-participant';
import type { JourneyDemandPricing } from './journey-demand-pricing';
import type { JourneyDemandSchedule } from './journey-demand-schedule';
import type { JourneyDemandStatus } from './journey-demand-status';

export interface JourneyDemand {
  /**
   * Public identifier of the JourneyDemand aggregate.
   */
  publicId: string;

  /**
   * Public identity identifier of the requester.
   *
   * This references Identity.publicId across the bounded-context boundary.
   */
  requesterPublicId: string;

  /**
   * Current JourneyDemand lifecycle status.
   */
  status: JourneyDemandStatus;

  /**
   * Public identifier of the Journey aggregate matched to this demand.
   *
   * Null until matching occurs.
   */
  matchedJourneyPublicId: string | null;

  /**
   * Requested travel corridor.
   */
  corridor: JourneyDemandCorridor | null;

  /**
   * Requested departure/arrival window.
   */
  schedule: JourneyDemandSchedule | null;

  /**
   * Requested passenger capacity.
   */
  capacity: JourneyDemandCapacity | null;

  /**
   * Requested price constraints.
   */
  pricing: JourneyDemandPricing | null;

  /**
   * Travellers participating in the demand.
   */
  participants: JourneyDemandParticipant[];

  // ---------------------------------------------------------------------------
  // Lifecycle timestamps
  // ---------------------------------------------------------------------------

  publishedAt: string | null;

  matchedAt: string | null;

  convertedAt: string | null;

  fulfilledAt: string | null;

  cancelledAt: string | null;

  expiredAt: string | null;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  createdAt: string;

  updatedAt: string;
}