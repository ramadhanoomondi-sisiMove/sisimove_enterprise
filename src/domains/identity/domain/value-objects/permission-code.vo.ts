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
 * Permission codes use a lowercase namespace/capability format.
 *
 * Examples:
 *
 *   identity:read
 *   journey:create
 *   booking:create
 *   admin:manage-users
 *   authentication:record-failure
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
   * The supplied value is trimmed, normalized to lowercase, and validated
   * before entering the domain.
   */
  public static create(value: string): PermissionCode {
    const normalized = value.trim().toLowerCase();

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
   * - lowercase letters;
   * - numbers;
   * - underscores;
   * - hyphens;
   * - namespace separators (:).
   *
   * Examples:
   *
   *   identity:read
   *   journey:create
   *   booking:create
   *   admin:manage-users
   *   authentication:record-failure
   *
   * The code must begin and end each segment with an alphanumeric
   * character. Namespace segments must not be empty.
   */
  public static isValid(value: string): boolean {
    return /^[a-z0-9](?:[a-z0-9_-]*[a-z0-9])?(?::[a-z0-9](?:[a-z0-9_-]*[a-z0-9])?)*$/.test(
      value,
    );
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
