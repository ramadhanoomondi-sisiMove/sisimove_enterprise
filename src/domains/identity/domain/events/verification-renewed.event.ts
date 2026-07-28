import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export class VerificationRenewedEvent extends DomainEvent {
  constructor(
    public readonly verificationId: string,
    public readonly publicId: string,
    public readonly renewedAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      verificationId,
      'Verification',
      'VerificationRenewed',
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
      renewedAt: this.renewedAt,
    };
  }
}
