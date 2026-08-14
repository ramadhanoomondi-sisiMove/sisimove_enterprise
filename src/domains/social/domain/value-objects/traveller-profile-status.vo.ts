// src/domains/social/domain/value-objects/traveller-profile-status.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

export enum TravellerProfileStatus {
  ACTIVE = 'ACTIVE',
  RESTRICTED = 'RESTRICTED',
  SUSPENDED = 'SUSPENDED',
  CLOSED = 'CLOSED',
}

interface TravellerProfileStatusProps {
  value: TravellerProfileStatus;
}

export class TravellerProfileStatusValueObject extends ValueObject<TravellerProfileStatusProps> {
  constructor(status: TravellerProfileStatus) {
    if (!Object.values(TravellerProfileStatus).includes(status)) {
      throw new Error(`Invalid traveller profile status "${status}".`);
    }

    super({
      value: status,
    });
  }

  get value(): TravellerProfileStatus {
    return this.props.value;
  }

  get isActive(): boolean {
    return this.props.value === TravellerProfileStatus.ACTIVE;
  }

  get isRestricted(): boolean {
    return this.props.value === TravellerProfileStatus.RESTRICTED;
  }

  get isSuspended(): boolean {
    return this.props.value === TravellerProfileStatus.SUSPENDED;
  }

  get isClosed(): boolean {
    return this.props.value === TravellerProfileStatus.CLOSED;
  }
}
