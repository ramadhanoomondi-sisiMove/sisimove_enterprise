// src/domains/identity/domain/entities/recovery.entity.ts

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { RecoveryAlreadyCompletedException } from '../exceptions/recovery-already-completed.exception';
import { RecoveryCancelledException } from '../exceptions/recovery-cancelled.exception';
import { RecoveryExpiredException } from '../exceptions/recovery-expired.exception';
import { InvalidRecoveryTokenException } from '../exceptions/invalid-recovery-token.exception';

import type { IdentityId } from '../value-objects/identity-id.vo';
import type { RecoveryFailureReason } from '../value-objects/recovery-failure-reason.enum';
import type { RecoveryId } from '../value-objects/recovery-id.vo';
import { RecoveryStatus } from '../value-objects/recovery-status.enum';
import type { RecoveryType } from '../value-objects/recovery-type.enum';

export interface RecoveryProps {
  publicId: RecoveryId;

  identityId: IdentityId;

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

export class RecoveryEntity extends Entity<RecoveryProps> {
  constructor(props: RecoveryProps, id?: UniqueEntityId) {
    super(props, id);
  }

  override get publicId(): RecoveryId {
    return this.props.publicId;
  }

  get identityId(): IdentityId {
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

  isPending(): boolean {
    return this.status === RecoveryStatus.PENDING;
  }

  isCompleted(): boolean {
    return this.status === RecoveryStatus.COMPLETED;
  }

  isCancelled(): boolean {
    return this.status === RecoveryStatus.CANCELLED;
  }

  isExpired(referenceDate: Date = new Date()): boolean {
    return referenceDate >= this.expiresAt;
  }

  isFinalized(): boolean {
    return (
      this.isCompleted() ||
      this.isCancelled() ||
      this.status === RecoveryStatus.EXPIRED
    );
  }

  validateToken(tokenHash: string): void {
    if (
      this.recoveryTokenHash === undefined ||
      this.recoveryTokenHash !== tokenHash
    ) {
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
      this.expire(referenceDate);
      throw new RecoveryExpiredException();
    }
  }

  complete(completedAt: Date = new Date()): void {
    this.ensureUsable(completedAt);

    this.props.status = RecoveryStatus.COMPLETED;
    this.props.completedAt = completedAt;
    this.props.recoveryTokenHash = undefined;

    this.touch(completedAt);
  }

  cancel(
    reason: RecoveryFailureReason | undefined,
    cancelledAt: Date = new Date(),
  ): void {
    if (this.isCompleted()) {
      throw new RecoveryAlreadyCompletedException();
    }

    if (this.isCancelled()) {
      throw new RecoveryCancelledException();
    }

    this.props.status = RecoveryStatus.CANCELLED;
    this.props.cancelledAt = cancelledAt;
    this.props.failureReason = reason;
    this.props.recoveryTokenHash = undefined;

    this.touch(cancelledAt);
  }

  expire(expiredAt: Date = new Date()): void {
    if (this.isFinalized()) {
      return;
    }

    if (expiredAt < this.expiresAt) {
      return;
    }

    this.props.status = RecoveryStatus.EXPIRED;
    this.props.recoveryTokenHash = undefined;

    this.touch(expiredAt);
  }

  private touch(at: Date): void {
    this.props.updatedAt = at;
  }
}
