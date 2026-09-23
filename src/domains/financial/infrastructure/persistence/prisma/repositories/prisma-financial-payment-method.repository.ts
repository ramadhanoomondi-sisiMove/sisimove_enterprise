// -----------------------------------------------------------------------------
// Financial Payment Method Prisma Repository
// -----------------------------------------------------------------------------
//
// Persistence implementation for the Financial Payment Method aggregate.
//
// Aggregate:
//
// FinancialPaymentMethodAggregate
// └── FinancialPaymentMethodEntity
//
// Responsibilities:
//
// - Persist Financial Payment Method aggregates.
// - Rehydrate complete Financial Payment Method aggregates.
// - Resolve Financial Account public identities into internal Prisma IDs.
// - Preserve internal persistence identities.
// - Preserve public domain identities.
// - Preserve aggregate ownership.
// - Preserve provider identity.
// - Preserve provider-issued references.
// - Preserve safe display metadata.
// - Preserve lifecycle state.
// - Support aggregate queries.
// - Support entity queries.
// - Support existence queries.
// - Enforce persistence-level relational consistency.
//
// This repository does NOT:
//
// - Execute external providers.
// - Communicate with provider SDKs.
// - Register payment instruments.
// - Tokenize credentials.
// - Store raw payment credentials.
// - Execute Financial Payments.
// - Move money.
// - Modify Financial Account balances.
// - Modify sibling Payment Methods.
// - Coordinate the account-level default-method invariant.
// - Emit domain events.
// - Perform accounting.
// - Perform settlement.
//
// Domain behavior belongs to:
//
// - FinancialPaymentMethodEntity
// - FinancialPaymentMethodAggregate
//
// Mapping belongs to:
//
// - FinancialPaymentMethodPrismaMapper
//
// Persistence belongs to:
//
// - PrismaFinancialPaymentMethodRepository
//
// -----------------------------------------------------------------------------
//
// TRANSACTION PARTICIPATION:
//
// This repository does NOT create its own Prisma transactions.
//
// PrismaTransactionContext determines which Prisma client is currently
// available:
//
//     UnitOfWork
//         │
//         ▼
//     PrismaUnitOfWork
//         │
//         ▼
//     Prisma $transaction(tx)
//         │
//         ▼
//     PrismaTransactionContext
//         │
//         ▼
//     PrismaFinancialPaymentMethodRepository
//
// When called inside a UnitOfWork, all operations use the transaction-scoped
// Prisma client.
//
// When called outside a UnitOfWork, the context falls back to PrismaService.
//
// This allows Financial Payment Method persistence to participate in larger
// Financial workflows without creating independent transaction boundaries.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Transaction Context
// -----------------------------------------------------------------------------

import {
  PrismaTransactionContext,
  type PrismaClientLike,
} from '../../../../../../infrastructure/database/prisma/prisma-transaction.context';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { FinancialPaymentMethodRepository } from '../../../../domain/repositories/financial-payment-method.repository';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { FinancialPaymentMethodAggregate } from '../../../../domain/aggregates/financial-payment-method.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { FinancialPaymentMethodEntity } from '../../../../domain/entities/financial-payment-method.entity';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import {
  FinancialPaymentMethodPrismaMapper,
  type FinancialPaymentMethodWithAccount,
} from '../mappers/financial-payment-method-prisma.mapper';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

import type { FinancialAccountPublicId } from '../../../../domain/value-objects/financial-account-public-id.vo';

import type { FinancialPaymentMethodPublicId } from '../../../../domain/value-objects/financial-payment-method-public-id.vo';

import type { FinancialPaymentMethodType } from '../../../../domain/value-objects/financial-payment-method-type.vo';

import type { FinancialProvider } from '../../../../domain/value-objects/financial-provider.vo';

import type { FinancialProviderReference } from '../../../../domain/value-objects/financial-provider-reference.vo';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialPaymentMethodException } from '../../../../domain/exceptions/financial-payment-method.exception';

// =============================================================================
// Repository
// =============================================================================

/**
 * Prisma infrastructure implementation of the Financial Payment Method
 * repository.
 *
 * The repository is deliberately transaction-context aware.
 *
 * It does not create transactions itself because Financial Payment Method
 * operations may participate in larger application workflows.
 *
 * The repository translates between:
 *
 *     FinancialPaymentMethodAggregate
 *              ↕
 *     FinancialPaymentMethodPrismaMapper
 *              ↕
 *     Prisma FinancialPaymentMethod
 *
 * Financial Account ownership is represented inside the domain by its public
 * identity. The internal FinancialAccount persistence identity is resolved
 * only at the infrastructure boundary.
 */
