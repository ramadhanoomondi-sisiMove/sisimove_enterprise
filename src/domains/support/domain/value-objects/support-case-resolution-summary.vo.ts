// -----------------------------------------------------------------------------
// Support Case Resolution Summary
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SupportCaseResolutionSummaryProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the summary describing how a Support Case was resolved.
 *
 * Resolution summary is mandatory and therefore cannot be empty.
 */
export class SupportCaseResolutionSummary extends ValueObject<SupportCaseResolutionSummaryProps> {
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
   * Creates a Support Case Resolution summary.
   */
  public static create(value: string): SupportCaseResolutionSummary {
    return new SupportCaseResolutionSummary(
      SupportCaseResolutionSummary.validate(value),
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Support case resolution summary must be a string.');
    }

    const normalized = value.trim();

    if (!normalized) {
      throw new Error('Support case resolution summary cannot be empty.');
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

export type { SupportCaseResolutionSummaryProps };
