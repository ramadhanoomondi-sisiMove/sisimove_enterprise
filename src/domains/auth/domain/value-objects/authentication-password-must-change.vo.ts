// -----------------------------------------------------------------------------
// Authentication Password Must Change
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AuthenticationPasswordMustChangeProps {
  value: boolean;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Indicates whether the Authentication password must be changed before the
 * Identity may continue normal authentication.
 *
 * This flag is used for security workflows such as:
 *
 * - administrator-forced password changes;
 * - temporary passwords;
 * - password reset completion;
 * - security policies requiring a new password.
 *
 * The value object contains no workflow logic. The Authentication aggregate
 * determines when the flag is set or cleared.
 */
export class AuthenticationPasswordMustChange extends ValueObject<AuthenticationPasswordMustChangeProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: boolean) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates an Authentication password-must-change value object.
   */
  public static create(value: boolean): AuthenticationPasswordMustChange {
    AuthenticationPasswordMustChange.validate(value);

    return new AuthenticationPasswordMustChange(value);
  }

  /**
   * Creates a value indicating that the password must be changed.
   */
  public static required(): AuthenticationPasswordMustChange {
    return new AuthenticationPasswordMustChange(true);
  }

  /**
   * Creates a value indicating that the password does not currently need
   * to be changed.
   */
  public static notRequired(): AuthenticationPasswordMustChange {
    return new AuthenticationPasswordMustChange(false);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: boolean): void {
    if (typeof value !== 'boolean') {
      throw new Error(
        'Authentication password must-change value must be a boolean.',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  /**
   * Determines whether the password must be changed.
   */
  public isRequired(): boolean {
    return this.props.value;
  }

  /**
   * Determines whether the password does not currently need to be changed.
   */
  public isNotRequired(): boolean {
    return !this.props.value;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): boolean {
    return this.props.value;
  }

  // ---------------------------------------------------------------------------
  // Serialization
  // ---------------------------------------------------------------------------

  public override toString(): string {
    return String(this.props.value);
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { AuthenticationPasswordMustChangeProps };
