// src/domains/identity/domain/events/identity-activated.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export class IdentityActivatedEvent extends DomainEvent {
  constructor(
    public readonly identityId: string,
    public readonly publicId: string,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      identityId,
      'Identity',
      'IdentityActivated',
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
    };
  }
}
