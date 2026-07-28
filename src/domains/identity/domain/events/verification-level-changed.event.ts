import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

import type { VerificationLevel } from '../enums/verification-level.enum';

export class VerificationLevelChangedEvent extends DomainEvent {
  constructor(
    public readonly verificationId: string,
    public readonly publicId: string,
    public readonly previousLevel: VerificationLevel,
    public readonly currentLevel: VerificationLevel,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      verificationId,
      'Verification',
      'VerificationLevelChanged',
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
      previousLevel: this.previousLevel,
      currentLevel: this.currentLevel,
    };
  }
}
