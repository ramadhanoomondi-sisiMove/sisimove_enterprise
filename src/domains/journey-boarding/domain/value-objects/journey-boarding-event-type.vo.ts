// -----------------------------------------------------------------------------
// Journey Boarding Event Type
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Values
// -----------------------------------------------------------------------------

export const JOURNEY_BOARDING_EVENT_TYPES = [
  'BOARDING_OPENED',
  'PROVIDER_BOARDED',
  'PASSENGER_BOARDED',
  'PASSENGER_NO_SHOW',
  'BOARDING_WITHDRAWN',
  'PARTICIPANT_REMOVED',
  'JOURNEY_STARTED',
  'BOARDING_CANCELLED',
] as const;

export type JourneyBoardingEventTypeValue =
  (typeof JOURNEY_BOARDING_EVENT_TYPES)[number];

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyBoardingEventTypeProps {
  value: JourneyBoardingEventTypeValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Type of event recorded during the Journey Boarding lifecycle.
 *
 * Events provide an immutable domain record of significant physical
 * boarding actions and lifecycle transitions.
 */
export class JourneyBoardingEventType extends ValueObject<JourneyBoardingEventTypeProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: JourneyBoardingEventTypeValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates an event type from an external/runtime string.
   *
   * The value is normalized and validated before entering the domain.
   */
  public static create(value: string): JourneyBoardingEventType {
    const normalized = value.trim().toUpperCase();

    if (!JourneyBoardingEventType.isValid(normalized)) {
      throw new Error(`Invalid Journey Boarding event type: ${value}`);
    }

    return new JourneyBoardingEventType(normalized);
  }

  // ---------------------------------------------------------------------------
  // Named Factories
  // ---------------------------------------------------------------------------

  public static boardingOpened(): JourneyBoardingEventType {
    return new JourneyBoardingEventType('BOARDING_OPENED');
  }

  public static providerBoarded(): JourneyBoardingEventType {
    return new JourneyBoardingEventType('PROVIDER_BOARDED');
  }

  public static passengerBoarded(): JourneyBoardingEventType {
    return new JourneyBoardingEventType('PASSENGER_BOARDED');
  }

  public static passengerNoShow(): JourneyBoardingEventType {
    return new JourneyBoardingEventType('PASSENGER_NO_SHOW');
  }

  public static boardingWithdrawn(): JourneyBoardingEventType {
    return new JourneyBoardingEventType('BOARDING_WITHDRAWN');
  }

  public static participantRemoved(): JourneyBoardingEventType {
    return new JourneyBoardingEventType('PARTICIPANT_REMOVED');
  }

  public static journeyStarted(): JourneyBoardingEventType {
    return new JourneyBoardingEventType('JOURNEY_STARTED');
  }

  public static boardingCancelled(): JourneyBoardingEventType {
    return new JourneyBoardingEventType('BOARDING_CANCELLED');
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  public static isValid(value: string): value is JourneyBoardingEventTypeValue {
    return JOURNEY_BOARDING_EVENT_TYPES.includes(
      value as JourneyBoardingEventTypeValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isBoardingOpened(): boolean {
    return this.props.value === 'BOARDING_OPENED';
  }

  public isProviderBoarded(): boolean {
    return this.props.value === 'PROVIDER_BOARDED';
  }

  public isPassengerBoarded(): boolean {
    return this.props.value === 'PASSENGER_BOARDED';
  }

  public isPassengerNoShow(): boolean {
    return this.props.value === 'PASSENGER_NO_SHOW';
  }

  public isBoardingWithdrawn(): boolean {
    return this.props.value === 'BOARDING_WITHDRAWN';
  }

  public isParticipantRemoved(): boolean {
    return this.props.value === 'PARTICIPANT_REMOVED';
  }

  public isJourneyStarted(): boolean {
    return this.props.value === 'JOURNEY_STARTED';
  }

  public isBoardingCancelled(): boolean {
    return this.props.value === 'BOARDING_CANCELLED';
  }

  // ---------------------------------------------------------------------------
  // Semantic Predicates
  // ---------------------------------------------------------------------------

  public isParticipantEvent(): boolean {
    return (
      this.isProviderBoarded() ||
      this.isPassengerBoarded() ||
      this.isPassengerNoShow() ||
      this.isBoardingWithdrawn() ||
      this.isParticipantRemoved()
    );
  }

  public isLifecycleEvent(): boolean {
    return (
      this.isBoardingOpened() ||
      this.isJourneyStarted() ||
      this.isBoardingCancelled()
    );
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): JourneyBoardingEventTypeValue {
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

export type { JourneyBoardingEventTypeProps };
