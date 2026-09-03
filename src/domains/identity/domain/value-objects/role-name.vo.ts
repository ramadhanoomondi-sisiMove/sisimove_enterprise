// -----------------------------------------------------------------------------
// Role Name
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface RoleNameProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Human-readable name of a Role.
 *
 * Represents the display name used to identify a Role within the Identity
 * and Authorization domain.
 *
 * Unlike RoleCode, which is a stable machine-readable identifier, RoleName
 * is intended for human-facing administration and presentation.
 */
export class RoleName extends ValueObject<RoleNameProps> {
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
   * Creates a Role Name.
   *
   * The supplied value is trimmed and validated before entering the domain.
   * Original casing is preserved.
   */
  public static create(value: string): RoleName {
    const normalized = value.trim();

    RoleName.validate(normalized);

    return new RoleName(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('Role name is required.');
    }

    if (value.length > RoleName.MAX_LENGTH) {
      throw new Error(
        `Role name must not exceed ${RoleName.MAX_LENGTH} characters.`,
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Static Predicates
  // ---------------------------------------------------------------------------

  public static isValid(value: string): boolean {
    const normalized = value.trim();

    return normalized.length > 0 && normalized.length <= RoleName.MAX_LENGTH;
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

export type { RoleNameProps };
