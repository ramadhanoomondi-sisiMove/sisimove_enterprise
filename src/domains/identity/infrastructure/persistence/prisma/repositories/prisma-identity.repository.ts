// -----------------------------------------------------------------------------
// Prisma Identity Repository
// -----------------------------------------------------------------------------
//
// Infrastructure repository for the Identity aggregate.
//
// Aggregate boundary:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// Persistence:
//
// Identity
// └── IdentityRole
//
// IdentityRole is aggregate-owned and therefore persisted and rehydrated
// together with Identity.
//
// Role is a separate aggregate and is never persisted through this repository.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Identity aggregate persistence and rehydration
// - Identity root queries
// - Identity lifecycle queries
// - Identity contact queries
// - IdentityRole aggregate-owned child queries
// - IdentityRole lifecycle/audit queries
// - Existence / count queries
//
// The repository does NOT:
//
// - persist Role;
// - expose Role as an aggregate;
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
// - IdentityPublicId
// - IdentityRolePublicId
// - IdentityRoleIdentityPublicId
// - IdentityRoleRolePublicId
//
// Prisma:
//
// - Identity.id
// - IdentityRole.id
// - IdentityRole.identityId
// - IdentityRole.roleId
// - IdentityRole.assignedById
// - IdentityRole.revokedById
//
// Public references are resolved to internal persistence identifiers only
// inside this infrastructure repository.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// Identity currently has NO IdentityType.
//
// The repository therefore deliberately contains no:
//
// - IdentityType import;
// - Prisma IdentityType conversion;
// - type persistence field;
// - type query.
//
// -----------------------------------------------------------------------------
//
// Persistence error boundary:
//
// - Prisma/database errors remain infrastructure concerns.
// - Known uniqueness violations are translated into
//   IdentityAlreadyExistsException.
// - Database uniqueness constraints remain the final concurrency protection.
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

import type { IdentityAggregate } from '../../../../domain/aggregates/identity.aggregate';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import type { IdentityEntity } from '../../../../domain/entities/identity.entity';

import type { IdentityRoleEntity } from '../../../../domain/entities/identity-role.entity';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { IdentityAlreadyExistsException } from '../../../../domain/exceptions/identity-already-exists.exception';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { IdentityRepository } from '../../../../domain/repositories/identity.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { IdentityPublicId } from '../../../../domain/value-objects/identity-public-id.vo';

import type { IdentityRolePublicId } from '../../../../domain/value-objects/identity-role-public-id.vo';

import type { IdentityRoleIdentityPublicId } from '../../../../domain/value-objects/identity-role-identity-public-id.vo';

import type { IdentityRoleRolePublicId } from '../../../../domain/value-objects/identity-role-role-public-id.vo';

import {
  IdentityStatus,
  type IdentityStatusValue,
} from '../../../../domain/value-objects/identity-status.vo';

import type { IdentityEmail } from '../../../../domain/value-objects/identity-email.vo';

import type { IdentityPhoneNumber } from '../../../../domain/value-objects/identity-phone-number.vo';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import {
  IdentityPrismaMapper,
  type IdentityWithRoles,
  type IdentityRolePersistence,
} from '../../../persistence/prisma/mappers/identity-prisma.mapper';

// =============================================================================
// Repository
// =============================================================================

