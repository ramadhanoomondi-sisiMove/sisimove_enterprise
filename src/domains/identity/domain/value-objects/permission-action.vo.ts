// -----------------------------------------------------------------------------
// Permission Action
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface PermissionActionProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Action represented by a Permission.
 *
 * Defines the operation that an Identity may perform against a protected
 * resource.
 *
 * Examples:
 *
 *   CREATE
 *   READ
 *   UPDATE
 *   DELETE
 *   MANAGE
 *   APPROVE
 *   REJECT
 */
export class PermissionAction extends ValueObject<PermissionActionProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  private static readonly MAX_LENGTH = 50;

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
   * Creates a Permission Action.
   *
   * The supplied value is trimmed, normalized to uppercase, and validated
   * before entering the domain.
   */
  public static create(value: string): PermissionAction {
    const normalized = value.trim().toUpperCase();

    PermissionAction.validate(normalized);

    return new PermissionAction(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('Permission action is required.');
    }

    if (value.length > PermissionAction.MAX_LENGTH) {
      throw new Error(
        `Permission action must not exceed ${PermissionAction.MAX_LENGTH} characters.`,
      );
    }

    if (!PermissionAction.isValid(value)) {
      throw new Error(`Invalid Permission action: ${value}`);
    }
  }

  /**
   * Validates the structural format of a Permission Action.
   *
   * Allowed:
   * - uppercase letters;
   * - numbers;
   * - underscores.
   *
   * The action must begin and end with an alphanumeric character.
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

export type { PermissionActionProps };
