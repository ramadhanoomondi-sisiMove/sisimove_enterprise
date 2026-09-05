// -----------------------------------------------------------------------------
// Accounting Account — Activated Domain Event
// -----------------------------------------------------------------------------
//
// Raised when an Accounting Account aggregate transitions to ACTIVE.
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
// - activation timestamp.
//
// Internal aggregate identity remains in DomainEvent.metadata.
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
 * Raised when an Accounting Account aggregate is activated.
 */
export class AccountingAccountActivatedEvent extends AccountingDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    accountId: string,
    public readonly publicId: string,
    public readonly code: string,
    public readonly type: string,
    public readonly status: string,
    public readonly activatedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      accountId,
      'AccountingAccount',
      'AccountingAccountActivated',
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
      activatedAt: this.activatedAt,
    };
  }
}
