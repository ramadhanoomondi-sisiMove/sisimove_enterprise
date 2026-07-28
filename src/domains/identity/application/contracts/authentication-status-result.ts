// src/domains/identity/application/contracts/authentication-status-result.ts

import type { AuthenticationStatus } from '../../domain/value-objects/authentication-status.enum';
import type { MfaStatus } from '../../domain/value-objects/mfa-status.enum';

export interface AuthenticationStatusResult {
  authenticationId: string;

  publicId: string;

  identityId: string;

  status: AuthenticationStatus;

  passwordMustChange: boolean;

  mfaStatus: MfaStatus;

  isLocked: boolean;

  createdAt: Date;

  updatedAt: Date;
}
