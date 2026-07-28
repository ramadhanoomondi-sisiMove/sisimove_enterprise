// src/domains/identity/domain/aggregates/recovery.aggregate.ts

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';
import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { RecoveryRequestedEvent } from '../events/recovery-requested.event';

import { RecoveryId } from '../value-objects/recovery-id.vo';
import { RecoveryStatus } from '../value-objects/recovery-status.enum';
import type { RecoveryType } from '../value-objects/recovery-type.enum';
import type { RecoveryFailureReason } from '../value-objects/recovery-failure-reason.enum';

import { RecoveryAlreadyCompletedException } from '../exceptions/recovery-already-completed.exception';
import { RecoveryCancelledException } from '../exceptions/recovery-cancelled.exception';
import { RecoveryExpiredException } from '../exceptions/recovery-expired.exception';
import { InvalidRecoveryTokenException } from '../exceptions/invalid-recovery-token.exception';

import { RecoveryCompletedEvent } from '../events/recovery-completed.event.ts';
import { RecoveryCancelledEvent } from '../events/recovery-cancelled.event';
import { RecoveryExpiredEvent } from '../events/recovery-expired.event';

interface RecoveryProps {
  identityId: string;

  type: RecoveryType;
  status: RecoveryStatus;

  recoveryTokenHash: string | undefined;

  requestedAt: Date;
  expiresAt: Date;

  completedAt: Date | undefined;
  cancelledAt: Date | undefined;

  failureReason: RecoveryFailureReason | undefined;

  createdAt: Date;
  updatedAt: Date;
}

export class RecoveryAggregate extends AggregateRoot<RecoveryProps> {
  public constructor(
    props: RecoveryProps,
    id?: UniqueEntityId,
    publicId?: RecoveryId,
  ) {
    super(props, id, publicId);
  }

  static request(
    identityId: string,
    type: RecoveryType,
    recoveryTokenHash: string,
    expiresAt: Date,
    correlationId: string,
  ): RecoveryAggregate {
    const now = new Date();

    const recovery = new RecoveryAggregate(
      {
        identityId,

        type,
        status: RecoveryStatus.PENDING,

        recoveryTokenHash,

        requestedAt: now,
        expiresAt,

        completedAt: undefined,
        cancelledAt: undefined,

        failureReason: undefined,

        createdAt: now,
        updatedAt: now,
      },
      new UniqueEntityId(),
      new RecoveryId(),
    );

    recovery.addDomainEvent(
      new RecoveryRequestedEvent(
        recovery.id.value,
        recovery.publicId.value,
        recovery.identityId,
        recovery.type,
        recovery.requestedAt,
        recovery.expiresAt,
        correlationId,
      ),
    );

    return recovery;
  }

  get identityId(): string {
    return this.props.identityId;
  }

  get type(): RecoveryType {
    return this.props.type;
  }

  get status(): RecoveryStatus {
    return this.props.status;
  }

  get recoveryTokenHash(): string | undefined {
    return this.props.recoveryTokenHash;
  }

  get requestedAt(): Date {
    return this.props.requestedAt;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get completedAt(): Date | undefined {
    return this.props.completedAt;
  }

  get cancelledAt(): Date | undefined {
    return this.props.cancelledAt;
  }

  get failureReason(): RecoveryFailureReason | undefined {
    return this.props.failureReason;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  private touch(at: Date): void {
    this.props.updatedAt = at;
  }

  private clearToken(): void {
    this.props.recoveryTokenHash = undefined;
  }

  isPending(): boolean {
    return this.props.status === RecoveryStatus.PENDING;
  }

  isCompleted(): boolean {
    return this.props.status === RecoveryStatus.COMPLETED;
  }

  isCancelled(): boolean {
    return this.props.status === RecoveryStatus.CANCELLED;
  }

  isExpired(referenceDate: Date = new Date()): boolean {
    return (
      this.props.status === RecoveryStatus.EXPIRED ||
      referenceDate >= this.props.expiresAt
    );
  }

  validateToken(tokenHash: string): void {
    this.ensureUsable();

    if (!this.recoveryTokenHash) {
      throw new InvalidRecoveryTokenException();
    }

    if (this.recoveryTokenHash !== tokenHash) {
      throw new InvalidRecoveryTokenException();
    }
  }

  ensureUsable(referenceDate: Date = new Date()): void {
    if (this.isCompleted()) {
      throw new RecoveryAlreadyCompletedException();
    }

    if (this.isCancelled()) {
      throw new RecoveryCancelledException();
    }

    if (this.isExpired(referenceDate)) {
      throw new RecoveryExpiredException();
    }
  }

  complete(
    tokenHash: string,
    correlationId: string,
    completedAt: Date = new Date(),
  ): void {
    this.validateToken(tokenHash);

    this.props.status = RecoveryStatus.COMPLETED;
    this.props.completedAt = completedAt;

    this.clearToken();
    this.touch(completedAt);

    this.addDomainEvent(
      new RecoveryCompletedEvent(
        this.id.value,
        this.publicId.value,
        this.identityId,
        this.type,
        completedAt,
        correlationId,
      ),
    );
  }

  cancel(
    reason: RecoveryFailureReason,
    correlationId: string,
    cancelledAt: Date = new Date(),
  ): void {
    this.ensureUsable(cancelledAt);

    this.props.status = RecoveryStatus.CANCELLED;
    this.props.cancelledAt = cancelledAt;
    this.props.failureReason = reason;

    this.clearToken();
    this.touch(cancelledAt);

    this.addDomainEvent(
      new RecoveryCancelledEvent(
        this.id.value,
        this.publicId.value,
        this.identityId,
        this.type,
        cancelledAt,
        reason,
        correlationId,
      ),
    );
  }

  expire(correlationId: string, expiredAt: Date = new Date()): void {
    if (
      this.isCompleted() ||
      this.isCancelled() ||
      this.status === RecoveryStatus.EXPIRED
    ) {
      return;
    }

    if (expiredAt < this.expiresAt) {
      return;
    }

    this.props.status = RecoveryStatus.EXPIRED;

    this.clearToken();
    this.touch(expiredAt);

    this.addDomainEvent(
      new RecoveryExpiredEvent(
        this.id.value,
        this.publicId.value,
        this.identityId,
        this.type,
        expiredAt,
        correlationId,
      ),
    );
  }

  hasToken(): boolean {
    return this.props.recoveryTokenHash !== undefined;
  }

  matchesToken(tokenHash: string): boolean {
    return (
      this.props.recoveryTokenHash !== undefined &&
      this.props.recoveryTokenHash === tokenHash
    );
  }

  canBeRetried(referenceDate: Date = new Date()): boolean {
    return (
      this.status === RecoveryStatus.EXPIRED ||
      this.status === RecoveryStatus.CANCELLED ||
      (this.status === RecoveryStatus.PENDING &&
        referenceDate >= this.expiresAt)
    );
  }

  rotateToken(recoveryTokenHash: string, expiresAt: Date): void {
    this.ensureUsable();

    this.props.recoveryTokenHash = recoveryTokenHash;
    this.props.expiresAt = expiresAt;

    this.touch(new Date());
  }

  extendExpiry(expiresAt: Date): void {
    this.ensureUsable();

    if (expiresAt <= this.props.expiresAt) {
      return;
    }

    this.props.expiresAt = expiresAt;

    this.touch(new Date());
  }
}
