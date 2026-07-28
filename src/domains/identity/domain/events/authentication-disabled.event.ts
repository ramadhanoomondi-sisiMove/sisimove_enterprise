// src/domains/identity/domain/events/authentication-disabled.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export class AuthenticationDisabledEvent extends DomainEvent {
  constructor(
    public readonly authenticationId: string,
    public readonly publicId: string,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      authenticationId,
      'Authentication',
      'AuthenticationDisabled',
      correlationId,
      causationId,
      1,
      '1.0.0',
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
