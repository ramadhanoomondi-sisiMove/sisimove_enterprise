// -----------------------------------------------------------------------------
// Accounting Account — Closed Domain Event
// -----------------------------------------------------------------------------
//
// Raised when an Accounting Account aggregate transitions to CLOSED.
//
// CLOSED is a terminal Accounting Account lifecycle state.
//
// Aggregate:
//
// AccountingAccountAggregate
// └── AccountingAccountEntity
//
// -----------------------------------------------------------------------------
//
// Event data:
//
// - Accounting Account public identity;
// - account code;
// - account type;
// - resulting status;
// - closure timestamp.
//
// Internal aggregate identity remains in DomainEvent.metadata.
//
// -----------------------------------------------------------------------------
//
// Historical journal lines are intentionally not included in this event.
// Closing an account does not remove or alter historical accounting postings.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Accounting
// -----------------------------------------------------------------------------

import { AccountingDomainEvent } from './accounting-domain.event';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Raised when an Accounting Account aggregate is closed.
 */
export class AccountingAccountClosedEvent extends AccountingDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    accountId: string,
    public readonly publicId: string,
    public readonly code: string,
    public readonly type: string,
    public readonly status: string,
    public readonly closedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      accountId,
      'AccountingAccount',
      'AccountingAccountClosed',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  // ===========================================================================
  // Payload
  // ===========================================================================

  /**
   * Returns the event-specific payload.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId,
      code: this.code,
      type: this.type,
      status: this.status,
      closedAt: this.closedAt,
    };
  }
}
