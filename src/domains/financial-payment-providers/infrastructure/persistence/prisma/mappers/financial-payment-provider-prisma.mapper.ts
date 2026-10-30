// -----------------------------------------------------------------------------
// Financial Payment Provider Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the complete Financial Payment Provider aggregate:
//
// FinancialPaymentProviderAggregate
// ├── FinancialPaymentProviderEntity
// └── FinancialPaymentProviderCapabilityEntity[]
//
// The mapper does not query Prisma or persist records.
// -----------------------------------------------------------------------------

import type {
  FinancialPaymentProvider as PrismaFinancialPaymentProvider,
  FinancialPaymentProviderCapability as PrismaFinancialPaymentProviderCapability,
  FinancialPaymentProviderType as PrismaProviderType,
  FinancialPaymentProviderIntegrationStatus as PrismaProviderStatus,
  FinancialPaymentProviderEnvironment as PrismaProviderEnvironment,
} from '@prisma/client';

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

import { FinancialPaymentProviderAggregate } from '../../../../domain/aggregates/financial-payment-provider.aggregate';

import { FinancialPaymentProviderEntity } from '../../../../domain/entities/financial-payment-provider.entity';

import { FinancialPaymentProviderCapabilityPrismaMapper } from './financial-payment-provider-capability-prisma.mapper';

import {
  FinancialPaymentProviderPublicId,
  FinancialPaymentProviderCode,
  FinancialPaymentProviderName,
  FinancialPaymentProviderType,
  FinancialPaymentProviderStatus,
  FinancialPaymentProviderEnvironment,
  FinancialPaymentProviderConfigurationReference,
  FinancialPaymentProviderStatusValue,
} from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Prisma Graph
// -----------------------------------------------------------------------------

export type FinancialPaymentProviderWithCapabilities =
  PrismaFinancialPaymentProvider & {
    capabilities: PrismaFinancialPaymentProviderCapability[];
  };

// -----------------------------------------------------------------------------
// Persistence Shape
// -----------------------------------------------------------------------------

export interface FinancialPaymentProviderPersistence {
  provider: ReturnType<
    typeof FinancialPaymentProviderPrismaMapper.toPersistence
  >;
  capabilities: ReturnType<
    typeof FinancialPaymentProviderCapabilityPrismaMapper.toPersistence
  >[];
}

// -----------------------------------------------------------------------------
// Enum Conversion — Prisma to Domain
// -----------------------------------------------------------------------------

function toDomainType(value: PrismaProviderType) {
  switch (value) {
    case 'MOBILE_MONEY':
    case 'BANK':
    case 'CARD_PROCESSOR':
    case 'PAYMENT_GATEWAY':
    case 'DIGITAL_WALLET':
    case 'OTHER':
      return FinancialPaymentProviderType.create(value);
    default:
      throw new Error(
        `Invalid persisted payment provider type: ${String(value)}`,
      );
  }
}

function toDomainStatus(
  value: PrismaProviderStatus,
): FinancialPaymentProviderStatus {
  switch (value) {
    case 'NOT_CONFIGURED':
      return FinancialPaymentProviderStatus.create(
        FinancialPaymentProviderStatusValue.NOT_CONFIGURED,
      );

    case 'CONFIGURING':
      return FinancialPaymentProviderStatus.create(
        FinancialPaymentProviderStatusValue.CONFIGURING,
      );

    case 'READY':
      return FinancialPaymentProviderStatus.create(
        FinancialPaymentProviderStatusValue.READY,
      );

    case 'DEGRADED':
      return FinancialPaymentProviderStatus.create(
        FinancialPaymentProviderStatusValue.DEGRADED,
      );

    case 'SUSPENDED':
      return FinancialPaymentProviderStatus.create(
        FinancialPaymentProviderStatusValue.SUSPENDED,
      );

    default:
      throw new Error(
        `Invalid persisted payment provider status: ${String(value)}`,
      );
  }
}

function toDomainEnvironment(value: PrismaProviderEnvironment) {
  switch (value) {
    case 'SANDBOX':
    case 'PRODUCTION':
      return FinancialPaymentProviderEnvironment.create(value);
    default:
      throw new Error(
        `Invalid persisted payment provider environment: ${String(value)}`,
      );
  }
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export class FinancialPaymentProviderPrismaMapper {
  // ===========================================================================
  // Prisma to Aggregate
  // ===========================================================================

  public static toDomain(
    record: FinancialPaymentProviderWithCapabilities,
  ): FinancialPaymentProviderAggregate {
    const provider = this.toEntity(record);

    return FinancialPaymentProviderAggregate.rehydrate(provider);
  }

  // ===========================================================================
  // Prisma to Entity
  // ===========================================================================

  public static toEntity(
    record: FinancialPaymentProviderWithCapabilities,
  ): FinancialPaymentProviderEntity {
    const capabilities = record.capabilities.map((capability) =>
      FinancialPaymentProviderCapabilityPrismaMapper.toDomain(capability),
    );

    return FinancialPaymentProviderEntity.rehydrate(
      {
        code: FinancialPaymentProviderCode.create(record.code),
        name: FinancialPaymentProviderName.create(record.name),
        description: record.description ?? undefined,
        type: toDomainType(record.type),
        integrationStatus: toDomainStatus(record.integrationStatus),
        environment: toDomainEnvironment(record.environment),
        isEnabled: record.isEnabled,
        configurationReference:
          record.configurationReference === null
            ? undefined
            : FinancialPaymentProviderConfigurationReference.create(
                record.configurationReference,
              ),
        capabilities,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },
      new UniqueEntityId(record.id),
      new FinancialPaymentProviderPublicId(record.publicId),
    );
  }

  // ===========================================================================
  // Entity to Persistence
  // ===========================================================================

  public static toPersistence(entity: FinancialPaymentProviderEntity): {
    id: string;
    publicId: string;
    code: string;
    name: string;
    description: string | null;
    type: PrismaProviderType;
    integrationStatus: PrismaProviderStatus;
    environment: PrismaProviderEnvironment;
    isEnabled: boolean;
    configurationReference: string | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: entity.id.toString(),
      publicId: entity.publicId.value,
      code: entity.code.value,
      name: entity.name.value,
      description: entity.description ?? null,
      type: entity.type.value,
      integrationStatus: entity.integrationStatus.value,
      environment: entity.environment.value,
      isEnabled: entity.isEnabled,
      configurationReference: entity.configurationReference?.value ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate to Persistence
  // ===========================================================================

  public static aggregateToPersistence(
    aggregate: FinancialPaymentProviderAggregate,
  ): FinancialPaymentProviderPersistence {
    return {
      provider: this.toPersistence(aggregate.provider),
      capabilities: aggregate.capabilities.map((capability) =>
        FinancialPaymentProviderCapabilityPrismaMapper.toPersistence(
          capability,
        ),
      ),
    };
  }
}
