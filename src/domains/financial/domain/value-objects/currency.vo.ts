// -----------------------------------------------------------------------------
// Financial Currency
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface CurrencyProps {
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
 * ISO 4217 currency code used throughout the Financial domain.
 *
 * Represents the currency denomination of a financial amount, account,
 * transaction, payment, settlement, disbursement, or other financial
 * operation.
 *
 * The value is normalized to uppercase and must contain exactly three
 * alphabetic characters.
 *
 * Examples:
 *
 * KES
 * UGX
 * TZS
 * RWF
 * USD
 * EUR
 */
export class Currency extends ValueObject<CurrencyProps> {
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
   * Creates a Financial Currency value object.
   *
   * The supplied currency code is trimmed, normalized to uppercase,
   * and validated before entering the domain.
   */
  public static create(value: string): Currency {
    const normalized = value.trim().toUpperCase();

    Currency.validate(normalized);

    return new Currency(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (value.length !== CURRENCY_CODE_LENGTH) {
      throw new Error(
        'Financial currency must be a 3-letter ISO 4217 currency code',
      );
    }

    if (!/^[A-Z]{3}$/.test(value)) {
      throw new Error(
        'Financial currency must contain only alphabetic characters',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isKes(): boolean {
    return this.props.value === 'KES';
  }

  public isUgx(): boolean {
    return this.props.value === 'UGX';
  }

  public isTzs(): boolean {
    return this.props.value === 'TZS';
  }

  public isRwf(): boolean {
    return this.props.value === 'RWF';
  }

  public isUsd(): boolean {
    return this.props.value === 'USD';
  }

  public isEur(): boolean {
    return this.props.value === 'EUR';
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

export { CURRENCY_CODE_LENGTH as FINANCIAL_CURRENCY_CODE_LENGTH };

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { CurrencyProps };
