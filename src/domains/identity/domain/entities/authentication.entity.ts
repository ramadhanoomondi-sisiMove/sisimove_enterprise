// src/domains/identity/domain/entities/authentication.entity.ts

import { Entity } from '../../../../foundation/kernel/domain/entity';
import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { AuthenticationId } from '../value-objects/authentication-id.vo';

import { AuthenticationStatus } from '../value-objects/authentication-status.enum';
import { MfaStatus } from '../value-objects/mfa-status.enum';

import type { AuthenticationFailureReason } from '../value-objects/authentication-failure-reason.enum';
import type { AuthenticationMfaMethod } from '../value-objects/authentication-mfa-method.enum';

export interface AuthenticationProps {
  identityId: string;

  status: AuthenticationStatus;

  passwordHash: string | undefined;
  passwordVersion: number;

  passwordChangedAt: Date | undefined;
  passwordExpiresAt: Date | undefined;
  passwordMustChange: boolean;

  failedAuthenticationCount: number;
  lastFailedAuthenticationAt: Date | undefined;

  lockedAt: Date | undefined;
  lockedUntil: Date | undefined;
  lockReason: AuthenticationFailureReason | undefined;

  lastAuthenticatedAt: Date | undefined;

  mfaStatus: MfaStatus;
  mfaMethod: AuthenticationMfaMethod | undefined;
  mfaSecret: string | undefined;
  mfaEnabledAt: Date | undefined;

  createdAt: Date;
  updatedAt: Date;
}

export class AuthenticationEntity extends Entity<AuthenticationProps> {
  constructor(
    props: AuthenticationProps,
    id?: UniqueEntityId,
    publicId?: AuthenticationId,
  ) {
    super(props, id, publicId);
  }

  // ------------------------------------------------------------------
  // Factory
  // ------------------------------------------------------------------

  static create(
    identityId: string,
    passwordHash: string,
    passwordExpiresAt?: Date,
  ): AuthenticationEntity {
    const now = new Date();

    return new AuthenticationEntity(
      {
        identityId,

        status: AuthenticationStatus.ACTIVE,

        passwordHash,
        passwordVersion: 1,

        passwordChangedAt: now,
        passwordExpiresAt: passwordExpiresAt ?? undefined,

        passwordMustChange: false,

        failedAuthenticationCount: 0,
        lastFailedAuthenticationAt: undefined,

        lockedAt: undefined,
        lockedUntil: undefined,
        lockReason: undefined,

        lastAuthenticatedAt: undefined,

        mfaStatus: MfaStatus.DISABLED,
        mfaMethod: undefined,
        mfaSecret: undefined,
        mfaEnabledAt: undefined,

        createdAt: now,
        updatedAt: now,
      },
      new UniqueEntityId(),
      new AuthenticationId(),
    );
  }

  // ------------------------------------------------------------------
  // Getters
  // ------------------------------------------------------------------

  override get publicId(): AuthenticationId {
    return super.publicId;
  }

  get identityId(): string {
    return this.props.identityId;
  }

  get status(): AuthenticationStatus {
    return this.props.status;
  }

  get passwordHash(): string | undefined {
    return this.props.passwordHash;
  }

  get passwordVersion(): number {
    return this.props.passwordVersion;
  }

  get passwordChangedAt(): Date | undefined {
    return this.props.passwordChangedAt;
  }

  get passwordExpiresAt(): Date | undefined {
    return this.props.passwordExpiresAt;
  }

  get passwordMustChange(): boolean {
    return this.props.passwordMustChange;
  }

  get failedAuthenticationCount(): number {
    return this.props.failedAuthenticationCount;
  }

  get lastFailedAuthenticationAt(): Date | undefined {
    return this.props.lastFailedAuthenticationAt;
  }

  get lockedAt(): Date | undefined {
    return this.props.lockedAt;
  }

  get lockedUntil(): Date | undefined {
    return this.props.lockedUntil;
  }

