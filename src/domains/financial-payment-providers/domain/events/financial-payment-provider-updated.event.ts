// -----------------------------------------------------------------------------
// Financial Payment Provider Updated Domain Event
// -----------------------------------------------------------------------------

import type { FinancialPaymentProviderPublicId } from '../value-objects/financial-payment-provider-public-id.vo';
import type { FinancialPaymentProviderCode } from '../value-objects/financial-payment-provider-code.vo';
import type { FinancialPaymentProviderName } from '../value-objects/financial-payment-provider-name.vo';
import type { FinancialPaymentProviderType } from '../value-objects/financial-payment-provider-type.vo';
import type { FinancialPaymentProviderEnvironment } from '../value-objects/financial-payment-provider-environment.vo';
import type { FinancialPaymentProviderStatus } from '../value-objects/financial-payment-provider-status.vo';

import { FinancialPaymentProviderDomainEvent } from './financial-payment-provider-domain.event';

export class FinancialPaymentProviderUpdatedEvent extends FinancialPaymentProviderDomainEvent {
  public constructor(
    aggregateId: string,
    publicId: FinancialPaymentProviderPublicId,
    code: FinancialPaymentProviderCode,
    name: FinancialPaymentProviderName,
    type: FinancialPaymentProviderType,
    environment: FinancialPaymentProviderEnvironment,
    status: FinancialPaymentProviderStatus,
    isEnabled: boolean,
    updatedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialPaymentProviderUpdated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.code = code;
    this.name = name;
    this.type = type;
    this.environment = environment;
    this.status = status;
    this.isEnabled = isEnabled;
    this.updatedAt = new Date(updatedAt.getTime());
  }

  public readonly publicId: FinancialPaymentProviderPublicId;
  public readonly code: FinancialPaymentProviderCode;
  public readonly name: FinancialPaymentProviderName;
  public readonly type: FinancialPaymentProviderType;
  public readonly environment: FinancialPaymentProviderEnvironment;
  public readonly status: FinancialPaymentProviderStatus;
  public readonly isEnabled: boolean;
  public readonly updatedAt: Date;

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId.toString(),
      code: this.code.toString(),
      name: this.name.toString(),
      type: this.type.toString(),
      environment: this.environment.toString(),
      status: this.status.toString(),
      isEnabled: this.isEnabled,
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
