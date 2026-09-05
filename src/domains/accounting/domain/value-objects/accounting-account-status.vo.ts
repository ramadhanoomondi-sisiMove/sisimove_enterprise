// -----------------------------------------------------------------------------
// Accounting Account Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type AccountingAccountStatusValue = 'ACTIVE' | 'INACTIVE' | 'CLOSED';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AccountingAccountStatusProps {
  value: AccountingAccountStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the lifecycle status of an Accounting Account.
 *
 * Valid states:
 *
 * - ACTIVE   — The account is available for accounting activity.
 * - INACTIVE — The account exists but is temporarily unavailable for activity.
 * - CLOSED   — The account is permanently closed.
 *
 * The Accounting Account entity owns lifecycle transitions. This value object
 * is responsible only for representing and validating the status value.
 */
export class AccountingAccountStatus extends ValueObject<AccountingAccountStatusProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly ACTIVE: AccountingAccountStatusValue = 'ACTIVE';

  public static readonly INACTIVE: AccountingAccountStatusValue = 'INACTIVE';

  public static readonly CLOSED: AccountingAccountStatusValue = 'CLOSED';

  private static readonly VALID_VALUES: ReadonlySet<AccountingAccountStatusValue> =
    new Set([
      AccountingAccountStatus.ACTIVE,
      AccountingAccountStatus.INACTIVE,
      AccountingAccountStatus.CLOSED,
    ]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: AccountingAccountStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates an Accounting Account status from arbitrary input.
   */
  public static create(value: string): AccountingAccountStatus {
    const normalized = AccountingAccountStatus.validate(value);

    return new AccountingAccountStatus(normalized);
  }

  /**
   * Creates an active Accounting Account status.
   */
  public static active(): AccountingAccountStatus {
    return new AccountingAccountStatus(AccountingAccountStatus.ACTIVE);
  }

  /**
   * Creates an inactive Accounting Account status.
   */
  public static inactive(): AccountingAccountStatus {
    return new AccountingAccountStatus(AccountingAccountStatus.INACTIVE);
  }

  /**
   * Creates a closed Accounting Account status.
   */
  public static closed(): AccountingAccountStatus {
    return new AccountingAccountStatus(AccountingAccountStatus.CLOSED);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): AccountingAccountStatusValue {
    if (typeof value !== 'string') {
      throw new Error('Accounting account status must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    if (
      !AccountingAccountStatus.VALID_VALUES.has(
        normalized as AccountingAccountStatusValue,
      )
    ) {
      throw new Error(`Invalid Accounting account status: ${value}`);
    }

    return normalized as AccountingAccountStatusValue;
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isActive(): boolean {
    return this.props.value === AccountingAccountStatus.ACTIVE;
  }

  public isInactive(): boolean {
    return this.props.value === AccountingAccountStatus.INACTIVE;
  }

  public isClosed(): boolean {
    return this.props.value === AccountingAccountStatus.CLOSED;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): AccountingAccountStatusValue {
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

export type { AccountingAccountStatusProps };
