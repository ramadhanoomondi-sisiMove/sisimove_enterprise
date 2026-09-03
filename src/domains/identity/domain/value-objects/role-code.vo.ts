// -----------------------------------------------------------------------------
// Role Code
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface RoleCodeProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Stable machine-readable code identifying a Role.
 *
 * Role codes are used internally for authorization and permission checks.
 *
 * Examples:
 *
 *   MEMBER
 *   DRIVER
 *   ADMIN
 *   SUPPORT_AGENT
 *
 * The code is normalized to uppercase and may contain uppercase letters,
 * numbers, and underscores.
 */
export class RoleCode extends ValueObject<RoleCodeProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  private static readonly MAX_LENGTH = 100;

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: string) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Role Code.
   *
   * The supplied value is normalized to uppercase and validated before
   * entering the domain.
   */
  public static create(value: string): RoleCode {
    const normalized = value.trim().toUpperCase();

    RoleCode.validate(normalized);

    return new RoleCode(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('Role code is required.');
    }

    if (value.length > RoleCode.MAX_LENGTH) {
      throw new Error(
        `Role code must not exceed ${RoleCode.MAX_LENGTH} characters.`,
      );
    }

    if (!RoleCode.isValid(value)) {
      throw new Error(`Invalid Role code: ${value}`);
    }
  }

  /**
   * Validates the structural format of a Role Code.
   *
   * Allowed:
   * - uppercase letters;
   * - numbers;
   * - underscores.
   *
   * The code must begin and end with an alphanumeric character.
   */
  public static isValid(value: string): boolean {
    return /^[A-Z0-9](?:[A-Z0-9_]*[A-Z0-9])?$/.test(value);
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): string {
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

export type { RoleCodeProps };
