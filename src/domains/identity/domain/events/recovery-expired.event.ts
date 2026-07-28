// src/domains/identity/domain/events/recovery-expired.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

import type { RecoveryType } from '../value-objects/recovery-type.enum';

export class RecoveryExpiredEvent extends DomainEvent {
  constructor(
    public readonly recoveryId: string,
    public readonly publicId: string,
    public readonly identityId: string,
    public readonly recoveryType: RecoveryType,
    public readonly expiredAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      recoveryId,
      'Recovery',
      'RecoveryExpired',
      correlationId,
      causationId,
      1,
      '1.0.0',
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      recoveryId: this.recoveryId,
      publicId: this.publicId,
      identityId: this.identityId,
      recoveryType: this.recoveryType,
      expiredAt: this.expiredAt,
    };
  }
}
