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

export class FinancialAccountWithdrawalFailedEvent extends FinancialDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    aggregateId: string,
    withdrawalPublicId: FinancialAccountWithdrawalPublicId,
    accountPublicId: FinancialAccountPublicId,
    reason: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      aggregateId,
      'FinancialAccountWithdrawal',
      'FinancialAccountWithdrawalFailed',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
    );

    this.withdrawalPublicId = withdrawalPublicId;
    this.accountPublicId = accountPublicId;
    this.reason = FinancialAccountWithdrawalFailedEvent.normalizeReason(reason);
  }

  // ===========================================================================
  // Properties
  // ===========================================================================

  public readonly withdrawalPublicId: FinancialAccountWithdrawalPublicId;

  public readonly accountPublicId: FinancialAccountPublicId;

  public readonly reason: string;

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): FinancialAccountWithdrawalFailedEvent {
    const withdrawalPublicId = payload.withdrawalPublicId;
    const accountPublicId = payload.accountPublicId;
    const reason = payload.reason;

    if (
      typeof withdrawalPublicId !== 'string' ||
      typeof accountPublicId !== 'string' ||
      typeof reason !== 'string'
    ) {
      throw new Error(
        'Invalid payload for FinancialAccountWithdrawalFailed event',
      );
    }

    return new FinancialAccountWithdrawalFailedEvent(
      metadata.aggregateId,
      new FinancialAccountWithdrawalPublicIdValue(withdrawalPublicId),
      new FinancialAccountPublicIdValue(accountPublicId),
      reason,
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

      reason: this.reason,
    };
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  private static normalizeReason(reason: string): string {
    const normalized = reason.trim();

    if (normalized.length === 0) {
      throw new Error(
        'Financial Account Withdrawal failure reason must not be empty',
      );
    }

    if (normalized.length > 500) {
      throw new Error(
        'Financial Account Withdrawal failure reason must not exceed 500 characters',
      );
    }

    return normalized;
  }
}
