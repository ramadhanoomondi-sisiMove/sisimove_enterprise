// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { AuthenticationEntity } from '../entities/authentication.entity';
import { PasswordHistoryEntity } from '../entities/password-history.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import { AuthenticationActivatedEvent } from '../events/authentication-activated.event';
import { AuthenticationAttemptsExceededEvent } from '../events/authentication-attempts-exceeded.event';
import { AuthenticationDisabledEvent } from '../events/authentication-disabled.event';
import { AuthenticationFailedEvent } from '../events/authentication-failed.event';
import { AuthenticationLockedEvent } from '../events/authentication-locked.event';
import { AuthenticationLockExtendedEvent } from '../events/authentication-lock-extended.event';
import { AuthenticationSucceededEvent } from '../events/authentication-succeeded.event';
import { AuthenticationUnlockedEvent } from '../events/authentication-unlocked.event';

import { MfaDisabledEvent } from '../events/mfa-disabled.event';
import { MfaEnabledEvent } from '../events/mfa-enabled.event';
import { MfaSecretRotatedEvent } from '../events/mfa-secret-rotated.event';
import { MfaVerificationFailedEvent } from '../events/mfa-verification-failed.event';
import { MfaVerifiedEvent } from '../events/mfa-verified.event';

import { PasswordChangedEvent } from '../events/password-changed.event';
import { PasswordChangeRequiredEvent } from '../events/password-change-required.event';
import { PasswordExpiredEvent } from '../events/password-expired.event';
import { PasswordResetEvent } from '../events/password-reset.event';
import { PasswordVersionIncrementedEvent } from '../events/password-version-incremented.event';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { AuthenticationAlreadyActiveException } from '../exceptions/authentication-already-active.exception';
import { AuthenticationAlreadyDisabledException } from '../exceptions/authentication-already-disabled.exception';
import { AuthenticationDisabledException } from '../exceptions/authentication-disabled.exception';
import { AuthenticationLockedException } from '../exceptions/authentication-locked.exception';
import { AuthenticationNotActiveException } from '../exceptions/authentication-not-active.exception';

import { MfaAlreadyDisabledException } from '../exceptions/mfa-already-disabled.exception';
import { MfaAlreadyEnabledException } from '../exceptions/mfa-already-enabled.exception';
import { MfaDisabledException } from '../exceptions/mfa-disabled.exception';
import { MfaSecretNotConfiguredException } from '../exceptions/mfa-secret-not-configured.exception';

import { PasswordAlreadyExpiredException } from '../exceptions/password-already-expired.exception';
import { PasswordExpiredException } from '../exceptions/password-expired.exception';
import { PasswordNotConfiguredException } from '../exceptions/password-not-configured.exception';

// -----------------------------------------------------------------------------
// Value Objects / Enums
// -----------------------------------------------------------------------------

import type { AuthenticationFailureReason } from '../value-objects/authentication-failure-reason.enum';
import type { AuthenticationMfaMethod } from '../value-objects/authentication-mfa-method.enum';
import { AuthenticationStatus } from '../value-objects/authentication-status.enum';
import { MfaStatus } from '../value-objects/mfa-status.enum';
import { AuthenticationNotLockedException } from '../exceptions/authentication-not-locked.exception';

interface AuthenticationAggregateProps {
  authentication: AuthenticationEntity;

  passwordHistory: PasswordHistoryEntity[];
}

export class AuthenticationAggregate extends AggregateRoot<AuthenticationAggregateProps> {
  private constructor(props: AuthenticationAggregateProps) {
    super(props);
  }

  // ------------------------------------------------------------------
  // Factory
  // ------------------------------------------------------------------

  /**
   * Creates a brand-new Authentication aggregate.
   *
   * Used during registration or provisioning.
   */
  static create(authentication: AuthenticationEntity): AuthenticationAggregate {
    return new AuthenticationAggregate({
      authentication,
      passwordHistory: [],
    });
  }

