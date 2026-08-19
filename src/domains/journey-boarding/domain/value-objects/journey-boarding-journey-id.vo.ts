// -----------------------------------------------------------------------------
// Journey Boarding Journey ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyBoardingJourneyIdProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Internal identity of the Journey associated with a Journey Boarding.
 *
 * This represents the persistence identity (`journeyId`) of the Journey
 * aggregate and is distinct from the Journey Boarding public identity.
 */
export class JourneyBoardingJourneyId extends ValueObject<JourneyBoardingJourneyIdProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: string) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(value: string): JourneyBoardingJourneyId {
    const normalized = value.trim();

    if (!normalized) {
      throw new Error('Journey Boarding journey ID cannot be empty.');
    }

    return new JourneyBoardingJourneyId(normalized);
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

export type { JourneyBoardingJourneyIdProps };
