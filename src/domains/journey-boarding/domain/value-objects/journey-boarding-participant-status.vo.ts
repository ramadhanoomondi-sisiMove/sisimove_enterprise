// -----------------------------------------------------------------------------
// Journey Boarding Participant Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Values
// -----------------------------------------------------------------------------

export const JOURNEY_BOARDING_PARTICIPANT_STATUSES = [
  'EXPECTED',
  'BOARDED',
  'WITHDRAWN',
  'NO_SHOW',
  'REMOVED',
] as const;

export type JourneyBoardingParticipantStatusValue =
  (typeof JOURNEY_BOARDING_PARTICIPANT_STATUSES)[number];

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyBoardingParticipantStatusProps {
  value: JourneyBoardingParticipantStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Physical boarding status of a Journey Boarding participant.
 *
 * EXPECTED
 *   The participant is expected to physically board the journey.
 *
 * BOARDED
 *   The participant has physically boarded the journey.
 *
 * WITHDRAWN
 *   The participant withdrew before the journey started.
 *
 * NO_SHOW
 *   The participant was expected but did not physically board.
 *
 * REMOVED
 *   The participant was explicitly removed from the boarding process.
 */
export class JourneyBoardingParticipantStatus extends ValueObject<JourneyBoardingParticipantStatusProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: JourneyBoardingParticipantStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a participant status from an external/runtime string.
   *
   * The value is normalized and validated before entering the domain.
   */
  public static create(value: string): JourneyBoardingParticipantStatus {
    const normalized = value.trim().toUpperCase();

    if (!JourneyBoardingParticipantStatus.isValid(normalized)) {
      throw new Error(`Invalid Journey Boarding participant status: ${value}`);
    }

    return new JourneyBoardingParticipantStatus(normalized);
  }

  // ---------------------------------------------------------------------------
  // Named Factories
  // ---------------------------------------------------------------------------

  public static expected(): JourneyBoardingParticipantStatus {
    return new JourneyBoardingParticipantStatus('EXPECTED');
  }

  public static boarded(): JourneyBoardingParticipantStatus {
    return new JourneyBoardingParticipantStatus('BOARDED');
  }

  public static withdrawn(): JourneyBoardingParticipantStatus {
    return new JourneyBoardingParticipantStatus('WITHDRAWN');
  }

  public static noShow(): JourneyBoardingParticipantStatus {
    return new JourneyBoardingParticipantStatus('NO_SHOW');
  }

  public static removed(): JourneyBoardingParticipantStatus {
    return new JourneyBoardingParticipantStatus('REMOVED');
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  public static isValid(
    value: string,
  ): value is JourneyBoardingParticipantStatusValue {
    return JOURNEY_BOARDING_PARTICIPANT_STATUSES.includes(
      value as JourneyBoardingParticipantStatusValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isExpected(): boolean {
    return this.props.value === 'EXPECTED';
  }

  public isBoarded(): boolean {
    return this.props.value === 'BOARDED';
  }

  public isWithdrawn(): boolean {
    return this.props.value === 'WITHDRAWN';
  }

  public isNoShow(): boolean {
    return this.props.value === 'NO_SHOW';
  }

  public isRemoved(): boolean {
    return this.props.value === 'REMOVED';
  }

  public isTerminal(): boolean {
    return (
      this.isBoarded() ||
      this.isWithdrawn() ||
      this.isNoShow() ||
      this.isRemoved()
    );
  }

  public canBoard(): boolean {
    return this.isExpected();
  }

  public canWithdraw(): boolean {
    return this.isExpected();
  }

  public canMarkNoShow(): boolean {
    return this.isExpected();
  }

  public canRemove(): boolean {
    return this.isExpected();
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): JourneyBoardingParticipantStatusValue {
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

export type { JourneyBoardingParticipantStatusProps };
