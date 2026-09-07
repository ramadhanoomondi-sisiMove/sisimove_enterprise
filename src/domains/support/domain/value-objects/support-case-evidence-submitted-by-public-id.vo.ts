// -----------------------------------------------------------------------------
// Support Case Evidence Submitted By Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SupportCaseEvidenceSubmittedByPublicIdProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of the Identity member who submitted Support Case Evidence.
 *
 * The Identity aggregate belongs to the Identity domain.
 *
 * Support stores only the member's public identity and does not own,
 * generate, or persist the Identity aggregate.
 *
 * This is an opaque cross-domain reference.
 */
export class SupportCaseEvidenceSubmittedByPublicId extends ValueObject<SupportCaseEvidenceSubmittedByPublicIdProps> {
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
   * Creates a Support Case Evidence submitter public ID reference.
   */
  public static create(value: string): SupportCaseEvidenceSubmittedByPublicId {
    return new SupportCaseEvidenceSubmittedByPublicId(
      SupportCaseEvidenceSubmittedByPublicId.validate(value),
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): string {
    if (typeof value !== 'string') {
      throw new Error(
        'Support case evidence submitted-by public ID must be a string.',
      );
    }

    const normalized = value.trim();

    if (!normalized) {
      throw new Error(
        'Support case evidence submitted-by public ID cannot be empty.',
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

export type { SupportCaseEvidenceSubmittedByPublicIdProps };