  get lockReason(): AuthenticationFailureReason | undefined {
    return this.props.lockReason;
  }

  get lastAuthenticatedAt(): Date | undefined {
    return this.props.lastAuthenticatedAt;
  }

  get mfaStatus(): MfaStatus {
    return this.props.mfaStatus;
  }

  get mfaMethod(): AuthenticationMfaMethod | undefined {
    return this.props.mfaMethod;
  }

  get mfaSecret(): string | undefined {
    return this.props.mfaSecret;
  }

  get mfaEnabledAt(): Date | undefined {
    return this.props.mfaEnabledAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // ------------------------------------------------------------------
  // Status
  // ------------------------------------------------------------------

  setStatus(status: AuthenticationStatus): void {
    this.props.status = status;
    this.props.updatedAt = new Date();
  }

  // ------------------------------------------------------------------
  // Password
  // ------------------------------------------------------------------

  setPassword(
    hash: string,
    version: number,
    changedAt: Date,
    expiresAt?: Date,
  ): void {
    this.props.passwordHash = hash;
    this.props.passwordVersion = version;
    this.props.passwordChangedAt = changedAt;
    this.props.passwordExpiresAt = expiresAt ?? undefined;
    this.props.updatedAt = changedAt;
  }

  setPasswordExpiration(expiresAt?: Date): void {
    this.props.passwordExpiresAt = expiresAt ?? undefined;
    this.props.updatedAt = new Date();
  }

  setPasswordMustChange(required: boolean): void {
    this.props.passwordMustChange = required;
    this.props.updatedAt = new Date();
  }

  // ------------------------------------------------------------------
  // Authentication
  // ------------------------------------------------------------------

  setAuthenticationSuccess(authenticatedAt: Date): void {
    this.props.failedAuthenticationCount = 0;
    this.props.lastAuthenticatedAt = authenticatedAt;
    this.props.updatedAt = authenticatedAt;
  }

  setAuthenticationFailure(failedCount: number, occurredAt: Date): void {
    this.props.failedAuthenticationCount = failedCount;
    this.props.lastFailedAuthenticationAt = occurredAt;
    this.props.updatedAt = occurredAt;
  }

  resetFailedAuthenticationCount(): void {
    this.props.failedAuthenticationCount = 0;
    this.props.lastFailedAuthenticationAt = undefined;
    this.props.updatedAt = new Date();
  }

  // ------------------------------------------------------------------
  // Lock
  // ------------------------------------------------------------------

  setLock(
    status: AuthenticationStatus,
    lockedAt: Date,
    lockedUntil: Date,
    reason: AuthenticationFailureReason,
  ): void {
    this.props.status = status;
    this.props.lockedAt = lockedAt;
    this.props.lockedUntil = lockedUntil;
    this.props.lockReason = reason;
    this.props.updatedAt = lockedAt;
  }

  extendLock(lockedUntil: Date): void {
    this.props.lockedUntil = lockedUntil;
    this.props.updatedAt = new Date();
  }

  clearLock(status: AuthenticationStatus): void {
    this.props.status = status;
    this.props.lockedAt = undefined;
    this.props.lockedUntil = undefined;
    this.props.lockReason = undefined;
    this.props.updatedAt = new Date();
  }

  // ------------------------------------------------------------------
  // MFA
  // ------------------------------------------------------------------

  setMfa(
    status: MfaStatus,
    method?: AuthenticationMfaMethod,
    secret?: string,
    enabledAt?: Date,
  ): void {
    this.props.mfaStatus = status;
    this.props.mfaMethod = method ?? undefined;
    this.props.mfaSecret = secret ?? undefined;
    this.props.mfaEnabledAt = enabledAt ?? undefined;
    this.props.updatedAt = new Date();
  }

  // ------------------------------------------------------------------
  // Audit
  // ------------------------------------------------------------------

  setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }
}
