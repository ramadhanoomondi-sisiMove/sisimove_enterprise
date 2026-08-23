// src/domains/financial/domain/value-objects/financial-account-display-name.vo.ts

// -----------------------------------------------------------------------------
// Financial Account Display Name
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialAccountDisplayNameProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_DISPLAY_NAME_LENGTH = 1;
const MAX_DISPLAY_NAME_LENGTH = 100;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Human-readable name of a Financial Account.
 *
 * The display name is intended for application and presentation purposes.
 * It does not establish ownership or identity and must not be used as a
 * substitute for the account public ID or owner public ID.
 *
 * Examples:
 *
 * - User Wallet
 * - SisiMove Platform Account
 * - Settlement Account
 * - Merchant Account
 */
export class FinancialAccountDisplayName extends ValueObject<FinancialAccountDisplayNameProps> {
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
   * Creates a Financial Account display name.
   *
   * The supplied value is trimmed and validated before entering
   * the Financial domain.
   */
  public static create(value: string): FinancialAccountDisplayName {
    const normalized = value.trim();

    FinancialAccountDisplayName.validate(normalized);

    return new FinancialAccountDisplayName(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (value.length < MIN_DISPLAY_NAME_LENGTH) {
      throw new Error('Financial Account display name must not be empty');
    }

    if (value.length > MAX_DISPLAY_NAME_LENGTH) {
      throw new Error(
        `Financial Account display name must not exceed ${MAX_DISPLAY_NAME_LENGTH} characters`,
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public hasContent(): boolean {
    return this.props.value.length > 0;
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

export {
  MIN_DISPLAY_NAME_LENGTH as FINANCIAL_ACCOUNT_DISPLAY_NAME_MIN_LENGTH,
  MAX_DISPLAY_NAME_LENGTH as FINANCIAL_ACCOUNT_DISPLAY_NAME_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialAccountDisplayNameProps };
