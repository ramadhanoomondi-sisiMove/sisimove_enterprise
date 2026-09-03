// -----------------------------------------------------------------------------
// Recovery — Domain Event
// -----------------------------------------------------------------------------
//
// Base domain event for the Recovery aggregate within the Authentication
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
// RecoveryDomainEvent represents events emitted specifically by the
// RecoveryAggregate. It does not represent a fictional parent Authentication
// aggregate or a parent aggregate for the entire bounded context.
//
// Aggregate identity is stored in the inherited DomainEvent metadata.
//
// -----------------------------------------------------------------------------
//
// Recovery aggregate:
//
// RecoveryAggregate
// └── RecoveryEntity
//
// The Recovery aggregate owns exactly one RecoveryEntity.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Provide the common base for Recovery domain events.
// - Represent events emitted by RecoveryAggregate.
// - Preserve aggregate identity through DomainEvent metadata.
// - Preserve correlation/causation metadata.
// - Provide a common payload extension point for Recovery events.
// - Maintain event version and schema-version metadata.
// - Establish the security boundary for Recovery event payloads.
//
// -----------------------------------------------------------------------------
//
// This base event does NOT:
//
// - Represent AuthenticationAggregate.
// - Represent SessionAggregate.
// - Represent DeviceAggregate.
// - Represent OtpChallengeAggregate.
// - Represent the entire Authentication bounded context.
// - Contain Recovery business rules.
// - Access persistence.
// - Access Prisma.
// - Communicate with external systems.
// - Validate Identity state.
// - Manage Session state.
// - Manage Device state.
// - Manage Authentication state.
// - Manage OTP challenges.
// - Contain passwords.
// - Contain password hashes.
// - Contain recovery tokens.
// - Contain recovery-token hashes.
// - Contain OTP values.
// - Contain OTP hashes.
// - Contain access tokens.
// - Contain refresh tokens.
// - Contain refresh-token hashes.
// - Contain cryptographic secrets.
// - Contain other authentication secrets.
//
// -----------------------------------------------------------------------------
//
// Recovery event payload security:
//
// Recovery persistence may contain security-sensitive information such as:
//
// - recovery-token hashes;
// - recovery lifecycle state;
// - recovery expiration timestamps;
// - recovery completion timestamps;
// - recovery cancellation timestamps;
// - identity references.
//
// Concrete Recovery events must expose only explicitly approved and safe
// event data.
//
// Domain events must never expose:
//
// - raw recovery tokens;
// - recovery-token hashes;
// - passwords;
// - password hashes;
// - access tokens;
// - refresh tokens;
// - refresh-token hashes;
// - OTP values;
// - OTP hashes;
// - session credentials;
// - cryptographic secrets;
// - private keys;
// - authentication secrets;
// - other sensitive security material.
//
// Concrete Recovery events may expose safe public identifiers, recovery type,
// lifecycle state, non-secret timestamps, and other explicitly approved event
// data.
//
// -----------------------------------------------------------------------------
//
// Cross-aggregate references:
//
// Recovery may reference:
//
// - identityPublicId
//
// This is an opaque public identifier.
//
// RecoveryDomainEvent does not resolve, validate, or load the referenced
// Identity aggregate.
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
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

// -----------------------------------------------------------------------------
// Recovery Domain Event
// -----------------------------------------------------------------------------

/**
 * Base domain event for the Recovery aggregate.
 *
 * Recovery is an independent aggregate root within the Authentication bounded
 * context.
 *
 * The Authentication bounded context contains multiple independent aggregate
 * roots. This event base therefore represents the concrete Recovery aggregate
 * that actually emitted the event.
 *
 * Aggregate identity remains in the inherited DomainEvent metadata.
 */
export abstract class RecoveryDomainEvent extends DomainEvent {
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
   * Returns the common payload shared by Recovery domain events.
   *
   * Aggregate identity remains in DomainEvent.metadata and is therefore not
   * duplicated in the event payload.
   *
   * Concrete Recovery events should extend this payload with only the data
   * required by their specific domain event.
   *
   * Recovery tokens, token hashes, credentials, and other authentication
   * secrets must never be included.
   */
  protected getBasePayload(): Record<string, unknown> {
    return {};
  }
}
