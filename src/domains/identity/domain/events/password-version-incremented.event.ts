// src/domains/identity/domain/events/password-version-incremented.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export class PasswordVersionIncrementedEvent extends DomainEvent {
  constructor(
    public readonly authenticationId: string,
    public readonly publicId: string,
    public readonly identityId: string,
    public readonly passwordVersion: number,
    public readonly occurredAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      authenticationId,
      'Authentication',
      'PasswordVersionIncremented',
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
      passwordVersion: this.passwordVersion,
      occurredAt: this.occurredAt,
    };
  }
}
