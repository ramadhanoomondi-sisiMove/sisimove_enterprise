// -----------------------------------------------------------------------------
// Accounting Account — Created Domain Event
// -----------------------------------------------------------------------------
//
// Raised when an Accounting Account aggregate is created.
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
// - account name;
// - account type;
// - account status;
// - creation timestamp.
//
// The Accounting Account internal identity remains in
// DomainEvent.metadata.aggregateId.
//
// Parent-account hierarchy is intentionally not included here because the
// AccountingAccountEntity stores the parent as an internal UniqueEntityId and
// does not expose a parent public identity.
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
 * Raised when an Accounting Account aggregate is created.
 *
 * The aggregate's internal identity is carried by
 * DomainEvent.metadata.aggregateId.
 *
 * The event payload exposes only stable account-level data intended for
 * downstream consumers.
 */
export class AccountingAccountCreatedEvent extends AccountingDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    accountId: string,
    public readonly publicId: string,
    public readonly code: string,
    public readonly name: string,
    public readonly type: string,
    public readonly status: string,
    public readonly createdAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      accountId,
      'AccountingAccount',
      'AccountingAccountCreated',
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
   *
   * The internal Accounting Account identity remains in
   * DomainEvent.metadata.aggregateId.
   */
  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId,
      code: this.code,
      name: this.name,
      type: this.type,
      status: this.status,
      createdAt: this.createdAt,
    };
  }
}
