// -----------------------------------------------------------------------------
// Accounting Account — Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the Accounting Account aggregate:
//
// AccountingAccountAggregate
// └── AccountingAccountEntity
//
// Persistence:
//
// AccountingAccount
//
// Accounting Account is an independent aggregate root.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - map Prisma AccountingAccount records into the domain;
// - rehydrate AccountingAccountEntity without emitting domain events;
// - map AccountingAccountEntity into Prisma persistence values;
// - map AccountingAccountAggregate into persistence;
// - preserve internal entity identity;
// - preserve public identity;
// - preserve the optional parent-account internal identity;
// - translate Prisma enum values into domain value objects;
// - translate domain value objects into Prisma enum/primitive values.
//
// -----------------------------------------------------------------------------
//
// Important:
//
// parentAccountId represents the INTERNAL identity of another Accounting
// Account aggregate.
//
// Therefore:
//
// Prisma parentAccountId
//        ↓
// UniqueEntityId
//
// It must NOT be converted into AccountingAccountPublicId.
//
// Cross-account hierarchy validation remains outside this mapper.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { AccountingAccount as PrismaAccountingAccount } from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { AccountingAccountAggregate } from '../../../../domain/aggregates/accounting-account.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { AccountingAccountEntity } from '../../../../domain/entities/accounting-account.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  AccountingAccountPublicId,
  AccountingAccountCode,
  AccountingAccountName,
  AccountingAccountType,
  AccountingAccountStatus,
} from '../../../../domain/value-objects';

// =============================================================================
// Persistence Types
// =============================================================================

/**
 * Persistence representation of the Accounting Account aggregate.
 *
 * Accounting Account is a single-entity aggregate.
 *
 * No aggregate-owned child collection is persisted through this mapper.
 *
 * Child journal lines belong to the Accounting Journal model and are therefore
 * outside the Accounting Account aggregate boundary.
 */
export interface AccountingAccountPersistence {
  account: ReturnType<
    typeof AccountingAccountPrismaMapper.accountToPersistence
  >;
}

// =============================================================================
// Mapper
// =============================================================================

export class AccountingAccountPrismaMapper {
  // ===========================================================================
  // Prisma → Domain Aggregate
  // ===========================================================================

  /**
   * Rehydrates a complete Accounting Account aggregate from a Prisma
   * AccountingAccount record.
   *
   * Rehydration does not emit domain events.
   */
  public static toDomain(
    record: PrismaAccountingAccount,
  ): AccountingAccountAggregate {
    return AccountingAccountAggregate.rehydrate(this.accountToDomain(record));
  }

  // ===========================================================================
  // Prisma → Domain Entity
  // ===========================================================================

  /**
   * Rehydrates an AccountingAccountEntity from a persisted Prisma record.
   *
   * Mapping:
   *
   * Prisma id
   *     ↓
   * UniqueEntityId
   *
   * Prisma publicId
   *     ↓
   * AccountingAccountPublicId
   *
   * Prisma code
   *     ↓
   * AccountingAccountCode
   *
   * Prisma name
   *     ↓
   * AccountingAccountName
   *
   * Prisma type
   *     ↓
   * AccountingAccountType
   *
   * Prisma status
   *     ↓
   * AccountingAccountStatus
   *
   * Prisma parentAccountId
   *     ↓
   * UniqueEntityId | undefined
   *
   * Prisma timestamps
   *     ↓
   * defensive Date values
   *
   * Rehydration does not emit domain events.
   */
  public static accountToDomain(
    record: PrismaAccountingAccount,
  ): AccountingAccountEntity {
    if (record === undefined || record === null) {
      throw new Error('Accounting Account Prisma record is required.');
    }

    // -------------------------------------------------------------------------
    // Public Identity
    // -------------------------------------------------------------------------

    const publicId = new AccountingAccountPublicId(record.publicId);

    // -------------------------------------------------------------------------
    // Parent Account Identity
    // -------------------------------------------------------------------------
    //
    // The persistence model stores the parent's INTERNAL database identity.
    //
    // The domain intentionally keeps this as UniqueEntityId.
    //
    // No parent aggregate is loaded here.
    //

    const parentAccountId =
      record.parentAccountId !== null
        ? new UniqueEntityId(record.parentAccountId)
        : undefined;

    // -------------------------------------------------------------------------
    // Domain Rehydration
    // -------------------------------------------------------------------------

    return AccountingAccountEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Classification
        // ---------------------------------------------------------------------

        code: AccountingAccountCode.create(record.code),

        name: AccountingAccountName.create(record.name),

        type: AccountingAccountType.create(record.type),

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        status: AccountingAccountStatus.create(record.status),

        // ---------------------------------------------------------------------
        // Account Hierarchy
        // ---------------------------------------------------------------------

        parentAccountId,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: new Date(record.createdAt.getTime()),

        updatedAt: new Date(record.updatedAt.getTime()),
      },

