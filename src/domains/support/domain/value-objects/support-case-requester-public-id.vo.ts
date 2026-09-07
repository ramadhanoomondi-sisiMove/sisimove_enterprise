// -----------------------------------------------------------------------------
// Support Case Requester Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SupportCaseRequesterPublicIdProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of the Identity member who requested a Support Case.
 *
 * The Identity aggregate belongs to the Identity domain.
 *
 * Support stores only the member's public identity and does not own,
 * generate, or persist the Identity aggregate.
 *
 * This is an opaque cross-domain reference.
 */
export class SupportCaseRequesterPublicId extends ValueObject<SupportCaseRequesterPublicIdProps> {
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
   * Creates a Support Case requester public ID reference.
   */
  public static create(value: string): SupportCaseRequesterPublicId {
    return new SupportCaseRequesterPublicId(
      SupportCaseRequesterPublicId.validate(value),
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Support case requester public ID must be a string.');
    }

    const normalized = value.trim();

    if (!normalized) {
      throw new Error('Support case requester public ID cannot be empty.');
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

export type { SupportCaseRequesterPublicIdProps };
