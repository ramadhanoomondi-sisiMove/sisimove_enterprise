// src/domains/financial/domain/value-objects/financial-last-four.vo.ts

// -----------------------------------------------------------------------------
// Financial Last Four
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialLastFourProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const LAST_FOUR_LENGTH = 4;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Last four characters of a sensitive financial payment reference.
 *
 * Used strictly for safe display and recognition of a payment method.
 *
 * Examples:
 *
 * - Card: 4242
 * - Bank account: 6789
 * - Other supported financial instrument: 1234
 *
 * The value must never contain the complete underlying payment or
 * account reference.
 */
export class FinancialLastFour extends ValueObject<FinancialLastFourProps> {
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
   * Creates a Financial Last Four value.
   *
   * The supplied value is trimmed and must contain exactly four
   * alphanumeric characters.
   */
  public static create(value: string): FinancialLastFour {
    const normalized = value.trim();

    FinancialLastFour.validate(normalized);

    return new FinancialLastFour(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (value.length !== LAST_FOUR_LENGTH) {
      throw new Error('Financial last four must contain exactly 4 characters');
    }

    if (!/^[A-Z0-9]{4}$/i.test(value)) {
      throw new Error(
        'Financial last four must contain only alphanumeric characters',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isValid(): boolean {
    return (
      this.props.value.length === LAST_FOUR_LENGTH &&
      /^[A-Z0-9]{4}$/i.test(this.props.value)
    );
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

export { LAST_FOUR_LENGTH as FINANCIAL_LAST_FOUR_LENGTH };

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialLastFourProps };
