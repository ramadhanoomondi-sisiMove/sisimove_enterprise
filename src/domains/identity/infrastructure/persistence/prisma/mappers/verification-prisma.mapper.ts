// -----------------------------------------------------------------------------
// Identity — Verification Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the complete Verification aggregate:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity[]
//
// Persistence:
//
// Verification
// └── VerificationRequest[]
//
// VerificationRequestEntity is an owned child entity and is therefore
// rehydrated as part of the Verification aggregate.
//
// -----------------------------------------------------------------------------
//
// Persistence identity vs domain identity:
//
// Prisma uses internal persistence identifiers:
//
// - Verification.id
// - Verification.identityId
// - Verification.reviewedById
// - VerificationRequest.id
// - VerificationRequest.verificationId
// - VerificationRequest.assetId
// - VerificationRequest.reviewedById
//
// The domain uses public identifiers:
//
// - VerificationPublicId
// - IdentityPublicId
// - VerificationRequestPublicId
// - VerificationRequestAssetPublicId
//
// The mapper preserves this separation.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// VerificationRequestEntity is NOT an aggregate root.
//
// Therefore:
//
// VerificationAggregate
// └── owns VerificationRequestEntity[]
//
// Complete Verification rehydration MUST include the complete request
// collection.
//
// -----------------------------------------------------------------------------
//
// Cross-boundary references:
//
// Verification:
//
// - identityId   -> Identity.publicId
// - reviewedById -> Identity.publicId
//
// VerificationRequest:
//
// - verificationId -> Verification.publicId
// - assetId        -> Asset.publicId
// - reviewedById   -> Identity.publicId
//
// The domain never receives Prisma foreign keys as cross-aggregate references.
//
// -----------------------------------------------------------------------------
//
// The mapper does NOT:
//
// - access Prisma services;
// - resolve foreign keys;
// - load missing relations;
// - mutate aggregates;
// - emit domain events;
// - persist data;
// - perform external verification operations;
// - access Asset infrastructure.
//
// Those concerns belong to repositories/application/infrastructure
// boundaries.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type {
  Verification as PrismaVerification,
  VerificationRequest as PrismaVerificationRequest,
  Identity as PrismaIdentity,
  Asset as PrismaAsset,
  VerificationStatus as PrismaVerificationStatus,
  VerificationLevel as PrismaVerificationLevel,
  VerificationRequestType as PrismaVerificationRequestType,
  VerificationRequestStatus as PrismaVerificationRequestStatus,
} from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { VerificationAggregate } from '../../../../domain/aggregates/verification.aggregate';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import { VerificationEntity } from '../../../../domain/entities/verification.entity';

import { VerificationRequestEntity } from '../../../../domain/entities/verification-request.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  VerificationPublicId,
  VerificationStatus,
  VerificationLevel,
  VerificationRequestPublicId,
  VerificationRequestType,
  VerificationRequestStatus,
  VerificationRequestAssetPublicId,
  IdentityPublicId,
} from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Domain Value Types
// -----------------------------------------------------------------------------

import type { VerificationStatusValue } from '../../../../domain/value-objects/verification-status.vo';

import type { VerificationLevelValue } from '../../../../domain/value-objects/verification-level.vo';

import type { VerificationRequestTypeValue } from '../../../../domain/value-objects/verification-request-type.vo';

import type { VerificationRequestStatusValue } from '../../../../domain/value-objects/verification-request-status.vo';

// =============================================================================
// Prisma Relation Types
// =============================================================================

/**
 * Prisma Identity relation required when reconstructing a public Identity
 * reference from a Verification persistence record.
 */
export type VerificationIdentityReference = Pick<
  PrismaIdentity,
  'id' | 'publicId'
>;

/**
 * Prisma Identity relation required when reconstructing a reviewer public
 * reference.
 */
export type VerificationReviewerReference = Pick<
  PrismaIdentity,
  'id' | 'publicId'
>;

/**
 * Prisma Asset relation required when reconstructing a Verification Request
 * asset public reference.
 *
 * The Asset model must expose a publicId field.
 */
export type VerificationAssetReference = Pick<PrismaAsset, 'id' | 'publicId'>;

/**
 * Prisma Verification Request with all relations required by the domain.
 *
 * Required:
 *
 * - verification
 * - asset
 *
 * Optional:
 *
 * - reviewedBy
 */
export type VerificationRequestWithRelations = PrismaVerificationRequest & {
  verification: Pick<PrismaVerification, 'id' | 'publicId'> | null;

  asset: VerificationAssetReference | null;

  reviewedBy?: VerificationReviewerReference | null;
};

/**
 * Prisma Verification with all aggregate-owned requests and relations
 * required to reconstruct public domain references.
 *
 * Required:
 *
 * - identity
 * - requests
 *
 * Optional:
 *
 * - reviewedBy
 *
 * The request collection must be loaded for complete aggregate rehydration.
 */
export type VerificationWithRelations = PrismaVerification & {
  identity: VerificationIdentityReference | null;

  reviewedBy?: VerificationReviewerReference | null;

  requests?: VerificationRequestWithRelations[] | undefined;
};

// =============================================================================
// Persistence Types
// =============================================================================

export interface VerificationPersistence {
  verification: ReturnType<
    typeof VerificationPrismaMapper.verificationToPersistence
  >;

  requests: ReturnType<typeof VerificationPrismaMapper.requestToPersistence>[];
}

// =============================================================================
// Prisma → Domain Enum Conversion
// =============================================================================

/**
 * Converts persisted Prisma VerificationStatus into its domain value.
 */
function toVerificationStatus(
  value: PrismaVerificationStatus,
): VerificationStatusValue {
  switch (value) {
    case 'PENDING':
      return 'PENDING';

    case 'VERIFIED':
      return 'VERIFIED';

    case 'REJECTED':
      return 'REJECTED';

    case 'EXPIRED':
      return 'EXPIRED';

    case 'REVOKED':
      return 'REVOKED';

    default:
      throw new Error(
        `Invalid persisted Verification status "${String(value)}".`,
      );
  }
}

/**
 * Converts persisted Prisma VerificationLevel into its domain value.
 */
function toVerificationLevel(
  value: PrismaVerificationLevel,
): VerificationLevelValue {
  switch (value) {
    case 'NONE':
      return 'NONE';

    case 'MEMBER':
      return 'MEMBER';

    case 'DRIVER':
      return 'DRIVER';

    default:
      throw new Error(
        `Invalid persisted Verification level "${String(value)}".`,
      );
  }
}

/**
 * Converts persisted Prisma VerificationRequestType into its domain value.
 */
function toVerificationRequestType(
  value: PrismaVerificationRequestType,
): VerificationRequestTypeValue {
  switch (value) {
    case 'PROFILE_PHOTO':
      return 'PROFILE_PHOTO';

    case 'GOVERNMENT_ID':
      return 'GOVERNMENT_ID';

    case 'DRIVER_LICENSE':
      return 'DRIVER_LICENSE';

    default:
      throw new Error(
        `Invalid persisted Verification Request type "${String(value)}".`,
      );
  }
}

/**
 * Converts persisted Prisma VerificationRequestStatus into its domain value.
 */
function toVerificationRequestStatus(
  value: PrismaVerificationRequestStatus,
): VerificationRequestStatusValue {
  switch (value) {
    case 'PENDING':
      return 'PENDING';

    case 'APPROVED':
      return 'APPROVED';

    case 'REJECTED':
      return 'REJECTED';

    case 'CANCELLED':
      return 'CANCELLED';

    default:
      throw new Error(
        `Invalid persisted Verification Request status "${String(value)}".`,
      );
  }
}

// =============================================================================
// Mapper
// =============================================================================

export class VerificationPrismaMapper {
  // ===========================================================================
  // Aggregate → Domain
  // ===========================================================================

  /**
   * Rehydrates the complete Verification aggregate.
   *
   * Complete aggregate:
   *
   * VerificationAggregate
   * └── VerificationEntity
   *     └── VerificationRequestEntity[]
   *
   * The repository MUST load:
   *
   * - owning Identity relation;
   * - reviewer relation when present;
   * - complete VerificationRequest collection;
   * - each request's Asset relation;
   * - each request's reviewer relation when present.
   */
  public static toDomain(
    record: VerificationWithRelations,
  ): VerificationAggregate {
    // -------------------------------------------------------------------------
    // Required Identity relation
    // -------------------------------------------------------------------------

    if (record.identity === null || record.identity === undefined) {
      throw new Error(
        `Verification "${record.publicId}" cannot be rehydrated without its owning Identity relation.`,
      );
    }

    // -------------------------------------------------------------------------
    // Required request collection
    // -------------------------------------------------------------------------

    if (record.requests === undefined) {
      throw new Error(
        `Verification "${record.publicId}" cannot be rehydrated without its VerificationRequest collection.`,
      );
    }

    // -------------------------------------------------------------------------
    // Parent Verification public identity
    // -------------------------------------------------------------------------

    const verificationPublicId = new VerificationPublicId(record.publicId);

    // -------------------------------------------------------------------------
    // Owning Identity public identity
    // -------------------------------------------------------------------------

    const identityPublicId = new IdentityPublicId(record.identity.publicId);

    // -------------------------------------------------------------------------
    // Aggregate-level reviewer
    // -------------------------------------------------------------------------

    const reviewedByPublicId =
      record.reviewedBy !== null && record.reviewedBy !== undefined
        ? new IdentityPublicId(record.reviewedBy.publicId)
        : undefined;

    // -------------------------------------------------------------------------
    // Owned Verification Requests
    // -------------------------------------------------------------------------

    const requests = record.requests.map((request) =>
      this.requestToDomain(request),
    );

    // -------------------------------------------------------------------------
    // Verification Entity
    // -------------------------------------------------------------------------

    const verification = VerificationEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId: verificationPublicId,

        identityPublicId,

        // ---------------------------------------------------------------------
        // Verification State
        // ---------------------------------------------------------------------

        status: VerificationStatus.create(toVerificationStatus(record.status)),

        level: VerificationLevel.create(toVerificationLevel(record.level)),

        // ---------------------------------------------------------------------
        // Accepted Evidence
        // ---------------------------------------------------------------------

        profilePhotoVerified: record.profilePhotoVerified,

        governmentIdVerified: record.governmentIdVerified,

        driverLicenseVerified: record.driverLicenseVerified,

        // ---------------------------------------------------------------------
        // Verification Timestamps
        // ---------------------------------------------------------------------

        ...(record.verifiedAt !== null
          ? {
              verifiedAt: record.verifiedAt,
            }
          : {}),

        ...(record.expiresAt !== null
          ? {
              expiresAt: record.expiresAt,
            }
          : {}),

        ...(record.memberVerifiedAt !== null
          ? {
              memberVerifiedAt: record.memberVerifiedAt,
            }
          : {}),

        ...(record.driverVerifiedAt !== null
          ? {
              driverVerifiedAt: record.driverVerifiedAt,
            }
          : {}),

        ...(record.profilePhotoVerifiedAt !== null
          ? {
              profilePhotoVerifiedAt: record.profilePhotoVerifiedAt,
            }
          : {}),

        ...(record.governmentIdVerifiedAt !== null
          ? {
              governmentIdVerifiedAt: record.governmentIdVerifiedAt,
            }
          : {}),

        ...(record.driverLicenseVerifiedAt !== null
          ? {
              driverLicenseVerifiedAt: record.driverLicenseVerifiedAt,
            }
          : {}),

        // ---------------------------------------------------------------------
        // Review
        // ---------------------------------------------------------------------

        ...(reviewedByPublicId !== undefined
          ? {
              reviewedByPublicId,
            }
          : {}),

        ...(record.rejectionReason !== null
          ? {
              rejectionReason: record.rejectionReason,
            }
          : {}),

        ...(record.lastReviewedAt !== null
          ? {
              lastReviewedAt: record.lastReviewedAt,
            }
          : {}),

        // ---------------------------------------------------------------------
        // Owned Requests
        // ---------------------------------------------------------------------

        requests,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      // -----------------------------------------------------------------------
      // Internal Persistence Identity
      // -----------------------------------------------------------------------

      new UniqueEntityId(record.id),

      // -----------------------------------------------------------------------
      // Public Domain Identity
      // -----------------------------------------------------------------------

      verificationPublicId,
    );

    // -------------------------------------------------------------------------
    // Aggregate Reconstruction
    // -------------------------------------------------------------------------

    return VerificationAggregate.rehydrate(verification);
  }

  // ===========================================================================
  // Verification → Domain Entity
  // ===========================================================================

  /**
   * Maps a bare Prisma Verification record into VerificationEntity.
   *
   * This method intentionally does not reconstruct VerificationRequestEntity
   * children.
   *
   * Complete aggregate rehydration must use toDomain().
   *
   * Because VerificationEntity requires the owning Identity public reference,
   * this method should only be used when that reference is available through
   * an infrastructure-specific workflow. For the ordinary aggregate path,
   * use toDomain().
   */
  public static verificationToDomain(
    record: PrismaVerification,
    identityPublicId: IdentityPublicId,
  ): VerificationEntity {
    if (identityPublicId === undefined) {
      throw new Error(
        `Verification "${record.publicId}" requires its owning Identity public identifier.`,
      );
    }

    const publicId = new VerificationPublicId(record.publicId);

    return VerificationEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId,

        identityPublicId,

        // ---------------------------------------------------------------------
        // State
        // ---------------------------------------------------------------------

        status: VerificationStatus.create(toVerificationStatus(record.status)),

        level: VerificationLevel.create(toVerificationLevel(record.level)),

        // ---------------------------------------------------------------------
        // Evidence
        // ---------------------------------------------------------------------

        profilePhotoVerified: record.profilePhotoVerified,

        governmentIdVerified: record.governmentIdVerified,

        driverLicenseVerified: record.driverLicenseVerified,

        // ---------------------------------------------------------------------
        // Timestamps
        // ---------------------------------------------------------------------

        ...(record.verifiedAt !== null
          ? {
              verifiedAt: record.verifiedAt,
            }
          : {}),

        ...(record.expiresAt !== null
          ? {
              expiresAt: record.expiresAt,
            }
          : {}),

        ...(record.memberVerifiedAt !== null
          ? {
              memberVerifiedAt: record.memberVerifiedAt,
            }
          : {}),

        ...(record.driverVerifiedAt !== null
          ? {
              driverVerifiedAt: record.driverVerifiedAt,
            }
          : {}),

        ...(record.profilePhotoVerifiedAt !== null
          ? {
              profilePhotoVerifiedAt: record.profilePhotoVerifiedAt,
            }
          : {}),

        ...(record.governmentIdVerifiedAt !== null
          ? {
              governmentIdVerifiedAt: record.governmentIdVerifiedAt,
            }
          : {}),

        ...(record.driverLicenseVerifiedAt !== null
          ? {
              driverLicenseVerifiedAt: record.driverLicenseVerifiedAt,
            }
          : {}),

        // ---------------------------------------------------------------------
        // Aggregate-level review is deliberately empty for a bare record
        // because Prisma reviewer relation is not available here.
        // ---------------------------------------------------------------------

        requests: [],

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),

      publicId,
    );
  }

  // ===========================================================================
  // VerificationRequest → Domain Entity
  // ===========================================================================

  /**
   * Rehydrates an owned VerificationRequestEntity.
   *
   * Required relations:
   *
   * - verification;
   * - asset.
   *
   * Optional relation:
   *
   * - reviewedBy.
   *
   * The mapper converts those persistence relationships into the public
   * references expected by the domain entity.
   */
  public static requestToDomain(
    record: VerificationRequestWithRelations,
  ): VerificationRequestEntity {
    // -------------------------------------------------------------------------
    // Required parent Verification relation
    // -------------------------------------------------------------------------

    if (record.verification === null || record.verification === undefined) {
      throw new Error(
        `Verification request "${record.publicId}" cannot be rehydrated without its parent Verification relation.`,
      );
    }

    // -------------------------------------------------------------------------
    // Required Asset relation
    // -------------------------------------------------------------------------

    if (record.asset === null || record.asset === undefined) {
      throw new Error(
        `Verification request "${record.publicId}" cannot be rehydrated without its Asset relation.`,
      );
    }

    // -------------------------------------------------------------------------
    // Request public identity
    // -------------------------------------------------------------------------

    const publicId = new VerificationRequestPublicId(record.publicId);

    // -------------------------------------------------------------------------
    // Parent Verification public identity
    // -------------------------------------------------------------------------

    const verificationPublicId = new VerificationPublicId(
      record.verification.publicId,
    );

    // -------------------------------------------------------------------------
    // Asset public identity
    // -------------------------------------------------------------------------

    const assetPublicId = new VerificationRequestAssetPublicId(
      record.asset.publicId,
    );

    // -------------------------------------------------------------------------
    // Reviewer public identity
    // -------------------------------------------------------------------------

    const reviewedByPublicId =
      record.reviewedBy !== null && record.reviewedBy !== undefined
        ? new IdentityPublicId(record.reviewedBy.publicId)
        : undefined;

    // -------------------------------------------------------------------------
    // Metadata
    // -------------------------------------------------------------------------

    const metadata =
      record.metadata !== null &&
      record.metadata !== undefined &&
      typeof record.metadata === 'object' &&
      !Array.isArray(record.metadata)
        ? {
            ...(record.metadata as Record<string, unknown>),
          }
        : undefined;

    // -------------------------------------------------------------------------
    // Entity Rehydration
    // -------------------------------------------------------------------------

    return VerificationRequestEntity.rehydrate(
      {
        // -----------------------------------------------------------------------
        // Identity
        // -----------------------------------------------------------------------

        publicId,

        // -----------------------------------------------------------------------
        // Parent Verification
        // -----------------------------------------------------------------------

        verificationPublicId,

        // -----------------------------------------------------------------------
        // Request
        // -----------------------------------------------------------------------

        type: VerificationRequestType.create(
          toVerificationRequestType(record.type),
        ),

        status: VerificationRequestStatus.create(
          toVerificationRequestStatus(record.status),
        ),

        // -----------------------------------------------------------------------
        // Evidence
        // -----------------------------------------------------------------------

        assetPublicId,

        // -----------------------------------------------------------------------
        // Submission
        // -----------------------------------------------------------------------

        submittedAt: record.submittedAt,

        // -----------------------------------------------------------------------
        // Review
        // -----------------------------------------------------------------------

        ...(record.reviewedAt !== null
          ? {
              reviewedAt: record.reviewedAt,
            }
          : {}),

        ...(reviewedByPublicId !== undefined
          ? {
              reviewedByPublicId,
            }
          : {}),

        ...(record.rejectionReason !== null
          ? {
              rejectionReason: record.rejectionReason,
            }
          : {}),

        // -----------------------------------------------------------------------
        // Metadata
        // -----------------------------------------------------------------------

        ...(metadata !== undefined
          ? {
              metadata,
            }
          : {}),

        // -----------------------------------------------------------------------
        // Audit
        // -----------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      // -------------------------------------------------------------------------
      // Internal Persistence Identity
      // -------------------------------------------------------------------------

      new UniqueEntityId(record.id),

      // -------------------------------------------------------------------------
      // Public Domain Identity
      // -------------------------------------------------------------------------

      publicId,
    );
  }
  // ===========================================================================
  // Verification → Persistence
  // ===========================================================================

  /**
   * Maps VerificationEntity into a persistence-neutral representation.
   *
   * IMPORTANT:
   *
   * The domain exposes:
   *
   * - identityPublicId;
   * - reviewedByPublicId.
   *
   * Prisma requires:
   *
   * - identityId;
   * - reviewedById.
   *
   * Therefore foreign-key resolution remains a repository/infrastructure
   * responsibility.
   */
  public static verificationToPersistence(entity: VerificationEntity): {
    id: string;
    publicId: string;
    identityPublicId: string;
    status: PrismaVerificationStatus;
    level: PrismaVerificationLevel;
    profilePhotoVerified: boolean;
    governmentIdVerified: boolean;
    driverLicenseVerified: boolean;
    verifiedAt: Date | null;
    expiresAt: Date | null;
    memberVerifiedAt: Date | null;
    driverVerifiedAt: Date | null;
    profilePhotoVerifiedAt: Date | null;
    governmentIdVerifiedAt: Date | null;
    driverLicenseVerifiedAt: Date | null;
    reviewedByPublicId: string | null;
    rejectionReason: string | null;
    lastReviewedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // -----------------------------------------------------------------------
      // Cross-Aggregate References
      // -----------------------------------------------------------------------

      identityPublicId: entity.identityPublicId.value,

      // -----------------------------------------------------------------------
      // Verification State
      // -----------------------------------------------------------------------

      status: entity.status.value,

      level: entity.level.value,

      // -----------------------------------------------------------------------
      // Accepted Evidence
      // -----------------------------------------------------------------------

      profilePhotoVerified: entity.profilePhotoVerified,

      governmentIdVerified: entity.governmentIdVerified,

      driverLicenseVerified: entity.driverLicenseVerified,

      // -----------------------------------------------------------------------
      // Verification Timestamps
      // -----------------------------------------------------------------------

      verifiedAt: entity.verifiedAt ?? null,

      expiresAt: entity.expiresAt ?? null,

      memberVerifiedAt: entity.memberVerifiedAt ?? null,

      driverVerifiedAt: entity.driverVerifiedAt ?? null,

      profilePhotoVerifiedAt: entity.profilePhotoVerifiedAt ?? null,

      governmentIdVerifiedAt: entity.governmentIdVerifiedAt ?? null,

      driverLicenseVerifiedAt: entity.driverLicenseVerifiedAt ?? null,

      // -----------------------------------------------------------------------
      // Review
      // -----------------------------------------------------------------------

      reviewedByPublicId: entity.reviewedByPublicId?.value ?? null,

      rejectionReason: entity.rejectionReason ?? null,

      lastReviewedAt: entity.lastReviewedAt ?? null,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // VerificationRequest → Persistence
  // ===========================================================================

  /**
   * Maps VerificationRequestEntity into a persistence-neutral representation.
   *
   * Prisma requires internal foreign keys:
   *
   * - verificationId;
   * - assetId;
   * - reviewedById.
   *
   * The domain intentionally contains only public references, so this mapper
   * does not attempt to resolve those internal IDs.
   */
  public static requestToPersistence(entity: VerificationRequestEntity): {
    id: string;
    publicId: string;
    verificationPublicId: string;
    type: PrismaVerificationRequestType;
    status: PrismaVerificationRequestStatus;
    assetPublicId: string;
    submittedAt: Date;
    reviewedAt: Date | null;
    reviewedByPublicId: string | null;
    rejectionReason: string | null;
    metadata: Record<string, unknown> | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      // -------------------------------------------------------------------------
      // Identity
      // -------------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // -------------------------------------------------------------------------
      // Parent Aggregate Reference
      // -------------------------------------------------------------------------

      verificationPublicId: entity.verificationPublicId.value,

      // -------------------------------------------------------------------------
      // Request
      // -------------------------------------------------------------------------

      type: entity.type.value,

      status: entity.status.value,

      // -------------------------------------------------------------------------
      // Evidence
      // -------------------------------------------------------------------------

      assetPublicId: entity.assetPublicId.value,

      // -------------------------------------------------------------------------
      // Submission
      // -------------------------------------------------------------------------

      submittedAt: entity.submittedAt(),

      // -------------------------------------------------------------------------
      // Review
      // -------------------------------------------------------------------------

      reviewedAt: entity.reviewedAt ?? null,

      reviewedByPublicId: entity.reviewedByPublicId?.value ?? null,

      rejectionReason: entity.rejectionReason ?? null,

      // -------------------------------------------------------------------------
      // Metadata
      // -------------------------------------------------------------------------

      metadata: entity.metadata
        ? {
            ...entity.metadata,
          }
        : null,

      // -------------------------------------------------------------------------
      // Audit
      // -------------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate → Persistence
  // ===========================================================================

  /**
   * Converts the complete Verification aggregate into persistence-neutral
   * structures.
   *
   * Repository responsibilities still include translating:
   *
   * - identityPublicId -> identityId;
   * - reviewedByPublicId -> reviewedById;
   * - request.verificationPublicId -> verificationId;
   * - request.assetPublicId -> assetId;
   * - request.reviewedByPublicId -> reviewedById.
   */
  public static toPersistence(
    aggregate: VerificationAggregate,
  ): VerificationPersistence {
    return {
      verification: this.verificationToPersistence(aggregate.verification),

      requests: aggregate.requests.map((request) =>
        this.requestToPersistence(request),
      ),
    };
  }

  // ===========================================================================
  // Component Mapping
  // ===========================================================================

  /**
   * Maps a Prisma Verification record into VerificationEntity when the owning
   * Identity public identifier is already available.
   */
  public static toVerificationDomain(
    record: PrismaVerification,
    identityPublicId: IdentityPublicId,
  ): VerificationEntity {
    return this.verificationToDomain(record, identityPublicId);
  }

  /**
   * Maps a relation-expanded Prisma VerificationRequest record into
   * VerificationRequestEntity.
   */
  public static toVerificationRequestDomain(
    record: VerificationRequestWithRelations,
  ): VerificationRequestEntity {
    return this.requestToDomain(record);
  }

  // ===========================================================================
  // Prisma Record Guards
  // ===========================================================================

  /**
   * Identifies a bare Prisma Verification record.
   */
  private static isVerificationRecord(
    record: PrismaVerification | VerificationRequestWithRelations,
  ): record is PrismaVerification {
    return (
      'identityId' in record &&
      'status' in record &&
      'level' in record &&
      'profilePhotoVerified' in record &&
      'governmentIdVerified' in record &&
      'driverLicenseVerified' in record
    );
  }

  /**
   * Identifies a relation-expanded Prisma VerificationRequest record.
   *
   * Bare VerificationRequest records are intentionally rejected because the
   * domain requires the public identities of the parent Verification and
   * Asset.
   */
  private static isVerificationRequestRecord(
    record: PrismaVerification | VerificationRequestWithRelations,
  ): record is VerificationRequestWithRelations {
    return (
      'verificationId' in record &&
      'assetId' in record &&
      'type' in record &&
      'status' in record &&
      'verification' in record &&
      'asset' in record
    );
  }

  // ===========================================================================
  // Generic Component Mapping
  // ===========================================================================

  /**
   * Maps a supported Prisma component into its corresponding domain entity.
   *
   * Verification records require an Identity public reference to be supplied
   * by the caller because a bare Prisma Verification record contains only the
   * internal identityId foreign key.
   *
   * VerificationRequest requires relation-expanded data.
   */
  public static toDomainComponent(
    record: PrismaVerification | VerificationRequestWithRelations,
    identityPublicId?: IdentityPublicId,
  ): VerificationEntity | VerificationRequestEntity {
    if (this.isVerificationRequestRecord(record)) {
      return this.requestToDomain(record);
    }

    if (this.isVerificationRecord(record)) {
      if (identityPublicId === undefined) {
        throw new Error(
          `Verification "${record.publicId}" requires an owning Identity public identifier for component mapping.`,
        );
      }

      return this.verificationToDomain(record, identityPublicId);
    }

    throw new Error(
      'Unsupported Verification Prisma record supplied to mapper.',
    );
  }
}
