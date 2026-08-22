// -----------------------------------------------------------------------------
// Commercial Earning Commission Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Values
// -----------------------------------------------------------------------------

export const COMMERCIAL_EARNING_COMMISSION_STATUSES = [
  'PENDING',
  'ASSESSED',
  'CANCELLED',
] as const;

export type CommercialEarningCommissionStatusValue =
  (typeof COMMERCIAL_EARNING_COMMISSION_STATUSES)[number];

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface CommercialEarningCommissionStatusProps {
  value: CommercialEarningCommissionStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Lifecycle status of a Commercial Earning Commission.
 *
 * PENDING
 *   The commission has been created but has not yet been assessed.
 *
 * ASSESSED
 *   The commission has been formally assessed and is included in the
 *   commercial calculation associated with the settlement.
 *
 * CANCELLED
 *   The commission has been cancelled and must no longer be treated as
 *   an active commercial commission.
 *
 * Lifecycle:
 *
 *   PENDING
 *      ├──> ASSESSED
 *      │       └──> CANCELLED
 *      │
 *      └──> CANCELLED
 *
 * The value object defines the valid status transitions. The aggregate
 * remains responsible for enforcing the broader business rules around
 * those transitions.
 */
export class CommercialEarningCommissionStatus extends ValueObject<CommercialEarningCommissionStatusProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: CommercialEarningCommissionStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Commercial Earning Commission status from an external value.
   *
   * Input is normalized before validation so that runtime values such as
   * "pending", " Pending ", or "PENDING" are treated consistently.
   */
  public static create(value: string): CommercialEarningCommissionStatus {
    const normalized = value.trim().toUpperCase();

    if (!CommercialEarningCommissionStatus.isValid(normalized)) {
      throw new Error(`Invalid Commercial Earning Commission status: ${value}`);
    }

    return new CommercialEarningCommissionStatus(normalized);
  }

  // ---------------------------------------------------------------------------
  // Named Factories
  // ---------------------------------------------------------------------------

  /**
   * Creates a PENDING status.
   */
  public static pending(): CommercialEarningCommissionStatus {
    return new CommercialEarningCommissionStatus('PENDING');
  }

  /**
   * Creates an ASSESSED status.
   */
  public static assessed(): CommercialEarningCommissionStatus {
    return new CommercialEarningCommissionStatus('ASSESSED');
  }

  /**
   * Creates a CANCELLED status.
   */
  public static cancelled(): CommercialEarningCommissionStatus {
    return new CommercialEarningCommissionStatus('CANCELLED');
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  /**
   * Determines whether a value is a valid Commercial Earning Commission
   * status.
   */
  public static isValid(
    value: string,
  ): value is CommercialEarningCommissionStatusValue {
    return COMMERCIAL_EARNING_COMMISSION_STATUSES.includes(
      value as CommercialEarningCommissionStatusValue,
    );
  }

  // ---------------------------------------------------------------------------
  // State Predicates
  // ---------------------------------------------------------------------------

  /**
   * Indicates that the commission is awaiting assessment.
   */
  public isPending(): boolean {
    return this.props.value === 'PENDING';
  }

  /**
   * Indicates that the commission has been assessed.
   */
  public isAssessed(): boolean {
    return this.props.value === 'ASSESSED';
  }

  /**
   * Indicates that the commission has been cancelled.
   */
  public isCancelled(): boolean {
    return this.props.value === 'CANCELLED';
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Predicates
  // ---------------------------------------------------------------------------

  /**
   * Indicates that the commission remains part of the active commercial
   * lifecycle.
   *
   * Both PENDING and ASSESSED commissions remain active because an assessed
   * commission may still be cancelled according to the domain lifecycle.
   */
  public isActive(): boolean {
    return this.isPending() || this.isAssessed();
  }

  /**
   * Indicates that the commission has reached its terminal state.
   */
  public isTerminal(): boolean {
    return this.isCancelled();
  }

  /**
   * Indicates whether the commission may currently be assessed.
   */
  public canAssess(): boolean {
    return this.isPending();
  }

  /**
   * Indicates whether the commission may currently be cancelled.
   */
  public canCancel(): boolean {
    return this.isPending() || this.isAssessed();
  }

  // ---------------------------------------------------------------------------
  // Status Transition
  // ---------------------------------------------------------------------------

  /**
   * Determines whether this status may transition to the supplied status.
   *
   * Valid lifecycle transitions:
   *
   * PENDING   -> ASSESSED
   * PENDING   -> CANCELLED
   * ASSESSED  -> CANCELLED
   *
   * Same-state transitions are not considered valid transitions.
   */
  public canTransitionTo(status: CommercialEarningCommissionStatus): boolean {
    if (this.equals(status)) {
      return false;
    }

    if (this.isPending()) {
      return status.isAssessed() || status.isCancelled();
    }

    if (this.isAssessed()) {
      return status.isCancelled();
    }

    return false;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): CommercialEarningCommissionStatusValue {
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

export type { CommercialEarningCommissionStatusProps };