  /**
   * Rehydrates an Authentication aggregate from persistence.
   *
   * Used exclusively by repositories.
   */
  static rehydrate(
    authentication: AuthenticationEntity,
    passwordHistory: PasswordHistoryEntity[],
  ): AuthenticationAggregate {
    return new AuthenticationAggregate({
      authentication,
      passwordHistory,
    });
  }

  // ------------------------------------------------------------------
  // Aggregate State
  // ------------------------------------------------------------------

  get authentication(): AuthenticationEntity {
    return this.props.authentication;
  }

  get passwordHistory(): readonly PasswordHistoryEntity[] {
    return this.props.passwordHistory;
  }

  // ------------------------------------------------------------------
  // Identity
  // ------------------------------------------------------------------

  override get id() {
    return this.authentication.id;
  }

  override get publicId() {
    return this.authentication.publicId;
  }

  get identityId(): string {
    return this.authentication.identityId;
  }
  // ------------------------------------------------------------------
  // Queries
  // ------------------------------------------------------------------

  isActive(): boolean {
    return this.authentication.status === AuthenticationStatus.ACTIVE;
  }

  isDisabled(): boolean {
    return this.authentication.status === AuthenticationStatus.DISABLED;
  }

  isLocked(now: Date = new Date()): boolean {
    return (
      this.authentication.status === AuthenticationStatus.LOCKED &&
      this.authentication.lockedUntil !== undefined &&
      this.authentication.lockedUntil > now
    );
  }

  isPasswordExpired(now: Date): boolean {
    return (
      this.authentication.passwordExpiresAt !== undefined &&
      this.authentication.passwordExpiresAt <= now
    );
  }

  requiresPasswordChange(): boolean {
    return this.authentication.passwordMustChange;
  }

  hasPassword(): boolean {
    return this.authentication.passwordHash !== undefined;
  }

  isMfaEnabled(): boolean {
    return this.authentication.mfaStatus === MfaStatus.ENABLED;
  }

  hasPasswordVersion(version: number): boolean {
    return this.authentication.passwordVersion === version;
  }

  latestPasswordVersion(): number {
    return this.authentication.passwordVersion;
  }

  currentPasswordHash(): string | undefined {
    return this.authentication.passwordHash;
  }

  canAuthenticate(now: Date): boolean {
    return (
      this.isActive() && !this.isLocked(now) && !this.isPasswordExpired(now)
    );
  }

  // ------------------------------------------------------------------
  // Authentication Lifecycle
  // ------------------------------------------------------------------

  activate(activatedAt: Date, correlationId: string): void {
    if (this.isActive()) {
      throw new AuthenticationAlreadyActiveException();
    }

    this.authentication.setStatus(AuthenticationStatus.ACTIVE);

    this.authentication.setUpdatedAt(activatedAt);

    this.addDomainEvent(
      new AuthenticationActivatedEvent(
        this.id.value,
        this.publicId.value,
        correlationId,
      ),
    );
  }

  disable(disabledAt: Date, correlationId: string): void {
    if (this.isDisabled()) {
      throw new AuthenticationAlreadyDisabledException();
    }

    this.authentication.setStatus(AuthenticationStatus.DISABLED);

    this.authentication.setUpdatedAt(disabledAt);

    this.addDomainEvent(
      new AuthenticationDisabledEvent(
        this.id.value,
        this.publicId.value,
        correlationId,
      ),
    );
  }

  // ------------------------------------------------------------------
  // Authentication Success
  // ------------------------------------------------------------------

  recordSuccessfulAuthentication(
    authenticatedAt: Date,
    correlationId: string,
  ): void {
    this.ensureActive();
    this.ensureNotLocked(authenticatedAt);
    this.ensurePasswordNotExpired(authenticatedAt);

    this.authentication.setAuthenticationSuccess(authenticatedAt);

    this.authentication.setUpdatedAt(authenticatedAt);

    this.addDomainEvent(
      new AuthenticationSucceededEvent(
        this.id.value,
        this.publicId.value,
        this.identityId,
        authenticatedAt,
        correlationId,
      ),
    );
  }

  // ------------------------------------------------------------------
  // Authentication Failure
  // ------------------------------------------------------------------

