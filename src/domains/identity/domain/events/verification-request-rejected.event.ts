import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

import type { VerificationRequestType } from '../enums/verification-request-type.enum';

export class VerificationRequestRejectedEvent extends DomainEvent {
  constructor(
    public readonly verificationId: string,
    public readonly verificationPublicId: string,
    public readonly requestPublicId: string,
    public readonly requestType: VerificationRequestType,
    public readonly reviewerIdentityId: string,
    public readonly reason: string,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      verificationId,
      'Verification',
      'VerificationRequestRejected',
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
      verificationPublicId: this.verificationPublicId,
      requestPublicId: this.requestPublicId,
      requestType: this.requestType,
      reviewerIdentityId: this.reviewerIdentityId,
      reason: this.reason,
    };
  }
}
