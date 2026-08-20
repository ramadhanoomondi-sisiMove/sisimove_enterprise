// -----------------------------------------------------------------------------
// Journey Completion Dispute Description
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyCompletionDisputeDescriptionProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_DESCRIPTION_LENGTH = 10;
const MAX_DESCRIPTION_LENGTH = 2000;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Detailed description of a Journey Completion dispute.
 *
 * The description provides additional context explaining the circumstances
 * behind a dispute and is intentionally separate from the structured
 * JourneyCompletionDisputeReason.
 */
export class JourneyCompletionDisputeDescription extends ValueObject<JourneyCompletionDisputeDescriptionProps> {
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
   * Creates a dispute description.
   *
   * The value is trimmed and validated before entering the domain.
   */
  public static create(value: string): JourneyCompletionDisputeDescription {
    const normalized = value.trim();

    JourneyCompletionDisputeDescription.validate(normalized);

    return new JourneyCompletionDisputeDescription(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (value.length < MIN_DESCRIPTION_LENGTH) {
      throw new Error(
        `Journey Completion dispute description must contain at least ${MIN_DESCRIPTION_LENGTH} characters`,
      );
    }

    if (value.length > MAX_DESCRIPTION_LENGTH) {
      throw new Error(
        `Journey Completion dispute description must not exceed ${MAX_DESCRIPTION_LENGTH} characters`,
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
  MIN_DESCRIPTION_LENGTH as JOURNEY_COMPLETION_DISPUTE_DESCRIPTION_MIN_LENGTH,
  MAX_DESCRIPTION_LENGTH as JOURNEY_COMPLETION_DISPUTE_DESCRIPTION_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyCompletionDisputeDescriptionProps };
