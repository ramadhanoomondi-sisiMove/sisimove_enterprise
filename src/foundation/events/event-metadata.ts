//src/foundation/events/event-metadata.ts
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
