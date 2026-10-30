// -----------------------------------------------------------------------------
// Financial Payment Provider Capability Enabled Domain Event
// -----------------------------------------------------------------------------

import type { FinancialPaymentProviderPublicId } from '../value-objects/financial-payment-provider-public-id.vo';
import type { FinancialPaymentProviderCapabilityPublicId } from '../value-objects/financial-payment-provider-capability-public-id.vo';
import type { FinancialPaymentProviderCapabilityType } from '../value-objects/financial-payment-provider-capability-type.vo';

import { FinancialPaymentProviderDomainEvent } from './financial-payment-provider-domain.event';

export class FinancialPaymentProviderCapabilityEnabledEvent extends FinancialPaymentProviderDomainEvent {
  public constructor(
    aggregateId: string,
    providerPublicId: FinancialPaymentProviderPublicId,
    capabilityPublicId: FinancialPaymentProviderCapabilityPublicId,
    capabilityType: FinancialPaymentProviderCapabilityType,
    enabledAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialPaymentProviderCapabilityEnabled',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.providerPublicId = providerPublicId;
    this.capabilityPublicId = capabilityPublicId;
    this.capabilityType = capabilityType;
    this.enabledAt = new Date(enabledAt.getTime());
  }

  public readonly providerPublicId: FinancialPaymentProviderPublicId;
  public readonly capabilityPublicId: FinancialPaymentProviderCapabilityPublicId;
  public readonly capabilityType: FinancialPaymentProviderCapabilityType;
  public readonly enabledAt: Date;

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      providerPublicId: this.providerPublicId.toString(),
      capabilityPublicId: this.capabilityPublicId.toString(),
      capabilityType: this.capabilityType.toString(),
      enabledAt: this.enabledAt.toISOString(),
    };
  }
}
