// src/domains/identity/application/contracts/authentication-result.ts

import type { AuthenticationFailureReason } from '../../domain/value-objects/authentication-failure-reason.enum';
import type { AuthenticationMfaMethod } from '../../domain/value-objects/authentication-mfa-method.enum';
import type { AuthenticationStatus } from '../../domain/value-objects/authentication-status.enum';
import type { MfaStatus } from '../../domain/value-objects/mfa-status.enum';

export interface AuthenticationResult {
  /**
   * Internal authentication identifier.
   */
  authenticationId: string;

  /**
   * Public authentication identifier.
   */
  publicId: string;

  /**
   * Internal identity identifier.
   */
  identityId: string;

  /**
   * Authentication status.
   */
  status: AuthenticationStatus;

  /**
   * Password metadata.
   */
  passwordVersion: number;

  passwordChangedAt?: Date;
  passwordExpiresAt?: Date;

  passwordMustChange: boolean;

  /**
   * Failed authentication tracking.
   */
  failedAuthenticationCount: number;

  lastFailedAuthenticationAt?: Date;

  /**
   * Lock information.
   */
  lockedAt?: Date;

  lockedUntil?: Date;

  lockReason?: AuthenticationFailureReason;

  /**
   * Successful authentication.
   */
  lastAuthenticatedAt?: Date;

  /**
   * MFA.
   */
  mfaStatus: MfaStatus;

  mfaMethod?: AuthenticationMfaMethod;

  mfaEnabledAt?: Date;

  /**
   * Audit.
   */
  createdAt: Date;

  updatedAt: Date;
}
