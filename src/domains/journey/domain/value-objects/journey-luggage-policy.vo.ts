// src/domains/journey/domain/value-objects/journey-luggage-policy.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

export enum JourneyLuggagePolicy {
  STANDARD = 'STANDARD',
  LIMITED = 'LIMITED',
  NOT_ALLOWED = 'NOT_ALLOWED',
}

interface JourneyLuggagePolicyProps {
  value: JourneyLuggagePolicy;
}

export class JourneyLuggagePolicyValueObject extends ValueObject<JourneyLuggagePolicyProps> {
  constructor(policy: JourneyLuggagePolicy) {
    if (!Object.values(JourneyLuggagePolicy).includes(policy)) {
      throw new Error(`Invalid journey luggage policy "${policy}".`);
    }

    super({
      value: policy,
    });
  }

  get value(): JourneyLuggagePolicy {
    return this.props.value;
  }

  get isStandard(): boolean {
    return this.props.value === JourneyLuggagePolicy.STANDARD;
  }

  get isLimited(): boolean {
    return this.props.value === JourneyLuggagePolicy.LIMITED;
  }

  get isNotAllowed(): boolean {
    return this.props.value === JourneyLuggagePolicy.NOT_ALLOWED;
  }
}
