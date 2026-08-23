// -----------------------------------------------------------------------------
// Financial Domain Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

// -----------------------------------------------------------------------------
// Financial Domain Event
// -----------------------------------------------------------------------------

/**
 * Base domain event for the Financial bounded context.
 *
 * Financial contains multiple independent aggregate roots, including:
 *
 * - FinancialAccountAggregate;
 * - FinancialTransactionAggregate;
 * - FinancialPaymentAggregate;
 * - FinancialAccountHoldAggregate;
 * - FinancialSettlementAggregate;
 * - FinancialAccountWithdrawalAggregate;
 * - FinancialDisbursementAggregate.
 *
 * This base event therefore represents the aggregate that actually emitted
 * the event. It does not represent a fictional parent FinancialAggregate.
 *
 * Aggregate identity is stored in the inherited DomainEvent metadata.
 */
export abstract class FinancialDomainEvent extends DomainEvent {
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
   * Returns the common payload shared by Financial domain events.
   *
   * Aggregate identity remains in DomainEvent.metadata and is therefore not
   * duplicated in the event payload.
   */
  protected getBasePayload(): Record<string, unknown> {
    return {};
  }
}
