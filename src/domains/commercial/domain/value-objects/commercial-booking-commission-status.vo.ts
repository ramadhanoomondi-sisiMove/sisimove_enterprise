// -----------------------------------------------------------------------------
// Commercial Booking Commission Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Values
// -----------------------------------------------------------------------------

export const COMMERCIAL_BOOKING_COMMISSION_STATUSES = [
  'PENDING',
  'ASSESSED',
  'CANCELLED',
] as const;

export type CommercialBookingCommissionStatusValue =
  (typeof COMMERCIAL_BOOKING_COMMISSION_STATUSES)[number];

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface CommercialBookingCommissionStatusProps {
  value: CommercialBookingCommissionStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Lifecycle status of a Commercial Booking Commission.
 *
 * PENDING
 *   The booking commission has been created but has not yet been assessed.
 *
 * ASSESSED
 *   The booking commission has been calculated and formally assessed.
 *
 * CANCELLED
 *   The booking commission has been cancelled and is no longer active.
 */
export class CommercialBookingCommissionStatus extends ValueObject<CommercialBookingCommissionStatusProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: CommercialBookingCommissionStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a booking commission status from an external/runtime string.
   *
   * The value is normalized and validated before entering the domain.
   */
  public static create(value: string): CommercialBookingCommissionStatus {
    const normalized = value.trim().toUpperCase();

    if (!CommercialBookingCommissionStatus.isValid(normalized)) {
      throw new Error(`Invalid Commercial Booking Commission status: ${value}`);
    }

    return new CommercialBookingCommissionStatus(normalized);
  }

  // ---------------------------------------------------------------------------
  // Named Factories
  // ---------------------------------------------------------------------------

  public static pending(): CommercialBookingCommissionStatus {
    return new CommercialBookingCommissionStatus('PENDING');
  }

  public static assessed(): CommercialBookingCommissionStatus {
    return new CommercialBookingCommissionStatus('ASSESSED');
  }

  public static cancelled(): CommercialBookingCommissionStatus {
    return new CommercialBookingCommissionStatus('CANCELLED');
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  public static isValid(
    value: string,
  ): value is CommercialBookingCommissionStatusValue {
    return COMMERCIAL_BOOKING_COMMISSION_STATUSES.includes(
      value as CommercialBookingCommissionStatusValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.props.value === 'PENDING';
  }

  public isAssessed(): boolean {
    return this.props.value === 'ASSESSED';
  }

  public isCancelled(): boolean {
    return this.props.value === 'CANCELLED';
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Predicates
  // ---------------------------------------------------------------------------

  /**
   * Indicates that the commission is still awaiting assessment.
   */
  public isActive(): boolean {
    return this.isPending() || this.isAssessed();
  }

  /**
   * Indicates that the commission has reached a terminal state.
   */
  public isTerminal(): boolean {
    return this.isCancelled();
  }

  /**
   * Indicates whether the commission can be assessed.
   */
  public canAssess(): boolean {
    return this.isPending();
  }

  /**
   * Indicates whether the commission can be cancelled.
   */
  public canCancel(): boolean {
    return this.isPending() || this.isAssessed();
  }

  // ---------------------------------------------------------------------------
  // Status Transition
  // ---------------------------------------------------------------------------

  /**
   * Determines whether the commission may transition to the supplied status.
   *
   * The aggregate remains responsible for enforcing the broader business
   * invariants surrounding the transition.
   */
  public canTransitionTo(status: CommercialBookingCommissionStatus): boolean {
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

  public get value(): CommercialBookingCommissionStatusValue {
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

export type { CommercialBookingCommissionStatusProps };
