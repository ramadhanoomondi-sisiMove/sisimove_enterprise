// src/domains/identity/domain/events/authentication-attempts-exceeded.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export class AuthenticationAttemptsExceededEvent extends DomainEvent {
  constructor(
    public readonly authenticationId: string,
    public readonly publicId: string,
    public readonly identityId: string,
    public readonly failedAttempts: number,
    public readonly occurredAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      authenticationId,
      'Authentication',
      'AuthenticationAttemptsExceeded',
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
      failedAttempts: this.failedAttempts,
      occurredAt: this.occurredAt,
    };
  }
}
