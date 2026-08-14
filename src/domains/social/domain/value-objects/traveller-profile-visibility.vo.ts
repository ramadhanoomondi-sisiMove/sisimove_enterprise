// src/domains/social/domain/value-objects/traveller-profile-visibility.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

export enum TravellerProfileVisibility {
  PUBLIC = 'PUBLIC',
  LIMITED = 'LIMITED',
  PRIVATE = 'PRIVATE',
}

interface TravellerProfileVisibilityProps {
  value: TravellerProfileVisibility;
}

export class TravellerProfileVisibilityValueObject extends ValueObject<TravellerProfileVisibilityProps> {
  constructor(visibility: TravellerProfileVisibility) {
    if (!Object.values(TravellerProfileVisibility).includes(visibility)) {
      throw new Error(`Invalid traveller profile visibility "${visibility}".`);
    }

    super({
      value: visibility,
    });
  }

  get value(): TravellerProfileVisibility {
    return this.props.value;
  }

  get isPublic(): boolean {
    return this.props.value === TravellerProfileVisibility.PUBLIC;
  }

  get isLimited(): boolean {
    return this.props.value === TravellerProfileVisibility.LIMITED;
  }

  get isPrivate(): boolean {
    return this.props.value === TravellerProfileVisibility.PRIVATE;
  }
}
