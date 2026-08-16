// src/domains/trust/domain/value-objects/trust-rating-status.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

export enum TrustRatingStatus {
  ACTIVE = 'ACTIVE',
  HIDDEN = 'HIDDEN',
  REMOVED = 'REMOVED',
}

interface TrustRatingStatusProps {
  value: TrustRatingStatus;
}

export class TrustRatingStatusValueObject extends ValueObject<TrustRatingStatusProps> {
  constructor(status: TrustRatingStatus) {
    if (!Object.values(TrustRatingStatus).includes(status)) {
      throw new Error(`Invalid trust rating status "${status}".`);
    }

    super({
      value: status,
    });
  }

  get value(): TrustRatingStatus {
    return this.props.value;
  }

  get isActive(): boolean {
    return this.props.value === TrustRatingStatus.ACTIVE;
  }

  get isHidden(): boolean {
    return this.props.value === TrustRatingStatus.HIDDEN;
  }

  get isRemoved(): boolean {
    return this.props.value === TrustRatingStatus.REMOVED;
  }
}
