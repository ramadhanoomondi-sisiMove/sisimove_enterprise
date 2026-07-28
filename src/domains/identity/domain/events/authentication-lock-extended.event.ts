// src/domains/identity/domain/events/authentication-lock-extended.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

import type { AuthenticationFailureReason } from '../value-objects/authentication-failure-reason.enum';

export class AuthenticationLockExtendedEvent extends DomainEvent {
  constructor(
    public readonly authenticationId: string,
    public readonly publicId: string,
    public readonly identityId: string,
    public readonly reason: AuthenticationFailureReason,
    public readonly extendedAt: Date,
    public readonly lockedUntil: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      authenticationId,
      'Authentication',
      'AuthenticationLockExtended',
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
      reason: this.reason,
      extendedAt: this.extendedAt,
      lockedUntil: this.lockedUntil,
    };
  }
}
