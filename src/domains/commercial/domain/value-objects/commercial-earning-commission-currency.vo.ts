// -----------------------------------------------------------------------------
// Commercial Earning Commission Currency
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface CommercialEarningCommissionCurrencyProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const CURRENCY_CODE_LENGTH = 3;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * ISO-style three-letter currency code used by a Commercial Earning Commission.
 *
 * The currency is captured as part of the commission assessment snapshot so
 * that the commission remains unambiguous even if the surrounding journey or
 * settlement later changes.
 */
export class CommercialEarningCommissionCurrency extends ValueObject<CommercialEarningCommissionCurrencyProps> {
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
   * Creates a Commercial Earning Commission currency.
   *
   * The value is normalized to uppercase and validated before entering
   * the domain.
   */
  public static create(value: string): CommercialEarningCommissionCurrency {
    const normalized = value.trim().toUpperCase();

    CommercialEarningCommissionCurrency.validate(normalized);

    return new CommercialEarningCommissionCurrency(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (value.length !== CURRENCY_CODE_LENGTH) {
      throw new Error(
        `Commercial Earning Commission currency must contain exactly ${CURRENCY_CODE_LENGTH} characters`,
      );
    }

    if (!/^[A-Z]{3}$/.test(value)) {
      throw new Error(
        'Commercial Earning Commission currency must be a valid three-letter currency code',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public is(value: string): boolean {
    return this.props.value === value.trim().toUpperCase();
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

export { CURRENCY_CODE_LENGTH as COMMERCIAL_EARNING_COMMISSION_CURRENCY_CODE_LENGTH };

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { CommercialEarningCommissionCurrencyProps };
