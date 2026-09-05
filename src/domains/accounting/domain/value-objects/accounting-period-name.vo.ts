// -----------------------------------------------------------------------------
// Accounting Period Name
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AccountingPeriodNameProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the human-readable name of an Accounting Period.
 *
 * Examples:
 *
 * - January 2026
 * - Q1 2026
 * - Financial Year 2026
 *
 * The value object is responsible for:
 *
 * - validating the supplied value;
 * - trimming surrounding whitespace;
 * - preventing an empty period name;
 * - representing the immutable Accounting Period name.
 */
export class AccountingPeriodName extends ValueObject<AccountingPeriodNameProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  private static readonly MIN_LENGTH = 1;

  private static readonly MAX_LENGTH = 255;

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
   * Creates an Accounting Period name.
   *
   * Transport and application layers may provide an arbitrary string.
   * Validation and normalization remain inside the domain value object.
   */
  public static create(value: string): AccountingPeriodName {
    return new AccountingPeriodName(
      AccountingPeriodName.validateAndNormalize(value),
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validateAndNormalize(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Accounting period name must be a string.');
    }

    const normalized = value.trim();

    if (normalized.length < AccountingPeriodName.MIN_LENGTH) {
      throw new Error('Accounting period name cannot be empty.');
    }

    if (normalized.length > AccountingPeriodName.MAX_LENGTH) {
      throw new Error(
        `Accounting period name cannot exceed ${AccountingPeriodName.MAX_LENGTH} characters.`,
      );
    }

    return normalized;
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
// Exported Types
// -----------------------------------------------------------------------------

export type { AccountingPeriodNameProps };
