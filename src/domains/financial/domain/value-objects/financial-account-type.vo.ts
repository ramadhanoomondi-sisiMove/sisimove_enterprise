// -----------------------------------------------------------------------------
// Financial Account Type
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialAccountTypeProps {
  value: FinancialAccountTypeValue;
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Types of Financial Accounts supported by the Financial domain.
 *
 * These values correspond to the FinancialAccountType persistence enum.
 */
export type FinancialAccountTypeValue =
  'USER' | 'PLATFORM' | 'MERCHANT' | 'HOLDING' | 'SETTLEMENT';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const FINANCIAL_ACCOUNT_TYPES: readonly FinancialAccountTypeValue[] = [
  'USER',
  'PLATFORM',
  'MERCHANT',
  'HOLDING',
  'SETTLEMENT',
];

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Defines the classification of a Financial Account.
 *
 * The account type determines the financial role performed by the account
 * within the platform.
 *
 * USER
 *   Financial account owned by a platform user.
 *
 * PLATFORM
 *   Financial account owned and operated by the platform.
 *
 * MERCHANT
 *   Financial account associated with a merchant or commercial participant.
 *
 * HOLDING
 *   Financial account used to temporarily hold platform funds.
 *
 * SETTLEMENT
 *   Financial account used for settlement-related financial flows.
 */
export class FinancialAccountType extends ValueObject<FinancialAccountTypeProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: FinancialAccountTypeValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Financial Account Type.
   *
   * The supplied value is normalized to uppercase and validated before
   * entering the domain.
   */
  public static create(value: string): FinancialAccountType {
    const normalized = value.trim().toUpperCase();

    FinancialAccountType.validate(normalized);

    return new FinancialAccountType(normalized as FinancialAccountTypeValue);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!FinancialAccountType.isValid(value)) {
      throw new Error(`Invalid Financial Account type: ${value}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Static Predicates
  // ---------------------------------------------------------------------------

  public static isValid(value: string): value is FinancialAccountTypeValue {
    return FINANCIAL_ACCOUNT_TYPES.includes(value as FinancialAccountTypeValue);
  }

  // ---------------------------------------------------------------------------
  // Instance Predicates
  // ---------------------------------------------------------------------------

  public isUser(): boolean {
    return this.props.value === 'USER';
  }

  public isPlatform(): boolean {
    return this.props.value === 'PLATFORM';
  }

  public isMerchant(): boolean {
    return this.props.value === 'MERCHANT';
  }

  public isHolding(): boolean {
    return this.props.value === 'HOLDING';
  }

  public isSettlement(): boolean {
    return this.props.value === 'SETTLEMENT';
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): FinancialAccountTypeValue {
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

export { FINANCIAL_ACCOUNT_TYPES };
export type { FinancialAccountTypeProps };
