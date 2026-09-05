// -----------------------------------------------------------------------------
// Accounting Journal Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type AccountingJournalStatusValue = 'DRAFT' | 'POSTED' | 'REVERSED';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AccountingJournalStatusProps {
  value: AccountingJournalStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the lifecycle status of an Accounting Journal.
 *
 * Valid states:
 *
 * - DRAFT    — The journal is being prepared and may still be modified.
 * - POSTED   — The journal has been validated and permanently posted.
 * - REVERSED — The posted journal has been reversed by an accounting
 *              reversal operation.
 *
 * The Accounting Journal aggregate owns lifecycle transitions. This value
 * object is responsible only for representing and validating the status.
 */
export class AccountingJournalStatus extends ValueObject<AccountingJournalStatusProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly DRAFT: AccountingJournalStatusValue = 'DRAFT';

  public static readonly POSTED: AccountingJournalStatusValue = 'POSTED';

  public static readonly REVERSED: AccountingJournalStatusValue = 'REVERSED';

  private static readonly VALID_VALUES: ReadonlySet<AccountingJournalStatusValue> =
    new Set([
      AccountingJournalStatus.DRAFT,
      AccountingJournalStatus.POSTED,
      AccountingJournalStatus.REVERSED,
    ]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: AccountingJournalStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates an Accounting Journal status from arbitrary input.
   *
   * Transport and application input may arrive as a plain string.
   * Validation and narrowing remain inside the domain value object.
   */
  public static create(value: string): AccountingJournalStatus {
    const normalized = AccountingJournalStatus.validate(value);

    return new AccountingJournalStatus(normalized);
  }

  /**
   * Creates a draft Accounting Journal status.
   */
  public static draft(): AccountingJournalStatus {
    return new AccountingJournalStatus(AccountingJournalStatus.DRAFT);
  }

  /**
   * Creates a posted Accounting Journal status.
   */
  public static posted(): AccountingJournalStatus {
    return new AccountingJournalStatus(AccountingJournalStatus.POSTED);
  }

  /**
   * Creates a reversed Accounting Journal status.
   */
  public static reversed(): AccountingJournalStatus {
    return new AccountingJournalStatus(AccountingJournalStatus.REVERSED);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): AccountingJournalStatusValue {
    if (typeof value !== 'string') {
      throw new Error('Accounting journal status must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    if (
      !AccountingJournalStatus.VALID_VALUES.has(
        normalized as AccountingJournalStatusValue,
      )
    ) {
      throw new Error(`Invalid Accounting journal status: ${value}`);
    }

    return normalized as AccountingJournalStatusValue;
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isDraft(): boolean {
    return this.props.value === AccountingJournalStatus.DRAFT;
  }

  public isPosted(): boolean {
    return this.props.value === AccountingJournalStatus.POSTED;
  }

  public isReversed(): boolean {
    return this.props.value === AccountingJournalStatus.REVERSED;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): AccountingJournalStatusValue {
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

export type { AccountingJournalStatusProps };
