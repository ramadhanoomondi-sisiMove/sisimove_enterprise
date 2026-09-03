// -----------------------------------------------------------------------------
// Authentication Password Version
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AuthenticationPasswordVersionProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Version number of the password associated with an Authentication.
 *
 * The password version is incremented whenever the Authentication password is
 * successfully changed or reset.
 *
 * It provides a stable version marker that can be used to invalidate existing
 * credentials, sessions, tokens, or other authentication artifacts associated
 * with an older password state.
 *
 * Password versions are positive integers and begin at version 1.
 */
export class AuthenticationPasswordVersion extends ValueObject<AuthenticationPasswordVersionProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly INITIAL = 1;

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: number) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates an Authentication password version value object.
   */
  public static create(value: number): AuthenticationPasswordVersion {
    AuthenticationPasswordVersion.validate(value);

    return new AuthenticationPasswordVersion(value);
  }

  /**
   * Creates the initial password version.
   */
  public static initial(): AuthenticationPasswordVersion {
    return new AuthenticationPasswordVersion(
      AuthenticationPasswordVersion.INITIAL,
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: number): void {
    if (!Number.isInteger(value)) {
      throw new Error('Authentication password version must be an integer.');
    }

    if (value < AuthenticationPasswordVersion.INITIAL) {
      throw new Error(
        `Authentication password version must be greater than or equal to ${AuthenticationPasswordVersion.INITIAL}.`,
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Version Operations
  // ---------------------------------------------------------------------------

  /**
   * Returns the next password version.
   *
   * This should be used when a password is successfully changed or reset.
   */
  public next(): AuthenticationPasswordVersion {
    return new AuthenticationPasswordVersion(this.props.value + 1);
  }

  /**
   * Determines whether this version is newer than another password version.
   */
  public isNewerThan(other: AuthenticationPasswordVersion): boolean {
    return this.props.value > other.value;
  }

  /**
   * Determines whether this version is older than another password version.
   */
  public isOlderThan(other: AuthenticationPasswordVersion): boolean {
    return this.props.value < other.value;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): number {
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

export type { AuthenticationPasswordVersionProps };
