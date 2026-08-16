// src/domains/journey/domain/value-objects/journey-music-preference.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

export enum JourneyMusicPreference {
  OFF = 'OFF',
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
}

interface JourneyMusicPreferenceProps {
  value: JourneyMusicPreference;
}

export class JourneyMusicPreferenceValueObject extends ValueObject<JourneyMusicPreferenceProps> {
  constructor(preference: JourneyMusicPreference) {
    if (!Object.values(JourneyMusicPreference).includes(preference)) {
      throw new Error(`Invalid journey music preference "${preference}".`);
    }

    super({
      value: preference,
    });
  }

  get value(): JourneyMusicPreference {
    return this.props.value;
  }

  get isOff(): boolean {
    return this.props.value === JourneyMusicPreference.OFF;
  }

  get isLow(): boolean {
    return this.props.value === JourneyMusicPreference.LOW;
  }

  get isModerate(): boolean {
    return this.props.value === JourneyMusicPreference.MODERATE;
  }

  get isHigh(): boolean {
    return this.props.value === JourneyMusicPreference.HIGH;
  }
}
