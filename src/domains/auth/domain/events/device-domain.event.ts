// -----------------------------------------------------------------------------
// Device — Domain Event
// -----------------------------------------------------------------------------
//
// Base domain event for the Device aggregate within the Authentication
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
// DeviceDomainEvent represents events emitted specifically by the
// DeviceAggregate. It does not represent a fictional parent Authentication
// aggregate or a parent aggregate for the entire bounded context.
//
// Aggregate identity is stored in the inherited DomainEvent metadata.
//
// -----------------------------------------------------------------------------
//
// Device aggregate:
//
// DeviceAggregate
// └── DeviceEntity
//
// The Device aggregate owns exactly one DeviceEntity.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Provide the common base for Device domain events.
// - Represent events emitted by DeviceAggregate.
// - Preserve aggregate identity through DomainEvent metadata.
// - Preserve correlation/causation metadata.
// - Provide a common payload extension point for Device events.
// - Maintain event version and schema-version metadata.
// - Establish the security boundary for Device event payloads.
//
// -----------------------------------------------------------------------------
//
// This base event does NOT:
//
// - Represent AuthenticationAggregate.
// - Represent SessionAggregate.
// - Represent RecoveryAggregate.
// - Represent OtpChallengeAggregate.
// - Represent the entire Authentication bounded context.
// - Contain Device business rules.
// - Access persistence.
// - Access Prisma.
// - Communicate with external systems.
// - Validate Identity state.
// - Manage Session state.
// - Manage Authentication state.
// - Manage Recovery state.
// - Manage OTP challenges.
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
// - Contain other authentication secrets.
//
// -----------------------------------------------------------------------------
//
// Device event payload security:
//
// Device persistence may contain security-relevant device information such as:
//
// - identityPublicId;
// - device identifiers;
// - device metadata;
// - platform information;
// - application information;
// - network context;
// - trust or verification state;
// - authentication-related timestamps.
//
// Concrete Device events must expose only explicitly approved and safe event
// data.
//
// Domain events must never expose:
//
// - passwords;
// - password hashes;
// - access tokens;
// - refresh tokens;
// - refresh-token hashes;
// - OTP values;
// - OTP hashes;
// - recovery-token values;
// - recovery-token hashes;
// - session credentials;
// - cryptographic secrets;
// - private keys;
// - authentication secrets;
// - other sensitive security material.
//
// Concrete Device events may expose safe public identifiers, lifecycle state,
// non-secret device metadata, timestamps, and other explicitly approved event
// data.
//
// -----------------------------------------------------------------------------
//
// Cross-aggregate references:
//
// Device may reference:
//
// - identityPublicId
//
// This is an opaque public identifier.
//
// DeviceDomainEvent does not resolve, validate, or load the referenced
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
// Device Domain Event
// -----------------------------------------------------------------------------

/**
 * Base domain event for the Device aggregate.
 *
 * Device is an independent aggregate root within the Authentication bounded
 * context.
 *
 * The Authentication bounded context contains multiple independent aggregate
 * roots. This event base therefore represents the concrete Device aggregate
 * that actually emitted the event.
 *
 * Aggregate identity remains in the inherited DomainEvent metadata.
 */
export abstract class DeviceDomainEvent extends DomainEvent {
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
   * Returns the common payload shared by Device domain events.
   *
   * Aggregate identity remains in DomainEvent.metadata and is therefore not
   * duplicated in the event payload.
   *
   * Concrete Device events should extend this payload with only the data
   * required by their specific domain event.
   *
   * Security-sensitive authentication material and other secrets must never
   * be included.
   */
  protected getBasePayload(): Record<string, unknown> {
    return {};
  }
}
