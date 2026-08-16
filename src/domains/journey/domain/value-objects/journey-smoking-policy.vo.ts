// src/domains/journey/domain/value-objects/journey-smoking-policy.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

export enum JourneySmokingPolicy {
  ALLOWED = 'ALLOWED',
  NOT_ALLOWED = 'NOT_ALLOWED',
}

interface JourneySmokingPolicyProps {
  value: JourneySmokingPolicy;
}

export class JourneySmokingPolicyValueObject extends ValueObject<JourneySmokingPolicyProps> {
  constructor(policy: JourneySmokingPolicy) {
    if (!Object.values(JourneySmokingPolicy).includes(policy)) {
      throw new Error(`Invalid journey smoking policy "${policy}".`);
    }

    super({
      value: policy,
    });
  }

  get value(): JourneySmokingPolicy {
    return this.props.value;
  }

  get isAllowed(): boolean {
    return this.props.value === JourneySmokingPolicy.ALLOWED;
  }

  get isNotAllowed(): boolean {
    return this.props.value === JourneySmokingPolicy.NOT_ALLOWED;
  }
}
