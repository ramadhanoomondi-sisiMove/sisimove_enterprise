// -----------------------------------------------------------------------------
// Journey Boarding Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Values
// -----------------------------------------------------------------------------

export const JOURNEY_BOARDING_STATUSES = [
  'NOT_STARTED',
  'BOARDING',
  'STARTED',
  'CANCELLED',
] as const;

export type JourneyBoardingStatusValue =
  (typeof JOURNEY_BOARDING_STATUSES)[number];

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyBoardingStatusProps {
  value: JourneyBoardingStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Lifecycle status of a Journey Boarding aggregate.
 *
 * Represents the physical boarding lifecycle of a journey:
 *
 * NOT_STARTED
 *   → BOARDING
 *   → STARTED
 *
 * A boarding may be cancelled before the journey starts:
 *
 * NOT_STARTED / BOARDING
 *   → CANCELLED
 */
export class JourneyBoardingStatus extends ValueObject<JourneyBoardingStatusProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: JourneyBoardingStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Journey Boarding status from an external/runtime string.
   *
   * The string is normalized and validated before entering the domain.
   */
  public static create(value: string): JourneyBoardingStatus {
    const normalized = value.trim().toUpperCase();

    if (!JourneyBoardingStatus.isValid(normalized)) {
      throw new Error(`Invalid Journey Boarding status: ${value}`);
    }

    return new JourneyBoardingStatus(normalized);
  }

  // ---------------------------------------------------------------------------
  // Named Factories
  // ---------------------------------------------------------------------------

  public static notStarted(): JourneyBoardingStatus {
    return new JourneyBoardingStatus('NOT_STARTED');
  }

  public static boarding(): JourneyBoardingStatus {
    return new JourneyBoardingStatus('BOARDING');
  }

  public static started(): JourneyBoardingStatus {
    return new JourneyBoardingStatus('STARTED');
  }

  public static cancelled(): JourneyBoardingStatus {
    return new JourneyBoardingStatus('CANCELLED');
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  public static isValid(value: string): value is JourneyBoardingStatusValue {
    return JOURNEY_BOARDING_STATUSES.includes(
      value as JourneyBoardingStatusValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isNotStarted(): boolean {
    return this.props.value === 'NOT_STARTED';
  }

  public isBoarding(): boolean {
    return this.props.value === 'BOARDING';
  }

  public isStarted(): boolean {
    return this.props.value === 'STARTED';
  }

  public isCancelled(): boolean {
    return this.props.value === 'CANCELLED';
  }

  public isTerminal(): boolean {
    return this.isStarted() || this.isCancelled();
  }

  public canOpen(): boolean {
    return this.isNotStarted();
  }

  public canStart(): boolean {
    return this.isBoarding();
  }

  public canCancel(): boolean {
    return this.isNotStarted() || this.isBoarding();
  }

  public canModifyParticipants(): boolean {
    return this.isNotStarted() || this.isBoarding();
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): JourneyBoardingStatusValue {
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

export type { JourneyBoardingStatusProps };