@Injectable()
export class PrismaFinancialPaymentMethodRepository implements FinancialPaymentMethodRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  /**
   * Resolves the Prisma client through the ambient transaction context.
   *
   * Inside UnitOfWork:
   *
   *     Prisma.TransactionClient
   *
   * Outside UnitOfWork:
   *
   *     PrismaService
   *
   * This keeps the repository compatible with both ordinary application
   * queries and larger transactional workflows.
   */
  public constructor(
    private readonly transactionContext: PrismaTransactionContext,
  ) {}

  // ===========================================================================
  // Current Prisma Client
  // ===========================================================================

  /**
   * Returns the Prisma client appropriate for the current execution context.
   *
   * When a PrismaUnitOfWork is active, this returns the transaction-scoped
   * Prisma client.
   *
   * When no UnitOfWork is active, this returns the normal PrismaService-backed
   * client.
   */
  private get prisma(): PrismaClientLike {
    return this.transactionContext.getClient();
  }

  // ===========================================================================
  // Create
  // ===========================================================================

  /**
   * Persists a brand-new Financial Payment Method aggregate.
   *
   * The owning Financial Account is resolved from its public identity.
   *
   * The Financial Payment Method aggregate itself contains only one entity,
   * therefore persistence consists of one FinancialPaymentMethod record.
   *
   * No repository-owned transaction is created.
   *
   * If this method is invoked inside a UnitOfWork, the insert participates in
   * the caller's transaction.
   */
  public async create(
    aggregate: FinancialPaymentMethodAggregate,
  ): Promise<void> {
    if (aggregate === undefined) {
      throw new FinancialPaymentMethodException(
        'Financial Payment Method aggregate is required.',
      );
    }

    const accountId = await this.resolveAccountId(
      this.prisma,
      aggregate.accountId,
    );

    const persistence =
      FinancialPaymentMethodPrismaMapper.aggregateToPersistence(aggregate);

    if (persistence.paymentMethod.accountId !== accountId) {
      throw new FinancialPaymentMethodException(
        `Financial Payment Method "${aggregate.publicId.value}" contains an inconsistent Financial Account reference.`,
      );
    }

    await this.prisma.financialPaymentMethod.create({
      data: {
        id: persistence.paymentMethod.id,
        publicId: persistence.paymentMethod.publicId,
        accountId,
        type: persistence.paymentMethod.type,
        provider: persistence.paymentMethod.provider,
        providerReference: persistence.paymentMethod.providerReference,
        displayName: persistence.paymentMethod.displayName,
        lastFour: persistence.paymentMethod.lastFour,
        isDefault: persistence.paymentMethod.isDefault,
        isActive: persistence.paymentMethod.isActive,
        createdAt: persistence.paymentMethod.createdAt,
        updatedAt: persistence.paymentMethod.updatedAt,
      },
    });
  }

  // ===========================================================================
  // Save
  // ===========================================================================

  /**
   * Persists changes to an existing Financial Payment Method aggregate.
   *
   * Internal persistence identity and public identity are both protected.
   *
   * The Financial Payment Method cannot be reassigned to another Financial
   * Account through this repository.
   *
   * No repository-owned transaction is created.
   */
  public async save(aggregate: FinancialPaymentMethodAggregate): Promise<void> {
    if (aggregate === undefined) {
      throw new FinancialPaymentMethodException(
        'Financial Payment Method aggregate is required.',
      );
    }

    const existing = await this.prisma.financialPaymentMethod.findUnique({
      where: {
        id: aggregate.id.toString(),
      },
      select: {
        id: true,
        publicId: true,
        accountId: true,
      },
    });

    if (existing === null) {
      throw new FinancialPaymentMethodException(
        `Financial Payment Method "${aggregate.publicId.value}" does not exist and cannot be updated.`,
      );
    }

    if (existing.publicId !== aggregate.publicId.value) {
      throw new FinancialPaymentMethodException(
        `Financial Payment Method internal identity "${aggregate.id.toString()}" is associated with a different public identity.`,
      );
    }

    const accountId = await this.resolveAccountId(
      this.prisma,
      aggregate.accountId,
    );

    if (existing.accountId !== accountId) {
      throw new FinancialPaymentMethodException(
        `Financial Payment Method "${aggregate.publicId.value}" cannot be moved to another Financial Account.`,
      );
    }

    const persistence =
      FinancialPaymentMethodPrismaMapper.aggregateToPersistence(aggregate);

    await this.prisma.financialPaymentMethod.update({
      where: {
        id: aggregate.id.toString(),
      },
      data: {
        type: persistence.paymentMethod.type,
        provider: persistence.paymentMethod.provider,
        providerReference: persistence.paymentMethod.providerReference,
        displayName: persistence.paymentMethod.displayName,
        lastFour: persistence.paymentMethod.lastFour,
        isDefault: persistence.paymentMethod.isDefault,
        isActive: persistence.paymentMethod.isActive,
        updatedAt: persistence.paymentMethod.updatedAt,
      },
    });
  }

  // ===========================================================================
  // Delete
  // ===========================================================================

  /**
   * Financial Payment Methods are not physically deleted.
   *
   * Lifecycle state is represented through the aggregate's active state.
   */
  public delete(aggregate: FinancialPaymentMethodAggregate): Promise<void> {
    return Promise.reject(
      new FinancialPaymentMethodException(
        `Financial Payment Method "${aggregate.publicId.value}" cannot be physically deleted.`,
      ),
    );
  }

  // ===========================================================================
  // Find By Public ID
  // ===========================================================================

  /**
   * Finds and rehydrates a complete Financial Payment Method aggregate by
   * public identity.
   */
  public async findByPublicId(
    publicId: FinancialPaymentMethodPublicId,
  ): Promise<FinancialPaymentMethodAggregate | null> {
    const record = await this.prisma.financialPaymentMethod.findUnique({
      where: {
        publicId: publicId.value,
      },
      include: {
        account: true,
      },
    });

    if (record === null) {
      return null;
    }

    return FinancialPaymentMethodPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Find By Account Public ID
  // ===========================================================================

  /**
   * Finds all Financial Payment Method aggregates belonging to a Financial
   * Account identified by public identity.
   */
  public async findByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialPaymentMethodAggregate[]> {
    const accountId = await this.resolveAccountId(this.prisma, accountPublicId);

    const records = await this.prisma.financialPaymentMethod.findMany({
      where: {
        accountId,
      },
      include: {
        account: true,
      },
      orderBy: [
        {
          isDefault: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    return records.map((record) =>
      FinancialPaymentMethodPrismaMapper.toDomain(
        record as FinancialPaymentMethodWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Find Active By Account Public ID
  // ===========================================================================

  /**
   * Finds active Financial Payment Method aggregates belonging to a Financial
   * Account.
   */
  public async findActiveByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialPaymentMethodAggregate[]> {
    const accountId = await this.resolveAccountId(this.prisma, accountPublicId);

    const records = await this.prisma.financialPaymentMethod.findMany({
      where: {
        accountId,
        isActive: true,
      },
      include: {
        account: true,
      },
      orderBy: [
        {
          isDefault: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    return records.map((record) =>
      FinancialPaymentMethodPrismaMapper.toDomain(
        record as FinancialPaymentMethodWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Find Default By Account Public ID
  // ===========================================================================

  /**
   * Finds the active default Financial Payment Method for a Financial Account.
   */
  public async findDefaultByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialPaymentMethodAggregate | null> {
    const accountId = await this.resolveAccountId(this.prisma, accountPublicId);

    const record = await this.prisma.financialPaymentMethod.findFirst({
      where: {
        accountId,
        isDefault: true,
        isActive: true,
      },
      include: {
        account: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    if (record === null) {
      return null;
    }

    return FinancialPaymentMethodPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Find By Provider
  // ===========================================================================

  /**
   * Finds Financial Payment Method aggregates by provider.
   */
  public async findByProvider(
    provider: FinancialProvider,
  ): Promise<FinancialPaymentMethodAggregate[]> {
    const records = await this.prisma.financialPaymentMethod.findMany({
      where: {
        provider: provider.value,
      },
      include: {
        account: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialPaymentMethodPrismaMapper.toDomain(
        record as FinancialPaymentMethodWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Find By Account + Provider
  // ===========================================================================

  /**
   * Finds Financial Payment Method aggregates belonging to an account and
   * provider.
   */
  public async findByAccountPublicIdAndProvider(
    accountPublicId: FinancialAccountPublicId,
    provider: FinancialProvider,
  ): Promise<FinancialPaymentMethodAggregate[]> {
    const accountId = await this.resolveAccountId(this.prisma, accountPublicId);

    const records = await this.prisma.financialPaymentMethod.findMany({
      where: {
        accountId,
        provider: provider.value,
      },
      include: {
        account: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialPaymentMethodPrismaMapper.toDomain(
        record as FinancialPaymentMethodWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Find By Provider + Provider Reference
  // ===========================================================================

  /**
   * Finds a Financial Payment Method using the provider-issued reference.
   *
   * The provider reference is treated as persistence-safe provider metadata.
   */
  public async findByProviderAndProviderReference(
    provider: FinancialProvider,
    providerReference: FinancialProviderReference,
  ): Promise<FinancialPaymentMethodAggregate | null> {
    const record = await this.prisma.financialPaymentMethod.findUnique({
      where: {
        provider_providerReference: {
          provider: provider.value,
          providerReference: providerReference.value,
        },
      },
      include: {
        account: true,
      },
    });

    if (record === null) {
      return null;
    }

    return FinancialPaymentMethodPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Find By Account + Provider + Provider Reference
  // ===========================================================================

  /**
   * Finds a Financial Payment Method belonging to an account using provider
   * identity and provider-issued reference.
   */
  public async findByAccountPublicIdAndProviderAndProviderReference(
    accountPublicId: FinancialAccountPublicId,
    provider: FinancialProvider,
    providerReference: FinancialProviderReference,
  ): Promise<FinancialPaymentMethodAggregate | null> {
    const accountId = await this.resolveAccountId(this.prisma, accountPublicId);

    const record = await this.prisma.financialPaymentMethod.findFirst({
      where: {
        accountId,
        provider: provider.value,
        providerReference: providerReference.value,
      },
      include: {
        account: true,
      },
    });

    if (record === null) {
      return null;
    }

    return FinancialPaymentMethodPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Find Entity By Public ID
  // ===========================================================================

  /**
   * Finds only the Financial Payment Method entity by public identity.
   *
   * The aggregate is not rehydrated here.
   */
  public async findEntityByPublicId(
    publicId: FinancialPaymentMethodPublicId,
  ): Promise<FinancialPaymentMethodEntity | null> {
    const record = await this.prisma.financialPaymentMethod.findUnique({
      where: {
        publicId: publicId.value,
      },
      include: {
        account: true,
      },
    });

    if (record === null) {
      return null;
    }

    return FinancialPaymentMethodPrismaMapper.toEntity(record);
  }

  // ===========================================================================
  // Find Entity By Internal ID
  // ===========================================================================

  /**
   * Finds only the Financial Payment Method entity by internal persistence
   * identity.
   */
  public async findEntityById(
    id: UniqueEntityId,
  ): Promise<FinancialPaymentMethodEntity | null> {
    const record = await this.prisma.financialPaymentMethod.findUnique({
      where: {
        id: id.toString(),
      },
      include: {
        account: true,
      },
    });

    if (record === null) {
      return null;
    }

    return FinancialPaymentMethodPrismaMapper.toEntity(record);
  }

  // ===========================================================================
  // Find Entity By Account Internal ID
  // ===========================================================================

  /**
   * Finds Financial Payment Method entities belonging to an account identified
   * by internal persistence identity.
   */
  public async findEntityByAccountId(
    accountId: UniqueEntityId,
  ): Promise<FinancialPaymentMethodEntity[]> {
    const records = await this.prisma.financialPaymentMethod.findMany({
      where: {
        accountId: accountId.toString(),
      },
      include: {
        account: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialPaymentMethodPrismaMapper.toEntity(
        record as FinancialPaymentMethodWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Find By Account + Type
  // ===========================================================================

  /**
   * Finds Financial Payment Method aggregates belonging to an account and
   * payment method type.
   */
  public async findByAccountPublicIdAndType(
    accountPublicId: FinancialAccountPublicId,
    type: FinancialPaymentMethodType,
  ): Promise<FinancialPaymentMethodAggregate[]> {
    const accountId = await this.resolveAccountId(this.prisma, accountPublicId);

    const records = await this.prisma.financialPaymentMethod.findMany({
      where: {
        accountId,
        type: type.value,
      },
      include: {
        account: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialPaymentMethodPrismaMapper.toDomain(
        record as FinancialPaymentMethodWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Find Active By Account + Type
  // ===========================================================================

  /**
   * Finds active Financial Payment Method aggregates belonging to an account
   * and payment method type.
   */
  public async findActiveByAccountPublicIdAndType(
    accountPublicId: FinancialAccountPublicId,
    type: FinancialPaymentMethodType,
  ): Promise<FinancialPaymentMethodAggregate[]> {
    const accountId = await this.resolveAccountId(this.prisma, accountPublicId);

    const records = await this.prisma.financialPaymentMethod.findMany({
      where: {
        accountId,
        type: type.value,
        isActive: true,
      },
      include: {
        account: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialPaymentMethodPrismaMapper.toDomain(
        record as FinancialPaymentMethodWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Find Active
  // ===========================================================================

  /**
   * Finds all active Financial Payment Method aggregates.
   */
  public async findActive(): Promise<FinancialPaymentMethodAggregate[]> {
    const records = await this.prisma.financialPaymentMethod.findMany({
      where: {
        isActive: true,
      },
      include: {
        account: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialPaymentMethodPrismaMapper.toDomain(
        record as FinancialPaymentMethodWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Find Inactive
  // ===========================================================================

  /**
   * Finds all inactive Financial Payment Method aggregates.
   */
  public async findInactive(): Promise<FinancialPaymentMethodAggregate[]> {
    const records = await this.prisma.financialPaymentMethod.findMany({
      where: {
        isActive: false,
      },
      include: {
        account: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialPaymentMethodPrismaMapper.toDomain(
        record as FinancialPaymentMethodWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Exists By Public ID
  // ===========================================================================

  /**
   * Determines whether a Financial Payment Method exists by public identity.
   */
  public async existsByPublicId(
    publicId: FinancialPaymentMethodPublicId,
  ): Promise<boolean> {
    const record = await this.prisma.financialPaymentMethod.findUnique({
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
  // Exists By Internal ID
  // ===========================================================================

  /**
   * Determines whether a Financial Payment Method exists by internal identity.
   */
  public async existsById(id: UniqueEntityId): Promise<boolean> {
    const record = await this.prisma.financialPaymentMethod.findUnique({
      where: {
        id: id.toString(),
      },
      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Exists Active By Account
  // ===========================================================================

  /**
   * Determines whether an account has at least one active Payment Method.
   */
  public async existsActiveByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<boolean> {
    const accountId = await this.resolveAccountId(this.prisma, accountPublicId);

    const record = await this.prisma.financialPaymentMethod.findFirst({
      where: {
        accountId,
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Exists Default By Account
  // ===========================================================================

  /**
   * Determines whether an account has an active default Payment Method.
   */
  public async existsDefaultByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<boolean> {
    const accountId = await this.resolveAccountId(this.prisma, accountPublicId);

    const record = await this.prisma.financialPaymentMethod.findFirst({
      where: {
        accountId,
        isDefault: true,
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Exists By Provider + Provider Reference
  // ===========================================================================

  /**
   * Determines whether a provider-issued Payment Method reference already
   * exists.
   */
  public async existsByProviderAndProviderReference(
    provider: FinancialProvider,
    providerReference: FinancialProviderReference,
  ): Promise<boolean> {
    const record = await this.prisma.financialPaymentMethod.findUnique({
      where: {
        provider_providerReference: {
          provider: provider.value,
          providerReference: providerReference.value,
        },
      },
      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Resolve Financial Account
  // ===========================================================================

  /**
   * Resolves:
   *
   * FinancialAccountPublicId
   *          ↓
   * FinancialAccount.id
   *
   * The internal database identity never crosses into the domain.
   *
   * The Prisma client supplied here is the current ambient client. Therefore
   * account resolution participates in the same UnitOfWork when one exists.
   */
  private async resolveAccountId(
    prisma: PrismaClientLike,
    accountPublicId: FinancialAccountPublicId,
  ): Promise<string> {
    const normalized = accountPublicId.value.trim();

    if (!normalized) {
      throw new FinancialPaymentMethodException(
        'Financial Account public ID must not be empty.',
      );
    }

    const account = await prisma.financialAccount.findUnique({
      where: {
        publicId: normalized,
      },
      select: {
        id: true,
      },
    });

    if (account === null) {
      throw new FinancialPaymentMethodException(
        `Financial Account "${normalized}" does not exist.`,
      );
    }

    return account.id;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default PrismaFinancialPaymentMethodRepository;
