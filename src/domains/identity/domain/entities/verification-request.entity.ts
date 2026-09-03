import { Entity } from '../../../../foundation/kernel/domain/entity';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { VerificationRequestInvalidStatusException } from '../exceptions/verification-request-invalid-status.exception';

import { VerificationRequestPublicId } from '../value-objects/verification-request-public-id.vo';

import type { VerificationPublicId } from '../value-objects/verification-public-id.vo';

import type { IdentityPublicId } from '../value-objects/identity-public-id.vo';

import type { VerificationRequestType } from '../value-objects/verification-request-type.vo';

import { VerificationRequestStatus } from '../value-objects/verification-request-status.vo';

import type { VerificationRequestAssetPublicId } from '../value-objects/verification-request-asset-public-id.vo';

export interface VerificationRequestProps {
  publicId: VerificationRequestPublicId;

  verificationPublicId: VerificationPublicId;

  type: VerificationRequestType;

  status: VerificationRequestStatus;

  assetPublicId: VerificationRequestAssetPublicId;

  submittedAt: Date;

  reviewedAt?: Date;

  reviewedByPublicId?: IdentityPublicId;

  rejectionReason?: string;

  metadata?: Record<string, unknown>;

  createdAt: Date;

  updatedAt: Date;
}

export interface CreateVerificationRequestProps {
  publicId?: VerificationRequestPublicId;

  verificationPublicId: VerificationPublicId;

  type: VerificationRequestType;

  assetPublicId: VerificationRequestAssetPublicId;

  metadata?: Record<string, unknown>;

  submittedAt?: Date;

  createdAt?: Date;

  updatedAt?: Date;
}

interface VerificationRequestValidationProps {
  verificationPublicId: VerificationPublicId;

  type: VerificationRequestType;

  assetPublicId: VerificationRequestAssetPublicId;

  status: VerificationRequestStatus;

  submittedAt: Date;

  reviewedAt: Date | undefined;

  reviewedByPublicId: IdentityPublicId | undefined;

  rejectionReason: string | undefined;

  createdAt: Date;

  updatedAt: Date;
}

export class VerificationRequestEntity extends Entity<
  VerificationRequestProps,
  VerificationRequestPublicId
