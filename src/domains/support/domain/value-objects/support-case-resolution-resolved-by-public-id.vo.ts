// -----------------------------------------------------------------------------
// Support Case Resolution Resolved By Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SupportCaseResolutionResolvedByPublicIdProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of the Identity member who resolved a Support Case.
 *
 * The Identity aggregate belongs to the Identity domain.
 *
 * Support stores only the member's public identity and does not own,
 * generate, or persist the Identity aggregate.
 *
 * This is an opaque cross-domain reference.
 */
export class SupportCaseResolutionResolvedByPublicId extends ValueObject<SupportCaseResolutionResolvedByPublicIdProps> {
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
   * Creates a Support Case Resolution resolver public ID reference.
   */
  public static create(value: string): SupportCaseResolutionResolvedByPublicId {
    return new SupportCaseResolutionResolvedByPublicId(
      SupportCaseResolutionResolvedByPublicId.validate(value),
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): string {
    if (typeof value !== 'string') {
      throw new Error(
        'Support case resolution resolved-by public ID must be a string.',
      );
    }

    const normalized = value.trim();

    if (!normalized) {
      throw new Error(
        'Support case resolution resolved-by public ID cannot be empty.',
      );
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

export type { SupportCaseResolutionResolvedByPublicIdProps };
