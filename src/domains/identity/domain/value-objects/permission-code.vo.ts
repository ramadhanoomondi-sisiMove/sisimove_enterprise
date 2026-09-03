// -----------------------------------------------------------------------------
// Permission Code
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface PermissionCodeProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Stable machine-readable code identifying a Permission.
 *
 * Permission codes are used by the authorization layer to identify
 * capabilities independently of display names or database identifiers.
 *
 * Examples:
 *
 *   JOURNEY_CREATE
 *   JOURNEY_READ
 *   BOOKING_CREATE
 *   ADMIN_MANAGE_USERS
 */
export class PermissionCode extends ValueObject<PermissionCodeProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  private static readonly MAX_LENGTH = 150;

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
   * Creates a Permission Code.
   *
   * The supplied value is trimmed, normalized to uppercase, and validated
   * before entering the domain.
   */
  public static create(value: string): PermissionCode {
    const normalized = value.trim().toUpperCase();

    PermissionCode.validate(normalized);

    return new PermissionCode(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('Permission code is required.');
    }

    if (value.length > PermissionCode.MAX_LENGTH) {
      throw new Error(
        `Permission code must not exceed ${PermissionCode.MAX_LENGTH} characters.`,
      );
    }

    if (!PermissionCode.isValid(value)) {
      throw new Error(`Invalid Permission code: ${value}`);
    }
  }

  /**
   * Validates the structural format of a Permission Code.
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

export type { PermissionCodeProps };
