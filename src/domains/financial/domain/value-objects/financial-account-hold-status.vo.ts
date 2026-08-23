// -----------------------------------------------------------------------------
// Financial Account Hold Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export enum FinancialAccountHoldStatusValue {
  ACTIVE = 'ACTIVE',
  RELEASED = 'RELEASED',
  CAPTURED = 'CAPTURED',
  CANCELLED = 'CANCELLED',
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialAccountHoldStatusProps {
  value: FinancialAccountHoldStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Lifecycle status of a Financial Account Hold.
 *
 * A hold reserves funds against a Financial Account without permanently
 * transferring ownership of those funds.
 *
 * Lifecycle:
 *
 * ACTIVE
 *   -> RELEASED
 *   -> CAPTURED
 *   -> CANCELLED
 *
 * Terminal states:
 * RELEASED
 * CAPTURED
 * CANCELLED
 */
export class FinancialAccountHoldStatus extends ValueObject<FinancialAccountHoldStatusProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: FinancialAccountHoldStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Financial Account Hold status.
   */
  public static create(
    value: FinancialAccountHoldStatusValue,
  ): FinancialAccountHoldStatus {
    return new FinancialAccountHoldStatus(value);
  }

  /**
   * Creates an ACTIVE hold status.
   */
  public static active(): FinancialAccountHoldStatus {
    return new FinancialAccountHoldStatus(
      FinancialAccountHoldStatusValue.ACTIVE,
    );
  }

  /**
   * Creates a RELEASED hold status.
   */
  public static released(): FinancialAccountHoldStatus {
    return new FinancialAccountHoldStatus(
      FinancialAccountHoldStatusValue.RELEASED,
    );
  }

  /**
   * Creates a CAPTURED hold status.
   */
  public static captured(): FinancialAccountHoldStatus {
    return new FinancialAccountHoldStatus(
      FinancialAccountHoldStatusValue.CAPTURED,
    );
  }

  /**
   * Creates a CANCELLED hold status.
   */
  public static cancelled(): FinancialAccountHoldStatus {
    return new FinancialAccountHoldStatus(
      FinancialAccountHoldStatusValue.CANCELLED,
    );
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isActive(): boolean {
    return this.props.value === FinancialAccountHoldStatusValue.ACTIVE;
  }

  public isReleased(): boolean {
    return this.props.value === FinancialAccountHoldStatusValue.RELEASED;
  }

  public isCaptured(): boolean {
    return this.props.value === FinancialAccountHoldStatusValue.CAPTURED;
  }

  public isCancelled(): boolean {
    return this.props.value === FinancialAccountHoldStatusValue.CANCELLED;
  }

  public isTerminal(): boolean {
    return this.isReleased() || this.isCaptured() || this.isCancelled();
  }

  public canRelease(): boolean {
    return this.isActive();
  }

  public canCapture(): boolean {
    return this.isActive();
  }

  public canCancel(): boolean {
    return this.isActive();
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): FinancialAccountHoldStatusValue {
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

export type { FinancialAccountHoldStatusProps };
