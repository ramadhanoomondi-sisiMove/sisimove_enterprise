// -----------------------------------------------------------------------------
// Financial Transaction Failed Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a pending Financial Transaction fails.
//
// Failure is terminal for the transaction aggregate.
//
// Provider-specific failure details belong to Payment, Settlement,
// Disbursement, or another appropriate financial workflow aggregate.
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
  FinancialAccountReference,
  FinancialTransactionReference,
  Money,
} from '../value-objects';

import {
  FinancialTransactionType as FinancialTransactionTypeValue,
  FinancialAccountReference as FinancialAccountReferenceValue,
  FinancialTransactionReference as FinancialTransactionReferenceValue,
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

export class FinancialTransactionFailedEvent extends FinancialDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    type: FinancialTransactionType,
    amount: Money,
    sourceAccount: FinancialAccountReference | undefined,
    destinationAccount: FinancialAccountReference | undefined,
    reference: FinancialTransactionReference | undefined,
    failedAt: Date,
    reason: string | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      aggregateId,
      'FinancialTransaction',
      'FinancialTransactionFailed',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
    );

    this.publicId = publicId;
    this.type = type;
    this.amount = amount;
    this.sourceAccount = sourceAccount;
    this.destinationAccount = destinationAccount;
    this.reference = reference;
    this.failedAt = failedAt;
    this.reason = reason;
  }

  // ===========================================================================
  // Properties
  // ===========================================================================

  public readonly publicId: PublicEntityId;

  public readonly type: FinancialTransactionType;

  public readonly amount: Money;

  public readonly sourceAccount: FinancialAccountReference | undefined;

  public readonly destinationAccount: FinancialAccountReference | undefined;

  public readonly reference: FinancialTransactionReference | undefined;

  public readonly failedAt: Date;

  /**
   * Domain-level explanation for the failure.
   *
   * Provider-specific failure information must remain inside the aggregate
   * responsible for the provider interaction.
   */
  public readonly reason: string | undefined;

  // ===========================================================================
  // Rehydrate
  // ===========================================================================

  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): FinancialTransactionFailedEvent {
    const {
      publicId,
      type,
      amount,
      currency,
      sourceAccount,
      destinationAccount,
      reference,
      failedAt,
      reason,
    } = payload;

    if (
      typeof publicId !== 'string' ||
      typeof type !== 'string' ||
      typeof amount !== 'number' ||
      !Number.isFinite(amount) ||
      typeof currency !== 'string' ||
      typeof failedAt !== 'string' ||
      (sourceAccount !== undefined && typeof sourceAccount !== 'string') ||
      (destinationAccount !== undefined &&
        typeof destinationAccount !== 'string') ||
      (reference !== undefined && typeof reference !== 'string') ||
      (reason !== undefined && typeof reason !== 'string')
    ) {
      throw new Error('Invalid payload for FinancialTransactionFailed event');
    }

    const failedAtDate = new Date(failedAt);

    if (Number.isNaN(failedAtDate.getTime())) {
      throw new Error(
        'Invalid failedAt date for FinancialTransactionFailed event',
      );
    }

    return new FinancialTransactionFailedEvent(
      metadata.aggregateId,
      new PublicEntityIdValue(publicId),
      FinancialTransactionTypeValue.create(type),
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
      failedAtDate,
      typeof reason === 'string' ? reason : undefined,
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

      amount: this.amount.amount,

      currency: this.amount.currency.toString(),

      sourceAccount: this.sourceAccount?.toString(),

      destinationAccount: this.destinationAccount?.toString(),

      reference: this.reference?.toString(),

      failedAt: this.failedAt.toISOString(),

      reason: this.reason,
    };
  }
}
