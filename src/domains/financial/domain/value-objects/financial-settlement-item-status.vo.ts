// -----------------------------------------------------------------------------
// Financial Settlement Item Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Values
// -----------------------------------------------------------------------------

export enum FinancialSettlementItemStatusValue {
  PENDING = 'PENDING',
  ALLOCATED = 'ALLOCATED',
  SETTLED = 'SETTLED',
  CANCELLED = 'CANCELLED',
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialSettlementItemStatusProps {
  value: FinancialSettlementItemStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Lifecycle status of an individual Financial Settlement Item.
 *
 * Lifecycle:
 *
 * PENDING
 *   -> ALLOCATED
 *   -> CANCELLED
 *
 * ALLOCATED
 *   -> SETTLED
 *   -> CANCELLED
 *
 * Terminal states:
 * SETTLED
 * CANCELLED
 */
export class FinancialSettlementItemStatus extends ValueObject<FinancialSettlementItemStatusProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: FinancialSettlementItemStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(
    value: FinancialSettlementItemStatusValue,
  ): FinancialSettlementItemStatus {
    return new FinancialSettlementItemStatus(value);
  }

  public static pending(): FinancialSettlementItemStatus {
    return new FinancialSettlementItemStatus(
      FinancialSettlementItemStatusValue.PENDING,
    );
  }

  public static allocated(): FinancialSettlementItemStatus {
    return new FinancialSettlementItemStatus(
      FinancialSettlementItemStatusValue.ALLOCATED,
    );
  }

  public static settled(): FinancialSettlementItemStatus {
    return new FinancialSettlementItemStatus(
      FinancialSettlementItemStatusValue.SETTLED,
    );
  }

  public static cancelled(): FinancialSettlementItemStatus {
    return new FinancialSettlementItemStatus(
      FinancialSettlementItemStatusValue.CANCELLED,
    );
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.props.value === FinancialSettlementItemStatusValue.PENDING;
  }

  public isAllocated(): boolean {
    return this.props.value === FinancialSettlementItemStatusValue.ALLOCATED;
  }

  public isSettled(): boolean {
    return this.props.value === FinancialSettlementItemStatusValue.SETTLED;
  }

  public isCancelled(): boolean {
    return this.props.value === FinancialSettlementItemStatusValue.CANCELLED;
  }

  public isTerminal(): boolean {
    return this.isSettled() || this.isCancelled();
  }

  // ---------------------------------------------------------------------------
  // Transition Predicates
  // ---------------------------------------------------------------------------

  public canAllocate(): boolean {
    return this.isPending();
  }

  public canSettle(): boolean {
    return this.isAllocated();
  }

  public canCancel(): boolean {
    return this.isPending() || this.isAllocated();
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): FinancialSettlementItemStatusValue {
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

export type { FinancialSettlementItemStatusProps };