// -----------------------------------------------------------------------------
// Identity Domain Event
// -----------------------------------------------------------------------------
//
// Base domain event for the Identity bounded context.
//
// The Identity domain contains multiple aggregate roots, including:
//
// - IdentityAggregate;
// - VerificationAggregate;
// - VerificationRequestAggregate;
// - RoleAggregate;
// - PermissionAggregate.
//
// Relationship entities such as IdentityRole and RolePermission may also emit
// domain events when their lifecycle represents meaningful domain behavior.
//
// This base event represents the aggregate that actually emitted the event.
// It does not represent a fictional parent IdentityAggregate.
//
// Aggregate identity is stored in the inherited DomainEvent metadata.
//
// Correlation and causation metadata are optional because not every domain
// operation originates from a message-driven or correlated application flow.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

// -----------------------------------------------------------------------------
// Identity Domain Event
// -----------------------------------------------------------------------------

/**
 * Base domain event for the Identity bounded context.
 *
 * Identity contains multiple independent aggregate roots and domain entities.
 * Every concrete event must therefore explicitly identify the aggregate that
 * emitted the event through the inherited DomainEvent metadata.
 *
 * Aggregate identity is stored in:
 *
 * - metadata.aggregateId;
 * - metadata.aggregateType.
 *
 * Correlation and causation identifiers are optional event metadata. They are
 * infrastructure/application concerns and are not required to be part of
 * every domain operation.
 *
 * The externally meaningful public identity of the affected domain object may
 * additionally be included in the concrete event payload when required by
 * event consumers.
 */
export abstract class IdentityDomainEvent extends DomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  protected constructor(
    aggregateId: string,
    aggregateType: string,
    eventName: string,
    correlationId?: string,
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
   * Returns the common payload shared by Identity domain events.
   *
   * Aggregate identity intentionally remains in DomainEvent.metadata and is
   * therefore not duplicated in every concrete event payload.
   *
   * Concrete Identity domain events may extend this payload with the public
   * identifiers and domain state required by downstream consumers.
   */
  protected getBasePayload(): Record<string, unknown> {
    return {};
  }
}
