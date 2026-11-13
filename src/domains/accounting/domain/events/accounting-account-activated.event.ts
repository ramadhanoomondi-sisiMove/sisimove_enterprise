import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';

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
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      accountId,
      'AccountingAccount',
      'AccountingAccountActivated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
    );

    Object.freeze(this);
  }

  // ===========================================================================
  // Rehydrate
  // ===========================================================================

  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): AccountingAccountActivatedEvent {
    const { publicId, code, type, status, activatedAt } = payload;

    // -------------------------------------------------------------------------
    // Validate Required Properties
    // -------------------------------------------------------------------------

    if (
      typeof publicId !== 'string' ||
      !publicId.trim() ||
      typeof code !== 'string' ||
      !code.trim() ||
      typeof type !== 'string' ||
      !type.trim() ||
      typeof status !== 'string' ||
      !status.trim()
    ) {
      throw new Error('Invalid payload for AccountingAccountActivated event');
    }

    // -------------------------------------------------------------------------
    // Restore Activation Date
    // -------------------------------------------------------------------------

    if (typeof activatedAt !== 'string' && !(activatedAt instanceof Date)) {
      throw new Error(
        'Invalid activatedAt value for AccountingAccountActivated event',
      );
    }

    const restoredActivatedAt =
      activatedAt instanceof Date
        ? new Date(activatedAt.getTime())
        : new Date(activatedAt);

    if (Number.isNaN(restoredActivatedAt.getTime())) {
      throw new Error(
        'Invalid activatedAt date for AccountingAccountActivated event',
      );
    }

    // -------------------------------------------------------------------------
    // Restore Event
    // -------------------------------------------------------------------------

    return new AccountingAccountActivatedEvent(
      metadata.aggregateId,
      publicId,
      code,
      type,
      status,
      restoredActivatedAt,
      metadata.correlationId ?? '',
      metadata.causationId,
      metadata.eventVersion,
      metadata.eventSchemaVersion,
      metadata,
    );
  }

  // ===========================================================================
  // Payload
  // ===========================================================================

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId,
      code: this.code,
      type: this.type,
      status: this.status,
      activatedAt: this.activatedAt.toISOString(),
    };
  }
}

export default AccountingAccountActivatedEvent;
