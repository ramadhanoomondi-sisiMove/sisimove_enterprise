// src/domains/identity/domain/events/mfa-verification-failed.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

import type { AuthenticationFailureReason } from '../value-objects/authentication-failure-reason.enum';
import type { AuthenticationMfaMethod } from '../value-objects/authentication-mfa-method.enum';

export class MfaVerificationFailedEvent extends DomainEvent {
  constructor(
    public readonly authenticationId: string,
    public readonly publicId: string,
    public readonly identityId: string,
    public readonly method: AuthenticationMfaMethod,
    public readonly reason: AuthenticationFailureReason,
    public readonly occurredAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      authenticationId,
      'Authentication',
      'MfaVerificationFailed',
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
      method: this.method,
      reason: this.reason,
      occurredAt: this.occurredAt,
    };
  }
}