  recordFailedAuthentication(
    occurredAt: Date,
    reason: AuthenticationFailureReason,
    correlationId: string,
  ): number {
    this.ensureNotDisabled();

    const failedAttempts = this.authentication.failedAuthenticationCount + 1;

    this.authentication.setAuthenticationFailure(failedAttempts, occurredAt);

    this.authentication.setUpdatedAt(occurredAt);

    this.addDomainEvent(
      new AuthenticationFailedEvent(
        this.id.value,
        this.publicId.value,
        this.identityId,
        reason,
        occurredAt,
        correlationId,
      ),
    );

    return failedAttempts;
  }

  // ------------------------------------------------------------------
  // Authentication Attempts Exceeded
  // ------------------------------------------------------------------

  recordAuthenticationAttemptsExceeded(
    failedAttempts: number,
    occurredAt: Date,
    correlationId: string,
  ): void {
    this.addDomainEvent(
      new AuthenticationAttemptsExceededEvent(
        this.id.value,
        this.publicId.value,
        this.identityId,
        failedAttempts,
        occurredAt,
        correlationId,
      ),
    );
  }

  // ------------------------------------------------------------------
  // Password Lifecycle
  // ------------------------------------------------------------------

  changePassword(
    passwordHash: string,
    changedAt: Date,
    correlationId: string,
    expiresAt?: Date,
  ): void {
    this.ensureActive();
    this.ensurePasswordConfigured();

    this.recordCurrentPassword();

    const nextVersion = this.authentication.passwordVersion + 1;

    this.authentication.setPassword(
      passwordHash,
      nextVersion,
      changedAt,
      expiresAt,
    );

    this.authentication.setPasswordMustChange(false);

    this.authentication.setUpdatedAt(changedAt);

    this.addDomainEvent(
      new PasswordChangedEvent(
        this.id.value,
        this.publicId.value,
        this.identityId,
        nextVersion,
        changedAt,
        correlationId,
      ),
    );

    this.addDomainEvent(
      new PasswordVersionIncrementedEvent(
        this.id.value,
        this.publicId.value,
        this.identityId,
        nextVersion,
        changedAt,
        correlationId,
      ),
    );
  }
  // ------------------------------------------------------------------
  // Password Reset
  // ------------------------------------------------------------------

  resetPassword(
    passwordHash: string,
    resetAt: Date,
    correlationId: string,
    expiresAt?: Date,
  ): void {
    if (this.hasPassword()) {
      this.recordCurrentPassword();
    }

    const nextVersion = this.authentication.passwordVersion + 1;

    this.authentication.setPassword(
      passwordHash,
      nextVersion,
      resetAt,
      expiresAt,
    );

    this.authentication.setPasswordMustChange(false);

    this.authentication.resetFailedAuthenticationCount();

    this.authentication.setUpdatedAt(resetAt);

    this.addDomainEvent(
      new PasswordResetEvent(
        this.id.value,
        this.publicId.value,
        this.identityId,
        nextVersion,
        resetAt,
        correlationId,
      ),
    );

    this.addDomainEvent(
      new PasswordVersionIncrementedEvent(
        this.id.value,
        this.publicId.value,
        this.identityId,
        nextVersion,
        resetAt,
        correlationId,
      ),
    );
  }

  expirePassword(expiredAt: Date, correlationId: string): void {
    this.ensurePasswordConfigured();

    if (this.isPasswordExpired(expiredAt)) {
      throw new PasswordAlreadyExpiredException();
    }

    this.authentication.setPasswordExpiration(expiredAt);

    this.authentication.setUpdatedAt(expiredAt);

    this.addDomainEvent(
      new PasswordExpiredEvent(
        this.id.value,
        this.publicId.value,
        this.identityId,
        expiredAt,
        correlationId,
      ),
    );
  }

  // ------------------------------------------------------------------
  // Password Change Requirement
  // ------------------------------------------------------------------

  requirePasswordChange(requiredAt: Date, correlationId: string): void {
    this.ensurePasswordConfigured();

    if (this.authentication.passwordMustChange) {
      return;
    }

    this.authentication.setPasswordMustChange(true);

    this.authentication.setUpdatedAt(requiredAt);

    this.addDomainEvent(
      new PasswordChangeRequiredEvent(
        this.id.value,
        this.publicId.value,
        this.identityId,
        requiredAt,
        correlationId,
      ),
    );
  }

