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

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Prisma, PrismaClient } from '@prisma/client';

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

export class PrismaFinancialPaymentMethodRepository implements FinancialPaymentMethodRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(private readonly prisma: PrismaClient) {}

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
   */
  public async create(
    aggregate: FinancialPaymentMethodAggregate,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // -----------------------------------------------------------------------
      // Resolve Owning Financial Account
      // -----------------------------------------------------------------------

      const accountId = await this.resolveAccountId(tx, aggregate.accountId);

      // -----------------------------------------------------------------------
      // Map Aggregate
      // -----------------------------------------------------------------------

      const persistence =
        FinancialPaymentMethodPrismaMapper.aggregateToPersistence(aggregate);

      // -----------------------------------------------------------------------
      // Validate Account Consistency
      // -----------------------------------------------------------------------

      if (persistence.paymentMethod.accountId !== accountId) {
        throw new FinancialPaymentMethodException(
          `Financial Payment Method "${aggregate.publicId.value}" contains an inconsistent Financial Account reference.`,
        );
      }

      // -----------------------------------------------------------------------
      // Create Payment Method
      // -----------------------------------------------------------------------

      await tx.financialPaymentMethod.create({
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
    });
  }

  // ===========================================================================
  // Save
  // ===========================================================================

  /**
   * Persists the current state of an existing Financial Payment Method
   * aggregate.
   *
   * Internal identity, public identity, and owning Financial Account identity
   * are treated as stable.
   *
   * A Payment Method cannot be moved from one Financial Account to another.
   */
  public async save(aggregate: FinancialPaymentMethodAggregate): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // -----------------------------------------------------------------------
      // Load Existing Record
      // -----------------------------------------------------------------------

      const existing = await tx.financialPaymentMethod.findUnique({
        where: {
          id: aggregate.id.toString(),
        },

        select: {
          id: true,
          publicId: true,
          accountId: true,
        },
      });

      // -----------------------------------------------------------------------
      // Existence
      // -----------------------------------------------------------------------

      if (existing === null) {
        throw new FinancialPaymentMethodException(
          `Financial Payment Method "${aggregate.publicId.value}" does not exist and cannot be updated.`,
        );
      }

      // -----------------------------------------------------------------------
      // Public Identity Stability
      // -----------------------------------------------------------------------

      if (existing.publicId !== aggregate.publicId.value) {
        throw new FinancialPaymentMethodException(
          `Financial Payment Method internal identity "${aggregate.id.toString()}" is associated with a different public identity.`,
        );
      }

      // -----------------------------------------------------------------------
      // Resolve Account
      // -----------------------------------------------------------------------

      const accountId = await this.resolveAccountId(tx, aggregate.accountId);

      // -----------------------------------------------------------------------
      // Account Ownership Stability
      // -----------------------------------------------------------------------

      if (existing.accountId !== accountId) {
        throw new FinancialPaymentMethodException(
          `Financial Payment Method "${aggregate.publicId.value}" cannot be moved to another Financial Account.`,
        );
      }

      // -----------------------------------------------------------------------
      // Map Aggregate
      // -----------------------------------------------------------------------

      const persistence =
        FinancialPaymentMethodPrismaMapper.aggregateToPersistence(aggregate);

      // -----------------------------------------------------------------------
      // Update
      // -----------------------------------------------------------------------

      await tx.financialPaymentMethod.update({
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
    });
  }

  // ===========================================================================
  // Delete
  // ===========================================================================

  /**
   * Physical deletion of Financial Payment Methods is intentionally
   * unsupported.
   *
   * Financial Payment Methods are financial records and therefore must not
   * be physically deleted.
   *
   * Lifecycle removal is represented through the aggregate's deactivate()
   * operation.
   *
   * This method intentionally returns a rejected Promise without being
   * declared async, avoiding an unnecessary async function with no await.
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
   */
  private async resolveAccountId(
    prisma: PrismaClient | Prisma.TransactionClient,
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
