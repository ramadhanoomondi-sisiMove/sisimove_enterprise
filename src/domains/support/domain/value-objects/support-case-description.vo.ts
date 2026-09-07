// -----------------------------------------------------------------------------
// Support Case Description
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SupportCaseDescriptionProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the optional description of a Support Case.
 *
 * Unlike the subject, the Support Case description is optional according
 * to the persistence model.
 *
 * When provided, the description must contain meaningful content.
 */
export class SupportCaseDescription extends ValueObject<SupportCaseDescriptionProps> {
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
   * Creates a Support Case description.
   *
   * The application/domain layer may omit the value entirely when the
   * Support Case does not require a description.
   */
  public static create(value: string): SupportCaseDescription {
    return new SupportCaseDescription(SupportCaseDescription.validate(value));
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Support case description must be a string.');
    }

    const normalized = value.trim();

    if (!normalized) {
      throw new Error('Support case description cannot be empty.');
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

export type { SupportCaseDescriptionProps };
