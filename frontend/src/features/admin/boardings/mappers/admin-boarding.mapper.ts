
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
// Backend aggregate response types
// -----------------------------------------------------------------------------

type ValueObject<T> = {
  props?: {
    value?: T;
  };
  _value?: T;
};

interface BoardingAggregateProps {
  publicId?: ValueObject<string>;
  journeyId?: {
    props?: {
      value?: string;
    };
  };
  providerPublicId?: ValueObject<string>;
  status?: {
    props?: {
      value?: string;
    };
  };
  boardingStartedAt?: string | null;
  journeyStartedAt?: string | null;
  cancelledAt?: string | null;
  version?: number;
  participants?: unknown[];
  events?: unknown[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BoardingAggregateResponse {
  _id?: ValueObject<string>;
  _publicId?: ValueObject<string>;
  props: BoardingAggregateProps;
}

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
// Validation helpers
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

function normalizeBoardingStatus(value: string): AdminBoardingStatus {
  if (Object.values(AdminBoardingStatus).includes(value as AdminBoardingStatus)) {
    return value as AdminBoardingStatus;
  }

  throw new Error(`Unknown boarding status: ${value}`);
}

function normalizeParticipantRole(value: string): AdminBoardingParticipantRole {
  if (Object.values(AdminBoardingParticipantRole).includes(value as AdminBoardingParticipantRole)) {
    return value as AdminBoardingParticipantRole;
  }

  throw new Error(`Unknown boarding participant role: ${value}`);
}

function normalizeParticipantStatus(value: string): AdminBoardingParticipantStatus {
  if (Object.values(AdminBoardingParticipantStatus).includes(value as AdminBoardingParticipantStatus)) {
    return value as AdminBoardingParticipantStatus;
  }

  throw new Error(`Unknown boarding participant status: ${value}`);
}

function normalizeEventType(value: string): AdminBoardingEventType {
  if (Object.values(AdminBoardingEventType).includes(value as AdminBoardingEventType)) {
    return value as AdminBoardingEventType;
  }

  throw new Error(`Unknown boarding event type: ${value}`);
}

// -----------------------------------------------------------------------------
// Participant mapper — canonical participant response
// -----------------------------------------------------------------------------

export function mapAdminBoardingParticipant(
  response: BoardingParticipantResponse,
): AdminBoardingParticipant {
  return {
    publicId: response.publicId,
    boardingId: response.boardingId,
    memberPublicId: response.memberPublicId,
    bookingPublicId: response.bookingPublicId ?? null,
    role: normalizeParticipantRole(response.role),
    status: normalizeParticipantStatus(response.status),
    expectedAt: response.expectedAt,
    boardedAt: response.boardedAt ?? null,
    withdrawnAt: response.withdrawnAt ?? null,
    noShowAt: response.noShowAt ?? null,
    removedAt: response.removedAt ?? null,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}

// -----------------------------------------------------------------------------
// Event mapper — canonical event response
// -----------------------------------------------------------------------------

export function mapAdminBoardingEvent(
  response: BoardingEventResponse,
): AdminBoardingEvent {
  return {
    publicId: response.publicId,
    boardingId: response.boardingId,
    type: normalizeEventType(response.type),
    memberPublicId: response.memberPublicId ?? null,
    bookingPublicId: response.bookingPublicId ?? null,
    actorPublicId: response.actorPublicId ?? null,
    occurredAt: response.occurredAt,
    metadata: response.metadata ?? null,
    createdAt: response.createdAt,
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
    providerPublicId: requiredString(response.providerPublicId, 'providerPublicId'),
    status: normalizeBoardingStatus(requiredString(response.status, 'status')),
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
// Domain aggregate mapper — GET /journey-boardings collection
// -----------------------------------------------------------------------------

function readAggregatePublicId(
  response: BoardingAggregateResponse,
): string {
  const value = response.props.publicId?._value ?? response._publicId?._value;
  return requiredString(value, 'props.publicId');
}

export function mapAdminBoardingAggregate(
  response: BoardingAggregateResponse,
): AdminBoarding {
  const props = response.props;

  const publicId = readAggregatePublicId(response);
  const journeyId = requiredString(
    props.journeyId?.props?.value,
    'props.journeyId.props.value',
  );
  const providerPublicId = requiredString(
    props.providerPublicId?._value,
    'props.providerPublicId._value',
  );
  const status = requiredString(
    props.status?.props?.value,
    'props.status.props.value',
  );

  // The supplied collection response does not include participant or event
  // arrays. Only map these when the backend actually provides them.
  const participants = Array.isArray(props.participants)
    ? (props.participants as BoardingParticipantResponse[]).map(
        mapAdminBoardingParticipant,
      )
    : [];

  const events = Array.isArray(props.events)
    ? (props.events as BoardingEventResponse[]).map(mapAdminBoardingEvent)
    : [];

  return {
    publicId,
    journeyId,
    providerPublicId,
    status: normalizeBoardingStatus(status),
    boardingStartedAt: props.boardingStartedAt ?? null,
    journeyStartedAt: props.journeyStartedAt ?? null,
    cancelledAt: props.cancelledAt ?? null,
    version: requiredNumber(props.version, 'props.version'),
    participants,
    events,
    createdAt: requiredString(props.createdAt, 'props.createdAt'),
    updatedAt: requiredString(props.updatedAt, 'props.updatedAt'),
  };
}

export function mapAdminBoardings(
  responses: BoardingAggregateResponse[],
): AdminBoarding[] {
  return responses.map(mapAdminBoardingAggregate);
}
