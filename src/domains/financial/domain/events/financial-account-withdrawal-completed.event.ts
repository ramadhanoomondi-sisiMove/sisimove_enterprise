import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';

import { FinancialDomainEvent } from './financial-domain.event';

import type {
  FinancialAccountWithdrawalPublicId,
  FinancialAccountPublicId,
} from '../value-objects';

import {
  FinancialAccountWithdrawalPublicId as FinancialAccountWithdrawalPublicIdValue,
  FinancialAccountPublicId as FinancialAccountPublicIdValue,
} from '../value-objects';

// =============================================================================
// Event
// =============================================================================

export class FinancialAccountWithdrawalCompletedEvent extends FinancialDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    aggregateId: string,
    withdrawalPublicId: FinancialAccountWithdrawalPublicId,
    accountPublicId: FinancialAccountPublicId,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      aggregateId,
      'FinancialAccountWithdrawal',
      'FinancialAccountWithdrawalCompleted',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
    );

    this.withdrawalPublicId = withdrawalPublicId;
    this.accountPublicId = accountPublicId;
  }

  // ===========================================================================
  // Properties
  // ===========================================================================

  public readonly withdrawalPublicId: FinancialAccountWithdrawalPublicId;

  public readonly accountPublicId: FinancialAccountPublicId;

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): FinancialAccountWithdrawalCompletedEvent {
    const withdrawalPublicId = payload.withdrawalPublicId;
    const accountPublicId = payload.accountPublicId;

    if (
      typeof withdrawalPublicId !== 'string' ||
      typeof accountPublicId !== 'string'
    ) {
      throw new Error(
        'Invalid payload for FinancialAccountWithdrawalCompleted event',
      );
    }

    return new FinancialAccountWithdrawalCompletedEvent(
      metadata.aggregateId,
      new FinancialAccountWithdrawalPublicIdValue(withdrawalPublicId),
      new FinancialAccountPublicIdValue(accountPublicId),
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

      withdrawalPublicId: this.withdrawalPublicId.toString(),

      accountPublicId: this.accountPublicId.toString(),
    };
  }
}
