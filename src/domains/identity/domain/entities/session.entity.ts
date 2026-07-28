// src/domains/identity/domain/entities/session.entity.ts

import { Entity } from '../../../../foundation/kernel/domain/entity';
import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';
import { IdentityId } from '../value-objects/identity-id.vo';

export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
}

export enum SessionRevocationReason {
  USER_LOGOUT = 'USER_LOGOUT',
  ADMIN_LOGOUT = 'ADMIN_LOGOUT',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  PASSWORD_RESET = 'PASSWORD_RESET',
  MFA_RESET = 'MFA_RESET',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_CLOSED = 'ACCOUNT_CLOSED',
  TOKEN_REUSE = 'TOKEN_REUSE',
  SECURITY_POLICY = 'SECURITY_POLICY',
  DEVICE_REMOVED = 'DEVICE_REMOVED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  SYSTEM = 'SYSTEM',
}

interface SessionProps {
  identityId: string;
  deviceId: string | undefined;
  status: SessionStatus;
  refreshTokenHash: string;
  ipAddress: string | undefined;
  userAgent: string | undefined;
  countryCode: string | undefined;
  city: string | undefined;
  authenticatedAt: Date;
  lastActivityAt: Date;
  expiresAt: Date;
  revokedAt: Date | undefined;
  revokedReason: SessionRevocationReason | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export class SessionEntity extends Entity<SessionProps> {
  public constructor(
    props: SessionProps,
    id?: UniqueEntityId,
    publicId?: IdentityId,
  ) {
    super(props, id, publicId);
  }

  static create(
    identityId: string,
    refreshTokenHash: string,
    expiresAt: Date,
    metadata?: {
      deviceId?: string;
      ipAddress?: string;
      userAgent?: string;
      countryCode?: string;
      city?: string;
    },
  ): SessionEntity {
    const now = new Date();

    return new SessionEntity(
      {
        identityId,
        deviceId: metadata?.deviceId,
        status: SessionStatus.ACTIVE,
        refreshTokenHash,
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
        countryCode: metadata?.countryCode,
        city: metadata?.city,
        authenticatedAt: now,
        lastActivityAt: now,
        expiresAt,
        revokedAt: undefined,
        revokedReason: undefined,
        createdAt: now,
        updatedAt: now,
      },
      new UniqueEntityId(),
      new IdentityId(),
    );
  }

  updateLastActivity(): void {
    this.props.lastActivityAt = new Date();
    this.props.updatedAt = new Date();
  }

  revoke(reason: SessionRevocationReason): void {
    this.props.status = SessionStatus.REVOKED;
    this.props.revokedAt = new Date();
    this.props.revokedReason = reason;
    this.props.updatedAt = new Date();
  }

  expire(): void {
    this.props.status = SessionStatus.EXPIRED;
    this.props.revokedAt = new Date();
    this.props.revokedReason = SessionRevocationReason.SESSION_EXPIRED;
    this.props.updatedAt = new Date();
  }

  isExpired(): boolean {
    return (
      this.props.expiresAt.getTime() <= Date.now() ||
      this.props.status === SessionStatus.EXPIRED
    );
  }

  isRevoked(): boolean {
    return this.props.status === SessionStatus.REVOKED;
  }

  get identityId(): string {
    return this.props.identityId;
  }

  get deviceId(): string | undefined {
    return this.props.deviceId;
  }

  get status(): SessionStatus {
    return this.props.status;
  }

  get refreshTokenHash(): string {
    return this.props.refreshTokenHash;
  }

  get ipAddress(): string | undefined {
    return this.props.ipAddress;
  }

  get userAgent(): string | undefined {
    return this.props.userAgent;
  }

  get countryCode(): string | undefined {
    return this.props.countryCode;
  }

  get city(): string | undefined {
    return this.props.city;
  }

  get authenticatedAt(): Date {
    return this.props.authenticatedAt;
  }

  get lastActivityAt(): Date {
    return this.props.lastActivityAt;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get revokedAt(): Date | undefined {
    return this.props.revokedAt;
  }

  get revokedReason(): SessionRevocationReason | undefined {
    return this.props.revokedReason;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
