//src/foundation/events/idempotency.interface.ts
export interface IdempotencyStore {
  /**
   * Returns true if this consumer has already processed the event.
   */
  exists(consumerName: string, eventId: string): Promise<boolean>;

  /**
   * Marks this event as processed by this consumer.
   */
  markProcessed(consumerName: string, eventId: string): Promise<void>;
}
