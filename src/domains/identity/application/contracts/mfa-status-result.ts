// src/domains/identity/application/contracts/mfa-status-result.ts

import type { AuthenticationMfaMethod } from '../../domain/value-objects/authentication-mfa-method.enum';
import type { MfaStatus } from '../../domain/value-objects/mfa-status.enum';

export interface MfaStatusResult {
  authenticationId: string;

  publicId: string;

  identityId: string;

  status: MfaStatus;

  method?: AuthenticationMfaMethod;

  enabledAt?: Date;
}
