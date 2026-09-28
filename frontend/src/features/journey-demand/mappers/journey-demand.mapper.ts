// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Mapper
// -----------------------------------------------------------------------------
//
// Maps the backend authenticated/internal JourneyDemandResponse contract into
// the frontend JourneyDemand application model.
//
// IMPORTANT:
// This mapper is for the generic Journey Demand application response.
// It is NOT the public marketplace projection.
//
// The public marketplace response has a different shape and intentionally
// composes requester traveller/trust information. It should have its own
// public-read mapper when that frontend contract is implemented.
//
// Nullable backend values are normalized to `undefined`.
// -----------------------------------------------------------------------------

import type { JourneyDemand } from '../models/journey-demand';

import {
  mapJourneyDemandCorridor,
  type JourneyDemandCorridorResponse,
} from './journey-demand-corridor.mapper';

import {
  mapJourneyDemandSchedule,
  type JourneyDemandScheduleResponse,
} from './journey-demand-schedule.mapper';

import {
  mapJourneyDemandCapacity,
  type JourneyDemandCapacityResponse,
} from './journey-demand-capacity.mapper';

import {
  mapJourneyDemandPricing,
  type JourneyDemandPricingResponse,
} from './journey-demand-pricing.mapper';

import {
  mapJourneyDemandParticipant,
  type JourneyDemandParticipantResponse,
} from './journey-demand-participant.mapper';

import type { JourneyDemandStatus } from '../models/journey-demand-status';

/**
 * Backend HTTP/application response consumed by this mapper.
 *
 * The response is deliberately represented at the application-contract level,
 * not as a Prisma model or frontend aggregate.
 */
export interface JourneyDemandResponse {
  readonly publicId: string;
  readonly requesterPublicId: string;
  readonly status: JourneyDemandStatus;
  readonly matchedJourneyPublicId: string | null;

  readonly corridor: JourneyDemandCorridorResponse | null;
  readonly schedule: JourneyDemandScheduleResponse | null;
  readonly capacity: JourneyDemandCapacityResponse | null;
  readonly pricing: JourneyDemandPricingResponse | null;

  readonly participants: readonly JourneyDemandParticipantResponse[];

  readonly publishedAt: string | Date | null;
  readonly matchedAt: string | Date | null;
  readonly convertedAt: string | Date | null;
  readonly fulfilledAt: string | Date | null;
  readonly cancelledAt: string | Date | null;
  readonly expiredAt: string | Date | null;

  readonly version: number;

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

  readonly hasMatchedJourney: boolean;
  readonly hasCorridor: boolean;
  readonly hasSchedule: boolean;
  readonly hasCapacity: boolean;
  readonly hasPricing: boolean;
  readonly hasParticipants: boolean;

  readonly participantCount: number;

  readonly createdAt: string | Date;
  readonly updatedAt: string | Date;
}

/**
 * Converts a nullable backend timestamp into the frontend's optional Date
 * representation.
 */
function mapOptionalDate(
  value: string | Date | null,
): Date | undefined {
  return value === null ? undefined : new Date(value);
}

/**
 * Maps one backend Journey Demand response.
 */
export function mapJourneyDemand(
  response: JourneyDemandResponse,
): JourneyDemand {
  return {
    publicId: response.publicId,
    requesterPublicId: response.requesterPublicId,
    status: response.status,

    matchedJourneyPublicId:
      response.matchedJourneyPublicId ?? undefined,

    corridor:
      response.corridor === null
        ? undefined
        : mapJourneyDemandCorridor(response.corridor),

    schedule:
      response.schedule === null
        ? undefined
        : mapJourneyDemandSchedule(response.schedule),

    capacity:
      response.capacity === null
        ? undefined
        : mapJourneyDemandCapacity(response.capacity),

    pricing:
      response.pricing === null
        ? undefined
        : mapJourneyDemandPricing(response.pricing),

    participants: response.participants.map(
      mapJourneyDemandParticipant,
    ),

    publishedAt: mapOptionalDate(response.publishedAt),
    matchedAt: mapOptionalDate(response.matchedAt),
    convertedAt: mapOptionalDate(response.convertedAt),
    fulfilledAt: mapOptionalDate(response.fulfilledAt),
    cancelledAt: mapOptionalDate(response.cancelledAt),
    expiredAt: mapOptionalDate(response.expiredAt),

    version: response.version,

    // Backend-provided lifecycle state.
    isDraft: response.isDraft,
    isOpen: response.isOpen,
    isMatched: response.isMatched,
    isConverted: response.isConverted,
    isFulfilled: response.isFulfilled,
    isCancelled: response.isCancelled,
    isExpired: response.isExpired,
    isPublished: response.isPublished,
    isTerminal: response.isTerminal,
    isActive: response.isActive,

    // Backend-provided relationship state.
    hasMatchedJourney: response.hasMatchedJourney,
    hasCorridor: response.hasCorridor,
    hasSchedule: response.hasSchedule,
    hasCapacity: response.hasCapacity,
    hasPricing: response.hasPricing,
    hasParticipants: response.hasParticipants,

    participantCount: response.participantCount,

    createdAt: new Date(response.createdAt),
    updatedAt: new Date(response.updatedAt),
  };
}

/**
 * Maps a collection of generic Journey Demand responses.
 */
export function mapJourneyDemands(
  responses: readonly JourneyDemandResponse[],
): readonly JourneyDemand[] {
  return responses.map(mapJourneyDemand);
}