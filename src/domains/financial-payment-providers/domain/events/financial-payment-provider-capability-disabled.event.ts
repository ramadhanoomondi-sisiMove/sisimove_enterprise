//-----------------------------------------------------------------------------
// Financial Payment Provider Capability Disabled Domain Event
// -----------------------------------------------------------------------------

import type { FinancialPaymentProviderPublicId } from '../value-objects/financial-payment-provider-public-id.vo';
import type { FinancialPaymentProviderCapabilityPublicId } from '../value-objects/financial-payment-provider-capability-public-id.vo';
import type { FinancialPaymentProviderCapabilityType } from '../value-objects/financial-payment-provider-capability-type.vo';

import { FinancialPaymentProviderDomainEvent } from './financial-payment-provider-domain.event';

export class FinancialPaymentProviderCapabilityDisabledEvent extends FinancialPaymentProviderDomainEvent {
  public constructor(
    aggregateId: string,
    providerPublicId: FinancialPaymentProviderPublicId,
    capabilityPublicId: FinancialPaymentProviderCapabilityPublicId,
    capabilityType: FinancialPaymentProviderCapabilityType,
    disabledAt: Date,
    reason: string | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialPaymentProviderCapabilityDisabled',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.providerPublicId = providerPublicId;
    this.capabilityPublicId = capabilityPublicId;
    this.capabilityType = capabilityType;
    this.disabledAt = new Date(disabledAt.getTime());
    this.reason = reason;
  }

  public readonly providerPublicId: FinancialPaymentProviderPublicId;
  public readonly capabilityPublicId: FinancialPaymentProviderCapabilityPublicId;
  public readonly capabilityType: FinancialPaymentProviderCapabilityType;
  public readonly disabledAt: Date;
  public readonly reason: string | undefined;

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      providerPublicId: this.providerPublicId.toString(),
      capabilityPublicId: this.capabilityPublicId.toString(),
      capabilityType: this.capabilityType.toString(),
      disabledAt: this.disabledAt.toISOString(),
      ...(this.reason !== undefined && { reason: this.reason }),
    };
  }
}
