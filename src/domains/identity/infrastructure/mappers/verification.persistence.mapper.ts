// src/domains/identity/infrastructure/persistence/mappers/verification.persistence.mapper.ts

import type { Prisma } from '@prisma/client';
import {
  type Verification as PrismaVerification,
  type VerificationRequest as PrismaVerificationRequest,
  type VerificationLevel as PrismaVerificationLevel,
  type VerificationStatus as PrismaVerificationStatus,
  type VerificationRequestStatus as PrismaVerificationRequestStatus,
  type VerificationRequestType as PrismaVerificationRequestType,
} from '@prisma/client';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { VerificationAggregate } from '../../domain/aggregates/verification.aggregate';
import { VerificationRequestEntity } from '../../domain/entities/verification-request.entity';

import { IdentityId } from '../../domain/value-objects/identity-id.vo';
import { VerificationId } from '../../domain/value-objects/verification-id.vo';
import { VerificationRequestId } from '../../domain/value-objects/verification-request-id.vo';

import type { VerificationLevel } from '../../domain/enums/verification-level.enum';
import type { VerificationStatus } from '../../domain/enums/verification-status.enum';
import type { VerificationRequestStatus } from '../../domain/enums/verification-request-status.enum';
import type { VerificationRequestType } from '../../domain/enums/verification-request-type.enum';
import { AssetId } from 'src/domains/assets/domain/value-objects';

export class VerificationPersistenceMapper {
  static toDomain(
    verification: PrismaVerification & {
      requests: PrismaVerificationRequest[];
    },
  ): VerificationAggregate {
    return new VerificationAggregate(
      {
        identityId: new IdentityId(verification.identityId),

        status: verification.status as VerificationStatus,
        level: verification.level as VerificationLevel,

        profilePhotoVerified: verification.profilePhotoVerified,
        governmentIdVerified: verification.governmentIdVerified,
        driverLicenseVerified: verification.driverLicenseVerified,

        requests: verification.requests.map((request) =>
          this.requestToEntity(request),
        ),

        createdAt: verification.createdAt,
        updatedAt: verification.updatedAt,

        ...(verification.verifiedAt !== null && {
          verifiedAt: verification.verifiedAt,
        }),

        ...(verification.expiresAt !== null && {
          expiresAt: verification.expiresAt,
        }),

        ...(verification.reviewedById !== null && {
          reviewedById: new IdentityId(verification.reviewedById),
        }),

        ...(verification.rejectionReason !== null && {
          rejectionReason: verification.rejectionReason,
        }),

        ...(verification.lastReviewedAt !== null && {
          lastReviewedAt: verification.lastReviewedAt,
        }),
      },
      new UniqueEntityId(verification.id),
      new VerificationId(verification.publicId),
    );
  }

  static requestToEntity(
    request: PrismaVerificationRequest,
  ): VerificationRequestEntity {
    return new VerificationRequestEntity(
      {
        verificationId: new VerificationId(request.verificationId),

        type: request.type as VerificationRequestType,
        status: request.status as VerificationRequestStatus,

        assetId: new AssetId(request.assetId),

        submittedAt: request.submittedAt,

        createdAt: request.createdAt,
        updatedAt: request.updatedAt,

        ...(request.reviewedAt !== null && {
          reviewedAt: request.reviewedAt,
        }),

        ...(request.reviewedById !== null && {
          reviewedById: new IdentityId(request.reviewedById),
        }),

        ...(request.rejectionReason !== null && {
          rejectionReason: request.rejectionReason,
        }),

        ...(request.metadata !== null && {
          metadata: request.metadata as Readonly<Record<string, unknown>>,
        }),
      },
      new UniqueEntityId(request.id),
      new VerificationRequestId(request.publicId),
    );
  }

  static toPersistence(verification: VerificationAggregate) {
    return {
      id: verification.id.value,
      publicId: verification.publicId.value,

      identityId: verification.identityId.value,

      status: verification.status as PrismaVerificationStatus,

      level: verification.level as PrismaVerificationLevel,

      profilePhotoVerified: verification.profilePhotoVerified,

      governmentIdVerified: verification.governmentIdVerified,

      driverLicenseVerified: verification.driverLicenseVerified,

      verifiedAt: verification.verifiedAt ?? null,
      expiresAt: verification.expiresAt ?? null,

      reviewedById: verification.reviewedById?.value ?? null,

      rejectionReason: verification.rejectionReason ?? null,

      lastReviewedAt: verification.lastReviewedAt ?? null,

      createdAt: verification.createdAt,
      updatedAt: verification.updatedAt,
    };
  }

  static requestToPersistence(request: VerificationRequestEntity) {
    return {
      id: request.id.value,
      publicId: request.publicId.value,

      verificationId: request.verificationId.value,

      type: request.type as PrismaVerificationRequestType,

      status: request.status as PrismaVerificationRequestStatus,

      assetId: request.assetId.value,

      submittedAt: request.submittedAt,

      reviewedAt: request.reviewedAt ?? null,

      reviewedById: request.reviewedById?.value ?? null,

      rejectionReason: request.rejectionReason ?? null,

      createdAt: request.createdAt,
      updatedAt: request.updatedAt,

      ...(request.metadata !== undefined && {
        metadata: request.metadata as Prisma.InputJsonValue,
      }),
    };
  }
}
