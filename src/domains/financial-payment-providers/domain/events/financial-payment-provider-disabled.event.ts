//-----------------------------------------------------------------------------
// Financial Payment Provider Disabled Domain Event
// -----------------------------------------------------------------------------

import type { FinancialPaymentProviderPublicId } from '../value-objects/financial-payment-provider-public-id.vo';

import { FinancialPaymentProviderDomainEvent } from './financial-payment-provider-domain.event';

export class FinancialPaymentProviderDisabledEvent extends FinancialPaymentProviderDomainEvent {
  public constructor(
    aggregateId: string,
    publicId: FinancialPaymentProviderPublicId,
    disabledAt: Date,
    reason: string | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialPaymentProviderDisabled',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.disabledAt = new Date(disabledAt.getTime());
    this.reason = reason;
  }

  public readonly publicId: FinancialPaymentProviderPublicId;
  public readonly disabledAt: Date;
  public readonly reason: string | undefined;

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId.toString(),
      disabledAt: this.disabledAt.toISOString(),
      ...(this.reason !== undefined && { reason: this.reason }),
    };
  }
}
