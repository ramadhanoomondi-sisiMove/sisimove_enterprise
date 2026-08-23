// src/domains/financial/domain/value-objects/financial-balance-type.vo.ts

// -----------------------------------------------------------------------------
// Financial Balance Type
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialBalanceTypeProps {
  value: FinancialBalanceTypeValue;
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Classification of the balance bucket affected by a Financial Transaction
 * Entry.
 *
 * AVAILABLE represents funds that can currently be used.
 *
 * PENDING represents funds that have entered the account but are not yet
 * available for use.
 *
 * HELD represents funds reserved against an active financial hold.
 */
export type FinancialBalanceTypeValue = 'AVAILABLE' | 'PENDING' | 'HELD';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const FINANCIAL_BALANCE_TYPES: readonly FinancialBalanceTypeValue[] = [
  'AVAILABLE',
  'PENDING',
  'HELD',
];

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the balance bucket affected by a Financial Transaction Entry.
 */
export class FinancialBalanceType extends ValueObject<FinancialBalanceTypeProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: FinancialBalanceTypeValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Financial Balance Type.
   *
   * The supplied value is normalized to uppercase before validation.
   */
  public static create(value: string): FinancialBalanceType {
    const normalized = value.trim().toUpperCase();

    FinancialBalanceType.validate(normalized);

    return new FinancialBalanceType(normalized as FinancialBalanceTypeValue);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!FINANCIAL_BALANCE_TYPES.includes(value as FinancialBalanceTypeValue)) {
      throw new Error(`Invalid Financial Balance Type: ${value}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isAvailable(): boolean {
    return this.props.value === 'AVAILABLE';
  }

  public isPending(): boolean {
    return this.props.value === 'PENDING';
  }

  public isHeld(): boolean {
    return this.props.value === 'HELD';
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): FinancialBalanceTypeValue {
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

export { FINANCIAL_BALANCE_TYPES };

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialBalanceTypeProps };
