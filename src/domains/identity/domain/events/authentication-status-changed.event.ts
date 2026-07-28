// src/domains/identity/domain/events/authentication-status-changed.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

import type { AuthenticationStatus } from '../value-objects/authentication-status.enum';

export class AuthenticationStatusChangedEvent extends DomainEvent {
  constructor(
    public readonly authenticationId: string,
    public readonly publicId: string,
    public readonly previousStatus: AuthenticationStatus,
    public readonly currentStatus: AuthenticationStatus,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      authenticationId,
      'Authentication',
      'AuthenticationStatusChanged',
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
      previousStatus: this.previousStatus,
      currentStatus: this.currentStatus,
    };
  }
}
