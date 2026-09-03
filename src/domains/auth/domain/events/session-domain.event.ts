// -----------------------------------------------------------------------------
// Session — Domain Event
// -----------------------------------------------------------------------------
//
// Base domain event for the Session aggregate within the Authentication
// bounded context.
//
// The Authentication bounded context contains multiple independent aggregate
// roots:
//
// AuthenticationAggregate
// SessionAggregate
// DeviceAggregate
// RecoveryAggregate
// OtpChallengeAggregate
//
// SessionDomainEvent represents events emitted specifically by the
// SessionAggregate. It does not represent a fictional parent Authentication
// aggregate or a parent aggregate for the entire bounded context.
//
// Aggregate identity is stored in the inherited DomainEvent metadata.
//
// -----------------------------------------------------------------------------
//
// Session aggregate:
//
// SessionAggregate
// └── SessionEntity
//
// The Session aggregate owns exactly one SessionEntity.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Provide the common base for Session domain events.
// - Represent events emitted by SessionAggregate.
// - Preserve aggregate identity through DomainEvent metadata.
// - Preserve correlation/causation metadata.
// - Provide a common payload extension point for Session events.
// - Maintain event version and schema-version metadata.
// - Establish the security boundary for Session event payloads.
//
// -----------------------------------------------------------------------------
//
// This base event does NOT:
//
// - Represent AuthenticationAggregate.
// - Represent DeviceAggregate.
// - Represent RecoveryAggregate.
// - Represent OtpChallengeAggregate.
// - Represent the entire Authentication bounded context.
// - Contain Session business rules.
// - Access persistence.
// - Access Prisma.
// - Communicate with external systems.
// - Validate Identity state.
// - Manage Device state.
// - Manage Authentication state.
// - Manage Recovery state.
// - Manage OTP challenges.
// - Contain raw refresh tokens.
// - Contain refresh-token hashes.
// - Contain authentication credentials.
// - Contain other authentication secrets.
//
// -----------------------------------------------------------------------------
//
// Session event payload security:
//
// Session persistence contains:
//
// - refreshTokenHash
// - tokenFamilyPublicId
// - replacedBySessionPublicId
// - ipAddress
// - userAgent
// - countryCode
// - city
//
// Domain events must never expose:
//
// - raw refresh tokens;
// - refreshTokenHash;
// - passwords;
// - password hashes;
// - OTP values;
// - OTP hashes;
// - recovery-token values;
// - recovery-token hashes;
// - other authentication secrets.
//
// Concrete Session events may expose safe public identifiers, lifecycle
// information, timestamps, and other explicitly approved event data.
//
// -----------------------------------------------------------------------------
//
// Cross-aggregate references:
//
// Session may reference:
//
// - identityPublicId
// - devicePublicId
//
// These are opaque public identifiers.
//
// SessionDomainEvent does not resolve, validate, or load the referenced
// aggregates. Cross-aggregate coordination belongs to the appropriate
// application/domain boundary.
//
// -----------------------------------------------------------------------------
//
// DomainEvent foundation:
//
// DomainEvent provides:
//
// - eventId
// - eventName
// - eventVersion
// - aggregateId
// - aggregateType
// - correlationId
// - causationId
// - eventTimestamp
// - producerPlatform
// - eventSchemaVersion
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

// -----------------------------------------------------------------------------
// Session Domain Event
// -----------------------------------------------------------------------------

/**
 * Base domain event for the Session aggregate.
 *
 * Session is an independent aggregate root within the Authentication bounded
 * context.
 *
 * The Authentication bounded context contains multiple independent aggregate
 * roots. This event base therefore represents the concrete Session aggregate
 * that actually emitted the event.
 *
 * Aggregate identity remains in the inherited DomainEvent metadata.
 */
export abstract class SessionDomainEvent extends DomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  protected constructor(
    aggregateId: string,
    aggregateType: string,
    eventName: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      aggregateType,
      eventName,
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );
  }

  // ===========================================================================
  // Base Payload
  // ===========================================================================

  /**
   * Returns the common payload shared by Session domain events.
   *
   * Aggregate identity remains in DomainEvent.metadata and is therefore not
   * duplicated in the event payload.
   *
   * Concrete Session events should extend this payload with only the data
   * required by their specific domain event.
   *
   * Security-sensitive authentication material must never be included.
   */
  protected getBasePayload(): Record<string, unknown> {
    return {};
  }
}
