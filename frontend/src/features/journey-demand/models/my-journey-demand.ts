// -----------------------------------------------------------------------------
// sisiMove — My Journey Demand Model
// -----------------------------------------------------------------------------
//
// Frontend representation of the authenticated owner's
// MyJourneyDemandResponse contract.
//
// This model is intentionally separate from JourneyDemand because the backend
// exposes a dedicated authenticated-owner read contract.
//
// Ownership is established by the backend query/application boundary. The
// frontend must not attempt to authorize ownership by comparing identifiers.
// -----------------------------------------------------------------------------

import type { JourneyDemandStatus } from './journey-demand-status';
import type { JourneyDemandCorridor } from './journey-demand-corridor';
import type { JourneyDemandSchedule } from './journey-demand-schedule';
import type { JourneyDemandCapacity } from './journey-demand-capacity';
import type { JourneyDemandPricing } from './journey-demand-pricing';
import type { JourneyDemandParticipant } from './journey-demand-participant';

/**
 * Authenticated owner's Journey Demand response model.
 */
export interface MyJourneyDemand {
  /**
   * Stable public identifier.
   */
  readonly publicId: string;

  /**
   * Opaque public identifier of the requester.
   *
   * This is retained because it is part of the authenticated owner response
   * contract. The client does not supply it when requesting /me.
   */
  readonly requesterPublicId: string;

  /**
   * Current backend lifecycle status.
   */
  readonly status: JourneyDemandStatus;

  /**
   * Public identifier of the matched Journey, when applicable.
   */
  readonly matchedJourneyPublicId: string | undefined;

  /**
   * Journey Demand-owned components.
   */
  readonly corridor: JourneyDemandCorridor | undefined;
  readonly schedule: JourneyDemandSchedule | undefined;
  readonly capacity: JourneyDemandCapacity | undefined;
  readonly pricing: JourneyDemandPricing | undefined;

  /**
   * Participants associated with the demand.
   */
  readonly participants: readonly JourneyDemandParticipant[];

  /**
   * Lifecycle timestamps supplied by the backend.
   */
  readonly publishedAt: Date | undefined;
  readonly matchedAt: Date | undefined;
  readonly convertedAt: Date | undefined;
  readonly fulfilledAt: Date | undefined;
  readonly cancelledAt: Date | undefined;
  readonly expiredAt: Date | undefined;

  /**
   * Backend version.
   */
  readonly version: number;

  /**
   * Backend-provided lifecycle state.
   */
  readonly isDraft: boolean;
  readonly isOpen: boolean;
  readonly isMatched: boolean;
  readonly isConverted: boolean;
  readonly isFulfilled: boolean;
  readonly isCancelled: boolean;
  readonly isExpired: boolean;
  readonly isPublished: boolean;
  readonly isTerminal: boolean;
  readonly isActive: boolean;

  /**
   * Backend-provided relationship state.
   */
  readonly hasMatchedJourney: boolean;
  readonly hasCorridor: boolean;
  readonly hasSchedule: boolean;
  readonly hasCapacity: boolean;
  readonly hasPricing: boolean;
  readonly hasParticipants: boolean;

  /**
   * Backend-provided participant count.
   */
  readonly participantCount: number;

  /**
   * Backend timestamps.
   */
  readonly createdAt: Date;
  readonly updatedAt: Date;
}