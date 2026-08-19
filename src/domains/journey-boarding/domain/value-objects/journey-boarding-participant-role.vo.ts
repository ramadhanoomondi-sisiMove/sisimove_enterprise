// -----------------------------------------------------------------------------
// Journey Boarding Participant Role
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Values
// -----------------------------------------------------------------------------

export const JOURNEY_BOARDING_PARTICIPANT_ROLES = [
  'PROVIDER',
  'PASSENGER',
] as const;

export type JourneyBoardingParticipantRoleValue =
  (typeof JOURNEY_BOARDING_PARTICIPANT_ROLES)[number];

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyBoardingParticipantRoleProps {
  value: JourneyBoardingParticipantRoleValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Role of a participant within the physical Journey Boarding process.
 *
 * PROVIDER
 *   The journey provider/driver responsible for starting the journey.
 *
 * PASSENGER
 *   A passenger physically boarding the journey.
 */
export class JourneyBoardingParticipantRole extends ValueObject<JourneyBoardingParticipantRoleProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: JourneyBoardingParticipantRoleValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a participant role from an external/runtime string.
   *
   * The value is normalized and validated before entering the domain.
   */
  public static create(value: string): JourneyBoardingParticipantRole {
    const normalized = value.trim().toUpperCase();

    if (!JourneyBoardingParticipantRole.isValid(normalized)) {
      throw new Error(`Invalid Journey Boarding participant role: ${value}`);
    }

    return new JourneyBoardingParticipantRole(normalized);
  }

  // ---------------------------------------------------------------------------
  // Named Factories
  // ---------------------------------------------------------------------------

  public static provider(): JourneyBoardingParticipantRole {
    return new JourneyBoardingParticipantRole('PROVIDER');
  }

  public static passenger(): JourneyBoardingParticipantRole {
    return new JourneyBoardingParticipantRole('PASSENGER');
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  public static isValid(
    value: string,
  ): value is JourneyBoardingParticipantRoleValue {
    return JOURNEY_BOARDING_PARTICIPANT_ROLES.includes(
      value as JourneyBoardingParticipantRoleValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isProvider(): boolean {
    return this.props.value === 'PROVIDER';
  }

  public isPassenger(): boolean {
    return this.props.value === 'PASSENGER';
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): JourneyBoardingParticipantRoleValue {
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

export type { JourneyBoardingParticipantRoleProps };
