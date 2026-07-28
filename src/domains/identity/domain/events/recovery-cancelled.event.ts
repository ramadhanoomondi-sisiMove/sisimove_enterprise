// src/domains/identity/domain/events/recovery-cancelled.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

import type { RecoveryFailureReason } from '../value-objects/recovery-failure-reason.enum';
import type { RecoveryType } from '../value-objects/recovery-type.enum';

export class RecoveryCancelledEvent extends DomainEvent {
  constructor(
    public readonly recoveryId: string,
    public readonly publicId: string,
    public readonly identityId: string,
    public readonly recoveryType: RecoveryType,
    public readonly cancelledAt: Date,
    public readonly reason: RecoveryFailureReason | undefined,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      recoveryId,
      'Recovery',
      'RecoveryCancelled',
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
      cancelledAt: this.cancelledAt,
      reason: this.reason,
    };
  }
}
