// -----------------------------------------------------------------------------
// Authentication Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type AuthenticationStatusValue =
  'PENDING' | 'ACTIVE' | 'LOCKED' | 'DISABLED';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AuthenticationStatusProps {
  value: AuthenticationStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the current lifecycle and access status of an Authentication.
 *
 * Authentication status determines whether the Authentication is pending
 * activation, active, temporarily or permanently locked, or disabled.
 *
 * Valid states:
 *
 * - PENDING  — Authentication exists but is not yet active.
 * - ACTIVE   — Authentication is active and may be used.
 * - LOCKED   — Authentication is currently locked.
 * - DISABLED — Authentication has been disabled.
 */
export class AuthenticationStatus extends ValueObject<AuthenticationStatusProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly PENDING: AuthenticationStatusValue = 'PENDING';

  public static readonly ACTIVE: AuthenticationStatusValue = 'ACTIVE';

  public static readonly LOCKED: AuthenticationStatusValue = 'LOCKED';

  public static readonly DISABLED: AuthenticationStatusValue = 'DISABLED';

  private static readonly VALID_VALUES: ReadonlySet<AuthenticationStatusValue> =
    new Set([
      AuthenticationStatus.PENDING,
      AuthenticationStatus.ACTIVE,
      AuthenticationStatus.LOCKED,
      AuthenticationStatus.DISABLED,
    ]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: AuthenticationStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates an Authentication status value object.
   */
  public static create(value: AuthenticationStatusValue): AuthenticationStatus {
    AuthenticationStatus.validate(value);

    return new AuthenticationStatus(value);
  }

  /**
   * Creates a pending Authentication status.
   */
  public static pending(): AuthenticationStatus {
    return new AuthenticationStatus(AuthenticationStatus.PENDING);
  }

  /**
   * Creates an active Authentication status.
   */
  public static active(): AuthenticationStatus {
    return new AuthenticationStatus(AuthenticationStatus.ACTIVE);
  }

  /**
   * Creates a locked Authentication status.
   */
  public static locked(): AuthenticationStatus {
    return new AuthenticationStatus(AuthenticationStatus.LOCKED);
  }

  /**
   * Creates a disabled Authentication status.
   */
  public static disabled(): AuthenticationStatus {
    return new AuthenticationStatus(AuthenticationStatus.DISABLED);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(
    value: string,
  ): asserts value is AuthenticationStatusValue {
    if (
      !AuthenticationStatus.VALID_VALUES.has(value as AuthenticationStatusValue)
    ) {
      throw new Error(`Invalid Authentication status: ${value}`);
    }
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.props.value === AuthenticationStatus.PENDING;
  }

  public isActive(): boolean {
    return this.props.value === AuthenticationStatus.ACTIVE;
  }

  public isLocked(): boolean {
    return this.props.value === AuthenticationStatus.LOCKED;
  }

  public isDisabled(): boolean {
    return this.props.value === AuthenticationStatus.DISABLED;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): AuthenticationStatusValue {
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

export type { AuthenticationStatusProps };
