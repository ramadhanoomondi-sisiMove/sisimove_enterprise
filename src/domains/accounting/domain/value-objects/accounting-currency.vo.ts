// -----------------------------------------------------------------------------
// Accounting Currency
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type AccountingCurrencyValue = string;

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface AccountingCurrencyProps {
  value: AccountingCurrencyValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Accounting Currency.
 *
 * Represents the three-letter ISO-style currency code used by Accounting.
 *
 * Currency is intentionally represented as a value object rather than an
 * Accounting-specific enum so the Accounting domain can support currencies
 * without coupling itself to a fixed currency list.
 */
export class AccountingCurrency extends ValueObject<AccountingCurrencyProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  private static readonly LENGTH = 3;

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: AccountingCurrencyValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(value: string): AccountingCurrency {
    return new AccountingCurrency(
      AccountingCurrency.validateAndNormalize(value),
    );
  }

  public static fromValue(value: AccountingCurrencyValue): AccountingCurrency {
    return new AccountingCurrency(
      AccountingCurrency.validateAndNormalize(value),
    );
  }

  public static kes(): AccountingCurrency {
    return new AccountingCurrency('KES');
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validateAndNormalize(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Accounting currency must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    if (!/^[A-Z]{3}$/.test(normalized)) {
      throw new Error(
        'Accounting currency must be a valid three-letter currency code.',
      );
    }

    return normalized;
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isKes(): boolean {
    return this.props.value === 'KES';
  }

  // ---------------------------------------------------------------------------
  // Accessors
  // ---------------------------------------------------------------------------

  public get value(): AccountingCurrencyValue {
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
// Exports
// -----------------------------------------------------------------------------

export type { AccountingCurrencyProps };
