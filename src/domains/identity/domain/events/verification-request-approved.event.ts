import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

import type { VerificationRequestType } from '../enums/verification-request-type.enum';

export class VerificationRequestApprovedEvent extends DomainEvent {
  constructor(
    public readonly verificationId: string,
    public readonly verificationPublicId: string,
    public readonly requestPublicId: string,
    public readonly requestType: VerificationRequestType,
    public readonly reviewerIdentityId: string,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      verificationId,
      'Verification',
      'VerificationRequestApproved',
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
    };
  }
}
