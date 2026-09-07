// -----------------------------------------------------------------------------
// Support Case Note Author Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SupportCaseNoteAuthorPublicIdProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of the Identity member who authored a Support Case Note.
 *
 * The Identity aggregate belongs to the Identity domain.
 *
 * Support stores only the member's public identity and does not own,
 * generate, or persist the Identity aggregate.
 *
 * This is an opaque cross-domain reference.
 */
export class SupportCaseNoteAuthorPublicId extends ValueObject<SupportCaseNoteAuthorPublicIdProps> {
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
   * Creates a Support Case Note author public ID reference.
   */
  public static create(value: string): SupportCaseNoteAuthorPublicId {
    return new SupportCaseNoteAuthorPublicId(
      SupportCaseNoteAuthorPublicId.validate(value),
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Support case note author public ID must be a string.');
    }

    const normalized = value.trim();

    if (!normalized) {
      throw new Error('Support case note author public ID cannot be empty.');
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

export type { SupportCaseNoteAuthorPublicIdProps };
