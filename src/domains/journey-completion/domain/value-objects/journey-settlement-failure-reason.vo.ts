// -----------------------------------------------------------------------------
// Journey Settlement Failure Reason
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneySettlementFailureReasonProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_FAILURE_REASON_LENGTH = 3;
const MAX_FAILURE_REASON_LENGTH = 1000;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Explanation for a failed Journey Settlement.
 *
 * Records the reason why settlement processing failed.
 *
 * This value is intentionally separate from JourneySettlementStatus because
 * the status describes the lifecycle state while this value explains the
 * failure.
 */
export class JourneySettlementFailureReason extends ValueObject<JourneySettlementFailureReasonProps> {
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
   * Creates a settlement failure reason.
   *
   * The value is trimmed and validated before entering the domain.
   */
  public static create(value: string): JourneySettlementFailureReason {
    const normalized = value.trim();

    JourneySettlementFailureReason.validate(normalized);

    return new JourneySettlementFailureReason(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (value.length < MIN_FAILURE_REASON_LENGTH) {
      throw new Error(
        `Journey Settlement failure reason must contain at least ${MIN_FAILURE_REASON_LENGTH} characters`,
      );
    }

    if (value.length > MAX_FAILURE_REASON_LENGTH) {
      throw new Error(
        `Journey Settlement failure reason must not exceed ${MAX_FAILURE_REASON_LENGTH} characters`,
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
  MIN_FAILURE_REASON_LENGTH as JOURNEY_SETTLEMENT_FAILURE_REASON_MIN_LENGTH,
  MAX_FAILURE_REASON_LENGTH as JOURNEY_SETTLEMENT_FAILURE_REASON_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneySettlementFailureReasonProps };
