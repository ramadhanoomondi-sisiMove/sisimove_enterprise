// -----------------------------------------------------------------------------
// Permission Resource
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface PermissionResourceProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Resource protected by a Permission.
 *
 * Represents the domain resource against which an authorization action
 * is evaluated.
 *
 * Examples:
 *
 *   IDENTITY
 *   USER
 *   JOURNEY
 *   BOOKING
 *   FINANCIAL_ACCOUNT
 *   VERIFICATION
 */
export class PermissionResource extends ValueObject<PermissionResourceProps> {
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
   * Creates a Permission Resource.
   *
   * The supplied value is trimmed, normalized to uppercase, and validated
   * before entering the domain.
   */
  public static create(value: string): PermissionResource {
    const normalized = value.trim().toUpperCase();

    PermissionResource.validate(normalized);

    return new PermissionResource(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('Permission resource is required.');
    }

    if (value.length > PermissionResource.MAX_LENGTH) {
      throw new Error(
        `Permission resource must not exceed ${PermissionResource.MAX_LENGTH} characters.`,
      );
    }

    if (!PermissionResource.isValid(value)) {
      throw new Error(`Invalid Permission resource: ${value}`);
    }
  }

  /**
   * Validates the structural format of a Permission Resource.
   *
   * Allowed:
   * - uppercase letters;
   * - numbers;
   * - underscores.
   *
   * The resource must begin and end with an alphanumeric character.
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

export type { PermissionResourceProps };
