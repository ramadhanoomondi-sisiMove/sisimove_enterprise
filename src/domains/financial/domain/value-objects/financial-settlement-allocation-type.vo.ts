// -----------------------------------------------------------------------------
// Financial Settlement Allocation Type
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Values
// -----------------------------------------------------------------------------

export enum FinancialSettlementAllocationTypeValue {
  PRINCIPAL = 'PRINCIPAL',
  COMMISSION = 'COMMISSION',
  FEE = 'FEE',
  ADJUSTMENT = 'ADJUSTMENT',
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialSettlementAllocationTypeProps {
  value: FinancialSettlementAllocationTypeValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Classification of an amount allocated from a Financial Settlement Item.
 *
 * PRINCIPAL
 *   The primary amount belonging to the settlement subject.
 *
 * COMMISSION
 *   A commercial commission allocated from the settlement.
 *
 * FEE
 *   A financial or platform fee allocated from the settlement.
 *
 * ADJUSTMENT
 *   A deliberate financial adjustment applied during settlement.
 */
export class FinancialSettlementAllocationType extends ValueObject<FinancialSettlementAllocationTypeProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: FinancialSettlementAllocationTypeValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(
    value: FinancialSettlementAllocationTypeValue,
  ): FinancialSettlementAllocationType {
    return new FinancialSettlementAllocationType(value);
  }

  public static principal(): FinancialSettlementAllocationType {
    return new FinancialSettlementAllocationType(
      FinancialSettlementAllocationTypeValue.PRINCIPAL,
    );
  }

  public static commission(): FinancialSettlementAllocationType {
    return new FinancialSettlementAllocationType(
      FinancialSettlementAllocationTypeValue.COMMISSION,
    );
  }

  public static fee(): FinancialSettlementAllocationType {
    return new FinancialSettlementAllocationType(
      FinancialSettlementAllocationTypeValue.FEE,
    );
  }

  public static adjustment(): FinancialSettlementAllocationType {
    return new FinancialSettlementAllocationType(
      FinancialSettlementAllocationTypeValue.ADJUSTMENT,
    );
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isPrincipal(): boolean {
    return (
      this.props.value === FinancialSettlementAllocationTypeValue.PRINCIPAL
    );
  }

  public isCommission(): boolean {
    return (
      this.props.value === FinancialSettlementAllocationTypeValue.COMMISSION
    );
  }

  public isFee(): boolean {
    return this.props.value === FinancialSettlementAllocationTypeValue.FEE;
  }

  public isAdjustment(): boolean {
    return (
      this.props.value === FinancialSettlementAllocationTypeValue.ADJUSTMENT
    );
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): FinancialSettlementAllocationTypeValue {
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

export type { FinancialSettlementAllocationTypeProps };
