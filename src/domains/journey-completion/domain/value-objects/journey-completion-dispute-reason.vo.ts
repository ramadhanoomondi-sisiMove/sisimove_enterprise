// -----------------------------------------------------------------------------
// Journey Completion Dispute Reason
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Values
// -----------------------------------------------------------------------------

export const JOURNEY_COMPLETION_DISPUTE_REASONS = [
  'JOURNEY_NOT_COMPLETED',
  'PASSENGER_DID_NOT_TRAVEL',
  'PROVIDER_DID_NOT_TRAVEL',
  'WRONG_DESTINATION',
  'EARLY_TERMINATION',
  'SAFETY_ISSUE',
  'OTHER',
] as const;

export type JourneyCompletionDisputeReasonValue =
  (typeof JOURNEY_COMPLETION_DISPUTE_REASONS)[number];

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyCompletionDisputeReasonProps {
  value: JourneyCompletionDisputeReasonValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Reason for disputing a Journey Completion.
 *
 * JOURNEY_NOT_COMPLETED
 *   The Journey was not completed as expected.
 *
 * PASSENGER_DID_NOT_TRAVEL
 *   The passenger did not actually travel on the Journey.
 *
 * PROVIDER_DID_NOT_TRAVEL
 *   The provider did not undertake or complete the Journey.
 *
 * WRONG_DESTINATION
 *   The Journey ended at a destination different from the expected
 *   destination.
 *
 * EARLY_TERMINATION
 *   The Journey ended before reaching its expected completion point.
 *
 * SAFETY_ISSUE
 *   A safety-related circumstance affected the Journey.
 *
 * OTHER
 *   The dispute does not fit one of the predefined reasons.
 */
export class JourneyCompletionDisputeReason extends ValueObject<JourneyCompletionDisputeReasonProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: JourneyCompletionDisputeReasonValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a dispute reason from an external/runtime string.
   *
   * The value is normalized and validated before entering the domain.
   */
  public static create(value: string): JourneyCompletionDisputeReason {
    const normalized = value.trim().toUpperCase();

    if (!JourneyCompletionDisputeReason.isValid(normalized)) {
      throw new Error(`Invalid Journey Completion dispute reason: ${value}`);
    }

    return new JourneyCompletionDisputeReason(normalized);
  }

  // ---------------------------------------------------------------------------
  // Named Factories
  // ---------------------------------------------------------------------------

  public static journeyNotCompleted(): JourneyCompletionDisputeReason {
    return new JourneyCompletionDisputeReason('JOURNEY_NOT_COMPLETED');
  }

  public static passengerDidNotTravel(): JourneyCompletionDisputeReason {
    return new JourneyCompletionDisputeReason('PASSENGER_DID_NOT_TRAVEL');
  }

  public static providerDidNotTravel(): JourneyCompletionDisputeReason {
    return new JourneyCompletionDisputeReason('PROVIDER_DID_NOT_TRAVEL');
  }

  public static wrongDestination(): JourneyCompletionDisputeReason {
    return new JourneyCompletionDisputeReason('WRONG_DESTINATION');
  }

  public static earlyTermination(): JourneyCompletionDisputeReason {
    return new JourneyCompletionDisputeReason('EARLY_TERMINATION');
  }

  public static safetyIssue(): JourneyCompletionDisputeReason {
    return new JourneyCompletionDisputeReason('SAFETY_ISSUE');
  }

  public static other(): JourneyCompletionDisputeReason {
    return new JourneyCompletionDisputeReason('OTHER');
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  public static isValid(
    value: string,
  ): value is JourneyCompletionDisputeReasonValue {
    return JOURNEY_COMPLETION_DISPUTE_REASONS.includes(
      value as JourneyCompletionDisputeReasonValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isJourneyNotCompleted(): boolean {
    return this.props.value === 'JOURNEY_NOT_COMPLETED';
  }

  public isPassengerDidNotTravel(): boolean {
    return this.props.value === 'PASSENGER_DID_NOT_TRAVEL';
  }

  public isProviderDidNotTravel(): boolean {
    return this.props.value === 'PROVIDER_DID_NOT_TRAVEL';
  }

  public isWrongDestination(): boolean {
    return this.props.value === 'WRONG_DESTINATION';
  }

  public isEarlyTermination(): boolean {
    return this.props.value === 'EARLY_TERMINATION';
  }

  public isSafetyIssue(): boolean {
    return this.props.value === 'SAFETY_ISSUE';
  }

  public isOther(): boolean {
    return this.props.value === 'OTHER';
  }

  // ---------------------------------------------------------------------------
  // Semantic Predicates
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether the reason directly challenges whether the Journey
   * itself was completed.
   */
  public isCompletionFailure(): boolean {
    return this.isJourneyNotCompleted() || this.isEarlyTermination();
  }

  /**
   * Indicates whether the reason concerns whether a participant actually
   * travelled.
   */
  public isTravelParticipationIssue(): boolean {
    return this.isPassengerDidNotTravel() || this.isProviderDidNotTravel();
  }

  /**
   * Indicates whether the dispute concerns the Journey destination.
   */
  public isDestinationIssue(): boolean {
    return this.isWrongDestination();
  }

  /**
   * Indicates whether the dispute concerns safety.
   */
  public isSafetyRelated(): boolean {
    return this.isSafetyIssue();
  }

  /**
   * Indicates whether the reason requires an additional description
   * to explain the dispute.
   */
  public requiresDescription(): boolean {
    return this.isOther();
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): JourneyCompletionDisputeReasonValue {
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

export type { JourneyCompletionDisputeReasonProps };