      // -----------------------------------------------------------------------
      // Entity Identity
      // -----------------------------------------------------------------------

      new UniqueEntityId(record.id),

      // -----------------------------------------------------------------------
      // Public Identity
      // -----------------------------------------------------------------------

      publicId,
    );
  }

  // ===========================================================================
  // Domain Entity → Prisma Persistence
  // ===========================================================================

  /**
   * Maps AccountingAccountEntity into its Prisma persistence shape.
   *
   * Domain value objects are serialized into primitive persistence values.
   */
  public static accountToPersistence(entity: AccountingAccountEntity): {
    id: string;
    publicId: string;
    code: string;
    name: string;
    type: PrismaAccountingAccount['type'];
    status: PrismaAccountingAccount['status'];
    parentAccountId: string | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    if (entity === undefined) {
      throw new Error('Accounting Account entity is required.');
    }

    // -------------------------------------------------------------------------
    // Persistence
    // -------------------------------------------------------------------------

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // -----------------------------------------------------------------------
      // Account Definition
      // -----------------------------------------------------------------------

      code: entity.code.value,

      name: entity.name.value,

      type: entity.type.value,

      status: entity.status.value,

      // -----------------------------------------------------------------------
      // Account Hierarchy
      // -----------------------------------------------------------------------
      //
      // parentAccountId is an INTERNAL entity identity.
      //
      // Undefined in the domain becomes null in Prisma.
      //

      parentAccountId: entity.parentAccountId?.toString() ?? null,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate → Persistence
  // ===========================================================================

  /**
   * Converts the complete Accounting Account aggregate into its persistence
   * structure.
   *
   * Accounting Account is a single-entity aggregate, so only the aggregate
   * root entity is persisted here.
   *
   * Journal lines are NOT included because they belong to the Accounting
   * Journal aggregate.
   */
  public static toPersistence(
    aggregate: AccountingAccountAggregate,
  ): AccountingAccountPersistence {
    if (aggregate === undefined) {
      throw new Error('Accounting Account aggregate is required.');
    }

    return {
      account: this.accountToPersistence(aggregate.account),
    };
  }

  // ===========================================================================
  // Component Mapping
  // ===========================================================================

  /**
   * Maps a Prisma AccountingAccount record directly into an
   * AccountingAccountEntity.
   *
   * Useful for repository-level component operations.
   */
  public static toAccountDomain(
    record: PrismaAccountingAccount,
  ): AccountingAccountEntity {
    return this.accountToDomain(record);
  }

  /**
   * Maps a Prisma AccountingAccount record into an
   * AccountingAccountAggregate.
   *
   * Equivalent to toDomain().
   */
  public static toAccountAggregate(
    record: PrismaAccountingAccount,
  ): AccountingAccountAggregate {
    return this.toDomain(record);
  }

  // ===========================================================================
  // Generic Domain Component Mapping
  // ===========================================================================

  /**
   * Maps a supported Prisma Accounting Account record into its corresponding
   * domain component.
   *
   * Accounting Account has only one aggregate-owned entity, so this resolves
   * directly to AccountingAccountEntity.
   */
  public static toDomainComponent(
    record: PrismaAccountingAccount,
  ): AccountingAccountEntity {
    return this.accountToDomain(record);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AccountingAccountPrismaMapper;
