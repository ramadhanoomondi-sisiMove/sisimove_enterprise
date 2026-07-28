// src/domains/identity/domain/events/authentication-activated.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export class AuthenticationActivatedEvent extends DomainEvent {
  constructor(
    public readonly authenticationId: string,
    public readonly publicId: string,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      authenticationId,
      'Authentication',
      'AuthenticationActivated',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      authenticationId: this.authenticationId,
      publicId: this.publicId,
    };
  }
}
