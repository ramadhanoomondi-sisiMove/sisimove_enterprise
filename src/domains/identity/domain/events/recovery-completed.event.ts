import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

import type { RecoveryType } from '../value-objects/recovery-type.enum';

export class RecoveryCompletedEvent extends DomainEvent {
  constructor(
    public readonly recoveryId: string,
    public readonly publicId: string,
    public readonly identityId: string,
    public readonly recoveryType: RecoveryType,
    public readonly completedAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      recoveryId,
      'Recovery',
      'RecoveryCompleted',
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
      completedAt: this.completedAt,
    };
  }
}
