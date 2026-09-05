// -----------------------------------------------------------------------------
// Accounting Account — Inactivated Domain Event
// -----------------------------------------------------------------------------
//
// Raised when an Accounting Account aggregate transitions to INACTIVE.
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
// - inactivation timestamp.
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
 * Raised when an Accounting Account aggregate is inactivated.
 */
export class AccountingAccountInactivatedEvent extends AccountingDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    accountId: string,
    public readonly publicId: string,
    public readonly code: string,
    public readonly type: string,
    public readonly status: string,
    public readonly inactivatedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      accountId,
      'AccountingAccount',
      'AccountingAccountInactivated',
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
      inactivatedAt: this.inactivatedAt,
    };
  }
}
