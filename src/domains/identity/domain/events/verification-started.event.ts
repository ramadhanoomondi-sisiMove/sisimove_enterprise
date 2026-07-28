// src/domains/identity/domain/events/verification-started.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export class VerificationStartedEvent extends DomainEvent {
  constructor(
    public readonly verificationId: string,
    public readonly publicId: string,
    public readonly identityId: string,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      verificationId,
      'Verification',
      'VerificationStarted',
      correlationId,
      causationId,
      1,
      '1.0.0',
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      verificationId: this.verificationId,
      publicId: this.publicId,
      identityId: this.identityId,
    };
  }
}
