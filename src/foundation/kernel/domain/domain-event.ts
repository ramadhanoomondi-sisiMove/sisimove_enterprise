import { randomUUID } from 'crypto';

// -----------------------------------------------------------------------------
// Event Metadata
// -----------------------------------------------------------------------------

export interface EventMetadata {
  readonly eventId: string;
  readonly eventName: string;
  readonly eventVersion: number;
  readonly aggregateId: string;
  readonly aggregateType: string;
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly eventTimestamp: Date;
  readonly producerPlatform: string;
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
    restoredMetadata?: EventMetadata,
  ) {
    if (restoredMetadata !== undefined) {
      if (
        restoredMetadata.aggregateId !== aggregateId ||
        restoredMetadata.aggregateType !== aggregateType ||
        restoredMetadata.eventName !== eventName
      ) {
        throw new Error(
          'Restored event metadata does not match the event identity',
        );
      }

      this.metadata = Object.freeze({
        ...restoredMetadata,
        eventTimestamp: new Date(restoredMetadata.eventTimestamp),
      });

      return;
    }

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
