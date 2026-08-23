// -----------------------------------------------------------------------------
// Financial Money
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { Currency } from './currency.vo';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface MoneyProps {
  amount: number;
  currency: Currency;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_MONEY_AMOUNT = 0;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents a monetary amount within the Financial domain.
 *
 * Money is always represented as an integer amount in the smallest monetary
 * unit supported by the domain.
 *
 * The amount and currency are inseparable.
 *
 * Example:
 *
 * KES 1,000
 *
 * is represented as:
 *
 * Money.create(1000, Currency.create('KES'))
 *
 * Money deliberately uses integer amounts so monetary calculations do not
 * depend on floating-point arithmetic.
 */
export class Money extends ValueObject<MoneyProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(amount: number, currency: Currency) {
    super({
      amount,
      currency,
    });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(amount: number, currency: Currency): Money {
    Money.validateAmount(amount);

    return new Money(amount, currency);
  }

  /**
   * Convenience factory for callers that have an ISO currency code.
   */
  public static fromCode(amount: number, currency: string): Money {
    return Money.create(amount, Currency.create(currency));
  }

  /**
   * Creates a zero monetary amount for the supplied currency.
   */
  public static zero(currency: Currency): Money {
    return Money.create(0, currency);
  }

  /**
   * Convenience zero factory using an ISO currency code.
   */
  public static zeroFromCode(currency: string): Money {
    return Money.zero(Currency.create(currency));
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validateAmount(amount: number): void {
    if (!Number.isFinite(amount)) {
      throw new Error('Financial Money amount must be a finite number');
    }

    if (!Number.isSafeInteger(amount)) {
      throw new Error('Financial Money amount must be a safe integer');
    }

    if (amount < MIN_MONEY_AMOUNT) {
      throw new Error('Financial Money amount cannot be negative');
    }
  }

  // ---------------------------------------------------------------------------
  // Arithmetic
  // ---------------------------------------------------------------------------

  public add(other: Money): Money {
    this.ensureSameCurrency(other);

    return Money.create(
      this.props.amount + other.props.amount,
      this.props.currency,
    );
  }

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

  public multiply(multiplier: number): Money {
    if (!Number.isFinite(multiplier)) {
      throw new Error('Financial Money multiplier must be a finite number');
    }

    if (!Number.isSafeInteger(multiplier)) {
      throw new Error('Financial Money multiplier must be a safe integer');
    }

    if (multiplier < 0) {
      throw new Error('Financial Money multiplier cannot be negative');
    }

    const result = this.props.amount * multiplier;

    if (!Number.isSafeInteger(result)) {
      throw new Error(
        'Financial Money multiplication exceeds safe integer range',
      );
    }

    return Money.create(result, this.props.currency);
  }

  // ---------------------------------------------------------------------------
  // Comparisons
  // ---------------------------------------------------------------------------

  public isZero(): boolean {
    return this.props.amount === 0;
  }

  public isPositive(): boolean {
    return this.props.amount > 0;
  }

  public isNonNegative(): boolean {
    return this.props.amount >= MIN_MONEY_AMOUNT;
  }

  public isGreaterThan(other: Money): boolean {
    this.ensureSameCurrency(other);

    return this.props.amount > other.props.amount;
  }

  public isGreaterThanOrEqual(other: Money): boolean {
    this.ensureSameCurrency(other);

    return this.props.amount >= other.props.amount;
  }

  public isLessThan(other: Money): boolean {
    this.ensureSameCurrency(other);

    return this.props.amount < other.props.amount;
  }

  public isLessThanOrEqual(other: Money): boolean {
    this.ensureSameCurrency(other);

    return this.props.amount <= other.props.amount;
  }

  // ---------------------------------------------------------------------------
  // Currency
  // ---------------------------------------------------------------------------

  public hasCurrency(currency: Currency): boolean {
    return this.props.currency.equals(currency);
  }

  private ensureSameCurrency(other: Money): void {
    if (!this.props.currency.equals(other.props.currency)) {
      throw new Error(
        `Financial Money currency mismatch: ${this.props.currency.value} and ${other.props.currency.value}`,
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Accessors
  // ---------------------------------------------------------------------------

  public get amount(): number {
    return this.props.amount;
  }

  public get currency(): Currency {
    return this.props.currency;
  }

  // ---------------------------------------------------------------------------
  // Serialization
  // ---------------------------------------------------------------------------

  public override toString(): string {
    return `${this.props.currency.value} ${this.props.amount}`;
  }
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export { MIN_MONEY_AMOUNT as FINANCIAL_MONEY_MIN_AMOUNT };

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { MoneyProps };
