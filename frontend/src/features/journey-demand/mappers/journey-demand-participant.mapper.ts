// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Participant Mapper
// -----------------------------------------------------------------------------
//
// Maps the backend JourneyDemandParticipantResponse contract into the
// frontend JourneyDemandParticipant model.
//
// Nullable lifecycle timestamps are normalized to `undefined`.
//
// Participant state flags are backend-provided facts and are copied directly.
// -----------------------------------------------------------------------------

import type { JourneyDemandParticipant } from '../models/journey-demand-participant';
import type { JourneyDemandParticipantStatus } from '../models/journey-demand-participant-status';

/**
 * Backend HTTP/application response consumed by this mapper.
 */
export interface JourneyDemandParticipantResponse {
  readonly publicId: string;
  readonly memberPublicId: string;
  readonly seats: number;
  readonly status: JourneyDemandParticipantStatus;

  readonly joinedAt: string | Date;
  readonly withdrawnAt: string | Date | null;
  readonly removedAt: string | Date | null;

  readonly isActive: boolean;
  readonly isWithdrawn: boolean;
  readonly isRemoved: boolean;
  readonly canParticipate: boolean;
  readonly hasWithdrawn: boolean;
  readonly hasBeenRemoved: boolean;

  readonly createdAt: string | Date;
  readonly updatedAt: string | Date;
}

/**
 * Maps one backend Journey Demand participant response.
 */
export function mapJourneyDemandParticipant(
  response: JourneyDemandParticipantResponse,
): JourneyDemandParticipant {
  return {
    publicId: response.publicId,
    memberPublicId: response.memberPublicId,
    seats: response.seats,
    status: response.status,

    joinedAt: new Date(response.joinedAt),

    withdrawnAt:
      response.withdrawnAt === null
        ? undefined
        : new Date(response.withdrawnAt),

    removedAt:
      response.removedAt === null
        ? undefined
        : new Date(response.removedAt),

    // Backend-provided participant state.
    isActive: response.isActive,
    isWithdrawn: response.isWithdrawn,
    isRemoved: response.isRemoved,
    canParticipate: response.canParticipate,
    hasWithdrawn: response.hasWithdrawn,
    hasBeenRemoved: response.hasBeenRemoved,

    createdAt: new Date(response.createdAt),
    updatedAt: new Date(response.updatedAt),
  };
}

/**
 * Maps a collection of backend participant responses.
 */
export function mapJourneyDemandParticipants(
  responses: readonly JourneyDemandParticipantResponse[],
): readonly JourneyDemandParticipant[] {
  return responses.map(mapJourneyDemandParticipant);
}