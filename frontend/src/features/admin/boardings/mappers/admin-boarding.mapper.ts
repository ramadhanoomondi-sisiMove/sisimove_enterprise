import type {
  AdminBoarding,
  AdminBoardingEvent,
  AdminBoardingParticipant,
} from '../models';

import {
  AdminBoardingEventType,
  AdminBoardingParticipantRole,
  AdminBoardingParticipantStatus,
  AdminBoardingStatus,
} from '../models';

// -----------------------------------------------------------------------------
// Shared value-object types
// -----------------------------------------------------------------------------

type ValueObject<T> = {
  props?: {
    value?: T;
  };
  _value?: T;
};

interface AggregateParticipantProps {
  publicId?: ValueObject<string>;
  boardingId?: ValueObject<string>;
  memberPublicId?: ValueObject<string>;
  bookingPublicId?: ValueObject<string> | null;
  role?: ValueObject<string>;
  status?: ValueObject<string>;
  expectedAt?: string;
  boardedAt?: string | null;
  withdrawnAt?: string | null;
  noShowAt?: string | null;
  removedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface AggregateEventProps {
  publicId?: ValueObject<string>;
  boardingId?: ValueObject<string>;
  type?: ValueObject<string>;
  memberPublicId?: ValueObject<string> | null;
  bookingPublicId?: ValueObject<string> | null;
  actorPublicId?: ValueObject<string> | null;
  occurredAt?: string;
  metadata?: Record<string, unknown> | null;
  createdAt?: string;
}

interface BoardingParticipantAggregateEntity {
  _id?: ValueObject<string>;
  _publicId?: ValueObject<string>;
  props: AggregateParticipantProps;
}

interface BoardingEventAggregateEntity {
  _id?: ValueObject<string>;
  _publicId?: ValueObject<string>;
  props: AggregateEventProps;
}

interface BoardingAggregateRootProps {
  publicId?: ValueObject<string>;
  journeyId?: ValueObject<string>;
  providerPublicId?: ValueObject<string>;
  status?: ValueObject<string>;
  boardingStartedAt?: string | null;
  journeyStartedAt?: string | null;
  cancelledAt?: string | null;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
  participants?: BoardingParticipantResponse[];
  events?: BoardingEventResponse[];
  participantEntities?: BoardingParticipantAggregateEntity[];
  eventEntities?: BoardingEventAggregateEntity[];
}

/**
 * Legacy aggregate serialization supported during the REST DTO migration:
 * - response.props contains the root fields
 * - response.props.props contains the root fields
 *
 * Current collection responses are flat BoardingResponse DTOs.
 */
interface BoardingAggregateEnvelopeProps extends BoardingAggregateRootProps {
  _id?: ValueObject<string>;
  _publicId?: ValueObject<string>;
  props?: BoardingAggregateRootProps;
  participantEntities?: BoardingParticipantAggregateEntity[];
  eventEntities?: BoardingEventAggregateEntity[];
  participants?: BoardingParticipantResponse[];
  events?: BoardingEventResponse[];
}

interface LegacyBoardingAggregateResponse {
  _id?: ValueObject<string>;
  _publicId?: ValueObject<string>;
  props: BoardingAggregateEnvelopeProps;
}

/**
 * The API now returns flat REST DTOs for list responses. Keep the legacy
 * aggregate shape in the union so older endpoints remain mappable during
 * migration.
 */
export type BoardingAggregateResponse =
  | BoardingResponse
  | LegacyBoardingAggregateResponse;

// -----------------------------------------------------------------------------
// Canonical REST response types
// -----------------------------------------------------------------------------

export interface BoardingParticipantResponse {
  publicId: string;
  boardingId: string;
  memberPublicId: string;
  bookingPublicId?: string | null;
  role: string;
  status: string;
  expectedAt: string;
  boardedAt?: string | null;
  withdrawnAt?: string | null;
  noShowAt?: string | null;
  removedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BoardingEventResponse {
  publicId: string;
  boardingId: string;
  type: string;
  memberPublicId?: string | null;
  bookingPublicId?: string | null;
  actorPublicId?: string | null;
  occurredAt: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export interface BoardingResponse {
  publicId: string;
  journeyId: string;
  providerPublicId: string;
  status: string;
  boardingStartedAt?: string | null;
  journeyStartedAt?: string | null;
  cancelledAt?: string | null;
  version: number;
  participants: BoardingParticipantResponse[];
  events: BoardingEventResponse[];
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Validation and value-object helpers
// -----------------------------------------------------------------------------

function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Invalid boarding response: ${field} is missing.`);
  }

  return value;
}

function requiredNumber(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Invalid boarding response: ${field} is missing.`);
  }

