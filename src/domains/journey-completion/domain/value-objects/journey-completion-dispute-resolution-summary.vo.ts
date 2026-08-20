// -----------------------------------------------------------------------------
// Journey Completion Dispute Resolution Summary
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyCompletionDisputeResolutionSummaryProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_RESOLUTION_SUMMARY_LENGTH = 10;
const MAX_RESOLUTION_SUMMARY_LENGTH = 2000;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Resolution summary for a Journey Completion dispute.
 *
 * Records the outcome and supporting explanation of a dispute resolution.
 *
 * This value is intentionally separate from the dispute reason and the
 * original dispute description.
 */
export class JourneyCompletionDisputeResolutionSummary extends ValueObject<JourneyCompletionDisputeResolutionSummaryProps> {
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
   * Creates a dispute resolution summary.
   *
   * The value is trimmed and validated before entering the domain.
   */
  public static create(
    value: string,
  ): JourneyCompletionDisputeResolutionSummary {
    const normalized = value.trim();

    JourneyCompletionDisputeResolutionSummary.validate(normalized);

    return new JourneyCompletionDisputeResolutionSummary(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (value.length < MIN_RESOLUTION_SUMMARY_LENGTH) {
      throw new Error(
        `Journey Completion dispute resolution summary must contain at least ${MIN_RESOLUTION_SUMMARY_LENGTH} characters`,
      );
    }

    if (value.length > MAX_RESOLUTION_SUMMARY_LENGTH) {
      throw new Error(
        `Journey Completion dispute resolution summary must not exceed ${MAX_RESOLUTION_SUMMARY_LENGTH} characters`,
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isEmpty(): boolean {
    return this.props.value.length === 0;
  }

  public hasContent(): boolean {
    return this.props.value.length > 0;
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
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_RESOLUTION_SUMMARY_LENGTH as JOURNEY_COMPLETION_DISPUTE_RESOLUTION_SUMMARY_MIN_LENGTH,
  MAX_RESOLUTION_SUMMARY_LENGTH as JOURNEY_COMPLETION_DISPUTE_RESOLUTION_SUMMARY_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyCompletionDisputeResolutionSummaryProps };
