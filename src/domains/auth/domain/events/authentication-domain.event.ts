// -----------------------------------------------------------------------------
// Authentication Domain Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

// -----------------------------------------------------------------------------
// Authentication Domain Event
// -----------------------------------------------------------------------------

/**
 * Base domain event for the Authentication bounded context.
 *
 * Authentication contains multiple independent aggregate roots, including:
 *
 * - AuthenticationAggregate;
 * - SessionAggregate;
 * - DeviceAggregate;
 * - RecoveryAggregate;
 * - OtpChallengeAggregate.
 *
 * This base event therefore represents the aggregate that actually emitted
 * the event. It does not represent a fictional parent AuthenticationAggregate.
 *
 * Aggregate identity is stored in the inherited DomainEvent metadata.
 */
export abstract class AuthenticationDomainEvent extends DomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Base Payload
  // ---------------------------------------------------------------------------

  /**
   * Returns the common payload shared by Authentication domain events.
   *
   * Aggregate identity remains in DomainEvent.metadata and is therefore not
   * duplicated in the event payload.
   */
  protected getBasePayload(): Record<string, unknown> {
    return {};
  }
}
