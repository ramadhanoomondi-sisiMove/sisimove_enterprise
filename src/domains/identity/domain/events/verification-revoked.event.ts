// src/domains/identity/domain/events/verification-revoked.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export class VerificationRevokedEvent extends DomainEvent {
  constructor(
    public readonly verificationId: string,
    public readonly publicId: string,
    public readonly reviewerIdentityPublicId: string,
    public readonly revocationReason: string,
    public readonly revokedAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      verificationId,
      'Verification',
      'VerificationRevoked',
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
      reviewerIdentityPublicId: this.reviewerIdentityPublicId,
      revocationReason: this.revocationReason,
      revokedAt: this.revokedAt,
    };
  }
}
