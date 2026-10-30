// -----------------------------------------------------------------------------
// Financial Payment Provider Type
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

export type FinancialPaymentProviderTypeValue =
  | 'MOBILE_MONEY'
  | 'BANK'
  | 'CARD_PROCESSOR'
  | 'PAYMENT_GATEWAY'
  | 'DIGITAL_WALLET'
  | 'OTHER';

interface FinancialPaymentProviderTypeProps {
  value: FinancialPaymentProviderTypeValue;
}

const FINANCIAL_PAYMENT_PROVIDER_TYPES: readonly FinancialPaymentProviderTypeValue[] =
  [
    'MOBILE_MONEY',
    'BANK',
    'CARD_PROCESSOR',
    'PAYMENT_GATEWAY',
    'DIGITAL_WALLET',
    'OTHER',
  ];

export class FinancialPaymentProviderType extends ValueObject<FinancialPaymentProviderTypeProps> {
  private constructor(value: FinancialPaymentProviderTypeValue) {
    super({ value });
  }

  public static create(value: string): FinancialPaymentProviderType {
    const normalized = value.trim().toUpperCase();

    FinancialPaymentProviderType.validate(normalized);

    return new FinancialPaymentProviderType(
      normalized as FinancialPaymentProviderTypeValue,
    );
  }

  private static validate(value: string): void {
    if (
      !FINANCIAL_PAYMENT_PROVIDER_TYPES.includes(
        value as FinancialPaymentProviderTypeValue,
      )
    ) {
      throw new Error(`Invalid Financial Payment Provider Type: ${value}`);
    }
  }

  public isMobileMoney(): boolean {
    return this.props.value === 'MOBILE_MONEY';
  }

  public isBank(): boolean {
    return this.props.value === 'BANK';
  }

  public isCardProcessor(): boolean {
    return this.props.value === 'CARD_PROCESSOR';
  }

  public isPaymentGateway(): boolean {
    return this.props.value === 'PAYMENT_GATEWAY';
  }

  public isDigitalWallet(): boolean {
    return this.props.value === 'DIGITAL_WALLET';
  }

  public isOther(): boolean {
    return this.props.value === 'OTHER';
  }

  public get value(): FinancialPaymentProviderTypeValue {
    return this.props.value;
  }

  public override toString(): string {
    return this.props.value;
  }
}

export { FINANCIAL_PAYMENT_PROVIDER_TYPES };
export type { FinancialPaymentProviderTypeProps };