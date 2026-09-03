// -----------------------------------------------------------------------------
// OTP Challenge — Domain Event
// -----------------------------------------------------------------------------
//
// Base domain event for the OtpChallenge aggregate within the Authentication
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
// OtpChallengeDomainEvent represents events emitted specifically by the
// OtpChallengeAggregate. It does not represent a fictional parent
// Authentication aggregate or a parent aggregate for the entire bounded
// context.
//
// -----------------------------------------------------------------------------
//
// Aggregate:
//
// OtpChallengeAggregate
// └── OtpChallengeEntity
//
// The OtpChallenge aggregate owns exactly one OtpChallengeEntity.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Provide the common base for OtpChallenge domain events.
// - Represent events emitted by OtpChallengeAggregate.
// - Preserve aggregate identity through DomainEvent metadata.
// - Preserve correlation/causation metadata.
// - Provide a common payload extension point for OtpChallenge events.
// - Maintain event version and schema-version metadata.
// - Establish the security boundary for OTP Challenge event payloads.
//
// -----------------------------------------------------------------------------
//
// This base event does NOT:
//
// - Represent AuthenticationAggregate.
// - Represent SessionAggregate.
// - Represent DeviceAggregate.
// - Represent RecoveryAggregate.
// - Represent the entire Authentication bounded context.
// - Contain OtpChallenge business rules.
// - Access persistence.
// - Access Prisma.
// - Communicate with external systems.
// - Validate Identity state.
// - Manage Session state.
// - Manage Device state.
// - Manage Recovery state.
// - Generate OTP values.
// - Validate submitted OTP values.
// - Hash OTP values.
// - Compare OTP hashes.
// - Generate authentication credentials.
// - Contain authentication credentials.
// - Contain access tokens.
// - Contain refresh tokens.
// - Contain refresh-token hashes.
// - Contain passwords.
// - Contain password hashes.
// - Contain OTP values.
// - Contain OTP hashes.
// - Contain recovery-token values.
// - Contain recovery-token hashes.
// - Contain cryptographic secrets.
//
// -----------------------------------------------------------------------------
//
// OTP Challenge event payload security:
//
// OTP Challenge persistence may contain security-sensitive information such
// as:
//
// - OTP hashes;
// - challenge identifiers;
// - attempt counters;
// - verification timestamps;
// - expiry timestamps;
// - lockout state;
// - delivery information;
// - authentication context.
//
// Concrete OtpChallenge events must expose only explicitly approved and safe
// event data.
//
// Domain events must never expose:
//
// - raw OTP values;
// - OTP hashes;
// - passwords;
// - password hashes;
// - access tokens;
// - refresh tokens;
// - refresh-token hashes;
// - recovery-token values;
// - recovery-token hashes;
// - session credentials;
// - cryptographic secrets;
// - private keys;
// - authentication secrets;
// - other security-sensitive material.
//
// Concrete OtpChallenge events may expose safe public identifiers, lifecycle
// state, non-secret challenge metadata, counters where explicitly approved,
// timestamps, and other explicitly approved event data.
//
// -----------------------------------------------------------------------------
//
// Cross-aggregate references:
//
// OtpChallenge may reference other aggregates through opaque public
// identifiers, such as:
//
// - identityPublicId;
// - authenticationPublicId;
// - recoveryPublicId;
// - devicePublicId;
// - sessionPublicId.
//
// OtpChallengeDomainEvent does not resolve, validate, or load any referenced
// aggregate.
//
// Cross-aggregate coordination belongs to the appropriate application/domain
// boundary.
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
// Aggregate identity is therefore retained in event metadata rather than
// duplicated by this base event.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

// -----------------------------------------------------------------------------
// OTP Challenge Domain Event
// -----------------------------------------------------------------------------

/**
 * Base domain event for the OtpChallenge aggregate.
 *
 * OtpChallenge is an independent aggregate root within the Authentication
 * bounded context.
 *
 * The Authentication bounded context contains multiple independent aggregate
 * roots. This event base therefore represents the concrete OtpChallenge
 * aggregate that actually emitted the event.
 *
 * Aggregate identity remains in the inherited DomainEvent metadata.
 *
 * Security-sensitive OTP and authentication material must never be included
 * in concrete event payloads.
 */
export abstract class OtpChallengeDomainEvent extends DomainEvent {
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
   * Returns the common payload shared by OtpChallenge domain events.
   *
   * Aggregate identity remains in DomainEvent.metadata and is therefore not
   * duplicated in the event payload.
   *
   * Concrete OtpChallenge events should extend this payload with only the
   * data required by their specific domain event.
   *
   * Raw OTP values, OTP hashes, authentication credentials, tokens,
   * cryptographic secrets, and other security-sensitive material must never
   * be included.
   */
  protected getBasePayload(): Record<string, unknown> {
    return {};
  }
}
