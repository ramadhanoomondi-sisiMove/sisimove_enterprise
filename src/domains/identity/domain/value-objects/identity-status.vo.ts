// -----------------------------------------------------------------------------
// Identity Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface IdentityStatusProps {
  value: IdentityStatusValue;
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Lifecycle states of an Identity.
 *
 * PENDING
 *   Identity has been created but is not yet active.
 *
 * ACTIVE
 *   Identity is active and may use the platform according to its
 *   authorization and verification state.
 *
 * SUSPENDED
 *   Identity access or participation has been temporarily restricted.
 *
 * CLOSED
 *   Identity has been permanently closed.
 */
export type IdentityStatusValue = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'CLOSED';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

export const IDENTITY_STATUSES: readonly IdentityStatusValue[] = [
  'PENDING',
  'ACTIVE',
  'SUSPENDED',
  'CLOSED',
];

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Defines the lifecycle status of an Identity.
 *
 * The status is responsible for expressing the current lifecycle state of
 * the Identity aggregate and for determining which lifecycle transitions
 * are permitted.
 *
 * Lifecycle:
 *
 * PENDING
 *   -> ACTIVE
 *   -> CLOSED
 *
 * ACTIVE
 *   -> SUSPENDED
 *   -> CLOSED
 *
 * SUSPENDED
 *   -> ACTIVE
 *   -> CLOSED
 *
 * CLOSED
 *   Terminal state.
 */
export class IdentityStatus extends ValueObject<IdentityStatusProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: IdentityStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates an Identity Status.
   *
   * The supplied value is normalized to uppercase and validated before
   * entering the domain.
   */
  public static create(value: string): IdentityStatus {
    const normalized = value.trim().toUpperCase();

    IdentityStatus.validate(normalized);

    return new IdentityStatus(normalized as IdentityStatusValue);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!IdentityStatus.isValid(value)) {
      throw new Error(`Invalid Identity status: ${value}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Static Predicates
  // ---------------------------------------------------------------------------

  public static isValid(value: string): value is IdentityStatusValue {
    return IDENTITY_STATUSES.includes(value as IdentityStatusValue);
  }

  // ---------------------------------------------------------------------------
  // Instance Predicates
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.props.value === 'PENDING';
  }

  public isActive(): boolean {
    return this.props.value === 'ACTIVE';
  }

  public isSuspended(): boolean {
    return this.props.value === 'SUSPENDED';
  }

  public isClosed(): boolean {
    return this.props.value === 'CLOSED';
  }

  public isTerminal(): boolean {
    return this.isClosed();
  }

  // ---------------------------------------------------------------------------
  // Transition Predicates
  // ---------------------------------------------------------------------------

  /**
   * Determines whether the Identity can be activated.
   *
   * Activation is permitted from PENDING and SUSPENDED states.
   */
  public canActivate(): boolean {
    return this.isPending() || this.isSuspended();
  }

  /**
   * Determines whether the Identity can be suspended.
   *
   * Only an ACTIVE identity can be suspended.
   */
  public canSuspend(): boolean {
    return this.isActive();
  }

  /**
   * Determines whether the Identity can be closed.
   *
   * PENDING, ACTIVE, and SUSPENDED identities may be closed.
   */
  public canClose(): boolean {
    return !this.isClosed();
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): IdentityStatusValue {
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

export type { IdentityStatusProps };