> {
  private constructor(
    props: VerificationRequestProps,
    id?: UniqueEntityId,
    publicId?: VerificationRequestPublicId,
  ) {
    super(props, id, publicId);
  }

  public static create(
    props: CreateVerificationRequestProps,
  ): VerificationRequestEntity {
    if (props === undefined) {
      throw new VerificationRequestInvalidStatusException(
        'Verification request creation properties are required.',
      );
    }

    if (props.verificationPublicId === undefined) {
      throw new VerificationRequestInvalidStatusException(
        'Verification request parent verification public ID is required.',
      );
    }

    if (props.type === undefined) {
      throw new VerificationRequestInvalidStatusException(
        'Verification request type is required.',
      );
    }

    if (props.assetPublicId === undefined) {
      throw new VerificationRequestInvalidStatusException(
        'Verification request asset public ID is required.',
      );
    }

    const now = new Date();

    const publicId = props.publicId ?? new VerificationRequestPublicId();

    const status = VerificationRequestStatus.create('PENDING');

    const submittedAt = VerificationRequestEntity.cloneDate(
      props.submittedAt ?? now,
    );

    const createdAt = VerificationRequestEntity.cloneDate(
      props.createdAt ?? submittedAt,
    );

    const updatedAt = VerificationRequestEntity.cloneDate(
      props.updatedAt ?? createdAt,
    );

    VerificationRequestEntity.validateState({
      verificationPublicId: props.verificationPublicId,
      type: props.type,
      assetPublicId: props.assetPublicId,
      status,
      submittedAt,
      reviewedAt: undefined,
      reviewedByPublicId: undefined,
      rejectionReason: undefined,
      createdAt,
      updatedAt,
    });

    return new VerificationRequestEntity(
      {
        publicId,
        verificationPublicId: props.verificationPublicId,
        type: props.type,
        status,
        assetPublicId: props.assetPublicId,
        submittedAt,
        ...(props.metadata !== undefined
          ? {
              metadata: VerificationRequestEntity.cloneMetadata(props.metadata),
            }
          : {}),
        createdAt,
        updatedAt,
      },
      undefined,
      publicId,
    );
  }

  public static rehydrate(
    props: VerificationRequestProps,
    id: UniqueEntityId,
    publicId: VerificationRequestPublicId,
  ): VerificationRequestEntity {
    if (props === undefined) {
      throw new VerificationRequestInvalidStatusException(
        'Verification request rehydration properties are required.',
      );
    }

    if (id === undefined) {
      throw new VerificationRequestInvalidStatusException(
        'Verification request internal identity is required for rehydration.',
      );
    }

    if (publicId === undefined) {
      throw new VerificationRequestInvalidStatusException(
        'Verification request public identity is required for rehydration.',
      );
    }

    if (props.verificationPublicId === undefined) {
      throw new VerificationRequestInvalidStatusException(
        'Verification request parent verification public ID is required for rehydration.',
      );
    }

    if (props.type === undefined) {
      throw new VerificationRequestInvalidStatusException(
        'Verification request type is required for rehydration.',
      );
    }

    if (props.assetPublicId === undefined) {
      throw new VerificationRequestInvalidStatusException(
        'Verification request asset public ID is required for rehydration.',
      );
    }

    if (props.status === undefined) {
      throw new VerificationRequestInvalidStatusException(
        'Verification request status is required for rehydration.',
      );
    }

    const submittedAt = VerificationRequestEntity.cloneDate(props.submittedAt);

    const reviewedAt =
      props.reviewedAt !== undefined
        ? VerificationRequestEntity.cloneDate(props.reviewedAt)
        : undefined;

    const rejectionReason =
      props.rejectionReason !== undefined
        ? VerificationRequestEntity.normalizeReason(props.rejectionReason)
        : undefined;

    const createdAt = VerificationRequestEntity.cloneDate(props.createdAt);

    const updatedAt = VerificationRequestEntity.cloneDate(props.updatedAt);

    VerificationRequestEntity.validateState({
      verificationPublicId: props.verificationPublicId,
      type: props.type,
      assetPublicId: props.assetPublicId,
      status: props.status,
      submittedAt,
      reviewedAt,
      reviewedByPublicId: props.reviewedByPublicId,
      rejectionReason,
      createdAt,
      updatedAt,
    });

    return new VerificationRequestEntity(
      {
        publicId,
        verificationPublicId: props.verificationPublicId,
        type: props.type,
        status: props.status,
        assetPublicId: props.assetPublicId,
        submittedAt,
        ...(reviewedAt !== undefined
          ? {
              reviewedAt,
            }
          : {}),
        ...(props.reviewedByPublicId !== undefined
          ? {
              reviewedByPublicId: props.reviewedByPublicId,
            }
          : {}),
        ...(rejectionReason !== undefined
          ? {
              rejectionReason,
            }
          : {}),
        ...(props.metadata !== undefined
          ? {
              metadata: VerificationRequestEntity.cloneMetadata(props.metadata),
            }
          : {}),
        createdAt,
        updatedAt,
      },
      id,
      publicId,
    );
  }

  public override get publicId(): VerificationRequestPublicId {
    return this.props.publicId;
  }

  public get verificationPublicId(): VerificationPublicId {
    return this.props.verificationPublicId;
  }

  public get type(): VerificationRequestType {
    return this.props.type;
  }

  public get assetPublicId(): VerificationRequestAssetPublicId {
    return this.props.assetPublicId;
  }

  public get status(): VerificationRequestStatus {
    return this.props.status;
  }

  public isPending(): boolean {
    return this.props.status.isPending();
  }

  public isApproved(): boolean {
    return this.props.status.isApproved();
  }

  public isRejected(): boolean {
    return this.props.status.isRejected();
  }

  public isCancelled(): boolean {
    return this.props.status.isCancelled();
  }

  public isReviewed(): boolean {
    return this.isApproved() || this.isRejected();
  }

  public isTerminal(): boolean {
    return this.props.status.isTerminal();
  }

  public submittedAt(): Date {
    return VerificationRequestEntity.cloneDate(this.props.submittedAt);
  }

  public get reviewedAt(): Date | undefined {
    return this.props.reviewedAt !== undefined
      ? VerificationRequestEntity.cloneDate(this.props.reviewedAt)
      : undefined;
  }

  public get reviewedByPublicId(): IdentityPublicId | undefined {
    return this.props.reviewedByPublicId;
  }

  public get rejectionReason(): string | undefined {
    return this.props.rejectionReason;
  }

  public get metadata(): Readonly<Record<string, unknown>> | undefined {
    return this.props.metadata !== undefined
      ? VerificationRequestEntity.cloneMetadata(this.props.metadata)
      : undefined;
  }

  public approve(
    reviewedByPublicId: IdentityPublicId,
    at: Date = new Date(),
  ): void {
    if (reviewedByPublicId === undefined) {
      throw new VerificationRequestInvalidStatusException(
        'A verification request reviewer is required for approval.',
      );
    }

    this.ensureValidOperationDate(at);

    if (!this.props.status.canApprove()) {
      throw new VerificationRequestInvalidStatusException(
        `Verification request ${this.publicId.value} cannot be approved from status ${this.props.status.value}.`,
      );
    }

    const timestamp = VerificationRequestEntity.cloneDate(at);

    this.props.status = VerificationRequestStatus.create('APPROVED');

    this.props.reviewedAt = timestamp;

    this.props.reviewedByPublicId = reviewedByPublicId;

    delete this.props.rejectionReason;

    this.touch(timestamp);
  }

  public reject(
    reviewedByPublicId: IdentityPublicId,
    rejectionReason: string,
    at: Date = new Date(),
  ): void {
    if (reviewedByPublicId === undefined) {
      throw new VerificationRequestInvalidStatusException(
        'A verification request reviewer is required for rejection.',
      );
    }

    this.ensureValidOperationDate(at);

    if (!this.props.status.canReject()) {
      throw new VerificationRequestInvalidStatusException(
        `Verification request ${this.publicId.value} cannot be rejected from status ${this.props.status.value}.`,
      );
    }

    const reason = VerificationRequestEntity.normalizeReason(rejectionReason);

    if (reason.length === 0) {
      throw new VerificationRequestInvalidStatusException(
        'A rejected verification request must have a rejection reason.',
      );
    }

    const timestamp = VerificationRequestEntity.cloneDate(at);

    this.props.status = VerificationRequestStatus.create('REJECTED');

    this.props.reviewedAt = timestamp;

    this.props.reviewedByPublicId = reviewedByPublicId;

    this.props.rejectionReason = reason;

    this.touch(timestamp);
  }

  public cancel(at: Date = new Date()): void {
    this.ensureValidOperationDate(at);

    if (!this.props.status.canCancel()) {
      throw new VerificationRequestInvalidStatusException(
        `Verification request ${this.publicId.value} cannot be cancelled from status ${this.props.status.value}.`,
      );
    }

    const timestamp = VerificationRequestEntity.cloneDate(at);

    this.props.status = VerificationRequestStatus.create('CANCELLED');

    delete this.props.reviewedAt;
    delete this.props.reviewedByPublicId;
    delete this.props.rejectionReason;

    this.touch(timestamp);
  }

  public get createdAt(): Date {
    return VerificationRequestEntity.cloneDate(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return VerificationRequestEntity.cloneDate(this.props.updatedAt);
  }

  public setUpdatedAt(updatedAt: Date): void {
    VerificationRequestEntity.ensureValidDate(
      updatedAt,
      'A verification request must have a valid updatedAt timestamp.',
    );

    if (updatedAt.getTime() < this.props.createdAt.getTime()) {
      throw new VerificationRequestInvalidStatusException(
        'Verification request updatedAt cannot occur before createdAt.',
      );
    }

    this.props.updatedAt = VerificationRequestEntity.cloneDate(updatedAt);
  }

  public override touch(at: Date = new Date()): void {
    VerificationRequestEntity.ensureValidDate(
      at,
      'A verification request audit timestamp must be valid.',
    );

    if (at.getTime() < this.props.createdAt.getTime()) {
      throw new VerificationRequestInvalidStatusException(
        'Verification request audit timestamp cannot occur before createdAt.',
      );
    }

    this.props.updatedAt = VerificationRequestEntity.cloneDate(at);
  }

  public override equals(other?: VerificationRequestEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }

  private static validateState(
    props: VerificationRequestValidationProps,
  ): void {
    const {
      verificationPublicId,
      type,
      assetPublicId,
      status,
      submittedAt,
      reviewedAt,
      reviewedByPublicId,
      rejectionReason,
      createdAt,
      updatedAt,
    } = props;

    if (verificationPublicId === undefined) {
      throw new VerificationRequestInvalidStatusException(
        'Verification request parent verification public ID is required.',
      );
    }

    if (type === undefined) {
      throw new VerificationRequestInvalidStatusException(
        'Verification request type is required.',
      );
    }

    if (assetPublicId === undefined) {
      throw new VerificationRequestInvalidStatusException(
        'Verification request asset public ID is required.',
      );
    }

    if (status === undefined) {
      throw new VerificationRequestInvalidStatusException(
        'Verification request status is required.',
      );
    }

    VerificationRequestEntity.ensureValidDate(
      submittedAt,
      'A verification request must have a valid submittedAt timestamp.',
    );

    VerificationRequestEntity.ensureValidDate(
      createdAt,
      'A verification request must have a valid createdAt timestamp.',
    );

    VerificationRequestEntity.ensureValidDate(
      updatedAt,
      'A verification request must have a valid updatedAt timestamp.',
    );

    if (reviewedAt !== undefined) {
      VerificationRequestEntity.ensureValidDate(
        reviewedAt,
        'A verification request must have a valid reviewedAt timestamp.',
      );
    }

    if (createdAt.getTime() < submittedAt.getTime()) {
      throw new VerificationRequestInvalidStatusException(
        'Verification request creation cannot occur before submission.',
      );
    }

    if (updatedAt.getTime() < createdAt.getTime()) {
      throw new VerificationRequestInvalidStatusException(
        'Verification request update cannot occur before creation.',
      );
    }

    if (
      reviewedAt !== undefined &&
      reviewedAt.getTime() < submittedAt.getTime()
    ) {
      throw new VerificationRequestInvalidStatusException(
        'Verification request review cannot occur before submission.',
      );
    }

    if (status.isPending()) {
      if (reviewedAt !== undefined) {
        throw new VerificationRequestInvalidStatusException(
          'A PENDING verification request cannot have a reviewedAt timestamp.',
        );
      }

      if (reviewedByPublicId !== undefined) {
        throw new VerificationRequestInvalidStatusException(
          'A PENDING verification request cannot have a reviewer.',
        );
      }

      if (rejectionReason !== undefined) {
        throw new VerificationRequestInvalidStatusException(
          'A PENDING verification request cannot have a rejection reason.',
        );
      }

      return;
    }

    if (status.isApproved()) {
      if (reviewedAt === undefined) {
        throw new VerificationRequestInvalidStatusException(
          'An APPROVED verification request must have a reviewedAt timestamp.',
        );
      }

      if (reviewedByPublicId === undefined) {
        throw new VerificationRequestInvalidStatusException(
          'An APPROVED verification request must have a reviewer.',
        );
      }

      if (rejectionReason !== undefined) {
        throw new VerificationRequestInvalidStatusException(
          'An APPROVED verification request cannot have a rejection reason.',
        );
      }

      return;
    }

    if (status.isRejected()) {
      if (reviewedAt === undefined) {
        throw new VerificationRequestInvalidStatusException(
          'A REJECTED verification request must have a reviewedAt timestamp.',
        );
      }

      if (reviewedByPublicId === undefined) {
        throw new VerificationRequestInvalidStatusException(
          'A REJECTED verification request must have a reviewer.',
        );
      }

      if (
        rejectionReason === undefined ||
        rejectionReason.trim().length === 0
      ) {
        throw new VerificationRequestInvalidStatusException(
          'A REJECTED verification request must have a rejection reason.',
        );
      }

      return;
    }

    if (status.isCancelled()) {
      if (reviewedAt !== undefined) {
        throw new VerificationRequestInvalidStatusException(
          'A CANCELLED verification request cannot have a reviewedAt timestamp.',
        );
      }

      if (reviewedByPublicId !== undefined) {
        throw new VerificationRequestInvalidStatusException(
          'A CANCELLED verification request cannot have a reviewer.',
        );
      }

      if (rejectionReason !== undefined) {
        throw new VerificationRequestInvalidStatusException(
          'A CANCELLED verification request cannot have a rejection reason.',
        );
      }

      return;
    }

    throw new VerificationRequestInvalidStatusException(
      `Verification request ${status.value} is not a supported lifecycle status.`,
    );
  }

  private ensureValidOperationDate(at: Date): void {
    VerificationRequestEntity.ensureValidDate(
      at,
      'A verification request operation must have a valid timestamp.',
    );

    if (at.getTime() < this.props.submittedAt.getTime()) {
      throw new VerificationRequestInvalidStatusException(
        'Verification request operations cannot occur before submission.',
      );
    }
  }

  private static ensureValidDate(date: Date, message: string): void {
    if (!(date instanceof Date) || !Number.isFinite(date.getTime())) {
      throw new VerificationRequestInvalidStatusException(message);
    }
  }

  private static normalizeReason(reason: string): string {
    if (typeof reason !== 'string') {
      return '';
    }

    return reason.trim();
  }

  private static cloneDate(date: Date): Date {
    return new Date(date.getTime());
  }

  private static cloneMetadata(
    metadata: Record<string, unknown>,
  ): Record<string, unknown> {
    return { ...metadata };
  }
}
