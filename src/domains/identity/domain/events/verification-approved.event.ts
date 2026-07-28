import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

import type { VerificationLevel } from '../enums/verification-level.enum';

export class VerificationApprovedEvent extends DomainEvent {
  constructor(
    public readonly verificationId: string,
    public readonly publicId: string,
    public readonly level: VerificationLevel,
    public readonly verifiedAt: Date,
    public readonly expiresAt: Date | undefined,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      verificationId,
      'Verification',
      'VerificationApproved',
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
      level: this.level,
      verifiedAt: this.verifiedAt,
      expiresAt: this.expiresAt,
    };
  }
}
