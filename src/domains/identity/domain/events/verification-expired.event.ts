import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export class VerificationExpiredEvent extends DomainEvent {
  constructor(
    public readonly verificationId: string,
    public readonly publicId: string,
    public readonly expiredAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      verificationId,
      'Verification',
      'VerificationExpired',
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
      expiredAt: this.expiredAt,
    };
  }
}
