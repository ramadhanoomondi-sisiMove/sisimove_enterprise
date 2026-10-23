
/**
 * sisiMove — Journey Boarding Response Mapper
 *
 * Maps the Journey Boarding API response into frontend models.
 *
 * Responsibilities:
 * - Normalize backend Date|string values into ISO strings.
 * - Map boarding participants and events.
 * - Preserve optional and nullable response fields.
 * - Use the journey public ID resolved by the caller.
 *
 * This mapper does not:
 * - Query repositories or databases.
 * - Resolve journey identifiers itself.
 * - Apply boarding lifecycle business rules.
 */

import type {
  JourneyBoarding,
  JourneyBoardingEvent,
  JourneyBoardingParticipant,
  JourneyBoardingResponseModel,
} from '../models/journey-boarding.model';

// -----------------------------------------------------------------------------
// Backend response types
// -----------------------------------------------------------------------------

type BackendDate = Date | string;

interface JourneyBoardingParticipantResponse {
  publicId: string;
  boardingId: string;
  memberPublicId: string;
  bookingPublicId?: string | null;

  role: string;
  status: string;

  expectedAt: BackendDate;
  boardedAt?: BackendDate | null;
  withdrawnAt?: BackendDate | null;
  noShowAt?: BackendDate | null;
  removedAt?: BackendDate | null;

  createdAt: BackendDate;
  updatedAt: BackendDate;
}

interface JourneyBoardingEventResponse {
  publicId: string;
  boardingId: string;
  type: string;

  memberPublicId?: string | null;
  bookingPublicId?: string | null;
  actorPublicId?: string | null;

  occurredAt: BackendDate;
  metadata?: Record<string, unknown> | null;
  createdAt: BackendDate;
}

export interface JourneyBoardingBackendResponse {
  publicId: string;

  /**
   * Backend boarding response uses the resolved public journey identifier
   * in this field.
   */
  journeyId: string;

  providerPublicId: string;
  status: string;

  boardingStartedAt?: BackendDate | null;
  journeyStartedAt?: BackendDate | null;
  cancelledAt?: BackendDate | null;

  version: number;

  participants: JourneyBoardingParticipantResponse[];
  events: JourneyBoardingEventResponse[];

  createdAt: BackendDate;
  updatedAt: BackendDate;
}

// -----------------------------------------------------------------------------
// Date normalization
// -----------------------------------------------------------------------------

function toIsoString(value: BackendDate): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date received by JourneyBoardingResponseMapper: ${String(value)}`);
  }

  return date.toISOString();
}

function toNullableIsoString(
  value: BackendDate | null | undefined,
): string | null {
  return value == null ? null : toIsoString(value);
}

// -----------------------------------------------------------------------------
// Participant mapper
// -----------------------------------------------------------------------------

function mapParticipant(
  participant: JourneyBoardingParticipantResponse,
): JourneyBoardingParticipant {
  return {
    publicId: participant.publicId,
    boardingId: participant.boardingId,
    memberPublicId: participant.memberPublicId,
    bookingPublicId: participant.bookingPublicId ?? null,

    role: participant.role,
    status: participant.status,

    expectedAt: toIsoString(participant.expectedAt),
    boardedAt: toNullableIsoString(participant.boardedAt),
    withdrawnAt: toNullableIsoString(participant.withdrawnAt),
    noShowAt: toNullableIsoString(participant.noShowAt),
    removedAt: toNullableIsoString(participant.removedAt),

    createdAt: toIsoString(participant.createdAt),
    updatedAt: toIsoString(participant.updatedAt),
  };
}

// -----------------------------------------------------------------------------
// Event mapper
// -----------------------------------------------------------------------------

function mapEvent(
  event: JourneyBoardingEventResponse,
): JourneyBoardingEvent {
  return {
    publicId: event.publicId,
    boardingId: event.boardingId,
    type: event.type,

    memberPublicId: event.memberPublicId ?? null,
    bookingPublicId: event.bookingPublicId ?? null,
    actorPublicId: event.actorPublicId ?? null,

    occurredAt: toIsoString(event.occurredAt),
    metadata: event.metadata ?? null,
    createdAt: toIsoString(event.createdAt),
  };
}

// -----------------------------------------------------------------------------
// Boarding response mapper
// -----------------------------------------------------------------------------

export class JourneyBoardingResponseMapper {
  static toModel(
    response: JourneyBoardingBackendResponse,
    resolvedJourneyPublicId?: string,
  ): JourneyBoardingResponseModel {
    return {
      publicId: response.publicId,

      // Prefer the caller-resolved public ID when provided.
      journeyId: resolvedJourneyPublicId ?? response.journeyId,

      providerPublicId: response.providerPublicId,
      status: response.status,

      boardingStartedAt: toNullableIsoString(response.boardingStartedAt),
      journeyStartedAt: toNullableIsoString(response.journeyStartedAt),
      cancelledAt: toNullableIsoString(response.cancelledAt),

      version: response.version,

      participants: (response.participants ?? []).map(mapParticipant),
      events: (response.events ?? []).map(mapEvent),

      createdAt: toIsoString(response.createdAt),
      updatedAt: toIsoString(response.updatedAt),
    };
  }

  static toModels(
    responses: JourneyBoardingBackendResponse[],
    resolvedJourneyPublicId?: string,
  ): JourneyBoarding[] {
    return responses.map((response) =>
      JourneyBoardingResponseMapper.toModel(
        response,
        resolvedJourneyPublicId,
      ),
    );
  }
}
