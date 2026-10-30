// -----------------------------------------------------------------------------
// Financial Payment Provider Name
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface FinancialPaymentProviderNameProps {
  value: string;
}

export class FinancialPaymentProviderName extends ValueObject<FinancialPaymentProviderNameProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(value: string): FinancialPaymentProviderName {
    const normalized = value.trim();

    FinancialPaymentProviderName.validate(normalized);

    return new FinancialPaymentProviderName(normalized);
  }

  private static validate(value: string): void {
    if (!value) {
      throw new Error('Financial Payment Provider Name cannot be empty.');
    }

    if (value.length > 120) {
      throw new Error(
        'Financial Payment Provider Name cannot exceed 120 characters.',
      );
    }
  }

  public get value(): string {
    return this.props.value;
  }

  public override toString(): string {
    return this.props.value;
  }
}

export type { FinancialPaymentProviderNameProps };