  clearPasswordChangeRequirement(changedAt: Date): void {
    if (!this.authentication.passwordMustChange) {
      return;
    }

    this.authentication.setPasswordMustChange(false);

    this.authentication.setUpdatedAt(changedAt);
  }

  // ------------------------------------------------------------------
  // Account Lock Lifecycle
  // ------------------------------------------------------------------

  lock(
    lockedUntil: Date,
    reason: AuthenticationFailureReason,
    lockedAt: Date,
    correlationId: string,
  ): void {
    this.ensureNotDisabled();

    if (this.isLocked(lockedAt)) {
      throw new AuthenticationLockedException();
    }

    this.authentication.setLock(
      AuthenticationStatus.LOCKED,
      lockedAt,
      lockedUntil,
      reason,
    );

    this.authentication.setUpdatedAt(lockedAt);

    this.addDomainEvent(
      new AuthenticationLockedEvent(
        this.id.value,
        this.publicId.value,
        this.identityId,
        lockedAt,
        lockedUntil,
        reason,
        correlationId,
      ),
    );
  }

  extendLock(lockedUntil: Date, extendedAt: Date, correlationId: string): void {
    this.ensureLocked(extendedAt);

    this.authentication.extendLock(lockedUntil);

    this.authentication.setUpdatedAt(extendedAt);

    this.addDomainEvent(
      new AuthenticationLockExtendedEvent(
        this.id.value,
        this.publicId.value,
        this.identityId,
        this.authentication.lockReason!,
        extendedAt,
        lockedUntil,
        correlationId,
      ),
    );
  }

  unlock(unlockedAt: Date, correlationId: string): void {
    this.ensureLocked(unlockedAt);

    this.authentication.clearLock(AuthenticationStatus.ACTIVE);

    this.authentication.resetFailedAuthenticationCount();

    this.authentication.setUpdatedAt(unlockedAt);

    this.addDomainEvent(
      new AuthenticationUnlockedEvent(
        this.id.value,
        this.publicId.value,
        this.identityId,
        unlockedAt,
        correlationId,
      ),
    );
  }

  // ------------------------------------------------------------------
  // MFA Lifecycle
  // ------------------------------------------------------------------

  enableMfa(
    method: AuthenticationMfaMethod,
    encryptedSecret: string,
    enabledAt: Date,
    correlationId: string,
  ): void {
    this.ensureActive();

    if (this.isMfaEnabled()) {
      throw new MfaAlreadyEnabledException();
    }

    this.authentication.setMfa(
      MfaStatus.ENABLED,
      method,
      encryptedSecret,
      enabledAt,
    );

    this.authentication.setUpdatedAt(enabledAt);

    this.addDomainEvent(
      new MfaEnabledEvent(
        this.id.value,
        this.publicId.value,
        this.identityId,
        method,
        enabledAt,
        correlationId,
      ),
    );
  }

  disableMfa(disabledAt: Date, correlationId: string): void {
    if (!this.isMfaEnabled()) {
      throw new MfaAlreadyDisabledException();
    }

    this.authentication.setMfa(
      MfaStatus.DISABLED,
      undefined,
      undefined,
      undefined,
    );

    this.authentication.setUpdatedAt(disabledAt);

    this.addDomainEvent(
      new MfaDisabledEvent(
        this.id.value,
        this.publicId.value,
        this.identityId,
        disabledAt,
        correlationId,
      ),
    );
  }

  rotateMfaSecret(
    encryptedSecret: string,
    rotatedAt: Date,
    correlationId: string,
  ): void {
    if (!this.isMfaEnabled()) {
      throw new MfaDisabledException();
    }

    if (this.authentication.mfaSecret === undefined) {
      throw new MfaSecretNotConfiguredException();
    }

    this.authentication.setMfa(
      this.authentication.mfaStatus,
      this.authentication.mfaMethod,
      encryptedSecret,
      this.authentication.mfaEnabledAt,
    );

    this.authentication.setUpdatedAt(rotatedAt);

    this.addDomainEvent(
      new MfaSecretRotatedEvent(
        this.id.value,
        this.publicId.value,
        this.identityId,
        this.authentication.mfaMethod!,
        rotatedAt,
        correlationId,
      ),
    );
  }

