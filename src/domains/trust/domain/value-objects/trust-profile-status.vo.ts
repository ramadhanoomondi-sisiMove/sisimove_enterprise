// src/domains/trust/domain/value-objects/trust-profile-status.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

export enum TrustProfileStatus {
  ACTIVE = 'ACTIVE',
  RESTRICTED = 'RESTRICTED',
  SUSPENDED = 'SUSPENDED',
}

interface TrustProfileStatusProps {
  value: TrustProfileStatus;
}

export class TrustProfileStatusValueObject extends ValueObject<TrustProfileStatusProps> {
  constructor(status: TrustProfileStatus) {
    if (!Object.values(TrustProfileStatus).includes(status)) {
      throw new Error(`Invalid trust profile status "${status}".`);
    }

    super({
      value: status,
    });
  }

  get value(): TrustProfileStatus {
    return this.props.value;
  }

  get isActive(): boolean {
    return this.props.value === TrustProfileStatus.ACTIVE;
  }

  get isRestricted(): boolean {
    return this.props.value === TrustProfileStatus.RESTRICTED;
  }

  get isSuspended(): boolean {
    return this.props.value === TrustProfileStatus.SUSPENDED;
  }
}
