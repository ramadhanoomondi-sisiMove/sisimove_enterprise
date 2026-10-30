// -----------------------------------------------------------------------------
// Financial Payment Provider Status Changed Domain Event
// -----------------------------------------------------------------------------

import type { FinancialPaymentProviderPublicId } from '../value-objects/financial-payment-provider-public-id.vo';
import type { FinancialPaymentProviderStatus } from '../value-objects/financial-payment-provider-status.vo';

import { FinancialPaymentProviderDomainEvent } from './financial-payment-provider-domain.event';

export class FinancialPaymentProviderStatusChangedEvent extends FinancialPaymentProviderDomainEvent {
  public constructor(
    aggregateId: string,
    publicId: FinancialPaymentProviderPublicId,
    previousStatus: FinancialPaymentProviderStatus,
    newStatus: FinancialPaymentProviderStatus,
    changedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialPaymentProviderStatusChanged',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.previousStatus = previousStatus;
    this.newStatus = newStatus;
    this.changedAt = new Date(changedAt.getTime());
  }

  public readonly publicId: FinancialPaymentProviderPublicId;
  public readonly previousStatus: FinancialPaymentProviderStatus;
  public readonly newStatus: FinancialPaymentProviderStatus;
  public readonly changedAt: Date;

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId.toString(),
      previousStatus: this.previousStatus.toString(),
      newStatus: this.newStatus.toString(),
      changedAt: this.changedAt.toISOString(),
    };
  }
}
