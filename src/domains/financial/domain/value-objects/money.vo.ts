// -----------------------------------------------------------------------------
// Financial Money
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface MoneyProps {
  amount: number;
  currency: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_MONEY_AMOUNT = 0;
const CURRENCY_CODE_LENGTH = 3;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents a monetary amount within the Financial domain.
 *
 * Money is always represented as an integer amount in the smallest monetary
 * unit supported by the domain.
 *
 * For KES:
 *
 * 1000 = KES 1,000
 *
 * The amount is deliberately represented as an integer so that monetary
 * calculations do not depend on floating-point arithmetic.
 *
 * Currency is stored together with the amount because an amount without
 * its currency is not a complete monetary value.
 */
export class Money extends ValueObject<MoneyProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(amount: number, currency: string) {
    super({
      amount,
      currency,
    });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Money value object.
   *
   * The amount must be a finite, non-negative integer.
   *
   * The currency must be a three-letter ISO 4217-style currency code.
   */
  public static create(amount: number, currency: string): Money {
    const normalizedCurrency = currency.trim().toUpperCase();

    Money.validateAmount(amount);
    Money.validateCurrency(normalizedCurrency);

    return new Money(amount, normalizedCurrency);
  }

  /**
   * Creates a zero monetary amount for the supplied currency.
   */
  public static zero(currency: string): Money {
    return Money.create(0, currency);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validateAmount(amount: number): void {
    if (!Number.isFinite(amount)) {
      throw new Error('Financial Money amount must be a finite number');
    }

    if (!Number.isInteger(amount)) {
      throw new Error('Financial Money amount must be an integer');
    }

    if (amount < MIN_MONEY_AMOUNT) {
      throw new Error('Financial Money amount cannot be negative');
    }
  }

  private static validateCurrency(currency: string): void {
    if (currency.length !== CURRENCY_CODE_LENGTH) {
      throw new Error(
        'Financial Money currency must be a 3-letter ISO 4217 currency code',
      );
    }

    if (!/^[A-Z]{3}$/.test(currency)) {
      throw new Error(
        'Financial Money currency must contain only alphabetic characters',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Arithmetic
  // ---------------------------------------------------------------------------

  /**
   * Adds another monetary amount to this Money.
   *
   * Both monetary values must use the same currency.
   */
  public add(other: Money): Money {
    this.ensureSameCurrency(other);

    return Money.create(
      this.props.amount + other.props.amount,
      this.props.currency,
    );
  }

  /**
   * Subtracts another monetary amount from this Money.
   *
   * The result cannot be negative.
   */
  public subtract(other: Money): Money {
    this.ensureSameCurrency(other);

    const result = this.props.amount - other.props.amount;

    if (result < MIN_MONEY_AMOUNT) {
      throw new Error(
        'Financial Money subtraction cannot produce a negative amount',
      );
    }

    return Money.create(result, this.props.currency);
  }

  /**
   * Multiplies this monetary amount by an integer multiplier.
   *
   * This method intentionally accepts only integers so that the Financial
   * domain does not introduce implicit floating-point monetary calculations.
   */
  public multiply(multiplier: number): Money {
    if (!Number.isFinite(multiplier)) {
      throw new Error('Financial Money multiplier must be a finite number');
    }

    if (!Number.isInteger(multiplier)) {
      throw new Error('Financial Money multiplier must be an integer');
    }

    if (multiplier < 0) {
      throw new Error('Financial Money multiplier cannot be negative');
    }

    return Money.create(this.props.amount * multiplier, this.props.currency);
  }

  // ---------------------------------------------------------------------------
  // Comparisons
  // ---------------------------------------------------------------------------

  /**
   * Determines whether this Money amount is zero.
   */
  public isZero(): boolean {
    return this.props.amount === 0;
  }

  /**
   * Determines whether this Money amount is greater than zero.
   */
  public isPositive(): boolean {
    return this.props.amount > 0;
  }

  /**
   * Determines whether this Money amount is non-negative.
   */
  public isNonNegative(): boolean {
    return this.props.amount >= MIN_MONEY_AMOUNT;
  }

  /**
   * Determines whether this Money amount is greater than another amount.
   */
  public isGreaterThan(other: Money): boolean {
    this.ensureSameCurrency(other);

    return this.props.amount > other.props.amount;
  }

  /**
   * Determines whether this Money amount is greater than or equal to
   * another amount.
   */
  public isGreaterThanOrEqual(other: Money): boolean {
    this.ensureSameCurrency(other);

    return this.props.amount >= other.props.amount;
  }

  /**
   * Determines whether this Money amount is less than another amount.
   */
  public isLessThan(other: Money): boolean {
    this.ensureSameCurrency(other);

    return this.props.amount < other.props.amount;
  }

  /**
   * Determines whether this Money amount is less than or equal to
   * another amount.
   */
  public isLessThanOrEqual(other: Money): boolean {
    this.ensureSameCurrency(other);

    return this.props.amount <= other.props.amount;
  }

  // ---------------------------------------------------------------------------
  // Currency
  // ---------------------------------------------------------------------------

  /**
   * Determines whether this Money uses the supplied currency.
   */
  public hasCurrency(currency: string): boolean {
    return this.props.currency === currency.trim().toUpperCase();
  }

  /**
   * Ensures that another Money value uses the same currency.
   */
  private ensureSameCurrency(other: Money): void {
    if (this.props.currency !== other.props.currency) {
      throw new Error(
        `Financial Money currency mismatch: ${this.props.currency} and ${other.props.currency}`,
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Accessors
  // ---------------------------------------------------------------------------

  /**
   * Monetary amount in the smallest supported monetary unit.
   */
  public get amount(): number {
    return this.props.amount;
  }

  /**
   * ISO 4217 currency code.
   */
  public get currency(): string {
    return this.props.currency;
  }

  // ---------------------------------------------------------------------------
  // Serialization
  // ---------------------------------------------------------------------------

  public override toString(): string {
    return `${this.props.currency} ${this.props.amount}`;
  }
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_MONEY_AMOUNT as FINANCIAL_MONEY_MIN_AMOUNT,
  CURRENCY_CODE_LENGTH as FINANCIAL_MONEY_CURRENCY_CODE_LENGTH,
};

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { MoneyProps };
