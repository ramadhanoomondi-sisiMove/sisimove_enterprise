// src/domains/identity/domain/events/identity-registered.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export class IdentityRegisteredEvent extends DomainEvent {
  constructor(
    public readonly identityId: string,
    public readonly publicId: string,
    public readonly email: string,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      identityId,
      'Identity',
      'IdentityRegistered',
      correlationId,
      causationId,
      1,
      '1.0.0',
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      identityId: this.identityId,
      publicId: this.publicId,
      email: this.email,
    };
  }
}
