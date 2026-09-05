// -----------------------------------------------------------------------------
// Accounting Source Type
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type AccountingSourceTypeValue = string;

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface AccountingSourceTypeProps {
  value: AccountingSourceTypeValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Accounting Source Type.
 *
 * Identifies the type of external source that originated an accounting
 * posting.
 *
 * Examples may include:
 *
 * - BOOKING
 * - JOURNEY
 * - PAYMENT
 * - WALLET
 * - SETTLEMENT
 *
 * The value is intentionally not a closed enum because source types belong
 * to the originating bounded contexts rather than the Accounting domain.
 */
export class AccountingSourceType extends ValueObject<AccountingSourceTypeProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  private static readonly MIN_LENGTH = 1;
  private static readonly MAX_LENGTH = 100;

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: AccountingSourceTypeValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(value: string): AccountingSourceType {
    return new AccountingSourceType(
      AccountingSourceType.validateAndNormalize(value),
    );
  }

  public static fromValue(
    value: AccountingSourceTypeValue,
  ): AccountingSourceType {
    return new AccountingSourceType(
      AccountingSourceType.validateAndNormalize(value),
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validateAndNormalize(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Accounting source type must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    if (normalized.length < AccountingSourceType.MIN_LENGTH) {
      throw new Error('Accounting source type cannot be empty.');
    }

    if (normalized.length > AccountingSourceType.MAX_LENGTH) {
      throw new Error(
        `Accounting source type cannot exceed ${AccountingSourceType.MAX_LENGTH} characters.`,
      );
    }

    return normalized;
  }

  // ---------------------------------------------------------------------------
  // Accessors
  // ---------------------------------------------------------------------------

  public get value(): AccountingSourceTypeValue {
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

export type { AccountingSourceTypeProps };
