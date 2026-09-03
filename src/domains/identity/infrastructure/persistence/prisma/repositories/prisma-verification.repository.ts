// -----------------------------------------------------------------------------
// Prisma Verification Repository
// -----------------------------------------------------------------------------
//
// Infrastructure repository for the Verification aggregate.
//
// Aggregate boundary:
//
// VerificationAggregate
// ├── VerificationEntity
// └── VerificationRequestEntity[]
//
// Persistence:
//
// Verification
// └── VerificationRequest
//
// Ownership:
//
// - Verification is the aggregate root.
// - VerificationRequest is an aggregate-owned child entity.
// - VerificationRequest is never persisted through an independent repository.
//
// IMPORTANT:
//
// VerificationRequest does NOT expire.
//
// VerificationRequest lifecycle:
//
// PENDING
// APPROVED
// REJECTED
// CANCELLED
//
// There is intentionally no request-level:
//
// - expiresAt;
// - expiration query;
// - expiration transition;
// - expiration persistence.
//
// Verification-level expiration, if present, belongs exclusively to the
// Verification aggregate and must not be confused with request expiration.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Verification aggregate persistence and rehydration
// - Verification root queries
// - Verification lifecycle queries
// - Verification level queries
// - Verification identity queries
// - Verification request queries
// - Verification request asset queries
// - Aggregate-owned request synchronization
// - Existence queries
//
// The repository does NOT:
//
// - persist Identity;
// - persist Asset;
// - persist Role;
// - resolve external domain concepts;
// - emit domain events;
// - contain domain business rules.
//
// -----------------------------------------------------------------------------
//
// Public identity vs persistence identity:
//
// Domain:
//
// - VerificationPublicId
// - IdentityPublicId
// - VerificationRequestAssetPublicId
//
// Prisma:
//
// - Verification.id
// - Verification.identityId
// - Verification.reviewedById
// - VerificationRequest.id
// - VerificationRequest.verificationId
// - VerificationRequest.assetId
// - VerificationRequest.reviewedById
//
// Public references are resolved to internal persistence identifiers only
// inside this infrastructure repository.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import { $Enums, Prisma } from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PrismaService } from '../../../../../../infrastructure/database/prisma/prisma.service';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { VerificationAggregate } from '../../../../domain/aggregates/verification.aggregate';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { VerificationRepository } from '../../../../domain/repositories/verification.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { IdentityPublicId } from '../../../../domain/value-objects/identity-public-id.vo';

import type { VerificationLevel } from '../../../../domain/value-objects/verification-level.vo';

import type { VerificationPublicId } from '../../../../domain/value-objects/verification-public-id.vo';

import type { VerificationRequestAssetPublicId } from '../../../../domain/value-objects/verification-request-asset-public-id.vo';

import type { VerificationRequestStatus } from '../../../../domain/value-objects/verification-request-status.vo';

import type { VerificationRequestType } from '../../../../domain/value-objects/verification-request-type.vo';

import type { VerificationStatus } from '../../../../domain/value-objects/verification-status.vo';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { VerificationInvariantException } from '../../../../domain/exceptions/verification-invariant.exception';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import { VerificationPrismaMapper } from '../../../persistence/prisma/mappers/verification-prisma.mapper';

// =============================================================================
// Prisma Include Graph
// =============================================================================

const verificationAggregateInclude = {
  identity: {
    select: {
      id: true,
      publicId: true,
    },
  },

  reviewedBy: {
    select: {
      id: true,
      publicId: true,
    },
  },

  requests: {
    include: {
      verification: {
        select: {
          id: true,
          publicId: true,
        },
      },

      asset: {
        select: {
          id: true,
          publicId: true,
        },
      },

      reviewedBy: {
        select: {
          id: true,
          publicId: true,
        },
      },
    },

    orderBy: {
      createdAt: 'asc',
    },
  },
} satisfies Prisma.VerificationInclude;

// =============================================================================
// Prisma Aggregate Payload
// =============================================================================

type VerificationAggregateRecord = Prisma.VerificationGetPayload<{
  include: typeof verificationAggregateInclude;
}>;

// =============================================================================
// Prisma Request Persistence Type
// =============================================================================

