// -----------------------------------------------------------------------------
// Support Case Assigned To Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SupportCaseAssignedToPublicIdProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of the Identity member assigned to handle a Support Case.
 *
 * The assigned member belongs to the Identity domain.
 *
 * Support stores only the member's public identity and does not own,
 * generate, or persist the Identity aggregate.
 *
 * This is an opaque cross-domain reference.
 */
export class SupportCaseAssignedToPublicId extends ValueObject<SupportCaseAssignedToPublicIdProps> {
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
   * Creates a Support Case assignee public ID reference.
   */
  public static create(value: string): SupportCaseAssignedToPublicId {
    return new SupportCaseAssignedToPublicId(
      SupportCaseAssignedToPublicId.validate(value),
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Support case assigned-to public ID must be a string.');
    }

    const normalized = value.trim();

    if (!normalized) {
      throw new Error('Support case assigned-to public ID cannot be empty.');
    }

    return normalized;
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

export type { SupportCaseAssignedToPublicIdProps };
