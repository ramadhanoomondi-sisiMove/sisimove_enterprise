// -----------------------------------------------------------------------------
// Accounting Account Name
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AccountingAccountNameProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the human-readable name of an Accounting Account.
 *
 * The account name describes the accounting purpose of the account within the
 * chart of accounts.
 *
 * The value object is responsible for:
 *
 * - validating the supplied value;
 * - trimming surrounding whitespace;
 * - preventing an empty account name;
 * - representing the immutable account name.
 */
export class AccountingAccountName extends ValueObject<AccountingAccountNameProps> {
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
   * Creates an Accounting Account name.
   */
  public static create(value: string): AccountingAccountName {
    return new AccountingAccountName(
      AccountingAccountName.validateAndNormalize(value),
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validateAndNormalize(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Accounting account name must be a string.');
    }

    const normalized = value.trim();

    if (normalized.length < AccountingAccountName.MIN_LENGTH) {
      throw new Error('Accounting account name cannot be empty.');
    }

    if (normalized.length > AccountingAccountName.MAX_LENGTH) {
      throw new Error(
        `Accounting account name cannot exceed ${AccountingAccountName.MAX_LENGTH} characters.`,
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

export type { AccountingAccountNameProps };
