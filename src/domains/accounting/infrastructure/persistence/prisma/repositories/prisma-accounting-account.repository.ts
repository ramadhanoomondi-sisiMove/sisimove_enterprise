// -----------------------------------------------------------------------------
// Accounting — Prisma Account Repository
// -----------------------------------------------------------------------------
//
// Prisma implementation of the AccountingAccountRepository.
//
// Aggregate:
//
// AccountingAccountAggregate
// └── AccountingAccountEntity
//
// Persistence:
//
// AccountingAccount
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Persist Accounting Account aggregates.
// - Retrieve Accounting Account aggregates.
// - Retrieve Accounting Account entities.
// - Query accounts by public identity.
// - Query accounts by internal identity.
// - Query accounts by code.
// - Query accounts by name.
// - Query accounts by type.
// - Query accounts by lifecycle status.
// - Query active accounts.
// - Query inactive accounts.
// - Query closed accounts.
// - Query usable accounts.
// - Query posting-eligible accounts.
// - Query posting-ineligible accounts.
// - Query accounts by parent account.
// - Query root accounts.
// - Query child accounts.
// - Query accounts by parent and status.
// - Query accounts by parent and type.
// - Query accounts created after/before a timestamp.
// - Query accounts updated after/before a timestamp.
// - Execute existence checks.
//
// -----------------------------------------------------------------------------
//
// This repository contains persistence concerns only.
//
// It does NOT:
//
// - Calculate account balances.
// - Create journal entries.
// - Create journal lines.
// - Post journals.
// - Reverse journals.
// - Validate journal balancing.
// - Load parent Account aggregates.
// - Validate parent Account existence.
// - Perform authorization.
// - Perform application orchestration.
// - Publish domain events.
// - Communicate with external systems.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundary:
//
// AccountingAccountAggregate
// └── AccountingAccountEntity
//
// There are no aggregate-owned child entities.
//
// -----------------------------------------------------------------------------
//
// Parent Account reference:
//
// Domain:
//
//     parentAccountId: UniqueEntityId | undefined
//
// Prisma:
//
//     parentAccountId: string | null
//
// The reference points to another AccountingAccount aggregate.
//
// This repository does NOT load the parent aggregate.
//
// Null persistence values are translated into undefined domain values by the
// mapper.
//
// -----------------------------------------------------------------------------
//
// Journal lines:
//
// AccountingAccount has a Prisma relation:
//
//     journalLines AccountingJournalLine[]
//
// This relation is intentionally NOT loaded.
//
// Journal lines belong to the AccountingJournal aggregate:
//
// AccountingJournalAggregate
// └── AccountingJournalEntryEntity[]
//     └── AccountingJournalLineEntity[]
//
// AccountingAccount only owns the account itself.
//
// -----------------------------------------------------------------------------
//
// Persistence:
//
// The repository delegates domain ↔ persistence transformation to:
//
//     AccountingAccountPrismaMapper
//
// Prisma-specific create/update operations remain in this repository.
//
// -----------------------------------------------------------------------------
//
// Domain events:
//
// Domain-event recording and publication are not repository responsibilities.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { AccountingAccount as PrismaAccountingAccount } from '@prisma/client';

import { PrismaService } from '../../../../../../infrastructure/database/prisma/prisma.service';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { AccountingAccountRepository } from '../../../../domain/repositories/accounting-account.repository';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { AccountingAccountAggregate } from '../../../../domain/aggregates/accounting-account.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { AccountingAccountEntity } from '../../../../domain/entities/accounting-account.entity';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import { AccountingAccountPrismaMapper } from '../mappers/accounting-account-prisma.mapper';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { AccountingAccountCode } from '../../../../domain/value-objects/accounting-account-code.vo';

import type { AccountingAccountName } from '../../../../domain/value-objects/accounting-account-name.vo';

import type { AccountingAccountType } from '../../../../domain/value-objects/accounting-account-type.vo';