@Injectable()
export class PrismaIdentityRepository implements IdentityRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Prisma Enum Boundary
  // ===========================================================================

  /**
   * Converts a domain IdentityStatus value into the Prisma enum.
   *
   * IdentityStatus is already validated by the domain value object.
   */
  private toPrismaIdentityStatus(
    value: IdentityStatusValue,
  ): $Enums.IdentityStatus {
    switch (value) {
      case 'PENDING':
        return $Enums.IdentityStatus.PENDING;

      case 'ACTIVE':
        return $Enums.IdentityStatus.ACTIVE;

      case 'SUSPENDED':
        return $Enums.IdentityStatus.SUSPENDED;

      case 'CLOSED':
        return $Enums.IdentityStatus.CLOSED;

      default:
        throw new Error(
          `Unsupported IdentityStatus "${String(
            value,
          )}" supplied to Prisma repository.`,
        );
    }
  }

  // ===========================================================================
  // Complete Aggregate Include Graph
  // ===========================================================================

  /**
   * Complete Identity aggregate relation graph.
   *
   * IdentityRole is aggregate-owned and therefore must be loaded whenever a
   * complete Identity aggregate is rehydrated.
   *
   * IdentityRole additionally requires:
   *
   * - owning Identity;
   * - referenced Role;
   * - assigning Identity;
   * - revoking Identity.
   */
  private readonly include = {
    identityRoles: {
      include: {
        identity: {
          select: {
            id: true,
            publicId: true,
          },
        },

        role: {
          select: {
            id: true,
            publicId: true,
          },
        },

        assignedBy: {
          select: {
            id: true,
            publicId: true,
          },
        },

        revokedBy: {
          select: {
            id: true,
            publicId: true,
          },
        },
      },
    },
  } satisfies Prisma.IdentityInclude;

  // ===========================================================================
  // IdentityRole Relation Include
  // ===========================================================================

  /**
   * Complete IdentityRole relation graph required by the domain mapper.
   */
  private readonly identityRoleInclude = {
    identity: {
      select: {
        id: true,
        publicId: true,
      },
    },

    role: {
      select: {
        id: true,
        publicId: true,
      },
    },

    assignedBy: {
      select: {
        id: true,
        publicId: true,
      },
    },

    revokedBy: {
      select: {
        id: true,
        publicId: true,
      },
    },
  } satisfies Prisma.IdentityRoleInclude;

  // ===========================================================================
  // Create
  // ===========================================================================

  /**
   * Persists a brand-new Identity aggregate atomically.
   *
   * The aggregate root and all aggregate-owned IdentityRole children are
   * created within the same transaction.
   */
  public async create(aggregate: IdentityAggregate): Promise<void> {
    try {
      const persistence = IdentityPrismaMapper.toPersistence(aggregate);

      await this.prisma.$transaction(async (tx) => {
        // ---------------------------------------------------------------------
        // Identity Root
        // ---------------------------------------------------------------------

        await tx.identity.create({
          data: {
            id: persistence.identity.id,

            publicId: persistence.identity.publicId,

            email: persistence.identity.email,

            phoneNumber: persistence.identity.phoneNumber,

            status: this.toPrismaIdentityStatus(persistence.identity.status),

            activatedAt: persistence.identity.activatedAt,

            suspendedAt: persistence.identity.suspendedAt,

            closedAt: persistence.identity.closedAt,

            createdAt: persistence.identity.createdAt,

            updatedAt: persistence.identity.updatedAt,
          },
        });

        // ---------------------------------------------------------------------
        // Aggregate-Owned IdentityRole Children
        // ---------------------------------------------------------------------

        for (const identityRole of persistence.identityRoles) {
          await this.createIdentityRole(
            tx,
            persistence.identity.id,
            persistence.identity.publicId,
            identityRole,
          );
        }
      });
    } catch (error: unknown) {
      throw this.translatePersistenceError(error);
    }
  }

  // ===========================================================================
  // Save
  // ===========================================================================

  /**
   * Persists the complete current state of an existing Identity aggregate.
   *
   * The aggregate root and its aggregate-owned IdentityRole collection are
   * synchronized atomically.
   *
   * IdentityRole children that no longer exist in the aggregate are removed
   * from persistence.
   */
  public async save(aggregate: IdentityAggregate): Promise<void> {
    try {
      const persistence = IdentityPrismaMapper.toPersistence(aggregate);

      await this.prisma.$transaction(async (tx) => {
        // ---------------------------------------------------------------------
        // Verify Aggregate Root Exists
        // ---------------------------------------------------------------------

        const identity = await tx.identity.findUnique({
          where: {
            id: persistence.identity.id,
          },

          select: {
            id: true,
            publicId: true,
          },
        });

        if (identity === null) {
          throw new Error(
            `Cannot save Identity "${persistence.identity.publicId}": ` +
              `aggregate root "${persistence.identity.id}" was not found.`,
          );
        }

        // ---------------------------------------------------------------------
        // Verify Persistence Identity Ownership
        // ---------------------------------------------------------------------

        if (identity.publicId !== persistence.identity.publicId) {
          throw new Error(
            `Cannot save Identity "${persistence.identity.publicId}": ` +
              `persistence identity "${persistence.identity.id}" belongs to ` +
              `public Identity "${identity.publicId}".`,
          );
        }

        // ---------------------------------------------------------------------
        // Update Aggregate Root
        // ---------------------------------------------------------------------

        await tx.identity.update({
          where: {
            id: persistence.identity.id,
          },

          data: {
            publicId: persistence.identity.publicId,

            email: persistence.identity.email,

            phoneNumber: persistence.identity.phoneNumber,

            status: this.toPrismaIdentityStatus(persistence.identity.status),

            activatedAt: persistence.identity.activatedAt,

            suspendedAt: persistence.identity.suspendedAt,

            closedAt: persistence.identity.closedAt,

            updatedAt: persistence.identity.updatedAt,
          },
        });

        // ---------------------------------------------------------------------
        // Reconcile Aggregate-Owned IdentityRole Children
        // ---------------------------------------------------------------------

        const persistedRoleIds = persistence.identityRoles.map(
          (identityRole) => identityRole.id,
        );

        if (persistedRoleIds.length === 0) {
          await tx.identityRole.deleteMany({
            where: {
              identityId: identity.id,
            },
          });
        } else {
          await tx.identityRole.deleteMany({
            where: {
              identityId: identity.id,

              id: {
                notIn: persistedRoleIds,
              },
            },
          });
        }

        // ---------------------------------------------------------------------
        // Persist Current IdentityRole Children
        // ---------------------------------------------------------------------

        for (const identityRole of persistence.identityRoles) {
          await this.upsertIdentityRole(
            tx,
            identity.id,
            identity.publicId,
            identityRole,
          );
        }
      });
    } catch (error: unknown) {
      throw this.translatePersistenceError(error);
    }
  }

  // ===========================================================================
  // Aggregate Lookup
  // ===========================================================================

  /**
   * Finds and rehydrates the complete Identity aggregate by persistence ID.
   */
  public async findById(id: string): Promise<IdentityAggregate | null> {
    const record = await this.prisma.identity.findUnique({
      where: {
        id,
      },

      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  /**
   * Finds and rehydrates the complete Identity aggregate by public identity.
   */
  public async findByPublicId(
    publicId: IdentityPublicId,
  ): Promise<IdentityAggregate | null> {
    const record = await this.prisma.identity.findUnique({
      where: {
        publicId: publicId.value,
      },

      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  // ===========================================================================
  // Delete
  // ===========================================================================

  /**
   * Deletes the Identity aggregate.
   *
   * IdentityRole is aggregate-owned and is explicitly removed before deleting
   * the aggregate root.
   */
  public async delete(id: string): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.identityRole.deleteMany({
          where: {
            identityId: id,
          },
        });

        await tx.identity.delete({
          where: {
            id,
          },
        });
      });
    } catch (error: unknown) {
      throw this.translatePersistenceError(error);
    }
  }

  // ===========================================================================
  // Existence
  // ===========================================================================

  /**
   * Determines whether an Identity exists by persistence ID.
   */
  public async exists(id: string): Promise<boolean> {
    const record = await this.prisma.identity.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Determines whether an Identity exists by public identity.
   */
  public async existsByPublicId(publicId: IdentityPublicId): Promise<boolean> {
    const record = await this.prisma.identity.findUnique({
      where: {
        publicId: publicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Identity Root Queries
  // ===========================================================================

  /**
   * Finds only the Identity root entity.
   *
   * IdentityRole children are deliberately not loaded.
   */
  public async findIdentityById(id: string): Promise<IdentityEntity | null> {
    const record = await this.prisma.identity.findUnique({
      where: {
        id,
      },
    });

    return record === null
      ? null
      : IdentityPrismaMapper.toIdentityDomain(record);
  }

  /**
   * Finds only the Identity root entity by public identity.
   */
  public async findIdentityByPublicId(
    publicId: IdentityPublicId,
  ): Promise<IdentityEntity | null> {
    const record = await this.prisma.identity.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return record === null
      ? null
      : IdentityPrismaMapper.toIdentityDomain(record);
  }

  /**
   * Returns all Identity root entities.
   *
   * IdentityRole children are intentionally not loaded.
   */
  public async findIdentities(): Promise<IdentityEntity[]> {
    const records = await this.prisma.identity.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      IdentityPrismaMapper.toIdentityDomain(record),
    );
  }

  // ===========================================================================
  // Contact Queries
  // ===========================================================================

  /**
   * Finds an Identity aggregate by email address.
   */
  public async findByEmail(
    email: IdentityEmail,
  ): Promise<IdentityAggregate | null> {
    const record = await this.prisma.identity.findUnique({
      where: {
        email: email.value,
      },

      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  /**
   * Determines whether an email address is already associated with an
   * Identity.
   */
  public async existsByEmail(email: IdentityEmail): Promise<boolean> {
    const record = await this.prisma.identity.findUnique({
      where: {
        email: email.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Finds an Identity aggregate by phone number.
   */
  public async findByPhoneNumber(
    phoneNumber: IdentityPhoneNumber,
  ): Promise<IdentityAggregate | null> {
    const record = await this.prisma.identity.findUnique({
      where: {
        phoneNumber: phoneNumber.value,
      },

      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  /**
   * Determines whether a phone number is already associated with an
   * Identity.
   */
  public async existsByPhoneNumber(
    phoneNumber: IdentityPhoneNumber,
  ): Promise<boolean> {
    const record = await this.prisma.identity.findUnique({
      where: {
        phoneNumber: phoneNumber.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Identity Lifecycle Queries
  // ===========================================================================

  /**
   * Finds Identity aggregates by lifecycle status.
   */
  public async findByStatus(
    status: IdentityStatus,
  ): Promise<IdentityAggregate[]> {
    const records = await this.prisma.identity.findMany({
      where: {
        status: this.toPrismaIdentityStatus(status.value),
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds Identity root entities by lifecycle status.
   *
   * IdentityRole children are not loaded.
   */
  public async findIdentitiesByStatus(
    status: IdentityStatus,
  ): Promise<IdentityEntity[]> {
    const records = await this.prisma.identity.findMany({
      where: {
        status: this.toPrismaIdentityStatus(status.value),
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      IdentityPrismaMapper.toIdentityDomain(record),
    );
  }

  /**
   * Finds pending Identity aggregates.
   */
  public async findPending(): Promise<IdentityAggregate[]> {
    return this.findByStatus(IdentityStatus.create('PENDING'));
  }

  /**
   * Finds active Identity aggregates.
   */
  public async findActive(): Promise<IdentityAggregate[]> {
    return this.findByStatus(IdentityStatus.create('ACTIVE'));
  }

  /**
   * Finds suspended Identity aggregates.
   */
  public async findSuspended(): Promise<IdentityAggregate[]> {
    return this.findByStatus(IdentityStatus.create('SUSPENDED'));
  }

  /**
   * Finds closed Identity aggregates.
   */
  public async findClosed(): Promise<IdentityAggregate[]> {
    return this.findByStatus(IdentityStatus.create('CLOSED'));
  }

  /**
   * Backward-compatible explicit query names.
   */
  public async findPendingIdentities(): Promise<IdentityAggregate[]> {
    return this.findPending();
  }

  public async findActiveIdentities(): Promise<IdentityAggregate[]> {
    return this.findActive();
  }

  public async findSuspendedIdentities(): Promise<IdentityAggregate[]> {
    return this.findSuspended();
  }

  public async findClosedIdentities(): Promise<IdentityAggregate[]> {
    return this.findClosed();
  }

  /**
   * Counts Identities by lifecycle status.
   */
  public async countByStatus(status: IdentityStatus): Promise<number> {
    return this.prisma.identity.count({
      where: {
        status: this.toPrismaIdentityStatus(status.value),
      },
    });
  }

  /**
   * Counts all Identities.
   */
  public async count(): Promise<number> {
    return this.prisma.identity.count();
  }

  // ===========================================================================
  // Active Role Queries
  // ===========================================================================

  /**
   * Finds Identity aggregates that currently have an active assignment for
   * the supplied Role.
   *
   * An IdentityRole is active when:
   *
   * - revokedAt IS NULL; and
   * - expiresAt IS NULL OR expiresAt > now.
   */
  public async findByActiveRole(
    rolePublicId: IdentityRoleRolePublicId,
  ): Promise<IdentityAggregate[]> {
    const now = new Date();

    const records = await this.prisma.identity.findMany({
      where: {
        identityRoles: {
          some: {
            role: {
              publicId: rolePublicId.value,
            },

            revokedAt: null,

            OR: [
              {
                expiresAt: null,
              },

              {
                expiresAt: {
                  gt: now,
                },
              },
            ],
          },
        },
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Determines whether any Identity currently has an active assignment for
   * the supplied Role.
   */
  public async existsByActiveRole(
    rolePublicId: IdentityRoleRolePublicId,
  ): Promise<boolean> {
    const now = new Date();

    const record = await this.prisma.identityRole.findFirst({
      where: {
        role: {
          publicId: rolePublicId.value,
        },

        revokedAt: null,

        OR: [
          {
            expiresAt: null,
          },

          {
            expiresAt: {
              gt: now,
            },
          },
        ],
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Aggregate-Owned IdentityRole Queries
  // ===========================================================================

  /**
   * Finds an IdentityRole by public identity.
   */
  public async findRoleByPublicId(
    publicId: IdentityRolePublicId,
  ): Promise<IdentityRoleEntity | null> {
    const record = await this.prisma.identityRole.findUnique({
      where: {
        publicId: publicId.value,
      },

      include: this.identityRoleInclude,
    });

    return record === null
      ? null
      : IdentityPrismaMapper.toIdentityRoleDomain(record);
  }

  /**
   * Finds all IdentityRole children belonging to an Identity aggregate.
   */
  public async findRolesByIdentityPublicId(
    identityPublicId: IdentityRoleIdentityPublicId,
  ): Promise<IdentityRoleEntity[]> {
    const records = await this.prisma.identityRole.findMany({
      where: {
        identity: {
          publicId: identityPublicId.value,
        },
      },

      include: this.identityRoleInclude,

      orderBy: {
        assignedAt: 'desc',
      },
    });

    return records.map((record) =>
      IdentityPrismaMapper.toIdentityRoleDomain(record),
    );
  }

  /**
   * Finds all IdentityRole children assigned to a particular Role.
   *
   * The returned values are child entities, not Role aggregates.
   */
  public async findRolesByRolePublicId(
    rolePublicId: IdentityRoleRolePublicId,
  ): Promise<IdentityRoleEntity[]> {
    const records = await this.prisma.identityRole.findMany({
      where: {
        role: {
          publicId: rolePublicId.value,
        },
      },

      include: this.identityRoleInclude,

      orderBy: {
        assignedAt: 'desc',
      },
    });

    return records.map((record) =>
      IdentityPrismaMapper.toIdentityRoleDomain(record),
    );
  }

  /**
   * Determines whether an Identity has an active assignment for a Role.
   */
  public async hasRole(
    identityPublicId: IdentityRoleIdentityPublicId,
    rolePublicId: IdentityRoleRolePublicId,
  ): Promise<boolean> {
    const now = new Date();

    const record = await this.prisma.identityRole.findFirst({
      where: {
        identity: {
          publicId: identityPublicId.value,
        },

        role: {
          publicId: rolePublicId.value,
        },

        revokedAt: null,

        OR: [
          {
            expiresAt: null,
          },

          {
            expiresAt: {
              gt: now,
            },
          },
        ],
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Determines whether a specific IdentityRole exists.
   */
  public async existsRole(publicId: IdentityRolePublicId): Promise<boolean> {
    const record = await this.prisma.identityRole.findUnique({
      where: {
        publicId: publicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Counts IdentityRole assignments belonging to an Identity.
   */
  public async countRolesByIdentity(
    identityPublicId: IdentityRoleIdentityPublicId,
  ): Promise<number> {
    return this.prisma.identityRole.count({
      where: {
        identity: {
          publicId: identityPublicId.value,
        },
      },
    });
  }

  /**
   * Counts active IdentityRole assignments belonging to an Identity.
   */
  public async countActiveRolesByIdentity(
    identityPublicId: IdentityRoleIdentityPublicId,
  ): Promise<number> {
    const now = new Date();

    return this.prisma.identityRole.count({
      where: {
        identity: {
          publicId: identityPublicId.value,
        },

        revokedAt: null,

        OR: [
          {
            expiresAt: null,
          },

          {
            expiresAt: {
              gt: now,
            },
          },
        ],
      },
    });
  }

  /**
   * Finds active IdentityRole assignments belonging to an Identity.
   */
  public async findActiveRolesByIdentity(
    identityPublicId: IdentityRoleIdentityPublicId,
  ): Promise<IdentityRoleEntity[]> {
    const now = new Date();

    const records = await this.prisma.identityRole.findMany({
      where: {
        identity: {
          publicId: identityPublicId.value,
        },

        revokedAt: null,

        OR: [
          {
            expiresAt: null,
          },

          {
            expiresAt: {
              gt: now,
            },
          },
        ],
      },

      include: this.identityRoleInclude,

      orderBy: {
        assignedAt: 'desc',
      },
    });

    return records.map((record) =>
      IdentityPrismaMapper.toIdentityRoleDomain(record),
    );
  }

  // ===========================================================================
  // Persistence Helpers
  // ===========================================================================

  /**
   * Creates an aggregate-owned IdentityRole.
   *
   * The aggregate Identity persistence ID is already known.
   *
   * Role and audit actors are represented by public IDs in the domain and are
   * resolved to internal Prisma IDs here.
   */
  private async createIdentityRole(
    tx: Prisma.TransactionClient,
    identityId: string,
    aggregateIdentityPublicId: string,
    identityRole: IdentityRolePersistence,
  ): Promise<void> {
    this.assertOwningIdentity(
      identityRole.publicId,
      aggregateIdentityPublicId,
      identityRole.identityPublicId,
    );

    const roleId = await this.resolveRoleId(
      tx,
      identityRole.publicId,
      identityRole.rolePublicId,
    );

    const assignedById = await this.resolveIdentityId(
      tx,
      identityRole.publicId,
      'assigning',
      identityRole.assignedByPublicId,
    );

    const revokedById = await this.resolveIdentityId(
      tx,
      identityRole.publicId,
      'revoking',
      identityRole.revokedByPublicId,
    );

    await tx.identityRole.create({
      data: {
        id: identityRole.id,

        publicId: identityRole.publicId,

        identityId,

        roleId,

        assignedById,

        assignedAt: identityRole.assignedAt,

        expiresAt: identityRole.expiresAt,

        revokedAt: identityRole.revokedAt,

        revokedById,

        createdAt: identityRole.createdAt,

        updatedAt: identityRole.updatedAt,
      },
    });
  }

  /**
   * Upserts an aggregate-owned IdentityRole.
   *
   * The persistence ID is authoritative for determining whether the child
   * already exists.
   */
  private async upsertIdentityRole(
    tx: Prisma.TransactionClient,
    identityId: string,
    aggregateIdentityPublicId: string,
    identityRole: IdentityRolePersistence,
  ): Promise<void> {
    this.assertOwningIdentity(
      identityRole.publicId,
      aggregateIdentityPublicId,
      identityRole.identityPublicId,
    );

    const roleId = await this.resolveRoleId(
      tx,
      identityRole.publicId,
      identityRole.rolePublicId,
    );

    const assignedById = await this.resolveIdentityId(
      tx,
      identityRole.publicId,
      'assigning',
      identityRole.assignedByPublicId,
    );

    const revokedById = await this.resolveIdentityId(
      tx,
      identityRole.publicId,
      'revoking',
      identityRole.revokedByPublicId,
    );

    await tx.identityRole.upsert({
      where: {
        id: identityRole.id,
      },

      create: {
        id: identityRole.id,

        publicId: identityRole.publicId,

        identityId,

        roleId,

        assignedById,

        assignedAt: identityRole.assignedAt,

        expiresAt: identityRole.expiresAt,

        revokedAt: identityRole.revokedAt,

        revokedById,

        createdAt: identityRole.createdAt,

        updatedAt: identityRole.updatedAt,
      },

      update: {
        publicId: identityRole.publicId,

        identityId,

        roleId,

        assignedById,

        assignedAt: identityRole.assignedAt,

        expiresAt: identityRole.expiresAt,

        revokedAt: identityRole.revokedAt,

        revokedById,

        updatedAt: identityRole.updatedAt,
      },
    });
  }

  // ===========================================================================
  // Persistence Identity Resolution
  // ===========================================================================

  /**
   * Resolves a Role public identity into its Prisma internal ID.
   *
   * Role remains a separate aggregate and is never rehydrated or persisted
   * through this repository.
   */
  private async resolveRoleId(
    tx: Prisma.TransactionClient,
    identityRolePublicId: string,
    rolePublicId: string,
  ): Promise<string> {
    const role = await tx.role.findUnique({
      where: {
        publicId: rolePublicId,
      },

      select: {
        id: true,
      },
    });

    if (role === null) {
      throw new Error(
        `Cannot persist IdentityRole "${identityRolePublicId}": ` +
          `Role "${rolePublicId}" was not found.`,
      );
    }

    return role.id;
  }

  /**
   * Resolves an Identity public identity into its Prisma internal ID.
   *
   * Used exclusively for aggregate-owned IdentityRole audit actors.
   */
  private async resolveIdentityId(
    tx: Prisma.TransactionClient,
    identityRolePublicId: string,
    actorDescription: 'assigning' | 'revoking',
    publicId: string | null,
  ): Promise<string | null> {
    if (publicId === null) {
      return null;
    }

    const identity = await tx.identity.findUnique({
      where: {
        publicId,
      },

      select: {
        id: true,
      },
    });

    if (identity === null) {
      throw new Error(
        `Cannot persist IdentityRole "${identityRolePublicId}": ` +
          `${actorDescription} Identity "${publicId}" was not found.`,
      );
    }

    return identity.id;
  }

  // ===========================================================================
  // Aggregate Ownership Guard
  // ===========================================================================

  /**
   * Ensures an IdentityRole being persisted belongs to the Identity aggregate
   * currently being persisted.
   *
   * This prevents infrastructure from accidentally moving an existing child
   * between aggregate roots.
   */
  private assertOwningIdentity(
    identityRolePublicId: string,
    aggregateIdentityPublicId: string,
    identityRoleIdentityPublicId: string,
  ): void {
    if (aggregateIdentityPublicId !== identityRoleIdentityPublicId) {
      throw new Error(
        `Cannot persist IdentityRole "${identityRolePublicId}": ` +
          `IdentityRole belongs to Identity "${identityRoleIdentityPublicId}" ` +
          `but aggregate root is Identity "${aggregateIdentityPublicId}".`,
      );
    }
  }

  // ===========================================================================
  // Persistence Error Translation
  // ===========================================================================

  /**
   * Translates known Prisma persistence errors into application-facing
   * exceptions.
   *
   * Database uniqueness constraints remain authoritative.
   */
  private translatePersistenceError(error: unknown): Error {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const target = this.extractUniqueConstraintTarget(error);

      if (target.includes('email')) {
        return new IdentityAlreadyExistsException(
          'An Identity already exists with the supplied email address.',
        );
      }

      if (target.includes('phoneNumber')) {
        return new IdentityAlreadyExistsException(
          'An Identity already exists with the supplied phone number.',
        );
      }

      if (target.includes('publicId')) {
        return new IdentityAlreadyExistsException(
          'An Identity already exists with the supplied public identity.',
        );
      }

      return new IdentityAlreadyExistsException(
        'An Identity already exists with one or more unique attributes.',
      );
    }

    return error instanceof Error
      ? error
      : new Error('An unknown persistence error occurred.');
  }

  /**
   * Safely extracts Prisma's unique constraint target.
   */
  private extractUniqueConstraintTarget(
    error: Prisma.PrismaClientKnownRequestError,
  ): string[] {
    const target = error.meta?.target;

    if (Array.isArray(target)) {
      return target.map(String);
    }

    if (typeof target === 'string') {
      return [target];
    }

    return [];
  }

  // ===========================================================================
  // Aggregate Reconstruction
  // ===========================================================================

  /**
   * Rehydrates the complete Identity aggregate.
   */
  private toAggregate(record: IdentityWithRoles): IdentityAggregate {
    return IdentityPrismaMapper.toDomain(record);
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default PrismaIdentityRepository;
