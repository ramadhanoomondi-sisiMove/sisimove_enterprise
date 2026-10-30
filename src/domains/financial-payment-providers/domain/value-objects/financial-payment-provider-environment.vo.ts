// -----------------------------------------------------------------------------
// Financial Payment Provider Environment
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

export type FinancialPaymentProviderEnvironmentValue = 'SANDBOX' | 'PRODUCTION';

interface FinancialPaymentProviderEnvironmentProps {
  value: FinancialPaymentProviderEnvironmentValue;
}

const FINANCIAL_PAYMENT_PROVIDER_ENVIRONMENTS: readonly FinancialPaymentProviderEnvironmentValue[] =
  ['SANDBOX', 'PRODUCTION'];

export class FinancialPaymentProviderEnvironment extends ValueObject<FinancialPaymentProviderEnvironmentProps> {
  private constructor(value: FinancialPaymentProviderEnvironmentValue) {
    super({ value });
  }

  public static create(value: string): FinancialPaymentProviderEnvironment {
    const normalized = value.trim().toUpperCase();

    if (
      !FINANCIAL_PAYMENT_PROVIDER_ENVIRONMENTS.includes(
        normalized as FinancialPaymentProviderEnvironmentValue,
      )
    ) {
      throw new Error(
        `Invalid Financial Payment Provider Environment: ${value}`,
      );
    }

    return new FinancialPaymentProviderEnvironment(
      normalized as FinancialPaymentProviderEnvironmentValue,
    );
  }

  public static sandbox(): FinancialPaymentProviderEnvironment {
    return new FinancialPaymentProviderEnvironment('SANDBOX');
  }

  public static production(): FinancialPaymentProviderEnvironment {
    return new FinancialPaymentProviderEnvironment('PRODUCTION');
  }

  public isSandbox(): boolean {
    return this.props.value === 'SANDBOX';
  }

  public isProduction(): boolean {
    return this.props.value === 'PRODUCTION';
  }

  public get value(): FinancialPaymentProviderEnvironmentValue {
    return this.props.value;
  }

  public override toString(): string {
    return this.props.value;
  }
}

export { FINANCIAL_PAYMENT_PROVIDER_ENVIRONMENTS };
export type { FinancialPaymentProviderEnvironmentProps };