  recordSuccessfulMfaVerification(
    verifiedAt: Date,
    correlationId: string,
  ): void {
    if (!this.isMfaEnabled()) {
      throw new MfaDisabledException();
    }

    this.authentication.setUpdatedAt(verifiedAt);

    this.addDomainEvent(
      new MfaVerifiedEvent(
        this.id.value,
        this.publicId.value,
        this.identityId,
        this.authentication.mfaMethod!,
        verifiedAt,
        correlationId,
      ),
    );
  }

  recordFailedMfaVerification(
    reason: AuthenticationFailureReason,
    failedAt: Date,
    correlationId: string,
  ): void {
    if (!this.isMfaEnabled()) {
      throw new MfaDisabledException();
    }

    this.authentication.setUpdatedAt(failedAt);

    this.addDomainEvent(
      new MfaVerificationFailedEvent(
        this.id.value,
        this.publicId.value,
        this.identityId,
        this.authentication.mfaMethod!,
        reason,
        failedAt,
        correlationId,
      ),
    );
  }
  // ------------------------------------------------------------------
  // Password History
  // ------------------------------------------------------------------

  passwordHistoryEntries(): readonly PasswordHistoryEntity[] {
    return this.passwordHistory;
  }

  hasPasswordHashInHistory(passwordHash: string): boolean {
    return this.passwordHistory.some(
      (history) => history.passwordHash === passwordHash,
    );
  }

  hasPasswordVersionInHistory(version: number): boolean {
    return this.passwordHistory.some((history) => history.version === version);
  }

  latestPasswordHistory(): PasswordHistoryEntity | undefined {
    return this.passwordHistory.at(-1);
  }

  passwordHistoryCount(): number {
    return this.passwordHistory.length;
  }

  clearPasswordHistory(): void {
    this.props.passwordHistory.length = 0;
  }

  private recordCurrentPassword(): void {
    const passwordHash = this.authentication.passwordHash;

    if (passwordHash === undefined) {
      return;
    }

    if (this.hasPasswordVersionInHistory(this.authentication.passwordVersion)) {
      return;
    }

    const history = new PasswordHistoryEntity({
      authenticationId: this.authentication.id.value,
      passwordHash,
      version: this.authentication.passwordVersion,
      createdAt:
        this.authentication.passwordChangedAt ?? this.authentication.createdAt,
    });

    this.props.passwordHistory.push(history);
  }

  // ------------------------------------------------------------------
  // Guards
  // ------------------------------------------------------------------

  private ensureActive(): void {
    if (!this.isActive()) {
      throw new AuthenticationNotActiveException();
    }
  }

  private ensureNotDisabled(): void {
    if (this.isDisabled()) {
      throw new AuthenticationDisabledException();
    }
  }

  private ensureLocked(now: Date): void {
    if (!this.isLocked(now)) {
      throw new AuthenticationNotLockedException();
    }
  }

  private ensureNotLocked(now: Date): void {
    if (this.isLocked(now)) {
      throw new AuthenticationLockedException();
    }
  }

  private ensurePasswordConfigured(): void {
    if (!this.hasPassword()) {
      throw new PasswordNotConfiguredException();
    }
  }

  private ensurePasswordNotExpired(now: Date): void {
    if (this.isPasswordExpired(now)) {
      throw new PasswordExpiredException();
    }
  }

  private ensureMfaEnabled(): void {
    if (!this.isMfaEnabled()) {
      throw new MfaDisabledException();
    }
  }

  private ensureMfaDisabled(): void {
    if (this.isMfaEnabled()) {
      throw new MfaAlreadyEnabledException();
    }
  }

  private ensureMfaSecretConfigured(): void {
    if (this.authentication.mfaSecret === undefined) {
      throw new MfaSecretNotConfiguredException();
    }
  }
}
