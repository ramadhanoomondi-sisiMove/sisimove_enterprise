// -----------------------------------------------------------------------------
// Financial Account Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialAccountStatusProps {
  value: FinancialAccountStatusValue;
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Lifecycle statuses supported by a Financial Account.
 *
 * These values correspond to the FinancialAccountStatus persistence enum.
 */
export type FinancialAccountStatusValue = 'ACTIVE' | 'SUSPENDED' | 'CLOSED';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const FINANCIAL_ACCOUNT_STATUSES: readonly FinancialAccountStatusValue[] = [
  'ACTIVE',
  'SUSPENDED',
  'CLOSED',
];

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the lifecycle status of a Financial Account.
 *
 * ACTIVE
 *   The account is operational and may participate in permitted
 *   financial operations.
 *
 * SUSPENDED
 *   The account remains present but financial operations are restricted
 *   according to the applicable domain rules.
 *
 * CLOSED
 *   The account has permanently reached the end of its lifecycle and
 *   must not be treated as an active financial account.
 */
export class FinancialAccountStatus extends ValueObject<FinancialAccountStatusProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: FinancialAccountStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Financial Account Status.
   *
   * The supplied value is normalized to uppercase and validated before
   * entering the domain.
   */
  public static create(value: string): FinancialAccountStatus {
    const normalized = value.trim().toUpperCase();

    FinancialAccountStatus.validate(normalized);

    return new FinancialAccountStatus(
      normalized as FinancialAccountStatusValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!FinancialAccountStatus.isValid(value)) {
      throw new Error(`Invalid Financial Account status: ${value}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Static Predicates
  // ---------------------------------------------------------------------------

  public static isValid(value: string): value is FinancialAccountStatusValue {
    return FINANCIAL_ACCOUNT_STATUSES.includes(
      value as FinancialAccountStatusValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Instance Predicates
  // ---------------------------------------------------------------------------

  public isActive(): boolean {
    return this.props.value === 'ACTIVE';
  }

  public isSuspended(): boolean {
    return this.props.value === 'SUSPENDED';
  }

  public isClosed(): boolean {
    return this.props.value === 'CLOSED';
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Predicates
  // ---------------------------------------------------------------------------

  public canOperate(): boolean {
    return this.isActive();
  }

  public isTerminal(): boolean {
    return this.isClosed();
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): FinancialAccountStatusValue {
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

export { FINANCIAL_ACCOUNT_STATUSES };

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialAccountStatusProps };
