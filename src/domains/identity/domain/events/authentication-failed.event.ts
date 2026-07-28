// src/domains/identity/domain/events/authentication-failed.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

import type { AuthenticationFailureReason } from '../value-objects/authentication-failure-reason.enum';

export class AuthenticationFailedEvent extends DomainEvent {
  constructor(
    public readonly authenticationId: string,
    public readonly publicId: string,
    public readonly identityId: string,
    public readonly reason: AuthenticationFailureReason,
    public readonly failedAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      authenticationId,
      'Authentication',
      'AuthenticationFailed',
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
      reason: this.reason,
      failedAt: this.failedAt,
    };
  }
}
