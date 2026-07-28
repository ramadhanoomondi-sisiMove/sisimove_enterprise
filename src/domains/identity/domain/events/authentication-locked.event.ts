// src/domains/identity/domain/events/authentication-locked.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

import type { AuthenticationFailureReason } from '../value-objects/authentication-failure-reason.enum';

export class AuthenticationLockedEvent extends DomainEvent {
  constructor(
    public readonly authenticationId: string,
    public readonly publicId: string,
    public readonly identityId: string,
    public readonly lockedAt: Date,
    public readonly lockedUntil: Date,
    public readonly reason: AuthenticationFailureReason,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      authenticationId,
      'Authentication',
      'AuthenticationLocked',
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
      lockedAt: this.lockedAt,
      lockedUntil: this.lockedUntil,
      reason: this.reason,
    };
  }
}
