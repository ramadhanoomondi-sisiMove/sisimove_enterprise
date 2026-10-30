// -----------------------------------------------------------------------------
// Financial Payment Provider Enabled Domain Event
// -----------------------------------------------------------------------------

import type { FinancialPaymentProviderPublicId } from '../value-objects/financial-payment-provider-public-id.vo';

import { FinancialPaymentProviderDomainEvent } from './financial-payment-provider-domain.event';

export class FinancialPaymentProviderEnabledEvent extends FinancialPaymentProviderDomainEvent {
  public constructor(
    aggregateId: string,
    publicId: FinancialPaymentProviderPublicId,
    enabledAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialPaymentProviderEnabled',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.enabledAt = new Date(enabledAt.getTime());
  }

  public readonly publicId: FinancialPaymentProviderPublicId;
  public readonly enabledAt: Date;

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId.toString(),
      enabledAt: this.enabledAt.toISOString(),
    };
  }
}
