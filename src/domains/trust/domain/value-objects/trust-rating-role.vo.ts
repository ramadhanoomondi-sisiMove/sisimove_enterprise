// src/domains/trust/domain/value-objects/trust-rating-role.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

export enum TrustRatingRole {
  PROVIDER = 'PROVIDER',
  PASSENGER = 'PASSENGER',
}

interface TrustRatingRoleProps {
  value: TrustRatingRole;
}

export class TrustRatingRoleValueObject extends ValueObject<TrustRatingRoleProps> {
  constructor(role: TrustRatingRole) {
    if (!Object.values(TrustRatingRole).includes(role)) {
      throw new Error(`Invalid trust rating role "${role}".`);
    }

    super({
      value: role,
    });
  }

  get value(): TrustRatingRole {
    return this.props.value;
  }

  get isProvider(): boolean {
    return this.props.value === TrustRatingRole.PROVIDER;
  }

  get isPassenger(): boolean {
    return this.props.value === TrustRatingRole.PASSENGER;
  }
}
