// -----------------------------------------------------------------------------
// Support Case Evidence Description
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SupportCaseEvidenceDescriptionProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Optional descriptive text explaining Support Case Evidence.
 *
 * The persistence model allows this value to be null. Therefore, the
 * value object represents the description only when a description exists.
 */
export class SupportCaseEvidenceDescription extends ValueObject<SupportCaseEvidenceDescriptionProps> {
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
   * Creates Support Case Evidence description.
   */
  public static create(value: string): SupportCaseEvidenceDescription {
    return new SupportCaseEvidenceDescription(
      SupportCaseEvidenceDescription.validate(value),
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Support case evidence description must be a string.');
    }

    const normalized = value.trim();

    if (!normalized) {
      throw new Error('Support case evidence description cannot be empty.');
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

export type { SupportCaseEvidenceDescriptionProps };