import type { AccountingAccountStatus } from '../../../../domain/value-objects/accounting-account-status.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Repository
// =============================================================================

@Injectable()
export class PrismaAccountingAccountRepository implements AccountingAccountRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  /**
   * Prisma access is provided through the application's NestJS-managed
   * PrismaService.
   *
   * PrismaModule owns the PrismaService lifecycle and exports it to consuming
   * modules.
   */
  public constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists an Accounting Account aggregate.
   *
   * The aggregate is represented by exactly one AccountingAccountEntity, so
   * persistence requires only one Prisma record.
   */
  public async save(aggregate: AccountingAccountAggregate): Promise<void> {
    if (aggregate === undefined || aggregate === null) {
      throw new Error('Accounting Account aggregate is required.');
    }

    const persistence = AccountingAccountPrismaMapper.toPersistence(aggregate);

    await this.prisma.accountingAccount.upsert({
      where: {
        id: persistence.account.id,
      },

      create: {
        id: persistence.account.id,
        publicId: persistence.account.publicId,

        code: persistence.account.code,
        name: persistence.account.name,

        type: persistence.account.type,
        status: persistence.account.status,

        parentAccountId: persistence.account.parentAccountId,

        createdAt: persistence.account.createdAt,
        updatedAt: persistence.account.updatedAt,
      },

      update: {
        publicId: persistence.account.publicId,

        code: persistence.account.code,
        name: persistence.account.name,

        type: persistence.account.type,
        status: persistence.account.status,

        parentAccountId: persistence.account.parentAccountId,

        updatedAt: persistence.account.updatedAt,
      },
    });
  }

  /**
   * Deletes an Accounting Account aggregate.
   *
   * Prisma's Restrict relation protects accounts that are referenced by
   * journal lines or child accounts.
   */
  public async delete(aggregate: AccountingAccountAggregate): Promise<void> {
    if (aggregate === undefined || aggregate === null) {
      throw new Error('Accounting Account aggregate is required.');
    }

    await this.prisma.accountingAccount.delete({
      where: {
        id: aggregate.id.toString(),
      },
    });
  }

  // ===========================================================================
  // Aggregate Queries
  // ===========================================================================

  /**
   * Finds an Accounting Account aggregate by public identifier.
   */
  public async findByPublicId(
    publicId: AccountingAccountEntity['publicId'],
  ): Promise<AccountingAccountAggregate | null> {
    const record = await this.findRecordByPublicId(publicId.value);

    return record === null ? null : this.toAggregate(record);
  }

  /**
   * Finds an Accounting Account aggregate by internal identifier.
   */
  public async findById(
    id: UniqueEntityId,
  ): Promise<AccountingAccountAggregate | null> {
    this.ensureId(id, 'Accounting Account internal identifier is required.');

    const record = await this.prisma.accountingAccount.findUnique({
      where: {
        id: id.toString(),
      },
    });

    return record === null ? null : this.toAggregate(record);
  }

  /**
   * Finds an Accounting Account aggregate by code.
   */
  public async findByCode(
    code: AccountingAccountCode,
  ): Promise<AccountingAccountAggregate | null> {
    if (code === undefined || code === null) {
      throw new Error('Accounting Account code is required.');
    }

    const record = await this.prisma.accountingAccount.findUnique({
      where: {
        code: code.value,
      },
    });

    return record === null ? null : this.toAggregate(record);
  }

  /**
   * Finds an Accounting Account aggregate by name.
   *
   * Account name is not unique in the Prisma schema.
   *
   * Therefore findFirst is intentionally used. The oldest matching account
   * is returned to provide deterministic behaviour.
   */
  public async findByName(
    name: AccountingAccountName,
  ): Promise<AccountingAccountAggregate | null> {
    if (name === undefined || name === null) {
      throw new Error('Accounting Account name is required.');
    }

    const record = await this.prisma.accountingAccount.findFirst({
      where: {
        name: name.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return record === null ? null : this.toAggregate(record);
  }

  /**
   * Finds all accounts of a specific type.
   */
  public async findByType(
    type: AccountingAccountType,
  ): Promise<AccountingAccountAggregate[]> {
    if (type === undefined || type === null) {
      throw new Error('Accounting Account type is required.');
    }

    const records = await this.prisma.accountingAccount.findMany({
      where: {
        type: type.value,
      },

      orderBy: {
        code: 'asc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds all accounts with a specific lifecycle status.
   */
  public async findByStatus(
    status: AccountingAccountStatus,
  ): Promise<AccountingAccountAggregate[]> {
    if (status === undefined || status === null) {
      throw new Error('Accounting Account status is required.');
    }

    return this.findByStatusValue(status.value);
  }

  // ===========================================================================
  // Entity Queries
  // ===========================================================================

  /**
   * Finds an Accounting Account entity by public identifier.
   */
  public async findEntityByPublicId(
    publicId: AccountingAccountEntity['publicId'],
  ): Promise<AccountingAccountEntity | null> {
    if (publicId === undefined || publicId === null) {
      throw new Error('Accounting Account public identifier is required.');
    }

    const record = await this.findRecordByPublicId(publicId.value);

    return record === null ? null : this.toEntity(record);
  }

  /**
   * Finds an Accounting Account entity by internal identifier.
   */
  public async findEntityById(
    id: UniqueEntityId,
  ): Promise<AccountingAccountEntity | null> {
    this.ensureId(id, 'Accounting Account internal identifier is required.');

    const record = await this.prisma.accountingAccount.findUnique({
      where: {
        id: id.toString(),
      },
    });

    return record === null ? null : this.toEntity(record);
  }

  /**
   * Finds an Accounting Account entity by code.
   */
  public async findEntityByCode(
    code: AccountingAccountCode,
  ): Promise<AccountingAccountEntity | null> {
    if (code === undefined || code === null) {
      throw new Error('Accounting Account code is required.');
    }

    const record = await this.prisma.accountingAccount.findUnique({
      where: {
        code: code.value,
      },
    });

    return record === null ? null : this.toEntity(record);
  }

  /**
   * Finds an Accounting Account entity by name.
   */
  public async findEntityByName(
    name: AccountingAccountName,
  ): Promise<AccountingAccountEntity | null> {
    if (name === undefined || name === null) {
      throw new Error('Accounting Account name is required.');
    }

    const record = await this.prisma.accountingAccount.findFirst({
      where: {
        name: name.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return record === null ? null : this.toEntity(record);
  }

  // ===========================================================================
  // Status Queries
  // ===========================================================================

  /**
   * Finds all active accounts.
   */
  public async findActive(): Promise<AccountingAccountAggregate[]> {
    return this.findByStatusValue('ACTIVE');
  }

  /**
   * Finds all inactive accounts.
   */
  public async findInactive(): Promise<AccountingAccountAggregate[]> {
    return this.findByStatusValue('INACTIVE');
  }

  /**
   * Finds all closed accounts.
   */
  public async findClosed(): Promise<AccountingAccountAggregate[]> {
    return this.findByStatusValue('CLOSED');
  }

  /**
   * Finds all usable accounts.
   *
   * ACTIVE is the only lifecycle state considered usable by the aggregate.
   */
  public async findUsable(): Promise<AccountingAccountAggregate[]> {
    return this.findByStatusValue('ACTIVE');
  }

  /**
   * Finds all accounts currently eligible to receive postings.
   *
   * Posting eligibility at the Account aggregate level is represented by
   * ACTIVE status.
   *
   * The repository does not inspect:
   *
   * - journals
   * - journal entries
   * - journal lines
   * - accounting periods
   * - balances
   * - other aggregates
   */
  public async findPostingEligible(): Promise<AccountingAccountAggregate[]> {
    return this.findByStatusValue('ACTIVE');
  }

  /**
   * Finds all accounts currently ineligible to receive postings.
   *
   * Any account that is not ACTIVE is considered posting-ineligible at the
   * account lifecycle level.
   */
  public async findPostingIneligible(): Promise<AccountingAccountAggregate[]> {
    const records = await this.prisma.accountingAccount.findMany({
      where: {
        status: {
          not: 'ACTIVE',
        },
      },

      orderBy: {
        code: 'asc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Hierarchy Queries
  // ===========================================================================

  /**
   * Finds all direct children of the supplied parent account.
   */
  public async findByParentAccountId(
    parentAccountId: UniqueEntityId,
  ): Promise<AccountingAccountAggregate[]> {
    this.ensureId(
      parentAccountId,
      'Parent Accounting Account identifier is required.',
    );

    const records = await this.prisma.accountingAccount.findMany({
      where: {
        parentAccountId: parentAccountId.toString(),
      },

      orderBy: {
        code: 'asc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds all direct child entities of the supplied parent account.
   */
  public async findEntitiesByParentAccountId(
    parentAccountId: UniqueEntityId,
  ): Promise<AccountingAccountEntity[]> {
    this.ensureId(
      parentAccountId,
      'Parent Accounting Account identifier is required.',
    );

    const records = await this.prisma.accountingAccount.findMany({
      where: {
        parentAccountId: parentAccountId.toString(),
      },

      orderBy: {
        code: 'asc',
      },
    });

    return records.map((record) => this.toEntity(record));
  }

  /**
   * Finds all root accounts.
   *
   * Root accounts have no parent account.
   */
  public async findRootAccounts(): Promise<AccountingAccountAggregate[]> {
    const records = await this.prisma.accountingAccount.findMany({
      where: {
        parentAccountId: null,
      },

      orderBy: {
        code: 'asc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds all child accounts.
   *
   * Child accounts have a non-null parentAccountId.
   */
  public async findChildAccounts(): Promise<AccountingAccountAggregate[]> {
    const records = await this.prisma.accountingAccount.findMany({
      where: {
        parentAccountId: {
          not: null,
        },
      },

      orderBy: {
        code: 'asc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds all direct children with a specific status.
   */
  public async findByParentAccountIdAndStatus(
    parentAccountId: UniqueEntityId,
    status: AccountingAccountStatus,
  ): Promise<AccountingAccountAggregate[]> {
    this.ensureId(
      parentAccountId,
      'Parent Accounting Account identifier is required.',
    );

    if (status === undefined || status === null) {
      throw new Error('Accounting Account status is required.');
    }

    const records = await this.prisma.accountingAccount.findMany({
      where: {
        parentAccountId: parentAccountId.toString(),

        status: status.value,
      },

      orderBy: {
        code: 'asc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds all direct children with a specific account type.
   */
  public async findByParentAccountIdAndType(
    parentAccountId: UniqueEntityId,
    type: AccountingAccountType,
  ): Promise<AccountingAccountAggregate[]> {
    this.ensureId(
      parentAccountId,
      'Parent Accounting Account identifier is required.',
    );

    if (type === undefined || type === null) {
      throw new Error('Accounting Account type is required.');
    }

    const records = await this.prisma.accountingAccount.findMany({
      where: {
        parentAccountId: parentAccountId.toString(),

        type: type.value,
      },

      orderBy: {
        code: 'asc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Hierarchy Existence
  // ===========================================================================

  /**
   * Returns true when at least one account references the supplied account
   * as its parent.
   */
  public async existsByParentAccountId(
    parentAccountId: UniqueEntityId,
  ): Promise<boolean> {
    this.ensureId(
      parentAccountId,
      'Parent Accounting Account identifier is required.',
    );

    const record = await this.prisma.accountingAccount.findFirst({
      where: {
        parentAccountId: parentAccountId.toString(),
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Returns true when the account has no children.
   */
  public async hasNoChildren(accountId: UniqueEntityId): Promise<boolean> {
    this.ensureId(accountId, 'Accounting Account identifier is required.');

    return !(await this.existsByParentAccountId(accountId));
  }

  /**
   * Returns true when the account has at least one child.
   */
  public async hasChildren(accountId: UniqueEntityId): Promise<boolean> {
    this.ensureId(accountId, 'Accounting Account identifier is required.');

    return this.existsByParentAccountId(accountId);
  }

  // ===========================================================================
  // Audit Queries
  // ===========================================================================

  /**
   * Finds accounts created after the supplied timestamp.
   */
  public async findCreatedAfter(
    createdAfter: Date,
  ): Promise<AccountingAccountAggregate[]> {
    this.ensureDate(createdAfter, 'Created-after timestamp is required.');

    const records = await this.prisma.accountingAccount.findMany({
      where: {
        createdAt: {
          gt: createdAfter,
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds accounts created before the supplied timestamp.
   */
  public async findCreatedBefore(
    createdBefore: Date,
  ): Promise<AccountingAccountAggregate[]> {
    this.ensureDate(createdBefore, 'Created-before timestamp is required.');

    const records = await this.prisma.accountingAccount.findMany({
      where: {
        createdAt: {
          lt: createdBefore,
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds accounts updated after the supplied timestamp.
   */
  public async findUpdatedAfter(
    updatedAfter: Date,
  ): Promise<AccountingAccountAggregate[]> {
    this.ensureDate(updatedAfter, 'Updated-after timestamp is required.');

    const records = await this.prisma.accountingAccount.findMany({
      where: {
        updatedAt: {
          gt: updatedAfter,
        },
      },

      orderBy: {
        updatedAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds accounts updated before the supplied timestamp.
   */
  public async findUpdatedBefore(
    updatedBefore: Date,
  ): Promise<AccountingAccountAggregate[]> {
    this.ensureDate(updatedBefore, 'Updated-before timestamp is required.');

    const records = await this.prisma.accountingAccount.findMany({
      where: {
        updatedAt: {
          lt: updatedBefore,
        },
      },

      orderBy: {
        updatedAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds all accounts ordered by creation time.
   *
   * Ordering is newest first.
   */
  public async findAllOrderedByCreatedAt(): Promise<
    AccountingAccountAggregate[]
  > {
    const records = await this.prisma.accountingAccount.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds all accounts ordered by account code.
   *
   * Ordering is ascending.
   */
  public async findAllOrderedByCode(): Promise<AccountingAccountAggregate[]> {
    const records = await this.prisma.accountingAccount.findMany({
      orderBy: {
        code: 'asc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Existence
  // ===========================================================================

  /**
   * Checks existence by public identifier.
   */
  public async existsByPublicId(
    publicId: AccountingAccountEntity['publicId'],
  ): Promise<boolean> {
    if (publicId === undefined || publicId === null) {
      throw new Error('Accounting Account public identifier is required.');
    }

    const record = await this.prisma.accountingAccount.findUnique({
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
   * Checks existence by internal identifier.
   */
  public async existsById(id: UniqueEntityId): Promise<boolean> {
    this.ensureId(id, 'Accounting Account internal identifier is required.');

    const record = await this.prisma.accountingAccount.findUnique({
      where: {
        id: id.toString(),
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Checks existence by account code.
   */
  public async existsByCode(code: AccountingAccountCode): Promise<boolean> {
    if (code === undefined || code === null) {
      throw new Error('Accounting Account code is required.');
    }

    const record = await this.prisma.accountingAccount.findUnique({
      where: {
        code: code.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Checks existence by account name.
   *
   * Name is not unique in the Prisma schema.
   */
  public async existsByName(name: AccountingAccountName): Promise<boolean> {
    if (name === undefined || name === null) {
      throw new Error('Accounting Account name is required.');
    }

    const record = await this.prisma.accountingAccount.findFirst({
      where: {
        name: name.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Checks whether at least one account has the supplied type.
   */
  public async existsByType(type: AccountingAccountType): Promise<boolean> {
    if (type === undefined || type === null) {
      throw new Error('Accounting Account type is required.');
    }

    const record = await this.prisma.accountingAccount.findFirst({
      where: {
        type: type.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Checks whether at least one account has the supplied status.
   */
  public async existsByStatus(
    status: AccountingAccountStatus,
  ): Promise<boolean> {
    if (status === undefined || status === null) {
      throw new Error('Accounting Account status is required.');
    }

    return this.existsByStatusValue(status.value);
  }

  /**
   * Checks whether at least one active account exists.
   */
  public async existsActive(): Promise<boolean> {
    return this.existsByStatusValue('ACTIVE');
  }

  /**
   * Checks whether at least one inactive account exists.
   */
  public async existsInactive(): Promise<boolean> {
    return this.existsByStatusValue('INACTIVE');
  }

  /**
   * Checks whether at least one closed account exists.
   */
  public async existsClosed(): Promise<boolean> {
    return this.existsByStatusValue('CLOSED');
  }

  /**
   * Checks whether at least one usable account exists.
   */
  public async existsUsable(): Promise<boolean> {
    return this.existsByStatusValue('ACTIVE');
  }

  /**
   * Checks whether at least one posting-eligible account exists.
   */
  public async existsPostingEligible(): Promise<boolean> {
    return this.existsByStatusValue('ACTIVE');
  }

  /**
   * Checks whether at least one root account exists.
   */
  public async existsRootAccount(): Promise<boolean> {
    const record = await this.prisma.accountingAccount.findFirst({
      where: {
        parentAccountId: null,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Checks whether at least one child account exists.
   */
  public async existsChildAccount(): Promise<boolean> {
    const record = await this.prisma.accountingAccount.findFirst({
      where: {
        parentAccountId: {
          not: null,
        },
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Private — Prisma Queries
  // ===========================================================================

  /**
   * Finds an AccountingAccount Prisma record by public identifier.
   */
  private async findRecordByPublicId(
    publicId: string,
  ): Promise<PrismaAccountingAccount | null> {
    return this.prisma.accountingAccount.findUnique({
      where: {
        publicId,
      },
    });
  }

  // ===========================================================================
  // Private — Mapping
  // ===========================================================================

  /**
   * Converts a Prisma AccountingAccount record into an aggregate.
   *
   * No relations are loaded because AccountingAccount is a single-entity
   * aggregate.
   */
  private toAggregate(
    record: PrismaAccountingAccount,
  ): AccountingAccountAggregate {
    return AccountingAccountPrismaMapper.toDomain(record);
  }

  /**
   * Converts a Prisma AccountingAccount record into its domain entity.
   */
  private toEntity(record: PrismaAccountingAccount): AccountingAccountEntity {
    return AccountingAccountPrismaMapper.toDomainComponent(record);
  }

  // ===========================================================================
  // Private — Status Helpers
  // ===========================================================================

  /**
   * Finds accounts by persisted lifecycle status.
   */
  private async findByStatusValue(
    status: PrismaAccountingAccount['status'],
  ): Promise<AccountingAccountAggregate[]> {
    const records = await this.prisma.accountingAccount.findMany({
      where: {
        status,
      },

      orderBy: {
        code: 'asc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Checks whether at least one account exists with the supplied status.
   */
  private async existsByStatusValue(
    status: PrismaAccountingAccount['status'],
  ): Promise<boolean> {
    const record = await this.prisma.accountingAccount.findFirst({
      where: {
        status,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Private — Validation
  // ===========================================================================

  /**
   * Ensures an internal identifier is present.
   */
  private ensureId(value: UniqueEntityId, message: string): void {
    if (value === undefined || value === null) {
      throw new Error(message);
    }
  }

  /**
   * Ensures an audit timestamp is a valid Date.
   */
  private ensureDate(value: Date, message: string): void {
    if (
      value === undefined ||
      value === null ||
      !(value instanceof Date) ||
      !Number.isFinite(value.getTime())
    ) {
      throw new Error(message);
    }
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default PrismaAccountingAccountRepository;
