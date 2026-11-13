// -----------------------------------------------------------------------------
// Financial Transaction Created Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Transaction aggregate is created.
//
// This event represents the creation of the financial transaction itself.
// Transaction entries are intentionally excluded because entry mutations are
// internal aggregate concerns.
//
// Accounting remains outside the Financial bounded context and is referenced
// only through an opaque accounting journal public identifier when applicable.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';

import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

import { PublicEntityId as PublicEntityIdValue } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Financial
// -----------------------------------------------------------------------------

import { FinancialDomainEvent } from './financial-domain.event';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type {
  FinancialTransactionType,
  FinancialTransactionStatus,
  FinancialTransactionReference,
  FinancialAccountReference,
  Money,
} from '../value-objects';

import {
  FinancialTransactionType as FinancialTransactionTypeValue,
  FinancialTransactionStatus as FinancialTransactionStatusValue,
  FinancialTransactionReference as FinancialTransactionReferenceValue,
  FinancialAccountReference as FinancialAccountReferenceValue,
  Money as MoneyValue,
} from '../value-objects';

// =============================================================================
// Reference Rehydration Helpers
// =============================================================================

function parseReference(
  value: string,
  errorMessage: string,
): { type: string; publicId: string } {
  const separatorIndex = value.indexOf(':');

  if (separatorIndex <= 0 || separatorIndex === value.length - 1) {
    throw new Error(errorMessage);
  }

  return {
    type: value.slice(0, separatorIndex),
    publicId: value.slice(separatorIndex + 1),
  };
}

function rehydrateAccountReference(
  value: string | undefined,
): FinancialAccountReference | undefined {
  if (value === undefined) {
    return undefined;
  }

  const reference = parseReference(
    value,
    'Invalid Financial Account Reference payload',
  );

  return FinancialAccountReferenceValue.create(
    reference.type,
    reference.publicId,
  );
}

function rehydrateTransactionReference(
  value: string | undefined,
): FinancialTransactionReference | undefined {
  if (value === undefined) {
    return undefined;
  }

  const reference = parseReference(
    value,
    'Invalid Financial Transaction Reference payload',
  );

  return FinancialTransactionReferenceValue.create(
    reference.type,
    reference.publicId,
  );
}

// =============================================================================
// Event
// =============================================================================

export class FinancialTransactionCreatedEvent extends FinancialDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    type: FinancialTransactionType,
    status: FinancialTransactionStatus,
    amount: Money,
    sourceAccount: FinancialAccountReference | undefined,
    destinationAccount: FinancialAccountReference | undefined,
    reference: FinancialTransactionReference | undefined,
    accountingJournalPublicId: string | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      aggregateId,
      'FinancialTransaction',
      'FinancialTransactionCreated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
    );

    this.publicId = publicId;
    this.type = type;
    this.status = status;
    this.amount = amount;
    this.sourceAccount = sourceAccount;
    this.destinationAccount = destinationAccount;
    this.reference = reference;
    this.accountingJournalPublicId = accountingJournalPublicId;
  }

  // ===========================================================================
  // Properties
  // ===========================================================================

  public readonly publicId: PublicEntityId;

  public readonly type: FinancialTransactionType;

  public readonly status: FinancialTransactionStatus;

  public readonly amount: Money;

  public readonly sourceAccount: FinancialAccountReference | undefined;

  public readonly destinationAccount: FinancialAccountReference | undefined;

  public readonly reference: FinancialTransactionReference | undefined;

  /**
   * Opaque cross-domain reference to the Accounting Domain journal.
   *
   * The Financial Domain does not depend on Accounting Domain models.
   */
  public readonly accountingJournalPublicId: string | undefined;

  // ===========================================================================
  // Rehydrate
  // ===========================================================================

  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): FinancialTransactionCreatedEvent {
    const {
      publicId,
      type,
      status,
      amount,
      currency,
      sourceAccount,
      destinationAccount,
      reference,
      accountingJournalPublicId,
    } = payload;

    if (
      typeof publicId !== 'string' ||
      typeof type !== 'string' ||
      typeof status !== 'string' ||
      typeof amount !== 'number' ||
      !Number.isFinite(amount) ||
      typeof currency !== 'string' ||
      (sourceAccount !== undefined && typeof sourceAccount !== 'string') ||
      (destinationAccount !== undefined &&
        typeof destinationAccount !== 'string') ||
      (reference !== undefined && typeof reference !== 'string') ||
      (accountingJournalPublicId !== undefined &&
        typeof accountingJournalPublicId !== 'string')
    ) {
      throw new Error('Invalid payload for FinancialTransactionCreated event');
    }

    return new FinancialTransactionCreatedEvent(
      metadata.aggregateId,
      new PublicEntityIdValue(publicId),
      FinancialTransactionTypeValue.create(type),
      FinancialTransactionStatusValue.create(status),
      MoneyValue.fromCode(amount, currency),
      rehydrateAccountReference(
        typeof sourceAccount === 'string' ? sourceAccount : undefined,
      ),
      rehydrateAccountReference(
        typeof destinationAccount === 'string' ? destinationAccount : undefined,
      ),
      rehydrateTransactionReference(
        typeof reference === 'string' ? reference : undefined,
      ),
      typeof accountingJournalPublicId === 'string'
        ? accountingJournalPublicId
        : undefined,
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

      publicId: this.publicId.toString(),

      type: this.type.toString(),

      status: this.status.toString(),

      amount: this.amount.amount,

      currency: this.amount.currency.toString(),

      sourceAccount: this.sourceAccount?.toString(),

      destinationAccount: this.destinationAccount?.toString(),

      reference: this.reference?.toString(),

      accountingJournalPublicId: this.accountingJournalPublicId,
    };
  }
}
