export interface IdempotencyStore {
  /**
   * Returns true if this consumer has already processed the event.
   */
  exists(consumerName: string, eventId: string): Promise<boolean>;

  /**
   * Atomically acquires a processing claim for this consumer and event.
   *
   * Returns:
   * - A unique claim token if ownership is acquired.
   * - null if the event is already processed or another worker
   *   currently holds an unexpired claim.
   *
   * An expired claim may be acquired by another worker.
   *
   * leaseDurationMs defines how long the claim remains valid.
   */
  acquireClaim(
    consumerName: string,
    eventId: string,
    leaseDurationMs: number,
  ): Promise<string | null>;

  /**
   * Marks the event as processed by this consumer.
   *
   * The supplied claim token must match the current claim owner.
   *
   * Implementations must atomically:
   * - verify claim ownership;
   * - create the ProcessedEvent record;
   * - remove the processing claim.
   *
   * Must reject completion attempts from stale claim owners.
   */
  markProcessed(
    consumerName: string,
    eventId: string,
    claimToken: string,
  ): Promise<void>;
}
