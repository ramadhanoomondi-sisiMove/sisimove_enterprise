//src/foundation/events/idempotency.interface.ts
export interface IdempotencyStore {
  /**
   * Returns true if the event has already been processed.
   */
  exists(eventId: string): Promise<boolean>;

  /**
   * Marks an event as processed.
   */
  markProcessed(eventId: string): Promise<void>;
}
