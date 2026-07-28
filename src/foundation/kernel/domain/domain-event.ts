import { randomUUID } from 'crypto';

export interface EventMetadata {
  readonly eventId: string;
  readonly eventName: string;
  readonly eventVersion: number;
  readonly aggregateId: string;
  readonly aggregateType: string;
  readonly correlationId: string;
  readonly causationId?: string;
  readonly eventTimestamp: Date;
  readonly producerPlatform: string;
  readonly eventSchemaVersion: string;
}

export abstract class DomainEvent {
  public readonly metadata: Readonly<EventMetadata>;

  protected constructor(
    aggregateId: string,
    aggregateType: string,
    eventName: string,
    correlationId: string,
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
      correlationId,
      ...(causationId !== undefined && { causationId }),
      eventTimestamp: new Date(),
      producerPlatform,
      eventSchemaVersion,
    });
  }

  public toJSON(): Readonly<Record<string, unknown>> {
    return Object.freeze({
      metadata: this.metadata,
      ...this.getPayload(),
    });
  }

  protected abstract getPayload(): Record<string, unknown>;
}
