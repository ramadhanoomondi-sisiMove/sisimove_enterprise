import { Injectable } from '@nestjs/common';

import {
  PrismaTransactionContext,
  type PrismaClientLike,
} from '../../../../../../infrastructure/database/prisma/prisma-transaction.context';

import type { FinancialPaymentProviderRepository } from '../../../../domain/repositories/financial-payment-provider.repository';

import type { FinancialPaymentProviderAggregate } from '../../../../domain/aggregates/financial-payment-provider.aggregate';

import type { FinancialPaymentProviderEntity } from '../../../../domain/entities/financial-payment-provider.entity';

import {
  FinancialPaymentProviderPrismaMapper,
  type FinancialPaymentProviderWithCapabilities,
} from '../mappers/financial-payment-provider-prisma.mapper';

import { FinancialPaymentProviderCapabilityPrismaMapper } from '../mappers/financial-payment-provider-capability-prisma.mapper';

import type { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

import type { FinancialPaymentProviderPublicId } from '../../../../domain/value-objects/financial-payment-provider-public-id.vo';

import type { FinancialPaymentProviderCode } from '../../../../domain/value-objects/financial-payment-provider-code.vo';

import type { FinancialPaymentProviderType } from '../../../../domain/value-objects/financial-payment-provider-type.vo';

import type { FinancialPaymentProviderStatus } from '../../../../domain/value-objects/financial-payment-provider-status.vo';

import type { FinancialPaymentProviderEnvironment } from '../../../../domain/value-objects/financial-payment-provider-environment.vo';

import type { FinancialPaymentProviderCapabilityType } from '../../../../domain/value-objects/financial-payment-provider-capability-type.vo';

import { FinancialPaymentProviderException } from '../../../../domain/exceptions/financial-payment-provider.exception';

// =============================================================================
// Repository
// =============================================================================

@Injectable()
export class PrismaFinancialPaymentProviderRepository implements FinancialPaymentProviderRepository {
  public constructor(
    private readonly transactionContext: PrismaTransactionContext,
  ) {}

  // ===========================================================================
  // Transaction-Aware Prisma Client
  // ===========================================================================

  private get prisma(): PrismaClientLike {
    return this.transactionContext.getClient();
  }

  // ===========================================================================
  // Create
  // ===========================================================================

  public async create(
    aggregate: FinancialPaymentProviderAggregate,
  ): Promise<void> {
    if (aggregate === undefined) {
      throw new FinancialPaymentProviderException(
        'Financial Payment Provider aggregate is required.',
      );
    }

    const persistence =
      FinancialPaymentProviderPrismaMapper.aggregateToPersistence(aggregate);

    const provider = persistence.provider;

    // Persist the provider first so its internal ID exists before saving
    // its aggregate-owned capabilities.
    await this.prisma.financialPaymentProvider.create({
      data: {
        id: provider.id,
        publicId: provider.publicId,
        code: provider.code,
        name: provider.name,
        description: provider.description,
        type: provider.type,
        integrationStatus: provider.integrationStatus,
        environment: provider.environment,
        isEnabled: provider.isEnabled,
        configurationReference: provider.configurationReference,
        createdAt: provider.createdAt,
        updatedAt: provider.updatedAt,
      },
    });

    for (const capability of persistence.capabilities) {
      if (capability.providerId !== provider.id) {
        throw new FinancialPaymentProviderException(
          `Capability "${capability.publicId}" does not belong to provider "${provider.publicId}".`,
        );
      }

      await this.prisma.financialPaymentProviderCapability.create({
        data: {
          id: capability.id,
          publicId: capability.publicId,
          providerId: capability.providerId,
          type: capability.type,
          isSupported: capability.isSupported,
          isEnabled: capability.isEnabled,
          configurationReference: capability.configurationReference,
          createdAt: capability.createdAt,
          updatedAt: capability.updatedAt,
        },
      });
    }
  }

  // ===========================================================================
  // Save
  // ===========================================================================

  public async save(
    aggregate: FinancialPaymentProviderAggregate,
  ): Promise<void> {
    if (aggregate === undefined) {
      throw new FinancialPaymentProviderException(
        'Financial Payment Provider aggregate is required.',
      );
    }

    const existing = await this.prisma.financialPaymentProvider.findUnique({
      where: {
        id: aggregate.id.toString(),
      },
      select: {
        id: true,
        publicId: true,
      },
    });

    if (existing === null) {
      throw new FinancialPaymentProviderException(
        `Financial Payment Provider "${aggregate.publicId.value}" does not exist and cannot be updated.`,
      );
    }

    if (existing.publicId !== aggregate.publicId.value) {
      throw new FinancialPaymentProviderException(
        `Provider internal identity "${aggregate.id.toString()}" is associated with a different public identity.`,
      );
    }

    const persistence =
      FinancialPaymentProviderPrismaMapper.aggregateToPersistence(aggregate);

    const provider = persistence.provider;

    await this.prisma.financialPaymentProvider.update({
      where: {
        id: aggregate.id.toString(),
      },
      data: {
        code: provider.code,
        name: provider.name,
        description: provider.description,
        type: provider.type,
        integrationStatus: provider.integrationStatus,
        environment: provider.environment,
        isEnabled: provider.isEnabled,
        configurationReference: provider.configurationReference,
        updatedAt: provider.updatedAt,
      },
    });

    // Synchronize capabilities by their provider/type unique constraint.
    // Existing capability identities are not replaced during updates.
    for (const capability of persistence.capabilities) {
      if (capability.providerId !== provider.id) {
        throw new FinancialPaymentProviderException(
          `Capability "${capability.publicId}" does not belong to provider "${provider.publicId}".`,
        );
      }

      await this.prisma.financialPaymentProviderCapability.upsert({
        where: {
          providerId_type: {
            providerId: capability.providerId,
            type: capability.type,
          },
        },
        create: {
          id: capability.id,
          publicId: capability.publicId,
          providerId: capability.providerId,
          type: capability.type,
          isSupported: capability.isSupported,
          isEnabled: capability.isEnabled,
          configurationReference: capability.configurationReference,
          createdAt: capability.createdAt,
          updatedAt: capability.updatedAt,
        },
        update: {
          isSupported: capability.isSupported,
          isEnabled: capability.isEnabled,
          configurationReference: capability.configurationReference,
          updatedAt: capability.updatedAt,
        },
      });
    }
  }

  // ===========================================================================
  // Find By Internal ID
  // ===========================================================================

  public async findById(
    id: string,
  ): Promise<FinancialPaymentProviderAggregate | null> {
    const normalized = id.trim();

    if (!normalized) {
      throw new FinancialPaymentProviderException(
        'Financial Payment Provider internal ID must not be empty.',
      );
    }

    const record = await this.prisma.financialPaymentProvider.findUnique({
      where: {
        id: normalized,
      },
      include: {
        capabilities: true,
      },
    });

    if (record === null) {
      return null;
    }

    return FinancialPaymentProviderPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Find By Public ID
  // ===========================================================================

  public async findByPublicId(
    publicId: FinancialPaymentProviderPublicId,
  ): Promise<FinancialPaymentProviderAggregate | null> {
    const normalized = publicId.value.trim();

    if (!normalized) {
      throw new FinancialPaymentProviderException(
        'Financial Payment Provider public ID must not be empty.',
      );
    }

    const record = await this.prisma.financialPaymentProvider.findUnique({
      where: {
        publicId: normalized,
      },
      include: {
        capabilities: true,
      },
    });

    if (record === null) {
      return null;
    }

    return FinancialPaymentProviderPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Find By Code
  // ===========================================================================

  public async findByCode(
    code: FinancialPaymentProviderCode,
  ): Promise<FinancialPaymentProviderAggregate | null> {
    const normalized = code.value.trim();

    if (!normalized) {
      throw new FinancialPaymentProviderException(
        'Financial Payment Provider code must not be empty.',
      );
    }

    const record = await this.prisma.financialPaymentProvider.findUnique({
      where: {
        code: normalized,
      },
      include: {
        capabilities: true,
      },
    });

    if (record === null) {
      return null;
    }

    return FinancialPaymentProviderPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Find All
  // ===========================================================================

  public async findAll(): Promise<FinancialPaymentProviderAggregate[]> {
    const records = await this.prisma.financialPaymentProvider.findMany({
      include: {
        capabilities: true,
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
        {
          id: 'asc',
        },
      ],
    });

    return records.map((record) =>
      FinancialPaymentProviderPrismaMapper.toDomain(record),
    );
  }

  // ===========================================================================
  // Find By Type
  // ===========================================================================

  public async findByType(
    type: FinancialPaymentProviderType,
  ): Promise<FinancialPaymentProviderAggregate[]> {
    const records = await this.prisma.financialPaymentProvider.findMany({
      where: {
        type: type.value,
      },
      include: {
        capabilities: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialPaymentProviderPrismaMapper.toDomain(record),
    );
  }

  // ===========================================================================
  // Find By Integration Status
  // ===========================================================================

  public async findByStatus(
    status: FinancialPaymentProviderStatus,
  ): Promise<FinancialPaymentProviderAggregate[]> {
    const records = await this.prisma.financialPaymentProvider.findMany({
      where: {
        integrationStatus: status.value,
      },
      include: {
        capabilities: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialPaymentProviderPrismaMapper.toDomain(record),
    );
  }

  // ===========================================================================
  // Find By Environment
  // ===========================================================================

  public async findByEnvironment(
    environment: FinancialPaymentProviderEnvironment,
  ): Promise<FinancialPaymentProviderAggregate[]> {
    const records = await this.prisma.financialPaymentProvider.findMany({
      where: {
        environment: environment.value,
      },
      include: {
        capabilities: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialPaymentProviderPrismaMapper.toDomain(record),
    );
  }

  // ===========================================================================
  // Find By Capability
  // ===========================================================================

  public async findByCapability(
    capabilityType: FinancialPaymentProviderCapabilityType,
  ): Promise<FinancialPaymentProviderAggregate[]> {
    const records = await this.prisma.financialPaymentProvider.findMany({
      where: {
        capabilities: {
          some: {
            type: capabilityType.value,
          },
        },
      },
      include: {
        capabilities: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialPaymentProviderPrismaMapper.toDomain(record),
    );
  }

  // ===========================================================================
  // Find Operational By Capability
  // ===========================================================================

  public async findOperationalByCapability(
    capabilityType: FinancialPaymentProviderCapabilityType,
  ): Promise<FinancialPaymentProviderAggregate[]> {
    const records = await this.prisma.financialPaymentProvider.findMany({
      where: {
        isEnabled: true,
        integrationStatus: 'READY',
        capabilities: {
          some: {
            type: capabilityType.value,
            isSupported: true,
            isEnabled: true,
          },
        },
      },
      include: {
        capabilities: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialPaymentProviderPrismaMapper.toDomain(record),
    );
  }

  // ===========================================================================
  // Find Operational
  // ===========================================================================

  public async findOperational(): Promise<FinancialPaymentProviderAggregate[]> {
    const records = await this.prisma.financialPaymentProvider.findMany({
      where: {
        isEnabled: true,
        integrationStatus: 'READY',
      },
      include: {
        capabilities: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialPaymentProviderPrismaMapper.toDomain(record),
    );
  }

  // ===========================================================================
  // Find Not Ready
  // ===========================================================================

  public async findNotReady(): Promise<FinancialPaymentProviderAggregate[]> {
    const records = await this.prisma.financialPaymentProvider.findMany({
      where: {
        NOT: {
          integrationStatus: 'READY',
        },
      },
      include: {
        capabilities: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialPaymentProviderPrismaMapper.toDomain(record),
    );
  }

  // ===========================================================================
  // Exists By Public ID
  // ===========================================================================

  public async existsByPublicId(
    publicId: FinancialPaymentProviderPublicId,
  ): Promise<boolean> {
    const record = await this.prisma.financialPaymentProvider.findUnique({
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
  // Exists By Code
  // ===========================================================================

  public async existsByCode(
    code: FinancialPaymentProviderCode,
  ): Promise<boolean> {
    const record = await this.prisma.financialPaymentProvider.findUnique({
      where: {
        code: code.value,
      },
      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Count
  // ===========================================================================

  public async count(): Promise<number> {
    return this.prisma.financialPaymentProvider.count();
  }

  // ===========================================================================
  // Count By Status
  // ===========================================================================

  public async countByStatus(
    status: FinancialPaymentProviderStatus,
  ): Promise<number> {
    return this.prisma.financialPaymentProvider.count({
      where: {
        integrationStatus: status.value,
      },
    });
  }

  // ===========================================================================
  // Count By Type
  // ===========================================================================

  public async countByType(
    type: FinancialPaymentProviderType,
  ): Promise<number> {
    return this.prisma.financialPaymentProvider.count({
      where: {
        type: type.value,
      },
    });
  }

  // ===========================================================================
  // Find Entity By Public ID
  // ===========================================================================

  public async findEntityByPublicId(
    publicId: FinancialPaymentProviderPublicId,
  ): Promise<FinancialPaymentProviderEntity | null> {
    const record = await this.prisma.financialPaymentProvider.findUnique({
      where: {
        publicId: publicId.value,
      },
      include: {
        capabilities: true,
      },
    });

    if (record === null) {
      return null;
    }

    return FinancialPaymentProviderPrismaMapper.toEntity(record);
  }

  // ===========================================================================
  // Find Entity By Internal ID
  // ===========================================================================

  public async findEntityById(
    id: UniqueEntityId,
  ): Promise<FinancialPaymentProviderEntity | null> {
    const record = await this.prisma.financialPaymentProvider.findUnique({
      where: {
        id: id.toString(),
      },
      include: {
        capabilities: true,
      },
    });

    if (record === null) {
      return null;
    }

    return FinancialPaymentProviderPrismaMapper.toEntity(record);
  }

  // ===========================================================================
  // Delete
  // ===========================================================================

  public delete(aggregate: FinancialPaymentProviderAggregate): Promise<void> {
    return Promise.reject(
      new FinancialPaymentProviderException(
        `Financial Payment Provider "${aggregate.publicId.value}" cannot be physically deleted.`,
      ),
    );
  }
}

export default PrismaFinancialPaymentProviderRepository;
