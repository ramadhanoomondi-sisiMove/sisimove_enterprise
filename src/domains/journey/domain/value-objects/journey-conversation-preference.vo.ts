// src/domains/journey/domain/value-objects/journey-conversation-preference.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

export enum JourneyConversationPreference {
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
}

interface JourneyConversationPreferenceProps {
  value: JourneyConversationPreference;
}

export class JourneyConversationPreferenceValueObject extends ValueObject<JourneyConversationPreferenceProps> {
  constructor(preference: JourneyConversationPreference) {
    if (!Object.values(JourneyConversationPreference).includes(preference)) {
      throw new Error(
        `Invalid journey conversation preference "${preference}".`,
      );
    }

    super({
      value: preference,
    });
  }

  get value(): JourneyConversationPreference {
    return this.props.value;
  }

  get isLow(): boolean {
    return this.props.value === JourneyConversationPreference.LOW;
  }

  get isModerate(): boolean {
    return this.props.value === JourneyConversationPreference.MODERATE;
  }

  get isHigh(): boolean {
    return this.props.value === JourneyConversationPreference.HIGH;
  }
}
