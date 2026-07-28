// src/domains/identity/domain/events/mfa-verified.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

import type { AuthenticationMfaMethod } from '../value-objects/authentication-mfa-method.enum';

export class MfaVerifiedEvent extends DomainEvent {
  constructor(
    public readonly authenticationId: string,
    public readonly publicId: string,
    public readonly identityId: string,
    public readonly method: AuthenticationMfaMethod,
    public readonly verifiedAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      authenticationId,
      'Authentication',
      'MfaVerified',
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
      verifiedAt: this.verifiedAt,
    };
  }
}
