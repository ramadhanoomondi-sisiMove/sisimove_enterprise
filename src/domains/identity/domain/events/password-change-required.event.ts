// src/domains/identity/domain/events/password-change-required.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export class PasswordChangeRequiredEvent extends DomainEvent {
  constructor(
    public readonly authenticationId: string,
    public readonly publicId: string,
    public readonly identityId: string,
    public readonly requiredAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      authenticationId,
      'Authentication',
      'PasswordChangeRequired',
      correlationId,
      causationId,
      1,
      '1.0.0',
    );

    Object.freeze(this);
  }

  protected override getPayload(): Record<string, unknown> {
    return {
      authenticationId: this.authenticationId,
      publicId: this.publicId,
      identityId: this.identityId,
      requiredAt: this.requiredAt,
    };
  }
}
