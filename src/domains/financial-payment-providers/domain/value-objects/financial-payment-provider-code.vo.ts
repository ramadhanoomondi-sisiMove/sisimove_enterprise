// -----------------------------------------------------------------------------
// Financial Payment Provider Code
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface FinancialPaymentProviderCodeProps {
  value: string;
}

export class FinancialPaymentProviderCode extends ValueObject<FinancialPaymentProviderCodeProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(value: string): FinancialPaymentProviderCode {
    const normalized = value.trim().toUpperCase();

    FinancialPaymentProviderCode.validate(normalized);

    return new FinancialPaymentProviderCode(normalized);
  }

  private static validate(value: string): void {
    if (!value) {
      throw new Error('Financial Payment Provider Code cannot be empty.');
    }

    if (value.length > 50) {
      throw new Error(
        'Financial Payment Provider Code cannot exceed 50 characters.',
      );
    }

    if (!/^[A-Z0-9]+(?:[_-][A-Z0-9]+)*$/.test(value)) {
      throw new Error(`Invalid Financial Payment Provider Code: ${value}`);
    }
  }

  public get value(): string {
    return this.props.value;
  }

  public override toString(): string {
    return this.props.value;
  }
}

export type { FinancialPaymentProviderCodeProps };
