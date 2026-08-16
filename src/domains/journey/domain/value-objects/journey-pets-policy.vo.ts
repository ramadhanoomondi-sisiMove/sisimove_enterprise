// src/domains/journey/domain/value-objects/journey-pets-policy.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

export enum JourneyPetsPolicy {
  ALLOWED = 'ALLOWED',
  NOT_ALLOWED = 'NOT_ALLOWED',
}

interface JourneyPetsPolicyProps {
  value: JourneyPetsPolicy;
}

export class JourneyPetsPolicyValueObject extends ValueObject<JourneyPetsPolicyProps> {
  constructor(policy: JourneyPetsPolicy) {
    if (!Object.values(JourneyPetsPolicy).includes(policy)) {
      throw new Error(`Invalid journey pets policy "${policy}".`);
    }

    super({
      value: policy,
    });
  }

  get value(): JourneyPetsPolicy {
    return this.props.value;
  }

  get isAllowed(): boolean {
    return this.props.value === JourneyPetsPolicy.ALLOWED;
  }

  get isNotAllowed(): boolean {
    return this.props.value === JourneyPetsPolicy.NOT_ALLOWED;
  }
}