  return value;
}

function readValue<T>(value: ValueObject<T> | null | undefined): T | undefined {
  if (value == null) return undefined;

  return value._value ?? value.props?.value;
}

function normalizeBoardingStatus(value: string): AdminBoardingStatus {
  if (
    Object.values(AdminBoardingStatus).includes(
      value as AdminBoardingStatus,
    )
  ) {
    return value as AdminBoardingStatus;
  }

  throw new Error(`Unknown boarding status: ${value}`);
}

function normalizeParticipantRole(
  value: string,
): AdminBoardingParticipantRole {
  if (
    Object.values(AdminBoardingParticipantRole).includes(
      value as AdminBoardingParticipantRole,
    )
  ) {
    return value as AdminBoardingParticipantRole;
  }

  throw new Error(`Unknown boarding participant role: ${value}`);
}

function normalizeParticipantStatus(
  value: string,
): AdminBoardingParticipantStatus {
  if (
    Object.values(AdminBoardingParticipantStatus).includes(
      value as AdminBoardingParticipantStatus,
    )
  ) {
    return value as AdminBoardingParticipantStatus;
  }

  throw new Error(`Unknown boarding participant status: ${value}`);
}

function normalizeEventType(value: string): AdminBoardingEventType {
  if (
    Object.values(AdminBoardingEventType).includes(
      value as AdminBoardingEventType,
    )
  ) {
    return value as AdminBoardingEventType;
  }

  throw new Error(`Unknown boarding event type: ${value}`);
}

// -----------------------------------------------------------------------------
// Canonical participant mapper
// -----------------------------------------------------------------------------

export function mapAdminBoardingParticipant(
  response: BoardingParticipantResponse,
): AdminBoardingParticipant {
  return {
    publicId: requiredString(response.publicId, 'participant.publicId'),
    boardingId: requiredString(response.boardingId, 'participant.boardingId'),
    memberPublicId: requiredString(
      response.memberPublicId,
      'participant.memberPublicId',
    ),
    bookingPublicId: response.bookingPublicId ?? null,
    role: normalizeParticipantRole(response.role),
    status: normalizeParticipantStatus(response.status),
    expectedAt: requiredString(
      response.expectedAt,
      'participant.expectedAt',
    ),
    boardedAt: response.boardedAt ?? null,
    withdrawnAt: response.withdrawnAt ?? null,
    noShowAt: response.noShowAt ?? null,
    removedAt: response.removedAt ?? null,
    createdAt: requiredString(
      response.createdAt,
      'participant.createdAt',
    ),
    updatedAt: requiredString(
      response.updatedAt,
      'participant.updatedAt',
    ),
  };
}

// -----------------------------------------------------------------------------
// Canonical event mapper
// -----------------------------------------------------------------------------

export function mapAdminBoardingEvent(
  response: BoardingEventResponse,
): AdminBoardingEvent {
  return {
    publicId: requiredString(response.publicId, 'event.publicId'),
    boardingId: requiredString(response.boardingId, 'event.boardingId'),
    type: normalizeEventType(response.type),
    memberPublicId: response.memberPublicId ?? null,
    bookingPublicId: response.bookingPublicId ?? null,
    actorPublicId: response.actorPublicId ?? null,
    occurredAt: requiredString(response.occurredAt, 'event.occurredAt'),
    metadata: response.metadata ?? null,
    createdAt: requiredString(response.createdAt, 'event.createdAt'),
  };
}

// -----------------------------------------------------------------------------
// Canonical REST response mapper
// -----------------------------------------------------------------------------

export function mapAdminBoarding(
  response: BoardingResponse,
): AdminBoarding {
  return {
    publicId: requiredString(response.publicId, 'publicId'),
    journeyId: requiredString(response.journeyId, 'journeyId'),
    providerPublicId: requiredString(
      response.providerPublicId,
      'providerPublicId',
    ),
    status: normalizeBoardingStatus(
      requiredString(response.status, 'status'),
    ),
    boardingStartedAt: response.boardingStartedAt ?? null,
    journeyStartedAt: response.journeyStartedAt ?? null,
    cancelledAt: response.cancelledAt ?? null,
    version: requiredNumber(response.version, 'version'),
    participants: response.participants.map(mapAdminBoardingParticipant),
    events: response.events.map(mapAdminBoardingEvent),
    createdAt: requiredString(response.createdAt, 'createdAt'),
    updatedAt: requiredString(response.updatedAt, 'updatedAt'),
  };
}

// -----------------------------------------------------------------------------
// Aggregate child-entity mappers
// -----------------------------------------------------------------------------

function mapAggregateParticipant(
  entity: BoardingParticipantAggregateEntity,
): AdminBoardingParticipant {
  const props = entity.props;

  return mapAdminBoardingParticipant({
    publicId: requiredString(
      readValue(props.publicId) ?? readValue(entity._publicId),
      'participant.publicId',
    ),
    boardingId: requiredString(
      readValue(props.boardingId),
      'participant.boardingId',
    ),
    memberPublicId: requiredString(
      readValue(props.memberPublicId),
      'participant.memberPublicId',
    ),
    bookingPublicId: readValue(props.bookingPublicId) ?? null,
    role: requiredString(readValue(props.role), 'participant.role'),
    status: requiredString(readValue(props.status), 'participant.status'),
    expectedAt: requiredString(
      props.expectedAt,
      'participant.expectedAt',
    ),
    boardedAt: props.boardedAt ?? null,
    withdrawnAt: props.withdrawnAt ?? null,
    noShowAt: props.noShowAt ?? null,
    removedAt: props.removedAt ?? null,
    createdAt: requiredString(
      props.createdAt,
      'participant.createdAt',
    ),
    updatedAt: requiredString(
      props.updatedAt,
      'participant.updatedAt',
    ),
  });
}

function mapAggregateEvent(
  entity: BoardingEventAggregateEntity,
): AdminBoardingEvent {
  const props = entity.props;

  return mapAdminBoardingEvent({
    publicId: requiredString(
      readValue(props.publicId) ?? readValue(entity._publicId),
      'event.publicId',
    ),
    boardingId: requiredString(
      readValue(props.boardingId),
      'event.boardingId',
    ),
    type: requiredString(readValue(props.type), 'event.type'),
    memberPublicId: readValue(props.memberPublicId) ?? null,
    bookingPublicId: readValue(props.bookingPublicId) ?? null,
    actorPublicId: readValue(props.actorPublicId) ?? null,
    occurredAt: requiredString(props.occurredAt, 'event.occurredAt'),
    metadata: props.metadata ?? null,
    createdAt: requiredString(props.createdAt, 'event.createdAt'),
  });
}

// -----------------------------------------------------------------------------
// Domain aggregate mapper
// -----------------------------------------------------------------------------

function readAggregateBoardingPublicId(
  response: LegacyBoardingAggregateResponse,
): string {
  const outerProps = response.props;
  const root = outerProps.props ?? outerProps;

  // Prefer the aggregate root's public ID. The outer wrapper's _publicId can
  // refer to a different entity in some nested aggregate responses.
  return requiredString(
    readValue(root.publicId) ??
      readValue(outerProps.publicId) ??
      readValue(outerProps._publicId) ??
      readValue(response._publicId),
    'boarding.publicId',
  );
}

export function mapAdminBoardingAggregate(
  response: BoardingAggregateResponse,
): AdminBoarding {
  // Some endpoints now return the canonical flat REST DTO; map that shape
  // directly instead of requiring legacy aggregate props.
  if (
    response &&
    typeof response === 'object' &&
    'publicId' in response &&
    typeof response.publicId === 'string'
  ) {
    return mapAdminBoarding(response as BoardingResponse);
  }

  // Older create/open/provider endpoints may still return aggregate envelopes.
  if (!response || !('props' in response) || !response.props) {
    throw new Error(
      'Invalid boarding response: expected a REST DTO or aggregate props.',
    );
  }

  const legacyResponse = response as LegacyBoardingAggregateResponse;
  const outerProps = legacyResponse.props;
  const root = outerProps.props ?? outerProps;

  const publicId = readAggregateBoardingPublicId(legacyResponse);
  const journeyId = requiredString(
    readValue(root.journeyId),
    'boarding.journeyId',
  );
  const providerPublicId = requiredString(
    readValue(root.providerPublicId),
    'boarding.providerPublicId',
  );
  const status = requiredString(
    readValue(root.status),
    'boarding.status',
  );

  const participantEntities =
    outerProps.participantEntities ?? root.participantEntities;
  const eventEntities = outerProps.eventEntities ?? root.eventEntities;

  const participants = Array.isArray(participantEntities)
    ? participantEntities.map(mapAggregateParticipant)
    : Array.isArray(root.participants)
      ? root.participants.map(mapAdminBoardingParticipant)
      : [];

  const events = Array.isArray(eventEntities)
    ? eventEntities.map(mapAggregateEvent)
    : Array.isArray(root.events)
      ? root.events.map(mapAdminBoardingEvent)
      : [];

  return {
    publicId,
    journeyId,
    providerPublicId,
    status: normalizeBoardingStatus(status),
    boardingStartedAt: root.boardingStartedAt ?? null,
    journeyStartedAt: root.journeyStartedAt ?? null,
    cancelledAt: root.cancelledAt ?? null,
    version: requiredNumber(root.version, 'boarding.version'),
    participants,
    events,
    createdAt: requiredString(root.createdAt, 'boarding.createdAt'),
    updatedAt: requiredString(root.updatedAt, 'boarding.updatedAt'),
  };
}

export function mapAdminBoardings(
  responses: BoardingAggregateResponse[],
): AdminBoarding[] {
  return responses.map(mapAdminBoardingAggregate);
}
