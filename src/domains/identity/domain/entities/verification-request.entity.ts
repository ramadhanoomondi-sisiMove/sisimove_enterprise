// src/domains/identity/domain/entities/verification-request.entity.ts

import { Entity } from '../../../../foundation/kernel/domain/entity';
import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { VerificationRequestStatus } from '../enums/verification-request-status.enum';
import type { VerificationRequestType } from '../enums/verification-request-type.enum';

import { VerificationRequestAlreadyReviewedException } from '../exceptions/verification-request-already-reviewed.exception';

import type { IdentityId } from '../value-objects/identity-id.vo';
import type { VerificationId } from '../value-objects/verification-id.vo';
import { VerificationRequestId } from '../value-objects/verification-request-id.vo';

import type { VerificationRequestProps } from './verification-request.props';

export class VerificationRequestEntity extends Entity<VerificationRequestProps> {
  public constructor(
    props: VerificationRequestProps,
    id?: UniqueEntityId,
    publicId?: VerificationRequestId,
  ) {
    super(props, id, publicId);
  }

  public static create(
    verificationId: VerificationId,
    type: VerificationRequestType,
    assetPublicId: string,
    metadata?: Readonly<Record<string, unknown>>,
  ): VerificationRequestEntity {
    const now = new Date();

    const props: VerificationRequestProps = {
      verificationId,
      type,
      status: VerificationRequestStatus.PENDING,
      assetPublicId,
      submittedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    if (metadata !== undefined) {
      props.metadata = metadata;
    }

    return new VerificationRequestEntity(
      props,
      new UniqueEntityId(),
      new VerificationRequestId(),
    );
  }

  public get verificationId(): VerificationId {
    return this.props.verificationId;
  }

  public get type(): VerificationRequestType {
    return this.props.type;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public get status(): VerificationRequestStatus {
    return this.props.status;
  }

  public get assetPublicId(): string {
    return this.props.assetPublicId;
  }

  public get submittedAt(): Date {
    return this.props.submittedAt;
  }

  public get reviewedAt(): Date | undefined {
    return this.props.reviewedAt;
  }

  public get reviewedById(): IdentityId | undefined {
    return this.props.reviewedById;
  }

  public get rejectionReason(): string | undefined {
    return this.props.rejectionReason;
  }

  public get metadata(): Readonly<Record<string, unknown>> | undefined {
    return this.props.metadata;
  }

  public isPending(): boolean {
    return this.props.status === VerificationRequestStatus.PENDING;
  }

  public isApproved(): boolean {
    return this.props.status === VerificationRequestStatus.APPROVED;
  }

  public isRejected(): boolean {
    return this.props.status === VerificationRequestStatus.REJECTED;
  }

  public approve(reviewerId: IdentityId): void {
    if (!this.isPending()) {
      throw new VerificationRequestAlreadyReviewedException();
    }

    const now = new Date();

    this.props.status = VerificationRequestStatus.APPROVED;
    this.props.reviewedById = reviewerId;
    this.props.reviewedAt = now;
    this.props.updatedAt = now;
  }

  public reject(reviewerId: IdentityId, reason: string): void {
    if (!this.isPending()) {
      throw new VerificationRequestAlreadyReviewedException();
    }

    const now = new Date();

    this.props.status = VerificationRequestStatus.REJECTED;
    this.props.reviewedById = reviewerId;
    this.props.reviewedAt = now;
    this.props.rejectionReason = reason;
    this.props.updatedAt = now;
  }

  public cancel(): void {
    if (!this.isPending()) {
      throw new VerificationRequestAlreadyReviewedException();
    }

    this.props.status = VerificationRequestStatus.CANCELLED;
    this.props.updatedAt = new Date();
  }
}
