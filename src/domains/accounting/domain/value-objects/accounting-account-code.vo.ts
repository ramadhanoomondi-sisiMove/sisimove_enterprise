// -----------------------------------------------------------------------------
// Accounting Account Code
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AccountingAccountCodeProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the unique business code assigned to an Accounting Account.
 *
 * The account code is part of the chart-of-accounts identity and is distinct
 * from both the internal database identifier and the public identifier.
 *
 * The value object is responsible for:
 *
 * - validating the supplied value;
 * - normalizing the value;
 * - representing the immutable account code.
 */
export class AccountingAccountCode extends ValueObject<AccountingAccountCodeProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  private static readonly MIN_LENGTH = 1;

  private static readonly MAX_LENGTH = 64;

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
   * Creates an Accounting Account code.
   *
   * Transport and application layers may provide an arbitrary string.
   * Validation and normalization remain inside the domain value object.
   */
  public static create(value: string): AccountingAccountCode {
    return new AccountingAccountCode(
      AccountingAccountCode.validateAndNormalize(value),
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validateAndNormalize(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Accounting account code must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    if (normalized.length < AccountingAccountCode.MIN_LENGTH) {
      throw new Error('Accounting account code cannot be empty.');
    }

    if (normalized.length > AccountingAccountCode.MAX_LENGTH) {
      throw new Error(
        `Accounting account code cannot exceed ${AccountingAccountCode.MAX_LENGTH} characters.`,
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

export type { AccountingAccountCodeProps };
