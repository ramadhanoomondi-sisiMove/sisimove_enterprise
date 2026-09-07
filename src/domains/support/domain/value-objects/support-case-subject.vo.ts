// -----------------------------------------------------------------------------
// Support Case Subject
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SupportCaseSubjectProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the subject/title of a Support Case.
 *
 * A Support Case must always have a meaningful subject.
 */
export class SupportCaseSubject extends ValueObject<SupportCaseSubjectProps> {
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
   * Creates a Support Case subject.
   */
  public static create(value: string): SupportCaseSubject {
    return new SupportCaseSubject(SupportCaseSubject.validate(value));
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Support case subject must be a string.');
    }

    const normalized = value.trim();

    if (!normalized) {
      throw new Error('Support case subject cannot be empty.');
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

export type { SupportCaseSubjectProps };