type VerificationRequestPersistence = ReturnType<
  typeof VerificationPrismaMapper.requestToPersistence
>;

// =============================================================================
// Repository
// =============================================================================

@Injectable()
export class PrismaVerificationRepository implements VerificationRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Prisma Enum Boundary
  // ===========================================================================

  private toPrismaVerificationStatus(value: string): $Enums.VerificationStatus {
    switch (value) {
      case 'PENDING':
        return $Enums.VerificationStatus.PENDING;

      case 'VERIFIED':
        return $Enums.VerificationStatus.VERIFIED;

      case 'REJECTED':
        return $Enums.VerificationStatus.REJECTED;

      case 'EXPIRED':
        return $Enums.VerificationStatus.EXPIRED;

      case 'REVOKED':
        return $Enums.VerificationStatus.REVOKED;

      default:
        throw new VerificationInvariantException(
          `Unsupported VerificationStatus "${String(value)}" supplied to Prisma repository.`,
        );
    }
  }

  private toPrismaVerificationLevel(value: string): $Enums.VerificationLevel {
    switch (value) {
      case 'NONE':
        return $Enums.VerificationLevel.NONE;

      case 'MEMBER':
        return $Enums.VerificationLevel.MEMBER;

      case 'DRIVER':
        return $Enums.VerificationLevel.DRIVER;

      default:
        throw new VerificationInvariantException(
          `Unsupported VerificationLevel "${String(value)}" supplied to Prisma repository.`,
        );
    }
  }

  private toPrismaVerificationRequestType(
    value: string,
  ): $Enums.VerificationRequestType {
    switch (value) {
      case 'PROFILE_PHOTO':
        return $Enums.VerificationRequestType.PROFILE_PHOTO;

      case 'GOVERNMENT_ID':
        return $Enums.VerificationRequestType.GOVERNMENT_ID;

      case 'DRIVER_LICENSE':
        return $Enums.VerificationRequestType.DRIVER_LICENSE;

      default:
        throw new VerificationInvariantException(
          `Unsupported VerificationRequestType "${String(value)}" supplied to Prisma repository.`,
        );
    }
  }

  private toPrismaVerificationRequestStatus(
    value: string,
  ): $Enums.VerificationRequestStatus {
    switch (value) {
      case 'PENDING':
        return $Enums.VerificationRequestStatus.PENDING;

      case 'APPROVED':
        return $Enums.VerificationRequestStatus.APPROVED;

      case 'REJECTED':
        return $Enums.VerificationRequestStatus.REJECTED;

      case 'CANCELLED':
        return $Enums.VerificationRequestStatus.CANCELLED;

      default:
        throw new VerificationInvariantException(
          `Unsupported VerificationRequestStatus "${String(value)}" supplied to Prisma repository.`,
        );
    }
  }

  // ===========================================================================
  // Create
  // ===========================================================================

  public async create(aggregate: VerificationAggregate): Promise<void> {
    this.assertAggregate(aggregate);

    const persistence = VerificationPrismaMapper.toPersistence(aggregate);

    await this.prisma.$transaction(async (tx) => {
      // -----------------------------------------------------------------------
      // Verification.identityId is a required Prisma foreign key.
      //
      // The domain carries IdentityPublicId.
      // Prisma Verification.identityId references Identity.id.
      //
      // Resolve the public identity to the internal persistence identity
      // before writing the Verification row.
      // -----------------------------------------------------------------------

      const identityId = await this.resolveOwningIdentityId(
        tx,
        persistence.verification.publicId,
        persistence.verification.identityPublicId,
      );

      // -----------------------------------------------------------------------
      // Verification.reviewedById is optional.
      // -----------------------------------------------------------------------

      const reviewedById = await this.resolveOptionalIdentityId(
        tx,
        'Verification',
        persistence.verification.publicId,
        persistence.verification.reviewedByPublicId,
      );

      const verification = await tx.verification.create({
        data: {
          id: persistence.verification.id,

          publicId: persistence.verification.publicId,

          identityId,

          status: this.toPrismaVerificationStatus(
            persistence.verification.status,
          ),

          level: this.toPrismaVerificationLevel(persistence.verification.level),

          profilePhotoVerified: persistence.verification.profilePhotoVerified,

          governmentIdVerified: persistence.verification.governmentIdVerified,

          driverLicenseVerified: persistence.verification.driverLicenseVerified,

          verifiedAt: persistence.verification.verifiedAt,

          expiresAt: persistence.verification.expiresAt,

          memberVerifiedAt: persistence.verification.memberVerifiedAt,

          driverVerifiedAt: persistence.verification.driverVerifiedAt,

          profilePhotoVerifiedAt:
            persistence.verification.profilePhotoVerifiedAt,

          governmentIdVerifiedAt:
            persistence.verification.governmentIdVerifiedAt,

          driverLicenseVerifiedAt:
            persistence.verification.driverLicenseVerifiedAt,

          reviewedById,

          rejectionReason: persistence.verification.rejectionReason,

          lastReviewedAt: persistence.verification.lastReviewedAt,

          createdAt: persistence.verification.createdAt,

          updatedAt: persistence.verification.updatedAt,
        },

        select: {
          id: true,
          publicId: true,
        },
      });

      // -----------------------------------------------------------------------
      // Persist aggregate-owned VerificationRequest children.
      // -----------------------------------------------------------------------

      for (const request of persistence.requests) {
        await this.createVerificationRequest(
          tx,
          verification.id,
          verification.publicId,
          request,
        );
      }
    });
  }

  // ===========================================================================
  // Save
  // ===========================================================================

  public async save(aggregate: VerificationAggregate): Promise<void> {
    this.assertAggregate(aggregate);

    const persistence = VerificationPrismaMapper.toPersistence(aggregate);

    await this.prisma.$transaction(async (tx) => {
      const verification = await tx.verification.findUnique({
        where: {
          id: persistence.verification.id,
        },

        select: {
          id: true,
          publicId: true,
        },
      });

      if (verification === null) {
        throw new VerificationInvariantException(
          `Cannot save Verification "${persistence.verification.publicId}": aggregate root "${persistence.verification.id}" was not found.`,
        );
      }

      if (verification.publicId !== persistence.verification.publicId) {
        throw new VerificationInvariantException(
          `Cannot save Verification "${persistence.verification.publicId}": persistence identity "${persistence.verification.id}" belongs to public Verification "${verification.publicId}".`,
        );
      }

      // -----------------------------------------------------------------------
      // Verification.identityId is required.
      // -----------------------------------------------------------------------

      const identityId = await this.resolveOwningIdentityId(
        tx,
        persistence.verification.publicId,
        persistence.verification.identityPublicId,
      );

      // -----------------------------------------------------------------------
      // Verification.reviewedById is optional.
      // -----------------------------------------------------------------------

      const reviewedById = await this.resolveOptionalIdentityId(
        tx,
        'Verification',
        persistence.verification.publicId,
        persistence.verification.reviewedByPublicId,
      );

      await tx.verification.update({
        where: {
          id: verification.id,
        },

        data: {
          publicId: persistence.verification.publicId,

          identityId,

          status: this.toPrismaVerificationStatus(
            persistence.verification.status,
          ),

          level: this.toPrismaVerificationLevel(persistence.verification.level),

          profilePhotoVerified: persistence.verification.profilePhotoVerified,

          governmentIdVerified: persistence.verification.governmentIdVerified,

          driverLicenseVerified: persistence.verification.driverLicenseVerified,

          verifiedAt: persistence.verification.verifiedAt,

          expiresAt: persistence.verification.expiresAt,

          memberVerifiedAt: persistence.verification.memberVerifiedAt,

          driverVerifiedAt: persistence.verification.driverVerifiedAt,

          profilePhotoVerifiedAt:
            persistence.verification.profilePhotoVerifiedAt,

          governmentIdVerifiedAt:
            persistence.verification.governmentIdVerifiedAt,

          driverLicenseVerifiedAt:
            persistence.verification.driverLicenseVerifiedAt,

          reviewedById,

          rejectionReason: persistence.verification.rejectionReason,

          lastReviewedAt: persistence.verification.lastReviewedAt,

          updatedAt: persistence.verification.updatedAt,
        },
      });

      // -----------------------------------------------------------------------
      // Reconcile aggregate-owned VerificationRequest children.
      // -----------------------------------------------------------------------

      const persistedRequestIds = persistence.requests.map(
        (request) => request.id,
      );

      if (persistedRequestIds.length === 0) {
        await tx.verificationRequest.deleteMany({
          where: {
            verificationId: verification.id,
          },
        });
      } else {
        await tx.verificationRequest.deleteMany({
          where: {
            verificationId: verification.id,

            id: {
              notIn: persistedRequestIds,
            },
          },
        });
      }

      // -----------------------------------------------------------------------
      // Persist current aggregate-owned requests.
      // -----------------------------------------------------------------------

      for (const request of persistence.requests) {
        await this.upsertVerificationRequest(
          tx,
          verification.id,
          verification.publicId,
          request,
        );
      }
    });
  }

  // ===========================================================================
  // Aggregate Lookup
  // ===========================================================================

  public async findById(id: string): Promise<VerificationAggregate | null> {
    if (typeof id !== 'string' || id.trim().length === 0) {
      throw new VerificationInvariantException(
        'Verification internal ID is required.',
      );
    }

    const record = await this.prisma.verification.findUnique({
      where: {
        id,
      },

      include: verificationAggregateInclude,
    });

    return record === null ? null : this.toAggregate(record);
  }

  public async findByPublicId(
    publicId: VerificationPublicId,
  ): Promise<VerificationAggregate | null> {
    this.assertVerificationPublicId(publicId);

    const record = await this.prisma.verification.findUnique({
      where: {
        publicId: publicId.value,
      },

      include: verificationAggregateInclude,
    });

    return record === null ? null : this.toAggregate(record);
  }

  // ===========================================================================
  // Identity Queries
  // ===========================================================================

  public async findByIdentityPublicId(
    identityPublicId: IdentityPublicId,
  ): Promise<VerificationAggregate | null> {
    this.assertIdentityPublicId(identityPublicId);

    const identity = await this.findIdentityPersistenceReference(
      identityPublicId.value,
    );

    if (identity === null) {
      return null;
    }

    const record = await this.prisma.verification.findUnique({
      where: {
        identityId: identity.id,
      },

      include: verificationAggregateInclude,
    });

    return record === null ? null : this.toAggregate(record);
  }

  public async existsByIdentityPublicId(
    identityPublicId: IdentityPublicId,
  ): Promise<boolean> {
    this.assertIdentityPublicId(identityPublicId);

    const identity = await this.findIdentityPersistenceReference(
      identityPublicId.value,
    );

    if (identity === null) {
      return false;
    }

    const count = await this.prisma.verification.count({
      where: {
        identityId: identity.id,
      },
    });

    return count > 0;
  }

  public async existsByIdentity(
    identityPublicId: IdentityPublicId,
  ): Promise<boolean> {
    return this.existsByIdentityPublicId(identityPublicId);
  }

  // ===========================================================================
  // Verification Lifecycle Queries
  // ===========================================================================

  public async findByStatus(
    status: VerificationStatus,
  ): Promise<VerificationAggregate[]> {
    this.assertVerificationStatus(status);

    return this.findByStatusValue(
      this.toPrismaVerificationStatus(status.value),
    );
  }

  public async findPending(): Promise<VerificationAggregate[]> {
    return this.findByStatusValue($Enums.VerificationStatus.PENDING);
  }

  public async findVerified(): Promise<VerificationAggregate[]> {
    return this.findByStatusValue($Enums.VerificationStatus.VERIFIED);
  }

  public async findRejected(): Promise<VerificationAggregate[]> {
    return this.findByStatusValue($Enums.VerificationStatus.REJECTED);
  }

  public async findExpired(): Promise<VerificationAggregate[]> {
    return this.findByStatusValue($Enums.VerificationStatus.EXPIRED);
  }

  public async findRevoked(): Promise<VerificationAggregate[]> {
    return this.findByStatusValue($Enums.VerificationStatus.REVOKED);
  }

  // ===========================================================================
  // Verification Level Queries
  // ===========================================================================

  public async findByLevel(
    level: VerificationLevel,
  ): Promise<VerificationAggregate[]> {
    this.assertVerificationLevel(level);

    const records = await this.prisma.verification.findMany({
      where: {
        level: this.toPrismaVerificationLevel(level.value),
      },

      include: verificationAggregateInclude,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Verification Request Queries
  // ===========================================================================

  public async findByRequestStatus(
    status: VerificationRequestStatus,
  ): Promise<VerificationAggregate[]> {
    this.assertVerificationRequestStatus(status);

    const records = await this.prisma.verification.findMany({
      where: {
        requests: {
          some: {
            status: this.toPrismaVerificationRequestStatus(status.value),
          },
        },
      },

      include: verificationAggregateInclude,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  public async findWithPendingRequests(): Promise<VerificationAggregate[]> {
    return this.findByRequestStatusValue(
      $Enums.VerificationRequestStatus.PENDING,
    );
  }

  public async findByRequestType(
    type: VerificationRequestType,
  ): Promise<VerificationAggregate[]> {
    this.assertVerificationRequestType(type);

    const records = await this.prisma.verification.findMany({
      where: {
        requests: {
          some: {
            type: this.toPrismaVerificationRequestType(type.value),
          },
        },
      },

      include: verificationAggregateInclude,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Verification Request Asset Queries
  // ===========================================================================

  public async findByRequestAssetPublicId(
    assetPublicId: VerificationRequestAssetPublicId,
  ): Promise<VerificationAggregate | null> {
    this.assertVerificationRequestAssetPublicId(assetPublicId);

    const record = await this.prisma.verification.findFirst({
      where: {
        requests: {
          some: {
            asset: {
              publicId: assetPublicId.value,
            },
          },
        },
      },

      include: verificationAggregateInclude,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return record === null ? null : this.toAggregate(record);
  }

  public async existsByRequestAssetPublicId(
    assetPublicId: VerificationRequestAssetPublicId,
  ): Promise<boolean> {
    this.assertVerificationRequestAssetPublicId(assetPublicId);

    const count = await this.prisma.verificationRequest.count({
      where: {
        asset: {
          publicId: assetPublicId.value,
        },
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Existence
  // ===========================================================================

  public async existsByPublicId(
    publicId: VerificationPublicId,
  ): Promise<boolean> {
    this.assertVerificationPublicId(publicId);

    const count = await this.prisma.verification.count({
      where: {
        publicId: publicId.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Delete
  // ===========================================================================

  public async delete(aggregate: VerificationAggregate): Promise<void> {
    this.assertAggregate(aggregate);

    const verificationId = aggregate.id.value;

    await this.prisma.$transaction(async (tx) => {
      await tx.verificationRequest.deleteMany({
        where: {
          verificationId,
        },
      });

      await tx.verification.delete({
        where: {
          id: verificationId,
        },
      });
    });
  }

  // ===========================================================================
  // Aggregate-Owned Request Persistence
  // ===========================================================================

  private async createVerificationRequest(
    tx: Prisma.TransactionClient,
    verificationId: string,
    aggregateVerificationPublicId: string,
    request: VerificationRequestPersistence,
  ): Promise<void> {
    this.assertOwningVerification(
      request.publicId,
      aggregateVerificationPublicId,
      request.verificationPublicId,
    );

    const assetId = await this.resolveAssetId(
      tx,
      request.publicId,
      request.assetPublicId,
    );

    const reviewedById = await this.resolveOptionalIdentityId(
      tx,
      'VerificationRequest',
      request.publicId,
      request.reviewedByPublicId,
    );

    await tx.verificationRequest.create({
      data: {
        id: request.id,

        publicId: request.publicId,

        verificationId,

        type: this.toPrismaVerificationRequestType(request.type),

        status: this.toPrismaVerificationRequestStatus(request.status),

        assetId,

        submittedAt: request.submittedAt,

        reviewedAt: request.reviewedAt,

        reviewedById,

        rejectionReason: request.rejectionReason,

        metadata: this.toPrismaMetadata(request.metadata),

        createdAt: request.createdAt,

        updatedAt: request.updatedAt,
      },
    });
  }

  private async upsertVerificationRequest(
    tx: Prisma.TransactionClient,
    verificationId: string,
    aggregateVerificationPublicId: string,
    request: VerificationRequestPersistence,
  ): Promise<void> {
    this.assertOwningVerification(
      request.publicId,
      aggregateVerificationPublicId,
      request.verificationPublicId,
    );

    const existing = await tx.verificationRequest.findUnique({
      where: {
        id: request.id,
      },

      select: {
        id: true,
        publicId: true,
        verificationId: true,
      },
    });

    if (existing !== null && existing.verificationId !== verificationId) {
      throw new VerificationInvariantException(
        `Verification request "${request.publicId}" belongs to a different Verification aggregate.`,
      );
    }

    const assetId = await this.resolveAssetId(
      tx,
      request.publicId,
      request.assetPublicId,
    );

    const reviewedById = await this.resolveOptionalIdentityId(
      tx,
      'VerificationRequest',
      request.publicId,
      request.reviewedByPublicId,
    );

    await tx.verificationRequest.upsert({
      where: {
        id: request.id,
      },

      create: {
        id: request.id,

        publicId: request.publicId,

        verificationId,

        type: this.toPrismaVerificationRequestType(request.type),

        status: this.toPrismaVerificationRequestStatus(request.status),

        assetId,

        submittedAt: request.submittedAt,

        reviewedAt: request.reviewedAt,

        reviewedById,

        rejectionReason: request.rejectionReason,

        metadata: this.toPrismaMetadata(request.metadata),

        createdAt: request.createdAt,

        updatedAt: request.updatedAt,
      },

      update: {
        publicId: request.publicId,

        verificationId,

        type: this.toPrismaVerificationRequestType(request.type),

        status: this.toPrismaVerificationRequestStatus(request.status),

        assetId,

        submittedAt: request.submittedAt,

        reviewedAt: request.reviewedAt,

        reviewedById,

        rejectionReason: request.rejectionReason,

        metadata: this.toPrismaMetadata(request.metadata),

        updatedAt: request.updatedAt,
      },
    });
  }

  // ===========================================================================
  // Aggregate Reconstruction
  // ===========================================================================

  private toAggregate(
    record: VerificationAggregateRecord,
  ): VerificationAggregate {
    return VerificationPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Prisma Status Queries
  // ===========================================================================

  private async findByStatusValue(
    status: $Enums.VerificationStatus,
  ): Promise<VerificationAggregate[]> {
    const records = await this.prisma.verification.findMany({
      where: {
        status,
      },

      include: verificationAggregateInclude,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  private async findByRequestStatusValue(
    status: $Enums.VerificationRequestStatus,
  ): Promise<VerificationAggregate[]> {
    const records = await this.prisma.verification.findMany({
      where: {
        requests: {
          some: {
            status,
          },
        },
      },

      include: verificationAggregateInclude,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Identity Resolution
  // ===========================================================================

  /**
   * Resolves the required owning Identity public ID into its Prisma internal
   * persistence ID.
   *
   * Verification.identityId is required by the frozen Prisma schema:
   *
   *     identityId String @unique
   *
   * The domain carries IdentityPublicId, not Identity.id.
   *
   * Therefore this method intentionally returns Promise<string>, never
   * Promise<string | null>.
   */
  private async resolveOwningIdentityId(
    tx: Prisma.TransactionClient,
    verificationPublicId: string,
    identityPublicId: string,
  ): Promise<string> {
    const identity = await tx.identity.findUnique({
      where: {
        publicId: identityPublicId,
      },

      select: {
        id: true,
      },
    });

    if (identity === null) {
      throw new VerificationInvariantException(
        `Cannot persist Verification "${verificationPublicId}": owning Identity "${identityPublicId}" was not found.`,
      );
    }

    return identity.id;
  }

  /**
   * Resolves an optional reviewer Identity public ID into its Prisma internal
   * persistence ID.
   *
   * Both Verification.reviewedById and VerificationRequest.reviewedById are
   * nullable in the frozen Prisma schema.
   *
   * Therefore this method intentionally returns Promise<string | null>.
   */
  private async resolveOptionalIdentityId(
    tx: Prisma.TransactionClient,
    ownerDescription: 'Verification' | 'VerificationRequest',
    ownerPublicId: string,
    identityPublicId: string | null,
  ): Promise<string | null> {
    if (identityPublicId === null) {
      return null;
    }

    const identity = await tx.identity.findUnique({
      where: {
        publicId: identityPublicId,
      },

      select: {
        id: true,
      },
    });

    if (identity === null) {
      throw new VerificationInvariantException(
        `Cannot persist ${ownerDescription} "${ownerPublicId}": reviewer Identity "${identityPublicId}" was not found.`,
      );
    }

    return identity.id;
  }

  /**
   * Resolves an Identity public ID into its Prisma persistence identity for
   * read-side queries.
   *
   * Identity remains a separate aggregate and is never rehydrated or
   * persisted through this repository.
   */
  private async findIdentityPersistenceReference(
    identityPublicId: string,
  ): Promise<{ id: string } | null> {
    return this.prisma.identity.findUnique({
      where: {
        publicId: identityPublicId,
      },

      select: {
        id: true,
      },
    });
  }

  // ===========================================================================
  // Asset Resolution
  // ===========================================================================

  private async resolveAssetId(
    tx: Prisma.TransactionClient,
    verificationRequestPublicId: string,
    assetPublicId: string,
  ): Promise<string> {
    const asset = await tx.asset.findUnique({
      where: {
        publicId: assetPublicId,
      },

      select: {
        id: true,
      },
    });

    if (asset === null) {
      throw new VerificationInvariantException(
        `Cannot persist VerificationRequest "${verificationRequestPublicId}": Asset "${assetPublicId}" was not found.`,
      );
    }

    return asset.id;
  }

  // ===========================================================================
  // Aggregate Ownership Guard
  // ===========================================================================

  private assertOwningVerification(
    requestPublicId: string,
    aggregateVerificationPublicId: string,
    requestVerificationPublicId: string,
  ): void {
    if (aggregateVerificationPublicId !== requestVerificationPublicId) {
      throw new VerificationInvariantException(
        `Cannot persist VerificationRequest "${requestPublicId}": request belongs to Verification "${requestVerificationPublicId}" but aggregate root is Verification "${aggregateVerificationPublicId}".`,
      );
    }
  }

  // ===========================================================================
  // JSON Boundary
  // ===========================================================================

  private toPrismaMetadata(
    metadata: Record<string, unknown> | null,
  ): Prisma.InputJsonValue | typeof Prisma.JsonNull {
    if (metadata === null) {
      return Prisma.JsonNull;
    }

    return JSON.parse(JSON.stringify(metadata)) as Prisma.InputJsonValue;
  }

  // ===========================================================================
  // Validation Guards
  // ===========================================================================

  private assertAggregate(aggregate: VerificationAggregate): void {
    if (aggregate === undefined || aggregate === null) {
      throw new VerificationInvariantException(
        'Verification aggregate is required.',
      );
    }
  }

  private assertVerificationPublicId(publicId: VerificationPublicId): void {
    if (publicId === undefined || publicId === null) {
      throw new VerificationInvariantException(
        'Verification public ID is required.',
      );
    }
  }

  private assertIdentityPublicId(publicId: IdentityPublicId): void {
    if (publicId === undefined || publicId === null) {
      throw new VerificationInvariantException(
        'Identity public ID is required.',
      );
    }
  }

  private assertVerificationStatus(status: VerificationStatus): void {
    if (status === undefined || status === null) {
      throw new VerificationInvariantException(
        'Verification status is required.',
      );
    }
  }

  private assertVerificationLevel(level: VerificationLevel): void {
    if (level === undefined || level === null) {
      throw new VerificationInvariantException(
        'Verification level is required.',
      );
    }
  }

  private assertVerificationRequestType(type: VerificationRequestType): void {
    if (type === undefined || type === null) {
      throw new VerificationInvariantException(
        'Verification request type is required.',
      );
    }
  }

  private assertVerificationRequestStatus(
    status: VerificationRequestStatus,
  ): void {
    if (status === undefined || status === null) {
      throw new VerificationInvariantException(
        'Verification request status is required.',
      );
    }
  }

  private assertVerificationRequestAssetPublicId(
    assetPublicId: VerificationRequestAssetPublicId,
  ): void {
    if (assetPublicId === undefined || assetPublicId === null) {
      throw new VerificationInvariantException(
        'Verification request asset public ID is required.',
      );
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default PrismaVerificationRepository;
