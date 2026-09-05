// -----------------------------------------------------------------------------
// Accounting Period Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type AccountingPeriodStatusValue = 'OPEN' | 'CLOSED';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AccountingPeriodStatusProps {
  value: AccountingPeriodStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the lifecycle status of an Accounting Period.
 *
 * Valid states:
 *
 * - OPEN   — The Accounting Period accepts accounting activity.
 * - CLOSED — The Accounting Period is closed and must not accept further
 *            journal posting.
 *
 * The Accounting Period entity owns lifecycle transitions. This value object
 * is responsible only for representing and validating the status value.
 */
export class AccountingPeriodStatus extends ValueObject<AccountingPeriodStatusProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly OPEN: AccountingPeriodStatusValue = 'OPEN';

  public static readonly CLOSED: AccountingPeriodStatusValue = 'CLOSED';

  private static readonly VALID_VALUES: ReadonlySet<AccountingPeriodStatusValue> =
    new Set([AccountingPeriodStatus.OPEN, AccountingPeriodStatus.CLOSED]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: AccountingPeriodStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates an Accounting Period status from arbitrary input.
   *
   * Transport and application input may arrive as a plain string.
   * Validation and narrowing remain inside the domain value object.
   */
  public static create(value: string): AccountingPeriodStatus {
    const normalized = AccountingPeriodStatus.validate(value);

    return new AccountingPeriodStatus(normalized);
  }

  /**
   * Creates an open Accounting Period status.
   */
  public static open(): AccountingPeriodStatus {
    return new AccountingPeriodStatus(AccountingPeriodStatus.OPEN);
  }

  /**
   * Creates a closed Accounting Period status.
   */
  public static closed(): AccountingPeriodStatus {
    return new AccountingPeriodStatus(AccountingPeriodStatus.CLOSED);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): AccountingPeriodStatusValue {
    if (typeof value !== 'string') {
      throw new Error('Accounting period status must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    if (
      !AccountingPeriodStatus.VALID_VALUES.has(
        normalized as AccountingPeriodStatusValue,
      )
    ) {
      throw new Error(`Invalid Accounting period status: ${value}`);
    }

    return normalized as AccountingPeriodStatusValue;
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isOpen(): boolean {
    return this.props.value === AccountingPeriodStatus.OPEN;
  }

  public isClosed(): boolean {
    return this.props.value === AccountingPeriodStatus.CLOSED;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): AccountingPeriodStatusValue {
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

export type { AccountingPeriodStatusProps };
