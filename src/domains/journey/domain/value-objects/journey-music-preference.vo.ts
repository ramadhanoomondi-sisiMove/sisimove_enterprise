// -----------------------------------------------------------------------------
// Path: src/domains/journey/domain/value-objects/journey-music-preference.vo.ts
// -----------------------------------------------------------------------------
// sisiMove — Journey Music Preference Value Object
//
// Represents the music preference configured for a Journey.
//
// Allowed values:
// - NONE
// - LOW
// - MODERATE
// - ANY
//
// Responsibilities:
// - enforce the Journey music-preference vocabulary;
// - provide immutable domain representation;
// - expose semantic convenience getters.
//
// This Value Object does NOT:
// - perform persistence concerns;
// - perform HTTP validation;
// - depend on Prisma.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Value
// -----------------------------------------------------------------------------

export enum JourneyMusicPreference {
  NONE = 'NONE',
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  ANY = 'ANY',
}

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyMusicPreferenceProps {
  readonly value: JourneyMusicPreference;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

export class JourneyMusicPreferenceValueObject extends ValueObject<JourneyMusicPreferenceProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(preference: JourneyMusicPreference) {
    if (!Object.values(JourneyMusicPreference).includes(preference)) {
      throw new Error(`Invalid journey music preference "${preference}".`);
    }

    super({
      value: preference,
    });
  }

  // ===========================================================================
  // Value
  // ===========================================================================

  public get value(): JourneyMusicPreference {
    return this.props.value;
  }

  // ===========================================================================
  // Semantic Queries
  // ===========================================================================

  public get isNone(): boolean {
    return this.props.value === JourneyMusicPreference.NONE;
  }

  public get isLow(): boolean {
    return this.props.value === JourneyMusicPreference.LOW;
  }

  public get isModerate(): boolean {
    return this.props.value === JourneyMusicPreference.MODERATE;
  }

  public get isAny(): boolean {
    return this.props.value === JourneyMusicPreference.ANY;
  }
}
