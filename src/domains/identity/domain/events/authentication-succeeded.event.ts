// src/domains/identity/domain/events/authentication-succeeded.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export class AuthenticationSucceededEvent extends DomainEvent {
  constructor(
    public readonly authenticationId: string,
    public readonly publicId: string,
    public readonly identityId: string,
    public readonly authenticatedAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      authenticationId,
      'Authentication',
      'AuthenticationSucceeded',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  protected override getPayload(): Record<string, unknown> {
    return {
      authenticationId: this.authenticationId,
      publicId: this.publicId,
      identityId: this.identityId,
      authenticatedAt: this.authenticatedAt,
    };
  }
}
