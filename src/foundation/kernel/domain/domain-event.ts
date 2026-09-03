// -----------------------------------------------------------------------------
// Foundation — Domain Events
// -----------------------------------------------------------------------------
//
// Base domain-event infrastructure shared across bounded contexts.
//
// Domain events always identify:
//
// - the event;
// - the aggregate that emitted it;
// - the event version;
// - when it occurred;
// - the producer platform;
// - the event schema.
//
// Correlation and causation metadata are optional because not every domain
// operation originates from a correlated application/message flow.
//
// Example:
//
// Create Identity
// - correlationId: available
// - causationId: optional
//
// Activate Identity
// - correlationId: not required
// - causationId: not required
//
// The absence of correlation metadata must not prevent a valid domain event
// from being created.
// -----------------------------------------------------------------------------

import { randomUUID } from 'crypto';

// -----------------------------------------------------------------------------
// Event Metadata
// -----------------------------------------------------------------------------

export interface EventMetadata {
  /**
   * Globally unique identifier of this event instance.
   */
  readonly eventId: string;

  /**
   * Logical event name.
   */
  readonly eventName: string;

  /**
   * Version of the event contract.
   */
  readonly eventVersion: number;

  /**
   * Identifier of the aggregate that emitted the event.
   */
  readonly aggregateId: string;

  /**
   * Type of the aggregate that emitted the event.
   */
  readonly aggregateType: string;

  /**
   * Correlation identifier connecting related operations/events.
   *
   * Optional because a domain operation may legitimately occur without an
   * externally supplied correlation context.
   */
  readonly correlationId?: string;

  /**
   * Identifier of the event/operation that directly caused this event.
   */
  readonly causationId?: string;

  /**
   * Timestamp at which the domain event was created.
   */
  readonly eventTimestamp: Date;

  /**
   * Platform that produced the event.
   */
  readonly producerPlatform: string;

  /**
   * Version of the serialized event schema.
   */
  readonly eventSchemaVersion: string;
}

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

export abstract class DomainEvent {
  /**
   * Immutable event metadata.
   */
  public readonly metadata: Readonly<EventMetadata>;

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
    producerPlatform = 'SisiMove Enterprise',
  ) {
    this.metadata = Object.freeze({
      eventId: randomUUID(),
      eventName,
      eventVersion,
      aggregateId,
      aggregateType,

      ...(correlationId !== undefined && { correlationId }),

      ...(causationId !== undefined && { causationId }),

      eventTimestamp: new Date(),
      producerPlatform,
      eventSchemaVersion,
    });
  }

  // ---------------------------------------------------------------------------
  // Serialization
  // ---------------------------------------------------------------------------

  /**
   * Returns the complete serialized representation of the event.
   *
   * Metadata remains separate from the domain-specific payload.
   */
  public toJSON(): Readonly<Record<string, unknown>> {
    return Object.freeze({
      metadata: this.metadata,
      ...this.getPayload(),
    });
  }

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  /**
   * Returns the event-specific payload.
   */
  protected abstract getPayload(): Record<string, unknown>;
}
