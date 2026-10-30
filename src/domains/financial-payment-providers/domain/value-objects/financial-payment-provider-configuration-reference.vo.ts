// -----------------------------------------------------------------------------
// Financial Payment Provider Configuration Reference
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface FinancialPaymentProviderConfigurationReferenceProps {
  value: string;
}

/**
 * Reference to securely stored provider configuration.
 *
 * This value object must contain a reference or identifier, never the secret
 * credentials themselves.
 */
export class FinancialPaymentProviderConfigurationReference extends ValueObject<FinancialPaymentProviderConfigurationReferenceProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(
    value: string,
  ): FinancialPaymentProviderConfigurationReference {
    const normalized = value.trim();

    if (!normalized) {
      throw new Error(
        'Financial Payment Provider Configuration Reference cannot be empty.',
      );
    }

    if (normalized.length > 255) {
      throw new Error(
        'Financial Payment Provider Configuration Reference cannot exceed 255 characters.',
      );
    }

    return new FinancialPaymentProviderConfigurationReference(normalized);
  }

  public get value(): string {
    return this.props.value;
  }

  public override toString(): string {
    return this.props.value;
  }
}

export type { FinancialPaymentProviderConfigurationReferenceProps };