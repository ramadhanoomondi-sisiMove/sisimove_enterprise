import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

import type { RecoveryType } from '../value-objects/recovery-type.enum';

export class RecoveryRequestedEvent extends DomainEvent {
  constructor(
    public readonly recoveryId: string,
    public readonly publicId: string,
    public readonly identityId: string,
    public readonly recoveryType: RecoveryType,
    public readonly requestedAt: Date,
    public readonly expiresAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      recoveryId,
      'Recovery',
      'RecoveryRequested',
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
      requestedAt: this.requestedAt,
      expiresAt: this.expiresAt,
    };
  }
}
