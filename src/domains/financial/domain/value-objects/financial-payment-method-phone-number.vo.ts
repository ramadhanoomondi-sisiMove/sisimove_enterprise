// -----------------------------------------------------------------------------
// Financial Payment Method Phone Number
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialPaymentMethodPhoneNumberProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const KENYA_COUNTRY_CODE = '+254';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Normalized Kenyan mobile-money phone number.
 *
 * Used to identify the customer's registered M-PESA destination.
 *
 * Supported input examples:
 *
 * - 0712345678
 * - 0112345678
 * - 254712345678
 * - +254712345678
 *
 * The stored value is always normalized to international format.
 */
export class FinancialPaymentMethodPhoneNumber extends ValueObject<FinancialPaymentMethodPhoneNumberProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: string) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a normalized Kenyan mobile-money phone number.
   */
  public static create(value: string): FinancialPaymentMethodPhoneNumber {
    const normalized = FinancialPaymentMethodPhoneNumber.normalize(value);

    FinancialPaymentMethodPhoneNumber.validate(normalized);

    return new FinancialPaymentMethodPhoneNumber(normalized);
  }

  // ---------------------------------------------------------------------------
  // Normalization
  // ---------------------------------------------------------------------------

  private static normalize(value: string): string {
    let normalized = value.trim().replace(/[\s()-]/g, '');

    if (/^0[17]\d{8}$/.test(normalized)) {
      normalized = `${KENYA_COUNTRY_CODE}${normalized.slice(1)}`;
    } else if (/^254[17]\d{8}$/.test(normalized)) {
      normalized = `+${normalized}`;
    }

    return normalized;
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!/^\+254[17]\d{8}$/.test(value)) {
      throw new Error(
        'Financial payment method phone number must be a valid Kenyan mobile number',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isValid(): boolean {
    return /^\+254[17]\d{8}$/.test(this.props.value);
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): string {
    return this.props.value;
  }

  // ---------------------------------------------------------------------------
  // Serialization
  // ---------------------------------------------------------------------------

  public override toString(): string {
    return this.props.value;
  }
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export { KENYA_COUNTRY_CODE };

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialPaymentMethodPhoneNumberProps };
