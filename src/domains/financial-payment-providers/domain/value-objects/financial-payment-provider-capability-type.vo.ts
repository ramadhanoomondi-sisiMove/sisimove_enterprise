// -----------------------------------------------------------------------------
// Financial Payment Provider Capability Type
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

export type FinancialPaymentProviderCapabilityTypeValue =
  | 'INITIATE_PAYMENT'
  | 'VERIFY_PAYMENT'
  | 'QUERY_PAYMENT'
  | 'REFUND_PAYMENT'
  | 'INITIATE_DISBURSEMENT'
  | 'VERIFY_DISBURSEMENT'
  | 'QUERY_BALANCE'
  | 'WEBHOOKS';

interface FinancialPaymentProviderCapabilityTypeProps {
  value: FinancialPaymentProviderCapabilityTypeValue;
}

const FINANCIAL_PAYMENT_PROVIDER_CAPABILITY_TYPES: readonly FinancialPaymentProviderCapabilityTypeValue[] =
  [
    'INITIATE_PAYMENT',
    'VERIFY_PAYMENT',
    'QUERY_PAYMENT',
    'REFUND_PAYMENT',
    'INITIATE_DISBURSEMENT',
    'VERIFY_DISBURSEMENT',
    'QUERY_BALANCE',
    'WEBHOOKS',
  ];

export class FinancialPaymentProviderCapabilityType extends ValueObject<FinancialPaymentProviderCapabilityTypeProps> {
  private constructor(value: FinancialPaymentProviderCapabilityTypeValue) {
    super({ value });
  }

  public static create(value: string): FinancialPaymentProviderCapabilityType {
    const normalized = value.trim().toUpperCase();

    if (
      !FINANCIAL_PAYMENT_PROVIDER_CAPABILITY_TYPES.includes(
        normalized as FinancialPaymentProviderCapabilityTypeValue,
      )
    ) {
      throw new Error(
        `Invalid Financial Payment Provider Capability Type: ${value}`,
      );
    }

    return new FinancialPaymentProviderCapabilityType(
      normalized as FinancialPaymentProviderCapabilityTypeValue,
    );
  }

  public isInitiatePayment(): boolean {
    return this.props.value === 'INITIATE_PAYMENT';
  }

  public isVerifyPayment(): boolean {
    return this.props.value === 'VERIFY_PAYMENT';
  }

  public isQueryPayment(): boolean {
    return this.props.value === 'QUERY_PAYMENT';
  }

  public isRefundPayment(): boolean {
    return this.props.value === 'REFUND_PAYMENT';
  }

  public isInitiateDisbursement(): boolean {
    return this.props.value === 'INITIATE_DISBURSEMENT';
  }

  public isVerifyDisbursement(): boolean {
    return this.props.value === 'VERIFY_DISBURSEMENT';
  }

  public isQueryBalance(): boolean {
    return this.props.value === 'QUERY_BALANCE';
  }

  public supportsWebhooks(): boolean {
    return this.props.value === 'WEBHOOKS';
  }

  public get value(): FinancialPaymentProviderCapabilityTypeValue {
    return this.props.value;
  }

  public override toString(): string {
    return this.props.value;
  }
}

export { FINANCIAL_PAYMENT_PROVIDER_CAPABILITY_TYPES };
export type { FinancialPaymentProviderCapabilityTypeProps };
