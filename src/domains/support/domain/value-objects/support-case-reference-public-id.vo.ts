// -----------------------------------------------------------------------------
// Support Case Reference Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SupportCaseReferencePublicIdProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of the resource referenced by a Support Case.
 *
 * The referenced resource belongs to another domain or bounded context.
 *
 * Support stores only the resource's public identity and does not own,
 * generate, or persist the referenced aggregate.
 *
 * This is an opaque cross-domain reference.
 */
export class SupportCaseReferencePublicId extends ValueObject<SupportCaseReferencePublicIdProps> {
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
   * Creates a Support Case reference public ID.
   */
  public static create(value: string): SupportCaseReferencePublicId {
    return new SupportCaseReferencePublicId(
      SupportCaseReferencePublicId.validate(value),
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Support case reference public ID must be a string.');
    }

    const normalized = value.trim();

    if (!normalized) {
      throw new Error('Support case reference public ID cannot be empty.');
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

export type { SupportCaseReferencePublicIdProps };
